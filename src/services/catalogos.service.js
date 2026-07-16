import api from "@/lib/axios";

export const catalogosService = {
    async searchHoteles(search) {
        const { data } = await api.get("/reservas/searchHotel", {
            params: {
                q: search,
            },
        });

        return data;
    },
};