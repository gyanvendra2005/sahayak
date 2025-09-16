import dbconnect from "lib/dbconnect";
import UserModel from "../../../../../packages/models/User";


export async function GET(request: Request) {
    dbconnect();
    try {
        const res = await UserModel.find();
        return Response.json({ data:res }, { status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json({ message: "Failed to fetch users" }, { status: 500 });
    }
}