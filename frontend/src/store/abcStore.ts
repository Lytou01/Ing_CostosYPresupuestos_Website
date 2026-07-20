import { create } from "zustand";
import type {
  CalculateRequest,
  CalculateResponse,
  ResourceInput,
  ActivityInput,
  CostDriverInput,
  ProductInput,
  ConsumptionInput,
  AppStep,
} from "../types";

function genId(): string {
  return crypto.randomUUID();
}

interface AbcState {
  step: AppStep;
  setStep: (step: AppStep) => void;

  resources: ResourceInput[];
  activities: ActivityInput[];
  costDrivers: CostDriverInput[];
  products: ProductInput[];
  consumptions: ConsumptionInput[];
  traditionalBaseName: string;
  traditionalBaseValue: number;

  setResources: (resources: ResourceInput[]) => void;
  setActivities: (activities: ActivityInput[]) => void;
  setCostDrivers: (drivers: CostDriverInput[]) => void;
  setProducts: (products: ProductInput[]) => void;
  setConsumptions: (consumptions: ConsumptionInput[]) => void;
  setTraditionalBaseName: (name: string) => void;
  setTraditionalBaseValue: (value: number) => void;

  result: CalculateResponse | null;
  sensitivityResult: CalculateResponse | null;
  setResult: (r: CalculateResponse) => void;
  setSensitivityResult: (r: CalculateResponse | null) => void;

  loadExample: () => void;
  reset: () => void;
  buildRequest: () => CalculateRequest;
}

const emptyState = {
  step: "landing" as AppStep,
  resources: [] as ResourceInput[],
  activities: [] as ActivityInput[],
  costDrivers: [] as CostDriverInput[],
  products: [] as ProductInput[],
  consumptions: [] as ConsumptionInput[],
  traditionalBaseName: "",
  traditionalBaseValue: 0,
  result: null as CalculateResponse | null,
  sensitivityResult: null as CalculateResponse | null,
};

export const useAbcStore = create<AbcState>((set, get) => ({
  ...emptyState,

  setStep: (step) => set({ step }),
  setResources: (resources) => set({ resources }),
  setActivities: (activities) => set({ activities }),
  setCostDrivers: (drivers) => set({ costDrivers: drivers }),
  setProducts: (products) => set({ products }),
  setConsumptions: (consumptions) => set({ consumptions }),
  setTraditionalBaseName: (traditionalBaseName) => set({ traditionalBaseName }),
  setTraditionalBaseValue: (traditionalBaseValue) => set({ traditionalBaseValue }),

  setResult: (result) => set({ result, step: "results" }),
  setSensitivityResult: (r) => set({ sensitivityResult: r }),

  loadExample: () => {
    const r1 = genId(); const r2 = genId(); const r3 = genId(); const r4 = genId();
    const a1 = genId(); const a2 = genId(); const a3 = genId(); const a4 = genId();
    const d1 = genId(); const d2 = genId(); const d3 = genId(); const d4 = genId();
    const p1 = genId(); const p2 = genId();

    set({
      traditionalBaseName: "Costo de Mano de Obra Directa",
      traditionalBaseValue: 8_000_000,
      resources: [
        { id: r1, name: "Costos de preparación", amount: 4_000_000 },
        { id: r2, name: "Costos de manejo de material", amount: 2_000_000 },
        { id: r3, name: "Depreciación del equipo", amount: 10_000_000 },
        { id: r4, name: "Otros", amount: 24_000_000 },
      ],
      activities: [
        { id: a1, name: "Preparación", resource_allocations: [
          { resource_id: r1, percentage: 100 }, { resource_id: r2, percentage: 0 },
          { resource_id: r3, percentage: 0 }, { resource_id: r4, percentage: 0 },
        ]},
        { id: a2, name: "Manejo de material", resource_allocations: [
          { resource_id: r1, percentage: 0 }, { resource_id: r2, percentage: 100 },
          { resource_id: r3, percentage: 0 }, { resource_id: r4, percentage: 0 },
        ]},
        { id: a3, name: "Depreciación equipo", resource_allocations: [
          { resource_id: r1, percentage: 0 }, { resource_id: r2, percentage: 0 },
          { resource_id: r3, percentage: 100 }, { resource_id: r4, percentage: 0 },
        ]},
        { id: a4, name: "Otros", resource_allocations: [
          { resource_id: r1, percentage: 0 }, { resource_id: r2, percentage: 0 },
          { resource_id: r3, percentage: 0 }, { resource_id: r4, percentage: 100 },
        ]},
      ],
      costDrivers: [
        { id: d1, name: "Número de preparaciones", activity_id: a1, total_quantity: 1000 },
        { id: d2, name: "Número de requisiciones de materiales", activity_id: a2, total_quantity: 2000 },
        { id: d3, name: "Número de horas máquina", activity_id: a3, total_quantity: 20000 },
        { id: d4, name: "Número de puntos de trabajo", activity_id: a4, total_quantity: 3000 },
      ],
      products: [
        { id: p1, name: "Pala modelo 350", units_produced: 85000, labor_cost: 91800, material_cost: 153000, selling_price: 765000 },
        { id: p2, name: "Podadora modelo 600", units_produced: 800, labor_cost: 12000, material_cost: 48000, selling_price: 240000 },
      ],
      consumptions: [
        { product_id: p1, driver_id: d1, quantity: 2 },
        { product_id: p1, driver_id: d2, quantity: 3 },
        { product_id: p1, driver_id: d3, quantity: 40 },
        { product_id: p1, driver_id: d4, quantity: 1 },
        { product_id: p2, driver_id: d1, quantity: 5 },
        { product_id: p2, driver_id: d2, quantity: 50 },
        { product_id: p2, driver_id: d3, quantity: 100 },
        { product_id: p2, driver_id: d4, quantity: 15 },
      ],
    });
  },

  reset: () => set({ ...emptyState }),

  buildRequest: () => {
    const s = get();
    return {
      resources: s.resources,
      activities: s.activities,
      cost_drivers: s.costDrivers,
      products: s.products,
      consumptions: s.consumptions,
      traditional_base_name: s.traditionalBaseName,
      traditional_base_value: s.traditionalBaseValue,
    };
  },
}));