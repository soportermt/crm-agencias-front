import { Poppins, Inter, Plus_Jakarta_Sans } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import BootstrapClient from "@/components/BootstrapClient";
import BrandSync from "@/components/BrandSync";
import { BRANDS, DEFAULT_BRAND, BRAND_OVERRIDE_KEY } from "@/lib/brand";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "CRM - Control total de tu operación turística",
  description:
    "Identifícate para gestionar salidas, pagos y reportes en tiempo real.",
};

const brandScriptData = Object.values(BRANDS).map(
  ({ key, domains, favicon, logo, title, description }) => ({
    key,
    domains,
    favicon,
    logo,
    title,
    description,
  })
);

const defaultBrandData = brandScriptData.find(
  (brand) => brand.key === DEFAULT_BRAND
);

const brandScript = `
(function () {
  try {
    var brands = ${JSON.stringify(brandScriptData)};
    var fallback = ${JSON.stringify(defaultBrandData)};
    var overrideKey = ${JSON.stringify(BRAND_OVERRIDE_KEY)};
    var selected = null;

    try {
      var params = new URLSearchParams(location.search);
      var forced = params.get("brand");
      if (forced === "auto") {
        sessionStorage.removeItem(overrideKey);
        forced = null;
      } else if (forced) {
        sessionStorage.setItem(overrideKey, forced);
      } else {
        forced = sessionStorage.getItem(overrideKey);
      }
      if (forced) {
        selected = brands.find(function (brand) {
          return brand.key === forced;
        }) || null;
      }
    } catch (e) {}

    if (!selected) {
      var host = location.hostname.toLowerCase().replace(/\\.$/, "");
      selected = brands.find(function (brand) {
        return brand.domains.some(function (domain) {
          return host === domain || host.endsWith("." + domain);
        });
      });
    }

    selected = selected || fallback;

    var links = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
    if (!links.length) {
      var icon = document.createElement("link");
      icon.rel = "icon";
      document.head.appendChild(icon);
      links = [icon];
    }
    Array.prototype.forEach.call(links, function (el) {
      el.href = selected.favicon;
      el.type = "image/x-icon";
      el.removeAttribute("sizes");
    });

    if (selected.title) {
      document.title = selected.title;
    }

    var meta = document.querySelector('meta[name="description"]');
    if (meta && selected.description) {
      meta.setAttribute("content", selected.description);
    }

    if (selected.logo) {
      var existing = document.querySelector(
        'link[rel="preload"][as="image"][href="' + selected.logo + '"]'
      );
      if (!existing) {
        var preload = document.createElement("link");
        preload.rel = "preload";
        preload.as = "image";
        preload.href = selected.logo;
        preload.setAttribute("fetchpriority", "high");
        document.head.appendChild(preload);
      }
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${poppins.variable} ${inter.variable} ${plusJakarta.variable}`}>
        <script
          id="brand-init"
          dangerouslySetInnerHTML={{ __html: brandScript }}
        />
        <BrandSync />
        <BootstrapClient />
        {children}
      </body>
    </html>
  );
}
