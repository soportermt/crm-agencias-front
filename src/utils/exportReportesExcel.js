const CURRENCY = '"$"#,##0.00';
const DATE_FMT = "dd/mm/yyyy";

const parseDate = (value) => {
  if (!value || value === "0000-00-00") return null;
  const [y, m, d] = String(value).slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d); // fecha local, evita el desfase de un día
};

const styleTitle = (row) => {
  row.font = { bold: true, size: 12 };
  row.height = 22;
};

const styleHeader = (row, cols) => {
  for (let c = 1; c <= cols; c++) {
    const cell = row.getCell(c);
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2563EB" } };
    cell.alignment = { vertical: "middle" };
  }
  row.height = 16;
};

const styleTotal = (row, cols) => {
  for (let c = 1; c <= cols; c++) {
    const cell = row.getCell(c);
    cell.font = { bold: true };
    cell.border = { top: { style: "thin" } };
  }
};

export async function exportReportesExcel({ data, mes, anio }) {
  if (!data) return;

  const ExcelJS = (await import("exceljs")).default; // se carga solo al exportar
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Reporte");

  const resumen = data.resumen_mensual?.[0] || {};
  const detalle = data.detalle_ventas || [];
  const porServicio = data.por_servicio || [];
  const porVendedor = data.por_vendedor || [];
  const periodo = `${resumen.nombre_mes || mes} ${anio}`;

  // Anchos compartidos por todas las secciones
  ws.columns = [
    { width: 28 }, // A: folio / concepto / nombre
    { width: 16 }, // B: fecha / valor / ventas
    { width: 30 }, // C: cliente / importe
    { width: 36 }, // D: descripción
    { width: 16 }, // E: servicio
    { width: 16 }, // F: total
    { width: 18 }, // G: forma de pago
    { width: 12 }, // H: estatus
    { width: 26 }, // I: vendedor
  ];

  // Título
  ws.addRow([`Reporte de ${periodo}`]).font = { bold: true, size: 14 };
  ws.addRow([]);

  // Sección 1: Resumen
  styleTitle(ws.addRow(["Resumen"]));
  styleHeader(ws.addRow(["Concepto", "Valor"]), 2);
  [
    ["Total de ventas", Number(resumen.total_ventas) || 0, null],
    ["Ingresos", Number(resumen.total_ingresos) || 0, CURRENCY],
    ["Egresos", Number(resumen.total_egresos) || 0, CURRENCY],
    ["Utilidad", Number(resumen.utilidad) || 0, CURRENCY],
  ].forEach(([concepto, valor, fmt]) => {
    const row = ws.addRow([concepto, valor]);
    if (fmt) row.getCell(2).numFmt = fmt;
  });
  ws.addRow([]);

  const agregarSeccion = (titulo, columnaNombre, key, filas) => {
    styleTitle(ws.addRow([titulo]));
    styleHeader(ws.addRow([columnaNombre, "Ventas", "Importe"]), 3);
    let total = 0;
    filas.forEach((f) => {
      const importe = Number(f.importe) || 0;
      total += importe;
      const row = ws.addRow([f[key] || "Sin dato", Number(f.total_ventas) || 0, importe]);
      row.getCell(3).numFmt = CURRENCY;
    });
    const totalRow = ws.addRow(["Total", null, total]);
    totalRow.getCell(3).numFmt = CURRENCY;
    styleTotal(totalRow, 3);
    ws.addRow([]);
  };

  agregarSeccion("Ventas por servicio", "Servicio", "servicio", porServicio);
  agregarSeccion("Ventas por vendedor", "Vendedor", "vendedor", porVendedor);

  styleTitle(ws.addRow(["Detalle de ventas"]));
  const headerRow = ws.addRow([
    "Folio", "Fecha", "Cliente", "Descripción", "Servicio",
    "Total", "Forma de pago", "Estatus", "Vendedor",
  ]);
  styleHeader(headerRow, 9);

  let totalDetalle = 0;
  detalle.forEach((d) => {
    const importe = Number(d.importe) || 0;
    totalDetalle += importe;
    const row = ws.addRow([
      d.folio || "-",
      parseDate(d.fecha),
      d.cliente || "-",
      d.descripcion || "-",
      d.servicio || "-",
      importe,
      d.forma_pago || "Sin pago",
      d.estatus === "venta" ? "Activo" : d.estatus,
      d.vendedor || "-",
    ]);
    row.getCell(2).numFmt = DATE_FMT;
    row.getCell(6).numFmt = CURRENCY;
  });

  // El filtro cubre solo la tabla de detalle (sin la fila de total)
  if (detalle.length > 0) {
    ws.autoFilter = {
      from: { row: headerRow.number, column: 1 },
      to: { row: headerRow.number + detalle.length, column: 9 },
    };
  }

  const totalRow = ws.addRow([null, null, null, "Total", null, totalDetalle]);
  totalRow.getCell(6).numFmt = CURRENCY;
  styleTotal(totalRow, 9);

  // Descarga
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `reporte-${String(mes).padStart(2, "0")}-${anio}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}