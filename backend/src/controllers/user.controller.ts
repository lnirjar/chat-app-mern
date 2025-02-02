import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";

import { User } from "../models/user.model";
import { Workspace } from "../models/workspace.model";
import { getLoginMethods, LoginMethods } from "../utils/loginMethods.utils";
import { uploadAvatarToCloudinary } from "../utils/cloudinary.utils";
import { MemberRole } from "../utils/constants";

// @desc isEmailAvailable
// @route GET /api/user/isEmailAvailable
// @access Public
export const isEmailAvailable: RequestHandler<
  unknown,
  unknown,
  unknown,
  { email?: string }
> = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Email available" });
});

// @desc isUsernameAvailable
// @route GET /api/user/isUsernameAvailable
// @access Public
export const isUsernameAvailable: RequestHandler<
  unknown,
  unknown,
  unknown,
  { username?: string }
> = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Username available" });
});

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

// @desc Get User and Workspace data
// @route GET /api/user/data
// @access Private
export const getUserData: RequestHandler<
  unknown,
  {
    user: User;
    loginMethods: LoginMethods;
    workspaces: (Omit<Workspace, "members"> & { role?: MemberRole })[];
  },
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

  const workspacesWithMemberCheck = await Workspace.find({
    members: { $elemMatch: { user: user?._id } },
  }).exec();

  const workspacesWithUserRole = workspacesWithMemberCheck.map(
    ({ _id, name, members, createdAt, updatedAt }) => {
      const member = members.find(
        (member) => member.user.toString() === user._id.toString(),
      );
      return { _id, name, createdAt, updatedAt, role: member?.role };
    },
  );

  res.status(200).json({
    user: userObj,
    loginMethods,
    workspaces: workspacesWithUserRole,
  });
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

  const uploadResult = await uploadAvatarToCloudinary(file.path, user?.id);

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

// @desc Update Name
// @desc PATCH /api/user/name
// @access Private
export const updateName: RequestHandler<
  unknown,
  unknown,
  { name: string },
  unknown
> = asyncHandler(async (req, res) => {
  const user = req.user;
  const { name } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    user?._id,
    { name },
    { new: true },
  );

  if (!updatedUser) {
    throw new createHttpError.NotFound("User not found");
  }

  const userObj = updatedUser.toObject();

  res.json({ user: userObj });
});

// @desc Update Email
// @desc PATCH /api/user/email
// @access Private
export const updateEmail: RequestHandler<
  unknown,
  unknown,
  { email: string },
  unknown
> = asyncHandler(async (req, res) => {
  const user = req.user;
  const { email } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    user?._id,
    { email },
    { new: true },
  ).select("+email");

  if (!updatedUser) {
    throw new createHttpError.NotFound("User not found");
  }

  const userObj = updatedUser.toObject();

  res.json({ user: userObj });
});

// @desc Update Username
// @desc PATCH /api/user/username
// @access Private
export const updateUsername: RequestHandler<
  unknown,
  unknown,
  { username: string },
  unknown
> = asyncHandler(async (req, res) => {
  const user = req.user;
  const { username } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    user?._id,
    { username },
    { new: true },
  );

  if (!updatedUser) {
    throw new createHttpError.NotFound("User not found");
  }

  const userObj = updatedUser.toObject();

  res.json({ user: userObj });
});
