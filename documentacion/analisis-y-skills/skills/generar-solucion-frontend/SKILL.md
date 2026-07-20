---
name: generar-solucion-frontend
description: Este Skill se utiliza para generar la solución base de FrontEnd. Debe utilizarse cuando se solicite generar una solución de FrontEnd.
user-invocable: true
argument-hint: generar una solucion de FrontEnd
---

# Generación de Solución FrontEnd - Next.js 15 con TypeScript

Genera la estructura base de la solución FrontEnd para una aplicación **"[NombreDeTuSolucion]"** en `Next.js 15.x`, siguiendo exactamente las definiciones del skill `arquitectura-stack-tecnologico-frontend`.

La solución actual del template asume un **frontend monolítico**, con `frontEnd/src/` como contenedor de proyectos frontend, una aplicación Next.js por proyecto en `frontEnd/src/[nombre-proyecto-en-kebab-case]/` y organización interna **modular / feature-first**. La evolución futura a múltiples aplicaciones frontend simultáneas queda fuera del alcance actual de este skill.

## Alcance Inicial

Genera solamente la **solución base del FrontEnd**, sin módulos de negocio concretos ni pantallas funcionales específicas del dominio.

1. Siempre lee los documentos clave del proyecto al inicio de una nueva conversación para entender arquitectura, objetivos, estilo y restricciones.
2. Lee el skill `arquitectura-stack-tecnologico-frontend` para la implementación de la arquitectura, stack tecnológico, estructura del proyecto e integración con BackEnd.
3. Usa convenciones de nombramiento, estructura de archivos y patrones de arquitectura consistentes con ese skill.
4. Solicita al usuario el nombre del proyecto frontend.
5. Normaliza ese nombre a `kebab-case` y úsalo como `nombre-proyecto-en-kebab-case`.
6. Genera el proyecto frontend en `frontEnd/src/[nombre-proyecto-en-kebab-case]/`.
7. Genera el código fuente de la aplicación dentro de `frontEnd/src/[nombre-proyecto-en-kebab-case]/src/`.
8. Genera diagramas de arquitectura de alto nivel en Mermaid dentro del `README.md` del frontend.

## Convención de Naming

El nombre lógico del proyecto puede definirse como **`[NombreDeTuSolucion]`**, pero su representación operativa en archivos y carpetas del monorepo debe utilizarse como:

- `frontEnd/src/[nombre-proyecto-en-kebab-case]/`

Reglas:

- el nombre del proyecto debe pedirse explícitamente al usuario
- el nombre operativo debe normalizarse a kebab-case
- `frontEnd/src/` funciona como contenedor de proyectos frontend
- la raíz física del scaffold es `frontEnd/src/[nombre-proyecto-en-kebab-case]/`
- el código fuente de Next.js debe quedar dentro de `frontEnd/src/[nombre-proyecto-en-kebab-case]/src/`

## Notas Importantes

- No generes módulos de negocio concretos todavía.
- No generes pantallas, formularios ni flujos específicos de dominio fuera del baseline técnico.
- No generes DTOs de negocio cerrados fuera de ejemplos o placeholders estrictamente necesarios para el scaffold.
- No hardcodees catálogos de negocio visibles al usuario.
- No implementes microfrontends reales ni múltiples aplicaciones frontend.
- Deja la solución lista para evolucionar por features dentro de la misma aplicación.
- El resultado esperado es un scaffold base arrancable, coherente y preparado para crecer, no una aplicación de negocio completa.
- El proyecto debe quedar alineado con el baseline validado del repositorio: Next.js 15.x App Router, React 19.x, TypeScript strict, TailwindCSS 3.4.x, `ky`, React Query, Zod, React Hook Form, `react-error-boundary` y testing con Vitest / React Testing Library / Playwright.
- El scaffold debe usar `eslint` CLI para linting y no depender de `next lint`.

## Estructura Esperada

```text
frontEnd/
└── src/
    └── [nombre-proyecto-en-kebab-case]/
        ├── package.json
        ├── tsconfig.json
        ├── next.config.js
        ├── .env.example
        ├── .env.local
        ├── .eslintrc.json / eslint.config.js
        ├── .prettierrc
        ├── tailwind.config.ts
        ├── README.md
        ├── public/
        │   ├── images/
        │   └── icons/
        └── src/
            ├── app/
            │   ├── layout.tsx
            │   ├── page.tsx
            │   ├── globals.css
            │   ├── (public)/
            │   └── (protected)/
            │       └── layout.tsx
            ├── components/
            │   ├── ui/
            │   └── index.ts
            ├── styles/
            │   └── datepicker.css
            ├── modules/
            │   └── shared/
            │       ├── components/
            │       ├── hooks/
            │       ├── utils/
            │       └── types/
            ├── lib/
            │   ├── hooks/
            │   │   ├── index.ts
            │   │   └── useCatalogs.ts
            │   ├── http/
            │   │   ├── httpClient.ts
            │   │   └── apiHelpers.ts
            │   ├── validators/
            │   └── queryClient.ts
            ├── config/
            │   ├── api.config.ts
            │   ├── env.config.ts
            │   └── routes.config.ts
            └── __tests__/
                ├── unit/
                ├── integration/
                └── e2e/
```

## Lineamientos de Generación

- Solicita el nombre del proyecto frontend y normalízalo a `kebab-case`.
- Genera una única aplicación frontend en `frontEnd/src/[nombre-proyecto-en-kebab-case]/`.
- Usa `frontEnd/src/[nombre-proyecto-en-kebab-case]/src/` exclusivamente como raíz del código fuente.
- Respeta la organización interna modular con enfoque feature-first.
- La carpeta `src/modules/` representa modularidad interna dentro de la misma aplicación; no implica microfrontends distribuidos.
- Genera el baseline técnico del proyecto con:
  - Next.js 15.x App Router
  - React 19.x
  - TypeScript con `strict mode`
  - TailwindCSS 3.4.x
  - cliente HTTP centralizado en `src/lib/http/httpClient.ts` usando `ky`
  - configuración base de React Query
  - configuración base para Zod y React Hook Form cuando corresponda
  - manejo base de errores con `react-error-boundary`
  - ESLint 9.x ejecutado por CLI
  - estructura de tests con `unit`, `integration` y `e2e`
- Reemplaza cualquier uso de `next lint` por scripts basados en `eslint`.
- Mantén `tailwindcss` en 3.4.x salvo decisión explícita posterior de migración a v4.
- Genera el `README.md` del frontend en `frontEnd/src/[nombre-proyecto-en-kebab-case]/README.md`.
- El `README.md` debe explicar la estructura base del proyecto, el setup inicial, las convenciones de crecimiento por módulos y contener diagramas Mermaid de arquitectura de alto nivel.
- Deja la solución alineada con la integración estándar con BackEnd Java:
  - contrato OpenAPI como fuente de verdad
  - endpoint `/api-docs`
  - handoff manual `swagger.json` u `openapi.json` cuando aplique
  - envelope `success / value / errors`
  - contemplar `X-TraceId` en respuestas del BackEnd
- No generes dependencias ni configuraciones que contradigan el skill `arquitectura-stack-tecnologico-frontend`.

## Integración con BackEnd

La solución base del frontend debe quedar preparada para consumir el contrato HTTP del BackEnd Java actual según el skill `arquitectura-stack-tecnologico-frontend`.

Esto implica:

- usar `frontEnd/src/[nombre-proyecto-en-kebab-case]/src/lib/http/httpClient.ts` con `ky`
- consumir contrato OpenAPI desde `/api-docs`, `swagger.json` u `openapi.json`
- modelar el envelope estándar del proyecto:
  - `success`
  - `value`
  - `errors`
- contemplar el header `X-TraceId` para debugging, soporte y trazabilidad
- no depender de implementaciones históricas ni de librerías ajenas al stack validado

## Remisión al Skill de Arquitectura

Este skill no redefine la arquitectura del FrontEnd. La fuente de verdad para:

- stack tecnológico
- estructura del proyecto
- modularidad interna por features
- integración con BackEnd
- contrato OpenAPI
- envelope `success / value / errors`
- uso de `X-TraceId`
- testing y métricas de calidad
- convenciones de package manager

es el skill `arquitectura-stack-tecnologico-frontend`.

Si durante la generación aparece una duda de estructura, naming, stack o baseline técnico, prevalece siempre ese skill.

## Criterios de Validación

- [ ] Se solicitó explícitamente el nombre del proyecto frontend
- [ ] Existe el proyecto frontend en `frontEnd/src/[nombre-proyecto-en-kebab-case]/`
- [ ] Existe `frontEnd/src/[nombre-proyecto-en-kebab-case]/package.json`
- [ ] Existen los archivos base de configuración del frontend (`tsconfig.json`, `next.config.js`, `.env.example`, `.eslintrc.json` o `eslint.config.js`, `.prettierrc`, `tailwind.config.ts`)
- [ ] Existe `frontEnd/src/[nombre-proyecto-en-kebab-case]/README.md`
- [ ] Existe `frontEnd/src/[nombre-proyecto-en-kebab-case]/src/`
- [ ] Existen `src/app`, `src/components`, `src/styles`, `src/modules/shared`, `src/lib`, `src/config` y `src/__tests__`
- [ ] Existe `frontEnd/src/[nombre-proyecto-en-kebab-case]/src/lib/http/httpClient.ts` alineado con `ky`
- [ ] El scaffold usa una línea soportada de Next.js, React y ESLint
- [ ] El script `lint` usa ESLint CLI y no depende de `next lint`
- [ ] Existe baseline compatible con React Query, Zod y React Hook Form según el skill arquitectónico
- [ ] El scaffold queda alineado con OpenAPI y `/api-docs`
- [ ] El scaffold contempla `X-TraceId` para trazabilidad operativa
- [ ] El `README.md` del frontend explica la estructura, setup inicial, convenciones base y contiene diagramas Mermaid
- [ ] No se generaron módulos de negocio concretos fuera del alcance inicial
- [ ] No se generaron microfrontends reales ni múltiples aplicaciones frontend
