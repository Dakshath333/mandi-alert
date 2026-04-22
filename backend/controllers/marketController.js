const MarketPrice = require('../models/MarketPrice');

/**
 * Add a new market price entry
 * POST /api/market/add
 */
const addMarketPrice = async (req, res) => {
  try {
    const { crop, mandi, location, price } = req.body;
    const marketPrice = new MarketPrice({ crop, mandi, location, price });
    await marketPrice.save();

    res.status(201).json({
      success: true,
      message: 'Market price added successfully',
      data: marketPrice,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get all market prices (latest per crop+mandi)
 * GET /api/market/prices
 */
const getMarketPrices = async (req, res) => {
  try {
    const { crop, location } = req.query;
    const filter = {};
    if (crop) filter.crop = new RegExp(crop, 'i');
    if (location) filter.location = new RegExp(location, 'i');

    const prices = await MarketPrice.find(filter).sort({ date: -1 }).limit(100);
    res.json({ success: true, count: prices.length, data: prices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Compare prices for a crop across all mandis
 * GET /api/market/compare?crop=Tomato
 */
const comparePrices = async (req, res) => {
  try {
    const { crop } = req.query;
    if (!crop) return res.status(400).json({ success: false, message: 'Crop name required' });

    // Get the latest price per mandi for the given crop
    const prices = await MarketPrice.aggregate([
      { $match: { crop: new RegExp(crop, 'i') } },
      { $sort: { date: -1 } },
      {
        $group: {
          _id: '$mandi',
          mandi: { $first: '$mandi' },
          location: { $first: '$location' },
          price: { $first: '$price' },
          date: { $first: '$date' },
          crop: { $first: '$crop' },
        },
      },
      { $sort: { price: -1 } }, // Highest price first = best for farmer
    ]);

    const best = prices[0] || null;

    res.json({
      success: true,
      crop,
      bestMandi: best,
      allMandis: prices,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get unique crops available in the system
 * GET /api/market/crops
 */
const getAvailableCrops = async (req, res) => {
  try {
    const crops = await MarketPrice.distinct('crop');
    res.json({ success: true, data: crops });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update an existing price entry
 * PUT /api/market/:id
 */
const updateMarketPrice = async (req, res) => {
  try {
    const { price } = req.body;
    const updated = await MarketPrice.findByIdAndUpdate(
      req.params.id,
      { price, date: new Date() },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Price entry not found' });
    res.json({ success: true, message: 'Price updated', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addMarketPrice, getMarketPrices, comparePrices, getAvailableCrops, updateMarketPrice };
