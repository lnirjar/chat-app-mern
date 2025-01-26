import { useMutation } from "@tanstack/react-query";
import { ChangePasswordFormData } from "@/components/settings/ChangePasswordForm";
import { axiosInstance } from "@/config/axios";
import { User } from "@/slices/authSlice";

interface ChangePasswordFormResponse {
  user: User;
}
const changePassword = (data: ChangePasswordFormData) => {
  return axiosInstance.patch<ChangePasswordFormResponse>(
    "/api/auth/change-password",
    data,
  );
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: changePassword,
  });
};
