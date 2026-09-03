"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import { catalogosService } from "@/services/catalogos.service";
import ClientModal from "../clients/ClientModal";

export default function CustomersSelect({
    value,
    onChange,
    error,
}) {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadCustomers();
    }, []);

    async function loadCustomers() {
        try {
            setLoading(true);

            const customers = await catalogosService.searchCustomers();

            setOptions(
                customers.map((customer) => ({
                    value: customer.id_cliente,
                    label: customer.nombre,
                    ...customer,
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
            value: newClient.id_cliente,
            label: newClient.nombre ?? newClient.nombreCompleto,
            ...newClient,
        };

        setOptions((prev) => [newOption, ...prev]);
        onChange(newOption);
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label mb-0">Vendido a *</label>
                <button
                    type="button"
                    className="btn btn-link btn-sm p-0"
                    style={{textDecoration: "none"}}
                    onClick={() => setShowModal(true)}
                >
                    + Agregar cliente
                </button>
            </div>

            <Select
                options={options}
                isLoading={loading}
                instanceId="customers-select"
                inputId="customers-select"
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

            <ClientModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onClientCreated={handleClientCreated}
            />
        </>
    );
}