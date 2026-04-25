const Alert = require('../models/Alert');
const Farmer = require('../models/Farmer');
const MarketPrice = require('../models/MarketPrice');
const { sendSMS } = require('../services/smsService');

/**
 * Get all alerts (with farmer details)
 * GET /api/alerts
 */
const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find()
      .populate('farmerId', 'name phone crop location')
      .sort({ sentAt: -1 })
      .limit(100);
    res.json({ success: true, count: alerts.length, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get alerts for a specific farmer
 * GET /api/alerts/farmer/:farmerId
 */
const getFarmerAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ farmerId: req.params.farmerId }).sort({ sentAt: -1 });
    res.json({ success: true, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Manually trigger alerts for all farmers (Admin action)
 * POST /api/alerts/trigger
 */
const triggerAlerts = async (req, res) => {
  try {
    const farmers = await Farmer.find();
    const results = [];

    for (const farmer of farmers) {
      // Get best mandi price for the farmer's crop
      const prices = await MarketPrice.aggregate([
        { $match: { crop: new RegExp(farmer.crop, 'i') } },
        { $sort: { date: -1 } },
        {
          $group: {
            _id: '$mandi',
            mandi: { $first: '$mandi' },
            location: { $first: '$location' },
            price: { $first: '$price' },
            crop: { $first: '$crop' },
          },
        },
        { $sort: { price: -1 } },
      ]);

      if (prices.length === 0) continue;

      const best = prices[0];
      const message = `🌾 Mandi Alert: Best price for ${best.crop} is ₹${best.price}/quintal at ${best.mandi} Mandi (${best.location}). Sell now for maximum profit!`;

      // Try sending real SMS or fallback to simulation
      const smsResult = await sendSMS(farmer.phone, message);

      // Save alert record
      const alert = new Alert({
        farmerId: farmer._id,
        message,
        crop: best.crop,
        mandi: best.mandi,
        price: best.price,
        status: smsResult.success ? 'sent' : 'simulated',
      });
      await alert.save();

      results.push({
        farmer: farmer.name,
        phone: farmer.phone,
        message,
        status: smsResult.success ? 'sent' : 'simulated',
      });
    }

    res.json({
      success: true,
      message: `Alerts processed for ${results.length} farmers`,
      results,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAlerts, getFarmerAlerts, triggerAlerts };
