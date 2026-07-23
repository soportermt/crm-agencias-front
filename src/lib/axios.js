import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL
});

export const clientsApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_CLIENTS_API_URL
});

export default api;