"use client";

import PassengersInput from "@/components/common/PassengersInput";
import ProviderSelect from "@/components/common/ProviderSelect";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { useBookingForm } from "../booking-form/BookingFormContext";
import { calcularTotalNeto } from "@/utils/pricing";
import { cleanDecimalInput } from "@/utils/inputFormatters";

export default function TourForm() {
    const { draft, updateDraftField } = useBookingForm();
    const { data, errors } = draft;

    const [datePickerOpen, setDatePickerOpen] = useState(false);

    const updatePassenger = (grupo, index, field, value) => {
        const pasajeros = {
            ...data.pasajeros,
            [grupo]: data.pasajeros[grupo].map((p, i) =>
                i === index ? { ...p, [field]: value } : p
            ),
        };
        updateDraftField("pasajeros", pasajeros);
    };

    return (
        <div className="form-booking">
            <div className="row g-3 mb-2 align-items-start">
                <div className="col-12 col-md-4">
                    <ProviderSelect
                        value={data.provider}
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
                        className="form-control"
                        value={data.code}
                        onChange={(e) => updateDraftField("code", e.target.value)}
                    />
                    {errors.code && <div className="text-danger small">{errors.code}</div>}
                </div>

                <div className="col-12 col-md-4">
                    <PassengersInput
                        room={{ adultos: data.adultos ?? 2, menores: data.menores ?? 0 }}
                        onChange={(adultos, menores) => {
                            updateDraftField("adultos", adultos);
                            updateDraftField("menores", menores);
                            updateDraftField("pasajeros", {
                                adultos: Array.from({ length: adultos }, (_, i) =>
                                    data.pasajeros?.adultos?.[i] ?? { nombre: "", apellidos: "" }
                                ),
                                menores: Array.from({ length: menores }, (_, i) =>
                                    data.pasajeros?.menores?.[i] ?? { nombre: "", apellidos: "", edad: "" }
                                ),
                            });
                        }}
                    />
                </div>

                <div className="col-12 col-md-8">
                    <label className="form-label">Descripción *</label>
                    <textarea
                        className="form-control"
                        value={data.descripcion}
                        onChange={(e) => updateDraftField("descripcion", e.target.value)}
                    />
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
                        className="form-control form-datepicker"
                        placeholderText="Selecciona una fecha"
                        required
                        autoComplete='off'
                    />
                </div>
            </div>
            <p className="mb-1" style={{ fontSize: "18px", fontWeight: 600 }}>Datos de los pasajeros</p>

            {data.pasajeros?.adultos?.map((pasajero, index) => (
                <div key={`adulto-${index}`} className="row g-3 mb-1">
                    <div className="col-md-4">
                        <label className="form-label">Nombre (Adulto)</label>
                        <input
                            className="form-control"
                            value={pasajero.nombre}
                            onChange={(e) => updatePassenger("adultos", index, "nombre", e.target.value)}
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Apellidos (Adulto)</label>
                        <input
                            className="form-control"
                            value={pasajero.apellidos}
                            onChange={(e) => updatePassenger("adultos", index, "apellidos", e.target.value)}
                        />
                    </div>
                </div>
            ))}

            {data.pasajeros?.menores?.map((pasajero, index) => (
                <div key={`menor-${index}`} className="row g-3 mb-1">
                    <div className="col-md-4">
                        <label className="form-label">Nombre (Menor)</label>
                        <input
                            className="form-control"
                            value={pasajero.nombre}
                            onChange={(e) => updatePassenger("menores", index, "nombre", e.target.value)}
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Apellidos (Menor)</label>
                        <input
                            className="form-control"
                            value={pasajero.apellidos}
                            onChange={(e) => updatePassenger("menores", index, "apellidos", e.target.value)}
                        />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">Edad</label>
                        <input
                            type="number"
                            className="form-control"
                            value={pasajero.edad}
                            onChange={(e) => updatePassenger("menores", index, "edad", Number(e.target.value))}
                        />
                    </div>
                </div>
            ))}


            <div className="row mt-3">
                <div className="col-12 col-md-4">
                    <label className="form-label">Límite pago *</label>
                    <DatePicker
                        id="fecha"
                        selected={data.limitePago}
                        onChange={(date) => updateDraftField("limitePago", date)}
                        locale="es"
                        dateFormat="dd/MM/yyyy"
                        className="form-control form-datepicker"
                        placeholderText="Selecciona una fecha"
                        autoComplete='off'
                    />
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
                    <label className="form-label">Total público</label>
                    <div className="input-group mb-3">
                        <span className="input-group-text">$</span>
                        <input
                            type="text"
                            className="form-control"
                            value={data.total_publico}
                            onChange={(e) => updateDraftField("total_publico", cleanDecimalInput(e.target.value))}
                            style={{ borderLeft: "1px solid var(--primary-color)" }}
                        />
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <label className="form-label">Total neto</label>
                    <div className="input-group mb-3">
                        <span className="input-group-text">$</span>
                        <input
                            type="text"
                            className="form-control"
                            value={calcularTotalNeto(data.total_publico, data.providerData?.comision).toFixed(2)}
                            readOnly
                            disabled
                            style={{ borderLeft: "1px solid var(--primary-color)", color: "rgba(64, 64, 64, .8)" }}
                        />
                    </div>
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
    );
}