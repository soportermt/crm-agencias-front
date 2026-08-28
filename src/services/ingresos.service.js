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
    }
}