import axios from "axios";
import { useAdminAuthStore } from "@/lib/store/authAdminStore";

const api = axios.create({
    baseURL: (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/").trim(),
    timeout: 10000,
    withCredentials: true,
});

// Helper to check if the request is authentication-related
const isAuthRequest = (url) => {
    return ['/crm/login', '/crm/refresh', '/crm/logout'].some(endpoint => url?.startsWith(endpoint));
};

api.interceptors.request.use(
    (config) => {
        const token = useAdminAuthStore.getState().getToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        config.headers["X-App-Version"] = "1.0.0";
        config.headers["Accept"] = "application/json";
        // Keep the content type supplied by callers such as binary KYC uploads.
        if (!config.headers.getContentType()) {
            config.headers.setContentType("application/json");
        }
        
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
    async (error) => {
        if (error.response) {
            if (error.response.status === 401 && error.config?.url?.startsWith('/crm/') && !error.config?._isAuthRequest) {
                if (!error.config._retriedAfterRefresh) {
                    error.config._retriedAfterRefresh = true;
                    try {
                        const token = await useAdminAuthStore.getState().renewSession();
                        error.config.headers.Authorization = `Bearer ${token}`;
                        return api(error.config);
                    } catch {
                        // The refresh session has expired or was revoked.
                    }
                }
                useAdminAuthStore.getState().clearSession();
                if (typeof window !== 'undefined') window.location.replace('/crm');
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
