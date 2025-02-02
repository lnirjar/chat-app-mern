import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";

import { Invitation } from "../models/invitation.model";
import * as workspaceUtils from "../utils/workspace.utils";

// @desc Create Invitation
// @route POST /api/invitations
// @access Private
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
> = asyncHandler(async (req, res) => {
  const user = req.user;
  const { workspaceId, inviteType, expiresAt, invitees } = req.body;

  if (!user) {
    throw new createHttpError.InternalServerError("User not found");
  }

  const { userIsOwner } = await workspaceUtils.isUserOwnerOfWorkspace(
    workspaceId,
    user,
  );

  if (!userIsOwner) {
    throw new createHttpError.Forbidden(
      "Only the owner of the workspace can create invitations",
    );
  }

  const invitation = await Invitation.create({
    workspaceId,
    inviteType,
    expiresAt,
    invitees,
  });

  res.status(201).json({ invitation });
});

// @desc Get Workspace Name for Invitation
// @route GET /api/invitaitons/:invitationId/workspace
// @access Public
export const getWorkspaceNameForInvitation: RequestHandler<
  { invitationId: string },
  unknown,
  unknown,
  unknown
> = asyncHandler(async (req, res) => {
  const { invitationId } = req.params;

  const invitation = await Invitation.findById(invitationId)
    .populate("workspaceId", "name")
    .exec();

  if (!invitation) {
    throw new createHttpError.NotFound("Invitation not found");
  }

  res.status(200).json({ invitation });
});

// @desc Get Invitation Details
// @route GET /api/invitaitons/:invitationId
// @access Private
export const getInvitationDetails: RequestHandler<
  { invitationId: string },
  unknown,
  unknown,
  unknown
> = asyncHandler(async (req, res) => {
  const user = req.user;
  const { invitationId } = req.params;

  if (!user) {
    throw new createHttpError.InternalServerError("User not found");
  }

  const invitation = await Invitation.findById(invitationId).exec();

  if (!invitation) {
    throw new createHttpError.NotFound("Invitation not found");
  }

  const { workspaceId } = invitation;

  const { userIsMember } = await workspaceUtils.isUserMemberOfWorkspace(
    workspaceId,
    user,
  );

  if (!userIsMember) {
    throw new createHttpError.Forbidden(
      "Only the members of the workspace can get the invitation details",
    );
  }

  res.status(200).json({ invitation });
});

// @desc Update Invitation
// @route PATCH /api/invitaitons/:invitationId
// @access Private
export const updateInvitation: RequestHandler<
  { invitationId: string },
  unknown,
  {
    inviteType?: "public" | "private";
    expiresAt?: Date;
    invitees?: string[];
  },
  unknown
> = asyncHandler(async (req, res) => {
  const user = req.user;
  const { invitationId } = req.params;
  const { inviteType, expiresAt, invitees } = req.body;

  if (!user) {
    throw new createHttpError.InternalServerError("User not found");
  }

  const invitation = await Invitation.findById(invitationId).exec();

  if (!invitation) {
    throw new createHttpError.NotFound("Invitation not found");
  }

  const { workspaceId } = invitation;

  const { userIsOwner } = await workspaceUtils.isUserOwnerOfWorkspace(
    workspaceId,
    user,
  );

  if (!userIsOwner) {
    throw new createHttpError.Forbidden(
      "Only the owner of the workspace can update invitations",
    );
  }

  const updatedInvitation = await Invitation.findByIdAndUpdate(
    invitationId,
    { inviteType, expiresAt, invitees },
    { new: true },
  );

  res.status(200).json({ invitation: updatedInvitation });
});

// @desc Delete Invitation
// @route DELETE /api/invitaitons/:invitationId
// @access Private
export const deleteInvitation: RequestHandler<
  { invitationId: string },
  unknown,
  unknown,
  unknown
> = asyncHandler(async (req, res) => {
  const user = req.user;
  const { invitationId } = req.params;

  if (!user) {
    throw new createHttpError.InternalServerError("User not found");
  }

  const invitation = await Invitation.findById(invitationId).exec();

  if (!invitation) {
    throw new createHttpError.NotFound("Invitation not found");
  }

  const { workspaceId } = invitation;

  const { userIsOwner } = await workspaceUtils.isUserOwnerOfWorkspace(
    workspaceId,
    user,
  );

  if (!userIsOwner) {
    throw new createHttpError.Forbidden(
      "Only the owner of the workspace can delete invitations",
    );
  }

  await Invitation.findByIdAndDelete(invitationId).exec();

  res.status(200).json({ message: "Invitation delete successfully" });
});
