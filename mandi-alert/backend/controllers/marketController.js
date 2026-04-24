const MarketPrice = require('../models/MarketPrice');

/** Add a new market price entry — POST /api/market/add */
const addMarketPrice = async (req, res) => {
  try {
    const entry = new MarketPrice(req.body);
    await entry.save();
    res.status(201).json({ success: true, message: 'Market price added', data: entry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get market prices with filters — GET /api/market/prices
 * Query params: state, district, mandi, crop, variety, date
 */
const getMarketPrices = async (req, res) => {
  try {
    const { state, district, mandi, crop, variety, date } = req.query;
    const filter = {};
    if (state)   filter.state    = new RegExp(state, 'i');
    if (district) filter.district = new RegExp(district, 'i');
    if (mandi)   filter.mandi    = new RegExp(mandi, 'i');
    if (crop)    filter.crop     = new RegExp(crop, 'i');
    if (variety) filter.variety  = new RegExp(variety, 'i');
    if (date) {
      const d = new Date(date);
      const next = new Date(d); next.setDate(next.getDate() + 1);
      filter.date = { $gte: d, $lt: next };
    }
    const prices = await MarketPrice.find(filter).sort({ date: -1 }).limit(500);
    res.json({ success: true, count: prices.length, data: prices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** Compare modal prices for a crop across mandis — GET /api/market/compare?crop=Tomato&state=Karnataka */
const comparePrices = async (req, res) => {
  try {
    const { crop, state } = req.query;
    if (!crop) return res.status(400).json({ success: false, message: 'Crop name required' });

    const matchStage = { crop: new RegExp(crop, 'i') };
    if (state) matchStage.state = new RegExp(state, 'i');

    const prices = await MarketPrice.aggregate([
      { $match: matchStage },
      { $sort: { date: -1 } },
      {
        $group: {
          _id: '$mandi',
          mandi: { $first: '$mandi' },
          district: { $first: '$district' },
          state: { $first: '$state' },
          crop: { $first: '$crop' },
          variety: { $first: '$variety' },
          modalPrice: { $first: '$modalPrice' },
          minPrice: { $first: '$minPrice' },
          maxPrice: { $first: '$maxPrice' },
          arrivals: { $first: '$arrivals' },
          date: { $first: '$date' },
        },
      },
      { $sort: { modalPrice: -1 } },
    ]);

    res.json({ success: true, crop, bestMandi: prices[0] || null, allMandis: prices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** Distinct filter options for dropdowns — GET /api/market/filters */
const getFilters = async (req, res) => {
  try {
    const [states, crops, varieties] = await Promise.all([
      MarketPrice.distinct('state'),
      MarketPrice.distinct('crop'),
      MarketPrice.distinct('variety'),
    ]);
    res.json({ success: true, data: { states, crops, varieties } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** Get districts for a given state — GET /api/market/districts?state=Karnataka */
const getDistricts = async (req, res) => {
  try {
    const { state } = req.query;
    const filter = state ? { state: new RegExp(state, 'i') } : {};
    const districts = await MarketPrice.distinct('district', filter);
    res.json({ success: true, data: districts.sort() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** Get mandis for a given district — GET /api/market/mandis?district=Mysore */
const getMandis = async (req, res) => {
  try {
    const { district, state } = req.query;
    const filter = {};
    if (district) filter.district = new RegExp(district, 'i');
    if (state) filter.state = new RegExp(state, 'i');
    const mandis = await MarketPrice.distinct('mandi', filter);
    res.json({ success: true, data: mandis.sort() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** Update price entry — PUT /api/market/:id */
const updateMarketPrice = async (req, res) => {
  try {
    const updated = await MarketPrice.findByIdAndUpdate(
      req.params.id, { ...req.body, date: new Date() }, { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Entry not found' });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addMarketPrice, getMarketPrices, comparePrices, getFilters, getDistricts, getMandis, updateMarketPrice };
