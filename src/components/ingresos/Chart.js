import React from 'react'
import IncomeChart from './IncomeChart'
import StatCard from '../common/StatCard'
import { ingresosMetricsMock } from '@/mocks/ingresosMock'

export default function Chart({chart}) {
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
                                    Total ingresos <span className="fw-semibold">mayo</span>
                                </>
                            }
                            value={ingresosMetricsMock.totalIngresos.value}
                            subtext={ingresosMetricsMock.totalIngresos.subtext}
                            valueColor="#227cf2"
                        />
                    </div>
                    <div className="col-6">
                        <StatCard
                            title="Pendientes de pago"
                            value={ingresosMetricsMock.pendientesPago.value}
                            subtext={ingresosMetricsMock.pendientesPago.subtext}
                            valueColor="#b9861f"
                        />
                    </div>
                    <div className="col-6">
                        <StatCard
                            title="Vencidos"
                            value={ingresosMetricsMock.vencidos.value}
                            linkText="Ver detalles"
                            valueColor="#af233a"
                        />
                    </div>
                    <div className="col-6">
                        <StatCard
                            title={
                                <>
                                    Pagados <span className="fw-semibold">este mes</span>
                                </>
                            }
                            value={ingresosMetricsMock.pagadosEsteMes.value}
                            subtext={ingresosMetricsMock.pagadosEsteMes.subtext}
                            valueColor="#0e803c"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
