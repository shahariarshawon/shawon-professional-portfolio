import axios from "axios";

type TBackendErrorResponse = {
  success?: boolean;
  statusCode?: number;
  message?: string;
  errorSources?: {
    path?: string;
    message?: string;
  }[];
};

export function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<TBackendErrorResponse>(error)) {
    return (
      error.response?.data?.message ||
      error.message ||
      "Something went wrong"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}