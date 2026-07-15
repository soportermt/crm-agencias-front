import HospedajeForm from "@/components/booking/forms/HospedajeForm";
import { faHotel, faPersonSwimming, faVanShuttle } from "@fortawesome/free-solid-svg-icons";

export const serviceCatalog = [
  {
    id: "hospedaje",
    nombre: "Hospedaje",
    icon: faHotel,
    Form: HospedajeForm,
    summary: (data) => ({
      hotel: data.hotel || "Sin hotel",
      destino: data.destino,
      dateStart: data.checkIn,
      dateEnd: data.checkOut,
      precio: data.precio,
    }),
  },
  {
    id: "transporte",
    nombre: "Traslado",
    icon: faVanShuttle,
    Form: HospedajeForm,
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
    Form: HospedajeForm,
    summary: (data) => [
      { label: "Hotel", value: data.hotelLabel || data.hotel },
      { label: "Check-in", value: data.checkIn },
      { label: "Check-out", value: data.checkOut },
      { label: "Pasajeros", value: data.pasajeros?.length ?? 0 },
    ],
  },
];