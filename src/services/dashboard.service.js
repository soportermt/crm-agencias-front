import api from "@/lib/axios";

export const dashboardService = {
    async getSalesStats() {
        const { data } = await api.get("/dashboard/getSalesStats", {
            withCredentials: true,
        });
        return data;
    },
}