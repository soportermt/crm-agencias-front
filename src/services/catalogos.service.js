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

    async searchCustomers() {
        const { data } = await api.get("/reservas/searchCustomers");
        return data;
    },

    async searchProviders() {
        const { data } = await api.get("/reservas/getProviders", {
        });

        return data;
    },
    async agencias() {
        const { data } = await api.get("/agencia/get", {
        });

        return data;
    },
    async servicios() {
        const { data } = await api.get("/tipoServicios/serviciosapi", {
        });

        return data;
    },
    // async roles() {
    //     const { data } = await api.get("/reservas/getProviders", {
    //     });

    //     return data;
    // },

    async createProveedor(proveedorData) {
        const { data } = await api.post("/proveedores/createApi/", proveedorData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            withCredentials: true,
        });
        return data;
    },
    async updateProveedor(proveedorData) {
        const { data } = await api.post("/proveedores/updateApi/", proveedorData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            withCredentials: true,
        });
        return data;
    },
    async searchProvidersP() {
        const { data } = await api.get("/proveedores/getProviders", {
        });

        return data;
    },
};