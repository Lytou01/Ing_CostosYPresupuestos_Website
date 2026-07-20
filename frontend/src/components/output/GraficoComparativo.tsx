import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { useAbcStore } from "../../store/abcStore";

export default function GraficoComparativo() {
  const result = useAbcStore((s) => s.result);
  if (!result) return null;

  const data = result.product_costs.map((p) => {
    const trad = result.traditional_costs.find((t) => t.product_id === p.product_id);
    return {
      name: p.product_name,
      "Costo Unit. ABC": p.unit_cost_abc,
      "Costo Unit. Tradicional": trad?.unit_cost_traditional ?? 0,
    };
  });

  return (
    <div>
      <h3 className="font-serif text-xl text-navy mb-2">Costo Unitario: ABC vs Tradicional</h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(v) => `S/. ${v.toFixed(0)}`} />
          <Tooltip formatter={(v: number) => `S/. ${v.toLocaleString("es-MX", { minimumFractionDigits: 4 })}`} />
          <Legend />
          <Bar dataKey="Costo Unit. ABC" fill="#276749" />
          <Bar dataKey="Costo Unit. Tradicional" fill="#4A5568" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}