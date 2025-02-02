import { useCallback, useRef } from "react";

import { ChatHeader } from "@/components/chats/ChatHeader";
import { CreateMessageForm } from "@/components/chats/CreateMessageForm";
import { DisplayMessages } from "@/components/chats/DisplayMessages";

export const ChatPage = () => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [bottomRef]);

  return (
    <div className="flex flex-col flex-1 max-w-3xl sm:ml-10">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto my-4">
        <DisplayMessages scrollToBottom={scrollToBottom} />
        <div ref={bottomRef} />
      </div>
      <div className="sticky bottom-0 bg-background py-4 sm:mr-10">
        <CreateMessageForm />
      </div>
    </div>
  );
};
