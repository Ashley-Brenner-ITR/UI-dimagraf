---
name: arquitectura-stack-tecnologico-frontend
description: Este Skill describe la Arquitectura y Stack tecnológico para el FrontEnd. Debe utilizase cuando se requiera generar o modificar cualquier componente de código del FrontEnd.
user-invocable: false
argument-hint: arquitectura y stack tecnologico de FrontEnd
---


## **1.0. Arquitectura del FrontEnd**

**Patrones Aplicados:**
- Feature-First Architecture
- Custom Hooks Pattern
- Atomic Design (opcional para componentes)
- BFF Pattern (Backend for Frontend)
- Error Boundary Pattern
- Loading/Suspense Pattern
- Optimistic UI Updates

**Principios:**
- Separación de concerns (UI, lógica, data fetching)
- Componentes reutilizables
- Single Responsibility
- DRY (Don't Repeat Yourself)

**Alcance arquitectónico actual:**
- El baseline del proyecto usa `frontEnd/src/` como contenedor de proyectos frontend.
- Cada proyecto frontend vive en `frontEnd/src/[nombre-proyecto-en-kebab-case]/`.
- El código fuente de cada aplicación vive en `frontEnd/src/[nombre-proyecto-en-kebab-case]/src/`.
- La organización por features responde a modularidad interna dentro de la misma aplicación.
- La implementación de múltiples aplicaciones FrontEnd activas en paralelo o microfrontends distribuidos no forma parte del alcance actual de este skill.


## **2.0. Stack Tecnológico**

**Stack base obligatorio del FrontEnd:**

* **Framework**: Next.js 15.x (App Router) ✅ TypeScript First
  - App Router
  - Server Components y Client Components según necesidad
* **Librería de UI**: React 19.x (con @types/react alineado)
* **Lenguaje**: TypeScript 5.4+ ✅ TypeScript First
  - `strict mode` obligatorio
* **Estilos**: TailwindCSS 3.4.x (con soporte TypeScript completo)
* **HTTP Client**: ky 1.2+ ✅ TypeScript First (alternativa moderna a axios)
* **Data Fetching/Cache**: @tanstack/react-query 5.28+ ✅ TypeScript First (reemplaza axios-hooks)
* **Validación**: Zod 3.23+ ✅ TypeScript First
* **Formularios**: react-hook-form 7.51+ ✅ TypeScript First
* **State Management**: Zustand 4.5+ ✅ TypeScript First (opcional para estado global)
  - Solo si el caso lo requiere; priorizar estado local y React Query
* **UI Components**: shadcn/ui ✅ TypeScript First (opcional)
* **Date Picker**:
  - react-datepicker 6+ ✅ TypeScript First (selector de fechas con calendario)
  - date-fns 3+ ✅ TypeScript First (manipulación y formateo de fechas, locale español)
* **Testing**:
  - Vitest 2.x ✅ TypeScript First (alternativa a Jest)
  - React Testing Library 14+ (con @testing-library/react)
  - Playwright 1.42+ ✅ TypeScript First para E2E
* **Linting / Formatting**:
  - **ESLint 9.x**
  - `eslint-config-next` alineado con Next.js 15.x
  - `@typescript-eslint/parser`
  - `@typescript-eslint/eslint-plugin`
  - `eslint-plugin-react`
  - `eslint-plugin-react-hooks`
  - Prettier 3+ con eslint-config-prettier (para evitar conflictos)
* **Manejo de Errores**: react-error-boundary (con tipos TypeScript completos)

**Reglas de baseline técnico:**
- El scaffold frontend debe nacer sobre una línea soportada de Next.js, React y ESLint.
- El comando de lint del proyecto debe ejecutarse con ESLint CLI y no depender de `next lint`.
- TailwindCSS 3.4.x se mantiene como baseline por compatibilidad; la migración a v4 requiere decisión explícita posterior.

### **2.1. Reglas de Integración con BackEnd**

> ⚠️ **REGLA OBLIGATORIA:** El FrontEnd debe consumir el contrato HTTP del BackEnd Java actual como fuente de verdad.

**Fuente de verdad del contrato:**
- `GET /api-docs`
- `swagger.json`
- `openapi.json`

**Contrato estándar del proyecto:**
- `success`
- `value`
- `errors`

**Reglas:**
- El FrontEnd no debe inferir endpoints o DTOs manualmente si existe contrato OpenAPI actualizado.
- Los tipos, schemas Zod y clientes HTTP deben alinearse con el contrato publicado por el BackEnd.
- No deben usarse referencias a implementaciones históricas de `.NET` como base del contrato.
- El FrontEnd debe contemplar el header `X-TraceId` cuando esté presente en respuestas del BackEnd y preservarlo para debugging, soporte y trazabilidad.


## **3.0. Estructura de Proyecto**

**Nota:** Este proyecto se estructura como un **monorepo** que contiene tanto `frontEnd/` como `backEnd/`. Los archivos de configuración global como `.gitignore`, `.editorconfig` y documentación general deben estar en la raíz del repositorio.

**Aclaración de alcance:** dentro de este monorepo, `frontEnd/src/` funciona como contenedor de proyectos frontend. Este skill asume un proyecto frontend a la vez, ubicado en `frontEnd/src/[nombre-proyecto-en-kebab-case]/`. La carpeta `src/modules/` representa modularidad interna por features dentro de ese proyecto y no una implementación de microfrontends distribuidos. Si en el futuro el repositorio evoluciona a múltiples aplicaciones frontend activas, eso requerirá una decisión arquitectónica posterior y queda fuera del alcance actual de este skill.

```
Root/                            (Root del repositorio)
├── .gitignore                   (Configuración global del repo)
├── README.md                    (Documentación general del proyecto)
├── docs/                        (Documentación compartida)
├── backEnd/                     (Servicios BackEnd Java / Spring Boot)
└── frontEnd/
    └── src/
        └── [nombre-proyecto-en-kebab-case]/   (Proyecto FrontEnd Next.js)
            ├── .env.local
            ├── .env.example
            ├── .eslintrc.json / eslint.config.js
            ├── .prettierrc
            ├── next.config.js
            ├── tailwind.config.ts
            ├── tsconfig.json
            ├── package.json
            ├── README.md                      (Documentación específica del FrontEnd)
            │
            ├── public/
            │   ├── images/
            │   └── icons/
            │
            └── src/
                ├── app/
                │   ├── layout.tsx
                │   ├── page.tsx
                │   ├── globals.css
                │   ├── (public)/
                │   │   ├── login/
                │   │   └── register/
                │   └── (protected)/
                │       ├── layout.tsx
                │       └── {nombreModulo}/
                │           ├── page.tsx
                │           ├── [id]/
                │           │   └── page.tsx
                │           ├── crear/
                │           │   └── page.tsx
                │           └── editar/
                │               └── [id]/
                │                   └── page.tsx
                │
                ├── components/               (Componentes reutilizables globales)
                │   ├── ui/
                │   │   ├── DatePickerField.tsx  (Date picker con formato dd/mm/yyyy)
                │   │   └── index.ts
                │   └── index.ts
                │
                ├── styles/                   (Estilos CSS adicionales)
                │   └── datepicker.css        (Estilos personalizados para react-datepicker)
                │
                ├── modules/
                │   ├── shared/
                │   │   ├── components/
                │   │   │   ├── ui/ (botones, inputs, etc.)
                │   │   │   ├── layout/ (header, sidebar, footer)
                │   │   │   └── common/ (loaders, errors)
                │   │   ├── hooks/
                │   │   │   ├── useDebounce.ts
                │   │   │   └── useLocalStorage.ts
                │   │   ├── utils/
                │   │   │   ├── formatters.ts
                │   │   │   └── validators.ts
                │   │   └── types/
                │   │       └── common.types.ts
                │   │
                │   └── {nombreModulo}/
                │       ├── components/
                │       │   ├── {Entity}List.tsx
                │       │   ├── {Entity}Form.tsx
                │       │   ├── {Entity}Card.tsx
                │       │   └── {Entity}Detail.tsx
                │       ├── hooks/
                │       │   ├── use{Entity}List.ts
                │       │   ├── useCreate{Entity}.ts
                │       │   ├── useUpdate{Entity}.ts
                │       │   ├── useDelete{Entity}.ts
                │       │   └── use{Entity}Detail.ts
                │       ├── api/
                │       │   └── {entity}Api.ts
                │       ├── dto/
                │       │   ├── {Entity}.dto.ts
                │       │   └── {Entity}.schema.ts (Zod schemas)
                │       ├── state/ (opcional)
                │       │   └── {entity}Store.ts
                │       └── utils/
                │           └── {entity}Utils.ts
                │
                ├── lib/
                │   ├── hooks/
                │   │   ├── index.ts
                │   │   └── useCatalogs.ts
                │   ├── http/
                │   │   ├── httpClient.ts (ky instance)
                │   │   └── apiHelpers.ts
                │   ├── queryClient.ts (TanStack Query)
                │   └── utils.ts
                │
                ├── config/
                │   ├── api.config.ts
                │   ├── env.config.ts
                │   └── routes.config.ts
                │
                └── __tests__/
                    ├── unit/
                    ├── integration/
                    └── e2e/
```


## **3.1. Elementos Compartidos (Shared Elements)**

El proyecto centraliza validadores, utilidades comunes y configuración técnica en `src/lib/` para evitar duplicación de código y mantener consistencia en todo el sistema.

### **Estructura de Elementos Compartidos:**

```
src/lib/
├── validators/                         # Validadores reutilizables
│   ├── index.ts                        # Re-exports centralizados
│   ├── cuit.ts                         # Validación CUIT argentino
│   └── password.ts                     # Validación de contraseña segura
│
├── hooks/                              # Hooks compartidos basados en API
│   ├── index.ts                        # Re-exports para imports desde '@/lib/hooks'
│   └── useCatalogs.ts
│
├── http/                               # Cliente HTTP y helpers
│   ├── httpClient.ts
│   └── apiHelpers.ts
│
└── queryClient.ts                      # Configuración TanStack Query
```

### **3.1.1. Catálogos via API Hooks (`lib/hooks/`)**

> **⚠️ REGLA CRÍTICA: Fuente de Datos para UI**
>
> **TODA información que se presente al usuario DEBE provenir del BackEnd:**
> - Los datos para selectores/combos se obtienen vía hooks de React Query
> - Los nombres legibles de códigos se resuelven contra catálogos del backend
> - **NUNCA** usar constantes hardcodeadas en el FrontEnd para datos visibles al usuario
>
> **Excepciones permitidas:**
> - Validadores de formato (expresiones regulares para CUIT, email, etc.)
> - Constantes técnicas de configuración (límites, timeouts, etc.)
> - Datos que NO se muestran al usuario (keys internos, flags técnicos)

**❌ INCORRECTO - Datos hardcodeados en frontend:**
```typescript
// ❌ NUNCA HACER ESTO para datos del usuario
const TIPOS_INSTITUCION = [
  { value: 1, label: 'Hospital' },
  { value: 2, label: 'Clínica' },
];

// ❌ NO usar mapeos hardcodeados
const TIPO_LABELS: Record<string, string> = {
  'HOSPITAL': 'Hospital',
  'CLINICA': 'Clínica',
};
```

**✅ CORRECTO - Datos del BackEnd vía hooks:**
```typescript
import { 
  useTiposInstitucionExperiencia,
  useModalidadesTrabajo,
  getCatalogNombreByCodigo 
} from '@/lib/hooks';

// En componentes - obtener datos del backend
const { data: tiposInstitucion } = useTiposInstitucionExperiencia();
const { data: modalidades } = useModalidadesTrabajo();

// Para selectores en formularios
{tiposInstitucion?.map((tipo) => (
  <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
))}

// Para mostrar nombres legibles desde códigos
const nombreTipo = getCatalogNombreByCodigo(
  tiposInstitucion, 
  experiencia.tipoInstitucionCodigo
); // "Hospital" (obtenido del backend)
```

**Hooks de catálogos disponibles en `lib/hooks/useCatalogs.ts`:**
```typescript
// Hooks que consultan endpoints del backend
export const useProvincias = () => useCatalog('/api/v1/catalogs/provincias');
export const useTiposInstitucionExperiencia = () => useCatalog('/api/v1/catalogs/tipos-institucion-experiencia');
export const useModalidadesTrabajo = () => useCatalog('/api/v1/catalogs/modalidades-trabajo');
export const useTiposServicioPrestado = () => useCatalog('/api/v1/catalogs/tipos-servicio-prestado');
// ... más hooks según necesidad

// Función helper para obtener nombre desde código
export function getCatalogNombreByCodigo<T extends { codigo: string; nombre: string }>(
  items: T[] | undefined,
  codigo: string
): string {
  return items?.find((i) => i.codigo === codigo)?.nombre ?? codigo;
}
```

**Beneficios del patrón correcto:**
- ✅ Single Source of Truth: el backend define los datos maestros
- ✅ Sincronización automática: cambios en backend se reflejan en frontend
- ✅ Caching inteligente: React Query cachea por 1 hora (configurable)
- ✅ Sin duplicación: no hay que mantener los mismos datos en dos lugares

### **3.1.2. Validadores (`lib/validators/`)**

Funciones de validación reutilizables para reglas de negocio:

**cuit.ts** - Validación de CUIT argentino:
```typescript
import { CUIT_REGEX, validateCuitCheckDigit, formatCuit } from '@/lib/validators';

// Validar formato
if (CUIT_REGEX.test(cuit) && validateCuitCheckDigit(cuit)) {
  // CUIT válido
}

// Formatear CUIT
const formatted = formatCuit('20123456789'); // "20-12345678-9"
```

**password.ts** - Validación de contraseña segura:
```typescript
import { PASSWORD_REGEX, isValidPassword, getPasswordMissingRequirements } from '@/lib/validators';

// Validar contraseña
if (isValidPassword(password)) {
  // Cumple todos los requisitos
}

// Obtener requisitos faltantes (para feedback al usuario)
const missing = getPasswordMissingRequirements('abc123');
// ["Al menos una letra mayúscula", "Al menos un carácter especial"]
```

### **3.1.3. Uso en Schemas Zod**

Los módulos usan Zod para validar **estructura**, **tipos**, **formatos** y restricciones locales de UI.

> ⚠️ **REGLA:** Los schemas del FrontEnd NO deben hardcodear catálogos de negocio visibles al usuario cuando esos datos provienen del BackEnd.

```typescript
// modules/{modulo}/dto/{Entity}.schema.ts
import { z } from 'zod';
import { CUIT_REGEX, validateCuitCheckDigit, PASSWORD_REGEX } from '@/lib/validators';

export const EntitySchema = z.object({
  cuit: z.string()
    .regex(CUIT_REGEX, 'Formato inválido')
    .refine(validateCuitCheckDigit, 'Dígito verificador inválido'),

  provinciaId: z.string().min(1, 'La provincia es obligatoria'),

  password: z.string()
    .regex(PASSWORD_REGEX, 'Contraseña no cumple requisitos'),
});
```

**Reglas:**
- ✅ Zod valida formato y shape del payload.
- ✅ La pertenencia a catálogos de negocio se resuelve consumiendo el catálogo publicado por la API.
- ❌ No validar provincias, tipos o catálogos funcionales contra constantes hardcodeadas en FrontEnd si el dato viene del BackEnd.

### **3.1.4. Principios de Diseño**

| Principio | Implementación |
|-----------|----------------|
| **Single Source of Truth** | Datos de negocio visibles definidos por el BackEnd |
| **DRY** | Validadores compartidos entre módulos |
| **Type Safety** | Tipos TypeScript y schemas Zod consistentes |
| **Backward Compatibility** | Cambios controlados sobre contratos y utilidades |
| **Extensibilidad** | Fácil agregar nuevos validadores o utilidades |

### **3.1.5. Agregar Nuevos Elementos Compartidos**

**Para agregar un nuevo validador:**
1. Crear archivo en `lib/validators/nuevo-validador.ts`
2. Exportar regex, función de validación y helpers
3. Re-exportar desde `lib/validators/index.ts`


## **4.0. Convenciones de Código**

**Naming Conventions:**
- Componentes: PascalCase (UserList.tsx)
- Hooks: camelCase con prefijo "use" (useUserList.ts)
- Tipos/Interfaces: PascalCase (UserDto, UserFormProps)
- Constantes: UPPER_SNAKE_CASE
- Funciones: camelCase
- CSS Classes: kebab-case o Tailwind

**Estructura de Componentes:**
```typescript
// Imports
import { FC } from 'react';

// Types
interface ComponentProps {
  // props
}

// Component
export const Component: FC<ComponentProps> = ({ props }) => {
  // hooks
  // handlers
  // render
  return (/* JSX */);
};
```

**TypeScript Strict Mode**: Activado
**ESLint Rules**: eslint-config-next + @typescript-eslint, ejecutados por ESLint CLI


## **5.0. Integración con BackEnd**

**Configuración de API:**
- Base URL desde variables de entorno
- Interceptores para auth tokens
- Manejo de errores centralizado
- Retry logic para peticiones fallidas

**Ejemplo base / simplificado de Cliente API (con ky - TypeScript First):**
```typescript
// lib/http/httpClient.ts
import ky from 'ky';

export const apiClient = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'content-type': 'application/json',
  },
  hooks: {
    beforeRequest: [
      request => {
        // Auth token
        const token = localStorage.getItem('auth_token');
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      }
    ],
    afterResponse: [
      async (request, options, response) => {
        const traceId = response.headers.get('X-TraceId');
        const traceContext = traceId ? { traceId } : undefined;

        // Error handling
        if (!response.ok) {
          // Asociar traceContext al manejo de error técnico si la aplicación lo necesita.
          throw new Error(`HTTP Error: ${response.status}`);
        }
        return response;
      }
    ]
  }
});
```

**Nota:** este ejemplo usa `localStorage`, por lo que aplica a runtime cliente/browser. En Server Components o código server-side debe utilizarse una estrategia compatible con el contexto de ejecución.
**Nota:** este snippet muestra una base mínima de cliente HTTP para explicar la convención general del proyecto.
**Nota:** cuando el BackEnd exponga `X-TraceId`, el cliente HTTP centralizado debe poder leerlo y dejarlo disponible para diagnóstico, especialmente en escenarios de error.

**Ejemplo con TanStack Query:**
```typescript
// modules/{modulo}/hooks/use{Entity}List.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/http/httpClient';
import { z } from 'zod';

const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
});

const UserSchema = z.object({
  id: z.string(),
  nombre: z.string(),
});

const UserListResponseSchema = z.discriminatedUnion('success', [
  z.object({
    success: z.literal(true),
    value: z.array(UserSchema),
    errors: z.array(ApiErrorSchema),
  }),
  z.object({
    success: z.literal(false),
    value: z.null(),
    errors: z.array(ApiErrorSchema).min(1),
  }),
]);

export const useUserList = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await apiClient.get('api/v1/users').json<unknown>();
      const result = UserListResponseSchema.parse(response);

      if (!result.success) {
        throw new Error(result.errors.map((error) => error.message).join('. '));
      }

      return result.value;
    },
  });
};
```

**DTOs Sincronizados**: Deben coincidir con los Responses del BackEnd


## **6.0. Variables de Entorno**

**.env.local:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_API_VERSION=v1
NEXT_PUBLIC_APP_NAME=VibeCoding
```

**.env.example** debe incluir todas las variables necesarias

**Convención de construcción de URLs:**
- `NEXT_PUBLIC_API_URL` representa el host base del BackEnd, por ejemplo `http://localhost:8080`.
- Cada cliente HTTP del FrontEnd debe construir explícitamente la ruta versionada completa del endpoint (`/api/v1/...`) al invocar la API.

## **7.0. Estrategia de Testing**

**Unit Tests:**
- Hooks personalizados
- Utilidades y helpers
- Validaciones Zod

**Integration Tests:**
- Componentes con data fetching
- Formularios completos
- Flujos de usuario

**E2E Tests:**
- Flujos críticos completos
- CRUD operations end-to-end


## **8.0. Documentación**

El README.md debe incluir:
- Descripción del proyecto
- Stack tecnológico
- Requisitos previos
- Instalación con el package manager definido por el lockfile del proyecto
- Variables de entorno
- Scripts disponibles:
  - `<package-manager> run dev` - Desarrollo
  - `<package-manager> run build` - Producción
  - `<package-manager> run test` - Tests
  - `<package-manager> run lint` - Linting
- Estructura de carpetas explicada
- Guía de contribución
- Convenciones de código

> ⚠️ **Convención obligatoria de package manager:** usar un único package manager por proyecto, determinado por su lockfile. No mezclar `npm`, `pnpm` y `yarn` en la documentación ni en los scripts operativos del mismo proyecto.


## **9.0. Ejemplos de Implementación**

### **9.1. Hook Personalizado para Data Fetching**

```typescript
// modules/usuarios/hooks/useUsuariosList.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { usuarioApi } from '../api/usuarioApi';
import type { UsuarioDto } from '../dto/Usuario.dto';

export const useUsuariosList = () => {
  return useQuery<UsuarioDto[], Error>({
    queryKey: ['usuarios'],
    queryFn: () => usuarioApi.getAll(),
  });
};
```

### **9.2. DTO con Validación Zod**

```typescript
// modules/usuarios/dto/Usuario.dto.ts
import { z } from 'zod';

// Schema de validación para DTO
export const UsuarioDtoSchema = z.object({
  id: z.string().uuid('ID debe ser un UUID válido'),
  nombre: z.string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  email: z.string()
    .email('Email inválido')
    .toLowerCase(),
  estado: z.enum(['activo', 'inactivo']),
  fechaCreacion: z.string().datetime(),
  fechaActualizacion: z.string().datetime(),
});

// Tipos derivados de Zod
export type UsuarioDto = z.infer<typeof UsuarioDtoSchema>;

// Schema para crear usuario
export const CreateUsuarioDtoSchema = UsuarioDtoSchema.omit({
  id: true,
  fechaCreacion: true,
  fechaActualizacion: true,
});

export type CreateUsuarioDto = z.infer<typeof CreateUsuarioDtoSchema>;

// Schema para actualizar usuario
export const UpdateUsuarioDtoSchema = CreateUsuarioDtoSchema.partial();
export type UpdateUsuarioDto = z.infer<typeof UpdateUsuarioDtoSchema>;
```

### **9.3. Cliente API Completo con Interceptores**

**Implementación recomendada / completa para el proyecto:**

```typescript
// lib/http/httpClient.ts
import ky from 'ky';

export const apiClient = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-App-Version': process.env.NEXT_PUBLIC_API_VERSION ?? 'v1',
  },
  hooks: {
    beforeRequest: [
      (request) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        if (response.status === 401) {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return response;
      },
    ],
  },
});
```

**Nota:** este ejemplo usa `localStorage`, por lo que aplica a runtime cliente/browser. En Server Components o código server-side debe utilizarse una estrategia compatible con el contexto de ejecución.

### **9.4. API Service para Usuarios (con patrón ROP)**

```typescript
// modules/usuarios/api/usuarioApi.ts
import { z } from 'zod';
import { apiClient } from '@/lib/http/httpClient';
import {
  UsuarioDto,
  CreateUsuarioDto,
  UpdateUsuarioDto,
  UsuarioResponseSchema,
} from '../dto';

const API_VERSION = 'v1';
const RESOURCE = 'usuarios';

const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
});

const createApiResponseSchema = <T extends z.ZodTypeAny>(valueSchema: T) =>
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

const UsuarioResultSchema = createApiResponseSchema(UsuarioResponseSchema);
const UsuarioListResultSchema = createApiResponseSchema(z.array(UsuarioResponseSchema));
const DeleteResultSchema = createApiResponseSchema(z.null());

function extractErrorMessage(errors: Array<{ code: string; message: string }>): string {
  return errors.map((error) => error.message).join('. ');
}

export const usuarioApi = {
  // Obtener todos los usuarios
  async getAll(): Promise<UsuarioDto[]> {
    const response = await apiClient
      .get(`api/${API_VERSION}/${RESOURCE}`)
      .json<unknown>();

    const result = UsuarioListResultSchema.parse(response);
    if (!result.success) {
      throw new Error(extractErrorMessage(result.errors) || 'Error al obtener usuarios');
    }
    return result.value;
  },

  // Obtener usuario por ID
  async getById(id: string): Promise<UsuarioDto> {
    if (!id) throw new Error('ID de usuario requerido');
    const response = await apiClient
      .get(`api/${API_VERSION}/${RESOURCE}/${id}`)
      .json<unknown>();

    const result = UsuarioResultSchema.parse(response);
    if (!result.success) {
      throw new Error(extractErrorMessage(result.errors) || 'Usuario no encontrado');
    }
    return result.value;
  },

  // Crear usuario
  async create(data: CreateUsuarioDto): Promise<UsuarioDto> {
    if (!data) throw new Error('Datos de usuario requeridos');
    const response = await apiClient
      .post(`api/${API_VERSION}/${RESOURCE}`, { json: data })
      .json<unknown>();

    const result = UsuarioResultSchema.parse(response);
    if (!result.success) {
      throw new Error(extractErrorMessage(result.errors) || 'Error al crear usuario');
    }
    return result.value;
  },

  // Actualizar usuario
  async update(id: string, data: UpdateUsuarioDto): Promise<UsuarioDto> {
    if (!id) throw new Error('ID de usuario requerido');
    if (!data) throw new Error('Datos de actualización requeridos');
    const response = await apiClient
      .put(`api/${API_VERSION}/${RESOURCE}/${id}`, { json: data })
      .json<unknown>();

    const result = UsuarioResultSchema.parse(response);
    if (!result.success) {
      throw new Error(extractErrorMessage(result.errors) || 'Error al actualizar usuario');
    }
    return result.value;
  },

  // Eliminar usuario
  async delete(id: string): Promise<void> {
    if (!id) throw new Error('ID de usuario requerido');
    const response = await apiClient
      .delete(`api/${API_VERSION}/${RESOURCE}/${id}`)
      .json<unknown>();

    const result = DeleteResultSchema.parse(response);
    if (!result.success) {
      throw new Error(extractErrorMessage(result.errors) || 'Error al eliminar usuario');
    }
  },
};
```

### **9.5. Componente Completo con Validaciones**

```typescript
// modules/usuarios/components/UsuariosList.tsx
'use client';

import { FC, useState, useMemo } from 'react';
import { useUsuariosList } from '../hooks/useUsuariosList';
import { UsuarioDto } from '../dto/Usuario.dto';
import Link from 'next/link';

interface UsuariosListProps {
  onEdit?: (usuario: UsuarioDto) => void;
  onDelete?: (id: string) => Promise<void>;
}

export const UsuariosList: FC<UsuariosListProps> = ({ onEdit, onDelete }) => {
  const { data: usuarios = [], isLoading, error, refetch } = useUsuariosList();
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  // Filtrar y buscar usuarios
  const filtered = useMemo(
    () => usuarios.filter((u) =>
      u.nombre.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    ),
    [usuarios, search]
  );

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;

    try {
      setDeleting(id);
      await onDelete?.(id);
      await refetch();
    } finally {
      setDeleting(null);
    }
  };

  // Estados de carga y error
  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Cargando usuarios...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error.message}
        <button onClick={refetch} className="ml-2 underline">
          Reintentar
        </button>
      </div>
    );
  }

  if (usuarios.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No hay usuarios</p>
        <Link href="/usuarios/crear" className="bg-blue-600 text-white px-4 py-2 rounded">
          Crear primero
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Búsqueda y botón crear */}
      <div className="flex justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Link
          href="/usuarios/crear"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Nuevo Usuario
        </Link>
      </div>

      {/* Tabla de usuarios */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-3 text-left">Nombre</th>
              <th className="border border-gray-300 p-3 text-left">Email</th>
              <th className="border border-gray-300 p-3 text-left">Estado</th>
              <th className="border border-gray-300 p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((usuario) => (
              <tr key={usuario.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-3">{usuario.nombre}</td>
                <td className="border border-gray-300 p-3">{usuario.email}</td>
                <td className="border border-gray-300 p-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    usuario.estado === 'activo'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {usuario.estado}
                  </span>
                </td>
                <td className="border border-gray-300 p-3 space-x-2 text-center">
                  <button
                    onClick={() => onEdit?.(usuario)}
                    className="text-blue-600 hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(usuario.id)}
                    disabled={deleting === usuario.id}
                    className="text-red-600 hover:underline disabled:opacity-50"
                  >
                    {deleting === usuario.id ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Información de resultados */}
      <div className="text-sm text-gray-500">
        Mostrando {filtered.length} de {usuarios.length} usuarios
      </div>
    </div>
  );
};
```

### **9.6. Formulario con React Hook Form y Zod**

```typescript
// modules/usuarios/components/UsuarioForm.tsx
'use client';

import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateUsuarioDtoSchema, CreateUsuarioDto } from '../dto/Usuario.dto';

interface UsuarioFormProps {
  onSubmit: (data: CreateUsuarioDto) => Promise<void>;
  isLoading?: boolean;
}

export const UsuarioForm: FC<UsuarioFormProps> = ({ onSubmit, isLoading = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateUsuarioDto>({
    resolver: zodResolver(CreateUsuarioDtoSchema),
  });

  const handleFormSubmit = async (data: CreateUsuarioDto) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      // Manejar el error en UI sin logging en consola por defecto.
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 max-w-md">
      {/* Campo Nombre */}
      <div>
        <label className="block text-sm font-medium mb-1">Nombre</label>
        <input
          {...register('nombre')}
          type="text"
          placeholder="Nombre completo"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.nombre && (
          <p className="text-red-600 text-sm mt-1">{errors.nombre.message}</p>
        )}
      </div>

      {/* Campo Email */}
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          {...register('email')}
          type="email"
          placeholder="correo@ejemplo.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && (
          <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Botón Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Creando...' : 'Crear Usuario'}
      </button>
    </form>
  );
};
```

### **9.7. Componente DatePickerField (Selector de Fechas)**

Componente reutilizable para selección de fechas con formato **dd/MM/yyyy** y locale español.

**Ubicación:** `src/components/ui/DatePickerField.tsx`

**Características:**
- Formato de visualización: dd/MM/yyyy (ej: 15/06/1990)
- Locale español (Argentina)
- Selectores desplegables de año y mes para fechas lejanas
- Salida en formato ISO (yyyy-MM-dd) para el backend
- Integración con react-hook-form via Controller
- Soporte para minDate, maxDate, disabled, required, helperText

```typescript
// src/components/ui/DatePickerField.tsx
'use client';

import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import DatePicker, { registerLocale } from 'react-datepicker';
import { es } from 'date-fns/locale/es';
import { format, parseISO } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';

// Registrar locale español
registerLocale('es', es);

interface DatePickerFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  placeholder?: string;
}

export function DatePickerField<T extends FieldValues>({
  name,
  control,
  label,
  minDate,
  maxDate,
  disabled = false,
  required = false,
  helperText,
  placeholder = 'dd/mm/aaaa',
}: DatePickerFieldProps<T>) {
  return (
    <div className="space-y-1">
      <label className="form-label">
        {label} {required && <span className="text-error-500">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <DatePicker
              selected={value ? parseISO(value) : null}
              onChange={(date: Date | null) => {
                onChange(date ? format(date, 'yyyy-MM-dd') : '');
              }}
              dateFormat="dd/MM/yyyy"
              locale="es"
              placeholderText={placeholder}
              minDate={minDate}
              maxDate={maxDate}
              disabled={disabled}
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
              yearDropdownItemNumber={100}
              scrollableYearDropdown
              className={`form-input w-full ${error ? 'form-input-error' : ''}`}
              wrapperClassName="w-full"
            />
            {error && (
              <p className="form-error" role="alert">{error.message}</p>
            )}
            {helperText && !error && (
              <p className="form-helper">{helperText}</p>
            )}
          </>
        )}
      />
    </div>
  );
}
```

**Uso en formularios:**

```tsx
import { DatePickerField } from '@/components/ui';

// En CompletarPerfilPersonaFisicaForm.tsx
<DatePickerField
  name="fechaNacimiento"
  control={control}
  label="Fecha de Nacimiento"
  maxDate={new Date()}
  disabled={isLoading}
  required
/>

// En CompletarPerfilProfesionalForm.tsx (con restricción de edad 18-80)
<DatePickerField
  name="fechaNacimiento"
  control={control}
  label="Fecha de Nacimiento"
  minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 80))}
  maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18))}
  disabled={isLoading}
  required
  helperText="Debe ser mayor de 18 años y menor de 80 años"
/>
```

**Estilos personalizados:** `src/styles/datepicker.css` (importado en `layout.tsx`)

### **9.8. Error Boundary Global**

```typescript
// modules/shared/components/common/GlobalErrorBoundary.tsx
'use client';

import { FC, ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => (
  <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Error inesperado</h2>
      <p className="text-gray-600 mb-4 text-sm break-words">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full"
      >
        Reintentar
      </button>
      <button
        onClick={() => window.location.href = '/'}
        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 w-full mt-2"
      >
        Volver al inicio
      </button>
    </div>
  </div>
);

interface GlobalErrorBoundaryProps {
  children: ReactNode;
}

export const GlobalErrorBoundary: FC<GlobalErrorBoundaryProps> = ({ children }) => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    {children}
  </ErrorBoundary>
);
```

### **9.9. Configuración de package.json**

```json
{
  "name": "vibecoding-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,json,md}\"",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "type-check": "tsc --noEmit",
    "validate": "<package-manager> run type-check && <package-manager> run lint && <package-manager> run test"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next": "^15.0.0",
    "ky": "^1.2.0",
    "@tanstack/react-query": "^5.28.0",
    "zod": "^3.23.0",
    "react-hook-form": "^7.51.0",
    "@hookform/resolvers": "^3.3.0",
    "zustand": "^4.5.0",
    "react-error-boundary": "^4.0.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "^15.0.0",
    "prettier": "^3.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "vitest": "^2.0.0",
    "@vitest/coverage-v8": "^2.0.0",
    "playwright": "^1.42.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0"
  }
}
```

**Nota:** el campo `validate` del ejemplo usa `<package-manager>` como pseudocódigo documental. Debe reemplazarse por el package manager real del proyecto según su lockfile.

### **9.10. Configuración tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/modules/shared/components/*"],
      "@hooks/*": ["./src/modules/shared/hooks/*"],
      "@utils/*": ["./src/modules/shared/utils/*"],
      "@types/*": ["./src/modules/shared/types/*"],
      "@api/*": ["./src/lib/http/*"],
      "@config/*": ["./src/config/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "build"]
}
```


## **10.0. Verificaciones y Controles Obligatorios**

### **10.1. Validación de Datos**

- ✅ **Validar todas las respuestas de API** con esquemas Zod
- ✅ **Validar entrada de formularios** con react-hook-form + Zod
- ✅ **Verificar tipos en tiempo de compilación** con TypeScript strict mode
- ✅ **Ejecutar `<package-manager> run type-check`** antes de commits
- ✅ **Rechazar peticiones sin token** de autenticación
- ✅ **Validar tokens JWT** antes de usar datos sensibles

### **10.2. Manejo de Errores**

- ✅ **Capturar errores de red** con try-catch en hooks
- ✅ **Mostrar mensajes de error amigables** al usuario
- ✅ **Implementar retry logic** para peticiones fallidas
- ✅ **Log de errores en consola** solo en desarrollo
- ✅ **Redirigir a login si token expira** (status 401)
- ✅ **Mostrar error genérico si API falla**
- ✅ **Preservar `X-TraceId`** cuando el BackEnd lo envíe para debugging, soporte y trazabilidad

### **10.3. Seguridad**

- ✅ **Nunca almacenar credenciales en localStorage** (solo tokens)
- ✅ **Validar CORS** desde la API del BackEnd
- ✅ **Usar HTTPS en producción**
- ✅ **Implementar Content Security Policy** en next.config.js
- ✅ **Sanitizar inputs de usuario** con librerías como DOMPurify
- ✅ **Proteger rutas privadas** con middleware de autenticación
- ✅ **No exponer datos sensibles** en URLs o variables de entorno públicas

### **10.4. Performance**

- ✅ **Usar lazy loading** para componentes pesados
- ✅ **Implementar debounce** en búsquedas (useDebounce hook)
- ✅ **Cachear respuestas de API** cuando sea posible
- ✅ **Optimizar imágenes** con componente Image de Next.js
- ✅ **Usar memo() para componentes que no cambian**
- ✅ **Evitar re-renders innecesarios** con useCallback
- ✅ **Medir Lighthouse** antes de deploy

### **10.5. Calidad de Código**

- ✅ **Ejecutar eslint** en cada commit
- ✅ **Ejecutar prettier** para formato consistente
- ✅ **Escribir tests unitarios** para hooks y utilidades
- ✅ **Cobertura mínima de tests**: 80%
- ✅ **Usar nombrado consistente** (PascalCase, camelCase, etc.)
- ✅ **Documentar funciones complejas** con JSDoc
- ✅ **No dejar console.log()** en código de producción

### **10.6. Checklist Antes de Deploy**

- ✅ **Ejecutar `<package-manager> run validate`** (type-check + lint + tests)
- ✅ **Revisar build sin errores**: `<package-manager> run build`
- ✅ **Probar en ambiente de staging**
- ✅ **Verificar variables de entorno** en .env.production
- ✅ **Comprobar que no hay secrets** en código
- ✅ **Revisar respuestas de API** en Network tab
- ✅ **Testing de flujos críticos** (login, CRUD, etc.)
- ✅ **Performance en móvil** con DevTools
- ✅ **Accesibilidad WCAG 2.1 AA**

### **10.7. Integración con OpenAPI y contrato estándar del BackEnd**

**Importante:** El FrontEnd debe consumir el contrato HTTP del BackEnd Java actual usando OpenAPI como fuente de verdad.

**Fuentes válidas de contrato:**
1. `GET /api-docs`
2. Archivo exportado manualmente como `openapi.json`
3. Archivo exportado manualmente como `swagger.json`

**Workflow obligatorio de integración FrontEnd:**
1. ✅ Obtener el contrato OpenAPI actualizado desde `/api-docs` o desde el archivo exportado por BackEnd
2. ✅ Verificar endpoints, métodos HTTP, params, DTOs y status codes contra ese contrato
3. ✅ Generar tipos TypeScript si aporta valor (`openapi-typescript`, `swagger-typescript-api`, etc.)
4. ✅ Modelar y validar en FrontEnd el envelope estándar del proyecto
5. ✅ Implementar clientes `ky`, hooks de TanStack Query y schemas Zod alineados con el contrato real
6. ✅ Leer y preservar `X-TraceId` cuando el BackEnd lo incluya en headers, especialmente en respuestas de error
7. ✅ Si el contrato y la implementación observada difieren, detener la integración y alinear con BackEnd antes de continuar

**Envelope estándar del proyecto:**

```json
// Respuesta exitosa (Result<T>.Success)
{
  "success": true,
  "value": {},
  "errors": []
}
```

```json
// Respuesta con error (Result<T>.Failure)
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

**Reglas:**
- `success` discrimina éxito o falla
- `value` contiene el payload cuando `success=true`
- `value` debe ser `null` cuando `success=false`
- `errors` debe ser un array, vacío en éxito y con al menos un error en falla
- `X-TraceId` puede llegar por header HTTP y debe contemplarse operativamente para trazabilidad entre cliente y servidor
- El FrontEnd no depende de nombres de clases, paquetes ni librerías internas del BackEnd

**Definición de Schemas Zod para el contrato estándar:**

```typescript
import { z } from 'zod';

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
```

**Generación de Tipos desde OpenAPI:**

```bash
# Instalar generador
<package-manager> add -D openapi-typescript

# Generar tipos desde el endpoint obligatorio del BackEnd Java
<package-manager> exec openapi-typescript http://localhost:8080/api-docs -o ./src/types/api/openapi.d.ts

# Alternativa: generar tipos desde handoff manual exportado por BackEnd
<package-manager> exec openapi-typescript ./docs/contracts/openapi.json -o ./src/types/api/openapi.d.ts
```

### **10.8. Requisitos de Variables de Entorno**

**Desarrollo (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_API_VERSION=v1
NEXT_PUBLIC_LOG_LEVEL=debug
NEXT_PUBLIC_APP_NAME=VibeCoding Dev
NODE_ENV=development
```

**Producción (.env.production):**
```env
NEXT_PUBLIC_API_URL=https://api.vibecoding.com
NEXT_PUBLIC_API_VERSION=v1
NEXT_PUBLIC_LOG_LEVEL=info
NEXT_PUBLIC_APP_NAME=VibeCoding
NODE_ENV=production
```

### **10.9. Estructura de Pruebas Requerida**

```
__tests__/
├── unit/
│   ├── hooks/
│   │   ├── useUsuariosList.test.ts
│   │   └── useDebounce.test.ts
│   ├── utils/
│   │   └── formatters.test.ts
│   └── dto/
│       └── Usuario.dto.test.ts
├── integration/
│   ├── UsuariosList.integration.test.tsx
│   ├── UsuarioForm.integration.test.tsx
│   └── api/
│       └── usuarioApi.integration.test.ts
└── e2e/
    ├── usuarios.e2e.test.ts
    └── auth.e2e.test.ts
```

### **10.10. Métricas de Calidad Obligatorias**

| Métrica | Mínimo Requerido | Target |
|---------|-----------------|--------|
| TypeScript Strict Mode | ✅ Sí | ✅ Sí |
| ESLint Errors | 0 | 0 |
| Test Coverage | 80% | 85%+ |
| Lighthouse Score | 80 | 90+ |
| Bundle Size | <250KB | <200KB |
| Time to Interactive | <3s | <2s |
| First Contentful Paint | <2.5s | <1.5s |

### **10.11. Validaciones en Compilación**

Antes de hacer `<package-manager> run build`, validar:

```bash
# 1. Verificar tipos
<package-manager> run type-check

# 2. Verificar linting
<package-manager> run lint

# 3. Ejecutar tests
<package-manager> run test

# 4. Build sin errores
<package-manager> run build

# 5. Análisis de bundle
<package-manager> run analyze
```

Si alguno falla, **no proceder con el deploy**.


## **11.0. Flujo de Datos Completo**

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuario interactúa con Componente                         │
│    (click en botón, envío de formulario, etc.)               │
└──────────────────────┬──────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Hook Personalizado (useUsuariosList)                      │
│    - Maneja estado (usuarios, loading, error)                │
│    - Ejecuta lógica de negocio                               │
└──────────────────────┬──────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. API Service (usuarioApi.ts)                               │
│    - Valida parámetros                                       │
│    - Construye petición HTTP                                 │
└──────────────────────┬──────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Cliente ky centralizado                                   │
│    - Agrega token JWT                                        │
│    - Headers y versión de API                                │
└──────────────────────┬──────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. BackEnd REST API                                          │
│    - Procesa petición                                        │
│    - Valida datos                                            │
│    - Retorna Response (DTO validado)                         │
└──────────────────────┬──────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Interceptor de Response                                   │
│    - Maneja errores HTTP                                     │
│    - Redirige si 401 (token expirado)                        │
└──────────────────────┬──────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. API Service valida envelope con Zod                       │
│    - success / value / errors                                │
│    - DTOs alineados con OpenAPI                              │
└──────────────────────┬──────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. React Query actualiza cache y estado remoto               │
│    - loading / error / data                                  │
│    - re-fetch y cache automático                             │
└──────────────────────┬──────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 9. Componente Re-renderiza                                   │
│    - Muestra lista de usuarios                               │
│    - O muestra error si algo falló                           │
└─────────────────────────────────────────────────────────────┘
```


## **12.0. Guía Rápida de Uso**

### **Para Generar un Módulo Nuevo:**

1. Crear carpeta en `src/modules/{nombreModulo}/`
2. Crear subcarpetas: `components/`, `hooks/`, `api/`, `dto/`, `utils/`
3. Definir DTO con esquemas Zod
4. Crear API service con validaciones
5. Crear hooks reutilizables
6. Crear componentes con TypeScript strict
7. Agregar tests unitarios
8. Actualizar rutas en `src/app/`
9. Documentar en README.md

### **Para Crear una Nueva Petición API:**

1. Agregar método en API service
2. Validar parámetros
3. Crear hook personalizado
4. Usar en componente
5. Validar respuesta con Zod
6. Escribir test unitario
7. Revisar en Network tab del navegador

### **Antes de Cada Commit:**

```bash
<package-manager> run format        # Formatear código
<package-manager> run lint:fix      # Arreglar lint errors
<package-manager> run type-check    # Verificar tipos
<package-manager> run test          # Ejecutar tests
<package-manager> run build         # Verificar que compila
```

Si todos pasan, commit seguro.
