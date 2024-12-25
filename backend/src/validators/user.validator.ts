import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";

export const getUser = asyncHandler(async (req, res, next) => {
  next();
});

export const updateAvatar = asyncHandler(async (req, res, next) => {
  const file = req.file;
  if (!file) {
    throw new createHttpError.BadRequest("Avatar image is required");
  }
  next();
});
