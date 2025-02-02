import { Router } from "express";

import * as authMiddleware from "../middlewares/auth.middleware";
import * as chatValidator from "../validators/chat.validator";
import * as chatController from "../controllers/chat.controller";

const router = Router();

router.use(authMiddleware.isAuthenticated);

router.route("/").post(chatValidator.createChat, chatController.createChat);
router.route("/dm").post(chatValidator.createDM, chatController.createDM);

router
  .route("/:chatId")
  .get(chatValidator.getChatDetails, chatController.getChatDetails)
  .patch(chatValidator.updateChat, chatController.updateChat)
  .delete(chatValidator.deleteChat, chatController.deleteChat);

router
  .route("/:chatId/messages")
  .get(chatValidator.getChatMessages, chatController.getChatMessages);

router
  .route("/:chatId/members")
  .post(chatValidator.addMembers, chatController.addMembers);

router
  .route("/:chatId/members/:memberId")
  .delete(chatValidator.removeMember, chatController.removeMember);

export { router as chatRoutes };
