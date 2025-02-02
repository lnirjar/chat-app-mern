import { useMutation } from "@tanstack/react-query";
import { CreateWorkspaceFormData } from "@/components/workspaces/CreateWorkspaceForm";
import { axiosInstance } from "@/config/axios";
import { Workspace } from "@/slices/workspaceSlice";

interface CreateWorkspaceResponse {
  workspace: Workspace;
}
const createWorkspace = (data: CreateWorkspaceFormData) => {
  return axiosInstance.post<CreateWorkspaceResponse>("/api/workspaces", data);
};

export const useCreateWorkspaceMutation = () => {
  return useMutation({
    mutationFn: createWorkspace,
  });
};
