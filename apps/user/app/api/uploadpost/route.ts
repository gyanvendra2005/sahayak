import dbconnect from "../../../lib/dbconnect";
import PostModel from '../../../../../packages/models/Post';
import { uploadMedia } from "utils/cloudnary";
import axios from "axios";

export async function POST(request: Request) {
  dbconnect();
  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const pincode = formData.get("pincode") as string;
    const category = formData.get("category") as string;
    const image = formData.get("image") as File;
    const userId = formData.get("userId") as string;
    const ticketId = formData.get("ticketId") as string;
    const department = formData.get("department") as string;

    // Convert image File → Data URI
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");
    const mimeType = image.type;
    const dataUri = `data:${mimeType};base64,${base64Image}`;

    const uploaded = await uploadMedia(dataUri);
    const photoUrl = uploaded.secure_url;

    // Save post to DB
    const newPost = new PostModel({
      title:"hgv",
      description,
      category,
      photoUrl,
      ticketId,
      userId,
      location,
      pincode,
      department,
    });

    await newPost.save();

    // 🔹 Call your Socket.IO backend to notify
    await axios.post("http://localhost:4000/notify", {
      userId,
      issueId: ticketId,
      title: "Issue Submitted",
      message: `Your issue "${title}" has been submitted successfully.`,
      type: "update",
    });

    return Response.json(
      {
        success: true,
        message: "Problem Submitted",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);

    return Response.json(
      {
        success: false,
        message: "Failed to register problem",
      },
      { status: 500 }
    );
  }
}
