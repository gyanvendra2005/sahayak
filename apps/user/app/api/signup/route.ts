import dbconnect from "../../../lib/dbconnect";
import UserModel from '../../../../../packages/models/User';
import bcrypt from 'bcryptjs';


export async function POST(request: Request) {


  await dbconnect();

  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const location = formData.get('location') as string;
    const pincode = formData.get('pincode') as string;

    const existingUserByEmail = await UserModel.findOne({ email });

    if (existingUserByEmail) {
        return Response.json(
            {
            success: false,
            message: 'Email already exists. Please use a different email.',
            },
            { status: 400 }
        );
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new UserModel({
        name,
        email,
        password: hashedPassword,
        Location: location,
        pincode,
      });

      await newUser.save();
    }

    return Response.json(
      {
        success: true,
        message: 'User registered successfully. Please verify your account.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    return Response.json(
      {
        success: false,
        message: 'Error registering user',
      },
      { status: 500 }
    );
  }
}