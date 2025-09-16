import mongoose, { Schema, model } from "mongoose";

const NotificationSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["update", "assignment", "alert", "message"], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  issueId: { type: String },
  read: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.models.Notification || model("Notification", NotificationSchema);
