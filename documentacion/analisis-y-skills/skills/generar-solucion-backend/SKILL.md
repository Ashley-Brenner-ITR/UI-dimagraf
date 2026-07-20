---
name: generar-solucion-backend
description: Este Skill se utiliza para generar la solución base de BackEnd en Java 25 + Spring Boot 4.0.5. Debe utilizarse cuando se solicite generar una solución de BackEnd.
user-invocable: true
argument-hint: generar una solucion de BackEnd
---

# Generación de Solución BackEnd

Genera la solución base de un servicio backend del monorepo, siguiendo exactamente las definiciones del skill `arquitectura-stack-tecnologico-backend`.

La generación del scaffold debe:

- usar **Spring Initializr** como bootstrap operativo preferente
- usar **Spring Boot 4.0.5** como versión fija del framework base
- mantener **Java 25** como definición fija del sistema
- permitir seleccionar el build tool entre **Maven** o **Gradle**
- aprovechar el build file y wrapper generados por el bootstrap
- ajustar luego el proyecto al baseline arquitectónico del repositorio

## Convención de Naming

El nombre lógico del servicio puede definirse como **`[NombreDelServicio]`**, pero su representación operativa en archivos y carpetas del monorepo debe utilizarse como:

- `backEnd/src/[nombre-servicio-en-kebab-case]/`

Además, el scaffold debe capturar y alinear explícitamente:

- `empresa`: segmento `empresa` del root package
- `root package final`: `com.[empresa]`

Estas definiciones no deben derivarse silenciosamente desde defaults del bootstrap si el contexto no las deja realmente claras.

Regla importante:

- la carpeta física `backEnd/src/[nombre-servicio-en-kebab-case]/` no define por sí sola el package root Java
- el package root debe confirmarse explícitamente y quedar consistente con el baseline arquitectónico

## Alcance Inicial

Genera **solamente** la estructura base del servicio, sin entidades concretas ni casos de uso de negocio.

Excepción obligatoria del scaffold: incluir el endpoint técnico mínimo `GET /api/v1/hello` con su caso de uso técnico y contratos de respuesta estándar.

Antes de comenzar:

1. leer `arquitectura-stack-tecnologico-backend`
2. usar sus convenciones de arquitectura, stack, estructura y contratos
3. confirmar `empresa` para el root package:
   - ejemplo: `itr`, `cuidaapp`
4. confirmar nombre operativo del servicio:
   - `backEnd/src/[nombre-servicio-en-kebab-case]/`
5. confirmar el `root package final`:
   - `com.[empresa]`
6. confirmar el build tool del servicio:
   - `maven`
   - `gradle`
7. mantener siempre **Java 25**
8. generar el `README.md` del servicio en `backEnd/src/[nombre-servicio-en-kebab-case]/README.md`

## Reglas Obligatorias

- **Java 25 es fijo**
  - no ofrecer ni aceptar otra versión de Java
- **Build tool interactivo**
  - el usuario puede elegir `maven` o `gradle`
  - el wrapper del build tool elegido es obligatorio
- **Captura explícita de naming técnico**
  - confirmar explícitamente:
    - `empresa`
    - `nombre-servicio-en-kebab-case`
    - `root package final = com.[empresa]`
  - no dejar estos valores librados a defaults automáticos pobres del bootstrap
  - no asumir que el nombre de carpeta física y el package root Java son automáticamente el mismo valor
- **Bootstrap preferente con Spring Initializr**
  - usarlo como punto de partida operativo del servicio
- **No reinventar el bootstrap**
  - no reconstruir manualmente el build file si Spring Initializr ya lo generó correctamente
  - no regenerar manualmente el wrapper si Spring Initializr ya lo proveyó
- **Ajustes post-bootstrap del build file (regla de patch)**
  - el build file generado por Spring Initializr (`pom.xml` o `build.gradle(.kts)`) es la base
  - prohibido reescribir el build file completo; solo cambios mínimos para cubrir gaps del baseline
  - prohibido migrar entre Maven y Gradle durante el ajuste post-bootstrap
  - solo modificar dependencias, plugins o tasks si falta algo requerido por el baseline; prohibido agregar por si acaso
  - toda modificación debe respetar el build tool real del servicio y ejecutarse con su wrapper
- **Encoding UTF-8 sin BOM obligatorio**
  - todo archivo de texto generado en `backEnd/src/[nombre-servicio-en-kebab-case]/` debe guardarse en UTF-8 sin BOM (UTF-8 no-BOM)
  - aplica como mínimo a `.java`, `.md`, `.yml`, `.yaml`, `.sql`, `.properties`, `.xml`, `.gradle`, `.kts`, `.gitignore` y `.editorconfig`
  - no generar ni guardar archivos `.java` con BOM; `javac` puede fallar con `U+FEFF`
  - aplicar preferentemente UTF-8 sin BOM también a `.md`, `.yml`, `.yaml` y `.sql`
  - si el servicio usa Maven, declarar explícitamente UTF-8 sin BOM como encoding del build para source y reporting
  - si el servicio usa Gradle, declarar explícitamente UTF-8 sin BOM en compilación Java (`options.encoding`) y en tasks de recursos si aplica
  - declarar UTF-8 en `pom.xml` o `build.gradle(.kts)` no corrige por sí solo un BOM ya presente en archivos `.java`; la regla no-BOM debe aplicarse directamente sobre los archivos
  - se recomienda agregar o mantener `.editorconfig` en `backEnd/src/[nombre-servicio-en-kebab-case]/` con `charset = utf-8`
- **Scope seguro para lectura/escritura y normalización**
  - todos los comandos que lean o escriban archivos deben ejecutarse desde la raíz del repo o dentro de `backEnd/src/[nombre-servicio-en-kebab-case]/`
  - prohibido ejecutar comandos recursivos desde rutas globales o fuera del repo
  - prohibido usar `-Recurse` con un `Path` fuera de `backEnd/src/[nombre-servicio-en-kebab-case]/`
  - antes de convertir o normalizar encoding, verificar que el path base contiene `backEnd\\src\\[nombre-servicio-en-kebab-case]\\`
  - definir siempre como ruta base de trabajo `backEnd/src/[nombre-servicio-en-kebab-case]/`
  - convertir solo archivos de texto dentro de esa carpeta y solo para una lista explícita de extensiones; nunca fuera de ese scope
- **Dependencias**
  - distinguir entre dependencias de bootstrap y dependencias de evolución posterior
  - no inventar starters o dependencias que no existan en el catálogo real de Spring Initializr
- **PATH**
  - nunca modificar el PATH global del sistema
  - solo permitir ajuste temporal del PATH de la consola actual con confirmación explícita del usuario

## Verificación de Java 25 en el Entorno

Antes de ejecutar el bootstrap:

1. verificar si `java` disponible en PATH corresponde a Java 25
2. si Java 25 está disponible en PATH:
   - usar esa instalación
3. si Java 25 no está disponible:
   - buscar instalaciones candidatas en ubicaciones habituales del sistema
   - informar al usuario cuáles fueron encontradas
   - pedir confirmación explícita si desea asociar temporalmente una de esas rutas al PATH de la consola actual

Reglas:

- el ajuste solo puede afectar la consola de ejecución actual
- no modificar variables globales ni configuración persistente del sistema operativo
- si no hay Java 25 utilizable, detener la generación y explicitar el bloqueo

## Spring Initializr como Bootstrap

### Regla general

El proyecto debe bootstrapearse desde Spring Initializr siempre que el entorno lo permita.

Spring Initializr debe resolver, como mínimo:

- proyecto base
- build file inicial
- wrapper del build tool elegido
- estructura estándar del proyecto

### Parámetros base obligatorios del bootstrap

- lenguaje: `java`
- versión de Java: `25`
- framework base: `Spring Boot 4.0.5`
- packaging: `jar`
- build tool: `maven` o `gradle`
- package root: `com.[empresa]`

Regla obligatoria:

- el bootstrap con Spring Initializr DEBE usar exactamente `Spring Boot 4.0.5`
- no usar otra versión de Spring Boot salvo actualización explícita de este skill y del skill `arquitectura-stack-tecnologico-backend`

### Convención de nombres que debe quedar alineada

La generación debe dejar explícitamente alineados estos artefactos:

- nombre lógico del servicio
- nombre operativo del servicio en carpeta:
  - `backEnd/src/[nombre-servicio-en-kebab-case]/`
- root package:
  - `com.[empresa]`
- clase principal:
  - `com.[empresa].NombreServicioApplication`

Reglas:

- estos nombres están relacionados, pero no deben suponerse idénticos sin confirmación
- el package root del bootstrap debe alinearse con `com.[empresa]`
- si Spring Initializr genera una base con otro package root, debe ajustarse al baseline del repositorio
- la carpeta física del backend no reemplaza la definición explícita del package root Java
- la clase principal no debe quedar en `api`, `infrastructure` ni en subpaquetes arbitrarios
- debe existir una sola clase principal `@SpringBootApplication` por proyecto backend

### Dependencias de bootstrap

Son las dependencias solicitadas al catálogo real de Spring Initializr para crear el proyecto base.

Suelen pertenecer al bootstrap base del servicio, cuando están disponibles en el catálogo real y alinean con el baseline vigente:

- `web`
- `validation`
- `data-jpa`
- `postgresql`
- `flyway`
- `actuator`
- `springdoc-openapi` si está disponible en el catálogo real al momento del bootstrap

Reglas:

- validar contra el catálogo real de Spring Initializr qué dependencias están disponibles
- si una dependencia esperada no existe en el catálogo:
  - informar al usuario
  - no inventar una dependencia alternativa
  - no agregar una coordenada arbitraria como sustituto automático

### Dependencias de evolución posterior

Son dependencias del baseline técnico que pueden requerir incorporación o ajuste después del bootstrap, por ejemplo cuando:

- no forman parte natural del proyecto base
- no están disponibles como starter del catálogo
- necesitan configuración adicional posterior

Suelen quedar como evolución posterior, según el contexto real del servicio:

- `springdoc-openapi` si el bootstrap inicial no lo dejó resuelto
- seguridad/JWT si el servicio realmente lo requiere
- observabilidad avanzada adicional
- JobRunr
- dependencias de testing o arquitectura más específicas
- **AOP / AspectJ**: soporte para `@Aspect` y `@Around` en la capa `infrastructure` → usar `org.aspectj:aspectjweaver` (versión gestionada por BOM) en lugar de `spring-boot-starter-aop` que **no existe** en Spring Boot 4.0.5
- otras librerías fuera del catálogo real de Spring Initializr

Regla:

- el scaffold debe documentar y dejar preparado el proyecto para esa evolución, pero sin alucinar dependencias de bootstrap inexistentes
- el scaffold final DEBE incluir `springdoc-openapi` y exponer `/api-docs`
- si Spring Initializr no ofrece `springdoc-openapi` en su catálogo en ese momento, se debe agregar manualmente al build file como patch post-bootstrap, sin reescribirlo completo
- `spring-boot-starter-aop` debe ser **reemplazado** por `org.aspectj:aspectjweaver` en el pom.xml o build.gradle(.kts) post-bootstrap; Spring Boot 4.0.5 habilita `@EnableAspectJAutoProxy` automáticamente cuando `aspectjweaver` está en el classpath

## Notas Importantes

- No generar todavía entidades concretas
- No generar todavía casos de uso funcionales de negocio (excepto el caso técnico mínimo de `/api/v1/hello`)
- Generar un endpoint técnico mínimo `GET /api/v1/hello` para validar wiring y patrón ROP
- Dejar la estructura lista para evolucionar a una implementación real
- El servicio debe quedar alineado con:
  - Java 25
  - Spring Boot 4.0.5
  - build tool elegido con wrapper obligatorio
  - root package `com.[empresa]`
  - paquetes por capas
  - configuración base mínima
  - OpenAPI `/api-docs`
  - endpoint técnico mínimo `/api/v1/hello` con contrato de respuesta estándar

## Estructura Esperada

```text
backEnd/
└── src/
    └── [nombre-servicio-en-kebab-case]/
        ├── pom.xml / build.gradle(.kts)
        ├── README.md
        ├── .gitignore
        ├── wrapper del build tool elegido
        └── src/
            ├── main/
            │   ├── java/
            │   │   └── com/
            │   │       └── [empresa]/
            │   │           ├── NombreServicioApplication.java
            │   │           ├── domain/
            │   │           ├── application/
            │   │           ├── infrastructure/
            │   │           └── api/
            │   └── resources/
            │       ├── application.yml
            │       ├── application-dev.yml
            │       ├── application-prod.yml
            │       └── db/
            │           └── migration/
            │               └── V1__init.sql
            └── test/
                └── java/
                    └── com/
                        └── [empresa]/
                            ├── architecture/
                            ├── application/
                            ├── domain/
                            └── infrastructure/
```

## Flujo Operativo de Generación

### 1. Preparación

- leer `arquitectura-stack-tecnologico-backend`
- confirmar nombre lógico del servicio
- confirmar `empresa`
- confirmar `nombre-servicio-en-kebab-case`
- confirmar `root package final = com.[empresa]`
- confirmar build tool: `maven` o `gradle`
- verificar Java 25 disponible

### 2. Bootstrap

- consultar Spring Initializr como bootstrap preferente
- usar `Spring Boot 4.0.5` en el bootstrap
- usar en el bootstrap el package root alineado con `com.[empresa]`
- validar dependencias de bootstrap contra el catálogo real
- generar el proyecto base con el build tool elegido

### 3. Ajuste al Baseline del Repositorio

Una vez generado el bootstrap:

- mover o ubicar el servicio en `backEnd/src/[nombre-servicio-en-kebab-case]/`
- ajustar el root package a `com.[empresa]` si el bootstrap no lo dejó correctamente
- ajustar paquetes al baseline del proyecto
- ubicar la clase principal `@SpringBootApplication` en `com.[empresa]`
- garantizar que exista una sola clase principal por proyecto backend
- dejar estructura `domain`, `application`, `infrastructure`, `api`
- dejar configuración base
- dejar carpeta de migraciones
- dejar README del servicio
- dejar OpenAPI alineado con `/api-docs`
- generar endpoint técnico `GET /api/v1/hello` con implementación ROP y mapeo HTTP estándar

### 4. Evolución Posterior

Si alguna dependencia o capacidad no forma parte del bootstrap real:

- documentarla como evolución posterior del servicio
- no falsificar su existencia como starter de Spring Initializr

### 5. Revisión de Código Muerto

Al final de la generación:

- detectar posibles archivos/clases sin uso (código muerto),
- mostrar explícitamente la lista de candidatos al usuario,
- solicitar confirmación antes de eliminar,
- eliminar solo elementos confirmados.

## Lineamientos de Generación

- Generar un proyecto backend dentro de `backEnd/src/[nombre-servicio-en-kebab-case]/`
- Usar el build tool elegido (`maven` o `gradle`)
- Usar siempre el wrapper del tool elegido
- Usar `com.[empresa]` como root package del servicio
- Ubicar la clase principal con `@SpringBootApplication` en el root package del servicio
- La clase bootstrap debe expresarse en PascalCase y seguir el patrón `NombreServicioApplication`
- Mantener una sola clase principal `@SpringBootApplication` por proyecto backend
- Dejar lista la configuración base en `application.yml`
- Dejar preparada la carpeta `src/main/resources/db/migration/`
- Dejar el servicio alineado con la convención obligatoria de OpenAPI en `/api-docs`
- Declarar UTF-8 sin BOM en el build file real del servicio según use Maven o Gradle
- Generar endpoint técnico mínimo `GET /api/v1/hello` con:
  - `HelloController`
  - `GetHelloUseCase`
  - `GetHelloResult`
  - `Result<T>` en `domain.result`
  - `ResultHttpMapper`
  - `ApiResponse`, `ApiError`, `HelloResponse`
- Mantener fuera de alcance cualquier endpoint de negocio adicional no solicitado
- No dejar la clase principal dentro de `api`, `infrastructure` ni otros subpaquetes arbitrarios

## Validación de Bootstrap

Verificar como mínimo:

- [ ] Spring Initializr generó el proyecto base
- [ ] El proyecto base fue generado con Spring Boot 4.0.5
- [ ] Existe el build file del tool elegido
- [ ] Existe el wrapper del tool elegido
- [ ] Existe la estructura base estándar del proyecto
- [ ] El proyecto quedó ubicado en `backEnd/src/[nombre-servicio-en-kebab-case]/`
- [ ] El bootstrap usó o quedó ajustado al root package `com.[empresa]`
- [ ] La carpeta física del backend no quedó confundida con el package root Java
- [ ] Los archivos de texto generados en el servicio quedaron guardados en UTF-8 sin BOM
- [ ] Los archivos `.java` generados en el servicio no tienen BOM
- [ ] El build file del servicio declara UTF-8 sin BOM según el build tool real (`pom.xml` o `build.gradle(.kts)`)
- [ ] `spring-boot-starter-aop` **no figura** en el pom.xml o build.gradle(.kts); se usa `org.aspectj:aspectjweaver` en su lugar
- [ ] ArchUnit quedó configurado en versión compatible con Java 25 (mínimo referencia `1.4.2`)
- [ ] Existen tests base de arquitectura (`LayerDependencyTest`, `ConventionTest`, `AnnotationTest`) en `src/test/java/com/[empresa]/architecture/`

## Validación de Alineación Final

Verificar además:

- [ ] Existen `src/main/java`, `src/main/resources` y `src/test/java`
- [ ] Existe una sola clase bootstrap con `@SpringBootApplication` en `com.[empresa]`
- [ ] Existen los paquetes base `domain`, `application`, `infrastructure` y `api`
- [ ] Existen los subpaquetes base de tests `architecture`, `application`, `domain` e `infrastructure`
- [ ] Existe `application.yml` como configuración base
- [ ] Existe la carpeta `db/migration`
- [ ] El scaffold queda alineado con la convención OpenAPI obligatoria del proyecto en `/api-docs`
- [ ] Existe endpoint técnico `GET /api/v1/hello` expuesto en `/api-docs`
- [ ] Existen `ResultHttpMapper`, `ApiResponse`, `ApiError` y `HelloResponse` para respuesta HTTP estandarizada
- [ ] El `README.md` del servicio explica la estructura objetivo e incluye diagramas de arquitectura de alto nivel
- [ ] El proyecto compila con el wrapper del build tool elegido
- [ ] No se generaron entidades concretas ni casos de uso funcionales fuera del alcance inicial
- [ ] La clase principal no quedó dentro de `api`, `infrastructure` ni otros subpaquetes arbitrarios
- [ ] Se ejecutó revisión de código muerto y se pidió confirmación explícita antes de eliminar cualquier archivo/clase

## Remisión al Skill de Arquitectura

Este skill no redefine la arquitectura del backend.

La fuente de verdad para:

- Java 25
- Spring Boot
- build tools válidos
- estructura por capas
- reglas de diseño
- contratos HTTP
- OpenAPI en `/api-docs`
- reglas de base de datos

es el skill `arquitectura-stack-tecnologico-backend`.

Si durante la generación aparece una duda de estructura, naming, bootstrap o baseline técnico, prevalece siempre ese skill.
