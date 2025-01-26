import axios from "axios";
import { axiosInstance } from "@/config/axios";

export const isEmailAvailable = async (email: string) => {
  try {
    await axiosInstance.get("/api/user/isEmailAvailable", {
      params: { email },
    });
    return true;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response &&
      error.response.status === 409
    ) {
      return false;
    } else {
      return true;
    }
  }
};

export const isUsernameAvailable = async (username: string) => {
  try {
    await axiosInstance.get("/api/user/isUsernameAvailable", {
      params: { username },
    });
    return true;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response &&
      error.response.status === 409
    ) {
      return false;
    } else {
      return true;
    }
  }
};
