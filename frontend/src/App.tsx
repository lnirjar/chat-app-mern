import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { authActions } from "@/slices/authSlice";
import { workspaceActions } from "@/slices/workspaceSlice";
import { useUserDataQuery } from "@/hooks/useUserDataQuery";
import { useAppDispatch, useAppSelector } from "@/hooks/react-redux-hooks";

import { RequireAuth } from "@/components/RequireAuth";
import { Navbar } from "@/components/Navbar";

import { LandingPage } from "@/pages/LandingPage";
import { SignupPage } from "@/pages/SignupPage";
import { LoginPage } from "@/pages/LoginPage";
import { HomePage } from "@/pages/HomePage";
import { SettingsPage } from "@/pages/SettingsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { WorkspaceInvitationsPage } from "@/pages/WorkspaceInvitationsPage";
import { WorkspaceMembersPage } from "@/pages/WorkspaceMembersPage";
import { WorkspaceSettingsPage } from "@/pages/WorkspaceSettingsPage";
import { InvitePage } from "@/pages/InvitePage";
import { ChatPage } from "@/pages/ChatPage";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { AccountSettings } from "@/components/settings/AccountSettings";

function App() {
  // We are using `flag` so that we don't get redirected to `/login` after the data is loaded and before the data is saved in the redux store
  const [flag, setFlag] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { isLoading, data, isError, isSuccess, isFetching, error } =
    useUserDataQuery(!flag);

  useEffect(() => {
    if (isError) {
      setFlag(true);
    }

    if (isSuccess) {
      dispatch(authActions.setUser(data.data.user));
      dispatch(workspaceActions.setAllWorkspaces(data.data.workspaces));
      setFlag(true);
    }
  }, [data, dispatch, isError, isSuccess]);

  if ((!isFetching && isLoading) || !flag) {
    return <div>Loading..</div>;
  }

  if (isError) {
    console.log(error);
  }

  return (
    <div>
      <Toaster />
      {!user && <Navbar />}

      <div className="">
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <RequireAuth>
                  <HomePage />
                </RequireAuth>
              ) : (
                <LandingPage />
              )
            }
          >
            <Route
              path="/invitations"
              element={
                <RequireAuth>
                  <WorkspaceInvitationsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/members"
              element={
                <RequireAuth>
                  <WorkspaceMembersPage />
                </RequireAuth>
              }
            />
            <Route
              path="/chats/:chatId"
              element={
                <RequireAuth>
                  <ChatPage />
                </RequireAuth>
              }
            />
            <Route
              path="/workspace/settings"
              element={
                <RequireAuth>
                  <WorkspaceSettingsPage />
                </RequireAuth>
              }
            />
          </Route>
          <Route path="signup" element={<SignupPage />} />
          <Route path="login" element={<LoginPage />} />

          <Route
            path="/invite/:inviteId"
            element={
              <RequireAuth>
                <InvitePage />
              </RequireAuth>
            }
          />

          <Route
            path="settings"
            element={
              <RequireAuth>
                <SettingsPage />
              </RequireAuth>
            }
          >
            <Route index element={<ProfileSettings />} />
            <Route path="account" element={<AccountSettings />} />
            <Route
              path="*"
              element={<Navigate to="/settings" replace={true} />}
            />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
