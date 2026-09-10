# Playwright Test Automation

Proyecto de automatización de pruebas **Web UI y API** desarrollado con **Playwright + TypeScript**, incorporando herramientas de calidad de código, generación de reportes y ejecución automatizada mediante CI/CD.

## 🧰 Tecnologías

| Tecnología                            | Uso                                                  |
| ------------------------------------- | ---------------------------------------------------- |
| [Playwright](https://playwright.dev/) | Automatización de pruebas Web UI y API               |
| TypeScript                            | Lenguaje de desarrollo                               |
| Node.js                               | Entorno de ejecución                                 |
| Yarn                                  | Gestión de dependencias y scripts                    |
| ESLint                                | Análisis estático y calidad de código                |
| Prettier                              | Formateo automático del código                       |
| Husky                                 | Hooks de Git                                         |
| lint-staged                           | Ejecución de validaciones sobre archivos modificados |
| Allure                                | Generación de reportes de pruebas                    |
| Jenkins                               | Integración y ejecución de CI/CD                     |
| Git                                   | Control de versiones                                 |

---

## 📋 Requisitos

Antes de ejecutar el proyecto se requiere tener instalado:

* **Node.js** `>= 20`
* **Yarn**
* **Git**
* **Jenkins** — únicamente si se desea ejecutar el pipeline localmente o configurar CI/CD.

Verificar las versiones:

```bash
node --version
yarn --version
git --version
```

---

## 📥 Instalación

Clonar el repositorio:

```bash
git clone https://github.com/garySZA/techStore.git
```

Ingresar al proyecto:

```bash
cd Tekhne-modulo-4
```

Instalar las dependencias:

```bash
yarn install
```

Instalar los navegadores de Playwright:

```bash
npx playwright install
```

En Linux, puede ser necesario instalar también las dependencias del navegador:

```bash
npx playwright install --with-deps
```

---

# 📁 Estructura del proyecto

Una estructura general del proyecto es:

```text
Tekhne-modulo-4/
│
├── .husky/
│   └── pre-commit
│
├── allure/
│
├── allure-results/
│
├── app/
│   ├── public/
│   │
│   └── src/
│       ├── middleware/
│       ├── routes/
│       ├── bugs.ts
│       ├── server.ts
│       ├── store.ts
│       └── types.ts
│
├── scripts/
│   └── allure-generate.mjs
│
├── src/
│   ├── config/
│   └── fixtures/
│
├── tests/
│   ├── api/
│   │   ├── app/
│   │   │   └── suites.spec.ts
│   │   │
│   │   ├── clients/
│   │   ├── auth.spec.ts
│   │   ├── cart.spec.ts
│   │   ├── categories.spec.ts
│   │   ├── favorites.spec.ts
│   │   ├── orders.spec.ts
│   │   ├── products.spec.ts
│   │   ├── roles.spec.ts
│   │   └── types.ts
│   │
│   ├── bug-hunting/
│   │
│   └── web/
│       ├── pages/
│       ├── login.spec.ts
│       ├── roles.spec.ts
│       └── shop.spec.ts
│
├── .env
├── .env.example
├── .gitignore
├── .prettierignore
├── .prettierrc
├── eslint.config.mjs
├── package-lock.json
├── package.json
├── playwright.config.ts
├── README.md
├── render.yaml
└── tsconfig.json
```

Los directorios generados durante la ejecución de pruebas, como `test-results`, `playwright-report`, `allure-results` y `allure-report`, no deben almacenarse en el repositorio.

---

# ▶️ Ejecución de pruebas

## Ejecutar todas las pruebas

```bash
yarn test
```

También puede utilizarse:

```bash
npx playwright test
```

---

## Ejecutar pruebas Web

```bash
yarn test:web
```

---

## Ejecutar pruebas API

```bash
yarn test:api
```

---

## Ejecutar pruebas relacionadas con bugs

```bash
yarn test:bugs
```

---

## Ejecutar pruebas en modo UI

```bash
yarn test:ui
```

Este modo permite visualizar y controlar la ejecución de las pruebas mediante la interfaz de Playwright.

---

## Ejecutar pruebas con navegador visible

```bash
yarn headed
```

También puede ejecutarse directamente:

```bash
npx playwright test --headed
```

---

## Ejecutar una prueba específica

Para ejecutar un archivo específico:

```bash
npx playwright test tests/ejemplo.spec.ts
```

También puede utilizarse el script configurado en `package.json`, si corresponde:

```bash
yarn test tests/ejemplo.spec.ts
```

---

# 🧪 Proyectos de Playwright

El proyecto utiliza diferentes configuraciones de ejecución mediante **projects** de Playwright.

Entre ellos pueden encontrarse:

* `web-chromium`
* `api`
* `bug-hunting-api`
* `bug-hunting-web`

Para ejecutar un proyecto específico:

```bash
npx playwright test --project=web-chromium
```

Ejemplo para API:

```bash
npx playwright test --project=api
```

---

# 🧹 ESLint

ESLint se utiliza para detectar problemas de calidad y posibles errores en el código TypeScript.

Ejecutar análisis:

```bash
yarn lint
```

Corregir automáticamente los problemas soportados:

```bash
yarn lint:fix
```

ESLint se utiliza principalmente para:

* Errores potenciales.
* Variables no utilizadas.
* Reglas de TypeScript.
* Convenciones de nombres.
* Reglas específicas de Playwright.
* Buenas prácticas de automatización.

El formateo visual del código es responsabilidad de **Prettier**.

---

# ✨ Prettier

Prettier se utiliza para mantener un formato uniforme en el código.

Formatear el proyecto:

```bash
yarn format
```

Verificar el formato sin modificar archivos:

```bash
yarn format:check
```

La configuración se encuentra en:

```text
.prettierrc
```

Ejemplo de configuración:

```json
{
    "semi": true,
    "singleQuote": true,
    "tabWidth": 4,
    "useTabs": false,
    "printWidth": 120,
    "trailingComma": "all"
}
```

---

# 🪝 Husky y lint-staged

El proyecto utiliza **Husky** para ejecutar validaciones automáticamente antes de realizar un commit.

El hook principal se encuentra en:

```text
.husky/pre-commit
```

El hook ejecuta:

```bash
yarn lint-staged
```

`lint-staged` aplica las validaciones únicamente sobre los archivos que se encuentran preparados para el commit.

Por ejemplo:

```json
{
    "lint-staged": {
        "*.{ts,js}": [
            "eslint --fix",
            "prettier --write"
        ]
    }
}
```

Por lo tanto, el flujo habitual es:

```text
Modificar archivos
       ↓
git add .
       ↓
git commit
       ↓
Husky
       ↓
lint-staged
       ↓
ESLint
       ↓
Prettier
       ↓
Commit
```

Esto permite detectar y corregir problemas antes de que el código llegue al repositorio.

---

# 🔎 TypeScript

Playwright permite ejecutar pruebas TypeScript directamente, pero la ejecución de las pruebas no reemplaza la comprobación de tipos.

Para verificar TypeScript:

```bash
yarn typecheck
```

Este comando ejecuta:

```bash
tsc --noEmit
```

---

# 📊 Allure Reports

El proyecto utiliza **Allure** para generar reportes detallados de ejecución.

Los resultados de Allure se almacenan temporalmente en:

```text
allure-results/
```

El reporte generado se encuentra en:

```text
allure-report/
```

## Generar el reporte

Después de ejecutar las pruebas:

```bash
yarn allure:generate
```

## Abrir el reporte

```bash
yarn allure:open
```

También puede utilizarse:

```bash
yarn allure:serve
```

Este comando genera y levanta el reporte para visualizarlo desde el navegador.

---

## 📈 Información disponible en Allure

Los reportes permiten visualizar información como:

* Casos ejecutados.
* Casos exitosos.
* Casos fallidos.
* Casos omitidos.
* Duración de las pruebas.
* Suites.
* Steps.
* Evidencias.
* Screenshots.
* Información de ejecución.
* Historial de resultados, cuando se configura.
* Detalles de errores y trazas.

Esto facilita el análisis de resultados y la identificación de fallos en las pruebas automatizadas.

---

# 🖥️ Jenkins

**Jenkins** se utiliza como herramienta de integración continua para ejecutar automáticamente las pruebas automatizadas.

El pipeline puede encargarse de:

```text
Checkout del código
        ↓
Instalación de dependencias
        ↓
Instalación de navegadores
        ↓
TypeScript
        ↓
ESLint
        ↓
Playwright
        ↓
Generación de Allure
        ↓
Publicación de resultados
```

Una ejecución típica puede utilizar:

```bash
yarn install --frozen-lockfile
npx playwright install --with-deps
yarn typecheck
yarn lint
yarn test
yarn allure:generate
```

---

# 🔄 Integración continua

El proyecto está preparado para integrarse con un pipeline de CI/CD.

Una ejecución automatizada puede dividirse en las siguientes etapas:

### 1. Checkout

Jenkins obtiene la versión más reciente del código desde el repositorio.

### 2. Dependencies

Se instalan las dependencias:

```bash
yarn install --frozen-lockfile
```

### 3. Browser installation

Se instalan los navegadores necesarios:

```bash
npx playwright install
```

### 4. Static analysis

Se ejecutan las validaciones:

```bash
yarn typecheck
yarn lint
```

### 5. Automated tests

Se ejecutan las pruebas:

```bash
yarn test
```

### 6. Allure

Se generan los resultados y el reporte:

```bash
yarn allure:generate
```

### 7. Artifacts

Jenkins puede almacenar como artefactos:

```text
allure-results/
allure-report/
playwright-report/
test-results/
```

Esto permite consultar los resultados incluso después de finalizar la ejecución del pipeline.

---

# 📸 Evidencias de pruebas

Playwright puede generar automáticamente evidencias dependiendo de la configuración establecida en `playwright.config.ts`.

Entre las evidencias disponibles pueden encontrarse:

* Screenshots.
* Videos.
* Traces.
* HTML Report.
* Resultados de ejecución.

Los archivos generados se almacenan en directorios de ejecución y no deben versionarse.

---

# 🌐 Variables de entorno

Los valores específicos del entorno no deben almacenarse directamente en el código fuente.

Ejemplo:

```text
.env
```

Los archivos `.env` se encuentran incluidos en `.gitignore`.

Para compartir las variables necesarias para configurar el proyecto puede utilizarse:

```text
.env.example
```

Este archivo **sí debe versionarse** y debe contener únicamente nombres de variables, sin credenciales reales.

Ejemplo:

```env
BASE_URL=
API_URL=
USERNAME=
PASSWORD=
```

---

# 🔐 Seguridad

No almacenar en el repositorio:

* Contraseñas.
* Tokens.
* API Keys.
* Credenciales de Jenkins.
* Credenciales de bases de datos.
* Variables de entorno con información sensible.

Utilizar variables de entorno o las credenciales administradas por Jenkins.

---

# 🌿 Git Workflow

Se recomienda trabajar utilizando ramas para separar el desarrollo de las versiones estables.

Ejemplo:

```text
main
 │
 ├── andres
 ├── gary
 ├── seguivar
 
```

El flujo general puede ser:

```text
(rama personal)
   ↓
Main
```

Los cambios deben ser revisados antes de incorporarse a las ramas principales.

---

# 📝 Comandos principales

| Comando                | Descripción                |
| ---------------------- | -------------------------- |
| `yarn install`         | Instala dependencias       |
| `yarn test`            | Ejecuta todas las pruebas  |
| `yarn test:web`        | Ejecuta pruebas Web        |
| `yarn test:api`        | Ejecuta pruebas API        |
| `yarn test:ui`         | Ejecuta Playwright UI Mode |
| `yarn lint`            | Analiza el código          |
| `yarn lint:fix`        | Corrige problemas ESLint   |
| `yarn format`          | Formatea el código         |
| `yarn format:check`    | Verifica el formato        |
| `yarn typecheck`       | Verifica tipos TypeScript  |
| `yarn allure:generate` | Genera reporte Allure      |
| `yarn allure:open`     | Abre reporte Allure        |
| `yarn allure:serve`    | Levanta reporte Allure     |

---

# 🚀 Flujo recomendado para desarrollo

Antes de realizar un commit:

```bash
yarn typecheck
yarn lint
yarn format
```

Luego:

```bash
git add .
git commit -m "feat: add login tests"
```

Husky ejecutará automáticamente `lint-staged` sobre los archivos preparados.

Para una validación completa:

```bash
yarn typecheck
yarn lint
yarn test
```

Finalmente, generar el reporte:

```bash
yarn allure:generate
yarn allure:open
```

---

# 🏗️ Arquitectura de automatización

El proyecto busca mantener una separación entre:

```text
Tests
  │
  ├── Web UI
  │     └── Page Objects
  │
  ├── API
  │     └── Request / API Clients
  │
  └── Test Data
```

Los tests contienen la lógica de validación, mientras que los Page Objects y componentes reutilizables encapsulan la interacción con la aplicación.

Esto permite mejorar:

* Mantenibilidad.
* Reutilización.
* Legibilidad.
* Escalabilidad.
* Facilidad de mantenimiento de selectores.
* Separación de responsabilidades.

---

# 📌 Buenas prácticas

Se recomienda:

* Utilizar TypeScript para las pruebas.
* Utilizar Page Object Model para pruebas Web complejas.
* Preferir locators robustos.
* Evitar `waitForTimeout()` cuando exista una alternativa basada en condiciones.
* Utilizar assertions de Playwright.
* Mantener los datos de prueba separados del código cuando sea conveniente.
* Evitar credenciales directamente en los tests.
* Ejecutar ESLint y Prettier antes de realizar cambios.
* Utilizar tags para organizar suites cuando sea necesario.
* Mantener las pruebas independientes entre sí.
* Evitar pruebas excesivamente dependientes del orden de ejecución.
* Utilizar Allure para facilitar el análisis de resultados.
* Ejecutar la suite completa en CI/CD.

---

# 👨‍💻 Desarrollo

Para iniciar el desarrollo local de la aplicación, si el proyecto incluye la aplicación bajo prueba:

```bash
yarn start
```

La aplicación estará disponible según la configuración del proyecto, por ejemplo:

```text
http://localhost:3000
```

En otra terminal pueden ejecutarse las pruebas:

```bash
yarn test
```

---
