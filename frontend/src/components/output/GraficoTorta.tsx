import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useAbcStore } from "../../store/abcStore";

const COLORS = ["#1B3A5C", "#2A5078", "#4A5568", "#718096", "#B7791F", "#D69E2E", "#276749"];

export default function GraficoTorta() {
  const result = useAbcStore((s) => s.result);
  if (!result) return null;

  const data = result.activity_costs.map((a) => ({ name: a.activity_name, value: a.total_cost }));

  return (
    <div>
      <h3 className="font-serif text-xl text-navy mb-2">Distribución de CIF por Actividad</h3>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={100} dataKey="value"
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}>
            {data.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
          </Pie>
          <Tooltip formatter={(v: number) => `S/. ${v.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}