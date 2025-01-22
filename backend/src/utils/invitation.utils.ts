import createHttpError from "http-errors";
import { Invitation } from "../models/invitation.model";

export const validateInvitation = async (inviteId: string, email: string) => {
  const invitation = await Invitation.findById(inviteId).exec();

  if (!invitation) {
    throw new createHttpError.NotFound("Invitation not found");
  }

  const expiresAt = invitation.expiresAt;
  const now = new Date();
  if (expiresAt && expiresAt < now) {
    throw new createHttpError.Forbidden("Invite is expired");
  }

  if (invitation.inviteType === "private") {
    const invitees = invitation.invitees;
    if (!invitees.includes(email)) {
      throw new createHttpError.Forbidden(
        "You do not have access to this invite",
      );
    }
  }

  return invitation;
};
