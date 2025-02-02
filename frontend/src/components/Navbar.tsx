import { NavLink } from "react-router-dom";

import reactLogo from "@/assets/react.svg";

import { Button } from "@/components/ui/button";
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
