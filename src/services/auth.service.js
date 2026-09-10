import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://crm.2businesstravel.com/admin/";

export const authService = {
  login: async (username, password, rememberMe = false) => {
    const response = await axios.post(`${apiUrl}auth/login`, { username, password, rememberMe }, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (response.data && response.data.success) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        if (response.data.token) {
          localStorage.setItem('auth_token', response.data.token);
        }
        if (response.data.refresh_token) {
          localStorage.setItem('refresh_token', response.data.refresh_token);
        }
        if (response.data.session_id) {
          localStorage.setItem('session_id', response.data.session_id);
        }
      }
      return response.data;
    } else {
      throw new Error("Credenciales incorrectas. Por favor, inténtelo de nuevo.");
    }
  },

  refreshToken: async () => {
    if (typeof window === 'undefined') return null;
    const currentRefreshToken = localStorage.getItem('refresh_token');
    if (!currentRefreshToken) return null;

    try {
      const response = await axios.post(`${apiUrl}auth/refresh`, {
        refresh_token: currentRefreshToken
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.data && response.data.success) {
        if (response.data.token) {
          localStorage.setItem('auth_token', response.data.token);
        }
        if (response.data.refresh_token) {
          localStorage.setItem('refresh_token', response.data.refresh_token);
        }
        if (response.data.session_id) {
          localStorage.setItem('session_id', response.data.session_id);
        }
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
      }
      return null;
    } catch (error) {
      authService.logout();
      throw error;
    }
  },

  logout: async () => {
    if (typeof window !== 'undefined') {
      const refreshToken = localStorage.getItem('refresh_token');
      try {
        if (refreshToken) {
          await axios.post(`${apiUrl}auth/logout`, { refresh_token: refreshToken }, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });
        }
      } catch (e) {
        // Limpieza local continua si la peticion falla
      }
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      localStorage.removeItem("user");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("session_id");
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
  },

  checkSession: async () => {
    if (typeof window !== 'undefined' && !authService.getUser()) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const refreshData = await authService.refreshToken();
          if (refreshData && refreshData.user) {
            return refreshData.user;
          }
        } catch (e) {
          // Continuar con intento me si refresh falla
        }
      }

      try {
        const response = await axios.get(`${apiUrl}auth/me`, {
          withCredentials: true,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.data && response.data.success) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          if (response.data.token) {
            localStorage.setItem('auth_token', response.data.token);
          }
          if (response.data.refresh_token) {
            localStorage.setItem('refresh_token', response.data.refresh_token);
          }
          if (response.data.session_id) {
            localStorage.setItem('session_id', response.data.session_id);
          }
          return response.data.user;
        }
      } catch (error) {
        authService.logout();
      }
    }
    return authService.getUser();
  }
};
