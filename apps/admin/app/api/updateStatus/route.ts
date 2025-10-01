import dbconnect from "lib/dbconnect";
import PostModel from "../../../../../packages/models/Post";
import axios from "axios";

export async function PUT(request:Request){
    dbconnect();
    try {
        const {id,status,userId,ticketId }= await request.json();
        console.log(status,id);
        
        const res = await PostModel.findByIdAndUpdate(id,{status},{new:true});
    
      await axios.post("http://localhost:4000/notify", {
      userId: userId,
      issueId: ticketId,
      title: "Issue Status Updated",
      message: `Your issue status has been changed to ${status}.`,
      type: "update",
    });
        console.log(res);
        return new Response(JSON.stringify(res),{status:200});
    } catch (error) {
        
    }
}