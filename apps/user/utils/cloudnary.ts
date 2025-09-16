// import { v2 as cloudinary } from "cloudinary";

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
// });

// export const uploadMedia = async (file) => {
//   try {
//     const uploadresponse = await cloudinary.uploader.upload(file, {
//       resource_type: "auto",
//     });
//     return uploadresponse;
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const deleteMedia = async (publicId) => {
//   try {
//     await cloudinary.uploader.destroy(publicId);
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const deleteVideo = async (publicId) => {
//   try {
//     await cloudinary.uploader.destroy(publicId,{resource_type:"video"});
//   } catch (error) {
//     console.log(error);
//   }
// };

import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import fs from "fs";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const uploadMedia = async (file: Buffer | string) => {
  if (typeof file === "string" && file.startsWith("data:")) {
    return cloudinary.uploader.upload(file, { resource_type: "auto" });
  }

  return new Promise<UploadApiResponse>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("No result returned from Cloudinary"));
        resolve(result);
      }
    );

    if (Buffer.isBuffer(file)) {
      Readable.from(file).pipe(uploadStream);
    } else {
      fs.createReadStream(file).pipe(uploadStream);
    }
  });
};

export const deleteMedia = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  } catch (error) {
    console.error("Delete failed:", error);
  }
};

