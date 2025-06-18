import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios'

// Extend the Axios config type to include _retry property
interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION;

const api: AxiosInstance = axios.create({
    baseURL: `${API_BASE_URL}/${API_VERSION}`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError<any>) => {
        const originalRequest = error.config as RetryAxiosRequestConfig;
        const status = error.response?.status;
        const requestUrl = originalRequest.url;

        // Condition 1: It's a 401 error
        // Condition 2: The original request has not been retried yet
        // Condition 3: IMPORTANT: The original request IS NOT the login or refresh endpoint itself
        if (
            status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !requestUrl?.includes('/auth/login') && // Don't try to refresh if login itself failed
            !requestUrl?.includes('/auth/refresh') // Don't try to refresh if refresh itself failed (prevent loop)
        ) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh the token using the refresh endpoint
                // Axios will automatically send the refresh_token cookie due to withCredentials: true
                await axios.post(`${API_BASE_URL}/${API_VERSION}/auth/refresh`, {}, {
                    withCredentials: true
                });

                // If refresh is successful, cookies are updated automatically by the backend.
                // Now, retry the original failed request.
                const retryConfig: AxiosRequestConfig = {
                    ...originalRequest,
                    withCredentials: true
                };

                return api.request(retryConfig);
            } catch (refreshError) {
                // If refresh token call itself fails (e.g., refresh token expired/invalid),
                // then we must redirect to login.
                console.error("Refresh token failed, redirecting to login", refreshError);
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login'; // Full page reload to ensure state is clear
                }
                // Important: Re-reject the promise so the original mutation/query gets an error
                return Promise.reject(refreshError);
            }
        }

        // Handle other errors (including 401s for login/refresh, and other non-401 errors)
        if (error.response) {
            console.error('API Error Response:', error.response.status, error.response.data);

            // Ensure the error.response.data structure is consistent
            // If the backend returns a different structure for login 401s, handle it here
            if (!error.response.data?.detail && error.response.data?.message) {
                error.response.data = {
                    detail: {
                        status_code: error.response.status,
                        error_type: "api_error", // Default or 'server_error'
                        detail: error.response.data.message || 'An unknown error occurred on the server',
                    }
                };
            }
            // Re-throw the original error to be caught by react-query's onError
            return Promise.reject(error);

        } else if (error.request) {
            console.error('API Error: No response received for request:', error.request);
            return Promise.reject(new AxiosError('No response from server. Please check your network connection.', AxiosError.ERR_NETWORK, originalRequest, error.request, undefined));
        } else {
            console.error('API Error: Request setup failed:', error.message);
            return Promise.reject(new AxiosError(`An unexpected error occurred: ${error.message}`, AxiosError.ERR_BAD_REQUEST, originalRequest, undefined, undefined));
        }
    }
);

export default api;
