const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ride_hailing_system', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Models for User and Ride (use the same schemas from your MongoDB setup)
const User = mongoose.model('User', new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  isBlocked: Boolean
}));

const Ride = mongoose.model('Ride', new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  pickupLocation: { lat: Number, lng: Number },
  destination: { lat: Number, lng: Number },
  status: { type: String, enum: ['requested', 'in_progress', 'completed'] },
  fare: Number,
  customerReview: Number
}));

// Middleware
app.use(express.json());

// Define the API endpoint to get passengers' statistics
app.get('/analytics/passengers', async (req, res) => {
  try {
    const pipeline = [
      {
        $lookup: {
          from: "rides",
          localField: "_id",
          foreignField: "customerId",
          as: "rides"
        }
      },
      {
        $unwind: "$rides"
      },
      {
        $group: {
          _id: "$_id",
          totalRides: { $sum: 1 },
          totalFare: { $sum: "$rides.fare" },
          avgDistance: { $avg: "$rides.distance" }
        }
      },
      {
        $project: {
          name: 1,
          totalRides: 1,
          totalFare: 1,
          avgDistance: 1
        }
      }
    ];

    // Execute the aggregation pipeline
    const passengersStats = await User.aggregate(pipeline);

    // Send the response
    res.status(200).json(passengersStats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});