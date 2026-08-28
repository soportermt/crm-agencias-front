import api from "@/lib/axios";

export const ingresosService = {
    async getReporteIngresosAnio(idUsuario) {
        const { data } = await api.get("/ingresos/reporteIngresosAnio", {
            params: {
                id_usuario: idUsuario,
            },
            withCredentials: true,
        });
        return data;
    },
    async getResumenVentas(idUsuario) {
        const { data } = await api.get("/ingresos/resumenVentas", {
            params: {
                id_usuario: idUsuario,
            },
            withCredentials: true,
        });
        return data;
    },
    async getVentas(fechaInicio = null, fechaFin = null) {
        const { data } = await api.get("/ingresos/getVentas", {
            params: {
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin,
            },
            withCredentials: true,
        });
        return data;
    },
    async getVencidosCount() {
        const { data } = await api.get("/ingresos/getVencidosCount");
        return data.vencido ?? 0;
    },

}