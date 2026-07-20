import { useAbcStore } from "../store/abcStore";

export default function LandingPage() {
  const { setStep, loadExample, reset } = useAbcStore();

  function handleStart() { reset(); setStep("step1"); }
  function handleLoadExample() { reset(); loadExample(); setStep("step1"); }

  return (
    <div className="max-w-3xl mx-auto text-center py-12 space-y-8 text-base">
      <div>
        <h1 className="font-serif text-4xl text-navy mb-3">Sistema de Costeo ABC</h1>
        <p className="text-slate-light text-lg max-w-xl mx-auto">
          Calcule el costo real de sus productos usando el método de Costeo Basado en Actividades. Sepa exactamente cuánto le cuesta producir cada cosa.
        </p>
      </div>

      <div className="bg-white rounded shadow-sm p-6 border border-gray-200 max-w-lg mx-auto">
        <h2 className="font-serif text-2xl text-navy mb-4">¿Cómo funciona?</h2>
        <div className="flex items-center justify-center gap-2 text-base text-slate mb-6">
          <span className="bg-navy text-white px-3 py-1.5 rounded">CIF</span>
          <span className="text-gray-400">&rarr;</span>
          <span className="bg-navy text-white px-3 py-1.5 rounded">Actividades</span>
          <span className="text-gray-400">&rarr;</span>
          <span className="bg-navy text-white px-3 py-1.5 rounded">Productos</span>
        </div>
        <p className="text-base text-slate-light mb-6">
          El método ABC primero reparte los costos indirectos de fabricación (CIF) entre las actividades de la empresa, y luego asigna esos costos a los productos según el uso real que cada producto hace de cada actividad. Así se obtiene un costo más preciso que con el método tradicional.
        </p>
        <div className="flex flex-col gap-3">
          <button onClick={handleStart}
            className="w-full py-3 bg-navy text-white rounded hover:bg-navy-light font-semibold text-lg">
            Comenzar
          </button>
          <button onClick={handleLoadExample}
            className="w-full py-2 border border-gold text-gold rounded hover:bg-gold/10 text-base">
            Ver ejemplo: JOAA &mdash; Pala vs Podadora
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-2xl mx-auto">
        <div className="bg-white rounded shadow-sm p-4 border border-gray-200">
          <div className="text-2xl text-navy mb-1">1</div>
          <h3 className="font-serif text-lg text-navy mb-1">Ingrese sus datos</h3>
          <p className="text-sm text-slate-light">Partidas CIF, actividades, impulsadores de costos y productos.</p>
        </div>
        <div className="bg-white rounded shadow-sm p-4 border border-gray-200">
          <div className="text-2xl text-navy mb-1">2</div>
          <h3 className="font-serif text-lg text-navy mb-1">Calcule</h3>
          <p className="text-sm text-slate-light">El sistema aplica el método ABC y tradicional mostrando el desglose completo.</p>
        </div>
        <div className="bg-white rounded shadow-sm p-4 border border-gray-200">
          <div className="text-2xl text-navy mb-1">3</div>
          <h3 className="font-serif text-lg text-navy mb-1">Analice</h3>
          <p className="text-sm text-slate-light">Compare ambos métodos y pruebe escenarios moviendo los sliders.</p>
        </div>
      </div>
    </div>
  );
}