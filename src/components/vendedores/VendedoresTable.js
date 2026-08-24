"use client";

import React, { useState } from "react";
import DataTable from "@/components/common/DataTable";
import StatusBadge from "@/components/common/StatusBadge";
import Link from "next/link";

const ITEMS_PER_PAGE = 10;

export default function VendedoresTable({ vendedores }) {
  const [currentPage, setCurrentPage] = useState(1);

  const columns = [
    // { key: "id", label: "ID", sortable: true, align: "center", width: "80px" },
    { key: "nombre", label: "Nombre Completo", sortable: true, width: "180px" },
    { key: "correo", label: "Correo electrónico", sortable: true, width: "180px" },
    { key: "telefono", label: "Télefono", sortable: true, width: "110px" },
    { key: "sucursal", label: "Sucursal", sortable: true, width: "110px" },
    { key: "estatus", label: "Estatus", sortable: true, align: "center", width: "110px" },
    // { key: "acciones", label: "Acciones", align: "center", width: "80px" },
  ];

  const renderCell = (colKey, row) => {
    if (colKey === "estatus") {
      return (
        <div className="d-flex justify-content-center">
          <StatusBadge status={row.estatus === "1" ? "Activo" : "Eliminado"} />
        </div>
      );
    }
    if (colKey === "nombre") {
      return (
        <Link href={`/vendedores/${row.id}`} passHref target="_blank">
          <button className="btn ven-table-nombre">
            {row.nombre}
          </button>
        </Link>
      );
    }
    return row[colKey];
  };

  const totalPages = Math.max(1, Math.ceil(vendedores.length / ITEMS_PER_PAGE));

  const paginatedVendedores = vendedores.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <DataTable
      columns={columns}
      data={paginatedVendedores}
      renderCell={renderCell}
      pagination={true}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      emptyMessage="No se encontraron vendedores."
    />
  );
}
