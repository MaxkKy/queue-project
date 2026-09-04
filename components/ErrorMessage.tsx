import { ERROR_MESSAGES } from "../constants/errorMessages";
import { AppError } from "../lib/errors/AppError";
interface ErrorMessageProps {
    error: unknown;
    onRetry?: () => void;
  }
   
  export const ErrorMessage = ({ error, onRetry }: ErrorMessageProps) => {
    const message = AppError.isAppError(error)
      ? ERROR_MESSAGES[error.code] ?? error.message
      : ERROR_MESSAGES.DEFAULT;
   
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-red-800">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-sm text-red-600 underline"
          >
            Try again
          </button>
        )}
      </div>
    );
  };