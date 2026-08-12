"use client";

import { pdf } from "@react-pdf/renderer";
import BookingPdf from "./BookingPdf";

export default function PdfViewer({ venta }) {

    const handleDownload = async () => {

        if (!venta) {
            console.error("No hay información de la venta");
            return;
        }

        console.log("VENTA PARA PDF:", venta);

        const blob = await pdf(
            <BookingPdf venta={venta} />
        ).toBlob();

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `Reserva-${venta.folio}.pdf`;

        document.body.appendChild(a);
        a.click();
        a.remove();

        URL.revokeObjectURL(url);
    };

    return (
        <button
            type="button"
            className="btn btn-outline-primary w-100 mt-2"
            onClick={handleDownload}
        >
            Descargar comprobante
        </button>
    );
}