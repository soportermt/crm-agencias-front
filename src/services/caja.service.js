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

    async getVenta(id) {
        const { data } = await api.get(`/caja/getVenta/${id}`, {
            withCredentials: true,
        });
        return data;
    },
    async getWaysToPay() {
        const { data } = await api.get('/caja/getWaysToPay', {
            withCredentials: true,
        });
        return data;
    },
    async savePayment(formData) {
        const { data } = await api.post('/caja/savePayment', formData, {
            withCredentials: true,
        });
        return data;
    },
    async getSalePayments(id) {
        const { data } = await api.get(`/caja/getSalePayments/${id}`, {
            withCredentials: true,
        });
        return data;
    },

}