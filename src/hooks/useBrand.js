"use client";

import { useSyncExternalStore } from "react";
import { BRAND_OVERRIDE_KEY, resolveBrand } from "@/lib/brand";

let cachedBrand = null;

const subscribe = () => () => {};

function readOverride() {
  try {
    return sessionStorage.getItem(BRAND_OVERRIDE_KEY) || "";
  } catch {
    return "";
  }
}

const getSnapshot = () =>
  (cachedBrand ??= resolveBrand(window.location.hostname, readOverride()));

// Devuelve null en SSR/hidratación para que el HTML estático no fije una marca
// y React re-renderice con la del dominio sin desajustes.
const getServerSnapshot = () => null;

export function useBrand() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
