import { useMutation } from "@tanstack/react-query";
import { UpdateUsernameFormData } from "@/components/settings/UpdateUsernameForm";
import { axiosInstance } from "@/config/axios";
import { User } from "@/slices/authSlice";

interface UpdateUsernameFormResponse {
  user: User;
}
const updateUsername = (data: UpdateUsernameFormData) => {
  return axiosInstance.patch<UpdateUsernameFormResponse>(
    "/api/user/username",
    data,
  );
};

export const useUpdateUsernameMutation = () => {
  return useMutation({
    mutationFn: updateUsername,
  });
};
