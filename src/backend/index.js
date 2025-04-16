const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

const messageRoutes = require("./Routes/messageRoutes.js");
const userRouter = require("./Routes/userRouter.js");
const orderRoutes = require("./Routes/orderRoute.js");
const feedbackRouter = require("./Routes/feedbackRoute.js");
const companyRoutes = require("./Routes/companyRoutes.js");
const Message = require("./Models/messageModel.js");

dotenv.config();

const app = express();
const server = http.createServer(app); // Create HTTP server for Socket.io

// ✅ Fix: Allow both frontend origins (3000 & 5173)
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

// ✅ Fix: Allow CORS for Express requests
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:5173"] }));
app.use(express.json());
app.use("/api", userRouter);
// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/buyertalk")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// API Routes
app.use("/messages", messageRoutes);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRoutes);
app.use("/api/feedback", feedbackRouter);
app.use("/api/companies", companyRoutes);

// User Authentication (Mock API)
app.post("/authenticate", async (req, res) => {
  const { username } = req.body;
  return res.json({ username: username, secret: "sha256..." });
});

// WebSocket (Socket.io) Integration
io.on("connection", (socket) => {
  console.log("🔗 User connected:", socket.id);

  socket.on("sendMessage", async (data) => {
    try {
      const newMessage = new Message({ sender: data.sender, text: data.text });
      await newMessage.save();
      io.emit("receiveMessage", newMessage); // Broadcast message to all clients
    } catch (error) {
      console.error("❌ Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
