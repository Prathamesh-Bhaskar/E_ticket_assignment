const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  pnr: { type: String, unique: true, required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // if auth implemented
  train: { type: mongoose.Schema.Types.ObjectId, ref: 'Train', required: true },
  passengers: [
    {
      name: { type: String, required: true },
      age: { type: Number, required: true },
      gender: { type: String, required: true },
      seatNumber: { type: String }
    }
  ],
  bookingDate: { type: Date, default: Date.now },
  status: { type: String, default: 'confirmed' },
  totalFare: { type: Number, required: true }
});

module.exports = mongoose.model('Booking', bookingSchema);
