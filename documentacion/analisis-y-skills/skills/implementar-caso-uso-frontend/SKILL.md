---
name: implementar-caso-uso-frontend
description: Este Skill se utiliza para implementar Casos de Uso en el FrontEnd. Debe utilizarse cuando se solicite la implementación de un Caso de Uso en el proyecto de FrontEnd.
user-invocable: true
argument-hint: implementar Caso de uso de FrontEnd
---

# Prompt: Implementar Caso de Uso en FrontEnd

## Parámetros de Entrada

| Parámetro | Requerido | Descripción |
|-----------|-----------|-------------|
| `{{NOMBRE_ARCHIVO_CASO_USO}}` | Sí | Nombre del archivo del caso de uso ubicado en `docs/Caso-Uso-Transformados/` |
| `SKIP_GIT` | No | Flag de escape. Si el usuario indica explícitamente `SKIP_GIT=true`, se omite la creación de branch y PR |

Instrucción:
- Reemplaza `{{NOMBRE_ARCHIVO_CASO_USO}}` con el nombre del archivo del caso de uso transformado.
- Ejemplo: `User_cases_CU-001_Registrar_Profesional.md`

Comportamiento por defecto:
- Si el usuario no menciona nada sobre Git, el paso de crear branch y PR se ejecuta automáticamente al finalizar.
- Solo se omite si se indica `SKIP_GIT=true` de forma explícita.

## Objetivo

Implementar la interfaz de usuario para el caso de uso especificado en `docs/Caso-Uso-Transformados/{{NOMBRE_ARCHIVO_CASO_USO}}` dentro del frontend monolítico modular actual del proyecto, respetando el baseline definido por los skills `arquitectura-stack-tecnologico-frontend` y `generar-solucion-frontend`.

La implementación debe realizarse en:
- `frontEnd/src/[nombre-proyecto-en-kebab-case]/` como raíz del proyecto frontend
- `frontEnd/src/[nombre-proyecto-en-kebab-case]/src/` como raíz del código fuente
- `frontEnd/src/[nombre-proyecto-en-kebab-case]/src/modules/{nombreModulo}/...` como ubicación principal del módulo funcional

## Documentos de Referencia Obligatorios

Antes de comenzar la implementación, leer y analizar:

1. Caso de uso a implementar: `docs/Caso-Uso-Transformados/{{NOMBRE_ARCHIVO_CASO_USO}}`
2. Skill `arquitectura-stack-tecnologico-frontend`
3. Skill `generar-solucion-frontend`
4. Contrato OpenAPI del BackEnd Java actual:
   - `GET /api-docs`
   - `swagger.json`
   - `openapi.json`
5. `frontEnd/src/[nombre-proyecto-en-kebab-case]/README.md` si existe
6. `docs/Ui/Trazabilidad-CU-Pantallas.md`

Regla obligatoria:
- Al finalizar cualquier implementación de UI, modificación de flujo, cambio de integración o ajuste de estilos relevante, se debe actualizar `docs/Ui/Trazabilidad-CU-Pantallas.md`.

## Alcance de la Implementación

Este skill implementa un caso de uso frontend dentro de la aplicación existente. No redefine la arquitectura base ni genera un nuevo scaffold.

La implementación puede incluir:
- DTOs y schemas Zod del módulo
- cliente API del módulo
- hooks con TanStack Query
- componentes del módulo
- páginas App Router asociadas al caso de uso
- tests del módulo
- README del módulo
- placeholders de pantallas pendientes cuando correspondan
- actualización de trazabilidad UI

No debe:
- introducir microfrontends
- mover la raíz del proyecto fuera de `frontEnd/src/[nombre-proyecto-en-kebab-case]/`
- usar `axios`
- depender de implementaciones históricas de `.NET`
- contradecir la estructura definida por el skill arquitectónico

## Reglas de Integración con BackEnd

### Fuente de verdad del contrato

OpenAPI es la fuente de verdad del contrato HTTP del proyecto.

Fuentes válidas:
- `GET /api-docs`
- archivo handoff `swagger.json`
- archivo handoff `openapi.json`

Reglas:
- `docs/Swagger/swagger.json` puede existir como handoff documental, pero no es la única fuente obligatoria.
- Si hay diferencias entre la implementación observada y OpenAPI, debe prevalecer el contrato actualizado del BackEnd.
- No se deben inferir DTOs o endpoints manualmente si existe contrato OpenAPI disponible.

### Contrato estándar del proyecto

El BackEnd Java actual expone un envelope estándar del proyecto:

```json
{
  "success": true,
  "value": {},
  "errors": []
}
```

```json
{
  "success": false,
  "value": null,
  "errors": [
    {
      "code": "BUSINESS_ERROR",
      "message": "Descripción del problema"
    }
  ]
}
```

Reglas:
- `success` discrimina éxito o error.
- `value` contiene el payload cuando `success=true`.
- `errors` contiene errores estructurados cuando `success=false`.
- `X-TraceId` puede llegar por header HTTP y debe contemplarse operativamente para debugging, soporte y trazabilidad.

### Convención unificada para extracción de `value`

Convención obligatoria:
- El API service del módulo valida el envelope y extrae `value`.
- Los hooks del módulo trabajan con el DTO directo.
- Los componentes no deben acceder a `response.value`.

## Estructura Esperada del Módulo

La implementación del caso de uso debe ubicarse dentro del módulo correspondiente:

```text
frontEnd/
└── src/
    └── [nombre-proyecto-en-kebab-case]/
        └── src/
            ├── app/
            │   ├── (public)/
            │   └── (protected)/
            │       └── {nombreModulo}/
            │           ├── page.tsx
            │           ├── crear/page.tsx
            │           ├── [id]/page.tsx
            │           └── editar/[id]/page.tsx
            ├── modules/
            │   └── {nombreModulo}/
            │       ├── README.md
            │       ├── api/
            │       │   └── {entity}Api.ts
            │       ├── components/
            │       │   ├── {Entity}Form.tsx
            │       │   ├── {Entity}List.tsx
            │       │   ├── {Entity}Detail.tsx
            │       ├── dto/
            │       │   ├── {Entity}.schema.ts
            │       │   └── {Entity}.dto.ts
            │       ├── hooks/
            │       │   ├── use{Entity}List.ts
            │       │   ├── use{Entity}Detail.ts
            │       │   ├── useCreate{Entity}.ts
            │       │   ├── useUpdate{Entity}.ts
            │       │   └── useDelete{Entity}.ts
            │       ├── state/
            │       │   └── {entity}Store.ts
            │       └── utils/
            │           └── {entity}Utils.ts
            └── __tests__/
                ├── unit/
                │   └── {nombreModulo}/
                ├── integration/
                │   └── {nombreModulo}/
                └── e2e/
                    └── {nombreModulo}/
```

## Implementación por Bloques

### 1. DTOs y Schemas (`frontEnd/src/[nombre-proyecto-en-kebab-case]/src/modules/{nombreModulo}/dto/`)

Crear:
- `{Entity}.schema.ts`
- `{Entity}.dto.ts`

Objetivos:
- modelar request/response del caso de uso
- validar estructura del DTO con Zod
- validar el envelope estándar del proyecto

Ejemplo:

```typescript
// src/modules/{modulo}/dto/{Entity}.schema.ts
import { z } from 'zod';

export const Create{Entity}RequestSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio').max(100),
  email: z.string().email('Email inválido'),
});

export const {Entity}Schema = z.object({
  id: z.string().uuid(),
  nombre: z.string(),
  email: z.string().email(),
  activo: z.boolean(),
});

export const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
});

export const createApiResponseSchema = <T extends z.ZodTypeAny>(valueSchema: T) =>
  z.discriminatedUnion('success', [
    z.object({
      success: z.literal(true),
      value: valueSchema,
      errors: z.array(ApiErrorSchema),
    }),
    z.object({
      success: z.literal(false),
      value: z.null(),
      errors: z.array(ApiErrorSchema).min(1),
    }),
  ]);

export const {Entity}ResponseSchema = createApiResponseSchema({Entity}Schema);

export type Create{Entity}Request = z.infer<typeof Create{Entity}RequestSchema>;
export type {Entity}Dto = z.infer<typeof {Entity}Schema>;
export type ApiError = z.infer<typeof ApiErrorSchema>;
```

Reglas:
- los schemas deben alinearse con el contrato OpenAPI vigente
- no inventar nombres de campos
- no hardcodear catálogos de negocio visibles al usuario

### 2. API Client (`src/modules/{nombreModulo}/api/`)

El cliente HTTP base del proyecto es:
- `src/lib/http/httpClient.ts`
- implementado con `ky`

Cada módulo define su API service y extrae `value` dentro de la capa API.

Ejemplo:

```typescript
// src/modules/{modulo}/api/{entity}Api.ts
import { apiClient } from '@/lib/http/httpClient';
import {
  Create{Entity}Request,
  {Entity}Dto,
  {Entity}ResponseSchema,
} from '../dto/{Entity}.schema';

function buildBusinessError(message: string): Error {
  return new Error(message);
}

export const {entity}Api = {
  async create(data: Create{Entity}Request): Promise<{Entity}Dto> {
    const response = await apiClient
      .post('api/v1/{resource}', { json: data })
      .json<unknown>();

    const result = {Entity}ResponseSchema.parse(response);

    if (!result.success) {
      const message = result.errors.map((error) => error.message).join('. ');
      throw buildBusinessError(message || 'No fue posible completar la operación.');
    }

    return result.value;
  },
};
```

Reglas:
- la API del módulo valida el envelope
- la API del módulo retorna el DTO puro
- los hooks y componentes no acceden a `response.value`
- en errores técnicos o funcionales debe preservarse el `X-TraceId` si el cliente HTTP lo expone al contexto de error

### 3. Hooks (`src/modules/{nombreModulo}/hooks/`)

Usar `@tanstack/react-query`:
- queries para lecturas
- mutations para escrituras

Ejemplo:

```typescript
// src/modules/{modulo}/hooks/useCreate{Entity}.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { {entity}Api } from '../api/{entity}Api';
import type { Create{Entity}Request, {Entity}Dto } from '../dto/{Entity}.schema';

export const useCreate{Entity} = () => {
  const queryClient = useQueryClient();

  return useMutation<{Entity}Dto, Error, Create{Entity}Request>({
    mutationFn: (data) => {entity}Api.create(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['{entities}'] });
    },
  });
};
```

Reglas:
- usar DTO directo como contrato del hook
- centralizar invalidación de cache
- no depender de `console.log` o `console.error` como salida principal
- el tratamiento de errores debe integrarse con el flujo UI del módulo

### 4. Componentes (`src/modules/{nombreModulo}/components/`)

Crear según necesidad:
- `{Entity}Form.tsx`
- `{Entity}List.tsx`
- `{Entity}Detail.tsx`
- componentes auxiliares del flujo
- `README.md` del módulo

Ejemplo de formulario:

```typescript
// src/modules/{modulo}/components/{Entity}Form.tsx
'use client';

import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Create{Entity}Request,
  Create{Entity}RequestSchema,
} from '../dto/{Entity}.schema';

interface {Entity}FormProps {
  defaultValues?: Partial<Create{Entity}Request>;
  isSubmitting?: boolean;
  onSubmit: (data: Create{Entity}Request) => Promise<void>;
}

export const {Entity}Form: FC<{Entity}FormProps> = ({
  defaultValues,
  isSubmitting = false,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Create{Entity}Request>({
    resolver: zodResolver(Create{Entity}RequestSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium">
          Nombre
        </label>
        <input id="nombre" {...register('nombre')} className="form-input w-full" />
        {errors.nombre && <p className="form-error">{errors.nombre.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting} className="btn btn-primary">
        {isSubmitting ? 'Procesando...' : 'Guardar'}
      </button>
    </form>
  );
};
```

Reglas:
- usar React Hook Form + Zod
- mostrar validación inline
- respetar estados loading, error y empty
- evitar logging en consola como comportamiento principal

### 5. Páginas App Router (`frontEnd/src/[nombre-proyecto-en-kebab-case]/src/app/...`)

Ubicar las páginas según el flujo:
- rutas públicas en `src/app/(public)/...`
- rutas protegidas en `src/app/(protected)/...`

Ejemplo:

```typescript
// frontEnd/src/[nombre-proyecto-en-kebab-case]/src/app/(protected)/{nombreModulo}/crear/page.tsx
'use client';

import { {Entity}Form } from '@/modules/{modulo}/components/{Entity}Form';
import { useCreate{Entity} } from '@/modules/{modulo}/hooks/useCreate{Entity}';

const Create{Entity}Page = () => {
  const mutation = useCreate{Entity}();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Crear {Entity}</h1>
      <{Entity}Form
        isSubmitting={mutation.isPending}
        onSubmit={async (data) => {
          await mutation.mutateAsync(data);
        }}
      />
    </div>
  );
};

export default Create{Entity}Page;
```

### 6. Pantallas Placeholder

Si el caso de uso requiere navegación hacia pantallas aún no implementadas:
- no devolver 404 si la ruta ya forma parte del flujo esperado
- crear una página placeholder documentada

Ejemplo mínimo:

```typescript
// frontEnd/src/[nombre-proyecto-en-kebab-case]/src/app/(protected)/{ruta}/page.tsx
'use client';

const PendingScreenPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Pantalla pendiente de implementación</h1>
        <p className="text-gray-600">
          Esta pantalla forma parte del flujo previsto y se mantiene como placeholder
          hasta completar su implementación.
        </p>
      </div>
    </div>
  );
};

export default PendingScreenPage;
```

## Tests

Los tests deben quedar alineados con:
- `frontEnd/src/[nombre-proyecto-en-kebab-case]/src/__tests__/unit/...`
- `frontEnd/src/[nombre-proyecto-en-kebab-case]/src/__tests__/integration/...`
- `frontEnd/src/[nombre-proyecto-en-kebab-case]/src/__tests__/e2e/...`

No usar rutas `__tests__/modules/...` fuera de `src/`.

### Ejemplo de test unitario con Vitest

```typescript
// frontEnd/src/[nombre-proyecto-en-kebab-case]/src/__tests__/unit/{nombreModulo}/hooks/useCreate{Entity}.test.ts
import { describe, expect, it, vi } from 'vitest';

describe('useCreate{Entity}', () => {
  it('debe usar la mutación del módulo', async () => {
    const createMock = vi.fn();

    createMock({ nombre: 'Demo', email: 'demo@site.com' });

    expect(createMock).toHaveBeenCalledTimes(1);
  });
});
```

Reglas:
- usar `vi.fn()` en lugar de `jest.fn()`
- mantener consistencia con Vitest
- separar tests unitarios, de integración y e2e
- respetar el baseline del proyecto con ESLint CLI y sin `next lint`

## Trazabilidad UI y Documentación

### README del módulo

Convención documental:
- `frontEnd/src/[nombre-proyecto-en-kebab-case]/README.md` es la documentación general del proyecto frontend.
- `frontEnd/src/[nombre-proyecto-en-kebab-case]/src/modules/{nombreModulo}/README.md` es la documentación técnico-funcional del módulo.

Cada módulo implementado debe dejar un `README.md` en:
- `frontEnd/src/[nombre-proyecto-en-kebab-case]/src/modules/{nombreModulo}/README.md`

Debe documentar:
- objetivo del módulo
- componentes principales
- hooks expuestos
- dependencias con catálogos o endpoints
- decisiones técnicas relevantes

### Documento de trazabilidad

Actualizar obligatoriamente:
- `docs/Ui/Trazabilidad-CU-Pantallas.md`

Debe reflejar:
- ruta frontend implementada
- componente o página principal
- módulo afectado
- estado del CU
- pantallas placeholder si aplica
- cambios de navegación si aplica

Ejemplo de referencias correctas:
- `frontEnd/src/[nombre-proyecto-en-kebab-case]/src/app/...`
- `frontEnd/src/[nombre-proyecto-en-kebab-case]/src/modules/{modulo}/...`

No deben aparecer rutas inválidas como:
- `frontEnd/src/app/...`
- `frontEnd/src/modules/...`

## Estándares de Implementación

### Convenciones de Código

- Componentes: PascalCase
- Hooks: camelCase con prefijo `use`
- APIs: camelCase
- Schemas y tipos: PascalCase
- utilidades: camelCase

### Manejo de errores

Reglas:
- el cliente HTTP centralizado debe manejar el contexto técnico común
- los módulos deben convertir errores funcionales en mensajes utilizables por la UI
- `X-TraceId` debe preservarse cuando exista
- evitar `console.log` y `console.error` como estrategia principal de observabilidad

### Catálogos y datos para UI

Toda información visible al usuario debe provenir del BackEnd cuando exista catálogo, endpoint o fuente publicada para ello.

No deben hardcodearse:
- catálogos de negocio
- labels funcionales visibles al usuario
- equivalencias de códigos a nombres

si el BackEnd ya publica esos datos.

Correcto:
- usar hooks compartidos desde `src/lib/hooks/useCatalogs.ts`
- resolver nombres legibles con helpers comunes

Incorrecto:
- hardcodear catálogos visibles al usuario dentro del módulo
- mantener mapeos manuales de labels funcionales cuando el BackEnd expone esa información

## Flujo de Ejecución

1. Analizar el caso de uso transformado
2. Revisar el contrato OpenAPI del BackEnd
3. Identificar módulo, rutas y pantallas afectadas
4. Implementar DTOs y schemas Zod
5. Implementar API service del módulo con `ky`
6. Implementar hooks con TanStack Query
7. Implementar componentes y páginas
8. Crear placeholders si faltan pantallas del flujo
9. Implementar tests con Vitest / RTL / Playwright según corresponda
10. Actualizar README del módulo
11. Actualizar `docs/Ui/Trazabilidad-CU-Pantallas.md`
12. Ejecutar validaciones finales
13. Ejecutar automatización Git salvo que el usuario haya indicado `SKIP_GIT=true`

## Criterios de Validación

- [ ] Se implementaron los artefactos necesarios dentro de `frontEnd/src/[nombre-proyecto-en-kebab-case]/src/modules/{nombreModulo}/...`
- [ ] Las páginas quedaron alineadas con `frontEnd/src/[nombre-proyecto-en-kebab-case]/src/app/...`
- [ ] No existen rutas inválidas fuera de `frontEnd/src/[nombre-proyecto-en-kebab-case]/src/...`
- [ ] Los schemas Zod coinciden con el contrato OpenAPI vigente
- [ ] La integración HTTP usa `src/lib/http/httpClient.ts` con `ky`
- [ ] La API del módulo extrae `value` y retorna DTO directo
- [ ] Hooks y componentes no acceden a `response.value`
- [ ] El manejo del envelope `success / value / errors` es consistente en todo el módulo
- [ ] Se contempla `X-TraceId` para trazabilidad operativa
- [ ] Los tests quedaron bajo `frontEnd/src/[nombre-proyecto-en-kebab-case]/src/__tests__/...`
- [ ] El proyecto respeta el baseline soportado de Next.js, React y ESLint definido por el skill arquitectónico
- [ ] Los ejemplos y tests usan Vitest
- [ ] El código compila sin errores TypeScript
- [ ] ESLint no reporta errores
- [ ] Se actualizó `docs/Ui/Trazabilidad-CU-Pantallas.md`
- [ ] Se documentó el módulo implementado
- [ ] No se introdujeron referencias a `.NET`, `axios` ni tecnologías fuera del baseline actual

## Automatización Git

Regla por defecto:
- Si el usuario no indicó `SKIP_GIT=true`, se debe invocar el skill `crear-branch-pr` al finalizar.

Si `SKIP_GIT=true`:
- documentar la omisión en el README del módulo o en la respuesta final, según corresponda

Parámetros sugeridos para `crear-branch-pr`:

| Parámetro | Valor |
|-----------|-------|
| `tipo` | `feature` |
| `identificador` | `CU-XXX` |
| `descripcion` | `{nombre-caso-uso-kebab-case}-ui` |
| `archivos` | todos los archivos modificados |
| `mensaje_commit` | `feat(frontend): implementar CU-XXX {NombreCasoUso}` |
| `base_branch` | `dev` |
| `titulo_pr` | `[CU-XXX] Implementar {NombreCasoUso} - FrontEnd` |

## Notas Importantes

- No modificar la arquitectura base del proyecto.
- Mantener la implementación dentro del monolito modular actual.
- Respetar siempre el skill `arquitectura-stack-tecnologico-frontend`.
- Respetar siempre el skill `generar-solucion-frontend`.
- Si surge un conflicto documental, prevalecen esos skills.
- No introducir dependencias o patrones fuera del baseline validado.
