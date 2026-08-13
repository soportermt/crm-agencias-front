import api from "@/lib/axios";

export const usuariosService = {
  async getUsuarios() {
    const { data } = await api.get("/usuariosagencias/usuariosApi");
    return data;
  },

  async getCurrentUser() {
    const { data } = await api.get("/usuariosagencias/usuarioSesionApi");
    return data;
  },

  async createUsuario(usuarioData) {
    const { data } = await api.post("/usuariosagencias/createApi", usuarioData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return data;
  },

  async updateUsuario(id, usuarioData) {
    const { data } = await api.post(`/usuariosagencias/updateApi/${id}`, usuarioData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return data;
  },

  async deleteUsuario(id) {
    const { data } = await api.delete(`/usuariosagencias/eliminarUsuario/${id}`);
    return data;
  }
};
