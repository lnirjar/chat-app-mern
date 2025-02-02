import toast from "react-hot-toast";
import { Copy, Trash2 } from "lucide-react";

import { useAppSelector } from "@/hooks/react-redux-hooks";
import { useAllInvitationsDataQuery } from "@/hooks/useAllInvitationsDataQuery";
import { useDeleteInvitationMutation } from "@/hooks/useDeleteInvitationMutation";

import { CreateInvitationForm } from "@/components/invitations/createInvitationForm";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { OWNER, TOAST_MESSAGES } from "@/lib/constants";

export const WorkspaceInvitationsPage = () => {
  const currentWorkspace = useAppSelector(
    (state) => state.workspace.currentWorkspace,
  );

  const mutation = useDeleteInvitationMutation();

  const { isLoading, data, isError, isFetching, error } =
    useAllInvitationsDataQuery(currentWorkspace?._id, !!currentWorkspace);

  if (!isFetching && isLoading) {
    return <div>Loading..</div>;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  const deleteInvitation = (invitationId: string) => {
    const result = mutation.mutateAsync(invitationId);

    toast.promise(result, {
      loading: TOAST_MESSAGES.DELETE_INVITATION_LOADING,
      success: TOAST_MESSAGES.DELETE_INVITATION_SUCCESS,
      error: TOAST_MESSAGES.DELETE_INVITATION_ERROR,
    });
  };

  return (
    <div>
      <h1 className="text-5xl font-bold">Workspace Invitations</h1>
      {data?.data.invitations.map((invitation) => {
        const inviteLink = `${window.location.origin}/invite/${invitation._id}`;

        return (
          <Card key={invitation._id} className="my-8 w-fit">
            <CardContent className="py-4">
              <Badge variant="default">{invitation.inviteType}</Badge>
              <div className="mt-2 flex gap-2 items-center">
                <Input defaultValue={inviteLink} readOnly className="w-96" />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={async () => {
                    await navigator.clipboard.writeText(inviteLink);
                    toast.success("Copied");
                  }}
                >
                  <span className="sr-only">Copy</span>
                  <Copy />
                </Button>

                {currentWorkspace?.role === OWNER && (
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => deleteInvitation(invitation._id)}
                  >
                    <span className="sr-only">Delete</span>
                    <Trash2 />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {currentWorkspace?.role === OWNER && <CreateInvitationForm />}
    </div>
  );
};
