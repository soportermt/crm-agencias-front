import api from "@/lib/axios";

const purchasesMock = [
  { id: 1, date: "2024-02-20", title: "Cancún", details: "Traslado" },
  { id: 2, date: "2024-02-22", title: "Playa del Carmen", details: "Reserva de hotel" },
  { id: 3, date: "2024-02-24", title: "Tulum", details: "Excursión a las ruinas" },
  { id: 4, date: "2024-02-26", title: "Cozumel", details: "Buceo" },
];

const quotesMock = [
  { id: 1, title: "Barcelo Maya Grand", details: "Rivera Maya/Playa del Carmen", dateRange: "09/06/2026 a 12/06/2026", type: "Hospedaje", icon: "hotel" },
  { id: 2, title: "Redondo", details: "Hotel - Aeropuerto", dateRange: "15/06/2026 al 19/06/2026", type: "Traslado", icon: "shuttle" },
];

const documentsMock = [
  { id: 1, name: "Acta_nacimiento.pdf", size: "290 kb", type: "PDF" },
  { id: 2, name: "Pasaporte.pdf", size: "340 kb", type: "PDF" },
];

const notesMock = [
  { id: 1, text: 'Confirmar con el operador receptivo en Europa el cambio de horario para el tour del grupo "Bloqueo Mayo".' },
  { id: 2, text: "Enviar por correo los pases de abordar y confirmaciones de hotel..." }
];

export const clientsService = {
  async getClients({ page = 1, perPage = 10, search = "", filter = "Todos" } = {}) {
    const { data } = await api.get("/clientes/clientesCrmApi", {
      params: { page, perPage, search, filter },
    });
    return data;
  },

  async getClientById(id) {
    const { data } = await api.get(`/clientes/clienteCrmDetailApi/${id}`);
    return data;
  },

  async createClient(clientData) {
    const { data } = await api.post("/clientes/clientesCrmCreate", clientData);
    return data;
  },

  async updateClient(id, clientData) {
    const { data } = await api.post(`/clientes/clientesCrmUpdate/${id}`, clientData);
    return data;
  },

  async deleteClient(id) {
    const { data } = await api.delete(`/clientes/clientesCrmDelete/${id}`);
    return data;
  },

  async searchCustomers() {
    const { data } = await api.get("/clientes/clientesCrmApi");
    return data;
  },

  async getMetrics() {
    const { data } = await api.get("/clientes/clientesCrmMetrics");
    return data;
  },

  async getClientQuotes(id) {
    return quotesMock;
  },

  async getClientPurchases(id) {
    return purchasesMock;
  },

  async getClientDocuments(id) {
    return documentsMock;
  },

  async getClientNotes(id) {
    return notesMock;
  }
};
