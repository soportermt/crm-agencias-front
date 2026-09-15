import { connectivityApi as api } from "@/lib/axios";

export const quotesService = {
  async sendQuote(formData) {
    const { data } = await api.post("/quotes/send", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  async getClientQuotes(clientId) {
    const { data } = await api.get(`/quotes/client/${clientId}`);
    return data;
  },
};
