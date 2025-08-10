import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    videoUrl: {
        type: String,
    },
    publicId:{
        type: String,
    },
    isFree: {
        type: Boolean,
        default: false,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
}, { timestamps: true });


export const LectureModel = mongoose.models.Lecture || mongoose.model("Lecture", lectureSchema);