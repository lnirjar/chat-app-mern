import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/config/axios";
import { Workspace } from "@/slices/workspaceSlice";

interface GetAllWorkspacesResponse {
  allWorkspaces: Workspace[];
}
const getAllWorkspaces = () => {
  return axiosInstance.get<GetAllWorkspacesResponse>("/api/workspaces");
};

export const useAllWorkspacesDataQuery = (enabled = true) => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: getAllWorkspaces,
    enabled,
  });
};
