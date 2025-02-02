import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/config/axios";
import { MemberRole } from "@/lib/constants";
import { Workspace } from "@/slices/workspaceSlice";

interface GetWorkspaceResponse {
  workspace: {
    name: string;
    members: {
      user: {
        name: string;
        _id: string;
        avatar: string;
        username: string;
      };
      role: MemberRole;
    }[];
  };
}
const getWorkspace = (workspaceId: string) => {
  return axiosInstance.get<GetWorkspaceResponse>(
    `/api/workspaces/${workspaceId}`,
  );
};

export const useWorkspaceDataQuery = (workspace: Workspace | null) => {
  const workspaceId = workspace?._id.toString() || "";
  return useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: () => getWorkspace(workspaceId),
    enabled: !!workspace,
  });
};
