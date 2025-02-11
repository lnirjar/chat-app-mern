import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";

import { useAppSelector } from "@/hooks/react-redux-hooks";
import { useCreateInvitationMutation } from "@/hooks/useCreateInvitationMutation";
import { ApiError } from "@/config/axios";

import { PUBLIC, TOAST_MESSAGES } from "@/lib/constants";

export const CreateInvitationForm = () => {
  const currentWorkspace = useAppSelector(
    (state) => state.workspace.currentWorkspace,
  );
  const mutation = useCreateInvitationMutation();

  const handleSubmit = () => {
    const result = mutation.mutateAsync(
      {
        workspaceId: currentWorkspace?._id.toString() as string,
        inviteType: PUBLIC,
      },
      {
        onSuccess: (_data) => {},
        onError: (error: ApiError) => {
          console.error(error);
        },
      },
    );

    toast.promise(result, {
      loading: TOAST_MESSAGES.CREATE_INVITATION_LOADING,
      success: TOAST_MESSAGES.CREATE_INVITATION_SUCCESS,
      error: TOAST_MESSAGES.CREATE_INVITATION_ERROR,
    });
  };

  if (!currentWorkspace) {
    return <div>First select a workspace</div>;
  }

  return (
    <div className="mt-4">
      <Button onClick={handleSubmit}>Create Invitation</Button>
    </div>
  );
};
