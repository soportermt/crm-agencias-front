import api from "@/lib/axios";

export const catalogosService = {
    async searchHoteles(search) {
        const { data } = await api.get("/reservas/searchHotel.html", {
            params: {
                q: search,
            },
        });

        return data;
    },

    async searchCustomers() {
        const { data } = await api.get("/reservas/searchCustomers.html");
        return data;
    },

    async searchProviders() {
        const { data } = await api.get("/reservas/getProviders.html", {
        });

        return data;
    },
    async agencias() {
        const { data } = await api.get("/agencia/get.html", {
        });

        return data;
    },
    async servicios() {
        const { data } = await api.get("/tipoServicios/serviciosapi", {
        });

        return data;
    },
    // async roles() {
    //     const { data } = await api.get("/reservas/getProviders.html", {
    //     });

    //     return data;
    // },

    async createProveedor(proveedorData) {
        const { data } = await api.post("/proveedores/createApi/.html", proveedorData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            withCredentials: true,
        });
        return data;
    },

};