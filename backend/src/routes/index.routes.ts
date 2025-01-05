import express from "express";

import { userRoutes } from "./user.routes";
import { authRoutes } from "./auth.routes";
import { workspaceRoutes } from "./workspace.routes";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/auth", authRoutes);
router.use("/workspaces", workspaceRoutes);

export { router as apiRoutes };
