import { Message } from "@/hooks/useChatMessagesDataQuery";
import { User } from "@/slices/authSlice";

export const ChatMessage = ({
  message,
  user,
}: {
  message: Message;
  user: User | null;
}) => {
  const receivedMessageStyles =
    "flex w-fit max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-muted";
  //   const sentMessageStyles =
  //     "flex w-fit max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ml-auto bg-primary text-primary-foreground";
  return (
    <div
      className={
        message.sender._id === user?._id
          ? receivedMessageStyles
          : receivedMessageStyles
      }
    >
      <p className="font-medium">
        {message.sender.name} {message.sender._id === user?._id ? "(You)" : ""}
      </p>
      <p>{message.text}</p>
    </div>
  );
};
