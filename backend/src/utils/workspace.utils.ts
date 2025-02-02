import createHttpError from "http-errors";
import { Types } from "mongoose";

import { Workspace } from "../models/workspace.model";

export const isUserOwnerOfWorkspace = async (
  workspaceId: Types.ObjectId | string,
  user: Express.User,
) => {
  const workspace = await Workspace.findById(workspaceId).exec();

  if (!workspace) {
    throw new createHttpError.NotFound("Workspace not found");
  }

  const owner = workspace.members.find((member) => member.role === "owner");

  const userIsOwner = user._id.toString() === owner?.user.toString();

  return { userIsOwner, workspace };
};

export const isUserMemberOfWorkspace = async (
  workspaceId: Types.ObjectId | string,
  user: Express.User | { _id: string },
) => {
  const workspace = await Workspace.findById(workspaceId).exec();

  if (!workspace) {
    throw new createHttpError.NotFound("Workspace not found");
  }

  const userIsMember = workspace.members.find(
    (member) => member.user.toString() === user._id.toString(),
  );

  return { userIsMember, workspace };
};
