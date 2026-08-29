import { connectivityApi as api } from "@/lib/axios";

export const conectividadService = {
  async getClientChats(id, page = 1, limit = 50) {
    const { data } = await api.get(`/messages/client/${id}`, { params: { page, limit } });
    return data;
  },

  async getClientEmails(id) {
    const { data } = await api.get(`/email/client/${id}`);
    return data;
  },

  async getWhatsappSettings() {
    const { data } = await api.get('/settings/whatsapp');
    return data;
  },

  async saveWhatsappSettings(settingsData) {
    const { data } = await api.post('/settings/whatsapp', settingsData);
    return data;
  },

  async getEmailSettings() {
    const { data } = await api.get('/settings/email');
    return data;
  },

  async saveEmailSettings(settingsData) {
    const { data } = await api.post('/settings/email', settingsData);
    return data;
  }
};
