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
};