import { Message } from "../models/message.model";

export const isEdited = (message: Message) => {
  return message.createdAt !== message.updatedAt;
};

export const isDeleted = (message: Message) => {
  return (
    !message.text &&
    !message.attachment &&
    message.createdAt !== message.updatedAt
  );
};
