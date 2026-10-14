import api from "@/lib/axios";

export const grupoService = {
    async gruposapi() {
        const { data } = await api.get("/grupos/gruposapi");
        return data;
    },
};