"use client";

import { cajaService } from "@/services/caja.service";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import DataTable from "@/components/common/DataTable";
import { cleanDecimalInput } from "@/utils/inputFormatters";

registerLocale("es", es);

const columns = [
    { key: "id_pago", label: "ID Pago", align: "center", width: "80px" },
    { key: "descripcion", label: "Descripción", align: "left", width: "300px" },
    { key: "fecha", label: "Fecha", align: "left", width: "100px" },
    { key: "formaPago", label: "Forma de pago", align: "center", width: "100px" },
    { key: "monto", label: "Monto", align: "right", width: "100px" },
    { key: "acciones", label: "", align: "center", width: "80px" },
];

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
        setFechaPago(Date());
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

            await cajaService.savePayment(formData);

            setPagoHabilitado(false);
            resetFormularioPago();

            cargarVenta();
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

        if (colKey === "acciones") {
            return <button
                className="d-flex align-items-center gap-2 px-2 py-0 transition-smooth btn-pdf">Descargar</button>;
        }
        return row[colKey];
    };

    return (
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
                            Folio: <strong style={{ fontSize: 18, color: "rgb(12, 92, 198)" }}>{venta?.folio}</strong>
                        </div>
                        <div className="col-6 text-end"
                            style={{
                                fontSize: 14,
                                color: "#6E6B7B",
                            }}>
                            Fecha de creación: <strong style={{ fontSize: 18, color: "rgb(12, 92, 198)" }}>{formatDate(venta?.fecha)}</strong>
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
                            style={{ color: "#6E6B7B" }}
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
                                <div className="col-12 col-md-4">
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

                                return (
                                    <div
                                        key={servicioKey}
                                        className="py-2 px-2 border-bottom"
                                        style={{
                                            borderRadius: 8,
                                            backgroundColor:
                                                pagoHabilitado &&
                                                    montoCapturado > 0
                                                    ? "#F5F8FF"
                                                    : "transparent",
                                            transition:
                                                "background-color .15s ease",
                                        }}
                                    >
                                        <div className="row">
                                            <div className="col-12 col-md-4">
                                                <div style={valueStyle}>
                                                    {servicio.idTipoServicio
                                                        .tipo_servicio || "—"}
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 mt-2 mt-md-0">
                                                <div style={valueStyle}>
                                                    {servicio.idProveedor
                                                        .nombre_comercial ||
                                                        "—"}
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 mt-2 mt-md-0">
                                                <div style={valueStyle}>
                                                    {servicio.descripcion ||
                                                        "—"}
                                                </div>
                                            </div>
                                        </div>

                                        {pagoHabilitado && (
                                            <div className="mt-2 pt-2">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <span
                                                        style={{
                                                            fontSize: 14,
                                                            color: "#6E6B7B",
                                                        }}
                                                    >
                                                        Tarifa publica:{" "}
                                                        <strong
                                                            style={{
                                                                color: "#6E6B7B"
                                                            }}
                                                        >
                                                            {formatMoney(servicio.tarifa_publica)}
                                                        </strong>
                                                    </span>
                                                    <div className="d-flex align-items-center justify-content-end gap-4 mt-0">
                                                        <span
                                                            style={{
                                                                fontSize: 14,
                                                                color: "#6E6B7B",
                                                            }}
                                                        >
                                                            Saldo a pagar:{" "}
                                                            <strong
                                                                className="text-success"
                                                                style={{
                                                                    fontSize: 16
                                                                }}
                                                            >
                                                                {formatMoney(saldoServicio)}
                                                            </strong>
                                                        </span>
                                                        <input
                                                            type="text"
                                                            inputMode="decimal"
                                                            className="form-control"
                                                            style={{ maxWidth: 180, fontSize: 14 }}
                                                            placeholder="Monto a pagar"
                                                            value={montoPago[servicioKey] || ""}
                                                            onChange={(e) => handleMontoChange(servicioKey, e.target.value)}
                                                            disabled={saldoServicio <= 0}
                                                        />
                                                    </div>
                                                </div>

                                                {excedeSaldo && (
                                                    <div
                                                        className="text-end mt-1"
                                                        style={{ fontSize: 12, color: "#EA5455" }}
                                                    >
                                                        El monto excede el saldo a pagar de este servicio
                                                    </div>
                                                )}

                                                {saldoServicio <= 0 && (
                                                    <div className="text-end mt-1" style={{ fontSize: 12, color: "#28C76F" }}>
                                                        Servicio liquidado
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
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
                            className="d-flex justify-content-between align-items-center mb-3 p-2"
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
                        <div className="d-flex gap-2">
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
                    <p className="mb-2" style={{ fontWeight: 600 }}>Detalle de pagos</p>
                    {isLoading ? (
                        <div className="text-center py-4" style={{ color: "#6E6B7B" }}>
                            Cargando historial de pagos...
                        </div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={detalles || []}
                            renderCell={renderCell}
                            pagination={false}
                            emptyMessage="No se encontraron pagos registrados."
                            minWidth="100%"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}