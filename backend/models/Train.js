const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema({
  trainNumber: { type: String, required: true, unique: true },
  trainName: { type: String, required: true },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  frequency: { type: String, default: 'daily' },
  basePrice: { type: Number, required: true },
  totalSeats: { type: Number, required: true },
  status: { type: String, default: 'active' }
});

module.exports = mongoose.model('Train', trainSchema);
