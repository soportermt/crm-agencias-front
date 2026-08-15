"use client";

import React, { useEffect, useState } from 'react';
import Select from "react-select";
import { catalogosService } from '@/services/catalogos.service';
import ProveedorModal from './ProveedorModal';

export default function ProviderSelect({
    value,
    onChange,
    error,
}) {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadProvider();
    }, []);

    async function loadProvider() {
        try {
            setLoading(true);
            const provider = await catalogosService.searchProviders();

            setOptions(
                provider.map((provider) => ({
                    value: provider.id,
                    label: provider.text,
                    ...provider,
                    comision: provider.comision ?? provider.porcentaje ?? 0,
                }))
            );
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    function handleProveedorCreated(newProveedor) {
        const newOption = {
            value: newProveedor.id,
            label: newProveedor.text ?? newProveedor.nombre_comercial,
            ...newProveedor,
        };

        setOptions((prev) => [newOption, ...prev]);
        onChange(newOption);
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label">Proveedor *</label>
                <button
                    type="button"
                    className="btn btn-link btn-sm p-0"
                    style={{ textDecoration: "none" }}
                    onClick={() => setShowModal(true)}
                >
                    + Agregar proveedor
                </button>
            </div>

            <Select
                options={options}
                isLoading={loading}
                instanceId="provider-select"
                inputId="provider-select"
                required
                value={options.find((o) => o.value === value) || null}
                onChange={onChange}
                placeholder="Selecciona..."
                styles={{
                    control: (provided, state) => ({
                        ...provided,
                        fontSize: "14px",
                        borderRadius: "8px",
                        border: state.isFocused
                            ? "0.5px solid rgb(120, 174, 245)"
                            : "1px solid #ccc",
                        boxShadow: "none",
                        "&:hover": {
                            border: "0.5px solid rgb(120, 174, 245)",
                        },
                    }),
                    input: (provided) => ({
                        ...provided,
                        fontSize: "14px",
                    }),
                    placeholder: (provided) => ({
                        ...provided,
                        fontSize: "14px",
                    }),
                    option: (provided) => ({
                        ...provided,
                        fontSize: "14px",
                    }),
                }}
            />

            {error && (
                <div className="text-danger small">
                    {error}
                </div>
            )}

            <ProveedorModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onProveedorCreated={handleProveedorCreated}
            />
        </>
    )
}
