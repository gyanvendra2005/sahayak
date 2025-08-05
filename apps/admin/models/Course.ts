import mongoose from "mongoose";

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

export const CourseModel = mongoose.model("Course",courseSchema);