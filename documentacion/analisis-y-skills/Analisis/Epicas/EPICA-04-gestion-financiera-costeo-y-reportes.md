# Épica 04 - Gestión financiera, costeo y reportes

## 1. Identificación
- **ID:** EP-004
- **Nombre:** Gestión financiera, costeo y reportes
- **Casos de uso incluidos:** CU-009, CU-010, CU-011, CU-012, CU-028
- **Prioridad:** Media
- **Estado:** Propuesta
- **Fecha:** 2026-07-13

## 2. Objetivo de negocio
Brindar visibilidad y control sobre los aspectos financieros de la carpeta de importación, incluyendo vencimientos, pagos, costeo y generación de reportes de gestión.

## 3. Casos de uso asociados
| ID | Nombre | Actor principal | Dependencias | Resumen |
|----|--------|-----------------|--------------|---------|
| CU-009 | Generar alertas de vencimiento de pago | Tesorería / Finance | Depende del estado operativo | Detecta próximos vencimientos. |
| CU-010 | Confirmar pago al proveedor | Tesorería | Depende de CU-009 | Registra el pago al proveedor. |
| CU-011 | Registrar costeo y referencia SAP | Finance / Contabilidad | Depende de la operación | Asocia el costeo y referencia SAP. |
| CU-012 | Exportar reportes | Dirección / Gestión | Depende de los datos consolidados | Exporta información para análisis. |
| CU-028 | Gestionar instancia de pagos de la carpeta | Tesorería | Depende de la carpeta | Gestiona pagos asociados a la carpeta. |

## 4. Verificación de consistencia
### 4.1 Inconsistencias detectadas
| CU origen | Regla / comportamiento | Problema | Severidad | Acción |
|-----------|------------------------|---------|-----------|--------|
| CU-010 / CU-028 | Pago y gestión de instancia | Puede existir solapamiento funcional | Media | Definir responsabilidad de cada flujo. |

### 4.2 Gaps funcionales
| Gap | Contexto | Impacto | Prioridad |
|-----|----------|---------|-----------|
| Consolidación financiera | La información puede dispersarse | Menor visibilidad gerencial | Media |

### 4.3 Glosario de términos
| Término canónico | Definición | Sinónimos aceptados |
|------------------|------------|---------------------|
| Vencimiento de pago | Fecha límite para el pago | vencimiento |
| Costeo | Asignación de costos a la operación | costeo operativo |
| Referencia SAP | Identificador contable o financiero | referencia |

## 5. Dependencias y flujo integrado
### 5.1 Matriz de dependencias
| CU | Dependencias |
|----|--------------|
| CU-009 | CU-001 |
| CU-010 | CU-009 |
| CU-011 | CU-001 |
| CU-012 | CU-009, CU-010, CU-011 |
| CU-028 | CU-001 |

### 5.2 Flujo integrado
1. Se detectan vencimientos y pagos.
2. Se registra el pago y el costeo.
3. Se generan reportes para gestión.

## 6. Elementos y capacidades comunes
| Elemento | Tipo | Observación |
|----------|------|-------------|
| Pago | Evento financiero | Central para la épica |
| Costeo | Regla contable | Requiere trazabilidad |
| Reporte | Salida de gestión | Consolida información |

## 7. Impactos técnicos detectados
| Impacto | Dominio | Skill relacionado |
|---------|---------|-------------------|
| Consolidación financiera | Datos / Backend | implementar-caso-uso-backend |
| Exportación de reportes | Frontend / Datos | implementar-caso-uso-frontend |

## 8. Criterios de éxito
- [x] Se detectan y gestionan los pagos pendientes.
- [x] Se registra el costeo de forma asociada a la carpeta.
- [x] Se generan reportes útiles para el negocio.

## 9. Notas y consideraciones
Esta épica tiene un rol transversal para control financiero y debe mantenerse alineada con la información operativa.
