import dbconnect from "lib/dbconnect";
import { CourseModel } from "models/Course";
import { LectureModel } from "models/Lecture";

export async function POST(request: Request) {
    dbconnect();
    try {
        const { courseId, title, description,isFree } = await request.json();
        const response = await LectureModel.create({
            title: title,
            description: description,
            courseId: courseId,
            isFree
        });
        const updatecourse = await CourseModel.findByIdAndUpdate({_id: courseId}, { $push: { lectures: response._id } }, { new: true });
         if(!response.success) {
            return Response.json(
                {
                    success: false,
                    message: 'Failed to create lecture',
                });}
             return Response.json(
      {
        success: true,
        message: 'Lecture ceated successfully',
      },
      { status: 201 });

    } catch (error) {
        console.log(error);
        
         return Response.json(
                {
                    success: false,
                    message: 'Failed to create lecture',
                });
    }
}