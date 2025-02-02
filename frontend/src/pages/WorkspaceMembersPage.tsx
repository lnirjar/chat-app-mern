import { Helmet } from "react-helmet";
import { useWorkspaceDataQuery } from "@/hooks/useWorkspaceDataQuery";
import { useAppSelector } from "@/hooks/react-redux-hooks";

import { Badge } from "@/components/ui/badge";
import { CreateDMForm } from "@/components/chats/CreateDMForm";

import { ADMIN, APP_NAME, OWNER } from "@/lib/constants";

export const WorkspaceMembersPage = () => {
  const user = useAppSelector((state) => state.auth.user);

  const currentWorkspace = useAppSelector(
    (state) => state.workspace.currentWorkspace,
  );

  const { isLoading, data, isError, isFetching, error } =
    useWorkspaceDataQuery(currentWorkspace);

  if (!isFetching && isLoading) {
    return <div>Loading..</div>;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <div>
      <Helmet>
        <title>Members | {APP_NAME}</title>
      </Helmet>
      <h1 className="text-5xl font-bold">Workspace Members</h1>
      <div className="my-8 flex gap-4 flex-wrap">
        {data?.data.workspace.members.map((member) => (
          <div
            key={member.user._id}
            className="w-52 rounded-lg bg-muted overflow-hidden shadow-md hover:shadow-2xl transition duration-300"
          >
            <img src={member.user.avatar} alt={member.user.name} />
            <div className="my-4 px-2">
              <h3 className="text-lg font-semibold">
                {member.user.name} {member.user._id === user?._id && "(You)"}
              </h3>
              <p className="text-muted-foreground">@{member.user.username}</p>
              <Badge
                variant={
                  member.role === OWNER
                    ? "default"
                    : member.role === ADMIN
                      ? "secondary"
                      : "outline"
                }
                className={
                  member.role === OWNER
                    ? ""
                    : member.role === ADMIN
                      ? ""
                      : "outline outline-1"
                }
              >
                {member.role}
              </Badge>
            </div>
            <div>
              <CreateDMForm memberId={member.user._id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
