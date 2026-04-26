const Farmer = require('../models/Farmer');
const MarketPrice = require('../models/MarketPrice');
const Alert = require('../models/Alert');

/**
 * Admin dashboard stats
 * GET /api/admin/stats
 */
const getStats = async (req, res) => {
  try {
    const [totalFarmers, totalMarkets, totalAlerts, recentFarmers] = await Promise.all([
      Farmer.countDocuments(),
      MarketPrice.distinct('mandi').then(m => m.length),
      Alert.countDocuments(),
      Farmer.find().sort({ createdAt: -1 }).limit(10),
    ]);

    // Count alerts by status
    const alertStats = await Alert.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Top crops by farmer preference
    const topCrops = await Farmer.aggregate([
      { $group: { _id: '$crop', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      data: {
        totalFarmers,
        totalMarkets,
        totalAlerts,
        alertStats,
        topCrops,
        recentFarmers,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Seed sample market data for demo purposes
 * POST /api/admin/seed
 */
const seedSampleData = async (req, res) => {
  try {
    const samplePrices = [
      { crop: 'Tomato', mandi: 'Mysore', location: 'Mysore', price: 2800 },
      { crop: 'Tomato', mandi: 'Bangalore', location: 'Bangalore', price: 3200 },
      { crop: 'Tomato', mandi: 'Hubli', location: 'Hubli', price: 2600 },
      { crop: 'Onion', mandi: 'Mysore', location: 'Mysore', price: 1800 },
      { crop: 'Onion', mandi: 'Bangalore', location: 'Bangalore', price: 2100 },
      { crop: 'Onion', mandi: 'Davangere', location: 'Davangere', price: 1950 },
      { crop: 'Potato', mandi: 'Hassan', location: 'Hassan', price: 1500 },
      { crop: 'Potato', mandi: 'Bangalore', location: 'Bangalore', price: 1750 },
      { crop: 'Maize', mandi: 'Shivamogga', location: 'Shivamogga', price: 2200 },
      { crop: 'Maize', mandi: 'Hubli', location: 'Hubli', price: 2050 },
      { crop: 'Rice', mandi: 'Shivamogga', location: 'Shivamogga', price: 3800 },
      { crop: 'Rice', mandi: 'Mysore', location: 'Mysore', price: 3650 },
      { crop: 'Sugarcane', mandi: 'Mandya', location: 'Mandya', price: 3500 },
      { crop: 'Ragi', mandi: 'Tumkur', location: 'Tumkur', price: 3300 },
      { crop: 'Groundnut', mandi: 'Chitradurga', location: 'Chitradurga', price: 5200 },
    ];

    await MarketPrice.insertMany(samplePrices);

    res.json({ success: true, message: `Seeded ${samplePrices.length} market price entries` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getStats, seedSampleData };
