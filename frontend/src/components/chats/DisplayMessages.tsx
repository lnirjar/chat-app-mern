import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { useChatMessagesDataQuery } from "@/hooks/useChatMessagesDataQuery";
import { useAppSelector } from "@/hooks/react-redux-hooks";

import { ChatMessage } from "@/components/chats/ChatMessage";

import { socket } from "@/config/socket";
import { JOIN_CHAT_ROOM, RECEIVE_MESSAGE } from "@/lib/constants";

export const DisplayMessages = ({
  scrollToBottom,
}: {
  scrollToBottom: () => void;
}) => {
  const params = useParams<{ chatId: string }>();

  const { isLoading, data, isError, isFetching, error } =
    useChatMessagesDataQuery(params.chatId);

  const user = useAppSelector((state) => state.auth.user);

  const queryClient = useQueryClient();

  useEffect(() => {
    const refetchMessages = () => {
      queryClient.invalidateQueries({
        queryKey: ["chats", params.chatId, "messages"],
      });
      scrollToBottom();
    };

    socket.emit(JOIN_CHAT_ROOM, { chatId: params.chatId });

    socket.on(RECEIVE_MESSAGE, refetchMessages);

    return () => {
      socket.off(JOIN_CHAT_ROOM);
      socket.off(RECEIVE_MESSAGE, refetchMessages);
    };
  }, [params.chatId, queryClient, scrollToBottom]);

  if (!isFetching && isLoading) {
    return <div>Loading..</div>;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  const messages = data?.data.messages;
  return (
    <>
      <div className="space-y-4 mb-20">
        {messages?.map((message) => (
          <ChatMessage key={message._id} message={message} user={user} />
        ))}
      </div>
    </>
  );
};
