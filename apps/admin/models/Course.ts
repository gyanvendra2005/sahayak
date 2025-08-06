// import mongoose from "mongoose";
import mongoose, { Schema, model, models } from "mongoose";


const courseSchema = new mongoose.Schema({
    title:{
         type:String,
         required:true,
    },
    description:{
         type:String,
         required:true,
    },
    category:{
         type:String,
         required:true,
    },
    coursePrice:{
         type:Number,
         required:true,
    },
    level:{
            type:String,
            enum:["Beginner","Intermediate","Advanced"],
            default:"Beginner"
    },
    enrolledStudents:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    lectures:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Lecture"
        }
    ],
    creator:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User" 
    },
    isPublished:{
        type:Boolean,
        default:false
    }

},{timestamps:true}
)

// export const CourseModel = mongoose.model("Course",courseSchema);

// import mongoose, { Schema, model, models } from "mongoose";

// const courseSchema = new Schema({
//   title: String,
//   description: String,
//   category: String,
//   coursePrice: Number,
//   creator: String,
//   isPublished: Boolean,
// });

export const CourseModel = models.Course || model("Course", courseSchema);
