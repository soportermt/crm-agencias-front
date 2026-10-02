export async function downloadPagoPDF({ pagos, venta, agencia }) {
    const [{ pdf }, { default: PagoPDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/pdf/PagoPDF"),
    ]);

    const blob = await pdf(
        <PagoPDF pagos={pagos} venta={venta} agencia={agencia} />
    ).toBlob();

    const nombreArchivo = String(venta?.folio || venta?.id_venta || "venta")
        .replace(/[^\w-]+/g, "_");

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `recibo-pagos-${nombreArchivo}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}