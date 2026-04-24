const mongoose = require('mongoose');

/**
 * MarketPrice Model
 * Stores mandi crop prices by location
 */
const marketPriceSchema = new mongoose.Schema({
  crop: {
    type: String,
    required: [true, 'Crop name is required'],
    trim: true,
  },
  mandi: {
    type: String,
    required: [true, 'Mandi name is required'],
    trim: true,
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
  },
  // Price in INR per quintal (100 kg)
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Index for fast queries by crop + location
marketPriceSchema.index({ crop: 1, location: 1, date: -1 });

module.exports = mongoose.model('MarketPrice', marketPriceSchema);
