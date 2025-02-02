import { Router } from "express";

import * as authMiddleware from "../middlewares/auth.middleware";
import * as invitationValidator from "../validators/invitation.validator";
import * as invitationController from "../controllers/invitation.controller";

const router = Router();

router
  .route("/:invitationId/workspace")
  .get(
    invitationValidator.getWorkspaceNameForInvitation,
    invitationController.getWorkspaceNameForInvitation,
  );

router.use(authMiddleware.isAuthenticated);

router
  .route("/")
  .post(
    invitationValidator.createInvitation,
    invitationController.createInvitation,
  );

router
  .route("/:invitationId")
  .get(
    invitationValidator.getInvitationDetails,
    invitationController.getInvitationDetails,
  )
  .patch(
    invitationValidator.updateInvitation,
    invitationController.updateInvitation,
  )
  .delete(
    invitationValidator.deleteInvitation,
    invitationController.deleteInvitation,
  );

export { router as invitationRoutes };
