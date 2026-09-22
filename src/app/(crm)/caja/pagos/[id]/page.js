"use client";

import { cajaService } from "@/services/caja.service";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Pago() {
    const [agencia, setAgencia] = useState(null);
    const [venta, setVenta] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { id } = useParams();

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
        if (!id) return;

        let cancelado = false;

        async function cargarVenta() {
            setIsLoading(true);
            setError(null);

            try {
                const data = await cajaService.getVenta(id);

                if (!cancelado) {
                    setVenta(data);
                }
            } catch (err) {
                console.error("Error al cargar la venta:", err);

                if (!cancelado) {
                    setError("No se pudo cargar la venta");
                }
            } finally {
                if (!cancelado) {
                    setIsLoading(false);
                }
            }
        }

        cargarVenta();

        return () => {
            cancelado = true;
        };
    }, [id]);

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

                    <p className="mb-0" style={{ fontWeight: 600 }}>
                        Descripción de los servicios
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
                        venta.ventasServicioses.map((servicio, index) => (
                            <div
                                key={servicio.id || index}
                                className="row py-2 border-bottom"
                            >
                                <div className="col-12 col-md-4">
                                    <div
                                        style={{
                                            fontSize: 13,
                                            fontWeight: 500,
                                            color: "#5E5873",
                                        }}
                                    >
                                        Servicio
                                    </div>

                                    <div
                                        style={{
                                            fontSize: 14,
                                            color: "#6E6B7B",
                                        }}
                                    >
                                        {servicio.idTipoServicio.tipo_servicio || "—"}
                                    </div>
                                </div>

                                <div className="col-12 col-md-4 mt-3 mt-md-0">
                                    <div
                                        style={{
                                            fontSize: 13,
                                            fontWeight: 500,
                                            color: "#5E5873",
                                        }}
                                    >
                                        Proveedor
                                    </div>

                                    <div
                                        style={{
                                            fontSize: 14,
                                            color: "#6E6B7B",
                                        }}
                                    >
                                        {servicio.idProveedor.nombre_comercial || "—"}
                                    </div>
                                </div>

                                <div className="col-12 col-md-4 mt-3 mt-md-0">
                                    <div
                                        style={{
                                            fontSize: 13,
                                            fontWeight: 500,
                                            color: "#5E5873",
                                        }}
                                    >
                                        Descripción
                                    </div>

                                    <div
                                        style={{
                                            fontSize: 14,
                                            color: "#6E6B7B",
                                        }}
                                    >
                                        {servicio.descripcion || "—"}
                                    </div>
                                </div>
                            </div>
                        ))
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
                    <div className='d-flex justify-content-between' style={{ fontSize: 14, color: "rgba(64, 64, 64, 0.8)"}}>
                        <p className='mb-2'>Total:</p>
                        <p className='mb-2' style={{fontWeight: 700}}>$121,852.00 MXN</p>
                    </div>
                    <div className='d-flex justify-content-between' style={{ fontSize: 14, color: "rgba(64, 64, 64, 0.8)"}}>
                        <p className='mb-2'>Pagos:</p>
                        <p className='mb-2 text-success' style={{fontWeight: 700}}>$121,852.00 MXN</p>
                    </div>
                    <hr className="my-1"/>
                    <div className='d-flex justify-content-between mb-3' style={{ fontSize: 14, color: "rgba(64, 64, 64, 0.8)"}}>
                        <p className='mb-2'>Saldo a pagar:</p>
                        <p className='mb-2' style={{fontWeight: 700}}>$76,499.00 MXN</p>
                    </div>

                    <button className="btn btn-primary w-100">Agregar nuevo pago</button>
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
