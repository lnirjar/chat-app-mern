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
