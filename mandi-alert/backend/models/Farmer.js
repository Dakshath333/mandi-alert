const mongoose = require('mongoose');

/**
 * Farmer Model
 * Stores farmer registration details and preferences
 */
const farmerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true,
  },
  // Preferred crop they grow/sell
  crop: {
    type: String,
    required: [true, 'Crop preference is required'],
    trim: true,
  },
  // Farmer's home location / nearest mandi district
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Farmer', farmerSchema);
