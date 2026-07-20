import { format } from "date-fns";

export function serializeDates(value) {
  if (value instanceof Date) {
    return format(value, "yyyy-MM-dd");
  }
  if (Array.isArray(value)) {
    return value.map(serializeDates);
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [key, serializeDates(val)])
    );
  }
  return value;
}