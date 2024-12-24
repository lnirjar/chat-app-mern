import express from "express";

import * as authMiddleware from "../middlewares/auth.middleware";
import * as userValidator from "../validators/user.validator";
import * as userController from "../controllers/user.controller";

const router = express.Router();

// Protected
router.use(authMiddleware.isAuthenticated);

router.route("/").get(userValidator.getUser, userController.getUser);

export { router as userRoutes };
