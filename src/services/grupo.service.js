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

    async getGroupInfo(id_grupo) {
        const body = new URLSearchParams();
        body.append("id", id_grupo);
        body.append("tipo", "grupo");
    
        const { data } = await api.post("/grupos/getGroupInfo/", body, {
            withCredentials: true,
        });
        return data;
    },

    async getGroupHabs(id) {
        const { data } = await api.get(`/grupos/getGroupHabs/${id}`);
        return data;
    },

    async createHab(hab, guests) {
        const params = new URLSearchParams();
    
        Object.entries(hab).forEach(([key, value]) => {
            params.append(`hab[${key}]`, value ?? "");
        });
    
        guests.forEach((guest, i) => {
            Object.entries(guest).forEach(([key, value]) => {
                params.append(`guests[${i}][${key}]`, value ?? "");
            });
        });
    
        const { data } = await api.post('/grupos/createHab', params.toString(), {
            withCredentials: true,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        return data;
    },
    async updateHab(hab, guests) {
        const params = new URLSearchParams();
    
        Object.entries(hab).forEach(([key, value]) => {
            params.append(`hab[${key}]`, value ?? "");
        });
    
        guests.forEach((guest, i) => {
            Object.entries(guest).forEach(([key, value]) => {
                params.append(`guests[${i}][${key}]`, value ?? "");
            });
        });
    
        const { data } = await api.post('/grupos/updateHab', params.toString(), {
            withCredentials: true,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        return data;
    },

    async delete(id) {
        const { data } = await api.post(`/grupos/delete/${id}`);
        return data;
    },

    async deleteHab(id) {
        const { data } = await api.post(`/grupos/deleteHab/${id}`);
        return data;
    },

    async getGroupArchivos(id) {
        const { data } = await api.get(`/grupos/getGroupArchivos/${id}`);
        return data;
    },

    async uploadGroupArchivos(id_grupo, files) {
        const formData = new FormData();
        formData.append('group_code', id_grupo);
        files.forEach((f) => formData.append('files[]', f));
    
        const { data } = await api.post('/grupos/uploadFiles', formData);
        return data;
    },
};