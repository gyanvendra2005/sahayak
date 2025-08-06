// import dbconnect from "../../../lib/dbconnect";
// import { CourseModel } from "../../../models/Course";


// export async function POST(request: Request) {
//     dbconnect();

//     try {
//         const {title,description,category,coursePrice,creator,isPublished} = await request.json();
//         const createcourse = new CourseModel({
//             title,
//             description,
//             category,
//             coursePrice,
//             creator,
//             isPublished
//         })
//         await createcourse.save();
 
//         return Response.json(
//       {
//         success: true,
//         message: 'Course ceated successfully',
//       },
//       { status: 201 }
//     );


        
//     } catch (error) {
//         console.log(error);
//          return Response.json(
//       {
//         success: false,
//         message: 'Failed to create course',
//       })
     
//     }

// }