const express = require('express');
const router = express.Router();
const { createBooking, getBookings, cancelBooking } = require('../controllers/bookingController');

// Create a new booking
router.post('/', createBooking);

// Get all bookings (for customer, could be filtered by user)
router.get('/', getBookings);

// Cancel a booking
router.put('/:id/cancel', cancelBooking);

module.exports = router;
    