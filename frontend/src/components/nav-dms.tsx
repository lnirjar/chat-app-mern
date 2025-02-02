import { Link, useNavigate } from "react-router-dom";
import { CirclePlus, MessageSquare } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "./ui/tooltip";
import { Button } from "./ui/button";

import { useAllChatsDataQuery } from "@/hooks/useAllChatsDataQuery";
import { useAppSelector } from "@/hooks/react-redux-hooks";
import { DM } from "@/lib/constants";
import { getDMName } from "@/lib/chatUtils";

export function NavDMs() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const currentWorkspace = useAppSelector(
    (state) => state.workspace.currentWorkspace,
  );
  const { isLoading, data, isError, isFetching, error } = useAllChatsDataQuery(
    currentWorkspace?._id,
    DM,
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
        <span>DMs</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/members")}
              >
                <CirclePlus />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>New Chat</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </SidebarGroupLabel>
      <SidebarMenu>
        {data?.data.chats.map((chat) => (
          <SidebarMenuItem key={chat._id}>
            <SidebarMenuButton asChild>
              <Link to={`/chats/${chat._id}`}>
                <MessageSquare />
                <span>{getDMName(chat, user!)}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
