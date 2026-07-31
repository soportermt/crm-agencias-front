"use client";

import { useEffect, useState } from "react";
import DataTable from "../common/DataTable";
import StatusBadge from "../common/StatusBadge";
import { bookingService } from "@/services/booking.service";

const COLUMNS = [
  { key: "folio", label: "Folio", width: "140px", align: "start" },
  { key: "cliente", label: "Cliente", width: "225px", align: "start" },
  { key: "hotel", label: "Hotel", width: "155px", align: "start" },
  { key: "plan", label: "Tipo de plan", width: "130px", align: "start" },
  { key: "estancia", label: "Fecha de estancia", width: "225px", align: "start" },
  { key: "destino", label: "Destino", width: "130px", align: "start" },
  { key: "total", label: "Total", width: "130px", align: "start" },
  { key: "estatus", label: "Estatus", width: "130px", align: "center" },
];

const ITEMS_PER_PAGE = 10;

export default function BookingGrouped() {
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    bookingService.grupos()
      .then((res) => {
        if (isMounted) setGrupos(res || []);
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setError("No se pudieron cargar las reservas agrupadas.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const renderCell = (key, row) => {
    switch (key) {
      case "folio":
        return (
          <span className="font-inter fw-semibold text-brand-blue">
            {row.folio}
          </span>
        );

      case "estatus":
        return <StatusBadge status={row.estatus === "venta" ? "Activo" : row.estatus} />;

      default:
        return row[key];
    }
  };

  if (loading) {
    return <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
      <p className="text-muted mt-2 font-poppins small">Cargando...</p>
    </div>;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  if (grupos.length === 0) {
    return <p>No hay reservas agrupadas por el momento.</p>;
  }

  return (
    <div className="container-fluid p-0">
      <p>
        Reservas agrupadas por fecha de salida y destino. Útil para coordinar
        grupos que viajan juntos.
      </p>

      <div className="d-flex flex-column gap-3">
        {grupos.map((group, index) => (
          <div key={index} className="bg-white p-3 shadow-group" style={{ borderRadius: "12px" }}>
            <section
              className="d-flex align-items-center justify-content-between"
              data-bs-toggle="collapse"
              data-bs-target={`#group-${index}`}
              style={{ cursor: "pointer" }}
            >
              <div className="d-flex align-items-center gap-3">
                <div className="icons-grouped"><i className="bi bi-airplane"></i></div>
                <div>
                  <p className="m-0">{group.destino} · {formatDate(group.fecha_inicio)}</p>
                  <span style={{ fontSize: "14px", color: "var(--black-rgba-40)" }}>
                    {group.hotel} · {group.total_pasajeros} pasajeros
                  </span>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <span className="text-status">{group.total_reservas} reservas</span>
                <i className="bi bi-chevron-down"></i>
              </div>
            </section>
            <div className="collapse mt-3" id={`group-${index}`}>
              <table className="table mb-3">
                <thead>
                  <tr>
                    <th className="collapse-info-table-th">Hotel</th>
                    <th className="collapse-info-table-th">Noches</th>
                    <th className="collapse-info-table-th">Operador</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="collapse-info-table">{group.hotel}</td>
                    <td className="collapse-info-table">{group.total_noches}</td>
                    <td className="collapse-info-table">{group.operadora}</td>
                  </tr>
                </tbody>
              </table>

              <DataTable
                columns={COLUMNS}
                data={group.reservaciones}
                renderCell={renderCell}
                pagination
                currentPage={1}
                totalPages={Math.ceil(group.reservaciones.length / ITEMS_PER_PAGE)}
                totalItems={group.reservaciones.length}
                onPageChange={() => { }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}