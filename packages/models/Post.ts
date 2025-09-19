import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPost extends Document {
  title: string;
  description: string;
  location?: string;
  category?: string;
  department?: "Health"|"Engineering"|"Firework";
  promote?: number;
  photoUrl?: string;
  ticketId?: string;
  status?: "Submited" | "Acknowledged" | "WorkIsAssigned" | "Resolved";
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const PostSchema: Schema<IPost> = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    department: {
      type: String,
      enum: ["Health","Engineering","Firework"],
      required: true,
    },
    promote: {
      type: Number,
      default: 1,
    },
    category: {
      type: String,
    },
    photoUrl: {
      type: String,
    },
    ticketId: {
      type: String,
      unique: true,
      sparse: true,
    },
    status: {
      type: String,
      enum: ["Submited", "Acknowledged", "WorkIsAssigned", "Resolved"],
      default: "Submited",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
  },
  { timestamps: true }
);

const PostModel: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export default PostModel;