import React from 'react'
import IncomeChart from './IncomeChart'
import StatCard from '../common/StatCard'
import { ingresosMetricsMock } from '@/mocks/ingresosMock'

export default function Chart({ chart, resumen }) {
    const formatCurrency = (value) => {
        if (value == null || isNaN(value)) return "$0.00";
        return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
        }).format(value);
    };

    return (
        <div className="d-flex gap-4" style={{ flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 0", minWidth: "300px" }}>
                <IncomeChart
                    data={chart}
                    onExport={() => console.log("Exportar PDF")}
                />
            </div>

            <div style={{ flex: "1 1 0", minWidth: "300px" }}>
                <div className="row g-4 h-100">
                    <div className="col-6">
                        <StatCard
                            title={
                                <>
                                    Total ingresos en <span className="fw-semibold">{resumen?.mes}</span>
                                </>
                            }
                            value={formatCurrency(resumen?.total_ingresos)}
                            valueColor="#227cf2"
                            dashboard
                        />
                    </div>
                    <div className="col-6">
                        <StatCard
                            title="Pendientes de pago"
                            subtext={
                                <>
                                    {resumen?.pendientes_pago} pagos pendientes
                                </>
                            }
                            value={formatCurrency(resumen?.total_pendientes_pago)}
                            valueColor="#b9861f"
                        />
                    </div>
                    <div className="col-6">
                        <StatCard
                            title="Vencidos"
                            value={formatCurrency(resumen?.total_vencidos)}
                            valueColor="#af233a"
                            subtext={
                                <>
                                    {resumen?.vencidos} pagos vencidos
                                </>
                            }
                        />
                    </div>
                    <div className="col-6">
                        <StatCard
                            title={
                                <>
                                    Pagados <span className="fw-semibold">este mes</span>
                                </>
                            }
                            value={formatCurrency(resumen?.total_pagados_mes)}
                            valueColor="#0e803c"
                            subtext={
                                <>
                                    {resumen?.pagados_mes} pagados este mes
                                </>
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
