from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.calculate import router as calculate_router
from routers.sensitivity import router as sensitivity_router

app = FastAPI(
    title="Sistema de Costeo ABC",
    description="API para el sistema de costeo basado en actividades (ABC) con analisis de sensibilidad",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(calculate_router)
app.include_router(sensitivity_router)


@app.get("/api/health")
async def health():
    return {"status": "ok"}
