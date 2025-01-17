import express from "express";

import { userRoutes } from "./user.routes";
import { authRoutes } from "./auth.routes";
import { workspaceRoutes } from "./workspace.routes";
import { invitationRoutes } from "./invitation.routes";
import { chatRoutes } from "./chat.routes";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/auth", authRoutes);
router.use("/workspaces", workspaceRoutes);
router.use("/invitations", invitationRoutes);
router.use("/chats", chatRoutes);

export { router as apiRoutes };
