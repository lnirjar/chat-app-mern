import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import { z } from "zod";

export const isEmailAvailable: RequestHandler<
  unknown,
  unknown,
  unknown,
  { email?: string }
> = asyncHandler(async (req, res, next) => {
  const validationSchema = z.object({
    email: z
      .string({ message: "Email is required" })
      .trim()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" }),
  });

  const result = validationSchema.safeParse(req.query);

  if (!result.success) {
    throw new createHttpError.BadRequest(result.error.issues[0].message);
  }

  next();
});

export const isUsernameAvailable: RequestHandler<
  unknown,
  unknown,
  unknown,
  { username?: string }
> = asyncHandler(async (req, res, next) => {
  const validationSchema = z.object({
    username: z
      .string({ message: "Username is required" })
      .trim()
      .min(1, { message: "Username is required" })
      .min(3, { message: "Username must be at least 3 characters long" })
      .max(20, { message: "Username must be at most 20 characters long" })
      .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, {
        message:
          "Username must start with a letter and can only contain letters, numbers, and underscores",
      }),
  });

  const result = validationSchema.safeParse(req.query);

  if (!result.success) {
    throw new createHttpError.BadRequest(result.error.issues[0].message);
  }

  next();
});

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

export const updateName: RequestHandler<
  unknown,
  unknown,
  { name?: string },
  unknown
> = asyncHandler(async (req, res, next) => {
  const validationSchema = z.object({
    name: z
      .string({ message: "Name is required" })
      .trim()
      .min(1, { message: "Name is required" })
      .max(30, { message: "Name must contain max 30 characters" }),
  });

  const result = validationSchema.safeParse(req.body);

  if (!result.success) {
    throw new createHttpError.BadRequest(result.error.issues[0].message);
  }

  next();
});

export const updateEmail: RequestHandler<
  unknown,
  unknown,
  { email?: string },
  unknown
> = asyncHandler(async (req, res, next) => {
  const validationSchema = z.object({
    email: z
      .string({ message: "Email is required" })
      .trim()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" }),
  });

  const result = validationSchema.safeParse(req.body);

  if (!result.success) {
    throw new createHttpError.BadRequest(result.error.issues[0].message);
  }

  next();
});

export const updateUsername: RequestHandler<
  unknown,
  unknown,
  { username?: string },
  unknown
> = asyncHandler(async (req, res, next) => {
  const validationSchema = z.object({
    username: z
      .string({ message: "Username is required" })
      .trim()
      .min(1, { message: "Username is required" })
      .min(3, { message: "Username must be at least 3 characters long" })
      .max(20, { message: "Username must be at most 20 characters long" })
      .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, {
        message:
          "Username must start with a letter and can only contain letters, numbers, and underscores",
      }),
  });

  const result = validationSchema.safeParse(req.body);

  if (!result.success) {
    throw new createHttpError.BadRequest(result.error.issues[0].message);
  }

  next();
});
