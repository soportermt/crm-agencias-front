"use client";

import React, { useState } from "react";
import ServiceFormModal from "./ServiceFormModal";
import ServiceSummaryCard from "./ServiceSummaryCard";
import { serviceCatalog } from "@/mocks/serviceCatalog";
import { useBookingForm } from "./BookingFormContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Services() {
    const { addedServices, setAddedServices } = useBookingForm();
    const [activeServiceType, setActiveServiceType] = useState(null);
    const [editingId, setEditingId] = useState(null);

    const openNew = (serviceType) => {
        setActiveServiceType(serviceType);
        setEditingId(null);
    };

    const openEdit = (item) => {
        const serviceType = serviceCatalog.find((s) => s.id === item.tipo);
        setActiveServiceType(serviceType);
        setEditingId(item.id);
    };

    const closeModal = () => {
        setActiveServiceType(null);
        setEditingId(null);
    };

    const handleSave = (formData) => {
        if (editingId) {
            setAddedServices((prev) =>
                prev.map((item) => (item.id === editingId ? { ...item, data: formData } : item))
            );
        } else {
            setAddedServices((prev) => [
                ...prev,
                { id: crypto.randomUUID(), tipo: activeServiceType.id, data: formData },
            ]);
        }
        closeModal();
    };

    const handleRemove = (id) => {
        setAddedServices((prev) => prev.filter((item) => item.id !== id));
    };

    const editingInitialData = editingId
        ? addedServices.find((item) => item.id === editingId)?.data
        : null;

    return (
        <div className="mt-3">
            <div className="d-flex flex-wrap gap-2 mb-3">
                {serviceCatalog.map((service) => {
                    const isSelected = addedServices.some((item) => item.tipo === service.id);
                    return (
                        <button
                            key={service.id}
                            type="button"
                            className={`btn service-btn-styled ${isSelected ? "is-selected" : ""}`}
                            onClick={() => openNew(service)}
                        >
                            <FontAwesomeIcon icon={service.icon} /> {service.nombre}
                        </button>
                    );
                })}
            </div>

            {addedServices.map((item) => {
                const serviceType = serviceCatalog.find((s) => s.id === item.tipo);
                return (
                    <ServiceSummaryCard
                        key={item.id}
                        service={serviceType}
                        data={item.data}
                        onEdit={() => openEdit(item)}
                        onRemove={() => handleRemove(item.id)}
                    />
                );
            })}

            {activeServiceType && (
                <ServiceFormModal
                    service={activeServiceType}
                    initialData={editingInitialData}
                    onSave={handleSave}
                    onClose={closeModal}
                />
            )}
        </div>
    );
}