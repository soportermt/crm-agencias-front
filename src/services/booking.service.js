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

    async pasajeros() {
        const { data } = await api.get("/reservas/getPasajeros");
        return data;
    },

    async grupos() {
        const { data } = await api.get("/reservas/getGroupedSales");
        return data;
    },

    async metrics() {
        const { data } = await api.get("/reservas/getSalesStats");
        return data;
    },

    async getSaleInfo(id) {
        const { data } = await api.get(`/reservas/getSaleInfo/${id}`);
        return data;
    },

    async update(booking) {
        const { data } = await api.post("/reservas/updateApi", booking, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            withCredentials: true,
        });
        return data;
    },

    async paymentsPromises(id_venta) {
        const params = new URLSearchParams({ id_venta });
        const { data } = await api.post("/reservas/loadPaymentsPromises", params, {
          withCredentials: true,
        });
        return data;
    },

    async createPaymentsPromises(promise) {
        const { data } = await api.post("/reservas/createPaymentsPromises", promise, {
          withCredentials: true,
        });
        return data;
    },

    async deletePaymentsPromises(id_venta) {
        const { data } = await api.post("/reservas/deletePaymentsPromises", id_venta, {
          withCredentials: true,
        });
        return data;
    },
};