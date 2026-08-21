import api from "@/lib/axios";

export const usuariosService = {
  async getUsuarios() {
    const { data } = await api.get("/UsuariosAgencias/usuariosApi");
    return data;
  },

  async getRoles() {
    const { data } = await api.get("/UsuariosAgencias/rolesApi");
    return data;
  },

  async getCurrentUser() {
    const { data } = await api.get("/UsuariosAgencias/usuarioSesionApi");
    return data;
  },

  async createUsuario(usuarioData) {
    const { data } = await api.post("/UsuariosAgencias/createApi", usuarioData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return data;
  },

  async updateUsuario(id, usuarioData) {
    const { data } = await api.post(`/UsuariosAgencias/updateApi/${id}`, usuarioData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return data;
  },

  async deleteUsuario(id) {
    const { data } = await api.delete(`/UsuariosAgencias/eliminarUsuario/${id}`);
    return data;
  }
};
