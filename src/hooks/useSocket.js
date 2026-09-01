import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// Ajustar a la URL de producción si es necesario
const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_CONNECTIVITY_API_URL || 'http://localhost:4000';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    let token = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('auth_token');
    }

    let socketPath = '/socket.io';
    let socketDomain = SOCKET_SERVER_URL;
    
    try {
      const url = new URL(SOCKET_SERVER_URL);
      if (url.pathname !== '/' && url.pathname !== '') {
        // Remove trailing slash if exists and append /socket.io
        const basePath = url.pathname.endsWith('/') ? url.pathname.slice(0, -1) : url.pathname;
        socketPath = `${basePath}/socket.io`;
        // Importante: Usar solo el origin para que socket.io no asuma que el pathname es un namespace
        socketDomain = url.origin;
      }
    } catch (e) {
      // Ignorar error si no es una URL válida
    }

    const socketInstance = io(socketDomain, {
      path: socketPath,
      transports: ['websocket'],
      auth: {
        token: token
      }
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return socket;
};
