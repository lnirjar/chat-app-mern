import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/config/axios";
import { User } from "@/slices/authSlice";

interface GetUserResponse {
  user: User;
}
const getUser = () => {
  return axiosInstance.get<GetUserResponse>("/api/user");
};

export const useUserDataQuery = (enabled = true) => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    enabled,
  });
};
