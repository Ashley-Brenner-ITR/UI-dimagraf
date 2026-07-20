# Épica 03 - Gestión aduanera y recepción operativa

## 1. Identificación
- **ID:** EP-003
- **Nombre:** Gestión aduanera y recepción operativa
- **Casos de uso incluidos:** CU-006, CU-007, CU-014, CU-015
- **Prioridad:** Alta
- **Estado:** Propuesta
- **Fecha:** 2026-07-13

## 2. Objetivo de negocio
Gestionar la nacionalización y la recepción operativa del embarque, asegurando que el despacho aduanero y la confirmación de ingreso en depósito puedan ejecutarse con trazabilidad y control.

## 3. Casos de uso asociados
| ID | Nombre | Actor principal | Dependencias | Resumen |
|----|--------|-----------------|--------------|---------|
| CU-006 | Gestionar despacho aduanero | Despachante / Operación | Depende del embarque | Administra el despacho aduanero. |
| CU-007 | Confirmar recepción en depósito | Operación / Deposito | Depende del arribo | Registra la recepción física. |
| CU-014 | Cargar datos de despacho aduanero | Despachante | Depende de CU-006 | Carga información de despacho. |
| CU-015 | Confirmar recepción e ingreso en depósito | Operación | Depende de CU-007 | Formaliza el ingreso al depósito. |

## 4. Verificación de consistencia
### 4.1 Inconsistencias detectadas
| CU origen | Regla / comportamiento | Problema | Severidad | Acción |
|-----------|------------------------|---------|-----------|--------|
| CU-007 / CU-015 | Confirmación de ingreso | Debe definirse si ambas son diferenciadas o redundantes | Media | Clarificar el alcance funcional. |

### 4.2 Gaps funcionales
| Gap | Contexto | Impacto | Prioridad |
|-----|----------|---------|-----------|
| Visibilidad de estado de despacho | La operación puede perder trazabilidad | Afecta control operativo | Media |

### 4.3 Glosario de términos
| Término canónico | Definición | Sinónimos aceptados |
|------------------|------------|---------------------|
| Despacho aduanero | Trámite de nacionalización y liberación | despacho |
| Recepción en depósito | Ingreso formal del embarque al depósito | ingreso, recepción |

## 5. Dependencias y flujo integrado
### 5.1 Matriz de dependencias
| CU | Dependencias |
|----|--------------|
| CU-006 | CU-002 |
| CU-014 | CU-006 |
| CU-007 | CU-005 |
| CU-015 | CU-007 |

### 5.2 Flujo integrado
1. Se gestiona el despacho aduanero.
2. Se cargan los datos asociados.
3. Se confirma la recepción y el ingreso en depósito.

## 6. Elementos y capacidades comunes
| Elemento | Tipo | Observación |
|----------|------|-------------|
| Despacho aduanero | Proceso funcional | Central para la liberación |
| Recepción | Evento operativo | Marca avance del flujo |

## 7. Impactos técnicos detectados
| Impacto | Dominio | Skill relacionado |
|---------|---------|-------------------|
| Integración con datos de despacho | Datos / Backend | implementar-caso-uso-backend |
| Registro de recepción | Frontend | implementar-caso-uso-frontend |

## 8. Criterios de éxito
- [x] El despacho aduanero queda trazado.
- [x] Se confirma la recepción operativa.
- [x] Se mantiene la asociación entre despacho y depósito.

## 9. Notas y consideraciones
El flujo debe quedar alineado con los tiempos y reglas del proceso aduanero para evitar interrupciones de la operación.
