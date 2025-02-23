const express = require('express');
const router = express.Router();
const { getTrains, createTrain, updateTrain, deleteTrain } = require('../controllers/trainController');
const { check } = require('express-validator');
const { adminAuth } = require('../middleware/authMiddleware');

// Public: Get all trains
router.get('/', getTrains);

// Admin: Create a new train
router.post(
  '/',
  adminAuth,
  [
    check('trainNumber', 'Train Number is required').not().isEmpty(),
    check('trainName', 'Train Name is required').not().isEmpty(),
    check('source', 'Source is required').not().isEmpty(),
    check('destination', 'Destination is required').not().isEmpty(),
    check('departureTime', 'Departure Time is required').not().isEmpty(),
    check('arrivalTime', 'Arrival Time is required').not().isEmpty(),
    check('basePrice', 'Base Price is required and must be a number').isNumeric(),
    check('totalSeats', 'Total Seats is required and must be a number').isNumeric()
  ],
  createTrain
);

// Admin: Update a train
router.put('/:id', adminAuth, updateTrain);

// Admin: Delete a train
router.delete('/:id', adminAuth, deleteTrain);

module.exports = router;
