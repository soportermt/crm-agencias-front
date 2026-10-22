import GrupoForm from "@/components/booking/forms/GrupoForm";
import HospedajeForm from "@/components/booking/forms/HospedajeForm";
import OtrosForm from "@/components/booking/forms/OtrosForm";
import TourForm from "@/components/booking/forms/TourForm";
import TrasladoForm from "@/components/booking/forms/TrasladoForm";
import VueloForm from "@/components/booking/forms/VueloForm";
import { faCirclePlus, faHotel, faMap, faPeopleGroup, faPlaneDeparture, faVanShuttle } from "@fortawesome/free-solid-svg-icons";

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
      if (!data.provider) errors.provider = "Selecciona un proveedor";
      if (!data.code?.trim()) errors.code = "Requerido";
      if (!data.hotel) errors.hotel = "Selecciona un hotel";
      if (!data.destino?.trim()) errors.destino = "Requerido";
      if (!data.checkIn) errors.checkIn = "Requerido";
      if (!data.checkOut) errors.checkOut = "Requerido";
      if (!data.limitePago) errors.limitePago = "Requerido";
      if (!data.habitaciones?.length) errors.habitaciones = "Agrega al menos una habitación";
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
      redondo: false,
    },
    validate: (data) => {
      const errors = {};
      if (!data.provider) errors.provider = "Selecciona un proveedor";
      if (!data.code?.trim()) errors.code = "Requerido";
      if (!data.origen?.trim()) errors.origen = "Requerido";
      if (!data.destino?.trim()) errors.destino = "Requerido";
      if (!data.checkIn) errors.checkIn = "Requerido";
      if (data.redondo && !data.checkOut) errors.checkOut = "Requerido para traslado redondo";
      if (!data.limitePago) errors.limitePago = "Requerido";
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
    id: "grupo",
    nombre: "Grupo",
    icon: faPeopleGroup,
    Form: GrupoForm,
    defaultData: {
      provider: "",
      providerName: "",
      code: "",
      descripcion: "",
      checkIn: null,
      checkOut: null,
      fecha_evento: null,
      evento: "",
      tipo_hab: "",
      no_hab: "",
      
      limitePago: null,
      limiteCliente: null,
      fee: "",
      total_publico: "",
      total_neto: "",
    },
    validate: (data) => {
      const errors = {};
      if (!data.provider) errors.provider = "Selecciona un proveedor";
      if (!data.code?.trim()) errors.code = "Requerido";
      if (!data.descripcion?.trim()) errors.descripcion = "Requerido";
      if (!data.checkIn) errors.checkIn = "Requerido";
      if (!data.checkOut) errors.checkOut = "Requerido";
      if (!data.limitePago) errors.limitePago = "Requerido";
      return errors;
    },
    summary: (data) => ({
      title: data.evento || "Grupo sin evento",
      subtitle: "Grupo",
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
      if (!data.provider) errors.provider = "Selecciona un proveedor";
      if (!data.code?.trim()) errors.code = "Requerido";
      if (!data.descripcion?.trim()) errors.descripcion = "Requerido";
      if (!data.checkIn) errors.checkIn = "Requerido";
      if (!data.checkOut) errors.checkOut = "Requerido";
      if (!data.limitePago) errors.limitePago = "Requerido";
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
      if (!data.provider) errors.provider = "Selecciona un proveedor";
      if (!data.code?.trim()) errors.code = "Requerido";
      if (!data.origen?.trim()) errors.origen = "Requerido";
      if (!data.destino?.trim()) errors.destino = "Requerido";
      if (!data.checkIn) errors.checkIn = "Requerido";
      if (data.redondo && !data.checkOut) errors.checkOut = "Requerido para vuelo redondo";
      if (!data.limitePago) errors.limitePago = "Requerido";
      return errors;
    },

    summary: (data) => ({
      title: data.descripcion || "Vuelo sin nombre",
      subtitle: `${data.origen} - ${data.destino}`,
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
      if (!data.provider) errors.provider = "Selecciona un proveedor";
      if (!data.code?.trim()) errors.code = "Requerido";
      if (!data.descripcion?.trim()) errors.descripcion = "Requerido";
      if (!data.checkIn) errors.checkIn = "Requerido";
      if (!data.checkOut) errors.checkOut = "Requerido";
      if (!data.limitePago) errors.limitePago = "Requerido";
      return errors;
    },
    summary: (data) => ({
      title: data.descripcion || "Otros",
      subtitle: "Otros",
      dateStart: data.checkIn,
      dateEnd: data.checkOut,
      precio: data.total_publico
    }),
  },
];