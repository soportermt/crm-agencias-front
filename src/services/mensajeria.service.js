import { connectivityApi as api } from "@/lib/axios";

export const mensajeriaService = {
  async getConversations(channel, status) {
    const params = {};
    if (channel && channel !== "all") params.channel = channel;
    if (status) params.status = status;
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
  }
};
