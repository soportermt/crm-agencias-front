"use client";

import React, { useEffect, useState } from 'react';
import Select from "react-select";
import { catalogosService } from '@/services/catalogos.service';

export default function ProviderSelect({
    value,
    onChange,
    error,
    idAgencia,
}) {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (idAgencia) {
            loadProvider();
        }
    }, [idAgencia]);

    async function loadProvider() {
        try {
            setLoading(true);
            const provider = await catalogosService.searchProviders(idAgencia);

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

    return (
        <>
            <label className="form-label">Proveedor *</label>

            <Select
                options={options}
                isLoading={loading}
                instanceId="provider-select"
                inputId="provider-select"
                value={options.find((o) => o.value === value) || null}
                onChange={onChange}
                placeholder="Selecciona un cliente"
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
        </>
    )
}
