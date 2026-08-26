import api from "@/lib/axios";

export const dashboardService = {
    async getSalesStats() {
        const { data } = await api.get("/dashboard/getSalesStats", {
            withCredentials: true,
        });
        return data;
    },
    async getMonthSales(idVendedor) {
        const { data } = await api.get("/dashboard/getMonthSales", {
            params: idVendedor ? { id_vendedor: idVendedor } : {},
            withCredentials: true,
        });
        return data;
    },
}