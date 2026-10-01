import { cajaService } from "@/services/caja.service";

export async function enviarComprobantePagoPorCorreo(pago, agencia, destinatario) {
  const [{ pdf }, { default: PagoPDF }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("@/components/pdf/PagoPDF"),
  ]);

  const blob = await pdf(<PagoPDF pago={pago} agencia={agencia} />).toBlob();

  const idVenta = pago?.pagosDetalles?.[0]?.idVentaservicio?.idVenta?.id_venta;

  if (!idVenta) {
    throw new Error("No se pudo determinar la venta asociada al pago");
  }

  const formData = new FormData();
  formData.append("id", idVenta);
  formData.append("destinatario", destinatario);
  formData.append("pdf", blob, `comprobante-pago-${pago.id_pago}.pdf`);

  return cajaService.sendInvoicePayment(formData);
}