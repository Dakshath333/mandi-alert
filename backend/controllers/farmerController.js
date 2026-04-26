const Farmer = require('../models/Farmer');

// Register a new farmer
const registerFarmer = async (req, res) => {
  try {
    const { name, phone, crop, location } = req.body;
    const existing = await Farmer.findOne({ phone });
    if (existing) {
      return res.status(400).json({ success: false, message: 'This mobile number is already registered. Please login instead.' });
    }
    const farmer = new Farmer({ name, phone, crop, location });
    await farmer.save();
    res.status(201).json({ success: true, message: 'Registration successful!', data: farmer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login by phone number
const loginFarmer = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: 'Mobile number is required.' });
    const farmer = await Farmer.findOne({ phone });
    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Mobile number not registered. Please register first.' });
    }
    res.json({ success: true, message: 'Login successful!', data: farmer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all farmers
const getFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find().sort({ createdAt: -1 });
    res.json({ success: true, count: farmers.length, data: farmers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get farmer by ID
const getFarmerById = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found' });
    res.json({ success: true, data: farmer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update farmer preferences
const updateFarmer = async (req, res) => {
  try {
    const { crop, location } = req.body;
    const farmer = await Farmer.findByIdAndUpdate(req.params.id, { crop, location }, { new: true });
    if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found' });
    res.json({ success: true, message: 'Updated successfully', data: farmer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { registerFarmer, loginFarmer, getFarmers, getFarmerById, updateFarmer };
