import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import { z } from "zod";

export const createInvitation: RequestHandler<
  unknown,
  unknown,
  {
    workspaceId: string;
    inviteType?: "public" | "private";
    expiresAt?: Date;
    invitees?: string[];
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
    inviteType: z.enum(["public", "private"]).optional(),
    expiresAt: z.date({ message: "expiresAt must be a date" }).optional(),
    invitees: z
      .array(
        z
          .string({ message: "invitees must be an array of emails" })
          .email({ message: "invitees must be an array of emails" }),
      )
      .optional(),
  });

  const result = validationSchema.safeParse(req.body);

  if (!result.success) {
    throw new createHttpError.BadRequest(result.error.issues[0].message);
  }

  next();
});

export const getInvitationDetails: RequestHandler<
  { invitationId: string },
  unknown,
  unknown,
  unknown
> = asyncHandler(async (req, res, next) => {
  const validationSchema = z.object({
    invitationId: z
      .string({ message: "Invitation id is required" })
      .trim()
      .min(1, { message: "Invitation id is required" })
      .max(50, {
        message: "Invitation id can not contain more than 50 characters",
      }),
  });

  const result = validationSchema.safeParse(req.params);

  if (!result.success) {
    throw new createHttpError.BadRequest(result.error.issues[0].message);
  }

  next();
});

export const updateInvitation: RequestHandler<
  { invitationId: string },
  unknown,
  {
    inviteType?: "public" | "private";
    expiresAt?: Date;
    invitees?: string[];
  },
  unknown
> = asyncHandler(async (req, res, next) => {
  const validationSchema = z.object({
    invitationId: z
      .string({ message: "Invitation id is required" })
      .trim()
      .min(1, { message: "Invitation id is required" })
      .max(50, {
        message: "Invitation id can not contain more than 50 characters",
      }),
    inviteType: z.enum(["public", "private"]).optional(),
    expiresAt: z.date({ message: "expiresAt must be a date" }).optional(),
    invitees: z
      .array(z.string({ message: "invitees must be an array of string" }))
      .optional(),
  });

  const result = validationSchema.safeParse({ ...req.body, ...req.params });

  if (!result.success) {
    throw new createHttpError.BadRequest(result.error.issues[0].message);
  }

  next();
});

export const deleteInvitation: RequestHandler<
  { invitationId: string },
  unknown,
  unknown,
  unknown
> = asyncHandler(async (req, res, next) => {
  const validationSchema = z.object({
    invitationId: z
      .string({ message: "Invitation id is required" })
      .trim()
      .min(1, { message: "Invitation id is required" })
      .max(50, {
        message: "Invitation id can not contain more than 50 characters",
      }),
  });

  const result = validationSchema.safeParse(req.params);

  if (!result.success) {
    throw new createHttpError.BadRequest(result.error.issues[0].message);
  }

  next();
});
