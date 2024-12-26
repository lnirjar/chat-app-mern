import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";

import { User } from "../models/user.model";

export const isEmailAvailable: RequestHandler<
  unknown,
  unknown,
  { email: string },
  { email: string }
> = asyncHandler(async (req, res, next) => {
  const email = req.body.email || req.query.email;

  if (email === req.user?.email) {
    next();
    return;
  }

  const user = await User.findOne({ email }).select("email");

  if (user) {
    throw new createHttpError.Conflict("User with this email already exists");
  }

  next();
});

export const isUsernameAvailable: RequestHandler<
  unknown,
  unknown,
  { username: string },
  { username: string }
> = asyncHandler(async (req, res, next) => {
  const username = req.body.username || req.query.username;

  if (username === req.user?.username) {
    next();
    return;
  }

  const user = await User.findOne({ username });

  if (user) {
    throw new createHttpError.Conflict(
      "User with this username already exists",
    );
  }

  next();
});
