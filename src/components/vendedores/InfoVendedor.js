import React, { useState, useEffect, useRef } from 'react';
import { vendedoresService } from "@/services/vendedores.service";
import { catalogosService } from '@/services/catalogos.service';

function formatearFecha(fechaString) {
    if (!fechaString || typeof fechaString !== "string") return "-";
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

export default function InfoVendedor({ data, documentos = [], onUpdated }) {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(data || {});
    const [descargandoId, setDescargandoId] = useState(null);

    const [agencias, setAgencias] = useState([]);
    const [loading2, setLoading2] = useState(true);
    const [error, setError] = useState(null);

    const [nuevoTipo, setNuevoTipo] = useState("");
    const [subiendo, setSubiendo] = useState(false);
    const nuevoFileRef = useRef(null);
    const [listaDocumentos, setListaDocumentos] = useState(documentos);
    const [eliminandoId, setEliminandoId] = useState(null);

    const [notas, setNotas] = useState(data?.notas || "");
    const [isEditingNotas, setIsEditingNotas] = useState(false);
    const [savingNotas, setSavingNotas] = useState(false);

    useEffect(() => {
        setFormData(data || {});
        setListaDocumentos(documentos);
        setNotas(data?.notas || "");
    }, [data, documentos]);


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

    const handleSaveNotas = async () => {
        try {
            setSavingNotas(true);
            const fd = new FormData();
            fd.append("id_vendedor", data?.id_vendedor || formData?.id_vendedor);
            fd.append("notas", notas);

            const result = await vendedoresService.update(fd);

            if (result && result.success !== false) {
                setIsEditingNotas(false);
                onUpdated?.({ ...formData, notas });
            } else {
                alert(result?.message || "Error al guardar las notas");
            }
        } catch (err) {
            console.error("Error al actualizar notas:", err);
            alert("Ocurrió un error al actualizar las notas.");
        } finally {
            setSavingNotas(false);
        }
    };

    const handleDescargar = async (idDocumento, nombreArchivo) => {
        try {
            setDescargandoId(idDocumento);
            const blob = await vendedoresService.descargarDocumento(idDocumento);
            const blobUrl = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = blobUrl;
            link.setAttribute('download', nombreArchivo || `documento_${idDocumento}`);
            document.body.appendChild(link);
            link.click();

            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (err) {
            console.error("Error al descargar documento:", err);
            alert("No se pudo descargar el documento.");
        } finally {
            setDescargandoId(null);
        }
    };

    const handleNuevoArchivo = async (e) => {
        const file = e.target.files[0];
        if (!file || !nuevoTipo) return;

        try {
            setSubiendo(true);
            const result = await vendedoresService.agregarDocumento(
                data.id_vendedor,
                nuevoTipo,
                file
            );

            if (!result.success) throw new Error(result.message || "Error al subir");

            setListaDocumentos((prev) => [...prev, result.documento]);
            setNuevoTipo("");
        } catch (err) {
            console.error(err);
            alert(err.message);
        } finally {
            setSubiendo(false);
            e.target.value = "";
        }
    };

    const handleEliminar = async (idDocumento) => {
        // if (!window.confirm("¿Eliminar este documento?")) return;

        try {
            setEliminandoId(idDocumento);
            const result = await vendedoresService.eliminarDocumento(idDocumento);

            if (!result.success) throw new Error(result.message || "Error al eliminar");

            setListaDocumentos((prev) => prev.filter((doc) => doc.id_documento !== idDocumento));
        } catch (err) {
            console.error(err);
            alert(err.message);
        } finally {
            setEliminandoId(null);
        }
    };

    return (
        <div className='row'>
            <div className="col-12 col-xl-9 my-2">
                <div
                    className="bg-white shadow-premium p-1"
                    style={{
                        borderRadius: "8px",
                        top: "1rem",
                        maxHeight: "calc(100vh - 2rem)",
                        overflowY: "auto",
                    }}
                >
                    <div className='p-3'>
                        <div className='d-flex justify-content-between align-items-start'>
                            <div>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="nombre"
                                        className="form-control form-control-sm m-0 fw-bold"
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
                            <p style={{ fontWeight: 600 }}>Información general</p>
                            <div className='row g-3'>
                                <div className='col-6 mt-1'>
                                    <label className='form-label text-muted small m-0' style={{ fontSize: 13 }}>Correo electrónico</label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="correo"
                                            className="form-control form-control-sm"
                                            value={formData.correo || ""}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <p className='m-0 fw-medium small' style={{ fontSize: 13 }}>{formData.correo || "-"}</p>
                                    )}
                                </div>
                                <div className='col-6 mt-1'>
                                    <label className='form-label text-muted small m-0' style={{ fontSize: 13 }}>Dirección</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="direccion"
                                            className="form-control form-control-sm"
                                            value={formData.direccion || ""}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <p className='m-0 fw-medium small' style={{ fontSize: 13 }}>{formData.direccion || "-"}</p>
                                    )}
                                </div>
                                <div className='col-6 mt-1'>
                                    <label className='form-label text-muted small m-0' style={{ fontSize: 13 }}>Teléfono</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="telefono"
                                            className="form-control form-control-sm"
                                            value={formData.telefono || ""}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <p className='m-0 fw-medium small' style={{ fontSize: 13 }}>{formData.telefono || "-"}</p>
                                    )}
                                </div>
                                <div className='col-6 mt-1'>
                                    <label className='form-label text-muted small m-0' style={{ fontSize: 13 }}>Sucursal</label>
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
                                        <p className='m-0 fw-medium small' style={{ fontSize: 13 }}>{formData.sucursal || "-"}</p>
                                    )}
                                </div>
                                <div className='col-6 mt-1'>
                                    <label className='form-label text-muted small m-0' style={{ fontSize: 13 }}>Departamento</label>
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
                                        <p className='m-0 fw-medium small' style={{ fontSize: 13 }}>{formData.rol || "-"}</p>
                                    )}
                                </div>
                                <div className='col-6 mt-1'>
                                    <label className='form-label text-muted small m-0' style={{ fontSize: 13 }}>Estatus</label>
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
                                        <p className='m-0 fw-medium small' style={{ fontSize: 13 }}>
                                            {formData.estatus === "1" || formData.estatus === 1 ? "Activo" : "Inactivo"}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <p className='my-2' style={{ fontWeight: 600 }}>Documentos</p>

                            <div className='d-flex gap-2 mb-2'>
                                <select
                                    className="form-select form-select-sm"
                                    value={nuevoTipo}
                                    onChange={(e) => setNuevoTipo(e.target.value)}
                                    style={{ maxWidth: 220 }}
                                >
                                    <option value="">Seleccionar tipo</option>
                                    <option value="comprobante_domicilio">Comprobante de Domicilio</option>
                                    <option value="identificacion_oficial">Identificación Oficial</option>
                                </select>

                                <input
                                    type="file"
                                    ref={nuevoFileRef}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={handleNuevoArchivo}
                                    hidden
                                />
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-primary"
                                    disabled={!nuevoTipo || subiendo}
                                    onClick={() => nuevoFileRef.current.click()}
                                >
                                    {subiendo ? "Subiendo..." : "+ Agregar documento"}
                                </button>
                            </div>


                            {listaDocumentos.length === 0 ? (
                                <div className='p-3 text-center' style={{ fontSize: 13, color: "#404040" }}>Sin documentos aún</div>
                            ) : (
                                <div className='d-flex flex-column gap-2'>
                                    {listaDocumentos.map((doc) => (
                                        <div
                                            key={doc.id_documento}
                                            className='d-flex justify-content-between align-items-center p-2 rounded'
                                            style={{ backgroundColor: "#F5F5F5" }}
                                        >
                                            <div className='d-flex align-items-center gap-2'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={20} height={20} color="#0C5CC6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                                </svg>
                                                <div>
                                                    <span className='d-block text-capitalize' style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>
                                                        {doc.tipo ? doc.tipo.replaceAll('_', ' ') : 'Documento'}
                                                    </span>
                                                    <small className='text-muted' style={{ fontSize: 11 }}>
                                                        Subido el: {formatearFecha(doc.fecha_subida)}
                                                    </small>
                                                </div>
                                            </div>

                                            <div className='d-flex gap-3'>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDescargar(doc.id_documento, doc.nombre_archivo)}
                                                    disabled={descargandoId === doc.id_documento}
                                                    className='btn btn-sm btn-outline-primary d-flex align-items-center gap-1'
                                                    style={{ fontSize: 12 }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={14} height={14}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                                    </svg>
                                                    {descargandoId === doc.id_documento ? "Descargando..." : "Descargar"}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleEliminar(doc.id_documento)}
                                                    disabled={eliminandoId === doc.id_documento}
                                                    className='btn btn-sm btn-outline-danger d-flex align-items-center gap-1'
                                                    style={{ fontSize: 12 }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={14} height={14}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                    </svg>
                                                    {eliminandoId === doc.id_documento ? "..." : "Eliminar"}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 col-xl-3 my-2">
                <div
                    className="bg-white shadow-premium p-1"
                    style={{
                        borderRadius: "8px",
                        top: "1rem",
                        maxHeight: "calc(100vh - 2rem)",
                        overflowY: "auto",
                    }}
                >
                    <div className='p-3'>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                            <p className='mb-0 fw-semibold'>Notas</p>
                            {isEditingNotas && (
                                <button
                                    type="button"
                                    className="btn btn-sm btn-link text-decoration-none text-muted p-0"
                                    style={{ fontSize: 12 }}
                                    onClick={() => {
                                        setNotas(data?.notas || "");
                                        setIsEditingNotas(false);
                                    }}
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                        <textarea
                            name="notas"
                            value={notas}
                            readOnly={!isEditingNotas}
                            onClick={() => setIsEditingNotas(true)}
                            onChange={(e) => setNotas(e.target.value)}
                            placeholder="Haz clic para agregar o editar notas..."
                            className="ven-notas"
                            style={{
                                cursor: !isEditingNotas ? 'pointer' : 'text',
                                borderColor: !isEditingNotas ? 'trasparent' : '#D0D5DD',
                            }}
                        />
                        <button
                            type="button"
                            className='btn btn-primary-custom w-100 mt-2 vet-btn-notas'
                            disabled={!isEditingNotas || savingNotas}
                            onClick={handleSaveNotas}
                        >
                            {savingNotas ? "Guardando..." : "Confirmar cambios"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}