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
//     role:{
//         type: String,
//         enum: ['student', 'instructor'],
//         default: 'student',
//     },
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

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "student" | "instructor";
  enrolledCourses: mongoose.Types.ObjectId[]; 
  photoUrl?: string;
  timestamp?: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "instructor"],
      default: "student",
    },
    enrolledCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    photoUrl: {
      type: String,
      default: "",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } // auto-manages createdAt & updatedAt
);

// ✅ Prevent model overwrite issues on Vercel / hot reload
const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
