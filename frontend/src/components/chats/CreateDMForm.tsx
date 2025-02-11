import toast from "react-hot-toast";
import { Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import { useAppDispatch, useAppSelector } from "@/hooks/react-redux-hooks";
import { useCreateChatMutation } from "@/hooks/useCreateChatMutation";
import { chatActions } from "@/slices/chatSlice";
import { ApiError } from "@/config/axios";

import { DM, TOAST_MESSAGES } from "@/lib/constants";

export const CreateDMForm = ({ memberId }: { memberId: string }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const currentWorkspace = useAppSelector(
    (state) => state.workspace.currentWorkspace,
  );
  const mutation = useCreateChatMutation();
  const navigate = useNavigate();

  const createDM = () => {
    const result = mutation.mutateAsync(
      {
        name: "DM",
        chatType: DM,
        workspaceId: currentWorkspace?._id.toString() as string,
        memberId,
      },
      {
        onSuccess: (data) => {
          const chat = data.data.chat;
          dispatch(chatActions.addChat(chat));
          navigate(`/chats/${chat._id}`);
        },
        onError: (error: ApiError) => {
          console.error(error);
        },
      },
    );

    toast.promise(result, {
      loading: TOAST_MESSAGES.CREATE_CHAT_LOADING,
      success: TOAST_MESSAGES.CREATE_CHAT_SUCCESS,
      error: TOAST_MESSAGES.CREATE_CHAT_ERROR,
    });
  };

  if (!currentWorkspace) {
    return <div>First select a workspace</div>;
  }

  return (
    <Button
      onClick={createDM}
      className="w-full rounded-none"
      disabled={user?._id === memberId}
    >
      <Send /> Message
    </Button>
  );
};
