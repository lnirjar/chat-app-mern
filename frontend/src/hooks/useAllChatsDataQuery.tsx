import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/config/axios";
import { ChatType, Visibility } from "@/lib/constants";

interface GetAllChatsResponse {
  chats: {
    _id: string;
    name: string;
    chatType: ChatType;
    visibility: Visibility;
  }[];
}
const getAllWorkspaces = (
  workspaceId: string | undefined,
  chatType: ChatType,
) => {
  return axiosInstance.get<GetAllChatsResponse>(
    `/api/workspaces/${workspaceId}/chats`,
    { params: { chatType } },
  );
};

export const useAllChatsDataQuery = (
  workspaceId: string | undefined,
  chatType: ChatType,
  enabled = true,
) => {
  return useQuery({
    queryKey: ["workspaces", workspaceId, "chats", chatType],
    queryFn: () => getAllWorkspaces(workspaceId, chatType),
    enabled,
  });
};
