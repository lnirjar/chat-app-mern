import { useState } from "react";
import { ChevronsUpDown, GalleryVerticalEnd, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CreateWorkspaceDialogContent } from "@/components/workspaces/CreateWorkspaceDialogContent";
import { useAppDispatch, useAppSelector } from "@/hooks/react-redux-hooks";
import { workspaceActions } from "@/slices/workspaceSlice";

export function WorkspaceSwitcher() {
  const workspaces = useAppSelector((state) => state.workspace.allWorkspaces);
  const dispatch = useAppDispatch();

  const currentWorkspace = useAppSelector(
    (state) => state.workspace.currentWorkspace,
  );
  const { isMobile } = useSidebar();
  const [open, setOpen] = useState(workspaces.length === 0);

  const handleOpenchange = (open: boolean) => {
    if (workspaces.length === 0) {
      setOpen(true);
    } else {
      setOpen(open);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dialog open={open} onOpenChange={handleOpenchange}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {currentWorkspace?.name}
                  </span>
                  <span className="truncate text-xs">
                    {currentWorkspace?.role}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Workspaces
              </DropdownMenuLabel>
              {workspaces.map((workspace) => (
                <DropdownMenuItem
                  key={workspace.name}
                  onClick={() => {
                    dispatch(workspaceActions.setCurrentWorkspace(workspace));
                  }}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <GalleryVerticalEnd className="size-4 shrink-0" />
                  </div>
                  {workspace.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem className="gap-2 p-2">
                  <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                    <Plus className="size-4" />
                  </div>
                  <div className="font-medium text-muted-foreground">
                    Add Workspace
                  </div>
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <CreateWorkspaceDialogContent setOpen={setOpen} />
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
