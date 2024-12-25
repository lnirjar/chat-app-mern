import express from "express";

import * as authMiddleware from "../middlewares/auth.middleware";
import * as userValidator from "../validators/user.validator";
import * as userController from "../controllers/user.controller";
import { upload } from "../config/multer";

const router = express.Router();

// Protected
router.use(authMiddleware.isAuthenticated);

router.route("/").get(userValidator.getUser, userController.getUser);

router
  .route("/avatar")
  .patch(
    upload.single("avatar"),
    userValidator.updateAvatar,
    userController.updateAvatar,
  );

export { router as userRoutes };
