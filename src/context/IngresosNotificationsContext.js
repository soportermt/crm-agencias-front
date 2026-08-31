"use client";
import { ingresosService } from "@/services/ingresos.service";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

const IngresosNotificationsContext = createContext(null);

export function IngresosNotificationsProvider({ children }) {
  const [vencidosCount, setVencidosCount] = useState(0);

  const refetchCount = useCallback(async () => {
    try {
      const count = await ingresosService.getVencidosCount();
      setVencidosCount(count);
    } catch (err) {
      console.error("Error al obtener conteo de vencidos", err);
    }
  }, []);

  useEffect(() => {
    refetchCount();

  }, [refetchCount]);

  return (
    <IngresosNotificationsContext.Provider value={{ vencidosCount, refetchCount }}>
      {children}
    </IngresosNotificationsContext.Provider>
  );
}

export function useIngresosNotifications() {
  return useContext(IngresosNotificationsContext);
}