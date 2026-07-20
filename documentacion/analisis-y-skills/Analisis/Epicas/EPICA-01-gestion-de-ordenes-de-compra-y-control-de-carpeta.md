# Épica 01 - Gestión de órdenes de compra y control de carpeta

## 1. Identificación
- **ID:** EP-001
- **Nombre:** Gestión de órdenes de compra y control de carpeta
- **Casos de uso incluidos:** CU-001, CU-027
- **Prioridad:** Alta
- **Estado:** Propuesta
- **Fecha:** 2026-07-13

## 2. Objetivo de negocio
Coordinar la creación, carga y validación inicial de la orden de compra como origen de la carpeta de importación, de modo que el proceso operativo pueda comenzar con información base completa y consistente.

## 3. Casos de uso asociados
| ID | Nombre | Actor principal | Dependencias | Resumen |
|----|--------|-----------------|--------------|---------|
| CU-001 | Gestionar orden de compra | Operador / Analista | Ninguna o previa carga documental | Define y registra la orden de compra como punto de partida del proceso. |
| CU-027 | Cargar artículos de la OC masivamente | Operador / Carga operativa | Depende de la existencia de la orden de compra | Permite cargar en forma masiva los artículos asociados a la OC. |

## 4. Verificación de consistencia
### 4.1 Inconsistencias detectadas
| CU origen | Regla / comportamiento | Problema | Severidad | Acción |
|-----------|------------------------|---------|-----------|--------|
| CU-001 / CU-027 | Origen de la carpeta | Debe quedar claro si la carpeta puede iniciarse sin carga masiva completa | Media | Definir regla de negocio de inicio parcial o completo. |

### 4.2 Gaps funcionales
| Gap | Contexto | Impacto | Prioridad |
|-----|----------|---------|-----------|
| Validación inicial de integridad de la OC | El proceso puede arrancar con datos incompletos | Retrasos operativos | Media |

### 4.3 Glosario de términos
| Término canónico | Definición | Sinónimos aceptados |
|------------------|------------|---------------------|
| Orden de compra | Documento base que inicia la carpeta de importación | OC, orden |
| Carpeta de importación | Conjunto operativo asociado a la importación | carpeta, expediente |

## 5. Dependencias y flujo integrado
### 5.1 Matriz de dependencias
| CU | Dependencias |
|----|--------------|
| CU-001 | Ninguna |
| CU-027 | CU-001 |

### 5.2 Flujo integrado
1. Se registra o identifica la orden de compra.
2. Se cargan los artículos asociados.
3. Se deja la carpeta lista para continuar el flujo operativo.

## 6. Elementos y capacidades comunes
| Elemento | Tipo | Observación |
|----------|------|-------------|
| Orden de compra | Entidad funcional | Base del proceso |
| Artículos de la OC | Concepto recurrente | Deben estar alineados con la carpeta |

## 7. Impactos técnicos detectados
| Impacto | Dominio | Skill relacionado |
|---------|---------|-------------------|
| Carga masiva de datos | Datos / Backend | implementar-caso-uso-backend |
| Visualización de la carpeta inicial | Frontend | implementar-caso-uso-frontend |

## 8. Criterios de éxito
- [x] La orden de compra queda vinculada al inicio del proceso.
- [x] La carga masiva se integra con el flujo operativo.
- [x] Se identifican las condiciones de inicio de carpeta.

## 9. Notas y consideraciones
La épica tiene fuerte vínculo con el arranque del proceso y debe quedar bien definida antes de avanzar a etapas operativas más complejas.
