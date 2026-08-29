import api from "@/lib/axios";

export const egresosService = {
    async getResumenVentas() {
        const { data } = await api.get("/egresos/resumenVentas", {
            withCredentials: true,
        });
        return data;
    },
}