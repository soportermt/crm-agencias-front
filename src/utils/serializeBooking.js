import qs from "qs";

const TIPO_SERVICIO_MAP = {
  hospedaje: 1,
  vuelo: 2,
  grupo: 3,
  boda: 4,
  tour: 5,
  traslado: 6,
};

const TIPOS_CON_FECHAS_PROPIAS = [3, 4];

const TIPOS_CON_MENORES = [2, 5, 6, 7, 8, 9, 10];

function toISODateOnly(date) {
  if (!date) return null;
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function buildSale(booking) {
  return {
    id_tipo_venta: booking.idTipoVenta ?? 0,
    pertenece_a: booking.perteneceA ?? null,
    id_agencia: booking.idAgencia,
    id_cliente: booking.customerId,
    id_usuario: booking.idUsuario,
    moneda: booking.moneda,
    fecha: toISODateOnly(booking.fecha),
    fecha_limite: toISODateOnly(booking.limiteCancelacion),
    pasajero_titular: booking.pasajeroTitular,
    descripcion: booking.descripcion,
    observaciones: booking.observaciones,
    cargo_servicios: booking.cargoServicios ?? 0,
  };
}

function buildDesglose(tipoId, data) {
  const desglose = { ...data };

  if (tipoId === TIPO_SERVICIO_MAP.hospedaje) {
    desglose.habitaciones = (data.habitaciones || []).map((hab) => {
  
      const adultos = [];
      const menores = [];
  
      (hab.pasajeros || []).forEach((p) => {
        const pasajero = {
          nombre: p.nombre,
          apellidos: p.apellidos ?? "",
        };
  
        if (p.tipo === "child") {
          pasajero.edad = p.edad;
          menores.push(pasajero);
        } else {
          adultos.push(pasajero);
        }
      });
  
      return {
        ...hab,
        ocupacion: `${hab.adultos} adulto(s), ${hab.menores} menor(es)`,
        pasajeros: {
          adultos,
          menores,
        },
      };
    });
  }

  if (TIPOS_CON_MENORES.includes(tipoId)) {
    desglose.pasajeros = {
      ...desglose.pasajeros,
      menores: desglose.pasajeros?.menores ?? [],
    };
  }

  if (tipoId === TIPO_SERVICIO_MAP.vuelo || tipoId === TIPO_SERVICIO_MAP.traslado) {
    desglose.redondo = Number(desglose.redondo ?? 0);
    if (tipoId === TIPO_SERVICIO_MAP.traslado) {
      desglose.escala = Number(desglose.escala ?? 0);
      desglose.internacional = Number(desglose.internacional ?? 0);
    }
  }

  return desglose;
}

function buildService(item) {
  const tipoId = TIPO_SERVICIO_MAP[item.tipo];
  if (!tipoId) {
    throw new Error(`Tipo de servicio desconocido: "${item.tipo}"`);
  }

  const inicio = item.data.checkIn ?? item.data.inicio;
  const fin = item.data.checkOut ?? item.data.fin;
  // console.log(item.data);
  const habitacion = item.data.habitaciones?.[0];
  return {
    id_tipo_servicio: tipoId,
  
    id_proveedor: Number(item.data.provider) || null,
    codigo: item.data.code ?? "",
    descripcion: item.data.hotel ?? "",
    limite_cliente: habitacion?.limiteCliente
    ? toISODateOnly(habitacion.limiteCliente)
    : null,
    fee: Number(item.data.fee ?? 0),
  
    inicio_servicio: inicio ? toISODateOnly(inicio) : null,
    fin_servicio: fin ? toISODateOnly(fin) : null,
    fecha_limite: habitacion?.limitePago
    ? toISODateOnly(habitacion.limitePago)
    : null,
  
    comision: 0,
    comision_pesos: 0,
    tarifa_publica: 0,
    costo: 0,
  
    desglose: buildDesglose(tipoId, item.data),
  };
}

export function serializeBooking(booking) {
  const payload = {
    sale: buildSale(booking),
    services: booking.servicios.map(buildService),
  };

  if (booking.idCotizacion) {
    payload.price_code = booking.idCotizacion;
  }

  return payload;
}

export function serializeBookingToForm(booking) {
  return qs.stringify(serializeBooking(booking), { arrayFormat: "indices" });
}
