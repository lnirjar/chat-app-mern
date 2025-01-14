import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import { z } from "zod";

export const createWorkspace: RequestHandler<
  unknown,
  unknown,
  { name: string },
  unknown
> = asyncHandler(async (req, res, next) => {
  const validationSchema = z.object({
    name: z
      .string({ message: "Workspace name is required" })
      .trim()
      .min(1, { message: "Workspace name is required" })
      .max(80, { message: "Workspace name can contain maximum 80 characters" }),
  });

  const result = validationSchema.safeParse(req.body);

  if (!result.success) {
    throw new createHttpError.BadRequest(result.error.issues[0].message);
  }

  next();
});

export const getWorkspace: RequestHandler<
  { workspaceId: string },
  unknown,
  unknown,
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
  });

  const result = validationSchema.safeParse(req.params);

  if (!result.success) {
    throw new createHttpError.BadRequest(result.error.issues[0].message);
  }

  next();
});

export const getInvitations: RequestHandler<
  { workspaceId: string },
  unknown,
  unknown,
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
  });

  const result = validationSchema.safeParse(req.params);

  if (!result.success) {
    throw new createHttpError.BadRequest(result.error.issues[0].message);
  }

  next();
});

export const getUserWorkspaces: RequestHandler<
  unknown,
  unknown,
  unknown,
  unknown
> = asyncHandler(async (req, res, next) => {
  next();
});

export const updateWorkspaceName: RequestHandler<
  { workspaceId: string },
  unknown,
  { name: string },
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
      .string({ message: "Workspace name is required" })
      .trim()
      .min(1, { message: "Workspace name is required" })
      .max(80, { message: "Workspace name can contain maximum 80 characters" }),
  });

  const { workspaceId } = req.params;
  const { name } = req.body;
  const result = validationSchema.safeParse({ workspaceId, name });

  if (!result.success) {
    throw new createHttpError.BadRequest(result.error.issues[0].message);
  }

  next();
});

export const joinWorkspace: RequestHandler<
  { inviteId: string },
  unknown,
  unknown,
  unknown
> = asyncHandler(async (req, res, next) => {
  const validationSchema = z.object({
    inviteId: z
      .string({ message: "Invite id is required" })
      .trim()
      .min(1, { message: "Invite id is required" })
      .max(50, {
        message: "Invite id can not contain more than 50 characters",
      }),
  });

  const result = validationSchema.safeParse(req.params);

  if (!result.success) {
    throw new createHttpError.BadRequest(result.error.issues[0].message);
  }

  next();
});

export const exitWorkspace: RequestHandler<
  { workspaceId: string },
  unknown,
  unknown,
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
  });

  const result = validationSchema.safeParse(req.params);

  if (!result.success) {
    throw new createHttpError.BadRequest(result.error.issues[0].message);
  }

  next();
});

export const removeMemberFromWorkspace: RequestHandler<
  { workspaceId: string; memberId: string },
  unknown,
  unknown,
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

export const changeMemberRole: RequestHandler<
  { workspaceId: string; memberId: string },
  unknown,
  { role: "member" | "admin" },
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
    memberId: z
      .string({ message: "Member id is required" })
      .trim()
      .min(1, { message: "Member id is required" })
      .max(50, {
        message: "Member id can not contain more than 50 characters",
      }),
    role: z.enum(["member", "admin"], {
      message: "Role must be either 'member' or 'admin'",
    }),
  });

  const { workspaceId, memberId } = req.params;
  const { role } = req.body;
  const result = validationSchema.safeParse({ workspaceId, memberId, role });

  if (!result.success) {
    throw new createHttpError.BadRequest(result.error.issues[0].message);
  }

  next();
});
