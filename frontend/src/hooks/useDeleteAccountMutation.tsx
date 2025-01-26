import { useMutation } from "@tanstack/react-query";
import { DeleteAccountFormData } from "@/components/settings/DeleteAccountForm";
import { axiosInstance } from "@/config/axios";
import { User } from "@/slices/authSlice";

interface DeleteAccountFormResponse {
  user: User;
}
const deleteAccount = (data: DeleteAccountFormData) => {
  return axiosInstance.post<DeleteAccountFormResponse>(
    "/api/auth/delete-account",
    data,
  );
};

export const useDeleteAccountMutation = () => {
  return useMutation({
    mutationFn: deleteAccount,
  });
};
