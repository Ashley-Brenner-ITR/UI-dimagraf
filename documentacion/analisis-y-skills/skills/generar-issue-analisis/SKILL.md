---
name: generar-issue-analisis
description: Este Skill se utiliza para generar un documento de análisis, entendimiento y plan de cambios basado en un documento de Issues reportados por QA. Debe utilizarse cuando se solicite analizar issues o bugs reportados.
user-invocable: true
argument-hint: adjunte el documento de Issues a analizar.
---

# 📋 Generador de Análisis de Issue

## Objetivo

Este skill guía al agente IA para generar un documento de análisis completo basado en un documento de Issues reportados por QA. El análisis incluye identificación de causa raíz, plan de cambios y estimación de impacto.

---

## 📥 Entrada

- **Fuente:** Documento de Issues ubicado en `docs/Issues/[nombre-archivo].docx` o adjunto al contexto
- **Requisitos:**
  - El documento debe contener issues claramente identificados
  - Información sobre el comportamiento esperado vs actual
  - Referencias a CU, HU o funcionalidad afectada

---

## 📤 Salida

- **Destino:** `docs/Issues/Entendimiento-[nombre-archivo].md`
- **Formato:** Documento Markdown con encoding UTF-8 With BOM

---

## 📋 Instrucciones para la IA

### Pasos a Ejecutar

1. **Leer y comprender** cada issue reportado
2. **Identificar el Caso de Uso (CU)** o Historia de Usuario afectada
3. **Analizar el CU/HU en contexto de la Épica** a la que pertenece (si existe)
4. **Analizar el código fuente relacionado** tomando como guías:
   - Para BackEnd: Lee el skill `arquitectura-stack-tecnologico-backend`
   - Para FrontEnd: Lee el skill `arquitectura-stack-tecnologico-frontend`
5. **Verificar cumplimiento de reglas de BD** (si el issue involucra capa de datos):
   - Validar normalización 3NF de entidades afectadas
   - Verificar nomenclatura singular en tablas/entidades
   - Detectar violaciones como posible causa raíz
6. **Determinar la causa raíz** de cada issue
7. **Proponer un plan de cambios** detallado
8. **Estimar el impacto y riesgo** de cada cambio

---

## 🏗️ Template del Documento de Análisis

```markdown
# Análisis de Issues: [ID-ISSUE o Nombre del Lote]

## 1. Información General
- **Documento de Issues informado:** [nombre-archivo.docx]
- **Documento de Issues de entendimiento generado:** [Entendimiento-nombre-archivo.md]
- **Documento de CU o HU relacionado:** [nombre-documento-cu-hu.md]
- **Documento de Épica relacionada (si existe):** [nombre-documento-epica.md]
- **CU/HU Relacionado:** [CU-XXX o HU-XXX]
- **Fecha de Análisis:** [dd/mm/aaaa]
- **Analizado por:** Agente IA (GitHub Copilot)

---

## 2. Resumen Ejecutivo
[Breve resumen del lote de issues: cantidad, severidad general, componentes afectados]

---

## 3. Issues Analizados

### Issue #1: [Título del Issue]
**Severidad:** [Crítica / Alta / Media / Baja]
**Estado:** Analizado

#### Descripción del Problema
[Descripción detallada del comportamiento reportado]

#### Comportamiento Esperado
[Qué debería suceder según el CU/HU]

#### Comportamiento Actual
[Qué está sucediendo actualmente]

#### Análisis de Causa Raíz
[Explicación técnica de por qué ocurre el problema]

#### Archivos Afectados
| Archivo | Línea(s) | Descripción del Cambio |
|---------|----------|------------------------|
| `src/path/file.ts` | 45-52 | [Descripción] |

#### Plan de Corrección
1. [Paso 1]
2. [Paso 2]
3. [Paso 3]

#### Impacto del Cambio
- **Riesgo:** [Alto / Medio / Bajo]
- **Componentes afectados:** [Lista]
- **Tests a modificar/agregar:** [Lista]

---

### Issue #2: [Título del Issue]
[Repetir estructura anterior para cada issue]

---

## 4. Dependencias entre Issues
| Issue | Depende de | Razón |
|-------|------------|-------|
| #2 | #1 | [Explicación] |

---

## 5. Orden de Implementación Recomendado
1. **Issue #X** - [Razón de prioridad]
2. **Issue #Y** - [Razón de prioridad]

---

## 6. Estimación de Esfuerzo
| Issue | Complejidad | Tiempo Estimado |
|-------|-------------|-----------------|
| #1 | [Alta/Media/Baja] | [X horas] |
| #2 | [Alta/Media/Baja] | [X horas] |
| **Total** | - | **[X horas]** |

---

## 7. Riesgos Identificados
| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| [Descripción] | [Alta/Media/Baja] | [Alto/Medio/Bajo] | [Acción] |

---

## 8. Tests Requeridos
### Tests a Modificar
- [ ] `tests/unit/[archivo].test.ts` - [Razón]

### Tests a Agregar
- [ ] Test para validar [escenario]
- [ ] Test para cubrir [caso edge]

---

## 9. Notas Adicionales
[Cualquier información relevante, consideraciones especiales, dependencias externas]

---

## 9.1. Análisis de Diseño de Base de Datos (si aplica)

> ⚠️ Completar esta sección si el issue involucra entidades, tablas o migraciones

### Verificación de Normalización 3NF
| Entidad Afectada | Cumple 1NF | Cumple 2NF | Cumple 3NF | Observaciones |
|------------------|------------|------------|------------|---------------|
| [Entidad] | ✅/❌ | ✅/❌ | ✅/❌ | [Detalle] |

### Verificación de Nomenclatura
| Elemento | Formato Actual | Formato Esperado | ¿Correcto? |
|----------|---------------|------------------|------------|
| Tabla/Entidad | [actual] | singular, snake_case | ✅/❌ |
| Columnas/Props | [actual] | snake_case | ✅/❌ |

### Violaciones como Causa Raíz
- [ ] El issue **NO** está relacionado con violaciones de diseño de BD
- [ ] El issue **SÍ** tiene como causa raíz una violación de 3NF: [detallar]
- [ ] El issue **SÍ** tiene como causa raíz nomenclatura incorrecta: [detallar]

> 📖 **Referencia:** Sección 11.0 del skill `arquitectura-stack-tecnologico-backend`

---

## 10. Checklist Pre-Implementación
- [ ] Todas las causas raíz identificadas
- [ ] Plan de cambios completo
- [ ] Dependencias entre issues mapeadas
- [ ] Orden de implementación definido
- [ ] Tests requeridos identificados
- [ ] Riesgos documentados
- [ ] **Si aplica BD:** Verificación de 3NF completada
- [ ] **Si aplica BD:** Nomenclatura singular verificada

---

**Documento generado por:** Agente IA (GitHub Copilot)
**Fecha:** [dd/mm/aaaa]
```

---

## ✅ Criterios de Validación del Análisis

- [ ] Cada issue tiene causa raíz identificada
- [ ] Plan de cambios es técnicamente viable
- [ ] Archivos afectados están correctamente identificados
- [ ] Orden de implementación considera dependencias
- [ ] Tests necesarios están documentados
- [ ] El LT puede entender y validar el análisis

---

## 🔗 Referencias

- Documentos de Issues: `docs/Issues/`
- Casos de Uso Transformados: `docs/Caso-Uso-Transformados/`
- Épicas: `docs/Epicas/`
- Skills relacionados: `arquitectura-stack-tecnologico-backend`, `arquitectura-stack-tecnologico-frontend`
