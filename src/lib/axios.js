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
        // Remove trailing slash if it exists
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

export default api;