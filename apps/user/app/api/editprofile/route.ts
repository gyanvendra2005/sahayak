import { deleteMedia, uploadMedia } from "../../../utils/cloudnary";
import dbconnect from "../../../lib/dbconnect";
import UserModel from "../../../models/User";

export async function PUT(request: Request) {
  await dbconnect();

  try {
    const dataform = await request.formData();
    const email = dataform.get("email");
    const image = dataform.get("image");
    const name = dataform.get("name");
    console.log(image);

    if (!image) {
      return Response.json(
        {
          success: false,
          message: "No image found",
        },
        {
          status: 200,
        }
      );
    }

    const user = await UserModel.findOne({ email });

    console.log(email, name);

    //   if already image is then delte it
    if (image) {
      if (user?.photoUrl) {
        const publicId = user.photoUrl?.split("/")?.pop()?.split(".")[0];
        deleteMedia(publicId);
      }
    }

    // Convert image (File/Blob) to Buffer for Cloudinary
    let dataUri: string | undefined = undefined;
    if (image instanceof File) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Convert buffer to Data URI format for Cloudinary
      const base64Image = buffer.toString("base64");
      const mimeType = image.type; // e.g., 'image/png'
      // Convert to Data URI
      dataUri = `data:${mimeType};base64,${base64Image}`;
    } else {
      return Response.json(
        {
          success: false,
          message: "Invalid image file",
        },
        {
          status: 400,
        }
      );
    }

    // Upload using Cloudinary
    const uploaded = await uploadMedia(dataUri); // <== accepts data URI
    const photourl = uploaded?.secure_url;
    console.log(photourl);

    if (user) {
      user.name = typeof name === "string" ? name : "";
      user.photoUrl = photourl;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "User updated successfully",
          data: user,
        },
        { status: 200 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Error while updating",
          data: user,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error while pdating", error);
    return Response.json(
      {
        success: false,
        message: "Error while updating",
      },
      { status: 500 }
    );
  }
}
