import type { AppStep } from "../../types";

interface StepperProps {
  currentStep: AppStep;
  onStepClick?: (step: AppStep) => void;
}

const steps: { key: AppStep; label: string }[] = [
  { key: "landing", label: "Inicio" },
  { key: "step1", label: "Recursos y Actividades" },
  { key: "step2", label: "Productos e Inductores" },
  { key: "results", label: "Resultados" },
];

export default function Stepper({ currentStep, onStepClick }: StepperProps) {
  const idx = steps.findIndex((s) => s.key === currentStep);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <ol className="flex items-center gap-1 py-3 overflow-x-auto text-sm">
          {steps.map((s, i) => {
            const isActive = i === idx;
            const isDone = i < idx;
            const isClickable = isDone && !!onStepClick;
            return (
              <li key={s.key} className="flex items-center gap-1 shrink-0">
                {i > 0 && (
                  <span className="text-gray-300 mx-1">›</span>
                )}
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onStepClick?.(s.key)}
                  className={`px-2 py-1 rounded transition-colors ${
                    isActive
                      ? "bg-navy text-white font-semibold"
                      : isDone
                        ? isClickable
                          ? "text-navy hover:bg-navy/10 cursor-pointer"
                          : "text-navy/60"
                        : "text-gray-400"
                  }`}
                >
                  {isDone && "✓ "}
                  {s.label}
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}