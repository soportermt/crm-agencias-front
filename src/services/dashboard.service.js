import api from "@/lib/axios";

export const dashboardService = {
    async getSalesStats() {
        const { data } = await api.get("/dashboard/getSalesStats", {
            withCredentials: true,
        });
        return data;
    },
    async getMonthSales(idVendedor, idUsuario) {
        const params = {};
        if (idVendedor) params.id_vendedor = idVendedor;
        if (idUsuario) params.id_usuario = idUsuario;
    
        const { data } = await api.get("/dashboard/getMonthSales", {
            params,
            withCredentials: true,
        });
        return data;
    },
    async getDaySales() {
        const { data } = await api.get("/dashboard/getDaySales", {
            withCredentials: true,
        });
        return data;
    },
}