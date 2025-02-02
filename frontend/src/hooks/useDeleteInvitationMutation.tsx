import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/config/axios";
import { useAppSelector } from "@/hooks/react-redux-hooks";

interface DeleteInvitationFormResponse {
  message: string;
}
const deleteInvitation = (invitationId: string) => {
  return axiosInstance.delete<DeleteInvitationFormResponse>(
    `/api/invitations/${invitationId}`,
  );
};

export const useDeleteInvitationMutation = () => {
  const queryClient = useQueryClient();
  const currentWorkspace = useAppSelector(
    (state) => state.workspace.currentWorkspace,
  );
  const workspaceId = currentWorkspace?._id;
  return useMutation({
    mutationFn: deleteInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces", workspaceId, "invitations"],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
