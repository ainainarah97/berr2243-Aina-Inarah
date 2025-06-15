const mongoose = require('mongoose');

// Connect to MongoDB 
mongoose.connect('mongodb://localhost:27017/ride_hailing_system', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected to ride_hailing_system'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  isBlocked: Boolean,
});

// Driver Schema (extends User)
const driverSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  isBlocked: Boolean,
  licenseNumber: String,
  licenseExpiryDate: Date,
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  driverRating: Number,
  totalEarnings: Number,
});

// Admin Schema (extends User)
const adminSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  adminLevel: { type: String, enum: ['superadmin', 'moderator'] },
  permissions: [String],
});

// Ride Schema
const rideSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  pickupLocation: { lat: Number, lng: Number },
  destination: { lat: Number, lng: Number },
  status: { type: String, enum: ['requested', 'in_progress', 'completed'] },
  fare: Number,
  customerReview: Number,
});

// Vehicle Schema
const vehicleSchema = new mongoose.Schema({
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  make: String,
  model: String,
  year: Number,
  plateNumber: String,
  driverReview: Number,
});

// Analytics Schema
const analyticsSchema = new mongoose.Schema({
  totalRides: Number,
  totalFare: Number,
  totalDistance: Number,
  totalEarnings: Number,
});

// Models
const User = mongoose.model('User', userSchema);
const Driver = mongoose.model('Driver', driverSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Ride = mongoose.model('Ride', rideSchema);
const Vehicle = mongoose.model('Vehicle', vehicleSchema);
const Analytics = mongoose.model('Analytics', analyticsSchema);

// Sample Data Insertion
async function rideData() {
  try {
    // Sample Users (Customers)
    const customer1 = new User({
      email: 'customer1@example.com',
      password: 'password123',
      isBlocked: false,
    });

    const customer2 = new User({
      email: 'customer2@example.com',
      password: 'password456',
      isBlocked: false,
    });

    const customer3 = new User({
      email: 'customer3@example.com',
      password: 'password789',
      isBlocked: false,
    });

    await customer1.save();
    await customer2.save();
    await customer3.save();

    // Sample Admin
    const admin = new Admin({
      email: 'admin@example.com',
      password: 'adminpass',
      adminLevel: 'superadmin',
      permissions: ['viewAnalytics', 'blockAccounts'],
    });

    await admin.save();

    // Sample Drivers and Vehicles
    const driver1 = await createDriverWithVehicle('driver1@example.com', 'DL12345', 4.7, 'Toyota', 'Corolla', 'ABC123', 2021);
    const driver2 = await createDriverWithVehicle('driver2@example.com', 'DL23456', 4.5, 'Honda', 'Civic', 'DEF456', 2020);
    const driver3 = await createDriverWithVehicle('driver3@example.com', 'DL34567', 4.9, 'BMW', '3 Series', 'GHI789', 2022);

    // Sample Rides
    const ride1 = new Ride({
      customerId: customer1._id,
      driverId: driver1._id,
      pickupLocation: { lat: 40.7128, lng: -74.0060 },
      destination: { lat: 40.73061, lng: -73.935242 },
      status: 'completed',
      fare: 25.0,
      customerReview: 5,
    });

    const ride2 = new Ride({
      customerId: customer2._id,
      driverId: driver2._id,
      pickupLocation: { lat: 40.7580, lng: -73.9855 },
      destination: { lat: 40.748817, lng: -73.985428 },
      status: 'in_progress',
      fare: 15.0,
      customerReview: 4,
    });

    await ride1.save();
    await ride2.save();

    // Sample Analytics (Admin Data)
    const analytics = new Analytics({
      totalRides: 50,
      totalFare: 1250,
      totalDistance: 2000, // Example distance in km
      totalEarnings: 3000, // Example earnings
    });

    await analytics.save();

    console.log('Sample data inserted successfully!');
  } catch (err) {
    console.error('Error inserting sample data:', err);
  }
}

// Helper function to create a driver and vehicle
async function createDriverWithVehicle(email, licenseNumber, driverRating, make, model, plateNumber, year) {
  const vehicle = new Vehicle({
    driverId: null, // Reference will be updated later
    make: make,
    model: model,
    year: year,
    plateNumber: plateNumber,
    driverReview: driverRating,
  });

  const savedVehicle = await vehicle.save();

  const driver = new Driver({
    email: email,
    password: 'driverpass',
    isBlocked: false,
    licenseNumber: licenseNumber,
    licenseExpiryDate: new Date(),
    vehicleId: savedVehicle._id,
    driverRating: driverRating,
    totalEarnings: 500.0,
  });

  // Update vehicle with the driver reference
  savedVehicle.driverId = driver._id;
  await savedVehicle.save();

  await driver.save();
  return driver;
}

// Run the sample data insertion
rideData();