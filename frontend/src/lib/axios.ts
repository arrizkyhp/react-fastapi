import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // Set your base URL here
    withCredentials: true, // Automatically include cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError<any>) => { // 'any' here is the type of error.response.data
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx (e.g., 400, 401, 404, 500)
            console.error('API Error Response:', error.response.status, error.response.data);

            // You can customize error messages based on status code or backend response
            const errorMessage = error.response.data?.message ||
                error.response.data?.error ||
                `Request failed with status ${error.response.status}`;

            // You might want to throw a custom error here or use a notification system
            throw new Error(errorMessage);

        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and http.ClientRequest in node.js
            console.error('API Error: No response received for request:', error.request);
            throw new Error('No response from server. Please check your network connection.');

        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('API Error: Request setup failed:', error.message);
            throw new Error(`An unexpected error occurred: ${error.message}`);
        }
    }
);

export default api;
