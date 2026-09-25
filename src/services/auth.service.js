import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://crmdev.2businesstravel.com/admin/";

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
      
      authService.logout();
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
      localStorage.removeItem("user");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("session_id");

      const currentPath = window.location.pathname.replace(/\/$/, '');
      if (!currentPath.endsWith('/login')) {
        window.location.href = '/login';
      }
    }
  },

  isTokenExpired: (token) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp < currentTime;
      }
      return false;
    } catch (e) {
      return true;
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
    if (typeof window !== 'undefined') {
      const authToken = localStorage.getItem('auth_token');
      const refreshToken = localStorage.getItem('refresh_token');
      const sessionId = localStorage.getItem('session_id');

      if (!authToken || !refreshToken || !sessionId) {
        authService.logout();
        return null;
      }

      if (authService.isTokenExpired(authToken)) {
        try {
          const refreshData = await authService.refreshToken();
          if (!refreshData || !refreshData.user) {
            authService.logout();
            return null;
          }
        } catch (e) {
          return null;
        }
      }

      if (!authService.getUser()) {
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
          } else {
            authService.logout();
            return null;
          }
        } catch (error) {
          authService.logout();
          return null;
        }
      }
      return authService.getUser();
    }
    return null;
  }
};
