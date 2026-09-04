"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import BookingPdf from "./BookingPdf";
import { conectividadService } from "@/services/conectividad.service";
import AlertModal from "@/components/common/AlertModal";

export default function PdfViewer({ venta, customer, terminos }) {
    const [downloading, setDownloading] = useState(false);
    const [sendingWhatsapp, setSendingWhatsapp] = useState(false);
    const [alertData, setAlertData] = useState(null);

    const handleDownload = async () => {
        if (!venta) {
            console.error("No hay información de la venta");
            return;
        }

        try {
            setDownloading(true);
            const blob = await pdf(<BookingPdf venta={venta} terminos={terminos} />).toBlob();
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `Reserva-${venta.folio || "comprobante"}.pdf`;

            document.body.appendChild(a);
            a.click();
            a.remove();

            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error al generar o descargar el PDF:", error);
            setAlertData({
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} width={46} color="#dc3545" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                ),
                title: "Error al generar comprobante",
                description: "Ocurrió un inconveniente al generar el archivo PDF para descarga.",
            });
        } finally {
            setDownloading(false);
        }
    };

    const handleSendWhatsapp = async () => {
        if (!venta) {
            console.error("No hay información de la venta");
            return;
        }

        const phone = customer?.phone || customer?.celular || venta?.idCliente?.telefono || venta?.idCliente?.celular || "";
        const clientName = customer?.label || venta?.idCliente?.nombre || "Cliente";
        const clientId = venta?.id_cliente || venta?.idCliente?.id_cliente || customer?.value || "";

        if (!phone && !clientId) {
            setAlertData({
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} width={46} color="#f59e0b" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                ),
                title: "Teléfono no disponible",
                description: "El cliente asociado a esta reservación no tiene un número telefónico registrado.",
            });
            return;
        }

        try {
            setSendingWhatsapp(true);

            const blob = await pdf(<BookingPdf venta={venta} terminos={terminos}/>).toBlob();
            const fileName = `Reserva-${venta.folio || "comprobante"}.pdf`;

            const formData = new FormData();
            formData.append("file", blob, fileName);
            formData.append("folio", String(venta.folio || ""));
            if (clientId) formData.append("clientId", String(clientId));
            if (phone) formData.append("toPhone", String(phone));
            formData.append("clientName", clientName);
            formData.append("templateName", "prueba_envio_docs");
            formData.append("language", "es");
            formData.append(
                "parameters",
                JSON.stringify([clientName, `#${venta.folio || ""}`])
            );

            const res = await conectividadService.sendReceiptWhatsapp(formData);

            if (res && res.success) {
                if (res.delivered) {
                    setAlertData({
                        icon: (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} width={46} color="#25D366" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                            </svg>
                        ),
                        title: "¡Comprobante enviado!",
                        description: `El comprobante en PDF se ha enviado por WhatsApp exitosamente al ${res.toPhone || phone}.`,
                    });
                } else {
                    setAlertData({
                        icon: (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} width={46} color="#0c5cc6" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                            </svg>
                        ),
                        title: "Flujo procesado en el servidor",
                        description: `El PDF y la plantilla "${res.templateName}" fueron procesados por el backend. ${res.apiError ? `Estado Meta API: ${res.apiError}.` : ""}`,
                    });
                }
            } else {
                throw new Error(res?.error || "Respuesta no exitosa del servidor");
            }
        } catch (error) {
            console.error("Error al enviar comprobante por WhatsApp:", error);
            setAlertData({
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} width={46} color="#dc3545" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                ),
                title: "Error de envío",
                description: error?.response?.data?.message || error?.message || "No fue posible conectar con el servicio de mensajería.",
            });
        } finally {
            setSendingWhatsapp(false);
        }
    };

    return (
        <>
            <div className="d-flex flex-column gap-2 mt-2">
                <button
                    type="button"
                    className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2"
                    onClick={handleDownload}
                    disabled={downloading || sendingWhatsapp}
                >
                    {downloading ? (
                        <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            <span>Generando PDF...</span>
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.5V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            <span>Descargar comprobante</span>
                        </>
                    )}
                </button>

                <button
                    type="button"
                    className="btn w-100 d-flex align-items-center justify-content-center gap-2 text-white"
                    style={{
                        backgroundColor: "#25D366",
                        borderColor: "#25D366",
                        transition: "all 0.2s ease-in-out"
                    }}
                    onClick={handleSendWhatsapp}
                    disabled={downloading || sendingWhatsapp}
                >
                    {sendingWhatsapp ? (
                        <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            <span>Enviando por WhatsApp...</span>
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.364 2.76 1.057 3.96L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.707 1.916.807 2.05c.099.133 1.39 2.123 3.37 2.977.471.203.839.324 1.126.415.474.151.906.13 1.246.079.379-.058 1.17-.477 1.334-.94.166-.464.166-.862.116-.94-.048-.078-.182-.132-.38-.231" />
                            </svg>
                            <span>Enviar por WhatsApp</span>
                        </>
                    )}
                </button>
            </div>

            {alertData && (
                <AlertModal
                    icon={alertData.icon}
                    title={alertData.title}
                    description={alertData.description}
                    onClose={() => setAlertData(null)}
                />
            )}
        </>
    );
}