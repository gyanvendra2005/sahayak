import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const uploadMedia = async (file) => {
  try {
    const uploadresponse = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    return uploadresponse;
  } catch (error) {
    console.log(error);
  }
};

export const deleteMedia = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log(error);
  }
};

export const deleteVideo = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId,{resource_type:"video"});
  } catch (error) {
    console.log(error);
  }
};

