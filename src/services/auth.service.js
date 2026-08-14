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
          // El backend ya genera la cookie segura HttpOnly, solo necesitamos guardar el token para Connectivity
          localStorage.setItem('auth_token', response.data.token);
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

  logout: () => {
    if (typeof window !== 'undefined') {
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      localStorage.removeItem("user");
      localStorage.removeItem("auth_token");
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
            // El backend ya determinó si es 30 días o 1 día según la cookie
            localStorage.setItem('auth_token', response.data.token);
          }
          if (response.data.session_id) {
            localStorage.setItem('session_id', response.data.session_id);
          }
          return response.data.user;
        }
      } catch (error) {
        // Falló el silent refresh (cookie expirada o inválida)
        authService.logout();
      }
    }
    return authService.getUser();
  }
};
