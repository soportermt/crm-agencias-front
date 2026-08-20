import HospedajeForm from "@/components/booking/forms/HospedajeForm";
import TrasladoForm from "@/components/booking/forms/TrasladoForm";
import { faHotel, faMap, faVanShuttle } from "@fortawesome/free-solid-svg-icons";

export const serviceCatalog = [
  {
    id: "hospedaje",
    nombre: "Hospedaje",
    icon: faHotel,
    Form: HospedajeForm,
    defaultData: {
      provider: "",
      providerName: "",
      code: "",
      fee: "",
      hotel: "",
      destino: "",
      checkIn: null,
      checkOut: null,
      habitaciones: []
    },
    validate: (data) => {
      const errors = {};
      if (!data.hotel) errors.hotel = "Selecciona un hotel";
      if (!data.checkIn) errors.checkIn = "Requerido";
      if (!data.checkOut) errors.checkOut = "Requerido";
      return errors;
    },
    summary: (data) => ({ hotel: data.hotel || "Sin hotel", destino: data.destino, dateStart: data.checkIn, dateEnd: data.checkOut }),
  },
  {
    id: "traslado",
    nombre: "Traslado",
    icon: faVanShuttle,
    Form: TrasladoForm,
    defaultData: {
      provider: "",
      providerName: "",
      code: "",
      origen: "",
      destino: "",
      equipaje: [],
      checkIn: null,
      checkOut: null,
      pasajeros: {
        adultos: [
          { nombre: "", apellidos: "" },
          { nombre: "", apellidos: "" },
        ],
        menores: [],
      },
      salida_origen: "",
      salida_destino: "",
      pickup: "",
      llegada_origen: "",
      llegada_destino: "",
      limitePago: null,
      limiteCliente: null,
      fee: "",
      total_publico: "",
      total_neto: "",
    },
    validate: (data) => {
      const errors = {};
      if (!data.origen) errors.origen = "Requerido";
      if (!data.destino) errors.destino = "Requerido";
      return errors;
    },
    summary: (data) => ({ hotel: data.redondo, origen: data.origen, destino: data.destino, dateStart: data.checkIn, dateEnd: data.checkOut }),
  },
  {
    id: "tour",
    nombre: "Tour",
    icon: faMap,
    Form: TrasladoForm,
    defaultData: {
      provider: "",
      providerName: "",
      code: "",
      descripcion: "",
      checkIn: null,
      checkOut: null,
      pasajeros: {
        adultos: [
          { nombre: "", apellidos: "" },
          { nombre: "", apellidos: "" },
        ],
        menores: [],
      },
      limitePago: null,
      limiteCliente: null,
      fee: "",
      total_publico: "",
      total_neto: "",
    },
    validate: (data) => {
      const errors = {};
      if (!data.descripcion) errors.descripcion = "Requerido";
      return errors;
    },
  }
];