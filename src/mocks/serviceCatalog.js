import HospedajeForm from "@/components/booking/forms/HospedajeForm";
import TourForm from "@/components/booking/forms/TourForm";
import TrasladoForm from "@/components/booking/forms/TrasladoForm";
import { faHotel, faPersonSwimming, faVanShuttle } from "@fortawesome/free-solid-svg-icons";

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
      hotel: "",
      destino: "",
      checkIn: null,
      checkOut: null,
      habitaciones: [],
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
    id: "transporte",
    nombre: "Traslado",
    icon: faVanShuttle,
    Form: TrasladoForm,
    summary: (data) => [
      { label: "Hotel", value: data.hotelLabel || data.hotel },
      { label: "Check-in", value: data.checkIn },
      { label: "Check-out", value: data.checkOut },
      { label: "Pasajeros", value: data.pasajeros?.length ?? 0 },
    ],
  },
  {
    id: "tour",
    nombre: "Tour",
    icon: faPersonSwimming,
    Form: TourForm,
    summary: (data) => [
      { label: "Hotel", value: data.hotelLabel || data.hotel },
      { label: "Check-in", value: data.checkIn },
      { label: "Check-out", value: data.checkOut },
      { label: "Pasajeros", value: data.pasajeros?.length ?? 0 },
    ],
  },
];