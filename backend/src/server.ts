// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../types/express.d.ts" />
// using the triple slash reference because of ts-node https://github.com/TypeStrong/ts-node?tab=readme-ov-file#missing-types

import "dotenv/config";
import chalk from "chalk";
import { createServer } from "node:http";
import { Server } from "socket.io";

import { connectDB } from "./config/db";
import { app } from "./app";
import { configureSocketIO } from "./config/socket";

const server = createServer(app);

const opts =
  process.env.NODE_ENV === "production"
    ? {}
    : {
        cors: {
          origin: "http://localhost:5173",
          methods: ["GET", "POST"],
          credentials: true,
        },
      };
const io = new Server(server, opts);

connectDB()
  .then(() => {
    const port = process.env.PORT || 5000;
    server.listen(port, () => {
      console.log(
        chalk.bgYellowBright("Server Status:"),
        `listening on port ${port}`,
      );

      configureSocketIO(io);
    });
  })
  .catch((error) => {
    console.error(error);
  });
