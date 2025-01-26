import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/config/axios";
import { User } from "@/slices/authSlice";

interface UpdateAvatarFormResponse {
  user: User;
}
const updateAvatar = (data: FormData) => {
  return axiosInstance.patch<UpdateAvatarFormResponse>(
    "/api/user/avatar",
    data,
  );
};

export const useUpdateAvatarMutation = () => {
  return useMutation({
    mutationFn: updateAvatar,
  });
};
