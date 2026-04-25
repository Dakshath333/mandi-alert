const Farmer = require('../models/Farmer');

/**
 * Register a new farmer
 * POST /api/farmers/register
 */
const registerFarmer = async (req, res) => {
  try {
    const { name, phone, crop, location } = req.body;

    // Check if farmer already registered with same phone
    const existing = await Farmer.findOne({ phone });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Phone number already registered' });
    }

    const farmer = new Farmer({ name, phone, crop, location });
    await farmer.save();

    res.status(201).json({
      success: true,
      message: 'Farmer registered successfully!',
      data: farmer,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get all farmers
 * GET /api/farmers
 */
const getFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find().sort({ createdAt: -1 });
    res.json({ success: true, count: farmers.length, data: farmers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get farmer by ID
 * GET /api/farmers/:id
 */
const getFarmerById = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found' });
    res.json({ success: true, data: farmer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update farmer preferences
 * PUT /api/farmers/:id
 */
const updateFarmer = async (req, res) => {
  try {
    const { crop, location } = req.body;
    const farmer = await Farmer.findByIdAndUpdate(
      req.params.id,
      { crop, location },
      { new: true, runValidators: true }
    );
    if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found' });
    res.json({ success: true, message: 'Preferences updated', data: farmer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { registerFarmer, getFarmers, getFarmerById, updateFarmer };
