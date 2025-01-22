import session from "express-session";
import { Server } from "socket.io";
import { NextFunction, Request, RequestHandler, Response } from "express";
import passport from "passport";

import { sessionOptions } from "./session";
import { Message } from "../models/message.model";

function onlyForHandshake(middleware: RequestHandler) {
  return (
    req: Request & { _query: Record<string, string> },
    res: Response,
    next: NextFunction,
  ) => {
    const isHandshake = req._query.sid === undefined;
    if (isHandshake) {
      middleware(req, res, next);
    } else {
      next();
    }
  };
}

export const configureSocketIO = (io: Server) => {
  io.engine.use(onlyForHandshake(session(sessionOptions)));
  io.engine.use(onlyForHandshake(passport.session()));
  io.engine.use(
    onlyForHandshake((req, res, next) => {
      if (req.user) {
        next();
      } else {
        res.writeHead(401);
        res.end();
      }
    }),
  );

  io.on("connection", (socket) => {
    const req = socket.request as Request & { user: Express.User };
    const user = req.user;
    console.log(
      `A user connected:\n  socketId: ${socket.id}\n  userId: ${user?.id}`,
    );

    socket.on("join_chat", (chatId) => {
      socket.join(chatId);
      console.log(`User joined room: ${chatId}`);
    });

    socket.on("send_message", async (data) => {
      const { chatId, text, attachment } = data;
      const message = await Message.create({
        chatId,
        sender: user?.id,
        text,
        attachment,
      });

      console.log(message);

      io.to(chatId).emit("receive_message", message);
    });

    socket.on("disconnect", () => {
      console.log(
        `A user disconnected:\n  socketId: ${socket.id}\n  userId: ${user?.id}`,
      );
    });
  });
};
