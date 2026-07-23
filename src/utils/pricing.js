export function calcularTotalNeto(totalPublico, comisionPct) {
    const publico = Number(totalPublico) || 0;
    const comision = Number(comisionPct) || 0;
    return publico - publico * (comision / 100);
}

export function formatMoney(n) {
    return (Number(n) || 0).toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN",
    });
}