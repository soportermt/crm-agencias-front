"use client";

import React, { useState } from "react";
import BookingList from "./BookingsList";
import BookingGrouped from "./BookingGrouped";
import BookingPassengers from "./BookingPassengers";

const tabComponents = {
    lista: BookingList,
    agrupado: BookingGrouped,
    pasajeros: BookingPassengers,
};

export default function BookingTable({ activeTab, onTabChange }) {
    const ActiveComponent = tabComponents[activeTab];

    return (
        <div>
            <div className="d-flex flex-column flex-md-row gap-2 mb-3">
                {["lista", "agrupado", "pasajeros"].map((tab) => {
                    const isActive = activeTab === tab;

                    const labels = {
                        lista: "Lista",
                        agrupado: "Agrupados por salidas",
                        pasajeros: "Control de pasajeros",
                    };

                    return (
                        <button
                            key={tab}
                            onClick={() => onTabChange(tab)}
                            className={`btn border-0 transition-smooth ${isActive ? "bg-brand-blue-light text-brand-blue" : ""
                                }`}
                            style={{
                                padding: "12px 24px",
                                borderRadius: "24px",
                                fontSize: "14px",
                                color: isActive ? undefined : "rgba(0,0,0,0.4)",
                                fontWeight: 500,
                                overflow: "hidden",
                            }}
                        >
                            {labels[tab]}
                        </button>
                    );
                })}
            </div>

            <div>
                {ActiveComponent && <ActiveComponent />}
            </div>
        </div>
    );
}