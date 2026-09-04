import { connectivityApi as api } from "@/lib/axios";

export const mensajeriaService = {
  async getConversations(channel, status, search, page = 1, limit = 20) {
    const params = { page, limit };
    if (channel && channel !== "all") params.channel = channel;
    if (status) params.status = status;
    if (search) params.search = search;
    const { data } = await api.get("/messages/conversations", { params });
    return data;
  },

  async getEmailThreads() {
    const { data } = await api.get("/email/threads");
    return data;
  },

  async getConversationMessages(id, page = 1, limit = 50) {
    const { data } = await api.get(`/messages/conversations/${id}/messages`, {
      params: { page, limit },
    });
    return data;
  },

  async getClientMessages(clientId, page = 1, limit = 50) {
    const { data } = await api.get(`/messages/client/${clientId}`, {
      params: { page, limit },
    });
    return data;
  },

  async markConversationRead(id) {
    const { data } = await api.patch(`/messages/conversations/${id}/read`);
    return data;
  },

  async updateConversationStatus(id, status) {
    const { data } = await api.patch(`/messages/conversations/${id}/status`, { status });
    return data;
  },

  async assignConversation(id, userId) {
    const { data } = await api.patch(`/messages/conversations/${id}/assign`, { userId });
    return data;
  },

  async sendMessage(payload) {
    const { data } = await api.post("/messages/send", payload);
    return data;
  },

  async getClientEmails(clientId) {
    const { data } = await api.get(`/email/client/${clientId}`);
    return data;
  },

  async sendEmail(payload) {
    const { data } = await api.post("/email/send", payload);
    return data;
  },

  async uploadMedia(file, agenciaId, clientId) {
    const formData = new FormData();
    formData.append("file", file);
    if (agenciaId) formData.append("agenciaId", agenciaId);
    if (clientId) formData.append("clientId", clientId);
    const { data } = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return data;
  }
};
