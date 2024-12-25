import chalk from "chalk";
import morgan from "morgan";
import { Request, Response } from "express";

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

morgan.token("error", (req: Request, res: Response) =>
  res.locals.error?.message && res.locals.error?.stack
    ? `\n${chalk.bgRed("Error:")} ${res.locals.error.message}\n${res.locals.error.stack}\n`
    : "",
);

const short = [
  chalk.yellow(":remote-addr"),
  ":remote-user",
  chalk.yellow(":method"),
  chalk.green(":url"),
  chalk.grey("HTTP/:http-version"),
  ":color-status",
  chalk.grey(":res[content-length]"),
  "-",
  ":response-time ms",
  ":error",
].join(" ");

const dev = [
  chalk.yellow(":method"),
  chalk.green(":url"),
  ":color-status",
  ":response-time ms",
  chalk.grey(":res[content-length]"),
  ":error",
].join(" ");

const format = { short, dev };

export { morgan, format };
