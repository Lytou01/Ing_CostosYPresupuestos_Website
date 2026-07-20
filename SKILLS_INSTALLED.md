# Skills Instalados

A continuación se listan los skills instalados para que un agente de IA (OpenCode / Claude Code / GitHub Copilot) pueda trabajar eficientemente en este proyecto.

---

## 1. FastAPI + Python (`mindrally/skills@fastapi-python`)
- **Propósito**: Guía de scaffolding, estructura y mejores prácticas para backend con FastAPI en Python.
- **Instalaciones**: 11.3K
- **Por qué**: Es el skill más popular y completo para FastAPI. Cubre desde la estructura de carpetas hasta patrones de inyección de dependencias y documentación OpenAPI.
- **Comando**: `npx skills add mindrally/skills@fastapi-python -g -y`

## 2. React (`pedronauck/skills@react`)
- **Propósito**: Patrones y mejores prácticas para React moderno (hooks, composición, rendimiento).
- **Instalaciones**: 10K+
- **Por qué**: De pedronauck, fuente confiable con amplia adopción. Enfocado en React funcional y TypeScript.
- **Comando**: `npx skills add pedronauck/skills@react -g -y`

## 3. Vitest (`jezweb/claude-skills@vitest`)
- **Propósito**: Configuración y guía de testing para frontend con Vitest.
- **Instalaciones**: 1.4K
- **Por qué**: Vitest es el framework de testing estándar para Vite. Este skill cubre configuración, mocks, y patrones de prueba.
- **Comando**: `npx skills add jezweb/claude-skills@vitest -g -y`

## 4. Pytest (`bobmatnyc/claude-mpm-skills@pytest`)
- **Propósito**: Configuración y buenas prácticas de testing para Python con pytest.
- **Instalaciones**: 1.1K
- **Por qué**: pytest es el framework de pruebas estándar en Python. Este skill incluye configuración de cobertura y patrones comunes.
- **Comando**: `npx skills add bobmatnyc/claude-mpm-skills@pytest -g -y`

## 5. ESLint + Prettier (`patricio0312rev/skills@eslint-prettier-config`)
- **Propósito**: Configuración unificada de ESLint y Prettier para proyectos frontend.
- **Instalaciones**: 881
- **Por qué**: Proporciona una configuración lista para usar que garantiza consistencia en el código TypeScript/React.
- **Nota**: Marca "Critical Risk" en Gen Security Assessment — revisar contenido del skill antes de usar.
- **Comando**: `npx skills add patricio0312rev/skills@eslint-prettier-config -g -y`

## 6. Storybook Stories (`pedronauck/skills@storybook-stories`)
- **Propósito**: Guía para escribir historias de Storybook para componentes React.
- **Instalaciones**: 5K+
- **Por qué**: Storybook permite documentar y desarrollar componentes de forma aislada. Este skill cubre writing stories, play functions y testing visual.
- **Comando**: `npx skills add pedronauck/skills@storybook-stories -g -y`

## 7. DevOps Engineer (`pedronauck/skills@devops-engineer`)
- **Propósito**: Configuración de Docker, CI/CD, despliegue y operaciones.
- **Instalaciones**: 206
- **Por qué**: Proporciona guías para Dockerizar la aplicación, configurar pipelines CI/CD y estrategias de despliegue.
- **Comando**: `npx skills add pedronauck/skills@devops-engineer -g -y`

---

## Dependencias de proyecto (no skills)

Además de los skills de agente, el proyecto tiene dependencias técnicas tradicionales:

### Backend (`backend/requirements.txt`)
| Paquete | Versión | Propósito |
|---------|---------|-----------|
| fastapi | >=0.115.0 | Framework web |
| uvicorn | >=0.30.0 | Servidor ASGI |
| pydantic | >=2.0.0 | Validación de datos |
| pydantic-settings | >=2.0.0 | Configuración por entorno |
| sqlalchemy | >=2.0.0 | ORM para base de datos |
| alembic | >=1.13.0 | Migraciones de BD |
| pytest | >=8.0.0 | Testing |
| pytest-cov | >=5.0.0 | Cobertura de pruebas |
| httpx | >=0.27.0 | Cliente HTTP para tests |
| black | >=24.0.0 | Formateador de código |
| flake8 | >=7.0.0 | Linter |
| numpy | >=1.26.0 | Cálculos numéricos |
| scipy | >=1.13.0 | Análisis de sensibilidad |

### Frontend (`frontend/package.json`)
| Paquete | Versión | Propósito |
|---------|---------|-----------|
| react | ^19.0.0 | UI library |
| react-dom | ^19.0.0 | Renderizado DOM |
| react-router-dom | ^7.0.0 | Enrutamiento |
| recharts | ^2.13.0 | Gráficos (análisis de sensibilidad) |
| zustand | ^5.0.0 | Manejo de estado |
| vite | ^6.0.0 | Bundler / dev server |
| vitest | ^3.0.0 | Testing |
| typescript | ^5.6.0 | Type checking |
| eslint | ^9.0.0 | Linter |
| prettier | ^3.4.0 | Formateador |

---

## Ubicación de los skills

Los skills se instalaron en dos lugares:
1. **Global**: `~\.agents\skills\` — disponibles para cualquier proyecto
2. **Local del proyecto**: `.agents\skills\` — vinculados a este repositorio

Para actualizar todos los skills:
```bash
npx skills update
```

Para buscar más skills:
```bash
npx skills find <término>
```
