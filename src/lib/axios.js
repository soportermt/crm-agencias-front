import axios from "axios";
import { authService } from "@/services/auth.service";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true
});

const connectivityUrl = process.env.NEXT_PUBLIC_CONNECTIVITY_API_URL || "http://localhost:4000/";
let connectivityBase = connectivityUrl;

if (process.env.NODE_ENV === 'development' && connectivityUrl.startsWith('http')) {
    try {
        const urlObj = new URL(connectivityUrl);
        connectivityBase = `/api-connectivity${urlObj.pathname}`;
        if (connectivityBase.endsWith('/')) {
            connectivityBase = connectivityBase.slice(0, -1);
        }
    } catch (e) {
        connectivityBase = '/api-connectivity';
    }
}

export const connectivityApi = axios.create({
    baseURL: connectivityBase,
    withCredentials: true
});

api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

connectivityApi.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

const setupResponseInterceptor = (instance) => {
    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            if (error.response && error.response.status === 401 && originalRequest && !originalRequest._retry) {
                const url = originalRequest.url || "";
                if (url.includes("auth/login") || url.includes("auth/refresh")) {
                    return Promise.reject(error);
                }

                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                        .then((token) => {
                            if (token) {
                                originalRequest.headers.Authorization = `Bearer ${token}`;
                            }
                            return instance(originalRequest);
                        })
                        .catch((err) => Promise.reject(err));
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    const refreshData = await authService.refreshToken();
                    if (refreshData && refreshData.token) {
                        processQueue(null, refreshData.token);
                        originalRequest.headers.Authorization = `Bearer ${refreshData.token}`;
                        return instance(originalRequest);
                    } else {
                        processQueue(new Error("Refresh token invalido"), null);
                        authService.logout();
                        return Promise.reject(error);
                    }
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    authService.logout();
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }

            return Promise.reject(error);
        }
    );
};

setupResponseInterceptor(api);
setupResponseInterceptor(connectivityApi);

export default api;