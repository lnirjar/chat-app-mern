import session from "express-session";
import { Server } from "socket.io";
import { NextFunction, Request, RequestHandler, Response } from "express";
import passport from "passport";

import { sessionOptions } from "./session";
import * as messageController from "../controllers/message.controller";
import {
  DELETE_MESSAGE,
  EDIT_MESSAGE,
  JOIN_CHAT_ROOM,
  SEND_MESSAGE,
} from "../utils/constants";

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

    socket.on(JOIN_CHAT_ROOM, async (data) => {
      await messageController.joinChatRoom(socket, data, user);
    });

    socket.on(SEND_MESSAGE, async (data) => {
      await messageController.sendMessage(io, data, user);
    });

    socket.on(EDIT_MESSAGE, async (data) => {
      await messageController.editMessage(io, data, user);
    });

    socket.on(DELETE_MESSAGE, async (data) => {
      await messageController.deleteMessage(io, data, user);
    });

    socket.on("disconnect", () => {
      console.log(
        `A user disconnected:\n  socketId: ${socket.id}\n  userId: ${user?.id}`,
      );
    });
  });
};
