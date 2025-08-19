// import { deleteMedia, uploadMedia } from "../../../utils/cloudnary";
// import dbconnect from "../../../lib/dbconnect";
// import UserModel from "../../../models/User";

// export async function PUT(request: Request) {
//   await dbconnect();

//   try {
//     const dataform = await request.formData();
//     const email = dataform.get("email");
//     const image = dataform.get("image");
//     const name = dataform.get("name");
//     console.log(image);

//     if (!image || !(image instanceof File)) {
//       return Response.json(
//         {
//           success: false,
//           message: "No valid image file found",
//         },
//         {
//           status: 200,
//         }
//       );
//     }

//     const user = await UserModel.findOne({ email });

//     console.log(email, name);

//     //   if already image is then delte it
//     if (image) {
//       if (user?.photoUrl) {
//         const publicId = user.photoUrl?.split("/").pop()?.split(".")[0];
//         if (publicId) {
//           deleteMedia(publicId);
//         }
//       }
//     }

//     // Convert image (File/Blob) to Buffer for Cloudinary
//     const arrayBuffer = await image.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);

//     // Convert buffer to Data URI format for Cloudinary
//     const base64Image = buffer.toString("base64");
//     const mimeType = image.type; // e.g., 'image/png'
//     const dataUri = `data:${mimeType};base64,${base64Image}`;

//     // Upload using Cloudinary
//     const uploaded = await uploadMedia(dataUri); // <== accepts data URI
//     const photourl = uploaded?.secure_url;
//     console.log(photourl);

//     if (user) {
//       user.name = typeof name === "string" ? name : "";
//       user.photoUrl = photourl;
//       await user.save();
//       return Response.json(
//         {
//           success: true,
//           message: "User updated successfully",
//           data: user,
//         },
//         { status: 200 }
//       );
//     } else {
//       return Response.json(
//         {
//           success: false,
//           message: "Error while updating",
//           data: user,
//         },
//         { status: 400 }
//       );
//     }
//   } catch (error) {
//     console.error("Error while pdating", error);
//     return Response.json(
//       {
//         success: false,
//         message: "Error while updating",
//       },
//       { status: 500 }
//     );
//   }
// }
import { deleteMedia, uploadMedia } from "../../../utils/cloudnary";
import dbconnect from "../../../lib/dbconnect";
import UserModel from "../../../models/User";

function getPublicIdFromUrl(url: string) {
  // Extract folder + filename, remove extension
  const urlParts = url.split("/");
  const lastTwo = urlParts.slice(-2).join("/"); // e.g. profile/abc123.png
  return lastTwo.replace(/\.[^/.]+$/, ""); // → profile/abc123
}

export async function PUT(request: Request) {
  await dbconnect();

  try {
    const dataform = await request.formData();
    const email = dataform.get("email") as string;
    const image = dataform.get("image");
    const name = dataform.get("name") as string;

    if (!email) {
      return Response.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    if (!image || !(image instanceof File)) {
      return Response.json(
        { success: false, message: "No valid image file found" },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return Response.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Delete old image if exists
    if (user.photoUrl) {
      const publicId = getPublicIdFromUrl(user.photoUrl);
      if (publicId) {
        await deleteMedia(publicId); // ✅ await deletion
      }
    }

    // Convert image File → Data URI
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");
    const mimeType = image.type; // e.g., image/png
    const dataUri = `data:${mimeType};base64,${base64Image}`;

    // ✅ Upload to Cloudinary (handles Data URI properly now)
    const uploaded = await uploadMedia(dataUri);
    const photoUrl = uploaded.secure_url;

    // Update user
    user.name = name || user.name;
    user.photoUrl = photoUrl;
    await user.save();

    return Response.json(
      { success: true, message: "User updated successfully", data: user },
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
