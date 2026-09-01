import { connectivityApi } from '@/lib/axios';

export const notificationsService = {
  getRecentNotifications: async (limit = 20) => {
    try {
      const response = await connectivityApi.get(`/api/notifications?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }
};
