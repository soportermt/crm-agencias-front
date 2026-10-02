"use client";

import { cajaService } from "@/services/caja.service";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import DataTable from "@/components/common/DataTable";
import { cleanDecimalInput } from "@/utils/inputFormatters";
import { downloadPagoPDF } from "@/utils/downloadPagoPDF";
import Link from "next/link";
import { createPortal } from "react-dom";
import { enviarComprobantePagoPorCorreo } from "@/utils/invoiceEmailPayment";
import { ArrowDownTrayIcon, XCircleIcon } from "@heroicons/react/24/outline";
import StatusBadge from "@/components/common/StatusBadge";

registerLocale("es", es);

const columns = [
    { key: "id_pago", label: "ID Pago", align: "center", width: "80px" },
    { key: "descripcion", label: "Descripción", align: "left", width: "300px" },
    { key: "fecha", label: "Fecha", align: "left", width: "100px" },
    { key: "formaPago", label: "Forma de pago", align: "center", width: "100px" },
    { key: "monto", label: "Monto", align: "right", width: "100px" },
    { key: "estatus", label: "Estatus", align: "center", width: "100px" },
    { key: "acciones", label: "Acciones", align: "center", width: "50px" },
];

const ITEMS_PER_PAGE = 5;

function formatDate(date) {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("es-MX", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC"
    });
}

export default function Pago() {
    const [agencia, setAgencia] = useState(null);
    const [venta, setVenta] = useState(null);
    const [pagos, setPagos] = useState(null);
    const [detalles, setDetalles] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [pagoHabilitado, setPagoHabilitado] = useState(false);
    const [montoPago, setMontoPago] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);

    const [descripcionPago, setDescripcionPago] = useState("");
    const [fechaPago, setFechaPago] = useState(new Date());
    const [idFormaPago, setIdFormaPago] = useState(1);
    const [idCuenta, setIdCuenta] = useState("");

    const [downloadingId, setDownloadingId] = useState(null);
    const [pagoCreado, setPagoCreado] = useState(null);
    const [destinatario, setDestinatario] = useState("");
    const [sendingEmail, setSendingEmail] = useState(false);
    const [sendResult, setSendResult] = useState(null);

    const [pagoACancelar, setPagoACancelar] = useState(null);
    const [cancelando, setCancelando] = useState(false);
    const [cancelError, setCancelError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const dataSegura = detalles || [];
    const [downloadingRecibo, setDownloadingRecibo] = useState(false);

    const hayPagosActivos = (detalles || []).some((p) => String(p.estatus) === "1");

    const handleDownloadRecibo = async () => {
        setDownloadingRecibo(true);
        try {
            await downloadPagoPDF({ pagos: detalles, venta, agencia });
        } catch (err) {
            console.error("Error al generar el PDF:", err);
        } finally {
            setDownloadingRecibo(false);
        }
    };

    const totalPages = Math.ceil(dataSegura.length / ITEMS_PER_PAGE);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return dataSegura.slice(startIndex, endIndex);
    }, [currentPage, dataSegura]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const { id } = useParams();

    const cargarVenta = useCallback(async () => {
        if (!id) return;

        setIsLoading(true);
        setError(null);

        try {
            const data = await cajaService.getVenta(id);
            const dataPagos = await cajaService.getWaysToPay();
            const dataDetalles = await cajaService.getSalePayments(id);

            setVenta(data);
            setPagos(dataPagos);
            setDetalles(dataDetalles);

            return dataDetalles;
        } catch (err) {
            console.error("Error al cargar la venta:", err);
            setError("No se pudo cargar la venta");
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        try {
            const storedAgenciaData = localStorage.getItem("agenciaInfo");

            if (storedAgenciaData) {
                setAgencia(JSON.parse(storedAgenciaData));
            }
        } catch (err) {
            console.error("Error al parsear la agencia:", err);
        }
    }, []);

    useEffect(() => {
        cargarVenta();
    }, [cargarVenta]);

    const handleMontoChange = (servicioKey, rawValue) => {
        const cleanedValue = cleanDecimalInput(rawValue);

        if (cleanedValue !== "" && !/^\d*\.?\d{0,2}$/.test(cleanedValue)) {
            return;
        }

        setMontoPago((prev) => ({
            ...prev,
            [servicioKey]: cleanedValue,
        }));
    };

    const resetFormularioPago = () => {
        setMontoPago({});
        setDescripcionPago("");
        setFechaPago(new Date());
        setIdFormaPago(1);
        setIdCuenta("");
        setSaveError(null);
    };

    const handleCancelarPago = () => {
        setPagoHabilitado(false);
        resetFormularioPago();
    };

    const totalCapturado = Object.values(montoPago).reduce(
        (acc, v) => acc + (Number(v) || 0),
        0
    );

    const hayMontosCapturados = totalCapturado > 0;
    const faltanDatosGenerales = !idFormaPago || !fechaPago;
    const puedeGuardar =
        hayMontosCapturados && !faltanDatosGenerales && !isSaving;

    const obtenerTotalPagadoServicio = (idVentaServicio) => {
        if (!detalles) return 0;

        let totalPagado = 0;
        detalles.forEach((pago) => {
            if (String(pago.estatus) !== '1') return;

            pago.pagosDetalles?.forEach((detalle) => {
                if (String(detalle.id_ventaservicio) === String(idVentaServicio)) {
                    totalPagado += Number(detalle.monto || 0);
                }
            });
        });

        return totalPagado;
    };

    const handleGuardarPagos = async () => {
        if (!hayMontosCapturados || isSaving) return;

        if (faltanDatosGenerales) {
            setSaveError("Selecciona la forma de pago y la fecha de pago");
            return;
        }

        setIsSaving(true);
        setSaveError(null);

        try {
            const formData = new FormData();

            formData.append("id_pago", "0");
            formData.append("descripcion", descripcionPago);
            formData.append("fecha", format(fechaPago, "yyyy-MM-dd"));
            formData.append("id_forma_pago", idFormaPago);
            formData.append("id_cuenta", idCuenta || "");

            let detailIndex = 0;

            venta.ventasServicioses.forEach((servicio, index) => {
                const servicioKey = servicio.id_ventaservicio ?? index;
                const monto = Number(montoPago[servicioKey] || 0);

                if (monto > 0) {
                    formData.append(
                        `payment_details[${detailIndex}]`,
                        JSON.stringify({
                            id_ventaservicio: servicioKey,
                            monto,
                        })
                    );
                    detailIndex++;
                }
            });

            const res = await cajaService.savePayment(formData);
            const nuevoId = res?.id_pago ?? res?.data?.id_pago;

            setPagoHabilitado(false);
            resetFormularioPago();

            const detallesActualizados = await cargarVenta();
            const nuevoPago = detallesActualizados?.find(
                (p) => String(p.id_pago) === String(nuevoId)
            );

            if (nuevoPago) setPagoCreado(nuevoPago);
        } catch (err) {
            console.error("Error al guardar los pagos:", err);
            setSaveError("No se pudieron guardar los pagos");
        } finally {
            setIsSaving(false);
        }
    };

    const formatMoney = (value) => {
        const num = Number(value || 0);
        return num.toLocaleString("es-MX", {
            style: "currency",
            currency: "MXN",
        });
    };

    const labelStyle = {
        fontSize: 14,
        fontWeight: 500,
        color: "#5E5873",
    };

    const valueStyle = {
        fontSize: 14,
        color: "#1f1f1f",
    };

    const granTotal = venta?.ventasServicioses?.reduce((acc, serv) => acc + Number(serv.tarifa_publica || 0), 0) || 0;
    const granPagado = venta?.ventasServicioses?.reduce((acc, serv) => acc + obtenerTotalPagadoServicio(serv.id_ventaservicio), 0) || 0;
    const granSaldo = Math.max(0, Number((granTotal - granPagado).toFixed(2)));

    const ventaPagada = !isLoading && !error && granTotal > 0 && granSaldo <= 0;

    const handleDownloadPDF = async (row) => {
        setDownloadingId(row.id_pago);
        try {
            await downloadPagoPDF({ pagos: detalles, venta, agencia });
        } catch (err) {
            console.error("Error al generar el PDF:", err);
        } finally {
            setDownloadingId(null);
        }
    };

    const handleEnviarCorreo = async () => {
        if (!destinatario || !/\S+@\S+\.\S+/.test(destinatario)) {
            setSendResult({ success: false, error: "Ingresa un correo válido" });
            return;
        }

        setSendingEmail(true);
        setSendResult(null);
        try {
            const res = await enviarComprobantePagoPorCorreo(pagoCreado, agencia, destinatario);
            setSendResult(res);
        } catch (err) {
            console.error("Error al enviar el comprobante:", err);
            setSendResult({ success: false, error: "No se pudo enviar el correo" });
        } finally {
            setSendingEmail(false);
        }
    };

    const cerrarModalCancelar = () => {
        if (cancelando) return;
        setPagoACancelar(null);
        setCancelError(null);
    };

    const handleConfirmarCancelacion = async () => {
        if (!pagoACancelar || cancelando) return;

        setCancelando(true);
        setCancelError(null);

        try {
            const res = await cajaService.cancelPayment(pagoACancelar.id_pago);

            if (res?.error) {
                setCancelError(res.error);
                return;
            }

            setPagoACancelar(null);
            await cargarVenta();
        } catch (err) {
            console.error("Error al cancelar el pago:", err);
            setCancelError(
                err?.response?.data?.error || "No se pudo cancelar el pago"
            );
        } finally {
            setCancelando(false);
        }
    };

    const renderCell = (colKey, row) => {
        if (colKey === "formaPago") {
            return (
                <span>{row.idFormaPago?.descripcion}</span>
            );
        }
        if (colKey === "monto") {
            const detallesDelPago = row.pagosDetalles || [];
            const totalMontoPago = detallesDelPago.reduce(
                (acc, detalle) => acc + Number(detalle.monto || 0),
                0
            );

            return (
                <span style={{ fontWeight: 600 }}>
                    {formatMoney(totalMontoPago)}
                </span>
            );
        }

        if (colKey === "fecha") {
            return <span>{formatDate(row.fecha)}</span>;
        }

        if (colKey === "estatus") {
            return <StatusBadge status={row.estatus === '1' ? 'Activo' : 'Cancelado'} />;
        }

        if (colKey === "acciones") {
            const generando = downloadingId === row.id_pago;
            return (
                <div className="d-flex align-items-center justify-content-center gap-1">
                    <button
                        type="button"
                        className="btn btn-link p-1 text-danger"
                        title="Cancelar pago"
                        onClick={() => setPagoACancelar(row)}
                        disabled={row.estatus !== '1'}
                        style={{ cursor: row.estatus !== '1' ? "not-allowed" : "pointer" }}
                    >
                        <XCircleIcon style={{ width: "20px", height: "20px" }} />
                    </button>
                </div>
            );
        }
        return row[colKey];
    };

    const serviciosPendientes = venta?.ventasServicioses?.filter((servicio, index) => {
        const key = servicio.id_ventaservicio ?? index;
        const total = Number(servicio.tarifa_publica || 0);
        const pagado = obtenerTotalPagadoServicio(key);
        return (total - pagado) > 0;
    }) || [];

    const idUnicoServicioPendiente = serviciosPendientes.length === 1
        ? (serviciosPendientes[0].id_ventaservicio ?? venta.ventasServicioses.indexOf(serviciosPendientes[0]))
        : null;

    return (
        <>
            <div className="row g-0">
                <div className="col-12">
                    <h4 className="mx-3 mb-0">Detalles de pagos</h4>
                </div>

                <div className="col-12 col-xl-8 p-3">
                    <div
                        className="bg-white shadow-premium p-3"
                        style={{ borderRadius: "12px" }}
                    >
                        <div className="row mb-3">
                            <div className="col-6"
                                style={{
                                    fontSize: 14,
                                    color: "#6E6B7B",
                                }}>
                                Folio: <Link className="font-inter fw-bold" href={`/reservaciones/editar/${venta?.id_venta}`} style={{ fontSize: 18, color: "rgb(12, 92, 198)" }} target="_blank">{venta?.folio}</Link>
                            </div>
                            <div className="col-6 text-end"
                                style={{
                                    fontSize: 14,
                                    color: "#6E6B7B",
                                }}>
                                Fecha de creación: <strong style={{ fontSize: 18, color: "#0d6efd" }}>{formatDate(venta?.fecha)}</strong>
                            </div>
                        </div>
                        <div className="row mb-4">
                            <div className="col-12 col-md-6 pe-md-4">
                                <p className="mb-2" style={{ fontWeight: 600 }}>
                                    Información de la agencia
                                </p>

                                <ul
                                    className="d-flex flex-column gap-2"
                                    style={{
                                        fontSize: 14,
                                        listStyle: "none",
                                        margin: 0,
                                        padding: 0,
                                        color: "#6E6B7B",
                                    }}
                                >
                                    <li className="d-flex">
                                        <span
                                            style={{
                                                minWidth: 90,
                                                fontWeight: 500,
                                                color: "#5E5873",
                                            }}
                                        >
                                            Nombre:
                                        </span>

                                        {agencia?.nombre_comercial || "—"}
                                    </li>

                                    <li className="d-flex">
                                        <span
                                            style={{
                                                minWidth: 90,
                                                fontWeight: 500,
                                                color: "#5E5873",
                                            }}
                                        >
                                            Dirección:
                                        </span>

                                        {agencia?.direccion || "—"}
                                    </li>

                                    <li className="d-flex">
                                        <span
                                            style={{
                                                minWidth: 90,
                                                fontWeight: 500,
                                                color: "#5E5873",
                                            }}
                                        >
                                            Correo:
                                        </span>

                                        {agencia?.correo || "—"}
                                    </li>

                                    <li className="d-flex">
                                        <span
                                            style={{
                                                minWidth: 90,
                                                fontWeight: 500,
                                                color: "#5E5873",
                                            }}
                                        >
                                            Teléfono:
                                        </span>

                                        {agencia?.telefono || "—"}
                                    </li>
                                </ul>
                            </div>

                            <div className="col-12 col-md-6 ps-md-4 mt-4 mt-md-0">
                                <p className="mb-2" style={{ fontWeight: 600 }}>
                                    Información del cliente
                                </p>

                                <ul
                                    className="d-flex flex-column gap-2"
                                    style={{
                                        fontSize: 14,
                                        listStyle: "none",
                                        margin: 0,
                                        padding: 0,
                                        color: "#6E6B7B",
                                    }}
                                >
                                    <li className="d-flex">
                                        <span
                                            style={{
                                                minWidth: 90,
                                                fontWeight: 500,
                                                color: "#5E5873",
                                            }}
                                        >
                                            Nombre:
                                        </span>

                                        {venta?.idCliente?.nombre || "—"}
                                    </li>

                                    <li className="d-flex">
                                        <span
                                            style={{
                                                minWidth: 90,
                                                fontWeight: 500,
                                                color: "#5E5873",
                                            }}
                                        >
                                            Teléfono:
                                        </span>

                                        {venta?.idCliente?.telefono || "—"}
                                    </li>

                                    <li className="d-flex">
                                        <span
                                            style={{
                                                minWidth: 90,
                                                fontWeight: 500,
                                                color: "#5E5873",
                                            }}
                                        >
                                            Correo:
                                        </span>

                                        {venta?.idCliente?.correo || "—"}
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <p className="mb-1" style={{ fontWeight: 600 }}>
                            {pagoHabilitado ? "Agregar nuevo pago" : "Descripción de los servicios"}
                        </p>

                        {isLoading ? (
                            <div
                                className="text-center py-4"
                                style={{ color: "#6E6B7B", fontSize: 13 }}
                            >
                                Cargando servicios...
                            </div>
                        ) : error ? (
                            <div
                                className="text-center py-4"
                                style={{ color: "#EA5455" }}
                            >
                                {error}
                            </div>
                        ) : venta?.ventasServicioses?.length ? (
                            <>
                                {pagoHabilitado && (
                                    <div className="row mb-2">
                                        <div className="col-12 col-md-3">
                                            <label style={labelStyle}>Forma de pago</label>
                                            <select
                                                className="form-control mb-3"
                                                style={{ fontSize: 13 }}
                                                value={idFormaPago}
                                                onChange={(e) =>
                                                    setIdFormaPago(e.target.value)
                                                }
                                            >
                                                {pagos?.map((p) => (
                                                    <option key={p.id_tipo} value={p.id_tipo}>
                                                        {p.descripcion}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-12 col-md-3">
                                            <label style={labelStyle}>Fecha pago</label>
                                            <DatePicker
                                                isClearable
                                                selected={fechaPago}
                                                onChange={(date) =>
                                                    setFechaPago(date)
                                                }
                                                placeholderText="Fecha de pago"
                                                locale="es"
                                                dateFormat="dd/MM/yyyy"
                                                className="form-control form-control-sm"
                                                autoComplete="off"
                                            />
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <label style={labelStyle}>Observaciones</label>
                                            <textarea
                                                type="text"
                                                className="form-control"
                                                style={{ fontSize: 13 }}
                                                value={descripcionPago}
                                                onChange={(e) =>
                                                    setDescripcionPago(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="row pt-1 pb-0">
                                    <div className="col-12 col-md-4 mb-2">
                                        <div style={labelStyle}>Servicio</div>
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <div style={labelStyle}>Proveedor</div>
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <div style={labelStyle}>Descripción</div>
                                    </div>
                                </div>

                                {venta.ventasServicioses.map((servicio, index) => {
                                    const servicioKey = servicio.id_ventaservicio ?? index;
                                    // 1. Tarifa total del servicio original
                                    const totalServicio = Number(servicio.tarifa_publica || 0);

                                    // 2. Lo que ya se pagó
                                    const pagadoHistorico = obtenerTotalPagadoServicio(servicioKey);

                                    // 3. El saldo restante real que aún debe el cliente
                                    const saldoServicio = Number((totalServicio - pagadoHistorico).toFixed(2));

                                    // 4. Lo que estás capturando actualmente en el input
                                    const montoCapturado = Number((Number(montoPago[servicioKey]) || 0).toFixed(2));

                                    // 5. Validacion
                                    const excedeSaldo = montoCapturado > saldoServicio;

                                    const isActivo = pagoHabilitado && (montoCapturado > 0 || servicioKey === idUnicoServicioPendiente);

                                    return (
                                        <div
                                            key={servicioKey}
                                            className="mb-3 p-2" // Cambiamos el padding y agregamos margen inferior
                                            style={{
                                                borderRadius: "12px",
                                                // Si está activo: fondo blanco puro. Si no: transparente
                                                backgroundColor: isActivo ? "#FFFFFF" : "transparent",
                                                // Si está activo: borde de color primario (ej. morado/azul). Si no: solo línea inferior sutil
                                                border: isActivo ? "2px solid #0d6efd" : "1px solid transparent",
                                                borderBottom: isActivo ? "2px solid #0d6efd" : "1px solid #EBE9F1",
                                                // Si está activo: sombra flotante. Si no: sin sombra
                                                boxShadow: isActivo ? "0 8px 20px rgba(115, 103, 240, 0.15)" : "none",
                                                // Efecto lupa: Si está activo, crece un 2%
                                                transform: isActivo ? "scale(1.02)" : "scale(1)",
                                                // Animación suave de 0.3 segundos para que no brinque de golpe
                                                transition: "all 0.3s ease-in-out",
                                                // Opcional: Si está activo, lo ponemos por encima de los demás elementos
                                                zIndex: isActivo ? 10 : 1,
                                                position: "relative"
                                            }}
                                        >
                                            <div className="row align-items-center">
                                                <div className="col-12 col-md-4">
                                                    <div
                                                        style={{
                                                            ...valueStyle,
                                                            fontWeight: isActivo ? 700 : 400, // Se hace negrita si está activo
                                                            color: isActivo ? "#0d6efd" : "inherit", // Toma el color principal si está activo
                                                            transition: "all 0.3s ease"
                                                        }}
                                                    >
                                                        <i className="fas fa-tag me-2" style={{ opacity: isActivo ? 1 : 0.5 }}></i>
                                                        {servicio.idTipoServicio?.tipo_servicio || "—"}
                                                    </div>
                                                </div>

                                                <div className="col-12 col-md-4 mt-2 mt-md-0">
                                                    <div
                                                        style={{
                                                            ...valueStyle,
                                                            fontWeight: isActivo ? 600 : 400,
                                                            color: isActivo ? "#4B4B4B" : "inherit",
                                                            transition: "all 0.3s ease"
                                                        }}
                                                    >
                                                        <i className="fas fa-building me-2" style={{ opacity: isActivo ? 1 : 0.5 }}></i>
                                                        {servicio.idProveedor?.nombre_comercial || "—"}
                                                    </div>
                                                </div>

                                                <div className="col-12 col-md-4 mt-2 mt-md-0">
                                                    <div
                                                        style={{
                                                            ...valueStyle,
                                                            fontWeight: isActivo ? 600 : 400,
                                                            color: isActivo ? "#4B4B4B" : "inherit",
                                                            transition: "all 0.3s ease"
                                                        }}
                                                    >
                                                        {servicio.descripcion || "—"}
                                                    </div>
                                                </div>
                                            </div>

                                            {pagoHabilitado && (
                                                <div
                                                    className="mt-3 p-3"
                                                    style={{
                                                        backgroundColor: "#F8F9FA", // Fondo gris claro para separarlo de la info del servicio
                                                        borderRadius: "10px",
                                                        border: "1px solid #EBE9F1"
                                                    }}
                                                >
                                                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">

                                                        {/* Información de saldos (Izquierda) */}
                                                        <div>
                                                            <div style={{ fontSize: 13, color: "#6E6B7B", marginBottom: 4 }}>
                                                                Tarifa pública: <strong>{formatMoney(servicio.tarifa_publica)}</strong>
                                                            </div>
                                                            <div style={{ fontSize: 15, color: "#4B4B4B" }}>
                                                                Saldo pendiente:{" "}
                                                                <strong style={{ color: saldoServicio > 0 ? "#EA5455" : "#28C76F" }}>
                                                                    {formatMoney(saldoServicio)}
                                                                </strong>
                                                            </div>
                                                        </div>

                                                        {/* Visor TPV para el Input (Derecha) */}
                                                        <div className="d-flex flex-column align-items-end">
                                                            <div
                                                                className="d-flex align-items-center px-3 py-1"
                                                                style={{
                                                                    backgroundColor: "#FFFFFF",
                                                                    borderRadius: "8px",
                                                                    border: saldoServicio <= 0 ? "1px solid rgba(40, 199, 111, 0.29)"
                                                                        : excedeSaldo
                                                                            ? "1px solid #EA5455" // Borde rojo si se pasa
                                                                            : "1px solid #28C76F", // Borde verde tipo terminal
                                                                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                                                                    width: "220px"
                                                                }}
                                                            >
                                                                <span style={{ fontSize: 18, fontWeight: "bold", color: saldoServicio <= 0 ? "rgba(40, 199, 111, 0.29)" : "#28C76F", marginRight: 8 }}>$</span>
                                                                <input
                                                                    type="text"
                                                                    inputMode="decimal"
                                                                    className="form-control shadow-none p-0"
                                                                    style={{
                                                                        fontSize: 18,
                                                                        fontWeight: "bold",
                                                                        textAlign: "right",
                                                                        border: "none",
                                                                        backgroundColor: "transparent",
                                                                        color: excedeSaldo
                                                                            ? "#EA5455"
                                                                            : "#4B4B4B",
                                                                        width: "100%",
                                                                        cursor: saldoServicio <= 0 ? "not-allowed" : "text"
                                                                    }}
                                                                    placeholder={saldoServicio <= 0 ? "Liquidado" : "0.00"}
                                                                    value={montoPago[servicioKey] || ""}
                                                                    onChange={(e) => handleMontoChange(servicioKey, e.target.value)}
                                                                    disabled={saldoServicio <= 0}
                                                                />
                                                            </div>

                                                            {/* Mensajes de validación bajo el TPV */}
                                                            {excedeSaldo && (
                                                                <div className="mt-1" style={{ fontSize: 12, color: "#EA5455", fontWeight: 600 }}>
                                                                    El monto excede el saldo pendiente
                                                                </div>
                                                            )}

                                                            {saldoServicio <= 0 && (
                                                                <div className="mt-1" style={{ fontSize: 12, color: "#28C76F", fontWeight: 600 }}>
                                                                    <i className="fas fa-check-circle me-1"></i> Servicio liquidado
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                {pagoHabilitado && (
                                    <div className="row justify-content-end ">
                                        <div className="col-6 d-flex gap-2">
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger w-50"
                                                onClick={handleCancelarPago}
                                                disabled={isSaving}
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-primary w-50"
                                                onClick={handleGuardarPagos}
                                                disabled={!puedeGuardar}
                                            >
                                                {isSaving ? (
                                                    <>
                                                        <span
                                                            className="spinner-border spinner-border-sm me-2"
                                                            role="status"
                                                            aria-hidden="true"
                                                        />
                                                        Guardando...
                                                    </>
                                                ) : (
                                                    "Guardar pagos"
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div
                                className="text-center py-4"
                                style={{ color: "#6E6B7B" }}
                            >
                                No hay servicios registrados.
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-12 col-xl-4 p-3">
                    <div
                        className="bg-white shadow-premium p-3 position-sticky"
                        style={{
                            borderRadius: "12px",
                            top: "1rem",
                            maxHeight: "calc(100vh - 2rem)",
                            overflowY: "auto",
                        }}
                    >
                        <p className="mb-2" style={{ fontWeight: 600 }}>
                            Saldo de venta
                        </p>
                        <div className='d-flex justify-content-between' style={{ fontSize: 14, color: "rgba(64, 64, 64, 0.8)" }}>
                            <p className='mb-2'>Total público:</p>
                            <p className='mb-2' style={{ fontWeight: 700 }}>{formatMoney(granTotal)}</p>
                        </div>
                        <div className='d-flex justify-content-between' style={{ fontSize: 14, color: "rgba(64, 64, 64, 0.8)" }}>
                            <p className='mb-2'>Total en pagos:</p>
                            <p className='mb-2 text-success' style={{ fontWeight: 700 }}>{formatMoney(granPagado)}</p>
                        </div>
                        <hr className="my-1" />
                        <div className='d-flex justify-content-between mb-3' style={{ fontSize: 14, color: "rgba(64, 64, 64, 0.8)" }}>
                            <p className='mb-2'>Saldo a pagar:</p>
                            <p className='mb-2' style={{ fontWeight: 700 }}>{formatMoney(granSaldo)}</p>
                        </div>

                        {pagoHabilitado && (
                            <div
                                className="d-flex justify-content-between align-items-center mb-1 p-2"
                                style={{
                                    fontSize: 14,
                                    backgroundColor: "#F5F8FF",
                                    borderRadius: 8,
                                }}
                            >
                                <span style={{ color: "#5E5873" }}>
                                    Total a capturar:
                                </span>
                                <span
                                    style={{
                                        fontWeight: 700,
                                        color: hayMontosCapturados
                                            ? "#28C76F"
                                            : "#5E5873",
                                    }}
                                >
                                    {formatMoney(totalCapturado)}
                                </span>
                            </div>
                        )}

                        {saveError && (
                            <div
                                className="mb-2 text-center"
                                style={{ fontSize: 13, color: "#EA5455" }}
                            >
                                {saveError}
                            </div>
                        )}

                        {pagoHabilitado ? (
                            <></>
                        ) : ventaPagada ? (
                            <div
                                className="text-center p-2"
                                style={{
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: "#28C76F",
                                    backgroundColor: "#E8F9F0",
                                    borderRadius: 8,
                                }}
                            >
                                Venta pagada completamente
                            </div>
                        ) : (
                            <button
                                type="button"
                                className="btn btn-primary w-100"
                                onClick={() => setPagoHabilitado(true)}
                            >
                                Agregar nuevo pago
                            </button>
                        )}
                    </div>
                </div>

                <div className="col-12 p-3">
                    <div className="bg-white shadow-premium p-3" style={{ borderRadius: "12px" }}>
                        <div className="d-flex justify-content-between aling-items-end mb-3">
                            <p className="mb-0" style={{ fontWeight: 600, fontSize: 18 }}>Desglose de pagos</p>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleDownloadRecibo}
                                disabled={downloadingRecibo}
                            >
                                {downloadingRecibo ? "Generando..." : "Descargar recibo"}
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="text-center py-4" style={{ color: "#6E6B7B", fontSize: 13 }}>
                                Cargando historial de pagos...
                            </div>
                        ) : (
                            <DataTable
                                columns={columns}
                                data={paginatedData}
                                renderCell={renderCell}
                                pagination={true}
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                emptyMessage="No se encontraron pagos registrados."
                                minWidth="100%"
                            />
                        )}
                    </div>
                </div>

                {pagoCreado &&
                    createPortal(
                        <>
                            <div
                                className="modal-backdrop fade show"
                                style={{ zIndex: 2000 }}
                            />
                            <div
                                className="modal fade show d-block"
                                tabIndex={-1}
                                role="dialog"
                                aria-modal="true"
                                style={{ zIndex: 2001 }}
                            >
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content" style={{ borderRadius: 12 }}>
                                        <div className="modal-body text-center p-4">
                                            <div
                                                className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: 56,
                                                    height: 56,
                                                    borderRadius: "50%",
                                                    backgroundColor: "#E8F9F0",
                                                    color: "#28C76F",
                                                    fontSize: 28,
                                                }}
                                            >
                                                ✓
                                            </div>

                                            <h5 className="mb-1">Pago registrado</h5>
                                            <p className="mb-3" style={{ fontSize: 14, color: "#6E6B7B" }}>
                                                El pago se guardó correctamente.
                                            </p>

                                            <div className="d-flex gap-2 flex-column">
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={() => handleDownloadPDF(pagoCreado)}
                                                    disabled={downloadingId === pagoCreado.id_pago}
                                                >
                                                    {downloadingId === pagoCreado.id_pago
                                                        ? "Generando..."
                                                        : "Descargar PDF"}
                                                </button>
                                            </div>

                                            <hr className="my-3" />

                                            <div className="text-start">
                                                <label style={{ fontSize: 13, fontWeight: 500, color: "#5E5873" }}>
                                                    Enviar comprobante a:
                                                </label>
                                                <div className="d-flex gap-2 mt-1">
                                                    <input
                                                        type="email"
                                                        className="form-control form-control-sm"
                                                        placeholder="correo@ejemplo.com"
                                                        value={destinatario}
                                                        onChange={(e) => {
                                                            setDestinatario(e.target.value);
                                                            setSendResult(null);
                                                        }}
                                                        disabled={sendingEmail}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-primary text-nowrap"
                                                        onClick={handleEnviarCorreo}
                                                        disabled={sendingEmail}
                                                    >
                                                        {sendingEmail ? "Enviando..." : "Enviar"}
                                                    </button>
                                                </div>

                                                {sendResult && (
                                                    <div
                                                        className="mt-1"
                                                        style={{
                                                            fontSize: 12,
                                                            color: sendResult.success ? "#28C76F" : "#EA5455",
                                                        }}
                                                    >
                                                        {sendResult.success
                                                            ? "Comprobante enviado correctamente."
                                                            : sendResult.error || "Ocurrió un error al enviar."}
                                                    </div>
                                                )}
                                            </div>

                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary w-100 mt-3"
                                                onClick={() => {
                                                    setPagoCreado(null);
                                                    setDestinatario("");
                                                    setSendResult(null);
                                                }}
                                            >
                                                Cerrar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>,
                        document.body
                    )}


                {pagoACancelar &&
                    createPortal(
                        <>
                            <div
                                className="modal-backdrop fade show"
                                style={{ zIndex: 2000 }}
                            />
                            <div
                                className="modal fade show d-block"
                                tabIndex={-1}
                                role="dialog"
                                aria-modal="true"
                                style={{ zIndex: 2001 }}
                            >
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content" style={{ borderRadius: 12 }}>
                                        <div className="modal-body text-center p-4">
                                            <div
                                                className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: 56,
                                                    height: 56,
                                                    borderRadius: "50%",
                                                    backgroundColor: "#FDECEC",
                                                    color: "#EA5455",
                                                    fontSize: 28,
                                                }}
                                            >
                                                !
                                            </div>

                                            <h5 className="mb-1">¿Cancelar este pago?</h5>
                                            <p className="mb-1" style={{ fontSize: 14, color: "#6E6B7B" }}>
                                                Pago #{pagoACancelar.id_pago} por{" "}
                                                <strong>
                                                    {formatMoney(
                                                        (pagoACancelar.pagosDetalles || []).reduce(
                                                            (acc, d) => acc + Number(d.monto || 0),
                                                            0
                                                        )
                                                    )}
                                                </strong>
                                            </p>
                                            <p className="mb-3" style={{ fontSize: 13, color: "#6E6B7B" }}>
                                                El monto dejará de contar en el saldo de la venta. Esta acción no se puede deshacer.
                                            </p>

                                            {cancelError && (
                                                <div className="mb-3" style={{ fontSize: 13, color: "#EA5455" }}>
                                                    {cancelError}
                                                </div>
                                            )}

                                            <div className="d-flex gap-2">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary w-50"
                                                    onClick={cerrarModalCancelar}
                                                    disabled={cancelando}
                                                >
                                                    Volver
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-danger w-50"
                                                    onClick={handleConfirmarCancelacion}
                                                    disabled={cancelando}
                                                >
                                                    {cancelando ? (
                                                        <>
                                                            <span
                                                                className="spinner-border spinner-border-sm me-2"
                                                                role="status"
                                                                aria-hidden="true"
                                                            />
                                                            Cancelando...
                                                        </>
                                                    ) : (
                                                        "Sí, cancelar pago"
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>,
                        document.body
                    )}
            </div>
        </>
    );
}