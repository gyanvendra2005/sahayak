import dbconnect from "../../../lib/dbconnect";
import UserModel from '../../../models/User';
import bcrypt from 'bcryptjs';


export async function POST(request: Request) {


  await dbconnect();

  try {
    const { name, email, password,role } = await request.json();

    const existingUserByEmail = await UserModel.findOne({ email });
    // const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

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
        role: role || 'user',
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