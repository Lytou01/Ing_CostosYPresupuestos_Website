# AGENT.md — Contexto para Agentes de IA

## 1. Comandos de ejecución y prueba

### Backend (FastAPI)
- **Instalación de dependencias**: `pip install -r backend/requirements.txt`
- **Ejecutar servidor de desarrollo**: `uvicorn backend.main:app --reload --port 8000`
- **Ejecutar pruebas**: `pytest backend/tests/`
- **Ejecutar pruebas con cobertura**: `pytest --cov=backend backend/tests/`
- **Formatear código**: `black backend/`
- **Lint**: `flake8 backend/`

### Frontend (React + Vite)
- **Instalación de dependencias**: `npm install` (dentro de `frontend/`)
- **Ejecutar servidor de desarrollo**: `npm run dev` (abre en http://localhost:5173)
- **Construir para producción**: `npm run build`
- **Vista previa de producción**: `npm run preview`
- **Ejecutar pruebas**: `npm test`
- **Ejecutar pruebas con cobertura**: `npm run test:coverage`
- **Formatear código**: `npm run format` (Prettier)
- **Lint**: `npm run lint` (ESLint)

### Comandos combinados (desde la raíz)
- **Ejecutar todo (backend + frontend)**: `npm run dev:all`
- **Pruebas completas**: `npm run test:all`
- **Instalar todo**: `npm run install:all`

---

## 2. Verificación de éxito

Una tarea se considera **terminada solo si**:
- El código de salida de todos los comandos de prueba es **cero (0)**.
- No hay errores de lint ni de formato.
- La cobertura de pruebas es ≥ 80% (tanto para backend como para frontend).
- El servidor de desarrollo arranca sin errores en los puertos esperados.
- La API de FastAPI responde en `http://localhost:8000/docs` con la documentación Swagger generada automáticamente.

---

## 3. Guías de código

### Estándar de lenguaje y versiones
- **Backend**: Python 3.11+, FastAPI 0.115+, Pydantic 2.x, SQLAlchemy 2.x, pytest 8.x.
- **Frontend**: React 19+, TypeScript 5.x, Vite 6.x, Vitest 3.x, ESLint 9.x, Prettier 3.x.
- **Manejo de estado**: Preferir React Context o Zustand; evitar Redux a menos que sea estrictamente necesario.
- **Estilo de API**: RESTful con esquemas Pydantic para validación.

### Formato de estilo
- **Backend**: PEP 8. Black con ancho de línea 88. Flake8 con configuración estándar.
- **Frontend**: ESLint con configuración estándar. Prettier con configuración por defecto.
- **Nombrado**:
  - Backend: `snake_case` para variables y funciones, `PascalCase` para clases.
  - Frontend: `camelCase` para variables y funciones, `PascalCase` para componentes React.
- **Comentarios**: Documentar funciones complejas con docstrings (Python) o JSDoc (TypeScript). Mantener los comentarios en español o inglés, pero ser consistente.

---

## 4. Restricciones y flujos de trabajo

### Lo que NO se debe hacer
- **Nunca** usar bucles anidados de más de 2 niveles sin una razón justificada y documentada.
- **Nunca** hardcodear credenciales, URLs o configuraciones sensibles. Usar variables de entorno (`.env`).
- **Nunca** escribir pruebas que dependan del orden de ejecución (deben ser independientes).
- **Nunca** modificar directamente el estado global desde componentes React; usar hooks o stores.
- **Nunca** ignorar los errores de tipo de TypeScript; el proyecto debe compilar con `tsc --noEmit` sin errores.

### Flujo de trabajo para añadir nuevas funcionalidades
1. **Backend**:
   - Crear un nuevo endpoint en `backend/routers/` (si aplica).
   - Definir esquemas Pydantic en `backend/schemas/`.
   - Añadir lógica de negocio en `backend/services/`.
   - Escribir pruebas unitarias en `backend/tests/`.
   - Actualizar la documentación Swagger automáticamente (FastAPI lo hace solo).

2. **Frontend**:
   - Crear un nuevo componente en `frontend/src/components/`.
   - Añadir la página o vista en `frontend/src/pages/`.
   - Configurar el enrutamiento en `frontend/src/App.tsx` (usar React Router).
   - Escribir pruebas unitarias con Vitest en `frontend/src/__tests__/`.
   - Asegurar que el componente sea accesible (WCAG 2.1 AA).

3. **Análisis de sensibilidad** (funcionalidad especial):
   - La lógica de simulación de escenarios debe estar en el backend (FastAPI).
   - El frontend debe enviar los parámetros del escenario vía POST y recibir los resultados en JSON.
   - Los resultados deben mostrarse en tablas y gráficos (usar Chart.js o Recharts).

### Flujo de trabajo para despliegue
- **Desarrollo**: Usar `npm run dev` para frontend y `uvicorn` para backend. Ambos en puertos diferentes con CORS configurado.
- **Producción**: Construir el frontend (`npm run build`) y servir los archivos estáticos desde FastAPI (usando `StaticFiles`). O desplegar por separado (frontend en Vercel/Netlify, backend en Railway/AWS).

---

## 5. Documentación y recursos
- La página web debe ser **explicativa**: debe mostrar tooltips, ejemplos y descripciones de cada paso del costeo ABC mientras el usuario interactúa.
- Incluir una sección de "Ayuda" o "Tutorial" que guíe al usuario paso a paso.
- El diseño debe ser **profesional y minimalista**, estilo tradicional (colores neutros, tipografía serif o sans-serif clásica, sin efectos exagerados), que transmita confianza y seriedad.

---

## 6. Skills instalados (referencia)

Ver `SKILLS_INSTALLED.md` para la lista completa de skills de agente y dependencias técnicas instaladas.

Resumen de skills de IA instalados:
| Skill | Fuente | Propósito |
|-------|--------|-----------|
| fastapi-python | mindrally/skills | Backend FastAPI |
| react | pedronauck/skills | Frontend React |
| vitest | jezweb/claude-skills | Testing frontend |
| pytest | bobmatnyc/claude-mpm-skills | Testing backend |
| eslint-prettier-config | patricio0312rev/skills | Formato frontend |
| storybook-stories | pedronauck/skills | Documentación componentes |
| devops-engineer | pedronauck/skills | Docker/CI-CD/Despliegue |
