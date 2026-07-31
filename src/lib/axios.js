import axios from "axios";
import { authService } from "@/services/auth.service";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true
});

export const connectivityApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_CONNECTIVITY_API_URL || "http://localhost:4000/",
    withCredentials: true
});

export default api;