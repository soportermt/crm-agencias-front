import { clientsApi as api } from "@/lib/axios";

export const clientsService = {
  async getClients() {
    const { data } = await api.get("/clients");
    return data;
  },

  async getClientById(id) {
    const { data } = await api.get(`/clients/${id}`);
    return data;
  },

  async createClient(clientData) {
    const { data } = await api.post("/clients", clientData);
    return data;
  },

  async updateClient(id, clientData) {
    const { data } = await api.put(`/clients/${id}`, clientData);
    return data;
  },

  async deleteClient(id) {
    const { data } = await api.delete(`/clients/${id}`);
    return data;
  },

  async searchCustomers() {
    const { data } = await api.get("/clients/search");
    return data;
  },

  async getClientChats(id) {
    const { data } = await api.get(`/clients/${id}/chats`);
    return data;
  },

  async getClientEmails(id) {
    const { data } = await api.get(`/clients/${id}/emails`);
    return data;
  },

  async getClientQuotes(id) {
    const { data } = await api.get(`/clients/${id}/quotes`);
    return data;
  },

  async getClientPurchases(id) {
    const { data } = await api.get(`/clients/${id}/purchases`);
    return data;
  },

  async getClientDocuments(id) {
    const { data } = await api.get(`/clients/${id}/documents`);
    return data;
  },

  async getClientNotes(id) {
    const { data } = await api.get(`/clients/${id}/notes`);
    return data;
  }
};

