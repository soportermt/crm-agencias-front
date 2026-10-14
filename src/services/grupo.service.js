import api from "@/lib/axios";

export const grupoService = {
    async gruposapi(startDate = null, endDate = null) {
        const { data } = await api.get("/grupos/gruposapi", {
            params: {
                fecha_inicio: startDate,
                fecha_fin: endDate,
            },
            withCredentials: true,
        });
        return data;
    },

    async update(formData) {
        const { data } = await api.post('/grupos/update', formData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        });
        return data;
    },
};