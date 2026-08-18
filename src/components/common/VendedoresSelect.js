"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import VendedoresModal from "../vendedores/VendedoresModal";
import { vendedoresService } from "@/services/vendedores.service";

export default function VendedoresSelect({
    value,
    onChange,
    error,
}) {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadVendedores();
    }, []);

    async function loadVendedores() {
        try {
            setLoading(true);

            const vendedores = await vendedoresService.get();

            setOptions(
                vendedores.map((vendedor) => ({
                    value: vendedor.id,
                    label: vendedor.nombre,
                    ...vendedor,
                }))
            );
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    function handleClientCreated(newClient) {
        const newOption = {
            value: newClient.id,
            label: newClient.nombre ?? newClient.nombre,
            ...newClient,
        };

        setOptions((prev) => [newOption, ...prev]);
        onChange(newOption);
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label mb-0">Agente *</label>
                <button
                    type="button"
                    className="btn btn-link btn-sm p-0"
                    style={{textDecoration: "none"}}
                    onClick={() => setShowModal(true)}
                >
                    + Agregar vendedor
                </button>
            </div>

            <Select
                options={options}
                isLoading={loading}
                instanceId="vendedores-select"
                inputId="vendedores-select"
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

            <VendedoresModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onClientCreated={handleClientCreated}
            />
        </>
    );
}