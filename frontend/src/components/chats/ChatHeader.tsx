import { useParams } from "react-router-dom";
import { Hash, MessageSquare } from "lucide-react";

import { useAppSelector } from "@/hooks/react-redux-hooks";
import { useChatDetailsDataQuery } from "@/hooks/useChatDetailsDataQuery";
import { getDMName } from "@/lib/chatUtils";
import { DM } from "@/lib/constants";

export const ChatHeader = () => {
  const params = useParams<{ chatId: string }>();
  const user = useAppSelector((state) => state.auth.user);

  const { isLoading, data, isError, isFetching, error } =
    useChatDetailsDataQuery(params.chatId);

  if (!isFetching && isLoading) {
    return <div>Loading..</div>;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  const chat = data?.data.chat;
  return (
    <div className="sticky top-0 z-10 flex items-center gap-2 py-2 bg-background">
      {chat?.chatType === DM ? <MessageSquare /> : <Hash />}
      <h1 className="text-2xl font-medium">
        {chat?.chatType === DM ? getDMName(chat, user!) : data?.data.chat.name}
      </h1>
    </div>
  );
};
