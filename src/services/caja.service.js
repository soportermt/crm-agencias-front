import api from "@/lib/axios";

export const cajaService = {
    async caja() {
        const { data } = await api.get("/caja/getAgencySales", {
            withCredentials: true,
        });
        return data;
    },
}