# Week 3 Exercise: Building a Ride-Hailing REST API with Express.js
# Objective: Scaffold a Node.js/Express API with CRUD endpoints for managing rides and drivers in a ride-sharing system.

# Install dependencies:
# npm install express mongoose

# Run the server:
# node index.js

const express = require('express');
const mongoose = require('mongoose');
const Ride = require('./models/Ride');

const app = express();
app.use(express.json());

# Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ridesdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

# API Endpoints:

# POST /rides — Create a new ride
app.post('/rides', async (req, res) => {
  try {
    const newRide = new Ride(req.body);
    const savedRide = await newRide.save();
    res.status(201).json(savedRide);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

# GET /rides — Fetch all rides
app.get('/rides', async (req, res) => {
  const rides = await Ride.find();
  res.json(rides);
});

# PUT /rides/:rideId — Update ride status
app.put('/rides/:rideId', async (req, res) => {
  try {
    const updatedRide = await Ride.findByIdAndUpdate(
      req.params.rideId,
      { status: req.body.status },
      { new: true }
    );

    if (!updatedRide) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    res.json(updatedRide);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

# DELETE /rides/:rideId — Delete a ride
app.delete('/rides/:rideId', async (req, res) => {
  try {
    const deletedRide = await Ride.findByIdAndDelete(req.params.rideId);

    if (!deletedRide) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    res.json({ message: 'Ride cancelled successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

# Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
