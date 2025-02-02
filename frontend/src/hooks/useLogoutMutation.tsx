import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/config/axios";
import { useAppDispatch } from "@/hooks/react-redux-hooks";
import { authActions } from "@/slices/authSlice";
import { workspaceActions } from "@/slices/workspaceSlice";

const logout = () => {
  return axiosInstance.post("/api/auth/logout");
};

export const useLogoutMutation = () => {
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: logout,
    onSuccess: (_data) => {
      dispatch(authActions.setUser(null));
      dispatch(workspaceActions.setAllWorkspaces([]));
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
