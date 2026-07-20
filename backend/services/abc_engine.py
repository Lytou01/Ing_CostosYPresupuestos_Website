from schemas.input_models import CalculateRequest
from schemas.output_models import (
    ActivityCostResult,
    DriverRateResult,
    DriverCostDetail,
    ProductAbcCost,
    TraditionalCostResult,
    CalculateResponse,
)


def _build_lookup(items: list, key: str = "id") -> dict:
    return {getattr(item, key): item for item in items}


def run_abc_calculation(data: CalculateRequest) -> CalculateResponse:
    resources = _build_lookup(data.resources)
    activities = _build_lookup(data.activities)
    drivers = _build_lookup(data.cost_drivers)
    products = _build_lookup(data.products)

    cif_total = sum(r.amount for r in data.resources)

    activity_costs: dict[str, float] = {}
    for act in data.activities:
        total = 0.0
        for alloc in act.resource_allocations:
            resource = resources.get(alloc.resource_id)
            if resource:
                total += resource.amount * (alloc.percentage / 100.0)
        activity_costs[act.id] = total

    driver_rates: dict[str, float] = {}
    driver_rate_results: list[DriverRateResult] = []
    for drv in data.cost_drivers:
        act_cost = activity_costs.get(drv.activity_id, 0.0)
        rate = act_cost / drv.total_quantity if drv.total_quantity > 0 else 0.0
        driver_rates[drv.id] = rate
        act = activities.get(drv.activity_id)
        driver_rate_results.append(
            DriverRateResult(
                driver_id=drv.id,
                driver_name=drv.name,
                activity_id=drv.activity_id,
                activity_name=act.name if act else "",
                activity_cost=act_cost,
                total_quantity=drv.total_quantity,
                rate=round(rate, 4),
            )
        )

    product_costs: list[ProductAbcCost] = []
    for prod in data.products:
        indirect = 0.0
        driver_details: list[DriverCostDetail] = []
        for cons in data.consumptions:
            if cons.product_id != prod.id:
                continue
            rate = driver_rates.get(cons.driver_id, 0.0)
            cost = rate * cons.quantity
            indirect += cost
            drv = drivers.get(cons.driver_id)
            driver_details.append(
                DriverCostDetail(
                    driver_id=cons.driver_id,
                    driver_name=drv.name if drv else "",
                    rate=rate,
                    quantity_consumed=cons.quantity,
                    cost=round(cost, 2),
                )
            )

        direct = prod.labor_cost + prod.material_cost
        total_cost = direct + indirect
        unit_cost = total_cost / prod.units_produced if prod.units_produced > 0 else 0.0
        unit_revenue = prod.selling_price / prod.units_produced if prod.units_produced > 0 else 0.0

        product_costs.append(
            ProductAbcCost(
                product_id=prod.id,
                product_name=prod.name,
                units_produced=prod.units_produced,
                labor_cost=prod.labor_cost,
                material_cost=prod.material_cost,
                direct_costs=round(direct, 2),
                indirect_costs=round(indirect, 2),
                total_cost=round(total_cost, 2),
                unit_cost_abc=round(unit_cost, 4),
                selling_price=prod.selling_price,
                unit_revenue=round(unit_revenue, 4),
                unit_margin=round(unit_revenue - unit_cost, 4),
                driver_costs=driver_details,
            )
        )

    trad_rate = 0.0
    if data.traditional_base_value > 0:
        trad_rate = cif_total / data.traditional_base_value

    traditional_costs: list[TraditionalCostResult] = []
    abc_by_id = {p.product_id: p for p in product_costs}
    for prod in data.products:
        abc = abc_by_id.get(prod.id)
        abc_unit = abc.unit_cost_abc if abc else 0.0

        indirect_trad = prod.labor_cost * trad_rate
        direct = prod.labor_cost + prod.material_cost
        total_trad = direct + indirect_trad
        unit_trad = total_trad / prod.units_produced if prod.units_produced > 0 else 0.0

        diff = abc_unit - unit_trad
        diff_pct = (diff / unit_trad * 100) if unit_trad != 0 else 0.0

        traditional_costs.append(
            TraditionalCostResult(
                product_id=prod.id,
                product_name=prod.name,
                units_produced=prod.units_produced,
                unit_cost_traditional=round(unit_trad, 4),
                total_cost_traditional=round(total_trad, 2),
                diff_vs_abc=round(diff, 4),
                diff_pct=round(diff_pct, 2),
            )
        )

    return CalculateResponse(
        activity_costs=[
            ActivityCostResult(
                activity_id=act.id,
                activity_name=act.name,
                total_cost=round(activity_costs[act.id], 2),
            )
            for act in data.activities
        ],
        driver_rates=driver_rate_results,
        product_costs=product_costs,
        traditional_costs=traditional_costs,
        cif_total=round(cif_total, 2),
        traditional_rate=round(trad_rate, 4),
    )