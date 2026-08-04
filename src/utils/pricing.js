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

function calcularResumenHospedaje(data) {
    const comisionPct = Number(data?.providerData?.comision) || 0;
    const fee = Number(data?.fee) || 0;
    const habitaciones = data?.habitaciones || [];

    const { tarifaPublica, totalNeto } = habitaciones.reduce(
        (acc, hab) => {
            const publico = Number(hab.total_publico) || 0;
            acc.tarifaPublica += publico;
            acc.totalNeto += calcularTotalNeto(publico, comisionPct);
            return acc;
        },
        { tarifaPublica: 0, totalNeto: 0 }
    );

    return { tarifaPublica, totalNeto, fee, comisionPct };
}

// export function calcularResumenServicio(item) {
//     switch (item.tipo) {
//         case "hospedaje":
//             return calcularResumenHospedaje(item.data);
//         default:
//             return { tarifaPublica: 0, totalNeto: 0, fee: 0, comisionPct: 0 };
//     }
// }

export function calcularResumenServicio(item) {
    const comisionPct = Number(item.data.providerData?.comision) || 0;
    const fee = Number(item.data.fee) || 0;

    let tarifaPublica = 0;
    if (item.tipo === "hospedaje") {
        tarifaPublica = (item.data.habitaciones || []).reduce(
            (sum, hab) => sum + (Number(hab.total_publico) || 0),
            0
        );
    } else {
        tarifaPublica = Number(item.data.total_publico) || 0;
    }

    const totalNeto = calcularTotalNeto(tarifaPublica, comisionPct);

    return { tarifaPublica, totalNeto, fee };
}