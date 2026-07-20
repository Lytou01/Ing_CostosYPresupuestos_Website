import { useState } from "react";
import { useAbcStore } from "../../store/abcStore";
import type { CostDriverInput, ProductInput } from "../../types";
import { calculateAbc } from "../../services/api";

function genId(): string {
  return crypto.randomUUID();
}

function numval(v: string): number {
  if (v === "" || v === "-") return 0;
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

export default function ProductosInductoresForm() {
  const {
    costDrivers, setCostDrivers,
    products, setProducts,
    consumptions, setConsumptions,
    activities,
    setStep, setResult,
  } = useAbcStore();
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  function addDriver() {
    const activityId = activities[0]?.id ?? "";
    setCostDrivers([...costDrivers, { id: genId(), name: "", activity_id: activityId, total_quantity: 0 }]);
  }

  function updateDriver(id: string, field: keyof CostDriverInput, value: string | number) {
    setCostDrivers(costDrivers.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
  }

  function removeDriver(id: string) {
    setCostDrivers(costDrivers.filter((d) => d.id !== id));
    setConsumptions(consumptions.filter((c) => c.driver_id !== id));
  }

  function addProduct() {
    setProducts([...products, { id: genId(), name: "", units_produced: 0, labor_cost: 0, material_cost: 0, selling_price: 0 }]);
  }

  function updateProduct(id: string, field: keyof ProductInput, value: string | number) {
    setProducts(products.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  }

  function removeProduct(id: string) {
    setProducts(products.filter((p) => p.id !== id));
    setConsumptions(consumptions.filter((c) => c.product_id !== id));
  }

  function updateConsumption(productId: string, driverId: string, quantity: number) {
    const existing = consumptions.find((c) => c.product_id === productId && c.driver_id === driverId);
    if (existing) {
      setConsumptions(consumptions.map((c) =>
        c.product_id === productId && c.driver_id === driverId ? { ...c, quantity } : c
      ));
    } else {
      setConsumptions([...consumptions, { product_id: productId, driver_id: driverId, quantity }]);
    }
  }

  function getConsumption(productId: string, driverId: string): number {
    return consumptions.find((c) => c.product_id === productId && c.driver_id === driverId)?.quantity ?? 0;
  }

  function validate(): boolean {
    const errs: string[] = [];
    if (costDrivers.length === 0) errs.push("Agregue al menos un impulsador de costos.");
    if (products.length === 0) errs.push("Agregue al menos un producto.");
    for (const d of costDrivers) {
      if (!d.name.trim()) errs.push("Hay un impulsador sin nombre.");
      if (d.total_quantity <= 0) errs.push(`"${d.name || "Impulsador"}" necesita un valor mayor a 0.`);
      if (!d.activity_id) errs.push(`"${d.name || "Impulsador"}" debe estar asociado a una actividad.`);
    }
    for (const p of products) {
      if (!p.name.trim()) errs.push("Hay un producto sin nombre.");
      if (p.units_produced <= 0) errs.push(`"${p.name || "Producto"}" necesita unidades producidas mayor a 0.`);
    }
    setErrors(errs);
    return errs.length === 0;
  }

  async function handleCalculate() {
    if (!validate()) return;
    setLoading(true);
    setErrors([]);
    try {
      const data = useAbcStore.getState().buildRequest();
      const result = await calculateAbc(data);
      setResult(result);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error al conectar con el servidor";
      setErrors([msg]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 text-base">
      <section>
        <h2 className="font-serif text-2xl text-navy mb-1">Impulsadores de Costos</h2>
        <p className="text-slate-light mb-4">
          El impulsador mide cuántas veces se consume cada actividad. Por ejemplo: para la actividad "Preparación", el impulsador es "Número de preparaciones" y el valor anual/mensual estimado es el total de preparaciones que se hacen.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded shadow-sm">
            <thead className="bg-navy text-white">
              <tr>
                <th className="p-3 text-left">Impulsador de costos</th>
                <th className="p-3 text-left">Actividad asociada</th>
                <th className="p-3 text-right">Valor anual / mensual estimado</th>
                <th className="p-3 w-16"></th>
              </tr>
            </thead>
            <tbody>
              {costDrivers.map((d) => (
                <tr key={d.id} className="border-b border-gray-100">
                  <td className="p-3">
                    <input
                      type="text" value={d.name}
                      onChange={(e) => updateDriver(d.id, "name", e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-base"
                      placeholder="Ej: Número de preparaciones"
                    />
                  </td>
                  <td className="p-3">
                    <select value={d.activity_id}
                      onChange={(e) => updateDriver(d.id, "activity_id", e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-base">
                      {activities.map((a) => (<option key={a.id} value={a.id}>{a.name}</option>))}
                    </select>
                  </td>
                  <td className="p-3">
                    <input
                      type="text" inputMode="decimal"
                      value={d.total_quantity === 0 ? "" : d.total_quantity}
                      onChange={(e) => updateDriver(d.id, "total_quantity", numval(e.target.value))}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-base text-right"
                      placeholder="0"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <button type="button" onClick={() => removeDriver(d.id)}
                      className="text-red-soft hover:text-red-800 text-xl">&times;</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" onClick={addDriver}
          className="mt-3 text-base text-navy hover:text-navy-light underline">
          + Agregar impulsador de costos
        </button>
      </section>

      <section>
        <h2 className="font-serif text-2xl text-navy mb-1">Productos</h2>
        <p className="text-slate-light mb-4">
          Los productos o servicios que quiere costear. Ingrese los costos directos (mano de obra y materiales), las unidades a producir y el precio de venta total estimado.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded shadow-sm">
            <thead className="bg-navy text-white">
              <tr>
                <th className="p-3 text-left">Producto</th>
                <th className="p-3 text-right">Costo MOD ($)</th>
                <th className="p-3 text-right">Costo materiales ($)</th>
                <th className="p-3 text-right">Unidades</th>
                <th className="p-3 text-right">Precio venta ($)</th>
                <th className="p-3 w-16"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-gray-100">
                  <td className="p-3">
                    <input type="text" value={p.name}
                      onChange={(e) => updateProduct(p.id, "name", e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-base"
                      placeholder="Ej: Pala modelo 350"
                    />
                  </td>
                  <td className="p-3">
                    <input type="text" inputMode="decimal"
                      value={p.labor_cost === 0 ? "" : p.labor_cost}
                      onChange={(e) => updateProduct(p.id, "labor_cost", numval(e.target.value))}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-base text-right" placeholder="0.00"
                    />
                  </td>
                  <td className="p-3">
                    <input type="text" inputMode="decimal"
                      value={p.material_cost === 0 ? "" : p.material_cost}
                      onChange={(e) => updateProduct(p.id, "material_cost", numval(e.target.value))}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-base text-right" placeholder="0.00"
                    />
                  </td>
                  <td className="p-3">
                    <input type="text" inputMode="decimal"
                      value={p.units_produced === 0 ? "" : p.units_produced}
                      onChange={(e) => updateProduct(p.id, "units_produced", numval(e.target.value))}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-base text-right" placeholder="0"
                    />
                  </td>
                  <td className="p-3">
                    <input type="text" inputMode="decimal"
                      value={p.selling_price === 0 ? "" : p.selling_price}
                      onChange={(e) => updateProduct(p.id, "selling_price", numval(e.target.value))}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-base text-right" placeholder="0.00"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <button type="button" onClick={() => removeProduct(p.id)}
                      className="text-red-soft hover:text-red-800 text-xl">&times;</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" onClick={addProduct}
          className="mt-3 text-base text-navy hover:text-navy-light underline">
          + Agregar producto
        </button>
      </section>

      {costDrivers.length > 0 && products.length > 0 && (
        <section>
          <h2 className="font-serif text-2xl text-navy mb-1">Consumos</h2>
          <p className="text-slate-light mb-4">
            Para cada producto, indique cuántas unidades de cada impulsador consume. Por ejemplo: la Pala modelo 350 necesita 2 preparaciones.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded shadow-sm">
              <thead className="bg-navy text-white">
                <tr>
                  <th className="p-3 text-left">Producto</th>
                  {costDrivers.map((d) => (
                    <th key={d.id} className="p-3 text-right text-sm">{d.name || "Impulsador"}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100">
                    <td className="p-3 font-medium text-navy">{p.name}</td>
                    {costDrivers.map((d) => {
                      const qty = getConsumption(p.id, d.id);
                      return (
                        <td key={d.id} className="p-3">
                          <input type="text" inputMode="decimal"
                            value={qty === 0 ? "" : qty}
                            onChange={(e) => updateConsumption(p.id, d.id, numval(e.target.value))}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-base text-right" placeholder="0"
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <ul className="list-disc list-inside text-base text-red-soft space-y-1">
            {errors.map((e, i) => (<li key={i}>{e}</li>))}
          </ul>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button type="button" onClick={() => setStep("step1")}
          className="px-6 py-2.5 border border-gray-300 rounded text-slate hover:bg-gray-50 text-base">
          Anterior
        </button>
        <button type="button" onClick={handleCalculate}
          disabled={loading || costDrivers.length === 0 || products.length === 0}
          className="px-8 py-2.5 bg-emerald-dark text-white rounded hover:bg-emerald-700 disabled:opacity-50 font-semibold text-base">
          {loading ? "Calculando..." : "Calcular"}
        </button>
      </div>
    </div>
  );
}