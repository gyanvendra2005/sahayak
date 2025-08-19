// import mongoose from "mongoose";

// const courseSchema = new mongoose.Schema({
//     title:{
//          type:String,
//          required:true,
//     },
//     description:{
//          type:String,
//          required:true,
//     },
//     category:{
//          type:String,
//          required:true,
//     },
//     coursePrice:{
//          type:Number,
//          required:true,
//     },
//     enrolledStudents:[
//         {
//             type:mongoose.Schema.Types.ObjectId,
//             ref:"User"
//         }
//     ],
//     lectures:[
//         {
//             type:mongoose.Schema.Types.ObjectId,
//             ref:"Lecture"
//         }
//     ],
//     creator:{
//             type:mongoose.Schema.Types.ObjectId,
//             ref:"User" 
//     },
//     isPublished:{
//         type:Boolean,
//         default:false
//     }

// },{timestamps:true}
// )

// export const CourseModel = mongoose.model("Course",courseSchema);
import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICourse extends Document {
  title: string;
  description: string;
  category: string;
  coursePrice: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  enrolledStudents: mongoose.Types.ObjectId[];
  lectures: mongoose.Types.ObjectId[];
  creator: mongoose.Types.ObjectId;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema: Schema<ICourse> = new Schema(
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
    category: {
      type: String,
      required: true,
      trim: true,
    },
    coursePrice: {
      type: Number,
      required: true,
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    enrolledStudents: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lectures: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lecture",
      },
    ],
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ✅ Prevent recompilation issues in Next.js (important for Vercel)
const CourseModel: Model<ICourse> =
  mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);

export default CourseModel;
