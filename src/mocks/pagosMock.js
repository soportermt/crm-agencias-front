export const pagosDetailMock = {
  cliente: "José María Pérez",
  descripcion: "Tour por yates en Puerto Escondido",
  numeroReserva: "152148696",
  destino: "Puerto Escondido",
  hotel: "RIU SANTA FE",
  fechaEntrada: "15 de Julio 2026",
  fechaSalida: "20 de Julio 2026",
  estado: "Vigente",
  ventaHechaPor: "Juana Lopéz",
  fechaLimitePago: "05 de Jun 2026",
};

export const pagosHistorialMock = [
  { id: 1, folio: "JDHEY272", fechaPago: "15 de ago. 2026", pago: "$ 1700.50", moneda: "MXN" },
  { id: 2, folio: "JHSEY381", fechaPago: "25 de sep. 2026", pago: "$ 1200.00", moneda: "MXN" },
  { id: 3, folio: "KJHDS493", fechaPago: "15 de oct. 2026", pago: "$ 900.75", moneda: "MXN" },
  { id: 4, folio: "PLMNT578", fechaPago: "22 de nov. 2026", pago: "$ 1300.25", moneda: "MXN" },
  { id: 5, folio: "QWEFG982", fechaPago: "20 de dic. 2026", pago: "$ 850.60", moneda: "MXN" },
];

export const pagosDesgloseMock = {
  total: "$6,500.00",
  pagado: "$5,952.13",
  saldo: "$547.87",
};

export const pagoServiciosMock = [
  {
    servicio: "Hospedaje",
    proveedor: "Agencia Viajando Siempre",
    descripcion: "Hospedaje en hotel Hard Rock Vallarta en estancia especificada",
    saldo: "$1,499.00",
  },
  {
    servicio: "Traslado",
    proveedor: "Agencia Viajando Siempre",
    descripcion: "Traslado aeropuerto a hotel redondo",
    saldo: "$350.00",
  },
];

export const pagosListaMock = [
  { id: 1, codigoConfirmacion: "SID5853732", cliente: "Andrea Hernández", metodoPago: "Transferencia", tipoPago: "Abono", limitePago: "12 de jun. 2026", total: "$ 1,700.50", moneda: "MXN", estatus: "Activo" },
  { id: 2, codigoConfirmacion: "SID5853733", cliente: "Carlos Mendoza", metodoPago: "Retiro", tipoPago: "Pago", limitePago: "15 de jun. 2026", total: "$ 500.00", moneda: "MXN", estatus: "Activo" },
  { id: 3, codigoConfirmacion: "SID5853734", cliente: "Laura Jiménez", metodoPago: "Transferencia", tipoPago: "Abono", limitePago: "20 de jun. 2026", total: "$ 2,500.75", moneda: "MXN", estatus: "Activo" },
  { id: 4, codigoConfirmacion: "SID5853735", cliente: "Javier Ruiz", metodoPago: "Retiro", tipoPago: "Pago", limitePago: "22 de jun. 2026", total: "$ 800.00", moneda: "MXN", estatus: "Activo" },
  { id: 5, codigoConfirmacion: "SID5853736", cliente: "María López", metodoPago: "Transferencia", tipoPago: "Abono", limitePago: "25 de jun. 2026", total: "$ 3,200.00", moneda: "MXN", estatus: "Pendiente" },
];
