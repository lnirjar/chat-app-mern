import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { useAppSelector } from "@/hooks/react-redux-hooks";

import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { socket } from "@/config/socket";

export function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);
  useEffect(() => {
    socket.connect();

    const onConnect = () => {
      console.log("Connected:", user?.name);
    };

    socket.on("connect", onConnect);
    return () => {
      socket.disconnect();
      socket.off("connect", onConnect);
    };
  }, [user]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="px-4 w-full flex justify-between items-center">
            <SidebarTrigger className="-ml-1" />
            <ModeToggle />
          </div>
        </header>
        <div className="px-4 flex flex-1">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
