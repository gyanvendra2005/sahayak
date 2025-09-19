import dbconnect from "lib/dbconnect";
import PostModel from "../../../../../packages/models/Post";


export async function POST(request: Request) {
    dbconnect();
    try {
        const { postId } = await request.json();
        console.log(postId);
        
        const res = await PostModel.findByIdAndUpdate(postId, { $inc: { promote: 1 } }, { new: true });
        console.log(res);
        
        return new Response(JSON.stringify(res), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response("Internal Server Error", { status: 500 });
    }
}