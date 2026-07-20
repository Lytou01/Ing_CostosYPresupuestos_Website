from fastapi import APIRouter
from schemas.input_models import CalculateRequest
from schemas.output_models import CalculateResponse
from services.abc_engine import run_abc_calculation

router = APIRouter(prefix="/api", tags=["calculate"])


@router.post("/calculate", response_model=CalculateResponse)
def calculate(data: CalculateRequest) -> CalculateResponse:
    return run_abc_calculation(data)