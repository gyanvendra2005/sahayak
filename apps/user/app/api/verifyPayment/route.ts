import dbconnect from "lib/dbconnect";
import { NextRequest, NextResponse } from "next/server";
import  CourseModel  from "../../../../admin/models/Course";
import UserModel from "models/User";



export async function POST(request: NextRequest) {
    await dbconnect();  
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature, courseId, userId } = await request.json();
        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !courseId || !userId) {
            return NextResponse.json({
                success: false,
                message: 'Missing required parameters',
            });
        }
        const res = await CourseModel.findByIdAndUpdate(courseId,{ $push: { enrolledStudents: userId } }, { new: true });
        const res1 = await UserModel.findByIdAndUpdate(userId, { $push: { enrolledCourses: courseId } }, { new: true });
        if (!res || !res1) {
            return NextResponse.json({
                success: false,
                message: 'Failed to update course or user',
            });
        }
        return NextResponse.json({
            success: true,
            message: 'Payment verified and course enrollment successful',
            data: {
                course: res,
                user: res1,
            },
        });


    } catch (error) {
        console.log("Error in verifyPayment route:", error);
        return NextResponse.json({
            success: false,
            message: 'Payment verification failed',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
        
    }
}