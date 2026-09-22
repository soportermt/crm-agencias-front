"use client";

import { cajaService } from "@/services/caja.service";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("es", es);

export default function Pago() {
    const [agencia, setAgencia] = useState(null);
    const [venta, setVenta] = useState(null);
    const [pagos, setPagos] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [pagoHabilitado, setPagoHabilitado] = useState(false);
    const [montoPago, setMontoPago] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);

    const [descripcionPago, setDescripcionPago] = useState("");
    const [fechaPago, setFechaPago] = useState(Date());
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

            setVenta(data);
            setPagos(dataPagos);
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

    const handleMontoChange = (servicioKey, value) => {
        // Solo permite números y un punto decimal
        if (value !== "" && !/^\d*\.?\d{0,2}$/.test(value)) return;

        setMontoPago((prev) => ({
            ...prev,
            [servicioKey]: value,
        }));
    };

    const resetFormularioPago = () => {
        setMontoPago({});
        setDescripcionPago("");
        setFechaPago(null);
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
                                const servicioKey =
                                    servicio.id_ventaservicio ?? index;
                                const saldoServicio = Number(
                                    servicio.tarifa_publica || 0
                                );
                                const montoCapturado = Number(
                                    montoPago[servicioKey] || 0
                                );
                                const excedeSaldo =
                                    montoCapturado > saldoServicio;

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
                                                <div className="d-flex align-items-center justify-content-end gap-4 mt-0">
                                                    <span
                                                        style={{
                                                            fontSize: 14,
                                                            color: "#6E6B7B",
                                                        }}
                                                    >
                                                        Saldo a pagar:{" "}
                                                        <strong
                                                            style={{
                                                                color: "#1f1f1f",
                                                                fontSize: 16
                                                            }}
                                                        >
                                                            {formatMoney(
                                                                servicio.tarifa_publica
                                                            )}
                                                        </strong>
                                                    </span>

                                                    <input
                                                        type="text"
                                                        inputMode="decimal"
                                                        className="form-control"
                                                        style={{
                                                            maxWidth: 180,
                                                            fontSize: 14
                                                        }}
                                                        placeholder="Monto a pagar"
                                                        value={
                                                            montoPago[
                                                            servicioKey
                                                            ] || ""
                                                        }
                                                        onChange={(e) =>
                                                            handleMontoChange(
                                                                servicioKey,
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>

                                                {excedeSaldo && (
                                                    <div
                                                        className="text-end mt-1"
                                                        style={{
                                                            fontSize: 12,
                                                            color: "#EA5455",
                                                        }}
                                                    >
                                                        El monto excede el
                                                        saldo a pagar de este
                                                        servicio
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
                        <p className='mb-2'>Total:</p>
                        <p className='mb-2' style={{ fontWeight: 700 }}>$121,852.00 MXN</p>
                    </div>
                    <div className='d-flex justify-content-between' style={{ fontSize: 14, color: "rgba(64, 64, 64, 0.8)" }}>
                        <p className='mb-2'>Pagos:</p>
                        <p className='mb-2 text-success' style={{ fontWeight: 700 }}>$121,852.00 MXN</p>
                    </div>
                    <hr className="my-1" />
                    <div className='d-flex justify-content-between mb-3' style={{ fontSize: 14, color: "rgba(64, 64, 64, 0.8)" }}>
                        <p className='mb-2'>Saldo a pagar:</p>
                        <p className='mb-2' style={{ fontWeight: 700 }}>$76,499.00 MXN</p>
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
                <div
                    className="bg-white shadow-premium p-3"
                    style={{ borderRadius: "12px" }}
                >
                    <p className="mb-2" style={{ fontWeight: 600 }}>
                        Detalle de pagos
                    </p>
                </div>
            </div>
        </div>
    );
}