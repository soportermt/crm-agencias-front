"use client";

import React, { useState } from "react";
import { useBookingForm } from '../booking-form/BookingFormContext';
import ProviderSelect from '@/components/common/ProviderSelect';
import DatePicker from 'react-datepicker';

export default function GrupoForm() {
    const { draft, updateDraftField } = useBookingForm();
    const { data, errors } = draft;

    const [datePickerOpen, setDatePickerOpen] = useState(false);
    return (
        <div className="form-booking">
            <div className="row g-3 mb-2 align-items-start">
                <div className="col-12 col-md-4">
                    <ProviderSelect
                        value={data.provider}
                        error={errors.provider}
                        onChange={(provider) => {
                            updateDraftField("provider", provider.value);
                            updateDraftField("providerData", provider);
                        }}
                    />
                </div>

                <div className="col-12 col-md-4">
                    <label className="form-label">Código *</label>
                    <input
                        type="text"
                        className={`form-control ${errors.code ? "is-invalid" : ""}`}
                        value={data.code}
                        onChange={(e) => updateDraftField("code", e.target.value)}
                    />
                    {errors.code && <div className="text-danger small">{errors.code}</div>}
                </div>

                <div className="col-12 col-md-4">
                    <label className="form-label">Fecha de servicio *</label>
                    <DatePicker
                        selectsRange
                        startDate={data.checkIn}
                        endDate={data.checkOut}
                        open={datePickerOpen}
                        onInputClick={() => setDatePickerOpen(true)}
                        onClickOutside={() => setDatePickerOpen(false)}
                        onChange={(dates) => {
                            const [start, end] = dates;
                            updateDraftField("checkIn", start);
                            updateDraftField("checkOut", end);

                            if (start && end) {
                                setDatePickerOpen(false);
                            }
                        }}
                        locale="es"
                        dateFormat="dd/MM/yyyy"
                        minDate={new Date()}
                        monthsShown={2}
                        shouldCloseOnSelect={false}
                        isClearable
                        className={`form-control form-datepicker ${(errors.checkIn || errors.checkOut) ? "is-invalid" : ""}`}
                        placeholderText="Selecciona una fecha"
                        required
                        autoComplete='off'
                    />
                    {errors.checkIn && <div className="text-danger small">{errors.checkIn}</div>}
                    {errors.checkOut && <div className="text-danger small">{errors.checkOut}</div>}
                </div>

                <div className="col-12 col-md-4">
                    <label className="form-label">Fecha de evento *</label>
                    <DatePicker
                        startDate={data.checkIn}
                        open={datePickerOpen}
                        onInputClick={() => setDatePickerOpen(true)}
                        onClickOutside={() => setDatePickerOpen(false)}
                        onChange={(dates) => {
                            updateDraftField("checkIn", dates);
                        }}
                        locale="es"
                        dateFormat="dd/MM/yyyy"
                        minDate={new Date()}
                        monthsShown={2}
                        shouldCloseOnSelect={false}
                        isClearable
                        className={`form-control form-datepicker ${(errors.checkIn || errors.checkOut) ? "is-invalid" : ""}`}
                        placeholderText="Selecciona una fecha"
                        required
                        autoComplete='off'
                    />
                    {errors.checkIn && <div className="text-danger small">{errors.checkIn}</div>}
                    {errors.checkOut && <div className="text-danger small">{errors.checkOut}</div>}
                </div>

                <div className="col-12 col-md-4">
                    <label className="form-label">Nombre de evento o festejado</label>
                    <input
                        type="text"
                        className="form-control"
                        value={data.code}
                        onChange={(e) => updateDraftField("code", e.target.value)}
                    />
                </div>
                <div className="col-12 col-md-4">
                    <label className="form-label">Tipo Habitación</label>
                    <input
                        type="text"
                        className="form-control"
                        value={data.code}
                        onChange={(e) => updateDraftField("code", e.target.value)}
                    />
                </div>
                <div className="col-12 col-md-4">
                    <label className="form-label">No. Hab.</label>
                    <input
                        type="text"
                        className="form-control"
                        value={data.code}
                        onChange={(e) => updateDraftField("code", e.target.value)}
                    />
                </div>

                <div className="col-12 col-md-8">
                    <label className="form-label">Descripción *</label>
                    <textarea
                        className={`form-control ${errors.descripcion ? "is-invalid" : ""}`}
                        value={data.descripcion}
                        onChange={(e) => updateDraftField("descripcion", e.target.value)}
                    />
                    {errors.descripcion && <div className="text-danger small">{errors.descripcion}</div>}
                </div>
            </div>

            <div className="row">
                <div className="col-12 col-md-4">
                    <label className="form-label">Límite pago *</label>
                    <DatePicker
                        id="fecha"
                        selected={data.limitePago}
                        onChange={(date) => updateDraftField("limitePago", date)}
                        locale="es"
                        dateFormat="dd/MM/yyyy"
                        className={`form-control form-datepicker ${errors.limitePago ? "is-invalid" : ""}`}
                        placeholderText="Selecciona una fecha"
                        required
                        autoComplete='off'
                    />
                    {errors.limitePago && <div className="text-danger small">{errors.limitePago}</div>}
                </div>
                <div className="col-12 col-md-4">
                    <label className="form-label">Límite cliente</label>
                    <DatePicker
                        id="fecha"
                        selected={data.limiteCliente}
                        onChange={(date) => updateDraftField("limiteCliente", date)}
                        locale="es"
                        dateFormat="dd/MM/yyyy"
                        className="form-control form-datepicker"
                        placeholderText="Selecciona una fecha"
                        autoComplete='off'
                    />
                </div>
                <div className="col-12 col-md-4">
                    <label className="form-label">Fee</label>
                    <div className="input-group mb-3">
                        <span className="input-group-text">$</span>
                        <input
                            type="text"
                            className="form-control"
                            value={data.fee}
                            onChange={(e) => updateDraftField("fee", cleanDecimalInput(e.target.value))}
                            style={{ borderLeft: "1px solid var(--primary-color)" }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
