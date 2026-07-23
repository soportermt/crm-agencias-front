import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL
});

export const connectivityApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_CONNECTIVITY_API_URL || "http://localhost:4000/"
});

export default api;