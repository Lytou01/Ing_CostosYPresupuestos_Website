import { useState } from "react";
import { useAbcStore } from "../../store/abcStore";
import { calculateSensitivity } from "../../services/api";

export default function SensitivityPanel() {
  const store = useAbcStore();
  const { result, products, costDrivers, consumptions, buildRequest, setSensitivityResult, sensitivityResult } = store;
  const [loading, setLoading] = useState(false);

  if (!result) return null;

  async function updateSensitivity(updater: () => void) {
    updater();
    setLoading(true);
    try {
      const data = buildRequest();
      const res = await calculateSensitivity(data);
      setSensitivityResult(res);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 text-base">
      <h2 className="font-serif text-2xl text-navy">Análisis de Sensibilidad</h2>
      <p className="text-slate-light">
        Modifique las variables para ver cómo cambian los costos. Compare el escenario base con el modificado.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded shadow-sm p-5">
          <h3 className="font-serif text-lg text-navy mb-3">Unidades Producidas</h3>
          {products.map((p) => (
            <div key={p.id} className="mb-3">
              <label className="block mb-1">
                {p.name}: <span className="font-mono font-semibold">{p.units_produced.toLocaleString("es-MX")}</span> unidades
              </label>
              <input type="range"
                min={Math.max(1, p.units_produced * 0.5)} max={p.units_produced * 1.5} step={1}
                value={p.units_produced}
                onChange={(e) => {
                  const v = parseInt(e.target.value);
                  updateSensitivity(() => {
                    useAbcStore.setState((s) => ({
                      products: s.products.map((pr) => pr.id === p.id ? { ...pr, units_produced: v } : pr),
                    }));
                  });
                }}
                className="w-full accent-navy"
              />
            </div>
          ))}
        </section>

        <section className="bg-white rounded shadow-sm p-5">
          <h3 className="font-serif text-lg text-navy mb-3">Consumo de Impulsadores</h3>
          {costDrivers.map((d) => (
            <div key={d.id} className="mb-4">
              <p className="font-medium text-slate mb-1">{d.name}</p>
              {products.map((p) => {
                const c = consumptions.find((x) => x.product_id === p.id && x.driver_id === d.id);
                const val = c?.quantity ?? 0;
                return (
                  <div key={p.id} className="ml-3 mb-1 flex items-center gap-2">
                    <span className="w-24 text-slate-light">{p.name}</span>
                    <input type="range" min={0} max={Math.max(val * 2, 10)} step={1} value={val}
                      onChange={(e) => {
                        const v = parseInt(e.target.value);
                        updateSensitivity(() => {
                          useAbcStore.setState((s) => ({
                            consumptions: s.consumptions.map((cn) =>
                              cn.product_id === p.id && cn.driver_id === d.id ? { ...cn, quantity: v } : cn
                            ),
                          }));
                        });
                      }}
                      className="flex-1 accent-navy"
                    />
                    <span className="w-12 text-right font-mono">{val}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </section>
      </div>

      <div className="bg-white rounded shadow-sm p-5">
        <h3 className="font-serif text-lg text-navy mb-3">
          Resultados del Escenario Modificado
          {loading && <span className="font-normal text-slate-light ml-2 text-base">Calculando...</span>}
        </h3>
        {sensitivityResult ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-slate mb-2">Escenario Base</h4>
              <table className="w-full border-collapse border text-base">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Producto</th>
                    <th className="p-2 text-right">Unitario ABC</th>
                    <th className="p-2 text-right">Unitario Trad.</th>
                  </tr>
                </thead>
                <tbody>
                  {result.product_costs.map((pc) => {
                    const trad = result.traditional_costs.find((t) => t.product_id === pc.product_id);
                    return (
                      <tr key={pc.product_id} className="border-t">
                        <td className="p-2">{pc.product_name}</td>
                        <td className="p-2 text-right font-mono">S/. {pc.unit_cost_abc.toLocaleString("es-MX", { minimumFractionDigits: 4 })}</td>
                        <td className="p-2 text-right font-mono">S/. {(trad?.unit_cost_traditional ?? 0).toLocaleString("es-MX", { minimumFractionDigits: 4 })}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div>
              <h4 className="font-semibold text-slate mb-2">Escenario Modificado</h4>
              <table className="w-full border-collapse border text-base">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Producto</th>
                    <th className="p-2 text-right">Unitario ABC</th>
                    <th className="p-2 text-right">Unitario Trad.</th>
                  </tr>
                </thead>
                <tbody>
                  {sensitivityResult.product_costs.map((pc) => {
                    const base = result.product_costs.find((b) => b.product_id === pc.product_id);
                    const diff = pc.unit_cost_abc - (base?.unit_cost_abc ?? 0);
                    const strad = sensitivityResult.traditional_costs.find((t) => t.product_id === pc.product_id);
                    return (
                      <tr key={pc.product_id} className="border-t">
                        <td className="p-2">{pc.product_name}</td>
                        <td className="p-2 text-right font-mono">
                          S/. {pc.unit_cost_abc.toLocaleString("es-MX", { minimumFractionDigits: 4 })}
                          <span className={`ml-1 ${diff > 0 ? "text-red-soft" : diff < 0 ? "text-emerald-dark" : "text-gray-400"}`}>
                            ({diff >= 0 ? "+" : ""}{diff.toLocaleString("es-MX", { minimumFractionDigits: 4, signDisplay: "never" })})
                          </span>
                        </td>
                        <td className="p-2 text-right font-mono">S/. {(strad?.unit_cost_traditional ?? 0).toLocaleString("es-MX", { minimumFractionDigits: 4 })}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-slate-light">Mueva los sliders para ver los cambios.</p>
        )}
      </div>
    </div>
  );
}