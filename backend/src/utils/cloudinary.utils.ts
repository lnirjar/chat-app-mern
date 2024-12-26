import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import createHttpError from "http-errors";
import { unlink } from "node:fs/promises";

import { AVATARS_FOLDER, UPLOAD_PRESETS } from "../config/cloudinary";

const upload = cloudinary.uploader.upload;
const deleteFromCloudinary = cloudinary.uploader.destroy;

const uploadToCloudinary = async (
  filePath: string,
  options: { public_id?: string; upload_preset: string },
): Promise<UploadApiResponse> => {
  try {
    const uploadResult = await upload(filePath, options);

    if (!filePath.startsWith("http")) {
      await unlink(filePath);
    }

    return uploadResult;
  } catch (error) {
    if (!filePath.startsWith("http")) {
      await unlink(filePath);
    }

    const message =
      error instanceof Error
        ? `Something went wrong while uploading to Cloudinary: ${error.message}`
        : "Something went wrong while uploading to Cloudinary.";

    throw new createHttpError.InternalServerError(message);
  }
};

export const uploadAvatarToCloudinary = async (
  filePath: string,
  userId: string,
) => {
  const avatarPublicId = `avatar-${userId}`;
  const uploadPreset = UPLOAD_PRESETS.CHAT_APP_MERN_AVATARS;
  const uploadResult = await uploadToCloudinary(filePath, {
    public_id: avatarPublicId,
    upload_preset: uploadPreset,
  });

  return uploadResult;
};

export const uploadImageToCloudinary = async (filePath: string) => {
  const uploadPreset = UPLOAD_PRESETS.CHAT_APP_MERN_IMAGES;
  const uploadResult = await uploadToCloudinary(filePath, {
    upload_preset: uploadPreset,
  });

  return uploadResult;
};

export const deleteAvatarFromCloudinary = async (userId: string) => {
  const avatarPublicId = `${AVATARS_FOLDER}/avatar-${userId}`;
  try {
    await deleteFromCloudinary(avatarPublicId, {
      invalidate: true,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? `Something went wrong while deleting avatar from Cloudinary \n` +
          `public_id: ${avatarPublicId} \n` +
          `${error.message}`
        : "Something went wrong while deleting avatar from Cloudinary.";

    console.error(new Error(message));
  }
};

export const deleteImageFromCloudinary = async (publicId: string) => {
  try {
    await deleteFromCloudinary(publicId, {
      invalidate: true,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? `Something went wrong while deleting image from Cloudinary \n` +
          `public_id: ${publicId} \n` +
          `${error.message}`
        : "Something went wrong while deleting image from Cloudinary.";

    console.error(new Error(message));
  }
};
