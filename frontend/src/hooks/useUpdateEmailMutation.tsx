import { useMutation } from "@tanstack/react-query";
import { UpdateEmailFormData } from "@/components/settings/UpdateEmailForm";
import { axiosInstance } from "@/config/axios";
import { User } from "@/slices/authSlice";

interface UpdateEmailFormResponse {
  user: User;
}
const updateEmail = (data: UpdateEmailFormData) => {
  return axiosInstance.patch<UpdateEmailFormResponse>("/api/user/email", data);
};

export const useUpdateEmailMutation = () => {
  return useMutation({
    mutationFn: updateEmail,
  });
};
