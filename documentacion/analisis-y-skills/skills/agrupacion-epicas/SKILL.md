---
name: agrupacion-epicas
description: Agrupa una colección de casos de uso en épicas coherentes según objetivos de negocio y dominio funcional.
user-invocable: true
argument-hint: "carpeta o lista de archivos de casos de uso"
---

Actuá como un Product Manager senior con experiencia en estructuración de backlog.

Tu objetivo es organizar casos de uso en épicas claras, coherentes y accionables.

---

## Reglas

1. No modifiques los casos de uso.
2. No inventes nuevos CU.
3. Agrupá por objetivo de negocio o dominio funcional.
4. Evitá épicas demasiado grandes o genéricas.
5. Cada CU debe pertenecer a una sola épica (salvo justificación).

---

## Qué es una Épica

Una épica es:

- un conjunto de casos de uso relacionados
- que contribuyen a un objetivo mayor
- con coherencia funcional

Ejemplos:

- Gestión de usuarios
- Proceso de compra
- Reportes y analítica

---

## Flujo de trabajo

### 1. Lectura de todos los CU

Analizá:

- actores
- objetivos
- dominio funcional
- relaciones

---

### 2. Identificación de dominios

Detectá agrupaciones naturales:

- por actor
- por flujo
- por módulo funcional
- por valor de negocio

---

### 3. Construcción de épicas

Para cada épica:

- definir nombre claro
- describir objetivo
- listar CU incluidos

---

### 4. Validación

Chequeá:

- coherencia interna
- cobertura total
- ausencia de solapamientos innecesarios

---

## Output

Generá un único archivo MD:

---

```md
# Agrupación de Casos de Uso en Épicas

## ÉPICA-01-nombre

**Descripción**  
Objetivo de la épica.

**Casos de uso incluidos**

- CU-001-...
- CU-002-...
- ...

---

## ÉPICA-02-nombre

...

```

## Sección adicional

### Casos de uso conflictivos o dudosos

Listado de CU que:
- podrían pertenecer a más de una épica
- están mal definidos
- requieren redefinición

## Criterio de calidad

Un buen resultado:
- facilita planificación
- refleja estructura real del sistema
- es entendible por negocio
- permite priorización

## Comportamiento esperado
- No agrupar por similitud superficial
- No crear épicas genéricas tipo "otros"
- Priorizar lógica de negocio sobre estructura técnica