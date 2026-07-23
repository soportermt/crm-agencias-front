import api from "@/lib/axios";

export const bookingService = {
    async create(booking) {
        const { data } = await api.post("/reservas/createApi", booking, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            withCredentials: true,
        });
        return data;
    },

    async reservas() {
        const { data } = await api.get("/reservas/getAgencySales");
        return data;
    },
};