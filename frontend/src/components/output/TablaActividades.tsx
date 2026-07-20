import { useAbcStore } from "../../store/abcStore";

export default function TablaActividades() {
  const result = useAbcStore((s) => s.result);
  if (!result) return null;

  const total = result.activity_costs.reduce((s, a) => s + a.total_cost, 0);

  return (
    <div>
      <h3 className="font-serif text-xl text-navy mb-2">Costos por Actividad</h3>
      <div className="overflow-x-auto bg-white rounded shadow-sm">
        <table className="w-full border-collapse text-base">
          <thead className="bg-navy text-white">
            <tr>
              <th className="p-3 text-left">Actividad</th>
              <th className="p-3 text-right">Costo Total ($)</th>
              <th className="p-3 text-right">% del Total</th>
            </tr>
          </thead>
          <tbody>
            {result.activity_costs.map((a) => (
              <tr key={a.activity_id} className="border-b border-gray-100">
                <td className="p-3">{a.activity_name}</td>
                <td className="p-3 text-right font-mono">
                  {a.total_cost.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                </td>
                <td className="p-3 text-right font-mono">{((a.total_cost / total) * 100).toFixed(1)}%</td>
              </tr>
            ))}
            <tr className="bg-gray-50 font-semibold">
              <td className="p-3">Total</td>
              <td className="p-3 text-right font-mono">{total.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</td>
              <td className="p-3 text-right font-mono">100%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}