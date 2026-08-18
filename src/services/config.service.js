import api from "@/lib/axios";

export const configService = {
    async config() {
        const { data } = await api.get("/agencia/agenciaapi", {
            withCredentials: true,
        });
        return data;
    },

    async editarAgencia(datosAgencia, archivoLogo = null) {
        const formData = new FormData();
        Object.keys(datosAgencia).forEach((key) => {
            if (key === "logotipo") return;
            if (datosAgencia[key] !== null && datosAgencia[key] !== undefined) {
                formData.append(`Agencia[${key}]`, datosAgencia[key]);
            }
        });
        if (archivoLogo) {
            formData.append("Agencia[logotipo]", archivoLogo);
        }

        const { data } = await api.post(
            `/agencia/update?id=${datosAgencia.id_agencia}`,
            formData,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return data;
    },

    async bancos() {
        const { data } = await api.get("/cuentasAgencia/getAgencyAccounts", {
            withCredentials: true,
        });
        return data;
    },

    async createCuenta(datos) {
        const { data } = await api.post("/cuentasAgencia/create", datos, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return data;
    },

    async updateCuenta(datos) {
        const { data } = await api.post("/cuentasAgencia/update", datos, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return data;
    },
}