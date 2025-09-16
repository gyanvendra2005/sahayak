import dbconnect from "lib/dbconnect";
import UserModel from "../../../../../../packages/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  dbconnect();
  try {
    const formdata  = await request.formData();
    const name = formdata.get("name");
    const email = formdata.get("email");
    const password = formdata.get("password");
    const role = formdata.get("role");
    const department = formdata.get("department");
    const location = formdata.get("location");
 
     const hashedPassword = await bcrypt.hash(password, 10);


    const newuser = new UserModel({
         name,
        email,
        password: hashedPassword,
        Location: location,
        role,
        department,
    })
    
    await newuser.save();
    return Response.json({message:"User Created Successfully"},{status:201})


  } catch (error) {
    console.log(error);
    console.log("hi");
    
    return Response.json({message:"Error Creating User"},{status:500})
  }
}