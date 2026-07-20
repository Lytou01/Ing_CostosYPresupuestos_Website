import { useAbcStore } from "../../store/abcStore";

export default function ComparativaPrincipal() {
  const result = useAbcStore((s) => s.result);
  if (!result) return null;

  const abcs = result.product_costs;
  const trads = result.traditional_costs;

  function fmt(n: number, d: number = 4) {
    return n.toLocaleString("es-MX", { minimumFractionDigits: d });
  }

  return (
    <div>
      <h2 className="font-serif text-2xl text-navy mb-4">
        Comparativa: Método ABC vs Método Tradicional (por órdenes)
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {abcs.map((abc) => {
          const trad = trads.find((t) => t.product_id === abc.product_id);
          const diff = trad?.diff_vs_abc ?? 0;
          const diffPct = trad?.diff_pct ?? 0;

          return (
            <div key={abc.product_id} className="space-y-3">
              <h3 className="font-serif text-lg text-navy font-semibold">{abc.product_name}</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded shadow-sm border border-emerald-dark/30 p-4">
                  <p className="text-sm text-emerald-dark font-semibold mb-2">Método ABC</p>
                  <div className="space-y-1 text-base">
                    <div className="flex justify-between">
                      <span className="text-slate-light">Costo MOD</span>
                      <span className="font-mono">S/. {fmt(abc.labor_cost, 2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-light">Materiales</span>
                      <span className="font-mono">S/. {fmt(abc.material_cost, 2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-light">CIF asignado</span>
                      <span className="font-mono">S/. {fmt(abc.indirect_costs, 2)}</span>
                    </div>
                    <hr className="border-gray-200" />
                    <div className="flex justify-between font-bold">
                      <span>Costo total</span>
                      <span className="font-mono">S/. {fmt(abc.total_cost, 2)}</span>
                    </div>
                    <div className="flex justify-between text-navy font-bold">
                      <span>Costo unitario</span>
                      <span className="font-mono">S/. {fmt(abc.unit_cost_abc)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-light">Precio venta unit.</span>
                      <span className="font-mono">S/. {fmt(abc.unit_revenue)}</span>
                    </div>
                    <div className={`flex justify-between text-sm font-semibold ${abc.unit_margin >= 0 ? "text-emerald-dark" : "text-red-soft"}`}>
                      <span>Margen unitario</span>
                      <span className="font-mono">S/. {fmt(abc.unit_margin)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-100 rounded shadow-sm border border-gray-300 p-4">
                  <p className="text-sm text-slate font-semibold mb-2">Método Tradicional</p>
                  <div className="space-y-1 text-base">
                    <div className="flex justify-between">
                      <span className="text-slate-light">Costo MOD</span>
                      <span className="font-mono">S/. {fmt(abc.labor_cost, 2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-light">Materiales</span>
                      <span className="font-mono">S/. {fmt(abc.material_cost, 2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-light">CIF asignado</span>
                      <span className="font-mono">S/. {fmt((trad?.total_cost_traditional ?? 0) - abc.labor_cost - abc.material_cost, 2)}</span>
                    </div>
                    <hr className="border-gray-300" />
                    <div className="flex justify-between font-bold">
                      <span>Costo total</span>
                      <span className="font-mono">S/. {fmt(trad?.total_cost_traditional ?? 0, 2)}</span>
                    </div>
                    <div className="flex justify-between text-slate font-bold">
                      <span>Costo unitario</span>
                      <span className="font-mono">S/. {fmt(trad?.unit_cost_traditional ?? 0)}</span>
                    </div>
                    <div className={`flex justify-between text-sm font-bold ${diff < 0 ? "text-red-soft" : diff > 0 ? "text-emerald-dark" : "text-slate"}`}>
                      <span>Dif. vs ABC</span>
                      <span className="font-mono">
                        {diff >= 0 ? "+" : ""}{fmt(diff)} ({diffPct >= 0 ? "+" : ""}{fmt(diffPct, 2)}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 bg-navy/5 rounded p-3 text-base text-navy">
        <span className="font-semibold">Tasa tradicional:</span> S/. {fmt(result.traditional_rate)} por cada sol de mano de obra directa &nbsp;|&nbsp;
        <span className="font-semibold">CIF total:</span> S/. {fmt(result.cif_total, 2)}
      </div>
    </div>
  );
}