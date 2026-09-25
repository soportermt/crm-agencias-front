import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: { padding: 32, fontSize: 10, fontFamily: "Helvetica", color: "#1f1f1f" },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        // borderBottomWidth: 2,
        // borderBottomColor: "#0C5CC6",
        paddingBottom: 10,
        marginBottom: 8,
    },
    title: { fontSize: 18, fontWeight: 700, color: "#0C5CC6" },
    muted: { color: "#6E6B7B" },
    label: { color: "#5E5873", fontWeight: 700 },
    row: { flexDirection: "row", marginBottom: 3 },
    labelCol: { width: 90, color: "#5E5873" },
    value: { flex: 1 },
    section: { marginBottom: 16 },
    sectionTitle: { fontSize: 11, fontWeight: 700, marginBottom: 6 },
    twoCols: { flexDirection: "row", gap: 24 },
    col: { flex: 1, minWidth: 0 },
    table: { borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 4 },
    thead: { flexDirection: "row", backgroundColor: "#F5F8FF", padding: 6 },
    tr: { flexDirection: "row", padding: 6, borderTopWidth: 1, borderTopColor: "#EEE" },
    cServicio: { width: "30%" },
    cProveedor: { width: "25%" },
    cDesc: { width: "25%" },
    cMonto: { width: "20%", textAlign: "right" },
    totalBox: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 10,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: "#0C5CC6",
    },
    totalLabel: { fontSize: 12, fontWeight: 700, marginRight: 12 },
    totalValue: { fontSize: 12, fontWeight: 700, color: "#28C76F" },
    footer: {
        position: "absolute",
        bottom: 20,
        left: 32,
        right: 32,
        textAlign: "center",
        fontSize: 8,
        color: "#999",
    },
});

const money = (v) =>
    Number(v || 0).toLocaleString("es-MX", { style: "currency", currency: "MXN" });

const fecha = (d) =>
    d
        ? new Date(d).toLocaleDateString("es-MX", {
            day: "numeric",
            month: "short",
            year: "numeric",
            timeZone: "UTC",
        })
        : "-";

const Field = ({ label, value }) => (
    <View style={styles.row}>
        <Text style={styles.labelCol}>{label}</Text>
        <Text style={styles.value}>{value || "—"}</Text>
    </View>
);

export default function PagoPDF({ pago, agencia }) {
    const detalles = pago?.pagosDetalles || [];
    const venta = detalles[0]?.idVentaservicio?.idVenta;
    const cliente = venta?.idCliente;
    const total = detalles.reduce((acc, d) => acc + Number(d.monto || 0), 0);

    return (
        <Document title={`Pago-${pago?.id_pago}`}>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Comprobante de pago</Text>
                    </View>
                    <View style={{ textAlign: "right" }}>
                        <Text>
                            <Text style={styles.label}>Folio: </Text>
                            {venta?.folio}
                        </Text>
                        <Text>
                            <Text style={styles.label}>Fecha de pago: </Text>
                            {fecha(pago?.fecha)}
                        </Text>
                    </View>
                </View>

                {/* Agencia / Cliente */}
                <View style={[styles.section, styles.twoCols]}>
                    <View style={styles.col}>
                        <Text style={styles.sectionTitle}>Información de la agencia</Text>
                        <Field label="Nombre:" value={agencia?.nombre_comercial} />
                        <Field label="Dirección:" value={agencia?.direccion} />
                        <Field label="Correo:" value={agencia?.correo} />
                        <Field label="Teléfono:" value={agencia?.telefono} />
                    </View>
                    <View style={styles.col}>
                        <Text style={styles.sectionTitle}>Información del cliente</Text>
                        <Field label="Nombre:" value={cliente?.nombre} />
                        <Field label="Teléfono:" value={cliente?.telefono} />
                        <Field label="Correo:" value={cliente?.correo} />
                    </View>
                </View>

                {/* Datos del pago */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Datos del pago</Text>
                    <Field label="Forma de pago:" value={pago?.idFormaPago?.descripcion} />
                    <Field label="Observaciones:" value={pago?.descripcion} />
                </View>

                {/* Detalle */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Servicios pagados</Text>
                    <View style={styles.table}>
                        <View style={styles.thead}>
                            <Text style={[styles.cServicio, styles.label]}>Servicio</Text>
                            <Text style={[styles.cProveedor, styles.label]}>Código</Text>
                            <Text style={[styles.cDesc, styles.label]}>Descripción</Text>
                            <Text style={[styles.cMonto, styles.label]}>Monto</Text>
                        </View>

                        {detalles.map((d) => (
                            <View key={d.id_pago_detalle} style={styles.tr} wrap={false}>
                                <Text style={styles.cServicio}>
                                    {d.idVentaservicio?.descripcion ||
                                        "—"}
                                </Text>
                                <Text style={styles.cProveedor}>
                                    {d.idVentaservicio?.codigo || "—"}
                                </Text>
                                <Text style={styles.cDesc}>
                                    {d.idVentaservicio?.descripcion || "—"}
                                </Text>
                                <Text style={styles.cMonto}>{money(d.monto)}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.totalBox}>
                        <Text style={styles.totalLabel}>Total pagado:</Text>
                        <Text style={styles.totalValue}>{money(total)}</Text>
                    </View>
                </View>

                <Text
                    style={styles.footer}
                    render={({ pageNumber, totalPages }) =>
                        `Página ${pageNumber} de ${totalPages}`
                    }
                    fixed
                />
            </Page>
        </Document>
    );
}