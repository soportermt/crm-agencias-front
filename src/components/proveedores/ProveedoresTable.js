"use client";

import React, { useState } from "react";
import DataTable from "@/components/common/DataTable";
import StatusBadge from "@/components/common/StatusBadge";
import Link from "next/link";

const ITEMS_PER_PAGE = 10;

export default function ProveedoresTable({ proveedores, onEditClick }) {
    const [currentPage, setCurrentPage] = useState(1);

    const columns = [
        { key: "nombre_comercial", label: "Nombre comercial", sortable: true, width: "180px" },
        { key: "correo", label: "Correo electrónico", sortable: true, width: "180px" },
        { key: "direccion", label: "Dirección", sortable: true, width: "110px" },
        { key: "comision", label: "Comisión", sortable: true, width: "60px", align: "end" },
        { key: "estatus", label: "Estatus", sortable: true, align: "center", width: "110px" },
    ];

    const renderCell = (colKey, row) => {
        if (colKey === "nombre_comercial") {
            return (
                <button 
                    onClick={() => onEditClick(row)}
                    className="btn btn-link p-0 text-decoration-none text-start text-primary fw-medium"
                    style={{ whiteSpace: "normal", textAlign: "left", fontSize: 14 }}
                >
                    {row[colKey]}
                </button>
            );
        }

        if (colKey === "estatus") {
            return (
                <div className="d-flex justify-content-center">
                    <StatusBadge status={row.estatus === "A" ? "Activo" : "Inactivo"} />
                </div>
            );
        }
        if (colKey === "comision") {
            return (
                <span>
                    {row.comision} %
                </span>
            );
        }
        return row[colKey];
    };

    const totalPages = Math.max(1, Math.ceil(proveedores.length / ITEMS_PER_PAGE));

    const paginatedproveedores = proveedores.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <DataTable
            columns={columns}
            data={paginatedproveedores}
            renderCell={renderCell}
            pagination={true}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            emptyMessage="No se encontraron proveedores."
        />
    );
}
