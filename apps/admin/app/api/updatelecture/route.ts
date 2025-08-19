import dbconnect from "lib/dbconnect";
import { uploadMedia } from "../../../utils/cloudnary";
import  LectureModel  from "models/Lecture";

export async function PUT(request: Request) {
  await dbconnect();

  try {
    const dataform = await request.formData();
    const id = dataform.get("id") as string;
    const title = dataform.get("title") as string;
    const description = dataform.get("description") as string;
    const isFree = dataform.get("isFree") === "true";
    const video = dataform.get("video") as File | null;

    if (!video) {
      return Response.json(
        { success: false, message: "No video found" },
        { status: 400 }
      );
    }

    // Convert video file to buffer
    const arrayBuffer = await video.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert buffer to Data URI format for Cloudinary
    const base64Video = buffer.toString("base64");
    const mimeType = video.type; //
    const dataUri = `data:${mimeType};base64,${base64Video}`;

    // Upload to Cloudinary
    const uploaded = await uploadMedia(dataUri);
    const videoUrl = uploaded?.secure_url;
    console.log("Uploaded video URL:", videoUrl);

    const lecture = await LectureModel.findByIdAndUpdate(
      id,
      { title, description, isFree, videoUrl },
      { new: true }
    );

    return Response.json(
      {
        success: true,
        message: "Video uploaded successfully",
        url: videoUrl,
        // data: lecture,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while updating:", error);
    return Response.json(
      { success: false, message: "Error while updating" },
      { status: 500 }
    );
  }
}
