"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import StatCard from "@/components/common/StatCard";
import AlertBanner from "@/components/common/AlertBanner";
import EgresosTable from "@/components/egresos/EgresosTable";
import { egresosService } from "@/services/egresos.service";
import { catalogosService } from "@/services/catalogos.service";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { subDays } from "date-fns";

const toYMD = (d) =>
  d
    ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
    : null;

function getInitialMonthRange() {
  return {
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
  };
}
const VALID_TABS = ["pendientes", "proveedores"];

function EgresosContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab = VALID_TABS.includes(tabParam) ? tabParam : "pendientes";

  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState(getInitialMonthRange);

  const [resumen, setResumen] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [loadingVentas, setLoadingVentas] = useState(false);
  const [servicioFilter, setServicioFilter] = useState("");

  const [porOperadorData, setPorOperadorData] = useState([]);
  const [estadoCuentasData, setEstadoCuentasData] = useState([]);

  const ITEMS_PER_PAGE = 10;

  const handleTabChange = useCallback(
    (tab) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tab);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );


  useEffect(() => {
    async function loadChartData() {
      try {
        const dataResumen = await egresosService.getResumenVentas();
        const servicios = await catalogosService.servicios();
        setResumen(dataResumen);
        setServicios(servicios || []);
      } catch (err) {
        console.error("Error al cargar datos del dashboard:", err);
      }
    }

    loadChartData();
  }, []);

  const fetchVentas = useCallback(async () => {
    if (dateRange.startDate && !dateRange.endDate) return;

    try {
      setLoadingVentas(true);
      const strStart = toYMD(dateRange.startDate);
      const strEnd = toYMD(dateRange.endDate);

      const dataVentas = await egresosService.getVentas(strStart, strEnd, servicioFilter);
      setVentas(dataVentas || []);
    } catch (err) {
      console.error("Error al cargar ventas con filtro:", err);
    } finally {
      setLoadingVentas(false);
    }
  }, [dateRange, servicioFilter]);

  useEffect(() => {
    fetchVentas();
  }, [fetchVentas]);

  const filteredData = ventas.filter((row) => {
    const term = searchValue.toLowerCase();
    return (
      row.proveedor?.toLowerCase().includes(term) ||
      row.folio?.toLowerCase().includes(term) ||
      row.descripcion?.toLowerCase().includes(term) ||
      row.tipo_servicio?.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE) || 1;
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (activeTab !== "proveedores") return;

    async function loadResumenOperadores() {
      try {
        const { porOperador, estadoCuentas } = await egresosService.getResumenOperadores();
        setPorOperadorData(porOperador || []);
        setEstadoCuentasData(estadoCuentas || []);
      } catch (err) {
        console.error("Error al cargar resumen de operadores:", err);
      }
    }
    loadResumenOperadores();
  }, [activeTab]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchValue, servicioFilter]);

  const formatCurrency = (value) => {
    if (value == null || isNaN(value)) return "$0.00";
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value);
  };

  return (
    <div className="container-fluid p-0">
      <div
        className="bg-white shadow-premium"
        style={{ borderRadius: "8px", padding: "24px" }}
      >
        <div className="d-flex flex-column" style={{ gap: "16px" }}>
          <h1
            className="font-inter fw-medium mb-0"
            style={{ fontSize: "24px", color: "#0f1901", lineHeight: "1.2" }}
          >
            Control de egresos
          </h1>

          <div className="row g-4">
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title={
                  <>
                    Total egresos en <span className="fw-semibold">{resumen?.mes}</span>
                  </>
                }
                value={formatCurrency(resumen?.total_egresos)}
                dashboard
                valueColor="#227cf2"
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Pendientes de pago"
                value={formatCurrency(resumen?.total_pendientes_pago)}
                dashboard
                valueColor="#b9861f"
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Vencidos"
                value={formatCurrency(resumen?.total_vencidos)}
                subtext={
                  <>
                    {resumen?.vencidos} ventas vencidos
                  </>
                }
                valueColor="#af233a"
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Pagados este mes"
                value={formatCurrency(resumen?.total_pagados_mes)}
                subtext={
                  <>
                    {resumen?.pagados_mes} ventas este mes
                  </>
                }
                valueColor="#0e803c"
              />
            </div>
          </div>

          <EgresosTable
            activeTab={activeTab}
            onTabChange={handleTabChange}
            data={paginatedData}
            exportData={filteredData}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredData.length}
            onPageChange={setCurrentPage}
            onExport={() => console.log("Exportar egresos")}
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onDateRangeChange={setDateRange}
            porOperadorData={porOperadorData}
            estadoCuentasData={estadoCuentasData}
            servicios={servicios}
            servicioFilter={servicioFilter}
            onServicioFilterChange={setServicioFilter}
          />
        </div>
      </div>
    </div>
  );
}

export default function IngresosPage() {
  return (
    <Suspense fallback={null}>
      <EgresosContent />
    </Suspense>
  );
}