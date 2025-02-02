import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/config/axios";
import { Workspace } from "@/slices/workspaceSlice";

interface JoinWorkspaceResponse {
  workspace: Workspace;
}
const joinWorkspace = (inviteId: string | undefined) => {
  return axiosInstance.post<JoinWorkspaceResponse>(
    `/api/workspaces/join/${inviteId}`,
  );
};

export const useJoinWorkspaceMutation = () => {
  return useMutation({
    mutationFn: joinWorkspace,
  });
};
