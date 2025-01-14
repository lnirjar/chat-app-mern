import { Router } from "express";

import * as authMiddleware from "../middlewares/auth.middleware";
import * as workspaceValidator from "../validators/workspace.validator";
import * as workspaceController from "../controllers/workspace.controller";

const router = Router();

router.use(authMiddleware.isAuthenticated);

router
  .route("/")
  .post(workspaceValidator.createWorkspace, workspaceController.createWorkspace)
  .get(
    workspaceValidator.getUserWorkspaces,
    workspaceController.getUserWorkspaces,
  );

router
  .route("/:workspaceId")
  .get(workspaceValidator.getWorkspace, workspaceController.getWorkspace);

router
  .route("/:workspaceId/invitations")
  .get(workspaceValidator.getInvitations, workspaceController.getInvitations);

router
  .route("/:workspaceId/name")
  .patch(
    workspaceValidator.updateWorkspaceName,
    workspaceController.updateWorkspaceName,
  );

router
  .route("/join/:inviteId")
  .get(workspaceValidator.joinWorkspace, workspaceController.joinWorkspace);

router
  .route("/:workspaceId/leave")
  .delete(workspaceValidator.exitWorkspace, workspaceController.exitWorkspace);

router
  .route("/:workspaceId/members/:memberId")
  .delete(
    workspaceValidator.removeMemberFromWorkspace,
    workspaceController.removeMemberFromWorkspace,
  );

router
  .route("/:workspaceId/members/:memberId/role")
  .patch(
    workspaceValidator.changeMemberRole,
    workspaceController.changeMemberRole,
  );

export { router as workspaceRoutes };
