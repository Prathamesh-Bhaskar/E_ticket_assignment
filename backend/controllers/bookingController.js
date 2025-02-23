const Booking = require('../models/Booking');
const Train = require('../models/Train');

// POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    // In a real application, generate a unique PNR number
    const pnr = 'PNR' + Date.now();
    const { trainId, passengers, totalFare } = req.body;

    const train = await Train.findById(trainId);
    if (!train) {
      return res.status(404).json({ message: 'Train not found' });
    }

    const newBooking = new Booking({
      pnr,
      train: train._id,
      passengers,
      totalFare
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// GET /api/bookings (for a specific customer)
exports.getBookings = async (req, res) => {
  try {
    // If authentication is implemented, filter by req.user.id
    const bookings = await Booking.find({}).populate('train');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// PUT /api/bookings/:id/cancel
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
