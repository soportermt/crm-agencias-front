"use client";

import DashboardAdmin from '@/components/common/DashboardAdmin';
import DashboardAgente from '@/components/common/DashboardAgente';
import { dashboardService } from '@/services/dashboard.service';
import { usuariosService } from '@/services/usuarios.service';
import { vendedoresService } from '@/services/vendedores.service';
import React, { useEffect, useState } from 'react'

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [sales, setSales] = useState([]);
    const [vendedores, setVendedores] = useState([]);
    const [vendedoresSolo, setVendedoresSolo] = useState([]);
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

        async function loadVentas() {
            try {
                const data = await dashboardService.getMonthSales();
                setSales(data);
            } catch (error) {
                console.error("Error fetching ventas:", error);
            }
        }

        async function loadVendedores() {
            try {
                const vendedores = await vendedoresService.get();
                setVendedores(vendedores);
            } catch (err) {
                console.error(err);
            }
        }

        fetchUser();
        loadVentas();
        loadVendedores();
    }, []);

    const rol = user?.rol?.toLowerCase();
    
    useEffect(() => {
        if (rol !== "agente" || !user?.id_usuario) return;
    
        async function loadVendedoresSuyos() {
            try {
                const data = await dashboardService.getMonthSales(undefined, user.id_usuario);
                setVendedoresSolo(data);
            } catch (err) {
                console.error(err);
            }
        }
    
        loadVendedoresSuyos();
    }, [user, rol]);

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            {rol === "administrador" && (
                <DashboardAdmin user={user} sales={sales} vendedores={vendedores} />
            )}
            {rol === "agente" && (
                <DashboardAgente user={user} sales={vendedoresSolo} />
            )}
        </div>
    )
}