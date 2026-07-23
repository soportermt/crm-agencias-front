import { connectivityApi as api } from "@/lib/axios";

export const conectividadService = {
  async getClientChats(id) {
    const { data } = await api.get(`/clients/${id}/chats`);
    return data;
  },

  async getClientEmails(id) {
    const { data } = await api.get(`/clients/${id}/emails`);
    return data;
  }
};
