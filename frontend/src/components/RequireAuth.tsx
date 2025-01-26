import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/hooks/react-redux-hooks";

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ path: location.pathname }} />;
  }

  return children;
};
