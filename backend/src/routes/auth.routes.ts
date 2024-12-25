import express from "express";
import passport from "passport";

import * as authMiddleware from "../middlewares/auth.middleware";
import * as authValidator from "../validators/auth.validator";
import * as authController from "../controllers/auth.controller";

const router = express.Router();

// Google OAuth Routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google"),
  authController.googleAuthCallback,
);

// Local Auth Routes
router.route("/register").post(authValidator.register, authController.register);
router.route("/login").post(authValidator.login, authController.login);
router.route("/logout").post(authValidator.logout, authController.logout);

// Protected Routes
router.use(authMiddleware.isAuthenticated);

router
  .route("/change-password")
  .patch(authValidator.changePassword, authController.changePassword);

router
  .route("/set-password")
  .patch(authValidator.setPassword, authController.setPassword);

router
  .route("/delete-account")
  .delete(authValidator.deleteAccount, authController.deleteAccount);

export { router as authRoutes };
