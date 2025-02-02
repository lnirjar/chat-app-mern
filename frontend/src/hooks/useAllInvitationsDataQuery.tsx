import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/config/axios";
import { Visibility } from "@/lib/constants";

interface GetAllInvitationsResponse {
  invitations: {
    _id: string;
    workspaceId: string;
    inviteType: Visibility;
    expiresAt: Date;
    invitees: string[];
  }[];
}
const getAllInvitations = (workspaceId: string | undefined) => {
  return axiosInstance.get<GetAllInvitationsResponse>(
    `/api/workspaces/${workspaceId}/invitations`,
  );
};

export const useAllInvitationsDataQuery = (
  workspaceId: string | undefined,
  enabled = true,
) => {
  return useQuery({
    queryKey: ["workspaces", workspaceId, "invitations"],
    queryFn: () => getAllInvitations(workspaceId),
    enabled,
  });
};
