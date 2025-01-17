import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import { Types } from "mongoose";
import { z } from "zod";

import {
  ChatType,
  DM,
  GROUP,
  PRIVATE,
  PUBLIC,
  Visibility,
} from "../utils/constants";

export const createChat: RequestHandler<
  unknown,
  unknown,
  {
    workspaceId: string;
    name: string;
    visibility?: Visibility;
    chatType?: ChatType;
  },
  unknown
> = asyncHandler(async (req, res, next) => {
  const validationSchema = z.object({
    workspaceId: z
      .string({ message: "Workspace id is required" })
      .trim()
      .min(1, { message: "Workspace id is required" })
      .max(50, {
        message: "Workspace id can not contain more than 50 characters",
      }),
    name: z
      .string({ message: "Chat name is required" })
      .trim()
      .min(1, { message: "Chat name is required" })
      .max(80, { message: "Chat name can contain maximum 80 characters" }),
    visibility: z.enum([PUBLIC, PRIVATE]).optional(),
    chatType: z.enum([GROUP, DM]).optional(),
  });

  const result = validationSchema.safeParse(req.body);

  if (!result.success) {
    throw new createHttpError.BadRequest(result.error.issues[0].message);
  }

  next();
});

export const getChatDetails: RequestHandler<
  { chatId: string },
  unknown,
  unknown,
  unknown
> = asyncHandler(async (req, res, next) => {
  const validationSchema = z.object({
    chatId: z
      .string({ message: "Chat id is required" })
      .trim()
      .min(1, { message: "Chat id is required" })
      .max(50, {
        message: "Chat id can not contain more than 50 characters",
      }),
  });

  const result = validationSchema.safeParse(req.params);

  if (!result.success) {
    throw new createHttpError.BadRequest(result.error.issues[0].message);
  }

  next();
});

export const updateChat: RequestHandler<
  { chatId: string },
  unknown,
  {
    name?: string;
    visibility?: Visibility;
  },
  unknown
> = asyncHandler(async (req, res, next) => {
  const validationSchema = z.object({
    chatId: z
      .string({ message: "Chat id is required" })
      .trim()
      .min(1, { message: "Chat id is required" })
      .max(50, {
        message: "Chat id can not contain more than 50 characters",
      }),
    name: z
      .string({ message: "Chat name must be a string" })
      .trim()
      .min(1, { message: "Chat name is required" })
      .max(80, { message: "Chat name can contain maximum 80 characters" })
      .optional(),
    visibility: z.enum([PUBLIC, PRIVATE]).optional(),
  });

  const result = validationSchema.safeParse({ ...req.body, ...req.params });

  if (!result.success) {
    throw new createHttpError.BadRequest(result.error.issues[0].message);
  }

  next();
});

export const addMembers: RequestHandler<
  { chatId: string },
  unknown,
  {
    members: Types.ObjectId[] | string[];
  },
  unknown
> = asyncHandler(async (req, res, next) => {
  const validationSchema = z.object({
    chatId: z
      .string({ message: "Chat id is required" })
      .trim()
      .min(1, { message: "Chat id is required" })
      .max(50, {
        message: "Chat id can not contain more than 50 characters",
      }),
    members: z.array(
      z.string({ message: "Members must be an array of string" }),
      { message: "Members is required" },
    ),
  });

  const result = validationSchema.safeParse({ ...req.body, ...req.params });

  if (!result.success) {
    throw new createHttpError.BadRequest(result.error.issues[0].message);
  }

  next();
});

export const removeMember: RequestHandler<
  { chatId: string; memberId: string },
  unknown,
  unknown,
  unknown
> = asyncHandler(async (req, res, next) => {
  const validationSchema = z.object({
    chatId: z
      .string({ message: "Chat id is required" })
      .trim()
      .min(1, { message: "Chat id is required" })
      .max(50, {
        message: "Chat id can not contain more than 50 characters",
      }),
    memberId: z
      .string({ message: "Member id is required" })
      .trim()
      .min(1, { message: "Member id is required" })
      .max(50, {
        message: "Member id can not contain more than 50 characters",
      }),
  });

  const result = validationSchema.safeParse(req.params);

  if (!result.success) {
    throw new createHttpError.BadRequest(result.error.issues[0].message);
  }

  next();
});

export const deleteChat: RequestHandler<
  { chatId: string },
  unknown,
  unknown,
  unknown
> = asyncHandler(async (req, res, next) => {
  const validationSchema = z.object({
    chatId: z
      .string({ message: "Chat id is required" })
      .trim()
      .min(1, { message: "Chat id is required" })
      .max(50, {
        message: "Chat id can not contain more than 50 characters",
      }),
  });

  const result = validationSchema.safeParse(req.params);

  if (!result.success) {
    throw new createHttpError.BadRequest(result.error.issues[0].message);
  }

  next();
});
