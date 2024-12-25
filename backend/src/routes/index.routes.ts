import express from "express";

import { userRoutes } from "./user.routes";
import { authRoutes } from "./auth.routes";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/auth", authRoutes);

export { router as apiRoutes };
