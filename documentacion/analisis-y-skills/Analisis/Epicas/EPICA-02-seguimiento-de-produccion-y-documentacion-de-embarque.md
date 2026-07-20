# Épica 02 - Seguimiento de producción y documentación de embarque

## 1. Identificación
- **ID:** EP-002
- **Nombre:** Seguimiento de producción y documentación de embarque
- **Casos de uso incluidos:** CU-002, CU-003, CU-004, CU-005, CU-008
- **Prioridad:** Alta
- **Estado:** Propuesta
- **Fecha:** 2026-07-13

## 2. Objetivo de negocio
Asegurar el seguimiento operativo del embarque desde la producción hasta el arribo, incluyendo la apertura de subcarpetas, la administración documental y la visibilidad del tránsito.

## 3. Casos de uso asociados
| ID | Nombre | Actor principal | Dependencias | Resumen |
|----|--------|-----------------|--------------|---------|
| CU-002 | Registrar y actualizar embarque / subcarpeta | Operador / Logística | Depende del inicio de carpeta | Registra el embarque y su subcarpeta asociada. |
| CU-003 | Hacer seguimiento de producción pre-embarque | Operación / Producción | Depende de CU-002 | Monitorea el estado previo al embarque. |
| CU-004 | Gestionar documentación del embarque | Operación | Depende del embarque | Administra los documentos del embarque. |
| CU-005 | Gestionar tránsito, arribos y alertas operativas | Operación / Logística | Depende del embarque | Controla tránsito y alertas. |
| CU-008 | Consultar arribos (comercial) | Comercial | Depende de CU-005 | Permite consultar información de arribos. |

## 4. Verificación de consistencia
### 4.1 Inconsistencias detectadas
| CU origen | Regla / comportamiento | Problema | Severidad | Acción |
|-----------|------------------------|---------|-----------|--------|
| CU-002 / CU-004 | Documentación asociada | No queda claro si la subcarpeta debe existir antes o después de la documentación | Media | Definir orden de creación. |

### 4.2 Gaps funcionales
| Gap | Contexto | Impacto | Prioridad |
|-----|----------|---------|-----------|
| Visibilidad de estado integral | El seguimiento puede quedar fragmentado | Menor trazabilidad operativa | Media |

### 4.3 Glosario de términos
| Término canónico | Definición | Sinónimos aceptados |
|------------------|------------|---------------------|
| Embarque | Movimiento físico o documental del producto | envío, carga |
| Subcarpeta | Carpeta operativa asociada al embarque | carpeta secundaria |
| Arribo | Llegada al punto de destino | ingreso, llegada |

## 5. Dependencias y flujo integrado
### 5.1 Matriz de dependencias
| CU | Dependencias |
|----|--------------|
| CU-002 | CU-001 |
| CU-003 | CU-002 |
| CU-004 | CU-002 |
| CU-005 | CU-002 |
| CU-008 | CU-005 |

### 5.2 Flujo integrado
1. Se registra el embarque y la subcarpeta.
2. Se realiza el seguimiento pre-embarque.
3. Se gestionan documentos y se monitorean tránsito y arribos.

## 6. Elementos y capacidades comunes
| Elemento | Tipo | Observación |
|----------|------|-------------|
| Embarque | Entidad operativa | Núcleo de la épica |
| Documento de embarque | Recurso documental | Necesario para continuidad operativa |
| Alerta operativa | Evento transaccional | Facilita respuesta temprana |

## 7. Impactos técnicos detectados
| Impacto | Dominio | Skill relacionado |
|---------|---------|-------------------|
| Seguimiento en tiempo real de estado | Backend / Frontend | implementar-caso-uso-backend / implementar-caso-uso-frontend |
| Gestión documental | Datos | implementar-caso-uso-backend |

## 8. Criterios de éxito
- [x] El embarque queda visible y trazable.
- [x] La documentación y los eventos operativos se mantienen asociados.
- [x] Se puede consultar el estado de tránsito y arribo.

## 9. Notas y consideraciones
Esta épica es central para la continuidad operativa y debería mantenerse alineada con la gestión documental y de alertas.
