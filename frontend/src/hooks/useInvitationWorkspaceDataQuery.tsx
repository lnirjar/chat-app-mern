import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/config/axios";

interface GetInvitationWorkspaceResponse {
  invitation: {
    workspaceId: {
      _id: string;
      name: string;
    };
  };
}
const getInvitationWorkspace = (inviteId: string) => {
  return axiosInstance.get<GetInvitationWorkspaceResponse | undefined>(
    `/api/invitations/${inviteId}/workspace`,
  );
};

export const useInvitationWorkspaceDataQuery = (inviteId = "") => {
  return useQuery({
    queryKey: ["invite", inviteId],
    queryFn: () => getInvitationWorkspace(inviteId),
    enabled: !!inviteId,
  });
};
