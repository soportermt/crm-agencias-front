import { connectivityApi as api } from "@/lib/axios";

export const conectividadService = {
  async getClientChats(id) {
    const { data } = await api.get(`/messages/client/${id}.html`);
    return data;
  },

  async getClientEmails(id) {
    const { data } = await api.get(`/email/client/${id}.html`);
    return data;
  },

  async getWhatsappSettings() {
    const { data } = await api.get('/settings/whatsapp.html');
    return data;
  },

  async saveWhatsappSettings(settingsData) {
    const { data } = await api.post('/settings/whatsapp.html', settingsData);
    return data;
  },

  async getEmailSettings() {
    const { data } = await api.get('/settings/email.html');
    return data;
  },

  async saveEmailSettings(settingsData) {
    const { data } = await api.post('/settings/email.html', settingsData);
    return data;
  }
};
