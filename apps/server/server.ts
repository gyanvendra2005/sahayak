import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import Notification from "../../packages/models/Notification.ts"; 

const app = express();

// --- CORS setup for Express ---
app.use(cors({
  origin: "http://localhost:3000", // <-- your frontend URL
  methods: ["GET", "POST"],
  credentials: true,
}));
app.use(express.json());

// --- MongoDB connection ---
mongoose.connect("mongodb+srv://gyanvendras2004_db_user:ErlpNcyW3B8pPYSg@cluster0.7bhohz9.mongodb.net/")


// --- Create HTTP server ---
const httpServer = createServer(app);

// --- Socket.IO setup with CORS ---
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // frontend URL
    methods: ["GET", "POST"],
  }
});

// --- Store connected users (userId -> socketId) ---
const users: Record<string, string> = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Register user and join room
  socket.on("register", (userId: string) => {
    users[userId] = socket.id;
    socket.join(userId); // <-- join room
    console.log(`User ${userId} registered on socket ${socket.id}`);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    for (const id in users) {
      if (users[id] === socket.id) delete users[id];
    }
  });
});

// --- Test route ---
// Get notifications for a specific user
app.get("/notifications/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log("Fetching notifications for user:", userId);

  try {
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    console.log("Fetched notifications:", notifications);
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// Mark a single notification as read
app.post("/notifications/mark-read", async (req, res) => {
  const { notificationId } = req.body;
  if (!notificationId) return res.status(400).json({ error: "Missing notificationId" });

  try {
    const updated = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true }
    );

    if (!updated) return res.status(404).json({ error: "Notification not found" });

    res.json({ success: true, notification: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// Mark all notifications for a user as read
app.post("/notifications/mark-all-read", async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  try {
    await Notification.updateMany({ userId }, { read: true });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});




// --- Notification route ---
app.post("/notify", async (req, res) => {
  const { userId, issueId, title, message, type } = req.body;

  try {
    // Save notification to DB
    const notif = await Notification.create({
      userId,
      type,
      title,
      message,
      issueId,
    });

    // Emit notification to the user's room
    io.to(userId).emit("notification", notif);

    res.json({ success: true });
  } catch (err) {
    console.error("Error sending notification:", err);
    res.status(500).json({ success: false });
  }
});


// --- Start server ---
httpServer.listen(4000, () => {
  console.log("🚀 Socket.IO server running on http://localhost:4000");
});
