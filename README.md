# Ing_CostosYPresupuestos_Website

Sistema de Costeo ABC (Activity Based Costing) con análisis de sensibilidad.

**Universidad Nacional Federico Villarreal**  
Facultad de Ingeniería Industrial y de Sistemas  
Escuela Profesional de Ingeniería de Sistemas  

**Docente**: Ing. Jose Orlando Alvarado Alvarado  

**Integrantes**: Donayre Aguilar, Fabrizio Julio | Roberto Saavedra Crispín, Leonardo Jesús | Chávez Curihuamán, Michael Jaren | Corimanya Vera, Iro Louis | Huamantalla Huaranca, John Samuel  

---

## Stack

- **Backend**: FastAPI + Pydantic + NumPy
- **Frontend**: React 19 + TypeScript + Vite + Recharts + Zustand + Tailwind CSS

## Ejecución

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --port 8000

# Frontend
cd frontend
npm install
npm run dev
```

Abrir `http://localhost:5173`

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Estado del servidor |
| POST | `/api/calculate` | Costeo ABC + Tradicional |
| POST | `/api/sensitivity` | Análisis de sensibilidad |

## Tests

```bash
cd backend
pytest tests/ -v
```