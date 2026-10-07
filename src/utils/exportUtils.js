function buildRows(data, columns) {
    return data.map((row) =>
        columns.map((col) => {
            const value = typeof col.value === "function" ? col.value(row) : row[col.key];
            return value ?? "";
        })
    );
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

const today = () => new Date().toISOString().slice(0, 10);

export function exportToCSV({ data, columns, filename = "exportacion" }) {
    if (!data?.length) return;

    const escapeCsvValue = (value) => {
        const str = String(value ?? "");
        return /[",\n\r]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
    };

    const headers = columns.map((c) => c.header);
    const rows = buildRows(data, columns);

    const csvContent = [headers, ...rows]
        .map((r) => r.map(escapeCsvValue).join(","))
        .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    downloadBlob(blob, `${filename}_${today()}.csv`);
}

export async function exportToExcel({ data, columns, filename = "exportacion", sheetName = "Datos" }) {
    if (!data?.length) return;

    // Import dinámico: la librería solo se carga cuando se usa
    const XLSX = await import("xlsx");

    const headers = columns.map((c) => c.header);
    const rows = buildRows(data, columns);

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);

    // Ancho de columna automático según el contenido
    worksheet["!cols"] = headers.map((h, i) => ({
        wch: Math.min(
            Math.max(String(h).length, ...rows.map((r) => String(r[i] ?? "").length)) + 2,
            50
        ),
    }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.slice(0, 31));
    XLSX.writeFile(workbook, `${filename}_${today()}.xlsx`);
}