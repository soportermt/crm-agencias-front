"use client";

import AsyncCreatableSelect from "react-select/async-creatable";
import { catalogosService } from "@/services/catalogos.service";

export default function HotelSelect({
    value,
    onChange,
    error,
}) {

    const loadOptions = async (inputValue) => {

        if (inputValue.length < 3) return [];

        const hoteles = await catalogosService.searchHoteles(inputValue);

        return hoteles.map((hotel) => ({
            value: hotel.id,
            label: hotel.text,
            destino: hotel.destino,
        }));
    };

    return (
        <>
            <label className="form-label">Hotel *</label>

            <AsyncCreatableSelect
                cacheOptions
                defaultOptions={false}
                loadOptions={loadOptions}
                placeholder="Escribe o selecciona un hotel"

                value={
                    value
                        ? {
                            label: value,
                            value,
                        }
                        : null
                }

                onChange={onChange}

                formatCreateLabel={(inputValue) =>
                    `Usar "${inputValue}"`
                }

                styles={{
                    control: (provided, state) => ({
                        ...provided,
                        fontSize: "14px",
                        borderRadius: "8px",
                        border: state.isFocused ? "0.5px solid rgb(120, 174, 245)" : "1px solid #ccc", 
                        boxShadow: "none",
                        "&:hover": {
                            border: "0.5px solid rgb(120, 174, 245)", 
                        }
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