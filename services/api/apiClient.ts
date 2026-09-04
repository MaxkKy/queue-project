import { AppError ,ApiErrorResponse} from "../../lib/errors/AppError";
import axios , {type AxiosError} from "axios";
export const apiClient = axios.create({baseURL:"/api"})
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiErrorResponse>) => {
      // Transform to AppError
      if (error.response?.data) {
        return Promise.reject(
          AppError.fromResponse(error.response.data)
        );
      }
   
      // Network error
      if (!error.response) {
        return Promise.reject(
          new AppError('Network error', 'NETWORK_ERROR', 0)
        );
      }
   
      return Promise.reject(error);
    }
  );