import { conectividadService } from "@/services/conectividad.service";

export const PURPOSE_RESERVA = "reserva";
export const PURPOSE_RECIBO = "recibo";

const DEFAULT_TEMPLATE_NAMES = {
  [PURPOSE_RESERVA]: "crm_reserva_default",
  [PURPOSE_RECIBO]: "crm_recibo_default",
};

export function parseMaybeJson(value) {
  if (!value) return null;
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }
  return value;
}

export function getSendBlockedReason({ connection, template, phone }) {
  if (connection && connection.configured === false) {
    const missing = (connection.missing || []).join(", ");
    return missing
      ? `Faltan credenciales de WhatsApp (${missing}). Ve a Configuración → Conectividad.`
      : "La agencia no tiene credenciales de WhatsApp configuradas. Ve a Configuración → Conectividad.";
  }
  if (!template) {
    return "No hay plantilla predeterminada configurada para este envío. Ve a Configuración → Plantillas.";
  }
  if (!phone) {
    return "Indica un número de WhatsApp destino para enviar el comprobante.";
  }
  return null;
}

export async function getWhatsappCredentialsStatus() {
  try {
    const settings = await conectividadService.getWhatsappSettings();
    const missing = [];
    if (!settings?.waba_id) missing.push("waba_id");
    if (!settings?.token) missing.push("token");
    if (!settings?.phone_number_id) missing.push("phone_number_id");

    return { configured: missing.length === 0, missing, settings: settings || null };
  } catch (error) {
    console.error("Error consultando las credenciales de WhatsApp:", error);
    return {
      configured: null,
      missing: [],
      settings: null,
      error,
    };
  }
}

function getTemplateId(agencySettings, purpose) {
  if (!agencySettings) return null;
  return purpose === PURPOSE_RECIBO
    ? agencySettings.default_receipt_template_id ?? null
    : agencySettings.default_reservation_template_id ?? null;
}

export function resolveTemplate({ templates = [], agencySettings = null, purpose = PURPOSE_RESERVA }) {
  if (!Array.isArray(templates) || templates.length === 0) return null;

  const findById = (id) =>
    id ? templates.find((t) => String(t.id) === String(id)) : null;

  const otherPurpose = purpose === PURPOSE_RECIBO ? PURPOSE_RESERVA : PURPOSE_RECIBO;

  return (
    findById(getTemplateId(agencySettings, purpose)) ||
    findById(getTemplateId(agencySettings, otherPurpose)) ||
    templates.find((t) => t.name === DEFAULT_TEMPLATE_NAMES[purpose]) ||
    null
  );
}

export function buildTemplateParameters({ template, clientName = "", phone = "", email = "" }) {
  if (!template) return [];

  const mapping = parseMaybeJson(template.variables_mapping);
  const variablesInBody = Array.from(String(template.body || "").matchAll(/\{\{(\d+)\}\}/g)).map(
    (match) => Number(match[1])
  );
  const expected = variablesInBody.length > 0 ? Math.max(...variablesInBody) : 0;

  const resolveValue = (source) => {
    if (source === "client_name") return clientName;
    if (source === "client_phone") return phone;
    if (source === "client_email") return email;
    return "";
  };

  const values = [];

  if (Array.isArray(mapping)) {
    mapping.forEach((item) => values.push(resolveValue(item?.source)));
  } else if (mapping && typeof mapping === "object") {
    Object.keys(mapping)
      .sort((a, b) => Number(a) - Number(b))
      .forEach((key) => {
        const raw = mapping[key];
        values.push(resolveValue(typeof raw === "string" ? raw.toLowerCase() : raw?.source));
      });
  }

  if (expected === 0) return values;

  while (values.length < expected) values.push("");
  const ordered = values.slice(0, expected);
  if (!ordered[0]) ordered[0] = clientName;

  return ordered;
}

export async function sendPdfViaWhatsapp({
  blob,
  fileName,
  folio,
  clientId,
  clientName,
  phone,
  email,
  template,
  purpose = PURPOSE_RESERVA,
}) {
  const formData = new FormData();

  formData.append("file", blob, fileName);
  formData.append("folio", String(folio || ""));
  if (clientId) formData.append("clientId", String(clientId));
  if (phone) formData.append("toPhone", String(phone));
  formData.append("clientName", clientName || "Cliente");
  if (template?.name) formData.append("templateName", template.name);
  formData.append("language", template?.language || "es_MX");
  formData.append("purpose", purpose);
  formData.append(
    "parameters",
    JSON.stringify(buildTemplateParameters({ template, clientName, phone, email }))
  );

  return conectividadService.sendReceiptWhatsapp(formData);
}
