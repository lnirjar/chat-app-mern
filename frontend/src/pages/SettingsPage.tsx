import { SidebarNav } from "@/components/SidebarNav";
import { Separator } from "@/components/ui/separator";
import { APP_NAME } from "@/lib/constants";
import { Helmet } from "react-helmet";
import { Outlet } from "react-router-dom";

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
  return (
    <div>
      <Helmet>
        <title>Settings | {APP_NAME}</title>
      </Helmet>
      <div className="mb-40">
        <div className="space-y-2">
          <h1>Settings</h1>
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
