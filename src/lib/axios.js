import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true
});

export const connectivityApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_CONNECTIVITY_API_URL || "http://localhost:4000/",
    withCredentials: true
});

connectivityApi.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default api;