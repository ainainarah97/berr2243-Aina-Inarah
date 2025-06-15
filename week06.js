const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const port = 3000;
const app = express();
app.use(express.json());

let db;

// MongoDB connection setup
async function connectToMongoDB() {
    const uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected to MongoDB!");
        db = client.db("testDB");
    } catch (err) {
        console.error("Error:", err);
    }
}
connectToMongoDB();

// Part 1: Register new user with password hashing
app.post('/users', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Name, email, and password are required." });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Hash password before saving
        const result = await db.collection('users').insertOne({ name, email, password: hashedPassword });
        res.status(201).json({ id: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: "Failed to register customer" });
    }
});

// Part 2: Login and generate JWT token
app.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await db.collection('users').findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role }, // payload: user info
            process.env.JWT_SECRET, // secret key from .env file
            { expiresIn: '1h' } // expiration time
        );

        res.status(200).json({ message: "Login successful", token });
    } catch (err) {
        res.status(500).json({ error: "Failed to login" });
    }
});

// Part 3: Role-Based Access Control (RBAC) middleware
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Get the token from the Authorization header
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        req.user = decoded; // Attach the decoded user info to the request
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
};

const authorize = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: "Forbidden" }); // User doesn't have the required role
    }
    next(); // If the user has the correct role, proceed
};

// Example of protecting an admin-only route
app.delete('/admin/users/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const result = await db.collection('users').deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(204).json({ message: "User successfully blocked" });
    } catch (err) {
        res.status(400).json({ error: "Invalid user ID" });
    }
});

// Example of another protected route for a specific user role (e.g., driver)
app.patch('/drivers/:id/status', authenticate, authorize(['admin', 'driver']), async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ error: "Status is required" });
        }

        const result = await db.collection('drivers').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { status } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: "Driver not found" });
        }

        res.status(200).json({ updated: result.modifiedCount });
    } catch (err) {
        res.status(400).json({ error: "Invalid driver ID or data" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});