import chalk from "chalk";
import { Request } from "express";
import morgan from "morgan";

morgan.token("remote-user", (req: Request) =>
  req.user ? req.user.email : "-",
);

morgan.token("color-status", (req, res) => {
  const status = res.statusCode;
  if (status >= 500) return chalk.red(status);
  if (status >= 400) return chalk.yellow(status);
  if (status >= 300) return chalk.cyan(status);
  if (status >= 200) return chalk.green(status);
  return chalk.white(status);
});

export const short = [
  chalk.yellow(":remote-addr"),
  ":remote-user",
  chalk.yellow(":method"),
  chalk.green(":url"),
  chalk.grey("HTTP/:http-version"),
  ":color-status",
  chalk.grey(":res[content-length]"),
  "-",
  ":response-time ms",
].join(" ");

const format = { short };

export { morgan, format };
