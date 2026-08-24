import api from "@/lib/axios";

export const bookingService = {
    async create(booking) {
        const { data } = await api.post("/reservas/createApi.html", booking, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            withCredentials: true,
        });
        return data;
    },

    async reservas() {
        const { data } = await api.get("/reservas/getAgencySales.html");
        return data;
    },

    async pasajeros() {
        const { data } = await api.get("/reservas/getPasajeros.html");
        return data;
    },

    async grupos() {
        const { data } = await api.get("/reservas/getGroupedSales.html");
        return data;
    },

    async metrics() {
        const { data } = await api.get("/reservas/getSalesStats.html");
        return data;
    },

    async getSaleInfo(id) {
        const { data } = await api.get(`/reservas/getSaleInfo/${id}.html`);
        return data;
    },

    async update(booking) {
        const { data } = await api.post("/reservas/updateApi.html", booking, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            withCredentials: true,
        });
        return data;
    },

    async paymentsPromises(id_venta) {
        const params = new URLSearchParams({ id_venta });
        const { data } = await api.post("/reservas/loadPaymentsPromises.html", params, {
          withCredentials: true,
        });
        return data;
    },

    async createPaymentsPromises(promise) {
        const { data } = await api.post("/reservas/createPaymentsPromises.html", promise, {
          withCredentials: true,
        });
        return data;
    },

    async deletePaymentsPromises(id_venta) {
        const { data } = await api.post("/reservas/deletePaymentsPromises.html", id_venta, {
          withCredentials: true,
        });
        return data;
    },
};