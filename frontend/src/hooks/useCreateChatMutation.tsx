import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateChatFormData } from "@/components/chats/CreateChatForm";
import { axiosInstance } from "@/config/axios";
import { Chat } from "@/slices/chatSlice";
import { ChatType, DM } from "@/lib/constants";
import { useAppSelector } from "@/hooks/react-redux-hooks";

interface CreateChatResponse {
  chat: Chat;
}
const createChat = (
  data: CreateChatFormData & {
    workspaceId: string;
    chatType?: ChatType;
    memberId?: string;
  },
) => {
  if (data.chatType === DM) {
    return axiosInstance.post<CreateChatResponse>("/api/chats/dm", data);
  }
  return axiosInstance.post<CreateChatResponse>("/api/chats", data);
};

export const useCreateChatMutation = () => {
  const workspaceId = useAppSelector(
    (state) => state.workspace.currentWorkspace?._id,
  );
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createChat,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces", workspaceId, "chats", variables.chatType],
      });
    },
  });
};
