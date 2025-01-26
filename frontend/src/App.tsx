import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { authActions } from "@/slices/authSlice";
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
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { AccountSettings } from "@/components/settings/AccountSettings";

function App() {
  // We are using `flag` so that we don't get redirected to `/login` after the data is loaded and before the data is saved in the redux store
  const [flag, setFlag] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { isLoading, data, isError, isSuccess, isFetching } =
    useUserDataQuery(!flag);

  useEffect(() => {
    if (isError) {
      setFlag(true);
    }

    if (isSuccess) {
      dispatch(authActions.setUser(data.data.user));
      setFlag(true);
    }
  }, [data, dispatch, isError, isSuccess]);

  if ((!isFetching && isLoading) || !flag) {
    return <div>Loading..</div>;
  }

  return (
    <div>
      <Toaster />
      <Navbar />

      <div className="container px-16">
        <Routes>
          <Route path="/" element={user ? <HomePage /> : <LandingPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="login" element={<LoginPage />} />

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
