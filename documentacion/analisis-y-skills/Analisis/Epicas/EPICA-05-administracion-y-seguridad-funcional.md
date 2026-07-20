# Épica 05 - Administración y seguridad funcional

## 1. Identificación
- **ID:** EP-005
- **Nombre:** Administración y seguridad funcional
- **Casos de uso incluidos:** CU-013
- **Prioridad:** Media
- **Estado:** Propuesta
- **Fecha:** 2026-07-13

## 2. Objetivo de negocio
Brindar una base de configuración, maestros y controles funcionales que permitan operar el proceso con consistencia y alcance adecuado según el rol del usuario.

## 3. Casos de uso asociados
| ID | Nombre | Actor principal | Dependencias | Resumen |
|----|--------|-----------------|--------------|---------|
| CU-013 | Administrar maestros y configuración | Administrador funcional | Depende de la existencia del proceso | Permite administrar datos maestros y parámetros del proceso. |

## 4. Verificación de consistencia
### 4.1 Inconsistencias detectadas
| CU origen | Regla / comportamiento | Problema | Severidad | Acción |
|-----------|------------------------|---------|-----------|--------|
| CU-013 | Configuración transversal | Puede afectar múltiples flujos | Media | Definir criterios de impacto y aprobación. |

### 4.2 Gaps funcionales
| Gap | Contexto | Impacto | Prioridad |
|-----|----------|---------|-----------|
| Cobertura de permisos y roles | La administración puede quedar incompleta | Riesgo de operación | Media |

### 4.3 Glosario de términos
| Término canónico | Definición | Sinónimos aceptados |
|------------------|------------|---------------------|
| Maestro | Registro base de configuración operativa | catálogo |
| Configuración | Parámetro que regula el comportamiento del proceso | parámetro |

## 5. Dependencias y flujo integrado
### 5.1 Matriz de dependencias
| CU | Dependencias |
|----|--------------|
| CU-013 | Ninguna |

### 5.2 Flujo integrado
1. Se administran los maestros y parámetros del proceso.
2. Se habilitan o ajustan las reglas funcionales.
3. Se impacta el comportamiento global del proceso.

## 6. Elementos y capacidades comunes
| Elemento | Tipo | Observación |
|----------|------|-------------|
| Maestro | Entidad de configuración | Base transversal |
| Parámetro funcional | Regla | Afecta múltiples módulos |

## 7. Impactos técnicos detectados
| Impacto | Dominio | Skill relacionado |
|---------|---------|-------------------|
| Configuración global | Backend / Frontend | implementar-caso-uso-backend / implementar-caso-uso-frontend |

## 8. Criterios de éxito
- [x] Se pueden administrar los maestros y parámetros del negocio.
- [x] La configuración se aplica de forma consistente.
- [x] Se reduce la dispersión funcional del proceso.

## 9. Notas y consideraciones
Aunque es una épica transversal, su impacto es importante para asegurar consistencia y control del proceso.
