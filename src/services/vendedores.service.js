import api from "@/lib/axios";

export const vendedoresService = {
  async create(formData) {
    const { data } = await api.post(
      "/vendedores/create.html",
      formData,
      {
        withCredentials: true,
      }
    );

    return data;
  },

  async get() {
    const { data } = await api.get("/vendedores/get.html",
      {
        withCredentials: true,
      }
    );

    return data;
  },

  async getId(id) {
    const { data } = await api.get(`/vendedores/getId/${id}.html`, id,
      {
        withCredentials: true,
      }
    );

    return data;
  },

  async update(formData) {
    const { data } = await api.post(
      "/vendedores/update.html",
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
    const { data } = await api.get(`/vendedores/listarDocumentos.html?id_vendedor=${id}`, {
      withCredentials: true,
    });
    return data;
  },

  async descargarDocumento(idDocumento) {
    const response = await api.get(`/vendedores/descargar/${idDocumento}.html`, {
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
  
    const { data } = await api.post("/vendedores/agregarDocumento.html", fd, {
      withCredentials: true,
    });
    return data;
  },

  async eliminarDocumento(idDocumento) {
    const { data } = await api.post(`/vendedores/eliminarDocumento/${idDocumento}.html`, null, {
      withCredentials: true,
    });
    return data;
  },
  async listaVentas(id) {
    const { data } = await api.get(`/vendedores/getVentasVendedor/${id}.html`, {
      withCredentials: true,
    });
    return data;
  },
};