import { Poppins, Inter, Plus_Jakarta_Sans } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import BootstrapClient from "@/components/BootstrapClient";

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
  title: "CRM 2BusinessTravel - Control total de tu operación turística",
  description: "Identifícate para gestionar salidas, pagos y reportes en tiempo real. Sistema CRM premium para operaciones turísticas.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${poppins.variable} ${inter.variable} ${plusJakarta.variable}`}>
        <BootstrapClient />
        {children}
      </body>
    </html>
  );
}
