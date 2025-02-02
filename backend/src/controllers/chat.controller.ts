import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import { Types } from "mongoose";

import { Chat } from "../models/chat.model";
import { Message } from "../models/message.model";
import * as workspaceUtils from "../utils/workspace.utils";
import * as chatUtils from "../utils/chat.utils";
import {
  ChatType,
  DM,
  MEMBER,
  OWNER,
  PRIVATE,
  Visibility,
} from "../utils/constants";

// @desc Create Chat
// @route POST /api/chats
// @access Private
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
> = asyncHandler(async (req, res) => {
  const user = req.user;
  const { workspaceId, name, visibility, chatType } = req.body;

  if (!user) {
    throw new createHttpError.InternalServerError("User not found");
  }

  const { userIsMember } = await workspaceUtils.isUserMemberOfWorkspace(
    workspaceId,
    user,
  );

  if (!userIsMember) {
    throw new createHttpError.Forbidden(
      "Only the members of the workspace can create chats",
    );
  }

  const chat = await Chat.create({
    workspaceId,
    name,
    visibility: chatType === DM ? PRIVATE : visibility,
    chatType,
    members: { user: user._id, role: OWNER },
  });

  res.status(201).json({ chat });
});

// @desc Create DM
// @route POST /api/chats/dm
// @access Private
export const createDM: RequestHandler<
  unknown,
  unknown,
  {
    workspaceId: string;
    memberId: string;
  },
  unknown
> = asyncHandler(async (req, res) => {
  const user = req.user;
  const { workspaceId, memberId } = req.body;

  if (!user) {
    throw new createHttpError.InternalServerError("User not found");
  }

  const [{ userIsMember }, { userIsMember: memberIsMember }] =
    await Promise.all([
      workspaceUtils.isUserMemberOfWorkspace(workspaceId, user),
      workspaceUtils.isUserMemberOfWorkspace(workspaceId, { _id: memberId }),
    ]);

  if (!userIsMember || !memberIsMember) {
    throw new createHttpError.Forbidden(
      "Only the members of the workspace can chat with each other",
    );
  }

  const existingDM = await Chat.findOne({
    workspaceId,
    chatType: DM,
    members: {
      $all: [
        { $elemMatch: { user: user._id } },
        { $elemMatch: { user: memberId } },
      ],
    },
  });

  if (existingDM) {
    res.status(200).json({ chat: existingDM });
    return;
  }

  const chat = await Chat.create({
    workspaceId,
    name: "DM",
    visibility: PRIVATE,
    chatType: DM,
    members: [
      { user: user._id, role: MEMBER },
      { user: memberId, role: MEMBER },
    ],
  });

  res.status(201).json({ chat });
});

// @desc Get Chat Details
// @route GET /api/chats/:chatId
// @access Private
export const getChatDetails: RequestHandler<
  { chatId: string },
  unknown,
  unknown,
  unknown
> = asyncHandler(async (req, res) => {
  const user = req.user;
  const { chatId } = req.params;

  if (!user) {
    throw new createHttpError.InternalServerError("User not found");
  }

  const chat = await Chat.findById(chatId)
    .populate("members.user", "name")
    .exec();

  if (!chat) {
    throw new createHttpError.NotFound("Chat not found");
  }

  const userIsChatMember = chat.members.find(
    (member) => member.user._id.toString() === user._id.toString(),
  );

  if (!userIsChatMember && chat.visibility === PRIVATE) {
    throw new createHttpError.Forbidden(
      "Only the members of the chat can get the details of private chat",
    );
  }

  const { workspaceId } = chat;

  const { userIsMember } = await workspaceUtils.isUserMemberOfWorkspace(
    workspaceId,
    user,
  );

  if (!userIsMember) {
    throw new createHttpError.Forbidden(
      "Only the members of the workspace can get the chat details",
    );
  }

  res.status(200).json({ chat });
});

// @desc Get Chat Messages
// @route GET /api/chats/:chatId/messages
// @access Private
export const getChatMessages: RequestHandler<
  { chatId: string },
  unknown,
  unknown,
  unknown
> = asyncHandler(async (req, res) => {
  const user = req.user;
  const { chatId } = req.params;

  if (!user) {
    throw new createHttpError.InternalServerError("User not found");
  }

  const { userIsChatMember, chat } = await chatUtils.isUserMemberOfChat(
    chatId,
    user,
  );

  if (!userIsChatMember && chat.visibility === PRIVATE) {
    throw new createHttpError.Forbidden(
      "Only the members of the chat can send or receive messages of private chats",
    );
  }

  const messages = await Message.find({ chatId }).populate("sender");

  res.status(200).json({ messages });
});

// @desc Update Chat
// @route PATCH /api/chats/:chatId
// @access Private
export const updateChat: RequestHandler<
  { chatId: string },
  unknown,
  {
    name?: string;
    visibility?: Visibility;
  },
  unknown
> = asyncHandler(async (req, res) => {
  const user = req.user;
  const { chatId } = req.params;
  const { name, visibility } = req.body;

  if (!user) {
    throw new createHttpError.InternalServerError("User not found");
  }

  await chatUtils.checkUpdateChatPermissions(chatId, user);

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { name, visibility },
    { new: true },
  );

  res.status(200).json({ chat: updatedChat });
});

// @desc Add members to Chat
// @route POST /api/chats/:chatId/members
// @access Private
export const addMembers: RequestHandler<
  { chatId: string },
  unknown,
  {
    members: Types.ObjectId[];
  },
  unknown
> = asyncHandler(async (req, res) => {
  const user = req.user;
  const { chatId } = req.params;
  const { members } = req.body;

  if (!user) {
    throw new createHttpError.InternalServerError("User not found");
  }

  const { chat } = await chatUtils.checkAddChatMemberPermissions(
    chatId,
    user,
    members,
  );

  const membersToAdd = members
    .filter((memberId) => {
      const foundMember = chat.members.find(
        (member) => member.user.toString() === memberId.toString(),
      );

      return !foundMember;
    })
    .map((memberId) => ({ user: memberId, role: MEMBER }));

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { members: membersToAdd } },
    { new: true },
  );

  res.status(200).json({ chat: updatedChat });
});

// @desc Remove member from Chat
// @route DELETE /api/chats/:chatId/members/:memberId
// @access Private
export const removeMember: RequestHandler<
  { chatId: string; memberId: string },
  unknown,
  unknown,
  unknown
> = asyncHandler(async (req, res) => {
  const user = req.user;
  const { chatId, memberId } = req.params;

  if (!user) {
    throw new createHttpError.InternalServerError("User not found");
  }

  await chatUtils.checkRemoveChatMemberPermissions(chatId, user, memberId);

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { members: { user: memberId } } },
    { new: true },
  );

  res.status(200).json({ chat: updatedChat });
});

// @desc Delete Chat
// @route DELETE /api/chats/:chatId
// @access Private
export const deleteChat: RequestHandler<
  { chatId: string },
  unknown,
  unknown,
  unknown
> = asyncHandler(async (req, res) => {
  const user = req.user;
  const { chatId } = req.params;

  if (!user) {
    throw new createHttpError.InternalServerError("User not found");
  }

  await chatUtils.checkDeleteChatPermissions(chatId, user);

  const deletedChat = await Chat.findByIdAndDelete(chatId);

  res.status(200).json({ chat: deletedChat });
});
