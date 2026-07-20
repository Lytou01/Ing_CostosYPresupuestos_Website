from pydantic import BaseModel


class ActivityCostResult(BaseModel):
    activity_id: str
    activity_name: str
    total_cost: float


class DriverRateResult(BaseModel):
    driver_id: str
    driver_name: str
    activity_id: str
    activity_name: str
    activity_cost: float
    total_quantity: float
    rate: float


class DriverCostDetail(BaseModel):
    driver_id: str
    driver_name: str
    rate: float
    quantity_consumed: float
    cost: float


class ProductAbcCost(BaseModel):
    product_id: str
    product_name: str
    units_produced: float
    labor_cost: float
    material_cost: float
    direct_costs: float
    indirect_costs: float
    total_cost: float
    unit_cost_abc: float
    selling_price: float
    unit_revenue: float
    unit_margin: float
    driver_costs: list[DriverCostDetail]


class TraditionalCostResult(BaseModel):
    product_id: str
    product_name: str
    units_produced: float
    unit_cost_traditional: float
    total_cost_traditional: float
    diff_vs_abc: float
    diff_pct: float


class CalculateResponse(BaseModel):
    activity_costs: list[ActivityCostResult]
    driver_rates: list[DriverRateResult]
    product_costs: list[ProductAbcCost]
    traditional_costs: list[TraditionalCostResult]
    cif_total: float
    traditional_rate: float