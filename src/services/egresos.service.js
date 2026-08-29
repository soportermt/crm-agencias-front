import api from "@/lib/axios";

export const egresosService = {
    async getResumenVentas() {
        const { data } = await api.get("/egresos/resumenVentas", {
            withCredentials: true,
        });
        return data;
    },
    async getVentas(fechaInicio = null, fechaFin = null) {
        const { data } = await api.get("/egresos/getVentas", {
            params: {
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin,
            },
            withCredentials: true,
        });
        return data;
    },
}