import { connectivityApi as api } from "@/lib/axios";

export const templatesService = {
  async getTemplates() {
    const { data } = await api.get('/settings/whatsapp/templates');
    return data;
  },

  async createTemplate(templateData) {
    const { data } = await api.post('/settings/whatsapp/templates', templateData);
    return data;
  },

  async updateTemplate(id, templateData) {
    const { data } = await api.put(`/settings/whatsapp/templates/${id}`, templateData);
    return data;
  },

  async deleteTemplate(id) {
    const { data } = await api.delete(`/settings/whatsapp/templates/${id}`);
    return data;
  },

  async createDefaultsInMeta(overrides = {}) {
    const { data } = await api.post('/settings/whatsapp/templates/create-defaults', overrides);
    return data;
  },

  async syncMeta() {
    const { data } = await api.post('/settings/whatsapp/templates/sync-meta');
    return data;
  },

  async getAgencySettings() {
    const { data } = await api.get('/settings/whatsapp/templates/agency-settings');
    return data;
  },

  async updateAgencySettings(settingsData) {
    const { data } = await api.put('/settings/whatsapp/templates/agency-settings', settingsData);
    return data;
  }
};
