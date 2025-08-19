// import mongoose, { Schema, Document } from 'mongoose';

// const userSchema = new mongoose.Schema({
//     name:{
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     },
//     role: {
//   type: String,
//   enum: ['student', 'instructor'],
//   default: 'student',  
// },

//     enrolledCourses:[
//         {
//             type: Schema.Types.ObjectId,
//             ref: 'Course',
//         }
//     ],
//     photoUrl: {
//         type: String,
//         default: '',
//     },
//     timestamp: {
//         type: Date,
//         default: Date.now,
//     }
// })
// const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
// export default UserModel;


import mongoose, { Schema, Document, Model } from "mongoose";

export  interface ICourse extends Document {
  title: string;
  description: string;
  category: string;
  coursePrice: number;
    password: string; 
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
       password: {
        type: String,
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
