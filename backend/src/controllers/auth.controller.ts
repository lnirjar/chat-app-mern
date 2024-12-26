import { RequestHandler } from "express";
import passport from "passport";
import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";

import { User } from "../models/user.model";
import { SessionModel } from "../models/session.model";
import { getAvatarWithInitials } from "../utils/avatar.utils";
import { getLoginMethods, LoginMethods } from "../utils/loginMethods.utils";
import { deleteAvatarFromCloudinary } from "../utils/cloudinary.utils";

// @desc Google Auth Callback
// @route POST /api/auth/google/callback
// @access Public
export const googleAuthCallback: RequestHandler<
  unknown,
  { user: User; loginMethods: LoginMethods },
  unknown,
  unknown
> = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new createHttpError.InternalServerError("Authentication failed");
  }

  const userObj = user.toObject();
  const loginMethods = getLoginMethods(userObj);
  delete userObj.googleId;
  delete userObj.password;

  res.status(200).json({ user: userObj, loginMethods });
});

// @desc Register
// @route POST /api/auth/register
// @access Public
export const register: RequestHandler<
  unknown,
  { user: User; loginMethods: LoginMethods },
  { name: string; email: string; password: string },
  unknown
> = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email }).exec();
  if (existingUser) {
    throw new createHttpError.Conflict(
      "An user with this email already exists. Please choose a different email or login instead.",
    );
  }

  // Create the user
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const avatar = getAvatarWithInitials(name);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    avatar,
  });

  req.logIn(user, (error) => {
    if (error) {
      return next(error);
    }

    const userObj = user.toObject();
    const loginMethods = getLoginMethods(userObj);
    delete userObj.googleId;
    delete userObj.password;

    res.status(201).json({ user: userObj, loginMethods });
  });
});

// @desc Login
// @route POST /api/auth/login
// @access Public
export const login: RequestHandler<
  unknown,
  { user: User; loginMethods: LoginMethods },
  { usernameOrEmail?: string; password?: string },
  unknown
> = asyncHandler(async (req, res, next) => {
  passport.authenticate(
    "local",
    (
      error: Error,
      user: Express.User | false,
      info: { message: string } | null,
    ) => {
      if (error) {
        return next(error);
      }

      if (!user) {
        const message = info?.message ?? "Authentication Failed";
        return next(createHttpError.Unauthorized(message));
      }

      req.logIn(user, (error) => {
        if (error) {
          return next(error);
        }

        const userObj = user.toObject();
        const loginMethods = getLoginMethods(userObj);
        delete userObj.googleId;
        delete userObj.password;

        res.status(200).json({ user: userObj, loginMethods });
      });
    },
  )(req, res, next);
});

// @desc Logout
// @route POST /api/auth/logout
// @access Public
export const logout: RequestHandler = asyncHandler(async (req, res, next) => {
  req.logOut((error) => {
    if (error) {
      return next(error);
    }

    res.status(200).json({ message: "Logged out successfully" });
  });
});

// @desc Change Password
// @route PATCH /api/auth/change-password
// @access Private
export const changePassword: RequestHandler<
  unknown,
  unknown,
  { password: string; newPassword: string },
  unknown
> = asyncHandler(async (req, res, next) => {
  const { password, newPassword } = req.body;
  const user = req.user;

  if (!user?.password) {
    throw new createHttpError.BadRequest(
      "No password associated with this account.",
    );
  }

  // Match current password
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new createHttpError.Unauthorized("Password is invalid");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  const lastPasswordChange = new Date();

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { password: hashedPassword, lastPasswordChange },
    { new: true },
  )
    .select("+lastPasswordChange")
    .exec();

  if (!updatedUser) {
    throw new createHttpError.Unauthorized("User not found");
  }

  // destroy all the sessions
  await SessionModel.deleteMany({
    "session.passport.user": user._id,
  });

  req.logOut((error) => {
    if (error) {
      return next(error);
    }

    res.status(200).json({
      message:
        "Password changed successfully. Logged out from all sessions. Please login again.",
    });
  });
});

// @desc Set Password (If the user is logged in with google and wants to set or change the password)
// @route POST /api/auth/set-password
// @access Private
export const setPassword: RequestHandler<
  unknown,
  unknown,
  { password: string },
  unknown
> = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const user = req.user;

  if (user?.password) {
    throw new createHttpError.Unauthorized(
      "Can not set the password: Try the `Change Password` feature instead.",
    );
  }

  if (!user?.googleId) {
    throw new createHttpError.Unauthorized(
      "Can not set the password: Please login with google or try the `Change Password` feature instead.",
    );
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const lastPasswordChange = new Date();

  const updatedUser = await User.findByIdAndUpdate(user._id, {
    password: hashedPassword,
    lastPasswordChange,
  });

  if (!updatedUser) {
    throw new createHttpError.Unauthorized("User not found");
  }

  const userObj = updatedUser.toObject();

  res.json({
    user: userObj,
    message: "Password set successfully",
  });
});

// @desc Delete Account
// @route POST /api/auth/delete-account
// @access Private
export const deleteAccount: RequestHandler<
  unknown,
  unknown,
  { password: string },
  unknown
> = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const user = req.user;

  if (!user?.password && !user?.googleId) {
    throw new createHttpError.InternalServerError(
      "No password or googleId associated with this account",
    );
  }

  if (user.password) {
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new createHttpError.Unauthorized("Password is invalid");
    }
  }

  const deletedUser = await User.findByIdAndDelete(user._id).exec();

  if (!deletedUser) {
    throw new createHttpError.NotFound("User not found");
  }

  await deleteAvatarFromCloudinary(user.id);

  const userObj: Partial<User> = deletedUser.toObject();

  res.json({
    user: userObj,
    message: "Account Deleted",
  });
});
