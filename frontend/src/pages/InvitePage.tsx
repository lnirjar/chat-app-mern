import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { workspaceActions } from "@/slices/workspaceSlice";
import { useAppDispatch } from "@/hooks/react-redux-hooks";
import { useInvitationWorkspaceDataQuery } from "@/hooks/useInvitationWorkspaceDataQuery";
import { useJoinWorkspaceMutation } from "@/hooks/useJoinWorkspaceMutation";

import { ApiError } from "@/config/axios";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { APP_NAME, TOAST_MESSAGES } from "@/lib/constants";

export const InvitePage = () => {
  const params = useParams<{ inviteId: string }>();
  const inviteId = params.inviteId;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, data, isError, isFetching, error } =
    useInvitationWorkspaceDataQuery(inviteId);
  const mutation = useJoinWorkspaceMutation();

  if ((!isFetching && isLoading) || (!isError && !data)) {
    return <div>Loading..</div>;
  }

  if (isError) {
    return <div>{error?.message || "Something went wrong"}</div>;
  }

  const joinWorkspace = () => {
    const result = mutation.mutateAsync(inviteId, {
      onSuccess: (data) => {
        const workspace = data.data.workspace;
        dispatch(workspaceActions.addWorkspace(workspace));
        navigate("/");
      },
      onError: (error: ApiError) => {
        console.error(error);
      },
    });

    toast.promise(result, {
      loading: TOAST_MESSAGES.JOIN_WORKSPACE_LOADING,
      success: TOAST_MESSAGES.JOIN_WORKSPACE_SUCCESS,
      error: TOAST_MESSAGES.JOIN_WORKSPACE_ERROR,
    });
  };

  return (
    <div>
      <Helmet>
        <title>Invite | {APP_NAME}</title>
      </Helmet>
      <div className="flex justify-center items-center min-h-screen">
        <Card>
          <CardHeader>
            <CardTitle>{data?.data?.invitation.workspaceId.name}</CardTitle>
            <CardDescription>
              You can join this workspace by clicking on the button below
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              className="w-full"
              onClick={joinWorkspace}
              disabled={!inviteId}
            >
              Join
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
