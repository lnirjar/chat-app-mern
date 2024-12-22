import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";

// @desc hello-world
// @route GET /api/user/hello-world
// @access Public
export const helloWorld: RequestHandler = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Hello, World!" });
});
