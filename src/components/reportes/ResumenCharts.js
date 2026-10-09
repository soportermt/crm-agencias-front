"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#8b5cf6", "#ef4444", "#14b8a6"];

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(
    Number(value) || 0
  );

const truncate = (text, max = 18) =>
  text && text.length > max ? `${text.slice(0, max)}…` : text;

export default function ResumenCharts({ porServicio = [], porVendedor = [] }) {
  const servicios = porServicio.map((s) => ({
    name: s.servicio || "Sin tipo",
    importe: Number(s.importe) || 0,
    total_ventas: Number(s.total_ventas) || 0,
  }));

  const vendedores = porVendedor.map((v) => ({
    name: v.vendedor || "Sin vendedor",
    importe: Number(v.importe) || 0,
    total_ventas: Number(v.total_ventas) || 0,
  }));

  return (
    <div className="row g-3">
      <div className="col-12 col-lg-5">
        <div>
          <h6 className="mb-3">Ventas por servicio</h6>
          {servicios.length === 0 ? (
            <p className="text-muted mb-0">Sin datos en este mes.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={servicios}
                  dataKey="importe"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={2}
                >
                  {servicios.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="col-12 col-lg-7">
        <div>
          <h6 className="mb-3">Ventas por vendedor</h6>
          {vendedores.length === 0 ? (
            <p className="text-muted mb-0">Sin datos en este mes.</p>
          ) : (
            <ResponsiveContainer
              width="100%"
              height={Math.max(250, vendedores.length * 48)}
            >
              <BarChart
                data={vendedores}
                layout="vertical"
                margin={{ left: 8, right: 24 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  tickFormatter={(v) => `$${Number(v).toLocaleString("es-MX")}`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={140}
                  tickFormatter={(v) => truncate(v)}
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(value), "Importe"]}
                  labelFormatter={(label) => label}
                />
                <Bar dataKey="importe" fill="#2563eb" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}