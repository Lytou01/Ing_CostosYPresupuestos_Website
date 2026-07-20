import { useAbcStore } from "../../store/abcStore";

export default function TablaTasas() {
  const result = useAbcStore((s) => s.result);
  if (!result) return null;

  return (
    <div>
      <h3 className="font-serif text-xl text-navy mb-2">Tasas de Impulsador</h3>
      <div className="overflow-x-auto bg-white rounded shadow-sm">
        <table className="w-full border-collapse text-base">
          <thead className="bg-navy text-white">
            <tr>
              <th className="p-3 text-left">Impulsador de costos</th>
              <th className="p-3 text-left">Actividad</th>
              <th className="p-3 text-right">Costo Actividad ($)</th>
              <th className="p-3 text-right">Valor estimado</th>
              <th className="p-3 text-right">Tasa ($ / unidad)</th>
            </tr>
          </thead>
          <tbody>
            {result.driver_rates.map((d) => (
              <tr key={d.driver_id} className="border-b border-gray-100">
                <td className="p-3">{d.driver_name}</td>
                <td className="p-3 text-slate-light">{d.activity_name}</td>
                <td className="p-3 text-right font-mono">{d.activity_cost.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</td>
                <td className="p-3 text-right font-mono">{d.total_quantity.toLocaleString("es-MX")}</td>
                <td className="p-3 text-right font-mono font-semibold text-navy">
                  {d.rate.toLocaleString("es-MX", { minimumFractionDigits: 4 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}