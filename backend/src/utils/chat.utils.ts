import { Types } from "mongoose";
import createHttpError from "http-errors";

import { Chat } from "../models/chat.model";
import { ADMIN, OWNER } from "./constants";
import * as workspaceUtils from "./workspace.utils";

export const isUserMemberOfChat = async (
  chatId: Types.ObjectId | string,
  user: Express.User,
) => {
  const chat = await Chat.findById(chatId).exec();

  if (!chat) {
    throw new createHttpError.NotFound("Chat not found");
  }

  const userIsChatMember = chat.members.find(
    (member) => member.user.toString() === user._id.toString(),
  );

  return { userIsChatMember, chat };
};

export const getChatMember = async (
  chatId: Types.ObjectId | string,
  user: Express.User,
) => {
  const chat = await Chat.findById(chatId).exec();

  if (!chat) {
    throw new createHttpError.NotFound("Chat not found");
  }

  const chatMember = chat.members.find(
    (member) => member.user.toString() === user._id.toString(),
  );

  return { chatMember, chat };
};

export const isUserAdminOrOwnerOfChat = async (
  chatId: Types.ObjectId | string,
  user: Express.User,
) => {
  const { chatMember, chat } = await getChatMember(chatId, user);

  const userIsChatAdminOrOwner =
    chatMember?.role === OWNER || chatMember?.role === ADMIN;

  return { userIsChatAdminOrOwner, chat };
};

export const checkAddChatMemberPermissions = async (
  chatId: Types.ObjectId | string,
  user: Express.User,
  members: Types.ObjectId[],
) => {
  const { userIsChatAdminOrOwner, chat } = await isUserAdminOrOwnerOfChat(
    chatId,
    user,
  );

  if (chat.chatType === "dm") {
    throw new createHttpError.Forbidden("You can not add members to a DM");
  }

  if (chat.visibility === "private" && !userIsChatAdminOrOwner) {
    throw new createHttpError.Forbidden(
      "This is a private chat. Only the owner or admin of this chat can add new members.",
    );
  }

  const { workspaceId } = chat;

  const { userIsMember, workspace } =
    await workspaceUtils.isUserMemberOfWorkspace(workspaceId, user);

  if (!userIsMember) {
    throw new createHttpError.Forbidden(
      "Only the member of the workspace can add member to chats",
    );
  }

  members.forEach((memberId) => {
    const isWorkspaceMember = workspace.members.find(
      (member) => member.user.toString() === memberId.toString(),
    );

    if (!isWorkspaceMember) {
      throw new createHttpError.Forbidden(
        `You can only add a workspace member to the chat. User with _id ${memberId} is not a workspace member.`,
      );
    }
  });

  return { chat };
};

export const checkRemoveChatMemberPermissions = async (
  chatId: Types.ObjectId | string,
  user: Express.User,
  memberId: Types.ObjectId | string,
) => {
  const { userIsChatAdminOrOwner, chat } = await isUserAdminOrOwnerOfChat(
    chatId,
    user,
  );

  if (chat.chatType === "dm") {
    throw new createHttpError.Forbidden("You can not remove members from a DM");
  }

  if (memberId.toString() !== user._id.toString() && !userIsChatAdminOrOwner) {
    throw new createHttpError.Forbidden(
      "Only the owner or admin of this chat can remove members.",
    );
  }

  return { chat };
};

export const checkDeleteChatPermissions = async (
  chatId: Types.ObjectId | string,
  user: Express.User,
) => {
  const { userIsChatAdminOrOwner, chat } = await isUserAdminOrOwnerOfChat(
    chatId,
    user,
  );

  if (chat.chatType === "dm") {
    throw new createHttpError.Forbidden("You can not delete a DM");
  }

  if (!userIsChatAdminOrOwner) {
    throw new createHttpError.Forbidden(
      "Only the owner or admin of this chat can delete this chat.",
    );
  }

  return { chat };
};

export const checkUpdateChatPermissions = async (
  chatId: Types.ObjectId | string,
  user: Express.User,
) => {
  const { userIsChatAdminOrOwner, chat } = await isUserAdminOrOwnerOfChat(
    chatId,
    user,
  );

  if (chat.chatType === "dm") {
    throw new createHttpError.Forbidden("You can not update a DM");
  }

  if (!userIsChatAdminOrOwner) {
    throw new createHttpError.Forbidden(
      "Only the owner or admin of this chat can update this chat.",
    );
  }

  return { chat };
};
