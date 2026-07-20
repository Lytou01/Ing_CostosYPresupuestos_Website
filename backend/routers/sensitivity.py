from fastapi import APIRouter

from schemas.input_models import CalculateRequest
from schemas.output_models import CalculateResponse
from services.abc_engine import run_abc_calculation

router = APIRouter(prefix="/api", tags=["sensitivity"])


@router.post("/sensitivity", response_model=CalculateResponse)
def sensitivity(data: CalculateRequest) -> CalculateResponse:
    return run_abc_calculation(data)