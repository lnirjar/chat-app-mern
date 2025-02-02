import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import passport from "passport";
import session from "express-session";
import cors from "cors";

import { errorHandler, notFound } from "./middlewares/error.middleware";
import { format, morgan } from "./middlewares/morgan.middleware";
import { apiRoutes } from "./routes/index.routes";
import { configurePassport } from "./config/passport";
import { sessionOptions } from "./config/session";

const app = express();

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", true);
}

if (process.env.NODE_ENV !== "production") {
  app.use(cors());
}

configurePassport(passport);

if (process.env.NODE_ENV === "production") {
  app.use(morgan(format.short));
} else {
  app.use(morgan(format.dev));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", apiRoutes);

app.use("/api", notFound);

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) =>
    res.sendFile(
      path.resolve(__dirname, "..", "frontend", "dist", "index.html"),
    ),
  );
} else {
  app.get("/", (req, res) => {
    res.send(`Server is ready`);
  });
}

app.use(errorHandler);

export { app };
