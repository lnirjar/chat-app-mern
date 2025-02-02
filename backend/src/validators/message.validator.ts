import createHttpError from "http-errors";
import { z } from "zod";

export const sendMessage = (data: {
  chatId: string;
  text?: string;
  attachment?: string;
}) => {
  const validationSchema = z
    .object({
      chatId: z
        .string({ message: "Chat id is required" })
        .trim()
        .min(1, { message: "Chat id is required" })
        .max(50, {
          message: "Chat id can not contain more than 50 characters",
        }),
      text: z
        .string({ message: "Message text must be a string" })
        .trim()
        .min(1, { message: "Message text is required" })
        .max(2000, {
          message: "Message text can contain maximum 2000 characters",
        })
        .optional(),
      attachment: z
        .string({ message: "Attachment link must be a string" })
        .trim()
        .min(1, { message: "Attachment link is required" })
        .max(200, {
          message: "Attachment link can contain maximum 200 characters",
        })
        .optional(),
    })
    .refine((data) => data.text || data.attachment, {
      message: "Either text or attachment must be provided.",
      path: ["text"],
    });

  const result = validationSchema.safeParse(data);

  if (!result.success) {
    throw new createHttpError.BadRequest(result.error.issues[0].message);
  }
};

export const joinChatRoom = (data: { chatId: string }) => {
  const validationSchema = z.object({
    chatId: z
      .string({ message: "Chat id is required" })
      .trim()
      .min(1, { message: "Chat id is required" })
      .max(50, {
        message: "Chat id can not contain more than 50 characters",
      }),
  });

  const result = validationSchema.safeParse(data);

  if (!result.success) {
    throw new createHttpError.BadRequest(result.error.issues[0].message);
  }
};

export const editMessage = (data: {
  messageId: string;
  text?: string;
  attachment?: string;
}) => {
  const validationSchema = z.object({
    messageId: z
      .string({ message: "Message id is required" })
      .trim()
      .min(1, { message: "Message id is required" })
      .max(50, {
        message: "Message id can not contain more than 50 characters",
      }),
    text: z
      .string({ message: "Message text must be a string" })
      .trim()
      .min(1, { message: "Message text is required" })
      .max(100, {
        message: "Message text can contain maximum 100 characters",
      })
      .optional(),
    attachment: z
      .string({ message: "Attachment link must be a string" })
      .trim()
      .min(1, { message: "Attachment link is required" })
      .max(200, {
        message: "Attachment link can contain maximum 200 characters",
      })
      .optional(),
  });

  const result = validationSchema.safeParse(data);

  if (!result.success) {
    throw new createHttpError.BadRequest(result.error.issues[0].message);
  }
};

export const deleteMessage = (data: { messageId: string }) => {
  const validationSchema = z.object({
    messageId: z
      .string({ message: "Message id is required" })
      .trim()
      .min(1, { message: "Message id is required" })
      .max(50, {
        message: "Message id can not contain more than 50 characters",
      }),
  });

  const result = validationSchema.safeParse(data);

  if (!result.success) {
    throw new createHttpError.BadRequest(result.error.issues[0].message);
  }
};
