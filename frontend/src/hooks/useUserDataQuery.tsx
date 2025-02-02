import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/config/axios";
import { User } from "@/slices/authSlice";
import { Workspace } from "@/slices/workspaceSlice";

interface GetUserResponse {
  user: User;
  loginMethods: ("google" | "password")[];
  workspaces: Workspace[];
}
const getUser = () => {
  return axiosInstance.get<GetUserResponse>("/api/user/data");
};

export const useUserDataQuery = (enabled = true) => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    enabled,
  });
};
