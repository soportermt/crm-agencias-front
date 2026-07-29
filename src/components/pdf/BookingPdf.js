import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 12,
        fontFamily: "Helvetica",
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
        textAlign: "center",
    },
    section: {
        marginBottom: 10,
    },
    label: {
        fontWeight: "bold",
    },
});

export default function BookingPdf({ venta }) {
    return (
        <Document>
            <Page size="A4">
                <Text>{venta.folio}</Text>
            </Page>
        </Document>
    );
}