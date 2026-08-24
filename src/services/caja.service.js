import api from "@/lib/axios";

export const cajaService = {
    async caja() {
        const { data } = await api.get("/caja/getAgencySales.html", {
            withCredentials: true,
        });
        return data;
    },
}