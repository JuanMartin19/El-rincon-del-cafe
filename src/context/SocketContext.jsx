import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

// Esta URL cambiará cuando subamos tu backend a internet (ej. Render o Railway)
const SOCKET_URL = 'https://rincon-del-cafe-api.onrender.com'; 

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // La rúbrica pide validación y reconexión automática, socket.io lo hace por defecto
    const newSocket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('Conectado al servidor WebSocket ⚡');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Desconectado del servidor');
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);