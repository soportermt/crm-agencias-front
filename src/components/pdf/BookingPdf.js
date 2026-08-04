import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
    Svg,
    Path,
} from "@react-pdf/renderer";
import "./fonts";

const styles = StyleSheet.create({
    page: {
        padding: 0,
        position: "relative",
        fontFamily: "Inter",
    },
    header: {
        width: 595,
        height: 100,
    },
    headerContent: {
        position: "absolute",
        top: 24,
        left: 32,
        right: 32,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    agencyHeader: {
        flexDirection: "column",
    },
    agencyName: {
        color: "#FFF",
        fontSize: 24,
        fontWeight: 700,
        marginBottom: 2,
    },
    agencyDate: {
        color: "rgba(255,255,255,.85)",
        fontSize: 12,
        fontWeight: 400,
    },
    folioContainer: {
        alignItems: "flex-end",
    },

    folioLabel: {
        color: "rgba(255,255,255,.85)",
        fontSize: 12,
        marginBottom: 6,
    },
    folioBox: {
        backgroundColor: "rgba(255,255,255,.15)",
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 14,
    },
    folio: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: 600,
    },
    content: {
        paddingHorizontal: 32,
        paddingTop: 16,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
        gap: 32
    },
    rowHab: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    titleData: {
        color: "rgba(0, 0, 0, 0.4)",
        fontSize: 9,
        fontWeight: 600,
        textTransform: "uppercase",
        marginBottom: 2
    },
    data: {
        color: "#0F1901",
        fontSize: 11,
        fontWeight: 400,
    },
    title: {
        fontSize: 15,
        color: "#0C5CC6",
        fontWeight: 700,
        textTransform: "uppercase",
    },
    subtitle: {
        fontSize: 12,
        color: "#09489A",
        fontWeight: 600,
        marginBottom: 6
    },
    titleService: {
        fontSize: 13,
        color: "#227CF2",
        fontWeight: 600,
    },
    serviceHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10
    },
    serviceIcon: {
        width: 16,
        height: 16,
        marginRight: 6,
        backgroundColor: "rgba(34, 124, 242, 0.1)",
        borderRadius: 5,
        padding: 4
    },
    headerTable: {
        flexDirection: "row",
        justifyContent: "space-between",
        fontSize: 11,
        fontWeight: 600,
        color: "#FFF",
        backgroundColor: "#0C5CC6",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        marginVertical: 8,
    },
    table: {
        backgroundColor: "rgba(231, 241, 254, 0.8)",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
    },
    tableContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottom: '1px solid #90BDF9',
        fontSize: 10,
        paddingBottom: 6,
        marginBottom: 4
    },
    conditions: {
        fontStyle: "italic",
        fontWeight: 500,
        fontSize: 8,
        color: "rgba(0, 0, 0, 0.4)",
        textAlign: "center",
        marginTop: 16
    },
    footer: {
        position: "absolute",
        bottom: 16,
        left: 32,
        right: 32,
        borderTopWidth: 0.5,
        borderTopColor: "#90BDF9",
        paddingTop: 8,
        flexDirection: "column",
        fontSize: 8,
        color: "#666",
    },
    agency: {
        flexDirection: "row",
        justifyContent: "space-between",
        color: "rgba(64, 64, 64, 0.8)",
        fontWeight: 500
    },
    agencyFooter: {
        width: 150,
        height: 40
    },
    agencyInfo: {
        flexDirection: "row",
        gap: 4,
        alignItems: "center"
    },
    agencyIcon: {
        width: 10,
        height: 10
    },
    agencyContainer: {
        flexDirection: "column",
        gap: 3
    }
});

const TIPO_HOSPEDAJE = "1";
const TIPO_TRASLADO = "2";

function parseDesglose(servicio) {
    if (!servicio?.desglose) return {};
    return typeof servicio.desglose === "string"
        ? JSON.parse(servicio.desglose)
        : servicio.desglose;
}

function parseLocalDate(dateString) {
    if (!dateString || dateString === "0000-00-00") return null;

    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
}

function formatShortDate(date) {
    const d = parseLocalDate(date);

    if (!d) return "-";

    return d
        .toLocaleDateString("es-MX", {
            day: "numeric",
            month: "short",
            year: "numeric",
        })
        .replace(".", "");
}

export default function BookingPdf({ venta }) {
    const servicios = (venta.ventasServicioses || []).map((s) => ({
        ...s,
        desglose: parseDesglose(s),
    }));

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Image
                    src="/pdf/header-pdf.png"
                    style={styles.header}
                />
                <View style={styles.headerContent}>
                    <View style={styles.agencyHeader}>
                        <Text style={styles.agencyName}>
                            Demo Travel
                        </Text>

                        <Text style={styles.agencyDate}>
                            {formatShortDate(venta.fecha)}
                        </Text>
                    </View>
                    <View style={styles.folioContainer}>
                        <Text style={styles.folioLabel}>Folio</Text>

                        <View style={styles.folioBox}>
                            <Text style={styles.folio}>
                                #{venta.folio}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.content}>
                    <View style={styles.row}>
                        <View style={{ width: "100%" }}>
                            <Text style={styles.titleData}>Fecha límite de pago</Text>
                            <Text style={styles.data}>05 jul 2026</Text>
                        </View>

                        <View style={{ width: "100%" }}>
                            <Text style={styles.titleData}>Fecha de reservación</Text>
                            <Text style={styles.data}>{formatShortDate(venta.fecha)}</Text>
                        </View>
                    </View>
                    <Text style={styles.title}>Descripción de servicios</Text>

                    {/* servicios: uno o más, hospedaje y/o traslado */}
                    {servicios.map((servicio, idx) => {
                        const esHospedaje = String(servicio.id_tipo_servicio) === TIPO_HOSPEDAJE;
                        const esTraslado = String(servicio.id_tipo_servicio) === TIPO_TRASLADO;
                        const d = servicio.desglose;

                        return (
                            <View key={servicio.id_ventaservicio ?? idx}>
                                {esHospedaje && (
                                    <>
                                        <View style={styles.serviceHeader}>
                                            <Image
                                                src="/pdf/bed.png"
                                                style={styles.serviceIcon}
                                            />
                                            <Text style={styles.titleService}>
                                                Hotel
                                            </Text>
                                        </View>
                                        <View style={styles.row}>
                                            <View style={{ width: "100%" }}>
                                                <Text style={styles.titleData}>Nombre</Text>
                                                <Text style={styles.data}>{d.hotel}</Text>
                                            </View>

                                            <View style={{ width: "100%" }}>
                                                <Text style={styles.titleData}>Destino</Text>
                                                <Text style={styles.data}>{d.destino}</Text>
                                            </View>

                                            <View style={{ width: "100%" }}>
                                                <Text style={styles.titleData}>Fecha de servicio</Text>
                                                <Text style={styles.data}>
                                                    {formatShortDate(servicio.inicio_servicio)}
                                                    {servicio.fin_servicio &&
                                                        servicio.fin_servicio !== "0000-00-00" &&
                                                        ` - ${formatShortDate(servicio.fin_servicio)}`}
                                                </Text>
                                            </View>
                                        </View>

                                        <Text style={styles.subtitle}>Habitaciones</Text>

                                        {(d.habitaciones || []).map((habitacion, index) => (
                                            <View key={index} style={styles.rowHab}>
                                                <View style={{ width: "10%" }}>
                                                    <Text style={styles.titleData}>No. Hab.</Text>
                                                    <Text style={styles.data}>{index + 1}</Text>
                                                </View>

                                                <View style={{ width: "30%" }}>
                                                    <Text style={styles.titleData}>Ocupación</Text>
                                                    <Text style={styles.data}>{habitacion.ocupacion}</Text>
                                                </View>

                                                <View style={{ width: "20%" }}>
                                                    <Text style={styles.titleData}>Tipo de cama</Text>
                                                    <Text style={styles.data}>{habitacion.tipo_cama}</Text>
                                                </View>

                                                <View style={{ width: "20%" }}>
                                                    <Text style={styles.titleData}>Tipo de habitación</Text>
                                                    <Text style={styles.data}>{habitacion.tipo_habitacion}</Text>
                                                </View>

                                                <View style={{ width: "20%" }}>
                                                    <Text style={styles.titleData}>Plan</Text>
                                                    <Text style={styles.data}>{habitacion.plan?.toUpperCase()}</Text>
                                                </View>
                                            </View>
                                        ))}

                                        <Text style={[styles.title, { marginVertical: 8 }]}>Datos de pasajeros</Text>

                                        {(d.habitaciones || []).map((hab, habIndex) => (
                                            <View key={habIndex}>
                                                {hab.pasajeros?.adultos?.map((pasajero, pIndex) => (
                                                    <View key={`adulto-${habIndex}-${pIndex}`} style={styles.rowHab}>
                                                        <View style={{ width: "35%" }}>
                                                            <Text style={styles.titleData}>Nombre Pasajero</Text>
                                                            <Text style={styles.data}>
                                                                {`${pasajero.nombre} ${pasajero.apellidos}`}
                                                            </Text>
                                                        </View>

                                                        <View style={{ width: "20%" }}>
                                                            <Text style={styles.titleData}>Tipo Pasajero</Text>
                                                            <Text style={styles.data}>Adulto</Text>
                                                        </View>

                                                        <View style={{ width: "25%" }}>
                                                            <Text style={styles.titleData}>Habitación</Text>
                                                            <Text style={styles.data}>{hab.tipo_habitacion}</Text>
                                                        </View>
                                                    </View>
                                                ))}

                                                {hab.pasajeros?.menores?.map((pasajero, pIndex) => (
                                                    <View key={`menor-${habIndex}-${pIndex}`} style={styles.rowHab}>
                                                        <View style={{ width: "35%" }}>
                                                            <Text style={styles.titleData}>Nombre Pasajero</Text>
                                                            <Text style={styles.data}>
                                                                {`${pasajero.nombre} ${pasajero.apellidos}`}
                                                            </Text>
                                                        </View>

                                                        <View style={{ width: "20%" }}>
                                                            <Text style={styles.titleData}>Tipo Pasajero</Text>
                                                            <Text style={styles.data}>Menor</Text>
                                                        </View>

                                                        <View style={{ width: "20%" }}>
                                                            <Text style={styles.titleData}>Edad</Text>
                                                            <Text style={styles.data}>{pasajero.edad}</Text>
                                                        </View>

                                                        <View style={{ width: "25%" }}>
                                                            <Text style={styles.titleData}>Habitación</Text>
                                                            <Text style={styles.data}>{hab.tipo_habitacion}</Text>
                                                        </View>
                                                    </View>
                                                ))}
                                            </View>
                                        ))}
                                    </>
                                )}

                                {esTraslado && (
                                    <>
                                        <View style={styles.serviceHeader}>
                                            <Image
                                                src="/pdf/van.png"
                                                style={[styles.serviceIcon, { backgroundColor: "rgba(117, 191, 6, 0.1)" }]}
                                            />
                                            <Text style={[styles.titleService, { color: "#75BF06" }]}>
                                                Traslado
                                            </Text>
                                        </View>

                                        <View style={styles.row}>
                                            <View style={{ width: "100%" }}>
                                                <Text style={styles.titleData}>Origen</Text>
                                                <Text style={styles.data}>{d.origen}</Text>
                                            </View>

                                            <View style={{ width: "100%" }}>
                                                <Text style={styles.titleData}>Destino</Text>
                                                <Text style={styles.data}>{d.destino}</Text>
                                            </View>

                                            <View style={{ width: "100%" }}>
                                                <Text style={styles.titleData}>Fecha de servicio</Text>
                                                <Text style={styles.data}>
                                                {formatShortDate(servicio.inicio_servicio)}
                                                    {servicio.fin_servicio &&
                                                        servicio.fin_servicio !== "0000-00-00" &&
                                                        ` - ${formatShortDate(servicio.fin_servicio)}`}
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={styles.row}>
                                            <View style={{ width: "100%" }}>
                                                <Text style={styles.titleData}>Salida origen</Text>
                                                <Text style={styles.data}>{d.salida_origen || "-"}</Text>
                                            </View>

                                            {!!Number(d.redondo) && (
                                                <>
                                                    <View style={{ width: "100%" }}>
                                                        <Text style={styles.titleData}>Llegada destino</Text>
                                                        <Text style={styles.data}>{d.llegada_destino || "-"}</Text>
                                                    </View>

                                                    <View style={{ width: "100%" }}>
                                                        <Text style={styles.titleData}>Salida destino</Text>
                                                        <Text style={styles.data}>{d.salida_destino || "-"}</Text>
                                                    </View>
                                                </>
                                            )}
                                        </View>

                                        {!!Number(d.redondo) && (
                                            <View style={styles.row}>
                                                <View style={{ width: "100%" }}>
                                                    <Text style={styles.titleData}>Llegada origen</Text>
                                                    <Text style={styles.data}>{d.llegada_origen || "-"}</Text>
                                                </View>
                                                <View style={{ width: "100%" }}>
                                                    <Text style={styles.titleData}>Recogida hotel</Text>
                                                    <Text style={styles.data}>{d.recogida_hotel || "-"}</Text>
                                                </View>
                                                <View style={{ width: "100%" }} />
                                            </View>
                                        )}

                                        <Text style={[styles.title, { marginVertical: 8 }]}>Datos de pasajeros</Text>

                                        {d.pasajeros?.adultos?.map((pasajero, pIndex) => (
                                            <View key={`adulto-${pIndex}`} style={styles.rowHab}>
                                                <View style={{ width: "50%" }}>
                                                    <Text style={styles.titleData}>Nombre Pasajero</Text>
                                                    <Text style={styles.data}>
                                                        {`${pasajero.nombre} ${pasajero.apellidos}`}
                                                    </Text>
                                                </View>

                                                <View style={{ width: "30%" }}>
                                                    <Text style={styles.titleData}>Tipo Pasajero</Text>
                                                    <Text style={styles.data}>Adulto</Text>
                                                </View>
                                            </View>
                                        ))}

                                        {d.pasajeros?.menores?.map((pasajero, pIndex) => (
                                            <View key={`menor-${pIndex}`} style={styles.rowHab}>
                                                <View style={{ width: "50%" }}>
                                                    <Text style={styles.titleData}>Nombre Pasajero</Text>
                                                    <Text style={styles.data}>
                                                        {`${pasajero.nombre} ${pasajero.apellidos}`}
                                                    </Text>
                                                </View>

                                                <View style={{ width: "30%" }}>
                                                    <Text style={styles.titleData}>Tipo Pasajero</Text>
                                                    <Text style={styles.data}>Menor</Text>
                                                </View>

                                                <View style={{ width: "20%" }}>
                                                    <Text style={styles.titleData}>Edad</Text>
                                                    <Text style={styles.data}>{pasajero.edad}</Text>
                                                </View>
                                            </View>
                                        ))}
                                    </>
                                )}
                            </View>
                        );
                    })}

                    {/* <Text style={[styles.title, { marginVertical: 8 }]}>Desglose de pagos</Text>

                    <View style={styles.headerTable}>
                        <View style={{ borderRightColor: "#fff", flex: 1, borderRightWidth: 1, }}><Text>Fecha</Text></View>
                        <View style={{ flex: 1, textAlign: "right" }}><Text>Monto</Text></View>
                    </View>

                    <View style={styles.table}>
                        <View style={styles.tableContent}>
                            <View style={{ borderRightColor: "#90BDF9", flex: 1, borderRightWidth: 1, }}>
                                <Text style={{ fontWeight: 500 }}>17 jun 2026</Text>
                            </View>
                            <View style={{ flex: 1, textAlign: "right" }}>
                                <Text style={{ fontSize: 12, fontWeight: 600 }}>$ 3,475.00</Text>
                            </View>
                        </View>
                        <View style={styles.tableContent}>
                            <View style={{ borderRightColor: "#90BDF9", flex: 1, borderRightWidth: 1, }}>
                                <Text style={{ fontWeight: 500 }}>24 jun 2026</Text>
                            </View>
                            <View style={{ flex: 1, textAlign: "right" }}>
                                <Text style={{ fontSize: 12, fontWeight: 600 }}>$ 3,475.00</Text>
                            </View>
                        </View>
                    </View> */}

                    <Text style={styles.conditions}>NOTA: EL CLIENTE ACEPTA LAS CONDICIONES Y POLÍTICAS DE CANCELACIÓN Y ACLARACIONES DE ESTA AGENCIA Y/O DEL OPERADOR. CUALQUIER CAMBIO O CANCELACIÓN GENERARÁ UN CARGO MÍNIMO POR PASAJERO.</Text>
                </View>


                <View style={styles.content}>
                    <View style={styles.row}>
                        <View style={{ width: "100%" }}>
                            <Text style={styles.titleData}>Términos y condiciones</Text>
                            <Text style={{ fontSize: 8, fontStyle: "italic", fontWeight: 400, color: "rgba(64, 64, 64, 0.8)" }}>Nuestros términos...</Text>
                        </View>
                    </View>
                </View>


                <View style={styles.footer} fixed>
                    <View style={styles.agency}>
                        <View style={styles.agencyContainer}>
                            <View style={styles.agencyInfo}>
                                <Image src="/pdf/location.png" style={styles.agencyIcon} />
                                <Text>Calle 3 # 236 depto. 1 entre 20 y 22 Col. García Ginerés</Text></View>
                            <View style={styles.agencyInfo}>
                                <Image src="/pdf/email.png" style={styles.agencyIcon} />
                                <Text>soporte@2businesstravel.com</Text>
                            </View>
                            <View style={styles.agencyInfo}>
                                <Image src="/pdf/phone-call.png" style={styles.agencyIcon} />
                                <Text>(999) 636-8720</Text>
                            </View>
                        </View>
                        <Image
                            src="https://dummyimage.com/150x40/e8e8e8/ffffff"
                            style={styles.agencyFooter}
                        />
                    </View>
                    <Text
                        style={{ width: "100%", textAlign: "center" }}
                        render={({ pageNumber, totalPages }) =>
                            `Página ${pageNumber} de ${totalPages}`
                        }
                    />
                </View>
            </Page>
        </Document>
    );
}