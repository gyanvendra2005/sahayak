

// import { CourseModel } from "models/Course";
// import { NextRequest } from "next/server";

// export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
//   const { id } = params;

//   try {
//      const response = await CourseModel.findById(id);
//      if(!response) {
//        return new Response(JSON.stringify({ error: 'Course not found' }), { status: 404 });
//      }
//      console.log('Fetched course data:', response);
     
//     return new Response(JSON.stringify(response), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },})
//   } catch (error) {
//     console.error('Error fetching course data:', error);
//     return new Response(JSON.stringify({ error: 'Failed to fetch course data' }), { status: 500 });
//   }
// }


import CourseModel  from "models/Course";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: any   
) {
  const { id } = context.params;

  try {
    const response = await CourseModel.findById(id);

    if (!response) {
      return new Response(JSON.stringify({ error: "Course not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching course data:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch course data" }),
      { status: 500 }
    );
  }
}