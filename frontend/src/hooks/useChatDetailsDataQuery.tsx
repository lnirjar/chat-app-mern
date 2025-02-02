import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/config/axios";
import { Chat } from "@/slices/chatSlice";

const getChatDetails = (chatId: string | undefined) => {
  return axiosInstance.get<{ chat: Chat }>(`/api/chats/${chatId}`);
};

export const useChatDetailsDataQuery = (chatId: string | undefined) => {
  return useQuery({
    queryKey: ["chats", chatId],
    queryFn: () => getChatDetails(chatId),
    enabled: !!chatId,
  });
};
