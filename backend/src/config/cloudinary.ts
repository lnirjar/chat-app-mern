import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Constants
export const UPLOAD_PRESETS = {
  CHAT_APP_MERN_AVATARS: "chat-app-mern-avatars",
  CHAT_APP_MERN_IMAGES: "chat-app-mern-images",
};

export const AVATARS_FOLDER = "chat-app-mern/avatars";
export const IMAGES_FOLDER = "chat-app-mern/images";
