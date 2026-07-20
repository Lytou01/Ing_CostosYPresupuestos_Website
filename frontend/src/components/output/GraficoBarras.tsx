import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useAbcStore } from "../../store/abcStore";

export default function GraficoBarras() {
  const result = useAbcStore((s) => s.result);
  if (!result) return null;

  const data = result.product_costs.map((p) => ({
    name: p.product_name,
    "MOD + Materiales": p.direct_costs,
    "CIF (ABC)": p.indirect_costs,
  }));

  return (
    <div>
      <h3 className="font-serif text-xl text-navy mb-2">Composición del Costo Total (ABC)</h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(v) => `S/. ${(v / 1000).toFixed(0)}k`} />
          <Tooltip formatter={(v: number) => `S/. ${v.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`} />
          <Legend />
          <Bar dataKey="MOD + Materiales" fill="#B7791F" stackId="a" />
          <Bar dataKey="CIF (ABC)" fill="#1B3A5C" stackId="a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}