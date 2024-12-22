// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../types/express.d.ts" />
// using the triple slash reference because of ts-node https://github.com/TypeStrong/ts-node?tab=readme-ov-file#missing-types

import "dotenv/config";
import chalk from "chalk";

import { connectDB } from "./config/db";
import { app } from "./app";

connectDB()
  .then(() => {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(
        chalk.bgYellowBright("Server Status:"),
        `listening on port ${port}`,
      );
    });
  })
  .catch((error) => {
    console.error(error);
  });
