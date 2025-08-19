import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILecture extends Document {
  title: string;
  description: string;
  videoUrl?: string;
  publicId?: string;
  isFree: boolean;
  courseId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LectureSchema: Schema<ILecture> = new Schema(
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
    videoUrl: {
      type: String,
    },
    publicId: {
      type: String,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  },
  { timestamps: true }
);

// ✅ Prevent model overwrite issues in Next.js
const LectureModel: Model<ILecture> =
  mongoose.models.Lecture || mongoose.model<ILecture>("Lecture", LectureSchema);

export default LectureModel;