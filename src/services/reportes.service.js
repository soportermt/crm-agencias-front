import api from "@/lib/axios";

export const reportesService = {
    async getReportesResumen(mes, anio) {
        const { data } = await api.get("/reportes/getReportesResumen", {
            params: {
                mes: mes,
                anio: anio,
            },
            withCredentials: true,
        });
        return data;
    },
}