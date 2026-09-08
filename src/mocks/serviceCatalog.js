import HospedajeForm from "@/components/booking/forms/HospedajeForm";
import OtrosForm from "@/components/booking/forms/OtrosForm";
import TourForm from "@/components/booking/forms/TourForm";
import TrasladoForm from "@/components/booking/forms/TrasladoForm";
import VueloForm from "@/components/booking/forms/VueloForm";
import { faCirclePlus, faHotel, faMap, faPlaneDeparture, faVanShuttle } from "@fortawesome/free-solid-svg-icons";

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
    summary: (data) => {
      const totalHabitaciones = (data.habitaciones || []).reduce(
        (acc, hab) => acc + (parseFloat(hab.total_publico) || 0),
        0
      );

      return {
        title: data.hotel || "Sin hotel",
        subtitle: data.destino || "Sin destino",
        dateStart: data.checkIn,
        dateEnd: data.checkOut,
        precio: totalHabitaciones > 0 ? totalHabitaciones : null,
      };
    },
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
    summary: (data) => ({
      title: (data.origen && data.destino) ? `${data.origen} a ${data.destino}` : "Ruta sin definir",
      subtitle: data.redondo ? "Traslado Redondo" : "Traslado Sencillo",
      dateStart: data.checkIn,
      dateEnd: data.checkOut,
      precio: data.total_publico
    }),
  },
  {
    id: "tour",
    nombre: "Tour",
    icon: faMap,
    Form: TourForm,
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
    summary: (data) => ({
      title: data.descripcion || "Tour sin nombre",
      subtitle: "Actividad / Excursión",
      dateStart: data.checkIn,
      dateEnd: data.checkOut,
      precio: data.total_publico
    }),
  },
  {
    id: "vuelos",
    nombre: "Vuelos",
    icon: faPlaneDeparture,
    Form: VueloForm,
    defaultData: {
      provider: "",
      providerName: "",
      code: "",
      descripcion: "",
      checkIn: null,
      checkOut: null,
      pasajeros: {
        adultos: [
          { nombre: "", apellidos: "", fecha_nacimiento: null, no_pasaporte: "", no_visa: "" },
          { nombre: "", apellidos: "", fecha_nacimiento: null, no_pasaporte: "", no_visa: "" },
        ],
        menores: [],
      },
      limitePago: null,
      limiteCliente: null,
      fee: "",
      total_publico: "",
      total_neto: "",
      internacional: false,
      origen: "",
      destino: "",
      equipaje: [],
      aerolinea: "",
      redondo: false,
      salida_origen: "",
      llegada_destino: "",
      salida_destino: "",
      llegada_origen: "",
      escala: 0,
      escalas_origen: [],
      escalas_destino: [],
    },
    validate: (data) => {
      const errors = {};
      if (!data.origen) errors.origen = "Requerido";
      if (!data.destino) errors.destino = "Requerido";
      return errors;
    },

    summary: (data) => ({
      title: data.descripcion || "Vuelo sin nombre",
      subtitle: "Vuelo",
      dateStart: data.checkIn,
      dateEnd: data.checkOut,
      precio: data.total_publico
    }),
  },
  {
    id: "otros",
    nombre: "Otros",
    icon: faCirclePlus,
    Form: OtrosForm,
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
    summary: (data) => ({
      title: data.descripcion || "Otros",
      subtitle: "Actividad sin especificar",
      dateStart: data.checkIn,
      dateEnd: data.checkOut,
      precio: data.total_publico
    }),
  },
];