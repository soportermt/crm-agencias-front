import React from 'react'
import { useBookingForm } from '../booking-form/BookingFormContext';
import ProviderSelect from '@/components/common/ProviderSelect';
import PassengersInput from '@/components/common/PassengersInput';
import DatePicker from 'react-datepicker';
import { calcularTotalNeto } from '@/utils/pricing';
import { cleanDecimalInput } from '@/utils/inputFormatters';

export default function VueloForm() {
    const { draft, updateDraftField } = useBookingForm();
    const { data, errors } = draft;
    const isInternacional = !!data.internacional;
    const setIsInternacional = (checked) => updateDraftField("internacional", checked);
    const isRedondo = !!data.redondo;
    const setIsRedondo = (checked) => updateDraftField("redondo", checked);

    const toggleEquipaje = (tipo) => {
        const nuevo = data.equipaje?.includes(tipo)
            ? data.equipaje.filter((t) => t !== tipo)
            : [...(data.equipaje ?? []), tipo];
        updateDraftField("equipaje", nuevo);
    };

    const updatePassenger = (grupo, index, field, value) => {
        const pasajeros = {
            ...data.pasajeros,
            [grupo]: data.pasajeros[grupo].map((p, i) =>
                i === index ? { ...p, [field]: value } : p
            ),
        };
        updateDraftField("pasajeros", pasajeros);
    };

    const addEscala = (tipo) => {
        const nueva = { ciudad: "", fecha_llegada: null, hora_llegada: "", fecha_salida: null, hora_salida: "" };
        updateDraftField(tipo, [...(data[tipo] ?? []), nueva]);
    };

    const updateEscala = (tipo, index, field, value) => {
        const escalas = [...(data[tipo] ?? [])];
        escalas[index] = { ...escalas[index], [field]: value };
        updateDraftField(tipo, escalas);
    };

    const removeEscala = (tipo, index) => {
        updateDraftField(tipo, (data[tipo] ?? []).filter((_, i) => i !== index));
    };

    return (
        <div className="form-booking">
            <div className="row g-3 mb-2 align-items-end">
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
                    <div className="d-flex gap-1 mb-1">
                        <div className="form-check">
                            <input
                                className="form-check-input p-0"
                                type="checkbox"
                                id="checkInternacional"
                                checked={isInternacional}
                                onChange={(e) => setIsInternacional(e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="checkInternacional">
                                Internacional
                            </label>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-4">
                    <label className="form-label">Origen</label>
                    <input
                        type="text"
                        className="form-control"
                        value={data.origen}
                        onChange={(e) => updateDraftField("origen", e.target.value)}
                    />
                </div>
                <div className="col-12 col-md-4">
                    <label className="form-label">Destino</label>
                    <input
                        type="text"
                        className="form-control"
                        value={data.destino}
                        onChange={(e) => updateDraftField("destino", e.target.value)}
                    />
                </div>
                <div className="col-12 col-md-4">
                    <label className="form-label">Equipaje</label>
                    <div className="d-flex gap-2">
                        <div className="form-check">
                            <input
                                className="form-check-input p-0"
                                type="checkbox"
                                checked={!!data.equipaje?.includes("mano-10k")}
                                onChange={() => toggleEquipaje("mano-10k")}
                            />
                            <label className="form-check-label">Mano 10kg</label>
                        </div>
                        <div className="form-check">
                            <input
                                className="form-check-input p-0"
                                type="checkbox"
                                checked={!!data.equipaje?.includes("doc-25k")}
                                onChange={() => toggleEquipaje("doc-25k")}
                            />
                            <label className="form-check-label">Doc 25kg</label>
                        </div>
                        <div className="form-check">
                            <input
                                className="form-check-input p-0"
                                type="checkbox"
                                checked={!!data.equipaje?.includes("otro")}
                                onChange={() => toggleEquipaje("otro")}
                            />
                            <label className="form-check-label">Otro</label>
                        </div>
                    </div>
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
                <div className="col-12 col-md-4">
                    <label className="form-label">Aerolínea *</label>
                    <input
                        type="text"
                        className="form-control"
                        value={data.aerolinea}
                        onChange={(e) => updateDraftField("aerolinea", e.target.value)}
                    />
                </div>
                <div className="col-12 col-md-4">
                    <div className="d-flex gap-1 mb-1">
                        <div className="form-check">
                            <input
                                className="form-check-input p-0"
                                type="checkbox"
                                id="checkRedondo"
                                checked={isRedondo}
                                onChange={(e) => setIsRedondo(e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="checkRedondo">
                                Redondo
                            </label>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-4">
                    <label className="form-label">Fecha de servicio *</label>
                    <DatePicker
                        selectsRange={isRedondo}
                        startDate={data.checkIn}
                        endDate={isRedondo ? data.checkOut : null}
                        selected={!isRedondo ? data.checkIn : null}
                        onChange={(dates) => {
                            if (isRedondo) {
                                const [start, end] = dates;
                                updateDraftField("checkIn", start);
                                updateDraftField("checkOut", end);
                            } else {
                                updateDraftField("checkIn", dates);
                                updateDraftField("checkOut", null);
                            }
                        }}
                        locale="es"
                        dateFormat="dd/MM/yyyy"
                        minDate={new Date()}
                        monthsShown={isRedondo ? 2 : 1}
                        isClearable
                        className="form-control form-datepicker"
                        placeholderText={isRedondo ? "Rango de fechas" : "Selecciona una fecha"}
                        autoComplete='off'
                    />
                </div>

                <div className="col-12 col-md-4">
                    <label className="form-label">Hora de salida en origen *</label>
                    <input
                        type="time"
                        className="form-control"
                        value={data.salida_origen}
                        onChange={(e) => updateDraftField("salida_origen", e.target.value)}
                    />
                </div>
                <div className="col-12 col-md-4">
                    <label className="form-label">Hora de llegada en destino *</label>
                    <input
                        type="time"
                        className="form-control"
                        value={data.llegada_destino}
                        onChange={(e) => updateDraftField("llegada_destino", e.target.value)}
                    />
                </div>

                {isRedondo && (
                    <>
                        <div className="col-12 col-md-4">
                            <label className="form-label">Hora de salida en destino *</label>
                            <input
                                type="time"
                                className="form-control"
                                value={data.salida_destino}
                                onChange={(e) => updateDraftField("salida_destino", e.target.value)}
                            />
                        </div>
                        <div className="col-12 col-md-4">
                            <label className="form-label">Hora de llegada en origen *</label>
                            <input
                                type="time"
                                className="form-control"
                                value={data.llegada_origen}
                                onChange={(e) => updateDraftField("llegada_origen", e.target.value)}
                            />
                        </div>
                    </>
                )}

                <div className="col-12 col-md-4">
                    <div className='d-flex gap-3'>
                        <div className="d-flex gap-1 mb-1">
                            <div className="form-check">
                                <input
                                    className="form-check-input p-0"
                                    type="radio"
                                    id="flight-stop-direct"
                                    checked={data.escala === 0}
                                    onChange={() => updateDraftField("escala", 0)}
                                />
                                <label className="form-check-label" htmlFor="checkDirecto">
                                    Directo
                                </label>
                            </div>
                        </div>
                        <div className="d-flex gap-1 mb-1">
                            <div className="form-check">
                                <input
                                    className="form-check-input p-0"
                                    type="radio"
                                    id="flight-stop-stop"
                                    checked={data.escala === 1}
                                    onChange={() => updateDraftField("escala", 1)}
                                />
                                <label className="form-check-label" htmlFor="checkEscala">
                                    Con escala
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                {data.escala === 1 && (
                    <>
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <span style={{ fontWeight: 500, color: "#0d6efd" }}>Escalas en origen</span>
                            <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => addEscala("escalas_origen")}>
                                + Agregar escala
                            </button>
                        </div>
                        {(data.escalas_origen ?? []).map((escala, index) => (
                            <div className="row g-3 mt-1 align-items-end" key={`escala-origen-${index}`}>
                                <div className="col-12 col-md-2">
                                    <label className="form-label">Ciudad</label>
                                    <input
                                        className="form-control"
                                        value={escala.ciudad}
                                        onChange={(e) => updateEscala("escalas_origen", index, "ciudad", e.target.value)}
                                    />
                                </div>
                                <div className="col-12 col-md-2">
                                    <label className="form-label">Fecha llegada</label>
                                    <DatePicker
                                        selected={escala.fecha_llegada}
                                        onChange={(date) => updateEscala("escalas_origen", index, "fecha_llegada", date)}
                                        locale="es"
                                        dateFormat="dd/MM/yyyy"
                                        className="form-control form-datepicker"
                                        placeholderText="dd/mm/aaaa"
                                        autoComplete='off'
                                    />
                                </div>
                                <div className="col-12 col-md-2">
                                    <label className="form-label">Hora llegada</label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        value={escala.hora_llegada}
                                        onChange={(e) => updateEscala("escalas_origen", index, "hora_llegada", e.target.value)}
                                    />
                                </div>
                                <div className="col-12 col-md-2">
                                    <label className="form-label">Fecha salida</label>
                                    <DatePicker
                                        selected={escala.fecha_salida}
                                        onChange={(date) => updateEscala("escalas_origen", index, "fecha_salida", date)}
                                        locale="es"
                                        dateFormat="dd/MM/yyyy"
                                        className="form-control form-datepicker"
                                        placeholderText="dd/mm/aaaa"
                                        autoComplete='off'
                                    />
                                </div>
                                <div className="col-12 col-md-2">
                                    <label className="form-label">Hora salida</label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        value={escala.hora_salida}
                                        onChange={(e) => updateEscala("escalas_origen", index, "hora_salida", e.target.value)}
                                    />
                                </div>
                                <div className="col-12 col-md-2">
                                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeEscala("escalas_origen", index)}>
                                        Quitar
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <span style={{ fontWeight: 500, color: "#0d6efd" }}>Escalas en destino</span>
                            <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => addEscala("escalas_destino")}>
                                + Agregar escala
                            </button>
                        </div>
                        {(data.escalas_destino ?? []).map((escala, index) => (
                            <div className="row g-3 mt-1 align-items-end" key={`escala-destino-${index}`}>
                                <div className="col-12 col-md-2">
                                    <label className="form-label">Ciudad</label>
                                    <input
                                        className="form-control"
                                        value={escala.ciudad}
                                        onChange={(e) => updateEscala("escalas_destino", index, "ciudad", e.target.value)}
                                    />
                                </div>
                                <div className="col-12 col-md-2">
                                    <label className="form-label">Fecha llegada</label>
                                    <DatePicker
                                        selected={escala.fecha_llegada}
                                        onChange={(date) => updateEscala("escalas_destino", index, "fecha_llegada", date)}
                                        locale="es"
                                        dateFormat="dd/MM/yyyy"
                                        className="form-control form-datepicker"
                                        placeholderText="dd/mm/aaaa"
                                        autoComplete='off'
                                    />
                                </div>
                                <div className="col-12 col-md-2">
                                    <label className="form-label">Hora llegada</label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        value={escala.hora_llegada}
                                        onChange={(e) => updateEscala("escalas_destino", index, "hora_llegada", e.target.value)}
                                    />
                                </div>
                                <div className="col-12 col-md-2">
                                    <label className="form-label">Fecha salida</label>
                                    <DatePicker
                                        selected={escala.fecha_salida}
                                        onChange={(date) => updateEscala("escalas_destino", index, "fecha_salida", date)}
                                        locale="es"
                                        dateFormat="dd/MM/yyyy"
                                        className="form-control form-datepicker"
                                        placeholderText="dd/mm/aaaa"
                                        autoComplete='off'
                                    />
                                </div>
                                <div className="col-12 col-md-2">
                                    <label className="form-label">Hora salida</label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        value={escala.hora_salida}
                                        onChange={(e) => updateEscala("escalas_destino", index, "hora_salida", e.target.value)}
                                    />
                                </div>
                                <div className="col-12 col-md-2">
                                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeEscala("escalas_destino", index)}>
                                        Quitar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </>
                )}

                <p className="mb-1" style={{ fontSize: "18px", fontWeight: 600 }}>Datos de los pasajeros</p>
                <div className="row g-3 mt-1">
                    {isInternacional ? (
                        <>
                            <div className="col-md-3 mt-1 mb-0">
                                <label className="form-label">Nombre (Adulto)</label>
                            </div>
                            <div className="col-md-3 mt-1 mb-0">
                                <label className="form-label">Apellidos (Adulto)</label>
                            </div>
                            <div className="col-md-2 mt-1 mb-0">
                                <label className="form-label">Fecha nacimiento</label>
                            </div>
                            <div className="col-md-2 mt-1 mb-0">
                                <label className="form-label">No. Pasaporte</label>
                            </div>
                            <div className="col-md-2 mt-1 mb-0">
                                <label className="form-label">No. Visa</label>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="col-md-4 mt-1 mb-0">
                                <label className="form-label">Nombre (Adulto)</label>
                            </div>
                            <div className="col-md-4 mt-1 mb-0">
                                <label className="form-label">Apellidos (Adulto)</label>
                            </div>
                        </>
                    )}
                </div>
                {data.pasajeros?.adultos?.map((pasajero, index) => (
                    <div key={`adulto-${index}`} className="row g-3 my-1">
                        {isInternacional ? (
                            <>
                                <div className="col-md-3 mt-1 mb-0">
                                    <input
                                        className="form-control"
                                        value={pasajero.nombre}
                                        onChange={(e) => updatePassenger("adultos", index, "nombre", e.target.value)}
                                    />
                                </div>
                                <div className="col-md-3 mt-1 mb-0">
                                    <input
                                        className="form-control"
                                        value={pasajero.apellidos}
                                        onChange={(e) => updatePassenger("adultos", index, "apellidos", e.target.value)}
                                    />
                                </div>
                                <div className="col-md-2 mt-1 mb-0">
                                    <input
                                        type='date'
                                        className="form-control"
                                        selected={pasajero.fecha_nacimiento}
                                        onChange={(e) => updatePassenger("adultos", index, "fecha_nacimiento", e.target.value)}
                                    />
                                </div>
                                <div className="col-md-2 mt-1 mb-0">
                                    <input
                                        className="form-control"
                                        value={pasajero.no_pasaporte}
                                        onChange={(e) => updatePassenger("adultos", index, "no_pasaporte", e.target.value)}
                                    />
                                </div>
                                <div className="col-md-2 mt-1 mb-0">
                                    <input
                                        className="form-control"
                                        value={pasajero.no_visa}
                                        onChange={(e) => updatePassenger("adultos", index, "no_visa", e.target.value)}
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="col-md-4 mt-1 mb-0">
                                    <input
                                        className="form-control"
                                        value={pasajero.nombre}
                                        onChange={(e) => updatePassenger("adultos", index, "nombre", e.target.value)}
                                    />
                                </div>
                                <div className="col-md-4 mt-1 mb-0">
                                    <input
                                        className="form-control"
                                        value={pasajero.apellidos}
                                        onChange={(e) => updatePassenger("adultos", index, "apellidos", e.target.value)}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                ))}

                {data.pasajeros?.menores?.length > 0 && (
                    <>
                        <div className="row g-3 mt-2 mb-1">
                            {isInternacional ? (
                                <>
                                    <div className="col-md-2 mt-1 mb-0">
                                        <label className="form-label">Nombre (Menor)</label>
                                    </div>
                                    <div className="col-md-2 mt-1 mb-0">
                                        <label className="form-label">Apellidos (Menor)</label>
                                    </div>
                                    <div className="col-md-2 mt-1 mb-0">
                                        <label className="form-label">Edad</label>
                                    </div>
                                    <div className="col-md-2 mt-1 mb-0">
                                        <label className="form-label">Fecha nacimiento</label>
                                    </div>
                                    <div className="col-md-2 mt-1 mb-0">
                                        <label className="form-label">No. Pasaporte</label>
                                    </div>
                                    <div className="col-md-2 mt-1 mb-0">
                                        <label className="form-label">No. Visa</label>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="col-md-4 mt-1 mb-0">
                                        <label className="form-label">Nombre (Menor)</label>
                                    </div>
                                    <div className="col-md-4 mt-1 mb-0">
                                        <label className="form-label">Apellidos (Menor)</label>
                                    </div>
                                    <div className="col-md-2 mt-1 mb-0">
                                        <label className="form-label">Edad</label>
                                    </div>
                                </>
                            )}
                        </div>
                        {data.pasajeros?.menores?.map((pasajero, index) => (
                            <div key={`menor-${index}`} className="row g-3 mt-2 mb-1">
                                {isInternacional ? (
                                    <>
                                        <div className="col-md-2 mt-0 mb-0">
                                            <input
                                                className="form-control"
                                                value={pasajero.nombre}
                                                onChange={(e) => updatePassenger("menores", index, "nombre", e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-2 mt-0 mb-0">
                                            <input
                                                className="form-control"
                                                value={pasajero.apellidos}
                                                onChange={(e) => updatePassenger("menores", index, "apellidos", e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-2 mt-0 mb-0">
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={pasajero.edad}
                                                onChange={(e) => updatePassenger("menores", index, "edad", Number(e.target.value))}
                                            />
                                        </div>
                                        <div className="col-md-2 mt-1 mb-0">
                                            <input
                                                type='date'
                                                className="form-control"
                                                value={pasajero.fecha_nacimiento ?? ""}
                                                onChange={(e) => updatePassenger("menores", index, "fecha_nacimiento", e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-2 mt-0 mb-0">
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={pasajero.edad}
                                                onChange={(e) => updatePassenger("menores", index, "edad", Number(e.target.value))}
                                            />
                                        </div>
                                        <div className="col-md-2 mt-0 mb-0">
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={pasajero.edad}
                                                onChange={(e) => updatePassenger("menores", index, "edad", Number(e.target.value))}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="col-md-4 mt-0 mb-0">
                                            <input
                                                className="form-control"
                                                value={pasajero.nombre}
                                                onChange={(e) => updatePassenger("menores", index, "nombre", e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-4 mt-0 mb-0">
                                            <input
                                                className="form-control"
                                                value={pasajero.apellidos}
                                                onChange={(e) => updatePassenger("menores", index, "apellidos", e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-2 mt-0 mb-0">
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={pasajero.edad}
                                                onChange={(e) => updatePassenger("menores", index, "edad", Number(e.target.value))}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </>
                )}

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
        </div>
    )
}
