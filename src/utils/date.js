export function formatRelativeTime(dateInput) {
  if (!dateInput) return "Justo ahora";

  let date;
  if (dateInput instanceof Date) {
    date = dateInput;
  } else if (typeof dateInput === "number") {
    date = new Date(dateInput);
  } else if (typeof dateInput === "string") {
    const cleanStr = dateInput.trim();
    if (!/\d/.test(cleanStr)) {
      return cleanStr;
    }
    const isoString = cleanStr.includes(" ") && !cleanStr.includes("T")
      ? cleanStr.replace(" ", "T")
      : cleanStr;
    const parsed = new Date(isoString);
    if (isNaN(parsed.getTime())) {
      const fallback = new Date(cleanStr);
      if (isNaN(fallback.getTime())) {
        return cleanStr;
      }
      date = fallback;
    } else {
      date = parsed;
    }
  } else {
    return "Justo ahora";
  }

  const now = Date.now();
  const timestamp = date.getTime();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);

  if (diffInSeconds < 60) {
    return "Justo ahora";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `Hace ${diffInMinutes} min`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `Hace ${diffInHours} ${diffInHours === 1 ? "hora" : "horas"}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `Hace ${diffInDays} ${diffInDays === 1 ? "día" : "días"}`;
  }

  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `Hace ${weeks} ${weeks === 1 ? "semana" : "semanas"}`;
  }

  return date.toLocaleDateString("es-MX", { day: "2-digit", month: "short" });
}
