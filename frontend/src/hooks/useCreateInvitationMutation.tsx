import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/config/axios";
import { Visibility } from "@/lib/constants";
import { useAppSelector } from "@/hooks/react-redux-hooks";

interface CreateInvitationResponse {
  invitation: {
    _id: string;
    workspaceId: string;
    inviteType: Visibility;
    expiresAt: Date;
    invitees: string[];
  };
}
const createInvitation = (data: {
  workspaceId: string;
  inviteType: Visibility;
}) => {
  return axiosInstance.post<CreateInvitationResponse>("/api/invitations", data);
};

export const useCreateInvitationMutation = () => {
  const workspaceId = useAppSelector(
    (state) => state.workspace.currentWorkspace?._id,
  );
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces", workspaceId, "invitations"],
      });
    },
  });
};
