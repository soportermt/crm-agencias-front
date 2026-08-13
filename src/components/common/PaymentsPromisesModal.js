import React from 'react'
import { createPortal } from 'react-dom';
import { formatMoney } from "@/utils/pricing";
import DatePicker from 'react-datepicker';

export default function PaymentsPromisesModal({ promesas = [], loading, onClose }) {
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
                                <select id="agente" className="form-select">
                                    <option value={"Semanal"}>Semanal</option>
                                    <option value={"Quincenal"}>Quincenal</option>
                                    <option value={"Mensual"}>Mensual</option>
                                </select>
                            </div>
                            <div className="col-12 col-md-4">
                                <label htmlFor="moneda" className="form-label">Monto</label>
                                <input
                                    id="titular"
                                    type="text"
                                    className="form-control"
                                />
                            </div>
                            <div className="col-12 col-md-4">
                                <label htmlFor="moneda2" className="form-label">Fecha inicio</label>
                                <DatePicker
                                    id="fechaLimite"
                                    locale="es"
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    placeholderText="Selecciona"
                                />
                            </div>
                        </div>
                        <div className='row g-2 mb-3 justify-content-end'>
                            <div className="col-12 col-md-4">
                                <button className="btn btn-primary w-100">Generar</button>
                            </div>
                            <div className="col-12 col-md-4">
                                <button className="btn btn-secondary w-100">Eliminar</button>
                            </div>
                        </div>
                        {loading ? (
                            <p className="text-muted mb-0">Cargando...</p>
                        ) : promesas.length === 0 ? (
                            <p className="text-muted mb-0">No hay promesas de pago registradas.</p>
                        ) : (
                            <ul className="list-group">
                                {promesas.map((p) => (
                                    <li key={p.id_promesa} className="list-group-item d-flex justify-content-between">
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