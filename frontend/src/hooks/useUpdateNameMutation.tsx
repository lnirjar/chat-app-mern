import { useMutation } from "@tanstack/react-query";
import { UpdateNameFormData } from "@/components/settings/UpdateNameForm";
import { axiosInstance } from "@/config/axios";
import { User } from "@/slices/authSlice";

interface UpdateNameFormResponse {
  user: User;
}
const updateName = (data: UpdateNameFormData) => {
  return axiosInstance.patch<UpdateNameFormResponse>("/api/user/name", data);
};

export const useUpdateNameMutation = () => {
  return useMutation({
    mutationFn: updateName,
  });
};
