"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import { catalogosService } from "@/services/catalogos.service";

export default function CustomersSelect({
    value,
    onChange,
    error,
}) {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadCustomers();
    }, []);

    async function loadCustomers() {
        try {
            setLoading(true);

            const customers = await catalogosService.searchCustomers();

            setOptions(
                customers.map((customer) => ({
                    value: customer.id,
                    label: customer.text,
                    ...customer,
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
            <label className="form-label">Vendido a *</label>

            <Select
                options={options}
                isLoading={loading}
                instanceId="customers-select"
                inputId="customers-select"
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
    );
}