from pydantic import BaseModel, Field


class ResourceInput(BaseModel):
    id: str
    name: str
    amount: float = Field(gt=0, description="Costo anual/mensual de la partida CIF")


class ResourceAllocation(BaseModel):
    resource_id: str
    percentage: float = Field(ge=0, le=100, description="Porcentaje del recurso asignado a la actividad")


class ActivityInput(BaseModel):
    id: str
    name: str
    resource_allocations: list[ResourceAllocation]


class CostDriverInput(BaseModel):
    id: str
    name: str
    activity_id: str
    total_quantity: float = Field(gt=0, description="Valor anual/mensual estimado del impulsador")


class ProductInput(BaseModel):
    id: str
    name: str
    units_produced: float = Field(gt=0)
    labor_cost: float = Field(ge=0, description="Costo de Mano de Obra Directa")
    material_cost: float = Field(ge=0, description="Costo de Materiales Directos")
    selling_price: float = Field(ge=0, description="Precio de venta total (ingresos)")


class ConsumptionInput(BaseModel):
    product_id: str
    driver_id: str
    quantity: float = Field(ge=0)


class CalculateRequest(BaseModel):
    resources: list[ResourceInput]
    activities: list[ActivityInput]
    cost_drivers: list[CostDriverInput]
    products: list[ProductInput]
    consumptions: list[ConsumptionInput]
    traditional_base_name: str = Field(default="", description="Nombre de la base de prorrateo tradicional")
    traditional_base_value: float = Field(default=0.0, ge=0, description="Valor de la base tradicional")