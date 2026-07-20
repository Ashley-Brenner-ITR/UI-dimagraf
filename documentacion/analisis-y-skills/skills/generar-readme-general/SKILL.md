---
name: generar-readme-general
description: Este Skill se utiliza para generar el archivo README.md principal del proyecto. Debe utilizarse cuando se solicite crear o actualizar el README general del proyecto.
user-invocable: true
argument-hint: proporcione información del proyecto (nombre, propósito, tecnologías).
---

# Generador de README General del Proyecto

## Objetivo

Generar el archivo `README.md` principal del proyecto para que funcione como:

- punto de entrada para nuevos desarrolladores
- resumen ejecutivo para stakeholders
- guía inicial de setup y uso
- mapa general de arquitectura, componentes y documentación disponible

Este skill es **documental general**. No define por sí mismo el stack del proyecto. Cuando el README deba reflejar decisiones técnicas, debe tomar como fuente de verdad los skills de arquitectura y solución vigentes del repositorio.

---

## Alcance

Este skill debe producir un README general:

- profesional
- claro
- útil
- amplio en cobertura
- adaptable al stack real del proyecto

Debe poder documentar:

- propósito del proyecto
- arquitectura general
- estructura del repositorio
- setup local
- ejecución
- testing
- documentación adicional
- contribución
- roadmap
- información institucional

No debe:

- hardcodear tecnologías heredadas de un baseline anterior
- imponer configuraciones que no surjan de las fuentes de verdad
- redefinir arquitectura backend o frontend
- duplicar innecesariamente el contenido técnico de otros skills

---

## Fuentes de verdad que deben respetarse

Antes de generar el README, consultar según corresponda:

- `arquitectura-stack-tecnologico-backend`
- `arquitectura-stack-tecnologico-frontend`
- `generar-solucion-backend`
- `generar-solucion-frontend`
- `firma-itr`

Reglas:

- el stack backend y frontend debe reflejar lo definido por los skills arquitectónicos vigentes
- la estructura base del proyecto debe reflejar lo definido por los skills de solución
- la identidad institucional debe tomarse desde `firma-itr`
- el build tool del backend debe reflejar el servicio real (`maven` o `gradle`) según las fuentes de verdad
- si falta una definición técnica en el contexto, no inventarla

---

## Entrada

Antes de generar el README, solicitar o inferir del contexto la siguiente información:

1. **Nombre del Proyecto**
2. **Descripción del Propósito**
3. **Objetivo general del repositorio**
4. **Estructura de carpetas principal**
5. **Capacidades o funcionalidades principales**
6. **Stack real del proyecto** según las fuentes de verdad
7. **Casos de uso o módulos ya implementados** si aplica
8. **Prerrequisitos de ejecución**
9. **Configuración y variables de entorno**
10. **Comandos útiles de desarrollo**
11. **Documentación adicional disponible**
12. **Información adicional relevante**

---

## Salida

- **Destino:** `README.md` en la raíz del proyecto
- **Formato:** Markdown con encoding UTF-8 With BOM

---

## Instrucciones para la IA

### Contexto

Estás generando el `README.md` principal de un proyecto. Debe ser útil tanto para lectura rápida como para onboarding técnico inicial.

El README debe describir el sistema real del repositorio actual. Si el proyecto tiene backend y frontend, debe documentar ambos. Si el proyecto solo tiene uno de los dos, debe reflejarlo sin forzar una estructura artificial.

### Regla de stack y arquitectura

`generar-readme-general` **no define el stack por sí mismo**.

Por lo tanto:

- badges
- secciones técnicas
- ejemplos de configuración
- comandos útiles
- testing
- arquitectura

deben alinearse con el stack real del proyecto según las fuentes de verdad vigentes.

Si una tecnología no está respaldada por los skills fuente de verdad o por el contexto real del repositorio, no debe presentarse como parte del README.

---

## Estructura del README a Generar

El `README.md` debe contener las siguientes secciones, adaptadas al proyecto real:

### 1. Encabezado Principal con Badges

```markdown
# [Nombre del Proyecto] - [Descripción Breve]

![Badge 1](...)
![Badge 2](...)
![Badge 3](...)
```

**Reglas para badges:**

- los badges deben reflejar el stack tecnológico real del proyecto
- no hardcodear tecnologías heredadas
- usar `style=flat&logoColor=white`
- escapar caracteres especiales en URLs cuando corresponda
- si el proyecto no requiere badges para ciertas tecnologías, omitirlos

### 2. Tabla de Contenidos

```markdown
## Tabla de Contenidos
```

- generar enlaces a las secciones principales
- usar anclas válidas para GitHub

### 3. Introducción

```markdown
## ¿Qué es [Nombre del Proyecto]?
```

- propósito
- valor que aporta
- alcance general
- público objetivo o usuarios principales

### 4. Guía de Inicio Rápido

```markdown
## Guía de Inicio Rápido
### Prerrequisitos
### Instalación
### Ejecutar el Proyecto
```

- tabla con herramientas y versiones reales
- pasos de instalación
- comandos de ejecución respaldados por el stack vigente
- URLs relevantes si existen

### 5. Estructura del Proyecto

```markdown
## Estructura del Proyecto
```

- árbol de directorios principal
- descripción de carpetas relevantes
- coherencia con la estructura real del repositorio

### 6. Arquitectura del Sistema

```markdown
## Arquitectura del Sistema
```

- visión general de la arquitectura
- diagramas Mermaid cuando aporten claridad
- backend y frontend según el proyecto real
- si existe documentación técnica más detallada, enlazarla

### 7. Funcionalidades Principales

```markdown
## Funcionalidades Principales
```

- listado de capacidades clave
- separar backend/frontend si aporta claridad

### 8. ¿Cómo Funciona?

```markdown
## ¿Cómo Funciona?
```

- explicación del flujo general
- puede incluir diagrama Mermaid de proceso o arquitectura de alto nivel

### 9. Beneficios

```markdown
## Beneficios
```

- beneficios concretos del proyecto o del template

### 10. Casos de Uso

```markdown
## Casos de Uso
```

- escenarios de valor
- referencias a CU implementados o documentados si aplica

### 11. Flujo de Trabajo

```markdown
## Flujo de Trabajo
```

- pasos del proceso general del proyecto o repositorio

### 12. Componentes del Sistema

```markdown
## Componentes del Sistema
```

- descripción de componentes principales
- lista de módulos, servicios o capas si aplica

### 13. Filosofía del Proyecto

```markdown
## Filosofía del Proyecto
```

- principios de diseño, calidad o forma de trabajo

### 14. Configuración

```markdown
## Configuración
### Variables de Entorno BackEnd
### Variables de Entorno FrontEnd
```

Reglas:

- documentar solo los archivos/configuraciones reales del proyecto
- usar ejemplos consistentes con el stack vigente
- si el backend usa `application.yml`, `.env`, `.env.example` u otro mecanismo, reflejar eso
- si el backend usa Maven o Gradle, reflejar el build tool real del servicio
- si el frontend usa `.env.local`, `.env.example` u otro mecanismo, reflejar eso
- no usar ejemplos heredados como `appsettings.Development.json` si no pertenecen al proyecto real

### 15. Comandos Útiles

```markdown
## Comandos Útiles
### BackEnd
### FrontEnd
```

Reglas:

- usar comandos consistentes con el stack real del repositorio
- si el backend usa `./mvnw`, documentarlo así
- si el backend usa `./gradlew`, documentarlo así
- si el frontend usa `<package-manager>`, documentarlo según lockfile o convención vigente
- no hardcodear comandos de tecnologías no respaldadas

### 16. Testing

```markdown
## Testing
### BackEnd
### FrontEnd
```

Reglas:

- listar frameworks reales
- describir cómo ejecutar tests con los comandos verdaderos del proyecto
- no incluir frameworks heredados si no aplican

### 17. Roadmap

```markdown
## Roadmap
### Estado Actual
### Funcionalidades Futuras
```

- tabla o lista con estado actual y próximos pasos

### 18. Documentación Adicional

```markdown
## Documentación Adicional
```

- tabla o lista de READMEs, skills, docs o diagramas relevantes

### 19. Solución de Problemas

```markdown
## Solución de Problemas
```

- problemas comunes y soluciones
- usar solo situaciones plausibles para el stack real

### 20. Contribución

```markdown
## Contribución
### Estándares de Código
### Convenciones de Commits
### Guías para IA
```

- describir cómo contribuir
- alinear con el flujo del repositorio y convenciones reales

### 21. Información de ITR

```markdown
## Acerca de ITR
```

**Regla obligatoria:** leer el skill `firma-itr` y usar su contenido como fuente de verdad institucional.

### 22. Pie de Página

```markdown
## Licencia
```

- copyright
- versión
- última actualización

---

## Directrices de Estilo

1. Mantener tono profesional y claro
2. Usar Markdown correctamente
3. Usar tablas cuando aporten legibilidad
4. Usar Mermaid cuando mejore la comprensión
5. No sobrecargar el README con teoría innecesaria
6. Mantener consistencia visual y textual
7. Adaptar la profundidad al proyecto real

---

## Consideraciones Especiales

- El README debe ser **completo pero adaptable**
- No presentar como obligatorio algo que no esté respaldado por el proyecto real
- Si el proyecto es monorepo, reflejarlo explícitamente
- Si existen backend y frontend, documentarlos de forma consistente
- Si existe solo uno de los dos, no forzar una sección artificialmente extensa del otro
- Si hay comandos, URLs o variables de entorno, deben corresponder al contexto real

---

## Validación Final

Antes de finalizar, verificar que el README:

- [ ] refleja el stack real del proyecto
- [ ] no contiene residuos legacy tecnológicos
- [ ] incluye una estructura general útil y navegable
- [ ] documenta arquitectura y componentes reales
- [ ] incluye setup, ejecución, testing y configuración cuando aplica
- [ ] usa branding institucional correcto desde `firma-itr`
- [ ] no contradice los skills fuente de verdad
- [ ] mantiene formato Markdown correcto

---

## Referencias

- Skills relacionados:
  - `firma-itr`
  - `arquitectura-stack-tecnologico-backend`
  - `arquitectura-stack-tecnologico-frontend`
  - `generar-solucion-backend`
  - `generar-solucion-frontend`
