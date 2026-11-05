import { withBasePath } from "@/utils/basePath";

export const BRAND_OVERRIDE_KEY = "brandOverride";

export const BRANDS = {
  "2b": {
    key: "2b",
    name: "2Business Travel",
    domains: ["2businesstravel.com"],
    logo: withBasePath("/2bt2025.png"),
    logoWidth: 2000,
    logoHeight: 400,
    favicon: withBasePath("/favicon-2b.ico"),
    title: "CRM 2Business Travel - Control total de tu operación turística",
    description:
      "Identifícate para gestionar salidas, pagos y reportes en tiempo real.",
  },
  vjnexus: {
    key: "vjnexus",
    name: "VJ Nexus",
    domains: ["vjnexus.com.mx"],
    logo: withBasePath("/vjnexuswa.jpg"),
    logoWidth: 1484,
    logoHeight: 304,
    favicon: withBasePath("/favicon.ico"),
    title: "CRM VJ Nexus - Control total de tu operación turística",
    description:
      "Identifícate para gestionar salidas, pagos y reportes en tiempo real.",
  },
};

export const DEFAULT_BRAND = "vjnexus";

export function resolveBrand(hostname = "", overrideKey = "") {
  if (overrideKey && BRANDS[overrideKey]) return BRANDS[overrideKey];

  const host = hostname.toLowerCase().replace(/\.$/, "");

  const match = Object.values(BRANDS).find((brand) =>
    brand.domains.some((domain) => host === domain || host.endsWith(`.${domain}`))
  );

  return match ?? BRANDS[DEFAULT_BRAND];
}
