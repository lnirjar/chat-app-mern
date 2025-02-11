import { SidebarNav } from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { APP_NAME } from "@/lib/constants";
import { ChevronLeft } from "lucide-react";
import { Helmet } from "react-helmet";
import { Outlet, useNavigate } from "react-router-dom";

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/settings",
  },
  {
    title: "Account",
    href: "/settings/account",
  },
];

export const SettingsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <Helmet>
        <title>Settings | {APP_NAME}</title>
      </Helmet>
      <div className="mb-40">
        <div className="space-y-2">
          <div className="flex gap-3 items-center">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
              <ChevronLeft />
            </Button>
            <h1 className="text-3xl font-semibold">Settings</h1>
          </div>
          <p className="text-muted-foreground">
            Manage Your Account and Profile Settings
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
