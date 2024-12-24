import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import { z } from "zod";

export const register: RequestHandler<
  unknown,
  unknown,
  { name?: string; email?: string; password?: string },
  unknown
> = asyncHandler(async (req, res, next) => {
  const validationSchema = z.object({
    name: z
      .string()
      .trim()
      .min(1, { message: "Name is required" })
      .max(30, { message: "Name must contain max 30 characters" }),
    email: z
      .string({ message: "Email is required" })
      .trim()
      .min(1, { message: "Email is required" })
      .email(),
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(6, { message: "Password must contain atleast 6 characters" })
      .max(20, { message: "Password must contain max 20 characters" })
      .regex(/^\S+$/, {
        message: "Password should not contain any whitespace",
      }),
  });

  const result = validationSchema.safeParse(req.body);

  if (!result.success) {
    throw new createHttpError.BadRequest(result.error.issues[0].message);
  }

  next();
});

export const login: RequestHandler<
  unknown,
  unknown,
  { usernameOrEmail?: string; password?: string },
  unknown
> = asyncHandler(async (req, res, next) => {
  const validationSchema = z.object({
    usernameOrEmail: z
      .string({ message: "Username or Email is required" })
      .trim()
      .min(1, { message: "Username or Email is required" })
      .max(30, { message: "Should contain max 30 characters" }),
    password: z
      .string({ message: "Password is required" })
      .min(1, { message: "Password is required" })
      .max(20, { message: "Password must contain max 20 characters" }),
  });

  const result = validationSchema.safeParse(req.body);

  if (!result.success) {
    throw new createHttpError.BadRequest(result.error.issues[0].message);
  }

  next();
});

export const logout = asyncHandler(async (req, res, next) => {
  next();
});

export const changePassword: RequestHandler<
  unknown,
  unknown,
  { password?: string; newPassword?: string },
  unknown
> = asyncHandler(async (req, res, next) => {
  const validationSchema = z.object({
    password: z
      .string({ message: "Current Password is required" })
      .min(1, { message: "Current Password is required" })
      .max(20, { message: "Current Password must contain max 20 characters" }),
    newPassword: z
      .string()
      .min(1, { message: "New Password is required" })
      .min(6, { message: "New Password must contain atleast 6 characters" })
      .max(20, { message: "New Password must contain max 20 characters" })
      .regex(/^\S+$/, {
        message: "New Password should not contain any whitespace",
      }),
  });

  const result = validationSchema.safeParse(req.body);

  if (!result.success) {
    throw new createHttpError.BadRequest(result.error.issues[0].message);
  }

  next();
});

export const setPassword: RequestHandler<
  unknown,
  unknown,
  { password: string },
  unknown
> = asyncHandler(async (req, res, next) => {
  const validationSchema = z.object({
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(6, { message: "Password must contain atleast 6 characters" })
      .max(20, { message: "Password must contain max 20 characters" })
      .regex(/^\S+$/, {
        message: "Password should not contain any whitespace",
      }),
  });

  const result = validationSchema.safeParse(req.body);

  if (!result.success) {
    throw new createHttpError.BadRequest(result.error.issues[0].message);
  }

  next();
});

export const deleteAccount: RequestHandler<
  unknown,
  unknown,
  { password: string },
  unknown
> = asyncHandler(async (req, res, next) => {
  const validationSchema = z.object({
    password: z
      .string({ message: "Password is required" })
      .min(1, { message: "Password is required" })
      .max(20, { message: "Password must contain max 20 characters" }),
  });

  const result = validationSchema.safeParse(req.body);

  if (!result.success) {
    throw new createHttpError.BadRequest(result.error.issues[0].message);
  }

  next();
});
