import api from "@/lib/axios";

export const vendedoresService = {
  async create(formData) {
    const { data } = await api.post(
      "/vendedores/create",
      formData,
      {
        withCredentials: true,
      }
    );

    return data;
  },

  async get() {
    const { data } = await api.get("/vendedores/get",
      {
        withCredentials: true,
      }
    );

    return data;
  },

  async getId(id) {
    const { data } = await api.get(`/vendedores/getId/${id}`, id,
      {
        withCredentials: true,
      }
    );

    return data;
  },

  async update(formData) {
    const { data } = await api.post(
      "/vendedores/update",
      formData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    return data;
  },

  async getDocId(id) {
    const { data } = await api.get(`/vendedores/listarDocumentos?id_vendedor=${id}`, {
      withCredentials: true,
    });
    return data;
  },

  async descargarDocumento(idDocumento) {
    const response = await api.get(`/vendedores/descargar/${idDocumento}`, {
      withCredentials: true,
      responseType: 'blob', 
    });
    return response.data;
  },

  async agregarDocumento(idVendedor, tipo, archivo) {
    const fd = new FormData();
    fd.append("id_vendedor", idVendedor);
    fd.append("tipo", tipo);
    fd.append("archivo", archivo);
  
    const { data } = await api.post("/vendedores/agregarDocumento", fd, {
      withCredentials: true,
    });
    return data;
  },

  async eliminarDocumento(idDocumento) {
    const { data } = await api.post(`/vendedores/eliminarDocumento/${idDocumento}`, null, {
      withCredentials: true,
    });
    return data;
  },
  async listaVentas(id) {
    const { data } = await api.get(`/vendedores/getVentasVendedor/${id}`, {
      withCredentials: true,
    });
    return data;
  },
};