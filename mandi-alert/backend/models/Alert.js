const mongoose = require('mongoose');

/**
 * Alert Model
 * Stores sent SMS alerts for audit and history
 */
const alertSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  crop: {
    type: String,
    required: true,
  },
  mandi: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
  // Track delivery status
  status: {
    type: String,
    enum: ['sent', 'failed', 'simulated'],
    default: 'simulated',
  },
});

module.exports = mongoose.model('Alert', alertSchema);
