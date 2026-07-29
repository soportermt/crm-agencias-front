"use client";

import { pdf } from "@react-pdf/renderer";
import BookingPdf from "./BookingPdf";
import Link from "next/link";

export default function PdfViewer({ venta }) {
  const handleOpen = async () => {
    const blob = await pdf(
      <BookingPdf
        venta={venta}
      />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  
  // const handleOpen = async () => {
  //   const blob = await pdf(
  //     <BookingPdf venta={venta} />
  //   ).toBlob();
  //   const url = URL.createObjectURL(blob);

  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = `Reserva-${venta.folio}.pdf`;
  //   a.click();
    
  //   URL.revokeObjectURL(url);
  // };

  return (
    <Link
      href="#"
      onClick={(e) => {
        e.preventDefault();
        handleOpen();
      }}
      className="font-inter fw-semibold text-brand-blue"
      style={{ textDecoration: "none" }}
    >
      {venta.folio}
    </Link>
  );
}