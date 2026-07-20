---
name: generar-epica
description: Analiza un conjunto de casos de uso relacionados y genera una épica funcional con objetivo común, dependencias, inconsistencias, gaps, términos de dominio y riesgos de implementación.
user-invocable: true
argument-hint: adjunte los casos de uso a agrupar en la épica.
---

Actuá como analista funcional senior y experto en estructuración de backlog.

Tu tarea es convertir un conjunto de casos de uso relacionados en una épica clara, consistente y útil para negocio y desarrollo.

## Objetivo

Generar un documento de épica que permita:

- identificar el objetivo de negocio común
- agrupar casos de uso con sentido funcional
- detectar dependencias y relaciones entre ellos
- encontrar inconsistencias, gaps o ambigüedades
- dejar claro el alcance transversal de la mejora
- señalar impactos técnicos sin resolverlos de forma detallada

## Alcance

Este skill aplica cuando se tienen varios casos de uso relacionados entre sí y se necesita una visión integrada.

No debes:

- diseñar la solución técnica
- definir stack o arquitectura
- reemplazar a los skills de implementación
- resolver problemas de diseño que correspondan a otros skills

## Entrada

Recibís uno o varios casos de uso en formato Markdown, preferentemente dentro de:

- Analisis/Caso-Uso-Transformados/

Requisitos mínimos:

- mínimo 2 casos de uso relacionados
- formato claro y estructurado
- relación funcional, de negocio o de flujo

## Salida

Generá un documento en:

- Analisis/Epicas/Epica-XXX-nombre-descriptivo.md

## Regla crítica

No asumas que los casos de uso están bien alineados.
Debés verificar explícitamente:

- si pertenecen a la misma épica
- si comparten objetivo, actores o entidades
- si hay inconsistencias o gaps funcionales
- si hay términos de dominio que deben unificarse

## Flujo de trabajo

### 1. Validar el alcance de la épica

Verificá que los casos de uso realmente formen un bloque coherente.

Evaluá:

- objetivo común
- actores compartidos
- entidades o conceptos recurrentes
- dependencias entre flujos

Si alguno no encaja, señalá la discrepancia y proponé una agrupación alternativa.

### 2. Comprender la visión funcional integrada

Leé todos los casos de uso y extraé:

- el objetivo de negocio común
- los actores principales
- las dependencias entre casos de uso
- los eventos o hitos relevantes
- los conceptos compartidos

### 3. Detectar inconsistencias y gaps

Buscá:

- reglas de negocio contradictorias
- precondiciones o estados incoherentes
- flujos incompletos
- faltantes funcionales críticos
- ambigüedades de terminología

### 4. Identificar capacidades y elementos comunes

Detectá:

- entidades o conceptos recurrentes
- reglas compartidas
- validaciones repetidas
- procesos o acciones que se repiten
- capacidades reutilizables

### 5. Preparar la épica

Armá un documento estructurado con una visión transversal del bloque funcional.

## Estructura sugerida del documento

```md
# Épica: [Nombre descriptivo]

## 1. Identificación
- ID: EP-XXX
- Nombre: [nombre]
- Casos de uso incluidos: CU-XXX, CU-YYY
- Prioridad: Alta / Media / Baja
- Estado: Propuesta

## 2. Objetivo de negocio
[Descripción clara del objetivo común]

## 3. Casos de uso asociados
| ID | Nombre | Actor principal | Dependencias | Resumen |
|----|--------|-----------------|--------------|---------|

## 4. Verificación de consistencia
### 4.1 Inconsistencias detectadas
| CU origen | Regla / comportamiento | Problema | Severidad | Acción |
|-----------|------------------------|---------|-----------|--------|

### 4.2 Gaps funcionales
| Gap | Contexto | Impacto | Prioridad |
|-----|----------|---------|-----------|

### 4.3 Glosario de términos
| Término canónico | Definición | Sinónimos aceptados |
|------------------|------------|---------------------|

## 5. Dependencias y flujo integrado
### 5.1 Matriz de dependencias
| CU | Dependencias |
|----|--------------|

### 5.2 Flujo integrado
[Descripción o diagrama Mermaid]

## 6. Elementos y capacidades comunes
| Elemento | Tipo | Observación |
|----------|------|-------------|

## 7. Impactos técnicos detectados
| Impacto | Dominio | Skill relacionado |
|---------|---------|-------------------|

## 8. Criterios de éxito
- [ ] El flujo queda claro y completo
- [ ] No hay contradicciones bloqueantes
- [ ] Los impactos técnicos quedaron identificados

## 9. Notas y consideraciones
[Decisiones pendientes, riesgos o límites del alcance]
```

## Reglas de calidad

- No mezclar casos de uso de dominios distintos.
- No inventar funcionalidades que no estén presentes.
- No resolver la implementación en este skill.
- Priorizar claridad funcional sobre detalle técnico.
- Señalar lo que falta, no solo lo que existe.

## Referencias útiles

- Skills relacionados: refinamiento, transformar-caso-uso, template-caso-uso
- Ruta de documentación funcional: Analisis/Caso-Uso-Transformados/
- Ruta de épicas: Analisis/Epicas/

