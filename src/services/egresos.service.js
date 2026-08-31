import api from "@/lib/axios";

export const egresosService = {
    async getResumenVentas() {
        const { data } = await api.get("/egresos/resumenVentas", {
            withCredentials: true,
        });
        return data;
    },
    async getVentas(fechaInicio = null, fechaFin = null, idServicio) {
        const { data } = await api.get("/egresos/getVentas", {
            params: {
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin,
                id_servicio: idServicio
            },
            withCredentials: true,
        });
        return data;
    },
    async getResumenOperadores() {
        const { data } = await api.get("/egresos/getResumenOperadores", {
            withCredentials: true,
        });
        return data;
    },
}