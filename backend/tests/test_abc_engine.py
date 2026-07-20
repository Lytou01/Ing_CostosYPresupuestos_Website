import pytest
from schemas.input_models import (
    CalculateRequest,
    ResourceInput,
    ActivityInput,
    ResourceAllocation,
    CostDriverInput,
    ProductInput,
    ConsumptionInput,
)
from services.abc_engine import run_abc_calculation


@pytest.fixture
def joaa_data():
    return CalculateRequest(
        resources=[
            ResourceInput(id="r1", name="Costos de preparacion", amount=4_000_000.0),
            ResourceInput(id="r2", name="Costos de manejo de material", amount=2_000_000.0),
            ResourceInput(id="r3", name="Depreciacion del equipo", amount=10_000_000.0),
            ResourceInput(id="r4", name="Otros", amount=24_000_000.0),
        ],
        activities=[
            ActivityInput(
                id="a1",
                name="Preparacion",
                resource_allocations=[
                    ResourceAllocation(resource_id="r1", percentage=100.0),
                    ResourceAllocation(resource_id="r2", percentage=0.0),
                    ResourceAllocation(resource_id="r3", percentage=0.0),
                    ResourceAllocation(resource_id="r4", percentage=0.0),
                ],
            ),
            ActivityInput(
                id="a2",
                name="Manejo de material",
                resource_allocations=[
                    ResourceAllocation(resource_id="r1", percentage=0.0),
                    ResourceAllocation(resource_id="r2", percentage=100.0),
                    ResourceAllocation(resource_id="r3", percentage=0.0),
                    ResourceAllocation(resource_id="r4", percentage=0.0),
                ],
            ),
            ActivityInput(
                id="a3",
                name="Depreciacion equipo",
                resource_allocations=[
                    ResourceAllocation(resource_id="r1", percentage=0.0),
                    ResourceAllocation(resource_id="r2", percentage=0.0),
                    ResourceAllocation(resource_id="r3", percentage=100.0),
                    ResourceAllocation(resource_id="r4", percentage=0.0),
                ],
            ),
            ActivityInput(
                id="a4",
                name="Otros",
                resource_allocations=[
                    ResourceAllocation(resource_id="r1", percentage=0.0),
                    ResourceAllocation(resource_id="r2", percentage=0.0),
                    ResourceAllocation(resource_id="r3", percentage=0.0),
                    ResourceAllocation(resource_id="r4", percentage=100.0),
                ],
            ),
        ],
        cost_drivers=[
            CostDriverInput(id="d1", name="Numero de preparaciones", activity_id="a1", total_quantity=1000.0),
            CostDriverInput(id="d2", name="Numero de requisiciones de materiales", activity_id="a2", total_quantity=2000.0),
            CostDriverInput(id="d3", name="Numero de horas maquina", activity_id="a3", total_quantity=20000.0),
            CostDriverInput(id="d4", name="Numero de puntos de trabajo", activity_id="a4", total_quantity=3000.0),
        ],
        products=[
            ProductInput(
                id="p1", name="Pala modelo 350",
                units_produced=85000.0, labor_cost=91800.0,
                material_cost=153000.0, selling_price=765000.0,
            ),
            ProductInput(
                id="p2", name="Podadora modelo 600",
                units_produced=800.0, labor_cost=12000.0,
                material_cost=48000.0, selling_price=240000.0,
            ),
        ],
        consumptions=[
            ConsumptionInput(product_id="p1", driver_id="d1", quantity=2.0),
            ConsumptionInput(product_id="p1", driver_id="d2", quantity=3.0),
            ConsumptionInput(product_id="p1", driver_id="d3", quantity=40.0),
            ConsumptionInput(product_id="p1", driver_id="d4", quantity=1.0),
            ConsumptionInput(product_id="p2", driver_id="d1", quantity=5.0),
            ConsumptionInput(product_id="p2", driver_id="d2", quantity=50.0),
            ConsumptionInput(product_id="p2", driver_id="d3", quantity=100.0),
            ConsumptionInput(product_id="p2", driver_id="d4", quantity=15.0),
        ],
        traditional_base_name="Costo de Mano de Obra Directa",
        traditional_base_value=8_000_000.0,
    )


class TestAbcEngine:
    def test_cif_total(self, joaa_data):
        result = run_abc_calculation(joaa_data)
        assert result.cif_total == 40_000_000.0

    def test_stage1_activity_costs(self, joaa_data):
        result = run_abc_calculation(joaa_data)
        costs = {a.activity_name: a.total_cost for a in result.activity_costs}
        assert costs["Preparacion"] == 4_000_000.0
        assert costs["Manejo de material"] == 2_000_000.0
        assert costs["Depreciacion equipo"] == 10_000_000.0
        assert costs["Otros"] == 24_000_000.0

    def test_traditional_rate(self, joaa_data):
        result = run_abc_calculation(joaa_data)
        assert result.traditional_rate == pytest.approx(5.0, rel=1e-6)

    def test_driver_rates(self, joaa_data):
        result = run_abc_calculation(joaa_data)
        rates = {d.driver_name: d.rate for d in result.driver_rates}
        assert rates["Numero de preparaciones"] == 4000.0
        assert rates["Numero de requisiciones de materiales"] == 1000.0
        assert rates["Numero de horas maquina"] == 500.0
        assert rates["Numero de puntos de trabajo"] == 8000.0

    def test_pala_abc(self, joaa_data):
        result = run_abc_calculation(joaa_data)
        pala = next(p for p in result.product_costs if p.product_name == "Pala modelo 350")

        indirect_expected = 2 * 4000 + 3 * 1000 + 40 * 500 + 1 * 8000
        assert pala.indirect_costs == pytest.approx(indirect_expected, rel=1e-6)
        assert pala.direct_costs == pytest.approx(91800 + 153000, rel=1e-6)
        total = 91800 + 153000 + indirect_expected
        assert pala.total_cost == pytest.approx(total, rel=1e-6)
        assert pala.unit_cost_abc == pytest.approx(round(total / 85000, 4), rel=1e-6)

    def test_podadora_abc(self, joaa_data):
        result = run_abc_calculation(joaa_data)
        pod = next(p for p in result.product_costs if p.product_name == "Podadora modelo 600")

        indirect_expected = 5 * 4000 + 50 * 1000 + 100 * 500 + 15 * 8000
        assert pod.indirect_costs == pytest.approx(indirect_expected, rel=1e-6)
        assert pod.direct_costs == pytest.approx(12000 + 48000, rel=1e-6)
        total = 12000 + 48000 + indirect_expected
        assert pod.total_cost == pytest.approx(total, rel=1e-6)
        assert pod.unit_cost_abc == pytest.approx(total / 800, rel=1e-6)

    def test_traditional_costing(self, joaa_data):
        result = run_abc_calculation(joaa_data)
        trad = {t.product_name: t for t in result.traditional_costs}

        pala_trad = trad["Pala modelo 350"]
        pala_indirect_trad = 91800 * 5
        pala_total_trad = 91800 + 153000 + pala_indirect_trad
        assert pala_trad.total_cost_traditional == pytest.approx(pala_total_trad, rel=1e-6)
        assert pala_trad.unit_cost_traditional == pytest.approx(pala_total_trad / 85000, rel=1e-6)

        pod_trad = trad["Podadora modelo 600"]
        pod_indirect_trad = 12000 * 5
        pod_total_trad = 12000 + 48000 + pod_indirect_trad
        assert pod_trad.total_cost_traditional == pytest.approx(pod_total_trad, rel=1e-6)
        assert pod_trad.unit_cost_traditional == pytest.approx(pod_total_trad / 800, rel=1e-6)

    def test_comparison_differences(self, joaa_data):
        result = run_abc_calculation(joaa_data)
        pala_abc = next(p for p in result.product_costs if p.product_name == "Pala modelo 350")
        pala_trad = next(t for t in result.traditional_costs if t.product_name == "Pala modelo 350")
        pod_abc = next(p for p in result.product_costs if p.product_name == "Podadora modelo 600")
        pod_trad = next(t for t in result.traditional_costs if t.product_name == "Podadora modelo 600")

        assert pala_trad.diff_vs_abc < 0
        assert pala_trad.diff_pct < 0
        assert pod_trad.diff_vs_abc > 0
        assert pod_trad.diff_pct > 0

    def test_margins(self, joaa_data):
        result = run_abc_calculation(joaa_data)
        pala = next(p for p in result.product_costs if p.product_name == "Pala modelo 350")
        assert pala.unit_revenue == pytest.approx(765000 / 85000, rel=1e-6)
        assert pala.unit_margin == pytest.approx(pala.unit_revenue - pala.unit_cost_abc, rel=1e-6)