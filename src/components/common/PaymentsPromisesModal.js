import React, { useState, useMemo } from 'react'
import { createPortal } from 'react-dom';
import { formatMoney } from "@/utils/pricing";
import DatePicker from 'react-datepicker';
import { parseISO, addDays, addMonths, format, isAfter, isEqual } from 'date-fns';

const DIAS_POR_PLAZO = {
    Semanal: 7,
    Quincenal: 15,
};

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

function repartirMonto(total, cantidad) {
    if (cantidad <= 0) return [];
    const base = Math.floor((total / cantidad) * 100) / 100;
    const montos = new Array(cantidad).fill(base);
    const acumulado = base * (cantidad - 1);
    montos[cantidad - 1] = Math.round((total - acumulado) * 100) / 100;
    return montos;
}

export default function PaymentsPromisesModal({ promesas = [], venta, total, loading, onClose, onGenerate }) {

    const servicioLimiteCliente = venta.ventasServicioses[0]?.limite_cliente;

    const [tipoPlazo, setTipoPlazo] = useState('Semanal');
    const [monto, setMonto] = useState(total);
    const [fechaInicio, setFechaInicio] = useState(
        venta.fecha ? parseISO(venta.fecha.split('T')[0]) : null
    );
    const [promesasGeneradas, setPromesasGeneradas] = useState([]);

    const promesasAMostrar = promesasGeneradas.length > 0 ? promesasGeneradas : promesas;

    const puedeGenerar = useMemo(() => {
        return !!fechaInicio && !!servicioLimiteCliente && venta.ventasServicioses.length === 1;
    }, [fechaInicio, servicioLimiteCliente, venta.ventasServicioses]);

    const handleGenerar = () => {
        if (!puedeGenerar) return;

        const fechas = calcularFechasPromesas(fechaInicio, servicioLimiteCliente, tipoPlazo);

        if (fechas.length === 0) return;

        const montos = repartirMonto(Number(monto), fechas.length);

        const nuevasPromesas = fechas.map((fecha, i) => ({
            id: `tmp-${Date.now()}-${i}`,
            monto: String(montos[i]),
            fecha: format(fecha, 'yyyy-MM-dd'),
            id_venta: String(venta.id_venta ?? venta.id ?? ''),
        }));

        setPromesasGeneradas(nuevasPromesas);
        onGenerate?.(nuevasPromesas);
    };

    const handleEliminar = () => {
        setPromesasGeneradas([]);
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
                        <div className='row g-2 mb-3'>
                            <div className="col-12 col-md-4">
                                <label htmlFor="agente" className="form-label">Tipo plazo</label>
                                <select
                                    id="agente"
                                    className="form-select"
                                    value={tipoPlazo}
                                    onChange={(e) => setTipoPlazo(e.target.value)}
                                >
                                    <option value={"Semanal"}>Semanal</option>
                                    <option value={"Quincenal"}>Quincenal</option>
                                    <option value={"Mensual"}>Mensual</option>
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
                                />
                            </div>
                        </div>
                        <div className='row g-2 mb-3 justify-content-end'>
                            <div className="col-12 col-md-4">
                                <button
                                    className="btn btn-success w-100"
                                    onClick={handleGenerar}
                                    disabled={!puedeGenerar}
                                >
                                    Generar
                                </button>
                            </div>
                            <div className="col-12 col-md-4">
                                <button
                                    className="btn btn-secondary w-100"
                                    onClick={handleEliminar}
                                    disabled={promesasGeneradas.length === 0}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>

                        {venta.ventasServicioses.length > 1 && (
                            <p className="text-warning small mb-3">
                                Solo se pueden generar promesas cuando la reserva tiene un único servicio.
                            </p>
                        )}

                        {loading ? (
                            <p className="text-muted text-center mb-0">Cargando...</p>
                        ) : promesasAMostrar.length === 0 ? (
                            <p className="text-muted text-center mb-0">No hay promesas de pago registradas.</p>
                        ) : (
                            <ul className="list-group">
                                {promesasAMostrar.map((p) => (
                                    <li key={p.id} className="list-group-item d-flex justify-content-between">
                                        <span>{p.fecha}</span>
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