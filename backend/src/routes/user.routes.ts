import express from "express";
import * as userController from "../controllers/user.controller";

const router = express.Router();

router.route("/hello-world").get(userController.helloWorld);

export { router as userRoutes };
