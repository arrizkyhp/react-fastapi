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

// Add a request interceptor to include Bearer token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError<any>) => {
        const originalRequest = error.config as RetryAxiosRequestConfig;

        // Handle token refresh for 401 errors
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                try {
                    // Call your refresh token endpoint
                    const response = await axios.post(`${API_BASE_URL}/${API_VERSION}/auth/refresh`, {
                        refresh_token: refreshToken
                    });

                    const { access_token } = response.data;
                    localStorage.setItem('access_token', access_token);

                    // Retry the original request with new token
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${access_token}`;
                    }

                    // Convert to AxiosRequestConfig for the retry
                    const retryConfig: AxiosRequestConfig = {
                        ...originalRequest,
                        headers: originalRequest.headers
                    };

                    return api.request(retryConfig);
                } catch (refreshError) {
                    // Refresh failed, clear tokens and redirect to login
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    if (window.location.pathname !== '/login') {
                        window.location.href = '/login';
                    }
                    return Promise.reject(refreshError);
                }
            }
        }

        // Handle other errors
        if (error.response) {
            console.error('API Error Response:', error.response.status, error.response.data);

            const errorData = error.response.data;
            let errorMessage = `Request failed with status ${error.response.status}`;

            if (errorData?.detail) {
                const { error_type, detail } = errorData.detail;
                errorMessage = detail || `${error_type}: An error occurred`;
            } else {
                errorMessage = errorData?.message ||
                    errorData?.error ||
                    errorMessage;
            }

            const customError = new Error(errorMessage);
            (customError as any).error_type = errorData?.detail?.error_type;
            (customError as any).detail = errorData?.detail?.detail;
            (customError as any).status_code = errorData?.detail?.status_code;

            throw customError;

        } else if (error.request) {
            console.error('API Error: No response received for request:', error.request);
            throw new Error('No response from server. Please check your network connection.');
        } else {
            console.error('API Error: Request setup failed:', error.message);
            throw new Error(`An unexpected error occurred: ${error.message}`);
        }
    }
);

export default api;
