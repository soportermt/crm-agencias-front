export const calcularTotalesHabitaciones = (habitaciones = []) => {
    return habitaciones.reduce(
      (totales, habitacion) => {
        totales.neto += Number(habitacion.total_neto) || 0;
        totales.publico += Number(habitacion.total_publico) || 0;
        return totales;
      },
      { neto: 0, publico: 0 }
    );
  };