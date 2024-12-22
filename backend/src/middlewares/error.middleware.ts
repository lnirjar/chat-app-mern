import { ErrorRequestHandler, RequestHandler } from "express";
import createHttpError, { isHttpError } from "http-errors";
import mongoose from "mongoose";

export const notFound: RequestHandler = (req, res, next) => {
  const error = new createHttpError.NotFound(
    `Endpoint Not Found: ${req.originalUrl}`,
  );
  next(error);
};

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req,
  res,
  _next,
) => {
  let statusCode = 500;
  if (res.statusCode >= 400 && res.statusCode <= 599) {
    statusCode = res.statusCode;
  }
  if (isHttpError(err)) {
    statusCode = err.statusCode;
  }

  let message = "An unknown error occurred";
  if (err instanceof Error) {
    message = err.message;
  }

  if (err instanceof mongoose.Error.CastError && err.kind == "ObjectId") {
    message = "Invalid ObjectId";
    statusCode = 400;
  }

  const stack = err instanceof Error ? err.stack : null;

  if (!isHttpError(err)) {
    console.error(err);
  }

  res.status(statusCode).json({
    error: message,
    stack: process.env.NODE_ENV === "production" ? null : stack,
  });
};
