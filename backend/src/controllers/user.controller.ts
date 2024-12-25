import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import { UploadApiResponse } from "cloudinary";
import { unlink } from "node:fs/promises";

import { User } from "../models/user.model";
import { getLoginMethods, LoginMethods } from "../utils/loginMethods.utils";
import { UPLOAD_PRESETS, uploadOnCloudinary } from "../config/cloudinary";

// @desc Get User
// @route GET /api/user
// @access Private
export const getUser: RequestHandler<
  unknown,
  { user: User; loginMethods: LoginMethods },
  unknown,
  unknown
> = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new createHttpError.InternalServerError("User not found");
  }

  const userObj = user.toObject();
  const loginMethods = getLoginMethods(userObj);
  delete userObj.googleId;
  delete userObj.password;

  res.json({ user: userObj, loginMethods });
});

// @desc Update Avatar
// @route PATCH /api/user/avatar
// @access Private
export const updateAvatar = asyncHandler(async (req, res) => {
  const user = req.user;
  const file = req.file;

  if (!file) {
    throw new createHttpError.BadRequest("File is required");
  }

  // Upload on cloudinary
  let uploadResult: UploadApiResponse;
  try {
    uploadResult = await uploadOnCloudinary(file.path, {
      public_id: `avatar-${user?.id}`,
      upload_preset: UPLOAD_PRESETS.CHAT_APP_MERN_AVATARS,
    });

    await unlink(file.path);
  } catch (error) {
    await unlink(file.path);

    let message = "Something went wrong while uploading avatar";
    if (error instanceof Error) {
      message += `\n${error.message}`;
    }

    throw new createHttpError.InternalServerError(message);
  }

  // Update user
  const updatedUser = await User.findByIdAndUpdate(
    user?._id,
    { avatar: uploadResult.secure_url },
    { new: true },
  );

  if (!updatedUser) {
    throw new createHttpError.NotFound("User not found");
  }

  const userObj = updatedUser.toObject();
  res.json({ user: userObj });
});
