import { useState } from "react";
import { useAbcStore } from "../../store/abcStore";
import type { ResourceInput } from "../../types";

function genId(): string {
  return crypto.randomUUID();
}

function numval(v: string): number {
  if (v === "" || v === "-") return 0;
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

export default function RecursosActividadesForm() {
  const {
    resources, setResources,
    activities, setActivities,
    traditionalBaseName, setTraditionalBaseName,
    traditionalBaseValue, setTraditionalBaseValue,
    setStep,
  } = useAbcStore();
  const [errors, setErrors] = useState<string[]>([]);

  function addResource() {
    setResources([...resources, { id: genId(), name: "", amount: 0 }]);
  }

  function updateResource(id: string, field: keyof ResourceInput, value: string | number) {
    setResources(resources.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }

  function removeResource(id: string) {
    setResources(resources.filter((r) => r.id !== id));
    setActivities(
      activities.map((a) => ({
        ...a,
        resource_allocations: a.resource_allocations.filter((ra) => ra.resource_id !== id),
      }))
    );
  }

  function addActivity() {
    const newAllocations = resources.map((r) => ({ resource_id: r.id, percentage: 0 }));
    setActivities([...activities, { id: genId(), name: "", resource_allocations: newAllocations }]);
  }

  function updateActivity(id: string, name: string) {
    setActivities(activities.map((a) => (a.id === id ? { ...a, name } : a)));
  }

  function removeActivity(id: string) {
    setActivities(activities.filter((a) => a.id !== id));
  }

  function updateAllocation(activityId: string, resourceId: string, pct: number) {
    setActivities(
      activities.map((a) =>
        a.id === activityId
          ? { ...a, resource_allocations: a.resource_allocations.map((ra) =>
              ra.resource_id === resourceId ? { ...ra, percentage: pct } : ra) }
          : a
      )
    );
  }

  function validate(): boolean {
    const errs: string[] = [];
    if (resources.length === 0) errs.push("Agregue al menos una partida de costos CIF.");
    if (activities.length === 0) errs.push("Agregue al menos una actividad.");
    for (const r of resources) {
      if (!r.name.trim()) errs.push("Hay una partida de costos sin nombre.");
      if (r.amount <= 0) errs.push(`"${r.name || "Partida"}" necesita un costo mayor a 0.`);
    }
    for (const a of activities) {
      if (!a.name.trim()) errs.push("Hay una actividad sin nombre.");
    }
    for (const r of resources) {
      const sum = activities.reduce(
        (acc, a) => acc + (a.resource_allocations.find((ra) => ra.resource_id === r.id)?.percentage ?? 0),
        0
      );
      if (Math.abs(sum - 100) > 0.01) {
        errs.push(`"${r.name}": los porcentajes suman ${sum.toFixed(1)}% (debe ser 100%).`);
      }
    }
    setErrors(errs);
    return errs.length === 0;
  }

  function handleNext() {
    if (validate()) setStep("step2");
  }

  const cifTotal = resources.reduce((s, r) => s + r.amount, 0);
  const cifa = traditionalBaseValue > 0 ? cifTotal / traditionalBaseValue : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-10 text-base">
      <section>
        <h2 className="font-serif text-2xl text-navy mb-1">Partidas de Costos CIF</h2>
        <p className="text-slate-light mb-4">
          Los Costos Indirectos de Fabricación (CIF) son los gastos que no se pueden asignar directamente a un producto. Ingrese cada partida con su costo anual o mensual.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded shadow-sm">
            <thead className="bg-navy text-white">
              <tr>
                <th className="p-3 text-left w-1/2">Partida de costos CIF</th>
                <th className="p-3 text-right w-1/3">Costo anual / mensual</th>
                <th className="p-3 w-16"></th>
              </tr>
            </thead>
            <tbody>
              {resources.map((r) => (
                <tr key={r.id} className="border-b border-gray-100">
                  <td className="p-3">
                    <input
                      type="text"
                      value={r.name}
                      onChange={(e) => updateResource(r.id, "name", e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-base"
                      placeholder="Ej: Costos de preparación"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={r.amount === 0 ? "" : r.amount}
                      onChange={(e) => updateResource(r.id, "amount", numval(e.target.value))}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-base text-right"
                      placeholder="0.00"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <button type="button" onClick={() => removeResource(r.id)}
                      className="text-red-soft hover:text-red-800 text-xl">&times;</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" onClick={addResource}
          className="mt-3 text-base text-navy hover:text-navy-light underline">
          + Agregar partida de costos CIF
        </button>
      </section>

      {resources.length > 0 && (
        <section className="bg-blue-50 border border-navy/20 rounded p-5 space-y-3">
          <h3 className="font-serif text-xl text-navy">CIFA &mdash; Tasa de distribución tradicional</h3>
          <p className="text-slate-light">
            Para el método tradicional (por órdenes), los CIF se reparten usando una tasa calculada como: CIF total &divide; base estimada.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div className="bg-white rounded border border-gray-200 p-3 text-center">
              <span className="text-xs text-slate-light uppercase">CIF Total</span>
              <p className="text-xl font-mono font-bold text-navy">
                S/. {cifTotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <label className="text-sm text-slate block mb-1">Nombre de la base</label>
              <input
                type="text"
                value={traditionalBaseName}
                onChange={(e) => setTraditionalBaseName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-base"
                placeholder="Ej: Costo de Mano de Obra Directa"
              />
            </div>
            <div>
              <label className="text-sm text-slate block mb-1">Valor de la base</label>
              <input
                type="text"
                inputMode="decimal"
                value={traditionalBaseValue === 0 ? "" : traditionalBaseValue}
                onChange={(e) => setTraditionalBaseValue(numval(e.target.value))}
                className="w-full border border-gray-300 rounded px-3 py-2 text-base text-right"
                placeholder="0.00"
              />
            </div>
          </div>
          {traditionalBaseValue > 0 && (
            <p className="text-base text-navy font-semibold">
              Tasa de distribución = S/. {cifa.toFixed(4)} por cada sol de {traditionalBaseName || "la base"}
            </p>
          )}
        </section>
      )}

      {resources.length > 0 && (
        <section>
          <h2 className="font-serif text-2xl text-navy mb-1">Actividades</h2>
          <p className="text-slate-light mb-4">
            Las actividades son las tareas que hace la empresa y que consumen los CIF. Para cada partida de costos, reparta el 100% entre las actividades según el uso estimado (valores anuales o mensuales expresados como porcentaje).
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded shadow-sm">
              <thead className="bg-navy text-white">
                <tr>
                  <th className="p-3 text-left">Actividad</th>
                  {resources.map((r) => (
                    <th key={r.id} className="p-3 text-right text-sm">
                      {r.name || "Partida"}<br /><span className="font-normal">(%)</span>
                    </th>
                  ))}
                  <th className="p-3 w-16"></th>
                </tr>
              </thead>
              <tbody>
                {activities.map((a) => (
                  <tr key={a.id} className="border-b border-gray-100">
                    <td className="p-3">
                      <input
                        type="text"
                        value={a.name}
                        onChange={(e) => updateActivity(a.id, e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-base"
                        placeholder="Ej: Preparación"
                      />
                    </td>
                    {resources.map((r) => {
                      const pct = a.resource_allocations.find((ra) => ra.resource_id === r.id)?.percentage ?? 0;
                      return (
                        <td key={r.id} className="p-3">
                          <input
                            type="text"
                            inputMode="decimal"
                            value={pct === 0 ? "" : pct}
                            onChange={(e) => {
                              const v = numval(e.target.value);
                              updateAllocation(a.id, r.id, Math.min(100, Math.max(0, v)));
                            }}
                            className="w-20 border border-gray-300 rounded px-3 py-2 text-base text-right"
                            placeholder="0"
                          />
                        </td>
                      );
                    })}
                    <td className="p-3 text-center">
                      <button type="button" onClick={() => removeActivity(a.id)}
                        className="text-red-soft hover:text-red-800 text-xl">&times;</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" onClick={addActivity}
            className="mt-3 text-base text-navy hover:text-navy-light underline">
            + Agregar actividad
          </button>
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
        <button type="button" onClick={() => setStep("landing")}
          className="px-6 py-2.5 border border-gray-300 rounded text-slate hover:bg-gray-50 text-base">
          Anterior
        </button>
        <button type="button" onClick={handleNext}
          className="px-6 py-2.5 bg-navy text-white rounded hover:bg-navy-light disabled:opacity-50 text-base"
          disabled={resources.length === 0 || activities.length === 0}>
          Siguiente
        </button>
      </div>
    </div>
  );
}