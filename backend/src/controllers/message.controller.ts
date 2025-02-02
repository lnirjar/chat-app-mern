import createHttpError from "http-errors";
import { Server, Socket } from "socket.io";

import { Message } from "../models/message.model";
import * as messageValidator from "../validators/message.validator";
import * as chatUtils from "../utils/chat.utils";
import { withErrorHandling } from "../utils/error.utils";
import { PRIVATE, RECEIVE_MESSAGE } from "../utils/constants";

// @desc Send Message
// @route Socket.io Event SEND_MESSAGE
// @access Private
export const sendMessage = withErrorHandling(
  async (
    io: Server,
    data: { chatId: string; text?: string; attachment?: string },
    user: Express.User,
  ) => {
    const { chatId, text, attachment } = data;

    messageValidator.sendMessage(data);

    if (!user) {
      throw new createHttpError.InternalServerError("User not found");
    }

    const { userIsChatMember, chat } = await chatUtils.isUserMemberOfChat(
      chatId,
      user,
    );

    if (!userIsChatMember && chat.visibility === PRIVATE) {
      throw new createHttpError.Forbidden(
        "Only the members of the private chat can send or receive messages",
      );
    }

    const message = await Message.create({
      chatId,
      sender: user?.id,
      text,
      attachment,
    });

    io.to(chatId).emit(RECEIVE_MESSAGE, message);
  },
);

// @desc Join Chat Room
// @route Socket.io Event JOIN_CHAT_ROOM
// @access Private
export const joinChatRoom = withErrorHandling(
  async (socket: Socket, data: { chatId: string }, user: Express.User) => {
    const { chatId } = data;

    messageValidator.joinChatRoom(data);

    if (!user) {
      throw new createHttpError.InternalServerError("User not found");
    }

    const { userIsChatMember, chat } = await chatUtils.isUserMemberOfChat(
      chatId,
      user,
    );

    if (!userIsChatMember && chat.visibility === PRIVATE) {
      throw new createHttpError.Forbidden(
        "Only the members of the private chat can send or receive messages",
      );
    }

    socket.join(chatId);
    console.log(`User joined room: ${chatId}`);
  },
);

// @desc Edit Message
// @route Socket.io Event EDIT_MESSAGE
// @access Private
export const editMessage = withErrorHandling(
  async (
    io: Server,
    data: { messageId: string; text?: string; attachment?: string },
    user: Express.User,
  ) => {
    const { messageId, text, attachment } = data;

    messageValidator.editMessage(data);

    if (!user) {
      throw new createHttpError.InternalServerError("User not found");
    }

    const message = await Message.findOneAndUpdate(
      { _id: messageId, sender: user._id },
      {
        text,
        attachment,
      },
    );

    if (!message) {
      throw new createHttpError.Forbidden(
        "Only the sender can edit the message",
      );
    }

    const chatId = message.chatId.toString();
    io.to(chatId).emit(RECEIVE_MESSAGE, message);
  },
);

// @desc Delete Message
// @route Socket.io Event DELETE_MESSAGE
// @access Private
export const deleteMessage = withErrorHandling(
  async (io: Server, data: { messageId: string }, user: Express.User) => {
    const { messageId } = data;

    messageValidator.deleteMessage(data);

    if (!user) {
      throw new createHttpError.InternalServerError("User not found");
    }

    const message = await Message.findOneAndUpdate(
      { _id: messageId, sender: user._id },
      {
        text: "",
        attachment: "",
      },
    );

    if (!message) {
      throw new createHttpError.Forbidden(
        "Only the sender can delete the message",
      );
    }

    const chatId = message.chatId.toString();
    io.to(chatId).emit(RECEIVE_MESSAGE, message);
  },
);
