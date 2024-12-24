import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";

import { User } from "../models/user.model";
import { getLoginMethods, LoginMethods } from "../utils/loginMethods.utils";

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
