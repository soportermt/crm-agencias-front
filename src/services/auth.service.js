import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://crm.2businesstravel.com/admin/";

export const authService = {
  login: async (username, password) => {
    const params = new URLSearchParams();
    params.append('UserLogin[username]', username);
    params.append('UserLogin[password]', password);

    const response = await axios.post(`${apiUrl}api/login.html`, params, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }
    });

    if (response.data && response.data.success) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } else {
      throw new Error("Credenciales incorrectas. Por favor, inténtelo de nuevo.");
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      localStorage.removeItem("user");
    }
  },


  getUser: () => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  },
  
  isAuthenticated: () => {
    return !!authService.getUser();
  }
};
