from copy import deepcopy

from schemas.input_models import CalculateRequest
from schemas.output_models import CalculateResponse
from services.abc_engine import run_abc_calculation

SENSITIVITY_FIELDS = {
    "resource_amounts": "resources",
    "activity_allocations": "activities",
    "driver_totals": "cost_drivers",
    "product_units": "products",
    "product_direct_costs": "products",
    "product_mod_hours": "products",
    "product_machine_hours": "products",
    "consumption_quantities": "consumptions",
}


class SensitivityRequest(CalculateRequest):
    pass


def run_sensitivity(base_data: CalculateRequest, modified_data: CalculateRequest) -> dict:
    base_result = run_abc_calculation(base_data)
    modified_result = run_abc_calculation(modified_data)

    return {
        "base": base_result.model_dump(),
        "modified": modified_result.model_dump(),
    }