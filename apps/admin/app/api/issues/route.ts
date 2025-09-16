import dbconnect from "lib/dbconnect";
import PostModel from "../../../../../packages/models/Post";
export async function GET(request:Request) {
       await dbconnect();
       const searchParams = new URL(request.url);
       const id = searchParams.searchParams.get('id');
              try {
                if(id){
            const data = await PostModel.findById(id);
            return Response.json({data},{status:200});
                }
        const data = await PostModel.find();
        console.log(data);
        
        return Response.json({data},{status:200});
       } catch (error) {
        console.log(error);
        console.log("Error fetching all issues:", error);
        
        return Response.json({message:"Failed to fetch all issues"},{status:500});
       }
}

