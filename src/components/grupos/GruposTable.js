import React, { useState } from 'react'
import DataTable from '../common/DataTable'

const columns = [
    { key: "folio", label: "Folio", width: "110px" },
    { key: "titulo_evento", label: "Titulo del evento", width: "150px" },
    { key: "pasajero_titular", label: "Pasajero titular", width: "150px" },
    { key: "num_habitaciones", label: "Habs.", width: "80px" },
    { key: "noches", label: "Noches", width: "80px" },
    { key: "hotel", label: "Hotel", width: "150px" },
    { key: "tipo_habitacion", label: "Tipo de habitación", align: "end", width: "100px" },
    { key: "acciones", label: "Acciones", width: "80px", align: "center" },
];

export default function GruposTable({ data = [] }) {
    const [currentPage, setCurrentPage] = useState(1);

    const renderCell = (key, row) => {
        switch (key) {
            case "folio":
                return <span className="font-inter fw-semibold">{row.idVentaservicio?.idVenta?.folio}</span>;
            case "pasajero_titular":
                return <span className="font-inter fw-semibold">{row.idVentaservicio?.idVenta?.pasajero_titular}</span>;

            default:
                return row[key];
        }
    };

    return (
        <div className='mt-4'>
            <DataTable
                columns={columns}
                data={data}
                renderCell={renderCell}
                pagination
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                emptyMessage="No se encontraron resultados"
                minWidth="1100px"
            />
        </div>
    )
}
