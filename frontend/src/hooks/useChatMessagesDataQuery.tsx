import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/config/axios";

export interface Message {
  _id: string;
  text: string;
  sender: { name: string; _id: string };
  chatId: string;
}

interface GetChatMessagesResponse {
  messages: Message[];
}
const getChatMessages = (chatId: string | undefined) => {
  return axiosInstance.get<GetChatMessagesResponse>(
    `/api/chats/${chatId}/messages`,
  );
};

export const useChatMessagesDataQuery = (chatId: string | undefined) => {
  return useQuery({
    queryKey: ["chats", chatId, "messages"],
    queryFn: () => getChatMessages(chatId),
    enabled: !!chatId,
  });
};
