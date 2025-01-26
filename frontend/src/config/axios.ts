import axios from "axios";

export const axiosInstance = axios.create();

export interface ApiError {
  response?: {
    status: number;
    data?: {
      message?: string;
    };
  };
  message?: string;
}
