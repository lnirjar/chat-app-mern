import { Hash } from "lucide-react";
import { Link } from "react-router-dom";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { CreateChatDialog } from "@/components/chats/CreateChatDialog";
import { useAllChatsDataQuery } from "@/hooks/useAllChatsDataQuery";
import { useAppSelector } from "@/hooks/react-redux-hooks";
import { GROUP } from "@/lib/constants";

export function NavChats() {
  const currentWorkspace = useAppSelector(
    (state) => state.workspace.currentWorkspace,
  );
  const { isLoading, data, isError, isFetching, error } = useAllChatsDataQuery(
    currentWorkspace?._id,
    GROUP,
    !!currentWorkspace,
  );

  if (!isFetching && isLoading) {
    return <div>Loading..</div>;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="flex justify-between items-center">
        <span>Chats</span>
        <CreateChatDialog />
      </SidebarGroupLabel>
      <SidebarMenu>
        {data?.data.chats.map((chat) => (
          <SidebarMenuItem key={chat._id}>
            <SidebarMenuButton asChild>
              <Link to={`/chats/${chat._id}`}>
                <Hash />
                <span>{chat.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
