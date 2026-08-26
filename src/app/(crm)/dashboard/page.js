"use client";

import DashboardAdmin from '@/components/common/DashboardAdmin';
import DashboardAgente from '@/components/common/DashboardAgente';
import { usuariosService } from '@/services/usuarios.service';
import React, { useEffect, useState } from 'react'

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await usuariosService.getCurrentUser();
                if (Array.isArray(data) && data.length > 0) {
                    setUser(data[0]);
                } else if (data && !Array.isArray(data)) {
                    setUser(data);
                }
            } catch (error) {
                console.error("Error fetching current user:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const rol = user?.rol?.toLowerCase();

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            {rol === "administrador" && (
                <DashboardAdmin/>
            )}
            {rol === "agente" && (
                <DashboardAgente/>
            )}
        </div>
    )
}