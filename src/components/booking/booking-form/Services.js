"use client";

import React, { useState } from "react";
import ServiceSummaryCard from "./ServiceSummaryCard";
import { serviceCatalog } from "@/mocks/serviceCatalog";
import { useBookingForm } from "./BookingFormContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ServiceForm from "./ServiceForm";

export default function Services() {
    const { addedServices, setAddedServices } = useBookingForm();
    const [activeServiceType, setActiveServiceType] = useState(null);
    const [editingId, setEditingId] = useState(null);

    const toggleService = (service) => {
        if (activeServiceType?.id === service.id) {
            closeForm();
        } else {
            setActiveServiceType(service);
            setEditingId(null);
        }
    };

    const openEdit = (item) => {
        const serviceType = serviceCatalog.find((s) => s.id === item.tipo);
        setActiveServiceType(serviceType);
        setEditingId(item.id);
    };

    const closeForm = () => {
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
        closeForm();
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
                    const isActive = activeServiceType?.id === service.id;
                    return (
                        <button
                            key={service.id}
                            type="button"
                            className={`btn ${isSelected ? "btn-success" : "btn-outline-primary"} ${isActive ? "active" : ""}`}
                            aria-expanded={isActive}
                            aria-controls="serviceFormCollapse"
                            onClick={() => toggleService(service)}
                        >
                            <FontAwesomeIcon icon={service.icon} /> {service.nombre}
                        </button>
                    );
                })}
            </div>

            <div
                id="serviceFormCollapse"
                className={`collapse ${activeServiceType ? "show" : ""} mb-3`}
            >
                {activeServiceType && (
                    <div className="card card-body">
                        <ServiceForm
                            service={activeServiceType}
                            initialData={editingInitialData}
                            onSave={handleSave}
                            onCancel={closeForm}
                        />
                    </div>
                )}
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
        </div>
    );
}