"use client";

import React, { Suspense, useState } from "react";
import BookingList from "./BookingsList";
import BookingGrouped from "./BookingGrouped";
import BookingPassengers from "./BookingPassengers";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const tabComponents = {
    lista: BookingList,
    agrupado: BookingGrouped,
    pasajeros: BookingPassengers,
};

const VALID_TABS = ["lista", "agrupado", "pasajeros"];

function BookingComponent({ activeTab, onTabChange }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const tabParam = searchParams.get("tab");
    const currentTab = VALID_TABS.includes(tabParam) ? tabParam : "lista";
    const ActiveComponent = tabComponents[currentTab];

    const handleTabChange = (tab) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", tab);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <div>
            <div className="d-flex flex-column flex-md-row gap-2 mb-2">
                {VALID_TABS.map((tab) => {
                    const isActive = currentTab === tab;

                    const labels = {
                        lista: "Lista",
                        agrupado: "Agrupados por salidas",
                        pasajeros: "Control de pasajeros",
                    };

                    return (
                        <button
                            key={tab}
                            onClick={() => handleTabChange(tab)}
                            className={`btn border-0 transition-smooth ${isActive ? "bg-brand-blue-light text-brand-blue" : ""
                                }`}
                            style={{
                                padding: "8px 16px",
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

export default function BookingTable() {
    return (
        <Suspense fallback={<div>Cargando vista...</div>}>
          <BookingComponent />
        </Suspense>
      );
}