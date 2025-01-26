import { useMutation } from "@tanstack/react-query";
import { SignupFormData } from "@/pages/SignupPage";
import { axiosInstance } from "@/config/axios";
import { User } from "@/slices/authSlice";

interface SignupResponse {
  user: User;
}
const signup = (data: SignupFormData) => {
  return axiosInstance.post<SignupResponse>("/api/auth/register", data);
};

export const useSignupMutation = () => {
  return useMutation({
    mutationFn: signup,
  });
};
