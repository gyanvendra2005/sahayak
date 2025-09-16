import dbconnect from "lib/dbconnect";
import PostModel from "../../../../../packages/models/Post";


export async function GET(request:Request){
    dbconnect();
    try {
        // const {location} = await request.json();
        const {searchParams} = new URL(request.url);
        const location = searchParams.get('location');
        const datas = await PostModel.find({location:location});
        return Response.json({datas},{status:200});
    } catch (error) {
        console.log(error);
        return Response.json({message:"Failed to fetch nearby issues"},{status:500});
    }
    
}