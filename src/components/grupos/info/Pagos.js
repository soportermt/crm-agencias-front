'use client'

import React, { useEffect, useMemo, useState } from 'react';
import DataTable from "@/components/common/DataTable";
import StatusBadge from '@/components/common/StatusBadge';
import { cajaService } from '@/services/caja.service';
import Link from 'next/link';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';

const ITEMS_PER_PAGE = 5;

const columns = [
  { key: "id_pago", label: "ID Pago", align: "center", width: "80px" },
  { key: "descripcion", label: "Descripción", align: "left", width: "300px" },
  { key: "fecha", label: "Fecha", align: "left", width: "100px" },
  { key: "formaPago", label: "Forma de pago", align: "center", width: "100px" },
  { key: "monto", label: "Monto", align: "right", width: "100px" },
  { key: "estatus", label: "Estatus", align: "center", width: "100px" },
];

function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

const formatMoney = (value) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(Number(value || 0));

export default function Pagos({ pagos = [], id_venta }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [formasPago, setFormasPago] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const formasPagoMap = useMemo(() => {
    const map = {};
    formasPago.forEach((f) => {
      map[String(f.id_tipo)] = f.descripcion;
    });
    return map;
  }, [formasPago]);

  async function loadData() {
    setIsLoading(true);
    try {
      const res = await cajaService.getWaysToPay();
      setFormasPago(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error('Error al cargar las formas de pago:', err);
      setError('No se pudieron cargar las formas de pago');
    } finally {
      setIsLoading(false);
    }
  }

  const totalPages = Math.max(1, Math.ceil(pagos.length / ITEMS_PER_PAGE));

  const pageData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return pagos.slice(start, start + ITEMS_PER_PAGE);
  }, [pagos, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const renderCell = (colKey, row) => {
    const pago = row.idPago || {};

    switch (colKey) {
      case "id_pago":
        return pago.id_pago ?? row.id_pago;

      case "descripcion":
        return pago.descripcion;

      case "fecha":
        return <span>{formatDate(pago.fecha)}</span>;

      case "formaPago":
        return <span>{formasPagoMap[String(pago.id_forma_pago)] || "-"}</span>;

      case "monto":
        return <span style={{ fontWeight: 600 }}>{formatMoney(row.monto)}</span>;

      case "estatus":
        return <StatusBadge status={pago.estatus === "1" ? "Activo" : "Cancelado"} />;

      default:
        return row[colKey];
    }
  };

  useEffect(() => {
    loadData();
  }, [])

  return (
    <div>
      <div className='d-flex align-items-center justify-content-between mb-3'>
        <h5 className='mb-0'>Pagos</h5>
        <Link href={`/caja/pagos/${id_venta}`} style={{textDecoration: "none", color: "rgb(12, 92, 198)", fontWeight: 600}}>Ir a detalles de pago <ArrowUpRightIcon width={16}/></Link>
      </div>

      <DataTable
        columns={columns}
        data={pageData}
        renderCell={renderCell}
        pagination={true}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        emptyMessage="No se encontraron pagos registrados."
        minWidth="100%"
      />
    </div>
  );
}