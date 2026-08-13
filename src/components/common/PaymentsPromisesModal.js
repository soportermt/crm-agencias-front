import React, { useState, useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom';
import { formatMoney } from "@/utils/pricing";
import DatePicker from 'react-datepicker';
import { parseISO, addDays, addMonths, format, isAfter, isEqual, differenceInCalendarDays } from 'date-fns';
import { bookingService } from '@/services/booking.service';

const DIAS_POR_PLAZO = {
    Semanal: 7,
    Quincenal: 15,
};

const PLAZOS_ORDEN = ['Semanal', 'Quincenal', 'Mensual'];

function calcularFechasPromesas(fechaInicio, fechaLimite, tipoPlazo) {
    if (!fechaInicio || !fechaLimite) return [];

    const fechas = [];
    let cursor = new Date(fechaInicio);
    const limite = new Date(fechaLimite);

    limite.setHours(0, 0, 0, 0);

    while (!isAfter(cursor, limite)) {
        const c = new Date(cursor);
        c.setHours(0, 0, 0, 0);
        fechas.push(c);

        if (isEqual(c, limite)) break;

        cursor = tipoPlazo === 'Mensual'
            ? addMonths(cursor, 1)
            : addDays(cursor, DIAS_POR_PLAZO[tipoPlazo]);
    }

    return fechas;
}

function calcularPlazosDisponibles(fechaInicio, fechaLimite) {
    if (!fechaInicio || !fechaLimite) {
        return { Semanal: false, Quincenal: false, Mensual: false };
    }

    const cabe = (tipoPlazo) => calcularFechasPromesas(fechaInicio, fechaLimite, tipoPlazo).length >= 2;

    const disponibles = {
        Semanal: cabe('Semanal'),
        Quincenal: cabe('Quincenal'),
        Mensual: cabe('Mensual'),
    };

    const algunoDisponible = Object.values(disponibles).some(Boolean);
    if (!algunoDisponible) {
        disponibles.Semanal = true;
    }

    return disponibles;
}

function repartirMonto(total, cantidad) {
    if (cantidad <= 0) return [];
    const base = Math.floor((total / cantidad) * 100) / 100;
    const montos = new Array(cantidad).fill(base);
    const acumulado = base * (cantidad - 1);
    montos[cantidad - 1] = Math.round((total - acumulado) * 100) / 100;
    return montos;
}

function buildPaymentsPayload(promesas) {
    const params = new URLSearchParams();
    promesas.forEach((p, i) => {
        params.append(`payments[${i}][fecha]`, p.fecha);
        params.append(`payments[${i}][monto]`, p.monto);
        params.append(`payments[${i}][id_venta]`, p.id_venta);
    });
    return params;
}

export default function PaymentsPromisesModal({ promesas = [], venta, total, loading, onClose, onGenerate, onDelete }) {

    const servicioLimiteCliente = venta.ventasServicioses[0]?.limite_cliente;
    const idVenta = venta.id_venta ?? venta.id ?? '';

    const [tipoPlazo, setTipoPlazo] = useState('Semanal');
    const [monto, setMonto] = useState(total);
    const [fechaInicio, setFechaInicio] = useState(
        venta.fecha ? parseISO(venta.fecha.split('T')[0]) : null
    );
    const [promesasGeneradas, setPromesasGeneradas] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);

    const promesasIniciales = Array.isArray(promesas) ? promesas : [];
    const promesasAMostrar = Array.isArray(promesasGeneradas) ? promesasGeneradas : promesasIniciales;

    const plazosDisponibles = useMemo(
        () => calcularPlazosDisponibles(fechaInicio, servicioLimiteCliente),
        [fechaInicio, servicioLimiteCliente]
    );

    const diasDisponibles = useMemo(() => {
        if (!fechaInicio || !servicioLimiteCliente) return null;
        return differenceInCalendarDays(new Date(servicioLimiteCliente), new Date(fechaInicio));
    }, [fechaInicio, servicioLimiteCliente]);

    useEffect(() => {
        if (!plazosDisponibles[tipoPlazo]) {
            const primerDisponible = PLAZOS_ORDEN.find((p) => plazosDisponibles[p]);
            if (primerDisponible) setTipoPlazo(primerDisponible);
        }
    }, [plazosDisponibles]);

    const puedeGenerar = useMemo(() => {
        return !!fechaInicio
            && !!servicioLimiteCliente
            && venta.ventasServicioses.length === 1
            && plazosDisponibles[tipoPlazo]
            && !saving
            && !deleting;
    }, [fechaInicio, servicioLimiteCliente, venta.ventasServicioses, plazosDisponibles, tipoPlazo, saving, deleting]);

    const handleGenerar = async () => {
        if (!puedeGenerar) return;
        setError(null);

        const fechas = calcularFechasPromesas(fechaInicio, servicioLimiteCliente, tipoPlazo);
        if (fechas.length === 0) return;

        const montos = repartirMonto(Number(monto), fechas.length);

        const nuevasPromesas = fechas.map((fecha, i) => ({
            fecha: format(fecha, 'yyyy-MM-dd'),
            monto: String(montos[i]),
            id_venta: String(idVenta),
        }));

        setSaving(true);
        try {
            const payload = buildPaymentsPayload(nuevasPromesas);
            const response = await bookingService.createPaymentsPromises(payload);

            if (response?.success && Array.isArray(response.payments)) {
                setPromesasGeneradas(response.payments);
                onGenerate?.(response.payments);
            } else {
                setError('No se pudieron guardar todas las promesas. Revisa los datos e intenta de nuevo.');
            }
        } catch (err) {
            setError('Ocurrió un error al generar las promesas de pago.');
        } finally {
            setSaving(false);
        }
    };

    const handleEliminar = async () => {
        if (deleting || saving || promesasAMostrar.length === 0) return;
        setError(null);
        setDeleting(true);
        try {
            const params = new URLSearchParams({ id_venta: idVenta });
            const response = await bookingService.deletePaymentsPromises(params);

            if (response?.success === false) {
                setError('No se pudieron eliminar las promesas de pago.');
                return;
            }

            setPromesasGeneradas([]);
            onDelete?.();
        } catch (err) {
            setError('Ocurrió un error al eliminar las promesas de pago.');
        } finally {
            setDeleting(false);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("es-MX", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return createPortal(
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1055 }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content" style={{ width: "auto", maxWidth: "none" }}>
                    <div className="modal-header">
                        <h5 className="modal-title">Promesas de pago</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body form-booking">
                        <div className='row g-2 mb-1'>
                            <div className="col-12 col-md-4">
                                <label htmlFor="agente" className="form-label">Tipo plazo</label>
                                <select
                                    id="agente"
                                    className="form-select"
                                    value={tipoPlazo}
                                    onChange={(e) => setTipoPlazo(e.target.value)}
                                >
                                    <option value="Semanal" disabled={!plazosDisponibles.Semanal}>Semanal</option>
                                    <option value="Quincenal" disabled={!plazosDisponibles.Quincenal}>Quincenal</option>
                                    <option value="Mensual" disabled={!plazosDisponibles.Mensual}>Mensual</option>
                                </select>
                            </div>
                            <div className="col-12 col-md-4">
                                <label htmlFor="moneda" className="form-label">Monto</label>
                                <input
                                    id="moneda"
                                    type="number"
                                    className="form-control"
                                    value={monto}
                                    onChange={(e) => setMonto(e.target.value)}
                                />
                            </div>
                            <div className="col-12 col-md-4">
                                <label htmlFor="fechaLimite" className="form-label">Fecha inicio</label>
                                <DatePicker
                                    id="fechaLimite"
                                    locale="es"
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    placeholderText="Selecciona"
                                    selected={fechaInicio}
                                    onChange={(date) => setFechaInicio(date)}
                                    maxDate={servicioLimiteCliente ? new Date(servicioLimiteCliente) : undefined}
                                />
                            </div>
                        </div>
                        {diasDisponibles !== null && (
                            <small className="text-muted">
                                {diasDisponibles} día{diasDisponibles !== 1 ? 's' : ''} disponibles según el límite del cliente
                            </small>
                        )}
                        <div className='row g-2 mb-3 justify-content-end mt-2'>
                            <div className="col-12 col-md-4">
                                <button
                                    className="btn btn-success w-100"
                                    onClick={handleGenerar}
                                    disabled={!puedeGenerar}
                                >
                                    {saving ? 'Generando...' : 'Generar'}
                                </button>
                            </div>
                            <div className="col-12 col-md-4">
                                <button
                                    className="btn btn-secondary w-100"
                                    onClick={handleEliminar}
                                    disabled={deleting || saving || promesasAMostrar.length === 0}
                                >
                                    {deleting ? 'Eliminando...' : 'Eliminar'}
                                </button>
                            </div>
                        </div>

                        {venta.ventasServicioses.length > 1 && (
                            <p className="text-warning small mb-3 text-center">
                                Solo se pueden generar promesas cuando la reserva tiene un único servicio.
                            </p>
                        )}

                        {error && (
                            <p className="text-danger small mb-3">{error}</p>
                        )}

                        {loading ? (
                            <p className="text-muted text-center mb-0">Cargando...</p>
                        ) : promesasAMostrar.length === 0 ? (
                            <p className="text-muted text-center mb-0">No hay promesas de pago registradas.</p>
                        ) : (
                            <ul className="list-group">
                                {promesasAMostrar.map((p, i) => (
                                    <li key={p.id ?? p.id_promesa ?? i} className="list-group-item d-flex justify-content-between">
                                        <span>{formatDate(p.fecha)}</span>
                                        <span>{formatMoney(p.monto)}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" style={{ backgroundColor: "var(--brand-blue)" }} onClick={onClose}>Cerrar</button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}