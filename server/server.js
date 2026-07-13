const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");

// Routes
const userRoutes = require("./routes/userRoutes");
const matchRoutes = require("./routes/matchRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/matches", matchRoutes);

// Home Route
app.get("/", (req, res) => {
    res.send("🚀 EliteConnect API is Running Successfully!");
});

// 404 Route
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found."
    });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});