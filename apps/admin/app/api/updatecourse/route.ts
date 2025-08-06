import dbconnect from "lib/dbconnect";
import { CourseModel } from "models/Course";
import { NextApiRequest, NextApiResponse } from "next";


export async function PUT(request: Request) {

  await dbconnect();

  try {
    const { id, title, coursePrice, isPublished } = await request.json();
    const updated = await CourseModel.findByIdAndUpdate(
      id,
      { title, coursePrice, isPublished },
      { new: true }
    );
    if (!updated) {
      return new Response(JSON.stringify({ error: "Course not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ data: updated }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  

    
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to update course" }), {
      status: 500,
    });
  }
}

