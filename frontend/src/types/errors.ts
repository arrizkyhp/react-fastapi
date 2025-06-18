export interface CustomApiError extends Error {
    error_type?: string;
    detail?: string;
    status_code?: number;
}
