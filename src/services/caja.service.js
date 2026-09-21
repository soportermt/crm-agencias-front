import api from "@/lib/axios";

export const cajaService = {
    async caja(startDate = null, endDate = null, cliente = null, vendedor = null) {
        const { data } = await api.get("/caja/getAgencySales", {
            params: {
                fecha_inicio: startDate,
                fecha_fin: endDate,
                id_cliente: cliente,
                id_vendedor: vendedor
            },
            withCredentials: true,
        });
        return data;
    },
}