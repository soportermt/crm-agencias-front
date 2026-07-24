import { connectivityApi as api } from "@/lib/axios";

export const conectividadService = {
  async getClientChats(id) {
    const { data } = await api.get(`/clients/${id}/chats`);
    return data;
  },

  async getClientEmails(id, email) {
    const { data } = await api.get(`/clients/${id}/emails${email ? `?email=${encodeURIComponent(email)}` : ''}`);
    return data;
  }
};
