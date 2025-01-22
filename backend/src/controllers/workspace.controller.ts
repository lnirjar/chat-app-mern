import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";

import { Workspace } from "../models/workspace.model";
import { Invitation } from "../models/invitation.model";
import * as workspaceUtils from "../utils/workspace.utils";
import * as invitationUtils from "../utils/invitation.utils";
import { Chat } from "../models/chat.model";

// @desc Create Workspace
// @route POST /api/workspaces
// @access Private
export const createWorkspace: RequestHandler<
  unknown,
  unknown,
  { name: string },
  unknown
> = asyncHandler(async (req, res) => {
  const user = req.user;
  const { name } = req.body;

  const workspace = await Workspace.create({
    name,
    members: [{ user: user?._id, role: "owner" }],
  });

  res.status(201).json({ workspace });
});

// @desc Get Workspace
// @route GET /api/workspaces/:workspaceId
// @access Private
export const getWorkspace: RequestHandler<
  { workspaceId: string },
  unknown,
  unknown,
  unknown
> = asyncHandler(async (req, res) => {
  const user = req.user;
  const { workspaceId } = req.params;

  const workspaceWithMemberCheck = await Workspace.findOne({
    _id: workspaceId,
    members: { $elemMatch: { user: user?._id } },
  })
    .populate("members.user", "name")
    .exec();

  if (workspaceWithMemberCheck) {
    res.status(200).json({ workspace: workspaceWithMemberCheck });
    return;
  }

  const workspace = await Workspace.findById(workspaceId).select("name").exec();

  if (!workspace) {
    throw new createHttpError.NotFound("Workspace not found");
  }

  throw new createHttpError.Forbidden("You are not a member of this workspace");
});

// @desc Get all Workspaces for a user
// @route GET /api/workspaces
// @access Private
export const getUserWorkspaces: RequestHandler<
  unknown,
  unknown,
  unknown,
  unknown
> = asyncHandler(async (req, res) => {
  const user = req.user;

  const workspacesWithMemberCheck = await Workspace.find({
    members: { $elemMatch: { user: user?._id } },
  }).exec();

  if (workspacesWithMemberCheck.length === 0) {
    throw new createHttpError.NotFound(
      "No workspaces found: Join a workspace or create a new one",
    );
  }

  res.status(200).json({ workspace: workspacesWithMemberCheck });
});

// @desc Update Workspace Name
// @route PATCH /api/workspaces/:workspaceId/name
// @access Private
export const updateWorkspaceName: RequestHandler<
  { workspaceId: string },
  unknown,
  { name: string },
  unknown
> = asyncHandler(async (req, res) => {
  const user = req.user;
  const { workspaceId } = req.params;
  const { name } = req.body;

  const updatedWorkspace = await Workspace.findOneAndUpdate(
    { _id: workspaceId, members: { $elemMatch: { user: user?._id } } },
    { name },
    { new: true },
  ).exec();

  if (updatedWorkspace) {
    res.status(200).json({ workspace: updatedWorkspace });
    return;
  }

  const workspace = await Workspace.findById(workspaceId).select("name").exec();

  if (!workspace) {
    throw new createHttpError.NotFound("Workspace not found");
  }

  throw new createHttpError.Forbidden("You are not a member of this workspace");
});

// @desc Join a Workspace
// @route GET /api/workspaces/join/:inviteId
// @access Private
export const joinWorkspace: RequestHandler<
  { inviteId: string },
  unknown,
  unknown,
  unknown
> = asyncHandler(async (req, res) => {
  const user = req.user;
  const { inviteId } = req.params;

  if (!user) {
    throw new createHttpError.InternalServerError("User not found");
  }

  const invitation = await invitationUtils.validateInvitation(
    inviteId,
    user.email,
  );

  const workspaceId = invitation.workspaceId;

  const workspaceWithMemberCheck = await Workspace.findOne({
    _id: workspaceId,
    members: { $elemMatch: { user: user?._id } },
  })
    .select("name")
    .exec();

  if (workspaceWithMemberCheck) {
    res.status(304).json({
      workspace: workspaceWithMemberCheck,
      message: "You are already a member of this workspace.",
    });
    return;
  }

  const updatedWorkspace = await Workspace.findByIdAndUpdate(workspaceId, {
    $push: { members: { user: user._id } },
  }).exec();

  if (!updatedWorkspace) {
    throw new createHttpError.NotFound("Workspace not found");
  }

  res
    .status(200)
    .json({ workspace: updatedWorkspace, message: "Workspace Joined" });
});

// @desc Exit a Workspace
// @route DELETE /api/workspaces/:workspaceId/leave
// @access Private
export const exitWorkspace: RequestHandler<
  { workspaceId: string },
  unknown,
  unknown,
  unknown
> = asyncHandler(async (req, res) => {
  const user = req.user;
  const { workspaceId } = req.params;

  const updatedWorkspace = await Workspace.findOneAndUpdate(
    {
      _id: workspaceId,
      members: { $elemMatch: { user: user?._id, role: { $ne: "owner" } } },
    },
    { $pull: { members: { user: user?._id } } },
  ).exec();

  if (!updatedWorkspace) {
    throw new createHttpError.Forbidden("Can not leave the workspace");
  }

  res.status(200).json({ workspace: updatedWorkspace });
});

// @desc Remove member from Workspace
// @route DELETE /api/workspaces/:workspaceId/members/:memberId
// @access Private
export const removeMemberFromWorkspace: RequestHandler<
  { workspaceId: string; memberId: string },
  unknown,
  unknown,
  unknown
> = asyncHandler(async (req, res) => {
  const user = req.user;
  const { workspaceId, memberId } = req.params;

  const updatedWorkspace = await Workspace.findOneAndUpdate(
    {
      _id: workspaceId,
      members: {
        $elemMatch: { user: user?._id, role: { $in: ["owner", "admin"] } },
      },
    },
    {
      $pull: {
        members: { user: memberId, role: { $ne: "owner" } },
      },
    },
    { new: true },
  ).exec();

  if (!updatedWorkspace) {
    throw new createHttpError.Forbidden(
      "You are not authorised to perform this action",
    );
  }

  res.status(200).json({ workspace: updatedWorkspace });
});

// @desc Change member role
// @route PATCH /api/workspaces/:workspaceId/members/:memberId/role
// @access Private
export const changeMemberRole: RequestHandler<
  { workspaceId: string; memberId: string },
  unknown,
  { role: "member" | "admin" },
  unknown
> = asyncHandler(async (req, res) => {
  const user = req.user;
  const { workspaceId, memberId } = req.params;
  const { role } = req.body;

  const workspaceWithUserCheck = await Workspace.findOne(
    {
      _id: workspaceId,
      members: { $elemMatch: { user: user?._id, role: "owner" } },
    },
    { "members.$": 1 },
  );

  if (!workspaceWithUserCheck) {
    throw new createHttpError.Forbidden("Only the owner can assign the roles");
  }

  const updatedWorkspace = await Workspace.findOneAndUpdate(
    {
      _id: workspaceId,
      members: { $elemMatch: { user: memberId, role: { $ne: "owner" } } },
    },
    {
      $set: { "members.$.role": role },
    },
    { "members.$": 1 },
  );

  if (!updatedWorkspace) {
    throw new createHttpError.NotFound("Member not found in the workspace");
  }

  res
    .status(200)
    .json({ workspace: updatedWorkspace, message: "Role changed" });
});

// @desc Get Invitations for a Workspace
// @route GET /api/workspaces/:workspaceId/invitations
// @access Private
export const getInvitations: RequestHandler<
  { workspaceId: string },
  unknown,
  unknown,
  unknown
> = asyncHandler(async (req, res) => {
  const user = req.user;
  const { workspaceId } = req.params;

  if (!user) {
    throw new createHttpError.InternalServerError("User is required");
  }

  const { userIsMember } = await workspaceUtils.isUserMemberOfWorkspace(
    workspaceId,
    user,
  );

  if (!userIsMember) {
    throw new createHttpError.Forbidden(
      "Only the members of the workspace can get the invitation details",
    );
  }

  const invitations = await Invitation.find({ workspaceId }).exec();

  res.status(200).json({ invitations });
});

// @desc Get Invitations for a Workspace
// @route GET /api/workspaces/:workspaceId/chats
// @access Private
export const getChats: RequestHandler<
  { workspaceId: string },
  unknown,
  unknown,
  unknown
> = asyncHandler(async (req, res) => {
  const user = req.user;
  const { workspaceId } = req.params;

  if (!user) {
    throw new createHttpError.InternalServerError("User is required");
  }

  const { userIsMember } = await workspaceUtils.isUserMemberOfWorkspace(
    workspaceId,
    user,
  );

  if (!userIsMember) {
    throw new createHttpError.Forbidden(
      "Only the members of the workspace can get the chats",
    );
  }

  const chats = await Chat.find({ workspaceId }).exec();

  res.status(200).json({ chats });
});
