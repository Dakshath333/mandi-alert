const Alert = require('../models/Alert');
const Farmer = require('../models/Farmer');
const MarketPrice = require('../models/MarketPrice');
const { sendSMS } = require('../services/smsService');

const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find()
      .populate('farmerId', 'name phone crop location')
      .sort({ sentAt: -1 }).limit(100);
    res.json({ success: true, count: alerts.length, data: alerts });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const getFarmerAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ farmerId: req.params.farmerId }).sort({ sentAt: -1 });
    res.json({ success: true, data: alerts });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const triggerAlerts = async (req, res) => {
  try {
    const farmers = await Farmer.find();
    const results = [];
    for (const farmer of farmers) {
      const prices = await MarketPrice.aggregate([
        { $match: { crop: new RegExp(farmer.crop, 'i') } },
        { $sort: { date: -1 } },
        { $group: {
          _id: '$mandi',
          mandi: { $first: '$mandi' }, district: { $first: '$district' },
          state: { $first: '$state' }, crop: { $first: '$crop' },
          modalPrice: { $first: '$modalPrice' }, arrivals: { $first: '$arrivals' },
        }},
        { $sort: { modalPrice: -1 } },
      ]);
      if (!prices.length) continue;
      const best = prices[0];
      const message = `🌾 MandiAlert: Best price for ${best.crop} is ₹${best.price}/qtl at ${best.mandi}, ${best.district}. Arrivals: ${best.arrivals} tonnes. Sell now for max profit!`;
      const smsResult = await sendSMS(farmer.phone, message);
      const alert = await Alert.create({
        farmerId: farmer._id, message,
        crop: best.crop, mandi: best.mandi,
        price: best.modalPrice,
        status: smsResult.success ? 'sent' : 'simulated',
      });
      results.push({ farmer: farmer.name, phone: farmer.phone, status: alert.status });
    }
    res.json({ success: true, message: `Alerts processed for ${results.length} farmers`, results });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

module.exports = { getAlerts, getFarmerAlerts, triggerAlerts };
