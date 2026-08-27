import api from "@/lib/axios";

export const ingresosService = {
    async getReporteIngresosAnio() {
        const { data } = await api.get("/ingresos/reporteIngresosAnio", {
            withCredentials: true,
        });
        return data;
    }
}