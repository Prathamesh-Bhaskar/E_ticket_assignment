const Train = require('../models/Train');
const { validationResult } = require('express-validator');

// GET /api/trains
exports.getTrains = async (req, res) => {
  try {
    const trains = await Train.find({});
    res.json(trains);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// POST /api/trains (Admin only)
exports.createTrain = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const newTrain = new Train(req.body);
    const savedTrain = await newTrain.save();
    res.status(201).json(savedTrain);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// PUT /api/trains/:id (Admin only)
exports.updateTrain = async (req, res) => {
  try {
    const updatedTrain = await Train.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTrain);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// DELETE /api/trains/:id (Admin only)
exports.deleteTrain = async (req, res) => {
  try {
    await Train.findByIdAndDelete(req.params.id);
    res.json({ message: 'Train deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
