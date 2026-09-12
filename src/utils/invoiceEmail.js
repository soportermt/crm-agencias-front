import { pdf } from "@react-pdf/renderer";
import BookingPdf from "@/components/pdf/BookingPdf";
import { bookingService } from "@/services/booking.service";

export async function enviarComprobantePorCorreo(rawVenta, terminos) {
  const blob = await pdf(<BookingPdf venta={rawVenta} terminos={terminos} />).toBlob();

  const formData = new FormData();
  formData.append("id", rawVenta.id_venta);
  formData.append("pdf", blob, `comprobante-${rawVenta.id_venta}.pdf`);

  return bookingService.sendInvoice(formData);
}