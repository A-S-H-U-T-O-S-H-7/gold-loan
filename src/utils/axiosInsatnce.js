import axios from "axios";
import { useAdminAuthStore } from "@/lib/store/authAdminStore";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "https://atdmoney.in/api/",
    timeout: 10000,
});

// Helper to check if the request is authentication-related
const isAuthRequest = (url) => {
    const authEndpoints = ['/crm/login', '/crm/logout', '/login', '/auth', '/signin'];
    return authEndpoints.some(endpoint => url.includes(endpoint));
};

api.interceptors.request.use(
    (config) => {
        const token = useAdminAuthStore.getState().getToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        config.headers["X-App-Version"] = "1.0.0";
        config.headers["Accept"] = "application/json";
        config.headers["Content-Type"] = "application/json";
        
        // Store original URL for response interceptor
        config._isAuthRequest = isAuthRequest(config.url);
        
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => {
        // Return the full response data
        return response.data;
    },
    (error) => {
        if (error.response) {
            // Only logout/redirect for 401 if NOT an auth request
            if (error.response.status === 401 && !error.config?._isAuthRequest) {
                useAdminAuthStore.getState().logout();

                if (typeof window !== "undefined") {
                    window.location.href = "/crm";
                }
            } else if (error.response.status === 500) {
                console.error("Server error:", error.response.data.message);
            }
        } else {
            console.error("Network error:", error.message);
        }
        return Promise.reject(error);
    }
);

export default api;