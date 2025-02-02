import { User } from "@/slices/authSlice";
import { Chat } from "@/slices/chatSlice";

export const getDMName = (chat: Omit<Chat, "role">, user: User) => {
  if (!chat.members) {
    return "";
  }

  const member = chat.members.find((member) => member.user._id !== user._id);
  const name = member?.user.name;

  return name || user.name;
};
