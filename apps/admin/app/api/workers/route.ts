import dbconnect from "lib/dbconnect";
import UserModel from "../../../../../packages/models/User";

export async function GET(request: Request) {
    await dbconnect();
    try {
        const searchParams = new URL(request.url);
        const department = searchParams.searchParams.get('department');
        console.log("fetching workers ", department);
        const res = await UserModel.find(department ? { department, role: 'SubAdmin' } : { role: 'SubAdmin' }).sort({ createdAt: -1 });
        console.log(res);
        
        return Response.json({ res }, { status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json({ message: "Failed to fetch all workers" }, { status: 500 });
        
    }
}