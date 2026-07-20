export interface ResourceInput {
  id: string;
  name: string;
  amount: number;
}

export interface ResourceAllocation {
  resource_id: string;
  percentage: number;
}

export interface ActivityInput {
  id: string;
  name: string;
  resource_allocations: ResourceAllocation[];
}

export interface CostDriverInput {
  id: string;
  name: string;
  activity_id: string;
  total_quantity: number;
}

export interface ProductInput {
  id: string;
  name: string;
  units_produced: number;
  labor_cost: number;
  material_cost: number;
  selling_price: number;
}

export interface ConsumptionInput {
  product_id: string;
  driver_id: string;
  quantity: number;
}

export interface CalculateRequest {
  resources: ResourceInput[];
  activities: ActivityInput[];
  cost_drivers: CostDriverInput[];
  products: ProductInput[];
  consumptions: ConsumptionInput[];
  traditional_base_name: string;
  traditional_base_value: number;
}

export interface ActivityCostResult {
  activity_id: string;
  activity_name: string;
  total_cost: number;
}

export interface DriverRateResult {
  driver_id: string;
  driver_name: string;
  activity_id: string;
  activity_name: string;
  activity_cost: number;
  total_quantity: number;
  rate: number;
}

export interface DriverCostDetail {
  driver_id: string;
  driver_name: string;
  rate: number;
  quantity_consumed: number;
  cost: number;
}

export interface ProductAbcCost {
  product_id: string;
  product_name: string;
  units_produced: number;
  labor_cost: number;
  material_cost: number;
  direct_costs: number;
  indirect_costs: number;
  total_cost: number;
  unit_cost_abc: number;
  selling_price: number;
  unit_revenue: number;
  unit_margin: number;
  driver_costs: DriverCostDetail[];
}

export interface TraditionalCostResult {
  product_id: string;
  product_name: string;
  units_produced: number;
  unit_cost_traditional: number;
  total_cost_traditional: number;
  diff_vs_abc: number;
  diff_pct: number;
}

export interface CalculateResponse {
  activity_costs: ActivityCostResult[];
  driver_rates: DriverRateResult[];
  product_costs: ProductAbcCost[];
  traditional_costs: TraditionalCostResult[];
  cif_total: number;
  traditional_rate: number;
}

export type AppStep = "landing" | "step1" | "step2" | "results";