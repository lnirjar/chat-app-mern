import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import { SessionOptions } from "express-session";

export const sessionOptions: SessionOptions = {
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
  store: MongoStore.create({
    clientPromise: mongoose.connection
      .asPromise()
      .then((conn) => conn.getClient()),
    stringify: false,
  }),
};
