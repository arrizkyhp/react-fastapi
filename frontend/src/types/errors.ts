import { AxiosError } from 'axios';

// 1. The nested 'detail' object that comes from your FastAPI backend
export interface ApiErrorDetail {
    status_code: number;
    error_type: string;
    detail: string;
    timestamp?: string;
}

// 2. The data object that Axios puts into error.response.data
// This is the shape of your backend's full error response
export interface ApiErrorResponseData {
    detail?: ApiErrorDetail; // This is what you specifically want to access
    message?: string; // Some APIs might put a top-level message
    error?: string; // Other generic error fields
}

// 3. Your custom AxiosError type, which is what useMutation will receive
// It extends AxiosError and specifically types the `response.data` part
export interface CustomApiError extends AxiosError<ApiErrorResponseData> {
    // You can add any extra properties here if your interceptor modifies the error object
    // For example, if you normalized a top-level message.
    // processedErrorMessage?: string;
}
