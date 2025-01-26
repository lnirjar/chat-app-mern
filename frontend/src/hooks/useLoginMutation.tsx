import { useMutation } from "@tanstack/react-query";
import { LoginFormData } from "@/pages/LoginPage";
import { axiosInstance } from "@/config/axios";
import { User } from "@/slices/authSlice";

interface LoginResponse {
  user: User;
}
const login = (data: LoginFormData) => {
  return axiosInstance.post<LoginResponse>("/api/auth/login", data);
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: login,
  });
};
