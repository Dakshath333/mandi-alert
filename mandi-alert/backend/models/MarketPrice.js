const mongoose = require('mongoose');

/**
 * MarketPrice Model — AG Market style
 * Stores full mandi price data per commodity per day
 */
const marketPriceSchema = new mongoose.Schema({
  state: { type: String, required: true, trim: true },
  district: { type: String, required: true, trim: true },
  mandi: { type: String, required: true, trim: true },
  crop: { type: String, required: true, trim: true },
  variety: { type: String, default: 'General', trim: true },
  // Arrival quantity in tonnes
  arrivals: { type: Number, default: 0 },
  // All prices in ₹ per quintal
  minPrice: { type: Number, required: true, min: 0 },
  maxPrice: { type: Number, required: true, min: 0 },
  // Modal price = most common traded price (most important for farmers)
  modalPrice: { type: Number, required: true, min: 0 },
  date: { type: Date, default: Date.now },
});

marketPriceSchema.index({ crop: 1, state: 1, district: 1, date: -1 });
marketPriceSchema.index({ date: -1 });

module.exports = mongoose.model('MarketPrice', marketPriceSchema);
