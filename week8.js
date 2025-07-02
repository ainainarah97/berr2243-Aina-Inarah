const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = 3000;
const bcrypt =require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

require('dotenv').config();

app.use(cors());
app.use(express.json());

let db;

//AUTHENTICATION MIDDLEWARE
const authenticate = (req, res, next) => {   
  const token = req.headers.authorization?.split(' ')[1];  
 
  if (!token) return res.status(401).json({ error: "Unauthorized" });   
 
  try {   
    const decoded = jwt.verify(token, process.env.JWT_SECRET);   
    req.user = decoded;  
    next();   
  } catch (err) {   
    res.status(401).json({ error: "Invalid token" });   
  }   
};   
 
const authorize = (roles) => (req, res, next) => {   
  if (!roles.includes(req.user.role))  
     return res.status(403).json({ error: "Forbidden" });   
  next();   
}; 

async function connectToMongoDB() {
    const uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log("Connected to MongoDB!");
        db = client.db("rideHailingDB");
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
}
connectToMongoDB();

//LOGIN ROUTE
app.post('/auth/login', async (req, res) => {   
  const user = await db.collection('users').findOne({ email: req.body.email
 });   
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {   
    return res.status(401).json({ error: "Invalid credentials" });   
  }   
  const token = jwt.sign(   
    { userId: user._id, role: user.role },   
    process.env.JWT_SECRET,   
    { expiresIn: process.env.JWT_EXPIRES_IN }   
  );   
  res.status(200).json({ token }); // Return token to client   
}); 

// USERS
app.post('/users', async (req, res) => {   
  try {   
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);   
    const user = { ...req.body, password: hashedPassword };   
    await db.collection('users').insertOne(user);   
    res.status(201).json({ message: "User created" });   
  } catch (err) {   
    res.status(400).json({ error: "Registration failed" });   
  }   
}); 

app.get('/admin/users', async (req, res) => {
    try {
        const users = await db.collection('users').find().toArray();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

app.patch('/users/:id', async (req, res) => {
    try {
        const result = await db.collection('users').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body }
        );
        if (result.modifiedCount === 0) return res.status(404).json({ error: "User not found" });
        res.status(200).json({ update: result.modifiedCount });
    } catch (err) {
        res.status(400).json({ error: "Invalid user ID or data" });
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const result = await db.collection('users').deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) return res.status(404).json({ error: "User not found" });
        res.status(200).json({ deleted: result.deletedCount });
    } catch (err) {
        res.status(400).json({ error: "Invalid user ID" });
    }
});

// Admin: Block User
app.patch('/admin/block-user/:id', async (req, res) => {
    try {
        const result = await db.collection('users').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { blocked: true } }
        );
        res.status(200).json({ blocked: result.modifiedCount });
    } catch (err) {
        res.status(400).json({ error: "Invalid user ID" });
    }
});

// Admin: View Analytics
app.get('/admin/analytics', async (req, res) => {
    try {
        const userCount = await db.collection('users').countDocuments();
        const rideCount = await db.collection('rides').countDocuments();
        res.status(200).json({ totalUsers: userCount, totalRides: rideCount });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch analytics" });
    }
});

app.delete('/admin/users/:id', authenticate, authorize(['admin']), async (req,
 res) => {   
   console.log("admin only"); 
   res.status(200).send("admin access"); 
});  

// RIDES
app.post('/rides', async (req, res) => {
    try {
        const rideData = {
            ...req.body,
            status: "pending", // default
            fare: 0 // default until driver accepts
        };
        const result = await db.collection('rides').insertOne(rideData);
        res.status(201).json({ id: result.insertedId });
    } catch (err) {
        res.status(400).json({ error: "Invalid ride data" });
    }
});

app.get('/rides', async (req, res) => {
    try {
        const rides = await db.collection('rides').find().toArray();
        res.status(200).json(rides);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch rides" });
    }
});

// Driver Accept Ride
app.patch('/rides/accept/:id', async (req, res) => {
    try {
        const { driverId } = req.body;
        const fare = Math.floor(Math.random() * 20) + 10; // RM10-30
        const result = await db.collection('rides').updateOne(
            { _id: new ObjectId(req.params.id), status: "pending" },
            { $set: { driverId, status: "accepted", fare } }
        );
        if (result.modifiedCount === 0) return res.status(404).json({ error: "Ride not found or already accepted" });
        res.status(200).json({ accepted: true, fare });
    } catch (err) {
        res.status(400).json({ error: "Invalid ride ID or driver ID" });
    }
});

app.patch('/rides/:id', async (req, res) => {
    try {
        const result = await db.collection('rides').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body }
        );
        if (result.modifiedCount === 0) return res.status(404).json({ error: "Ride not found" });
        res.status(200).json({ update: result.modifiedCount });
    } catch (err) {
        res.status(400).json({ error: "Invalid ride ID or data" });
    }
});

app.delete('/rides/:id', async (req, res) => {
    try {
        const result = await db.collection('rides').deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) return res.status(404).json({ error: "Ride not found" });
        res.status(200).json({ deleted: result.deletedCount });
    } catch (err) {
        res.status(400).json({ error: "Invalid ride ID" });
    }
});

// Driver: Update availability
app.patch('/driver/availability/:id', async (req, res) => {
    try {
        const result = await db.collection('users').updateOne(
            { _id: new ObjectId(req.params.id), role: "driver" },
            { $set: { available: req.body.available } }
        );
        res.status(200).json({ updated: result.modifiedCount });
    } catch (err) {
        res.status(400).json({ error: "Invalid driver ID or data" });
    }
});

// Driver: View earnings
app.get('/driver/earnings/:id', async (req, res) => {
    try {
        const rides = await db.collection('rides').find({ driverId: req.params.id }).toArray();
        const totalEarnings = rides.reduce((sum, ride) => sum + (ride.fare || 0), 0);
        res.status(200).json({ totalEarnings });
    } catch (err) {
        res.status(500).json({ error: "Error calculating earnings" });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});