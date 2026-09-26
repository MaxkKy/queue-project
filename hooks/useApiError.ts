import { toast } from 'sonner';
import { AppError } from '@/lib/errors/AppError';
import { ERROR_MESSAGES } from '@/constants/errorMessages'; 
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
export const useApiError = () => {
  const router = useRouter();
  const pathname = usePathname();
  function goLogin() {
    const loginPath = pathname.startsWith("/dashboard") ? "/admin/login" : "/login"
    if(loginPath !== pathname){
      router.push(loginPath)
    }
  }

  const handleError = (error: unknown) => {
    // Known application error
    if (AppError.isAppError(error)) {
      const message = ERROR_MESSAGES[error.code] ?? error.message;
      
      // Handle specific error codes
      if (error.code === 'UNAUTHORIZED') {
        toast.error(message, { id: 'unauthorized' });
        goLogin();
        return;      
      }
      toast.error(message);
      return;
    }
 
    // Axios error
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
 
      if (status === 401) {
        toast.error(ERROR_MESSAGES.UNAUTHORIZED, { id: 'unauthorized' });
        goLogin();
        return;
      }
 
      if (status === 403) {
        toast.error(ERROR_MESSAGES.FORBIDDEN);
        return;
      }
 
      if (status === 404) {
        toast.error(ERROR_MESSAGES.NOT_FOUND);
        return;
      }
 
      if (status === 429) {
        toast.error(ERROR_MESSAGES.RATE_LIMIT);
        return;
      }
 
      if (!error.response) {
        toast.error(ERROR_MESSAGES.NETWORK_ERROR);
        return;
      }
    }
 
    // Unknown error
    console.error('Unhandled error:', error);
    toast.error(ERROR_MESSAGES.DEFAULT);
  };
 
  return { handleError };
};