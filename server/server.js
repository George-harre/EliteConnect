const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

const connectDB = require("./config/db");

// ===============================
// Routes
// ===============================
const userRoutes = require("./routes/userRoutes");
const likeRoutes = require("./routes/likeRoutes");
const matchRoutes = require("./routes/matchRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();

// ===============================
// HTTP Server
// ===============================
const server = http.createServer(app);

// ===============================
// Socket.IO
// ===============================
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// Make Socket.IO available globally
app.set("io", io);

// ===============================
// Online Users
// ===============================
const onlineUsers = new Set();
const socketToUser = new Map();

// ===============================
// Socket Connection
// ===============================
io.on("connection", (socket) => {

    console.log(`🟢 Connected: ${socket.id}`);

    // ===============================
    // Join Personal Room
    // ===============================
    socket.on("join", (userId) => {

        socket.join(userId);

        socket.userId = userId;

        socketToUser.set(socket.id, userId);

        onlineUsers.add(userId);

        io.emit(
            "onlineUsers",
            Array.from(onlineUsers)
        );

        console.log(`User ${userId} joined`);

    });

    // ===============================
    // Typing
    // ===============================
    socket.on("typing", ({ sender, receiver }) => {

        io.to(receiver).emit("typing", sender);

    });

    // ===============================
    // Stop Typing
    // ===============================
    socket.on("stopTyping", ({ sender, receiver }) => {

        io.to(receiver).emit("stopTyping", sender);

    });

    // ===============================
    // New Message
    // ===============================
    socket.on("sendMessage", (message) => {

        if (message.receiver?._id) {

            io.to(message.receiver._id.toString())

                .emit("receiveMessage", message);

        }

        else if (message.receiver) {

            io.to(message.receiver.toString())

                .emit("receiveMessage", message);

        }

    });

    // ===============================
    // Message Reaction
    // ===============================
    socket.on("messageReaction", (message) => {

        if (message.sender?._id) {

            io.to(message.sender._id.toString())

                .emit("messageReaction", message);

        }

        if (message.receiver?._id) {

            io.to(message.receiver._id.toString())

                .emit("messageReaction", message);

        }

    });

    // ===============================
    // Read Receipts
    // ===============================
    socket.on("messagesRead", (data) => {

        io.to(data.sender)

            .emit("messagesRead", data);

    });

    // ===============================
    // Disconnect
    // ===============================
    socket.on("disconnect", () => {

        console.log(`🔴 Disconnected: ${socket.id}`);

        const userId = socketToUser.get(socket.id);

        if (userId) {

            onlineUsers.delete(userId);

            socketToUser.delete(socket.id);

            io.emit(

                "onlineUsers",

                Array.from(onlineUsers)

            );

            console.log(`User ${userId} went offline`);

        }

    });

});

// ===============================
// Database
// ===============================
connectDB();

// ===============================
// Middleware
// ===============================
app.use(cors());

app.use(express.json());

// ===============================
// Uploads
// ===============================
app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);

// ===============================
// API Routes
// ===============================
app.use("/api/users", userRoutes);

app.use("/api/likes", likeRoutes);

app.use("/api/matches", matchRoutes);

app.use("/api/messages", messageRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/profile", profileRoutes);

// ===============================
// Home
// ===============================
app.get("/", (req, res) => {

    res.send("🚀 EliteConnect API Running");

});

// ===============================
// 404
// ===============================
app.use((req, res) => {

    res.status(404).json({

        message: "Route not found."

    });

});

// ===============================
// Start Server
// ===============================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {

    console.log(

        `✅ Server running on http://localhost:${PORT}`

    );

});