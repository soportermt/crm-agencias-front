export async function downloadPagoPDF(pago, agencia) {
    const [{ pdf }, { default: PagoPDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/pdf/PagoPDF"),
    ]);

    const blob = await pdf(<PagoPDF pago={pago} agencia={agencia} />).toBlob();

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pago-${pago.id_pago}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}