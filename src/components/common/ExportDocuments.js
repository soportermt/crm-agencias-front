import { exportToCSV, exportToExcel } from '@/utils/exportUtils'
import { CloudArrowDownIcon, DocumentIcon } from '@heroicons/react/24/outline'
import React, { useState } from 'react'

export default function ExportDocuments({
    data = [],
    columns = [],
    filename = "exportacion",
    sheetName = "Datos",
    disabled = false,
}) {
    const [exporting, setExporting] = useState(false);
    const isEmptyArray = Array.isArray(data) && data.length === 0
    const isDisabled = disabled || exporting || isEmptyArray || !columns.length;
    const handleExport = async (exportFn) => {
        try {
            setExporting(true)
            const rows = typeof data === "function" ? await data() : data
            if (!rows?.length) {
                alert("No hay datos para exportar con los filtros actuales.")
                return
            }
            await exportFn({ data: rows, columns, filename, sheetName })
        } catch (err) {
            console.error("Error al exportar:", err)
            alert("No se pudo completar la exportación.")
        } finally {
            setExporting(false)
        }
    }

    return (
        <div className="dropdown">
            <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                disabled={isDisabled}
                style={{ fontSize: 14, padding: 4, backgroundColor: "rgb(231, 241, 254)", color: "rgb(12, 92, 198)", borderColor: "rgb(12, 92, 198)", borderRadius: 8 }}
            >
                <CloudArrowDownIcon style={{ width: "18px", height: "18px", marginRight: 4 }} />
                {exporting ? "Exportando..." : "Exportar"}
            </button>
            <ul className="dropdown-menu" style={{ fontSize: 14 }}>
                <li>
                    <button type="button" className="dropdown-item" onClick={() => handleExport(exportToCSV)}>
                        <DocumentIcon style={{ width: "12px", height: "12px", marginRight: 4 }} /> Csv
                    </button>
                </li>
                <li>
                    <button type="button" className="dropdown-item" onClick={() => handleExport(exportToExcel)}>
                        <DocumentIcon style={{ width: "12px", height: "12px", marginRight: 4 }} /> Excel
                    </button>
                </li>
            </ul>
        </div>
    )
}