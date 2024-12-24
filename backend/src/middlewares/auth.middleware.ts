import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  if (!req.isAuthenticated()) {
    throw new createHttpError.Unauthorized("You are not logged in");
  }

  next();
});
