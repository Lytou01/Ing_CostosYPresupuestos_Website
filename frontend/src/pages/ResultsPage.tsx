import { useAbcStore } from "../store/abcStore";
import ComparativaPrincipal from "../components/output/ComparativaPrincipal";
import TablaActividades from "../components/output/TablaActividades";
import TablaTasas from "../components/output/TablaTasas";
import GraficoBarras from "../components/output/GraficoBarras";
import GraficoTorta from "../components/output/GraficoTorta";
import GraficoComparativo from "../components/output/GraficoComparativo";
import SensitivityPanel from "../components/sensitivity/SensitivityPanel";

export default function ResultsPage() {
  const { result, setStep, reset } = useAbcStore();

  if (!result) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 text-base">
        <p className="text-slate-light mb-4">No hay resultados todavía. Ingrese los datos primero.</p>
        <button onClick={() => setStep("landing")}
          className="px-6 py-3 bg-navy text-white rounded hover:bg-navy-light text-base">
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 max-w-6xl mx-auto space-y-10 text-base">
      <div className="flex justify-between items-center">
        <h2 className="font-serif text-3xl text-navy">Resultados del Costeo</h2>
        <div className="flex gap-3">
          <button onClick={() => setStep("step2")}
            className="px-5 py-2 border border-gray-300 rounded text-slate hover:bg-gray-50 text-base">
            Modificar datos
          </button>
          <button onClick={() => { reset(); setStep("landing"); }}
            className="px-5 py-2 border border-gray-300 rounded text-slate hover:bg-gray-50 text-base">
            Nuevo análisis
          </button>
        </div>
      </div>

      <ComparativaPrincipal />

      <hr className="border-gray-200" />

      <TablaActividades />
      <TablaTasas />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GraficoBarras />
        <GraficoTorta />
      </div>

      <GraficoComparativo />
      <SensitivityPanel />
    </div>
  );
}