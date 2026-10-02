import { cajaService } from "@/services/caja.service";

export async function enviarComprobantePagoPorCorreo({ pagos, venta, agencia, destinatario }) {
  const [{ pdf }, { default: PagoPDF }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("@/components/pdf/PagoPDF"),
  ]);

  const idVenta = venta?.id_venta;

  if (!idVenta) {
    throw new Error("No se pudo determinar la venta asociada al pago");
  }

  const blob = await pdf(
    <PagoPDF pagos={pagos} venta={venta} agencia={agencia} />
  ).toBlob();

  const nombreArchivo = String(venta?.folio || idVenta).replace(/[^\w-]+/g, "_");

  const formData = new FormData();
  formData.append("id", idVenta);
  formData.append("destinatario", destinatario);
  formData.append("pdf", blob, `recibo-pagos-${nombreArchivo}.pdf`);

  return cajaService.sendInvoicePayment(formData);
}