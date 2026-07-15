"use client";

import React from 'react';

export default function BookingTableHeader() {
    return (
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
            <h1 className="font-inter fw-medium mb-1" style={{ color: "#0f1901", fontSize: "24px", lineHeight: "1.2" }}>
                Gestión de reservas
            </h1>
            <a
                href="reservaciones/booking"
                className="btn btn-primary-custom d-flex align-items-center gap-2 shadow-premium"
                style={{
                    padding: "10px 20px",
                    fontSize: "14px",
                    borderRadius: "8px",
                    fontWeight: "400"
                  }}
                >
                <i className="bi bi-plus-lg"></i>
                <span>Nueva reserva</span>
            </a>
        </div>
    )
}
