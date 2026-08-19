import React, { useState, useEffect } from 'react';
import { vendedoresService } from "@/services/vendedores.service";
import { catalogosService } from '@/services/catalogos.service';

function formatearFecha(fechaString) {
    if (!fechaString) return "-";
    const fecha = new Date(fechaString.replace(" ", "T"));
    if (isNaN(fecha.getTime())) return fechaString;

    return new Intl.DateTimeFormat('es-MX', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    }).format(fecha);
}

export default function InfoVendedor({ data, onUpdated }) {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(data || {});

    const [agencias, setAgencias] = useState([]);
    const [loading2, setLoading2] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setFormData(data || {});
    }, [data]);


    useEffect(() => {
        async function loadAgencias() {
            try {
                setLoading2(true);
                const data = await catalogosService.agencias();
                setAgencias(Array.isArray(data) ? data : data?.data || []);
            } catch (err) {
                console.error("Error al cargar agencias:", err);
                setError("No se pudo cargar la información de las agencias.");
            } finally {
                setLoading2(false);
            }
        }

        loadAgencias();

    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCancel = () => {
        setFormData(data);
        setIsEditing(false);
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const fd = new FormData();

            fd.append("id_vendedor", formData.id_vendedor || data.id_vendedor);
            fd.append("nombre", formData.nombre || "");
            fd.append("correo", formData.correo || "");
            fd.append("direccion", formData.direccion || "");
            fd.append("telefono", formData.telefono || "");
            fd.append("sucursal", formData.sucursal || "");
            fd.append("rol", formData.rol || "");
            fd.append("estatus", formData.estatus || "");

            const result = await vendedoresService.update(fd);

            if (result && result.success !== false) {
                setIsEditing(false);
                onUpdated?.(formData);
            } else {
                alert(result?.message || "Error al actualizar los datos");
            }
        } catch (error) {
            console.error("Error al actualizar vendedor:", error);
            alert("Ocurrió un error al guardar los cambios.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='p-3'>
            <div className='d-flex justify-content-between align-items-start'>
                <div>
                    {isEditing ? (
                        <input
                            type="text"
                            name="nombre"
                            className="form-control form-control-sm mb-1 fw-bold"
                            value={formData.nombre || ""}
                            onChange={handleChange}
                            placeholder="Nombre del vendedor"
                        />
                    ) : (
                        <h6 className='m-0'>{formData.nombre}</h6>
                    )}
                    <p className='m-0' style={{ fontSize: 13, color: "rgba(64, 64, 64, 0.5)" }}>
                        {formData.correo}
                    </p>
                </div>
                <div className='text-end' style={{ fontSize: 12, color: "rgba(64, 64, 64, 0.5)" }}>
                    <p className='m-0'><span style={{ fontWeight: 700 }}>Registrado por:</span> {formData.fullname}</p>
                    <p className='m-0'><span style={{ fontWeight: 700 }}>Dado de alta:</span> {formatearFecha(formData.fecha_alta)}</p>
                </div>
            </div>
            <div className='d-flex gap-2 mt-2'>
                <div className='ven-cat'>Departamento: {formData.rol}</div>
                <div className='ven-cat'>Sucursal: {formData.sucursal}</div>
            </div>
            <div className='mt-1'>
                <div className='d-flex justify-content-end'>
                    {!isEditing ? (
                        <button
                            type="button"
                            className='btn p-0 d-flex align-items-center'
                            style={{ fontSize: 13, color: "#0C5CC6" }}
                            onClick={() => setIsEditing(true)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={14} height={14}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                            <span className='ms-1'>Editar datos de vendedor</span>
                        </button>
                    ) : (
                        <div className='d-flex gap-2'>
                            <button
                                type="button"
                                className='btn btn-sm btn-outline-secondary'
                                onClick={handleCancel}
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className='btn btn-sm btn-primary'
                                onClick={handleSave}
                                disabled={loading}
                            >
                                {loading ? "Guardando..." : "Guardar"}
                            </button>
                        </div>
                    )}
                </div>
                <div className='row g-3'>
                    <div className='col-6 mt-1'>
                        <label className='form-label text-muted small mb-1'>Correo electrónico</label>
                        {isEditing ? (
                            <input
                                type="email"
                                name="correo"
                                className="form-control form-control-sm"
                                value={formData.correo || ""}
                                onChange={handleChange}
                            />
                        ) : (
                            <p className='m-0 fw-medium small'>{formData.correo || "-"}</p>
                        )}
                    </div>
                    <div className='col-6 mt-1'>
                        <label className='form-label text-muted small mb-1'>Dirección</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="direccion"
                                className="form-control form-control-sm"
                                value={formData.direccion || ""}
                                onChange={handleChange}
                            />
                        ) : (
                            <p className='m-0 fw-medium small'>{formData.direccion || "-"}</p>
                        )}
                    </div>
                    <div className='col-6 mt-1'>
                        <label className='form-label text-muted small mb-1'>Teléfono</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="telefono"
                                className="form-control form-control-sm"
                                value={formData.telefono || ""}
                                onChange={handleChange}
                            />
                        ) : (
                            <p className='m-0 fw-medium small'>{formData.telefono || "-"}</p>
                        )}
                    </div>
                    <div className='col-6 mt-1'>
                        <label className='form-label text-muted small mb-1'>Sucursal</label>
                        {isEditing ? (
                            <select
                                name="sucursal"
                                className="form-select"
                                required
                                value={formData.sucursal || ""}
                                onChange={handleChange}
                            >
                                <option value="" disabled>
                                    {loading ? "Cargando agencias..." : "Selecciona una sucursal"}
                                </option>
                                {agencias.map((agencia) => (
                                    <option
                                        key={agencia.id || agencia.id_agencia || agencia.nombre_comercial}
                                        value={agencia.nombre_comercial}
                                    >
                                        {agencia.nombre_comercial}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <p className='m-0 fw-medium small'>{formData.sucursal || "-"}</p>
                        )}
                    </div>
                    <div className='col-6 mt-1'>
                        <label className='form-label text-muted small mb-1'>Departamento</label>
                        {isEditing ? (
                            <select
                                name="rol"
                                className="form-select form-select-sm"
                                value={formData.rol || "1"}
                                onChange={handleChange}
                            >
                                <option value="Administrativo">Administrativo</option>
                                <option value="Agente">Agente</option>
                                <option value="Ventas">Ventas</option>
                            </select>
                        ) : (
                            <p className='m-0 fw-medium small'>{formData.rol || "-"}</p>
                        )}
                    </div>
                    <div className='col-6 mt-1'>
                        <label className='form-label text-muted small mb-1'>Estatus</label>
                        {isEditing ? (
                            <select
                                name="estatus"
                                className="form-select form-select-sm"
                                value={formData.estatus || "1"}
                                onChange={handleChange}
                            >
                                <option value="1">Activo</option>
                                <option value="0">Inactivo</option>
                            </select>
                        ) : (
                            <p className='m-0 fw-medium small'>
                                {formData.estatus === "1" || formData.estatus === 1 ? "Activo" : "Inactivo"}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}