"use client";

import React, { useState, useEffect, Suspense } from "react";
import { usePathname, useRouter, useSearchParams, useParams } from "next/navigation";
import General from "@/components/grupos/info/General";
import Habitaciones from "@/components/grupos/info/Habitaciones";
import Archivos from "@/components/grupos/info/Archivos";
import {
    FolderIcon,
    InformationCircleIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline';

const tabComponents = {
    general: General,
    habitaciones: Habitaciones,
    archivos: Archivos,
};

const tabData = {
    general: {
        label: "General",
        Icon: InformationCircleIcon
    },
    habitaciones: {
        label: "Habitaciones",
        Icon: UserGroupIcon
    },
    archivos: {
        label: "Archivos",
        Icon: FolderIcon
    },
};

const VALID_TABS = ["general", "habitaciones", "archivos"];
function GrupoComponent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const params = useParams();
    const id_grupo = params.id || params.id_grupo;

    const tabParam = searchParams.get("tab");
    const currentTab = VALID_TABS.includes(tabParam) ? tabParam : "general";
    const ActiveComponent = tabComponents[currentTab];

    const handleTabChange = (tab) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", tab);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="container-fluid p-0">
            <div className="bg-white p-4 shadow-premium" style={{ borderRadius: "8px" }}>
                <h4>Detalles del grupo</h4>
                <div className='mt-4'>
                    <div className="d-flex flex-column flex-md-row gap-2 mb-3">
                        {VALID_TABS.map((tab) => {
                            const isActive = currentTab === tab;
                            const { label, Icon } = tabData[tab];

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
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8
                                    }}
                                >
                                    <Icon style={{
                                        width: "18px",
                                        height: "18px"
                                    }} />
                                    <span>{label}</span>
                                </button>
                            );
                        })}
                    </div>
                    <div>
                        {ActiveComponent && <ActiveComponent id_grupo={id_grupo} />}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default function GrupoInfo() {
    return (
        <Suspense fallback={<div>Cargando vista...</div>}>
            <GrupoComponent />
        </Suspense>
    );
}