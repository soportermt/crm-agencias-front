"use client";

import React, { useState, useEffect, Suspense } from "react";
import { usePathname, useRouter, useSearchParams, useParams } from "next/navigation";
import General from "@/components/grupos/info/General";
import Habitaciones from "@/components/grupos/info/Habitaciones";
import Archivos from "@/components/grupos/info/Archivos";
import {
    ChevronRightIcon,
    CurrencyDollarIcon,
    FolderIcon,
    InformationCircleIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline';
import Link from "next/link";
import { grupoService } from "@/services/grupo.service";
import Pagos from "@/components/grupos/info/Pagos";

const tabComponents = {
    general: General,
    habitaciones: Habitaciones,
    archivos: Archivos,
    pagos: Pagos,
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
    pagos: {
        label: "Pagos",
        Icon: CurrencyDollarIcon
    },
};

const VALID_TABS = ["general", "habitaciones", "archivos", "pagos"];
function GrupoComponent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const params = useParams();
    const id_grupo = params.id || params.id_grupo;
    const [grupo, setGrupo] = useState(null);

    const tabParam = searchParams.get("tab");
    const currentTab = VALID_TABS.includes(tabParam) ? tabParam : "general";
    const ActiveComponent = tabComponents[currentTab];

    const handleTabChange = (tab) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", tab);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    useEffect(() => {
        if (!id_grupo) return;
        grupoService.getGroupInfo(id_grupo)
            .then(setGrupo)
            .catch((err) => console.error("Error al cargar el grupo:", err));
    }, [id_grupo]);

    return (
        <div className="container-fluid p-0">
            <div className="bg-white p-4 shadow-premium" style={{ borderRadius: "8px" }}>
                <div className="d-flex align-items-center gap-1">
                    <h4>Detalles del grupo</h4>
                    <ChevronRightIcon width={18} />
                    <Link href="/grupos" style={{ textDecoration: "none" }}>Listado de grupos</Link>
                </div>
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
                        {ActiveComponent &&
                            <ActiveComponent
                                id_grupo={id_grupo}
                                comision={grupo?.idVentaservicio?.idProveedor?.comision}
                                pagos={grupo?.idVentaservicio?.pagosDetalles}
                                id_venta={grupo?.idVentaservicio?.idVenta?.id_venta}
                            />
                        }
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