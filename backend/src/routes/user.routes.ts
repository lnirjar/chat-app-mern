import express from "express";

import * as authMiddleware from "../middlewares/auth.middleware";
import * as userValidator from "../validators/user.validator";
import * as userMiddleware from "../middlewares/user.middleware";
import * as userController from "../controllers/user.controller";
import { upload } from "../config/multer";

const router = express.Router();

// Public
router
  .route("/isEmailAvailable")
  .get(
    userValidator.isEmailAvailable,
    userMiddleware.isEmailAvailable,
    userController.isEmailAvailable,
  );

router
  .route("/isUsernameAvailable")
  .get(
    userValidator.isUsernameAvailable,
    userMiddleware.isUsernameAvailable,
    userController.isUsernameAvailable,
  );

// Protected
router.use(authMiddleware.isAuthenticated);

router.route("/").get(userValidator.getUser, userController.getUser);

router
  .route("/data")
  .get(userValidator.getUserData, userController.getUserData);

router
  .route("/avatar")
  .patch(
    upload.single("avatar"),
    userValidator.updateAvatar,
    userController.updateAvatar,
  );

router
  .route("/name")
  .patch(userValidator.updateName, userController.updateName);

router
  .route("/email")
  .patch(
    userValidator.updateEmail,
    userMiddleware.isEmailAvailable,
    userController.updateEmail,
  );

router
  .route("/username")
  .patch(
    userValidator.updateUsername,
    userMiddleware.isUsernameAvailable,
    userController.updateUsername,
  );

export { router as userRoutes };
