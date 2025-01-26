import { NavLink } from "react-router-dom";

import reactLogo from "@/assets/react.svg";

import { Button } from "@/components/ui/button";
import { AvatarDropdownMenu } from "@/components/AvatarDropdownMenu";
import { ModeToggle } from "@/components/mode-toggle";

import { useAppSelector } from "@/hooks/react-redux-hooks";

export const Navbar = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="container flex items-center pt-8 mb-8 px-16">
      <div>
        <NavLink to="/">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </NavLink>
      </div>

      {user && (
        <>
          <div className="ml-24 flex gap-8 items-center">
            <div className="flex gap-4">
              <NavLink
                to="/dashboard"
                className="[&.active]:underline decoration-2 decoration-accent-foreground underline-offset-8 animate-fade-in"
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/reports"
                className="[&.active]:underline decoration-2 decoration-accent-foreground underline-offset-8 animate-fade-in"
              >
                Reports
              </NavLink>
            </div>
            <ModeToggle />
          </div>
          <div className="ml-auto">
            <AvatarDropdownMenu />
          </div>
        </>
      )}

      {!user && (
        <div className="ml-auto flex gap-4">
          <ModeToggle />
          <Button asChild variant="ghost">
            <NavLink to="/login" className="[&.active]:hidden animate-fade-in">
              Login
            </NavLink>
          </Button>
          <Button asChild>
            <NavLink to="/signup" className="[&.active]:hidden animate-fade-in">
              Create Account
            </NavLink>
          </Button>
        </div>
      )}
    </div>
  );
};
