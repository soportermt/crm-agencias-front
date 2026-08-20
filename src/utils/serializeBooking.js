import qs from "qs";
import { calcularTotalNeto } from "./pricing";

const TIPO_SERVICIO_MAP = {
  hospedaje: 1,
  traslado: 2,
  tour: 5,
};

const TIPOS_CON_MENORES = [2, 5, 6, 7, 8, 9, 10];

function toISODateOnly(date) {
  if (!date) return null;
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function buildSale(booking) {
  return {
    id_venta: booking.idVenta ?? 0,
    folio: booking.folio ?? "",
    fecha: toISODateOnly(booking.fecha),
    pasajero_titular: booking.pasajeroTitular,
    descripcion: booking.descripcion,
    observaciones: booking.observaciones,
    cargo_servicios: booking.cargoServicios ?? 0,
    limite_cancelacion: toISODateOnly(booking.limiteCancelacion),
    moneda: booking.moneda,
    estatus: "venta",
    id_agencia: booking.idAgencia,
    id_vendedor: booking.idVendedor,
    id_cliente: booking.customerId,
    id_tipo_venta: booking.idTipoVenta ?? 0,
    pertenece_a: booking.perteneceA ?? null,

    // fecha_limite: toISODateOnly(booking.limiteCancelacion),
  };
}

function buildDesglose(tipoId, data, comisionPct) {
  const desglose = { ...data };

  if (tipoId === TIPO_SERVICIO_MAP.hospedaje) {
    desglose.habitaciones = (data.habitaciones || []).map((hab) => {

      const adultos = [];
      const menores = [];

      (hab.pasajeros || []).forEach((p) => {
        const pasajero = { nombre: p.nombre, apellidos: p.apellidos ?? "" };
        if (p.tipo === "child") {
          pasajero.edad = p.edad;
          menores.push(pasajero);
        } else {
          adultos.push(pasajero);
        }
      });

      const totalPublico = Number(hab.total_publico) || 0;

      return {
        ...hab,
        total_publico: totalPublico,
        total_neto: calcularTotalNeto(totalPublico, comisionPct),
        ocupacion: `${hab.adultos} adulto(s), ${hab.menores} menor(es)`,
        pasajeros: {
          adultos,
          menores,
        },
      };
    });

    desglose.comision = comisionPct;
  }

  if (TIPOS_CON_MENORES.includes(tipoId)) {
    desglose.pasajeros = {
      ...desglose.pasajeros,
      menores: desglose.pasajeros?.menores ?? [],
    };
  }
  if (tipoId === TIPO_SERVICIO_MAP.traslado) {
    return {
      redondo: data.redondo ? 1 : 0,
      adultos: data.adultos ?? 0,
      menores: data.menores ?? 0,
      ocupacion: `${data.adultos ?? 0} adulto(s), ${data.menores ?? 0} menor(es)`,
      pasajeros: {
        adultos: data.pasajeros?.adultos ?? [],
        menores: data.pasajeros?.menores ?? [],
      },
      comision: "%",
      origen: data.origen,
      destino: data.destino,
      salida_origen: data.salida_origen,
      llegada_destino: data.llegada_destino,
      salida_destino: data.salida_destino,
      llegada_origen: data.llegada_origen,
      equipaje: data.equipaje ?? [],
      recogida_hotel: data.pickup ?? "",
    };
  }

  if (tipoId === TIPO_SERVICIO_MAP.tour) {
    return {
      adultos: data.adultos ?? 0,
      menores: data.menores ?? 0,
      ocupacion: `${data.adultos ?? 0} adulto(s), ${data.menores ?? 0} menor(es)`,
      pasajeros: {
        adultos: data.pasajeros?.adultos ?? [],
        menores: data.pasajeros?.menores ?? [],
      },
      comision: "%",
      origen: data.origen,
      // descripcion: data.descripcion,
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

  const comisionPct = Number(item.data.providerData?.comision) || 0;

  let tarifaPublica = 0;
  let numHabs = 0;

  if (tipoId === TIPO_SERVICIO_MAP.hospedaje) {
    const habitaciones = item.data.habitaciones || [];
    numHabs = habitaciones.length;
    tarifaPublica = habitaciones.reduce(
      (sum, hab) => sum + (Number(hab.total_publico) || 0),
      0
    );
  } else {
    tarifaPublica = Number(item.data.total_publico) || 0;
  }

  let descripcion;

  if (tipoId === TIPO_SERVICIO_MAP.hospedaje) {
    descripcion = item.data.hotel;
  } else if (tipoId === TIPO_SERVICIO_MAP.tour) {
    descripcion = item.data.descripcion;
  } else if (tipoId === TIPO_SERVICIO_MAP.traslado) {
    descripcion = "";
  } else {
    descripcion = "";
  }

  const comisionPesos = tarifaPublica * (comisionPct / 100);
  const costo = tarifaPublica - comisionPesos;
  return {
    id_ventaservicio: item.data.id_ventaservicio ?? null,
    id_tipo_servicio: tipoId,

    id_proveedor: Number(item.data.provider) || null,
    codigo: item.data.code ?? "",
    descripcion: descripcion,
    limite_cliente: item.data.limiteCliente
      ? toISODateOnly(item.data.limiteCliente)
      : null,
    fee: Number(item.data.fee ?? 0),

    inicio_servicio: inicio ? toISODateOnly(inicio) : null,
    fin_servicio: fin ? toISODateOnly(fin) : null,
    fecha_limite: item.data.limitePago
      ? toISODateOnly(item.data.limitePago)
      : null,

    comision: comisionPct,
    comision_pesos: comisionPesos,
    tarifa_publica: tarifaPublica,
    costo,
    num_habs: numHabs,

    desglose: buildDesglose(tipoId, item.data, comisionPct),
  };
}

export function serializeBooking(booking) {
  const payload = {
    sale: buildSale(booking),
    // services: booking.servicios.map(buildService),
    services: booking.servicios.map((item) => buildService(item, booking)),
    ...(booking.idCotizacion ? { price_code: booking.idCotizacion } : {}),
  };

  if (booking.idCotizacion) {
    payload.price_code = booking.idCotizacion;
  }

  return payload;
}

export function serializeBookingToForm(booking) {
  return qs.stringify(serializeBooking(booking), { arrayFormat: "indices" });
}
