import React from "react";
import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";

Font.register({
    family: "Inter",
    fonts: [
        { src: "/fonts/Inter-Regular.ttf", fontWeight: 400 },
        { src: "/fonts/Inter-SemiBold.ttf", fontWeight: 700 },
    ],
});

const money = (v) =>
    Number(v || 0).toLocaleString("es-MX", { style: "currency", currency: "MXN" });

const fecha = (d, vacio = "-") => {
    if (!d || String(d).startsWith("0000-00-00")) return vacio;

    const date = new Date(d);
    if (isNaN(date.getTime())) return vacio;

    return date.toLocaleDateString("es-MX", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    });
};

const conceptoVenta = (venta) =>
    (venta?.ventasServicioses || [])
        .map((s) => (s.descripcion || "").trim() || s.idTipoServicio?.tipo_servicio || "")
        .filter(Boolean)
        .join(", ");

const styles = StyleSheet.create({
    page: { padding: "32", fontSize: 9, fontFamily: "Inter", color: "#1f1f1f" },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    agencyImage: { width: 75, height: 75 },
    table: { borderWidth: 1, borderColor: "#fff", borderRadius: 6, },
    thead: { flexDirection: "row", backgroundColor: "rgb(12, 92, 198)", padding: 2, color: "#fff", fontWeight: 700 },
    tr: { flexDirection: "row", padding: 4, borderBottomWidth: 0.5, borderBottomColor: "#EBE9F1" },
    trTotal: { flexDirection: "row", padding: 4, marginTop: 4, borderTopWidth: 1, borderTopColor: "rgb(12, 92, 198)" },
    cNum: { width: "8%", textAlign: "center" },
    cFecha: { width: "17%" },
    cForma: { width: "20%" },
    cDesc: { width: "35%" },
    cMonto: { width: "20%", textAlign: "right" },
    resumenWrap: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginTop: 10
    },
    resumen: {
        width: "40%",
        marginLeft: "auto",
    },
    resumenRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 3,
        padding: 4,
    },
    resumenRowSaldo: {
        marginTop: 2,
        paddingTop: 5,
        borderTopWidth: 1,
        borderTopColor: "rgb(12, 92, 198)",
    },
    resumenLabel: { fontWeight: 700 },
    resumenValue: { fontWeight: 700, textAlign: "right" },
    limiteBox: {
        paddingVertical: 6,
        paddingHorizontal: 8,
        backgroundColor: "#FFF5F5",
        borderRadius: 4,
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginBottom: 2
    },
    limiteLabel: {
        // textTransform: "uppercase",
    },
    limiteValue: {
        // marginTop: 2,
        // fontSize: 12,
        fontWeight: 700,
        color: "#FF0000",
    },
});

const totalDePago = (pago) =>
    (pago?.pagosDetalles || []).reduce((acc, d) => acc + Number(d.monto || 0), 0);

export default function PagoPDF({ pagos = [], venta, agencia }) {
    const activos = pagos
        .filter((p) => String(p.estatus) === "1")
        .sort((a, b) => Number(a.id_pago) - Number(b.id_pago));

    const cliente = venta?.idCliente;
    const total = activos.reduce((acc, p) => acc + totalDePago(p), 0);
    const granTotal = (venta?.ventasServicioses || []).reduce(
        (acc, s) => acc + Number(s.tarifa_publica || 0),
        0
    );
    const saldoPendiente = Math.max(0, Number((granTotal - total).toFixed(2)));

    const concepto = conceptoVenta(venta);

    return (
        <Document title={`recibo_pagos-${venta?.folio || venta?.id_venta}`}>
            <Page size="A4" style={styles.page}>
                <Text style={{ fontWeight: 700, textAlign: "center", fontSize: 12 }}>
                    RECIBO DE PAGOS
                </Text>
                <View style={styles.header}>
                    <View>
                        <Image
                            src={
                                agencia?.logotipo
                                    ? `${process.env.NEXT_PUBLIC_API_URL}images/agencia/${agencia?.logotipo}`
                                    : "/pdf/logo-placeholder.png"
                            }
                            style={styles.agencyImage}
                        />
                    </View>
                    <View style={{ width: "50%", textAlign: "center", textTransform: "uppercase"}}>
                        <Text style={{ fontWeight: 700 }}>{agencia?.nombre_comercial}</Text>
                        <Text>{agencia?.direccion}</Text>
                    </View>
                    <View style={{ textAlign: "center" }}>
                        <Text style={{ fontWeight: 700, marginBottom: 2 }}>FOLIO DE VENTA</Text>
                        <Text style={{ color: "#FF0000", fontSize: 11, fontWeight: 700 }}>{venta?.folio}</Text>
                    </View>
                </View>


                <View style={[styles.header, { marginBottom: 4 }]}>
                    <Text style={{ fontWeight: 700 }}>
                        FECHA DE RECIBO: <Text style={{ fontWeight: 400 }}>{fecha(new Date().toISOString())}</Text>
                    </Text>
                </View>

                {concepto ? (
                    <View style={[styles.header, { marginBottom: 4 }]}>
                        <Text style={{ fontWeight: 700 }}>
                            CONCEPTO: <Text style={{ fontWeight: 400 }}>{concepto}</Text>
                        </Text>
                    </View>
                ) : null}

                <View style={[styles.header, { marginBottom: 5 }]}>
                    <View>
                        <Text style={{ fontWeight: 700 }}>
                            CLIENTE: <Text style={{ fontWeight: 400 }}>{cliente?.nombre}</Text>
                        </Text>
                    </View>
                    <View>
                        <Text style={{ fontWeight: 700 }}>
                            VENDEDOR: <Text style={{ fontWeight: 400 }}>{activos[0]?.nombre_vendedor}</Text>
                        </Text>
                    </View>
                </View>


                <View style={{ margin: "8 0" }}>
                    <View style={styles.table}>
                        <View style={[styles.thead, { textTransform: "uppercase" }]}>
                            <Text style={styles.cNum}>#</Text>
                            <Text style={styles.cFecha}>Fecha</Text>
                            <Text style={styles.cForma}>Forma de pago</Text>
                            <Text style={styles.cDesc}>Descripción</Text>
                            <Text style={styles.cMonto}>Monto</Text>
                        </View>

                        {activos.map((p, i) => (
                            <View key={p.id_pago} style={styles.tr} wrap={false}>
                                <Text style={styles.cNum}>{i + 1}</Text>
                                <Text style={styles.cFecha}>{fecha(p.fecha)}</Text>
                                <Text style={styles.cForma}>{p.idFormaPago?.descripcion || "—"}</Text>
                                <Text style={styles.cDesc}>{p.descripcion || "—"}</Text>
                                <Text style={styles.cMonto}>{money(totalDePago(p))}</Text>
                            </View>
                        ))}

                        <View style={styles.resumenWrap} wrap={false}>
                            <View style={styles.limiteBox}>
                                <Text style={styles.limiteLabel}>Fecha límite de pago</Text>
                                <Text style={styles.limiteValue}> {fecha(venta?.limite_cancelacion, "Sin fecha límite")}</Text>
                            </View>
                            <View style={styles.resumen}>
                                <View style={[styles.resumenRow, { borderBottomWidth: 0.5, borderBottomColor: "#EBE9F1" }]}>
                                    <Text style={styles.resumenLabel}>Total venta:</Text>
                                    <Text style={styles.resumenValue}>{money(granTotal)}</Text>
                                </View>
                                <View style={styles.resumenRow}>
                                    <Text style={styles.resumenLabel}>Total en pagos:</Text>
                                    <Text style={[styles.resumenValue, { color: "rgb(12, 92, 198)" }]}>{money(total)}</Text>
                                </View>
                                <View style={[styles.resumenRow, styles.resumenRowSaldo]}>
                                    <Text style={styles.resumenLabel}>Saldo a pagar:</Text>
                                    <Text
                                        style={[
                                            styles.resumenValue,
                                            { fontSize: 11, color: saldoPendiente > 0 ? "#FF0000" : "#28C76F" },
                                        ]}
                                    >
                                        {money(saldoPendiente)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {venta?.terminos_pagos ? (
                    <View style={{ marginTop: 8 }}>
                        <Text style={{ fontWeight: 700 }}>
                            NOTA IMPORTANTE: <Text style={{ fontWeight: 400 }}>{venta.terminos_pagos}</Text>
                        </Text>
                    </View>
                ) : null}
            </Page>
        </Document>
    );
}