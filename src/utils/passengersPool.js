export function getPassengersPool(servicios) {
  let best = { adultos: [], menores: [] };

  servicios.forEach(({ tipo, data }) => {
    let current = { adultos: [], menores: [] };

    if (tipo === "hospedaje") {
      (data.habitaciones || []).forEach((hab) => {
        (hab.pasajeros || []).forEach((p) => {
          const target = p.tipo === "child" ? current.menores : current.adultos;
          target.push(p);
        });
      });
    } else {
      const { adultos = [], menores = [] } = data.pasajeros || {};
      current.adultos = adultos.map((p) => ({ ...p, tipo: "adult" }));
      current.menores = menores.map((p) => ({ ...p, tipo: "child" }));
    }

    const currentTotal = current.adultos.length + current.menores.length;
    const bestTotal = best.adultos.length + best.menores.length;
    if (currentTotal > bestTotal) best = current;
  });

  return best;
}