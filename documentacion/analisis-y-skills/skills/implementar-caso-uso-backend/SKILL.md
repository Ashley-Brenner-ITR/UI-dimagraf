---
name: implementar-caso-uso-backend
description: Este Skill se utiliza para implementar Casos de Uso en el BackEnd Java. Debe utilizarse cuando se solicite la implementación de un Caso de Uso en el proyecto de BackEnd.
user-invocable: true
argument-hint: implementar Caso de Uso de BackEnd
---

# Prompt: Implementar Caso de Uso en BackEnd

## Parámetros de Entrada

| Parámetro | Requerido | Descripción |
|-----------|-----------|-------------|
| `{{NOMBRE_ARCHIVO_CASO_USO}}` | Sí | Nombre del archivo del caso de uso ubicado en `docs/Caso-Uso-Transformados/` |
| `SKIP_GIT` | No | Si el usuario indica explícitamente `SKIP_GIT=true`, se omite la creación de branch y PR |

Instrucción:
- Reemplaza `{{NOMBRE_ARCHIVO_CASO_USO}}` con el nombre del archivo del caso de uso transformado.
- Ejemplo: `CU-015-Registrar-Producto.md`

Comportamiento por defecto:
- Si el usuario no menciona nada sobre Git, el paso de crear branch y PR se ejecuta automáticamente al finalizar.
- Solo se omite si se indica `SKIP_GIT=true` de forma explícita.

## Objetivo

Implementar el caso de uso especificado en `docs/Caso-Uso-Transformados/{{NOMBRE_ARCHIVO_CASO_USO}}` dentro de un servicio backend existente del monorepo, respetando el baseline definido por los skills:

- `arquitectura-stack-tecnologico-backend`
- `generar-solucion-backend`

La implementación debe realizarse dentro de un servicio ubicado en:
- `backEnd/src/[nombre-servicio-en-kebab-case]/`

Y debe respetar:
- arquitectura por capas y paquetes
- contrato OpenAPI del servicio
- build tool real del servicio (`maven` o `gradle`)
- uso del wrapper real del servicio (`./mvnw` o `./gradlew`)
- encoding UTF-8 sin BOM (UTF-8 no-BOM) en todos los archivos de texto que se creen o modifiquen, especialmente `.java`
- ROP con `Result<T>`
- transaccionalidad en Use Cases o servicios de aplicación
- puertos y adaptadores de salida
- persistencia con JPA/Hibernate y migraciones Flyway cuando corresponda

## Documentos de Referencia Obligatorios

Antes de comenzar la implementación, leer y analizar:

1. Caso de uso a implementar: `docs/Caso-Uso-Transformados/{{NOMBRE_ARCHIVO_CASO_USO}}`
2. Skill `arquitectura-stack-tecnologico-backend`
3. Skill `generar-solucion-backend`
4. Skill `procesamiento-asincrono-backend` si el caso requiere background jobs persistidos
5. README del servicio actual:
   - `backEnd/src/[nombre-servicio-en-kebab-case]/README.md`
6. Contrato OpenAPI vigente del backend:
   - `GET /api-docs`
   - `swagger.json`
   - `openapi.json`
7. `docs/Datos/Modelo-Datos.md` si existe
8. `docs/Ui/Trazabilidad-CU-Pantallas.md` si el caso puede impactar integración o navegación frontend
9. Build tool real del servicio y wrapper correspondiente (`./mvnw` o `./gradlew`)

## Alcance de la Implementación

Este skill implementa un caso de uso backend dentro de un servicio existente. No redefine el scaffold general ni la arquitectura base del proyecto.

La implementación puede incluir, según el caso:
- modelos de dominio, value objects o enums
- puertos de salida en `application.port.out`
- Use Cases en `application.usecase`
- commands, queries y DTOs de application
- adaptadores de infraestructura en `infrastructure.persistence`
- integración con procesamiento asíncrono persistido según el estándar del proyecto cuando el caso lo requiera
- entidades JPA y mappers si son necesarios
- controllers, DTOs HTTP y mappers HTTP
- actualización del contrato OpenAPI
- migraciones Flyway
- tests unitarios e integración
- actualización de documentación y trazabilidad

No debe:
- redefinir la arquitectura del servicio
- acoplar `application` a `JpaRepository`
- usar `Liquibase`
- tratar `swagger.json` como única fuente del contrato
- omitir `Result<T>` en flujos de negocio
- mover la lógica transaccional a controllers

Si el caso de uso requiere:
- emails
- notificaciones
- recordatorios
- expiraciones
- delayed jobs
- recurring jobs
- tareas persistidas en background

se debe consultar además el skill `procesamiento-asincrono-backend` como guía complementaria.

## Reglas de Integración y Contrato

### Fuente de verdad del contrato

OpenAPI es la fuente de verdad del contrato HTTP publicado por el backend.

Fuentes válidas:
- `GET /api-docs`
- archivo handoff `swagger.json`
- archivo handoff `openapi.json`

Reglas:
- `docs/Swagger/swagger.json` puede existir como handoff documental, pero no es la única referencia obligatoria.
- Si se crean o modifican endpoints, `/api-docs` debe mantenerse consistente con la implementación real.
- Si el cambio impacta consumidores HTTP del proyecto, especialmente frontend, debe asegurarse el handoff actualizado.
- Antes de crear un endpoint nuevo, se debe analizar la API existente del servicio para evitar duplicidades.

### Análisis previo de API existente

Antes de implementar endpoints:

1. Analizar el contrato OpenAPI vigente del servicio.
2. Revisar controllers existentes y sus rutas.
3. Determinar si corresponde:
   - crear endpoint nuevo
   - reutilizar endpoint existente
   - extender endpoint existente
4. Mantener consistencia de:
   - verbos HTTP
   - rutas
   - códigos HTTP
   - DTOs request/response
   - documentación OpenAPI

Tabla recomendada:

| Operación del CU | Verbo HTTP | Ruta propuesta | Existe | Acción |
|------------------|------------|----------------|--------|--------|

## Convenciones Backend Obligatorias

La implementación backend debe hacer explícitas y respetar estas convenciones del proyecto:

- `@UseCase`
- `application.usecase`
- `application.port.out`
- `Result<T>`
- `ResultHttpMapper`
- `@Transactional` en capa de aplicación / Use Case
- `infrastructure.persistence`
- adaptadores de salida concretos
- separación entre request validation, reglas de negocio y mapping HTTP

Si el caso usa procesamiento asíncrono persistido:
- la intención se modela desde `application`
- los puertos viven en `application.port.out`
- la implementación técnica vive en `infrastructure`
- el Use Case no se acopla directamente a JobRunr
- los controllers no disparan scheduling directamente

### Regla de modelado funcional

El backend del proyecto usa ROP como convención obligatoria.

Reglas:
- los Use Cases retornan `Result<T>`
- la composición funcional con `map` y `flatMap` es el patrón preferido del proyecto para encadenar reglas de negocio y pasos del Use Case
- no se lanzan exceptions para flujos funcionales
- las exceptions se reservan para errores técnicos inesperados
- el mapping HTTP del resultado se resuelve con `ResultHttpMapper` o convención equivalente del baseline

## Estructura Esperada por Servicio y Capas

La implementación debe ubicarse dentro del servicio correspondiente:

```text
backEnd/
└── src/
    └── [nombre-servicio-en-kebab-case]/
        ├── README.md
        ├── pom.xml / build.gradle(.kts)
        └── src/
            ├── main/
            │   ├── java/
            │   │   └── com/
            │   │       └── [empresa]/
            │   │           ├── domain/
            │   │           │   ├── model/
            │   │           │   ├── valueobject/
            │   │           │   ├── enums/
            │   │           │   ├── exception/
            │   │           │   └── result/
            │   │           ├── application/
            │   │           │   ├── usecase/
            │   │           │   ├── port/
            │   │           │   │   └── out/
            │   │           │   ├── service/
            │   │           │   └── common/
            │   │           ├── infrastructure/
            │   │           │   ├── persistence/
            │   │           │   │   ├── entity/
            │   │           │   │   ├── repository/
            │   │           │   │   └── mapper/
            │   │           │   └── config/
            │   │           └── api/
            │   │               ├── controller/
            │   │               ├── dto/
            │   │               ├── mapper/
            │   │               └── advice/
            │   └── resources/
            │       └── db/
            │           └── migration/
            └── test/                         (src/test/)
                └── java/
                    └── com/
                        └── [empresa]/
                            ├── architecture/
                            ├── application/
                            ├── domain/
                            └── infrastructure/
```

## Lineamientos de Implementación por Capa

### 1. Domain

En `domain` deben vivir solamente conceptos de dominio puros:
- modelos
- value objects
- enums
- excepciones de dominio
- tipos `Result<T>` si forman parte del baseline del servicio

Reglas:
- no depende de Spring
- no depende de JPA
- no depende de HTTP
- no conoce `JpaRepository`

### 2. Application

En `application` deben vivir:
- Use Cases en `application.usecase`
- ports de salida en `application.port.out`
- commands, queries y DTOs de aplicación cuando corresponda
- servicios de aplicación si el caso lo requiere

Reglas:
- los casos de uso deben usar `@UseCase`
- los casos de uso deben retornar `Result<T>`
- la transaccionalidad debe vivir aquí mediante `@Transactional`
- `application` no conoce `JpaRepository`
- la lógica de negocio vive aquí y/o en domain

Ejemplo orientativo:

```java
@UseCase
public class CrearProductoUseCase {

    private final ProductoRepositoryPort productoRepositoryPort;

    public CrearProductoUseCase(ProductoRepositoryPort productoRepositoryPort) {
        this.productoRepositoryPort = productoRepositoryPort;
    }

    @Transactional
    public Result<CrearProductoResponse> execute(CrearProductoCommand command) {
        return crearContexto(command)
            .flatMap(this::validarNombre)
            .flatMap(this::construirModelo)
            .flatMap(this::persistir)
            .map(this::toResponse);
    }

    private Result<Context> crearContexto(CrearProductoCommand command) {
        return Result.success(new Context(command, null));
    }

    private Result<Context> validarNombre(Context ctx) {
        if (ctx.command().nombre() == null || ctx.command().nombre().isBlank()) {
            return Result.failure("El nombre es obligatorio.");
        }
        return Result.success(ctx);
    }

    private Result<Context> construirModelo(Context ctx) {
        var producto = new Producto(ctx.command().nombre());
        return Result.success(new Context(ctx.command(), producto));
    }

    private Result<Context> persistir(Context ctx) {
        return productoRepositoryPort.save(ctx.producto())
            .map(saved -> new Context(ctx.command(), saved));
    }

    private CrearProductoResponse toResponse(Context ctx) {
        return new CrearProductoResponse(ctx.producto().getId(), ctx.producto().getNombre());
    }

    private record Context(CrearProductoCommand command, Producto producto) {}
}
```

### 3. Puertos de salida

Los puertos de salida deben ubicarse en:
- `application.port.out`

Reglas:
- modelan dependencias hacia persistencia o integraciones externas
- los define `application`
- los implementa `infrastructure`
- no deben exponer detalles de JPA

Ejemplo:

```java
package com.[empresa].application.port.out;

import com.[empresa].domain.model.Producto;
import com.[empresa].domain.result.Result;
import java.util.Optional;

public interface ProductoRepositoryPort {

    Result<Optional<Producto>> findById(Long id);

    Result<Producto> save(Producto producto);

    boolean existsByCodigo(String codigo);
}
```

### 4. Infrastructure

La infraestructura implementa puertos y detalles técnicos.

Ubicación esperada:
- `infrastructure.persistence.entity`
- `infrastructure.persistence.repository`
- `infrastructure.persistence.mapper`

Reglas:
- implementa los puertos definidos en `application.port.out`
- puede usar Spring Data JPA y `JpaRepository`
- `application` no debe conocer esas clases

Ejemplo orientativo:

```java
@Repository
public class ProductoRepositoryAdapter implements ProductoRepositoryPort {

    private final ProductoSpringDataRepository repository;
    private final ProductoPersistenceMapper mapper;

    public ProductoRepositoryAdapter(
        ProductoSpringDataRepository repository,
        ProductoPersistenceMapper mapper
    ) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Result<Producto> save(Producto producto) {
        try {
            var entity = mapper.toEntity(producto);
            var saved = repository.save(entity);
            return Result.success(mapper.toDomain(saved));
        } catch (RuntimeException ex) {
            return Result.failure("No fue posible guardar la información del producto.");
        }
    }
}
```

### 5. API

La capa `api` expone HTTP y no contiene reglas de negocio.

Reglas:
- usa Jakarta Validation para request validation
- delega la lógica al Use Case
- traduce `Result<T>` a HTTP con `ResultHttpMapper`
- mantiene documentación OpenAPI alineada con el contrato real

Ejemplo:

```java
@RestController
@RequestMapping("/api/v1/productos")
public class ProductoController {

    private final CrearProductoUseCase crearProductoUseCase;

    public ProductoController(CrearProductoUseCase crearProductoUseCase) {
        this.crearProductoUseCase = crearProductoUseCase;
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody CrearProductoCommand command) {
        return ResultHttpMapper.created(crearProductoUseCase.execute(command));
    }
}
```

Separación obligatoria:
- request validation HTTP: Jakarta Validation en commands/DTOs HTTP
- reglas de negocio: domain/application
- mapping HTTP: controllers + `ResultHttpMapper`

## Reglas de Migraciones y Datos

Si el caso de uso requiere cambios de esquema:

- `Flyway` es el único mecanismo permitido
- no usar `Liquibase`
- no usar `ddl-auto update`, `create` ni `create-drop`

Ubicación:
- `backEnd/src/[nombre-servicio-en-kebab-case]/src/main/resources/db/migration/`

Reglas:
- todo cambio de esquema requiere migración
- las migraciones son inmutables
- si cambia el modelo de datos, revisar consistencia documental

## Testing, Validación y Documentación

### Testing

Debe incluir, según corresponda:
- tests unitarios de Use Cases y lógica de dominio
- tests de infraestructura/persistencia
- tests de arquitectura por capas
- tests de integración si el caso lo justifica

Ubicación esperada:
- `src/test/java/.../application`
- `src/test/java/.../domain`
- `src/test/java/.../infrastructure`
- `src/test/java/.../architecture`

### Verificaciones obligatorias

- verificar compilación
- ejecutar tests
- validar que no se duplicaron endpoints
- validar que no se duplicaron entidades
- validar que la arquitectura por capas se mantiene
- validar consistencia del contrato OpenAPI si cambian endpoints

### Documentación y trazabilidad

Cuando aplique, actualizar:

- README del servicio:
  - `backEnd/src/[nombre-servicio-en-kebab-case]/README.md`
- contrato OpenAPI publicado en `/api-docs`
- handoff `swagger.json` u `openapi.json` si impacta integraciones
- `docs/Datos/Modelo-Datos.md` si cambia el modelo de datos
- `docs/Ui/Trazabilidad-CU-Pantallas.md` si el cambio backend impacta integración o comportamiento esperado del frontend

Mantener además:
- trazabilidad CU/RN en Use Cases, commands y artefactos relevantes

### Encoding UTF-8 sin BOM obligatorio

Todo archivo de texto creado o modificado dentro de `backEnd/src/[nombre-servicio-en-kebab-case]/` debe mantenerse en UTF-8 sin BOM (UTF-8 no-BOM).

Aplica como mínimo a:
- `.java`
- `.md`
- `.yml` / `.yaml`
- `.sql`
- `.properties`
- `.xml`
- `.gradle` / `.kts`
- `.gitignore`
- `.editorconfig`

No generar ni guardar archivos `.java` con BOM; `javac` puede fallar con `U+FEFF`.
Aplicar preferentemente UTF-8 sin BOM también a `.md`, `.yml`, `.yaml` y `.sql`.

Declarar UTF-8 en `pom.xml` o `build.gradle(.kts)` no corrige por sí solo un BOM ya presente en archivos `.java`; la regla no-BOM debe aplicarse directamente sobre los archivos.

### Scope seguro para lectura/escritura y normalización

Todos los comandos que lean o escriban archivos deben ejecutarse desde la raíz del repo o dentro de `backEnd/src/[nombre-servicio-en-kebab-case]/`.

Reglas:
- prohibido ejecutar comandos recursivos desde rutas globales o fuera del repo
- prohibido usar `-Recurse` con un `Path` fuera de `backEnd/src/[nombre-servicio-en-kebab-case]/`
- antes de convertir o normalizar encoding, verificar que el path base contiene `backEnd\\src\\[nombre-servicio-en-kebab-case]\\`
- definir siempre como ruta base de trabajo `backEnd/src/[nombre-servicio-en-kebab-case]/`
- convertir solo archivos de texto dentro de esa carpeta y solo para una lista explícita de extensiones; nunca fuera de ese scope

Si durante la implementación se detecta que el servicio aún no declara UTF-8 sin BOM en su build file:
- para Maven, agregar el patch mínimo para source y reporting encoding en `pom.xml`
- para Gradle, agregar el patch mínimo para `options.encoding = 'UTF-8'` y tasks de recursos si aplica

No reescribir el build file completo ni cambiar de build tool; aplicar solo el ajuste mínimo compatible con el baseline del servicio.

## Flujo de Ejecución

1. Analizar el caso de uso transformado
2. Identificar el servicio backend correspondiente en `backEnd/src/[nombre-servicio-en-kebab-case]/`
3. Revisar README del servicio y arquitectura vigente
4. Evaluar si el caso requiere procesamiento asíncrono persistido; si aplica, consultar `procesamiento-asincrono-backend`
5. Analizar API existente y contrato OpenAPI del servicio
6. Verificar consistencia de entidades y modelo de datos
7. Implementar artefactos de domain si corresponden
8. Implementar puertos y Use Cases en application
9. Implementar adaptadores en infrastructure
10. Implementar controller/DTOs HTTP si corresponde
11. Crear migración Flyway si corresponde
12. Implementar tests
13. Verificar compilación, tests y consistencia de contrato
14. Actualizar documentación y trazabilidad
15. Ejecutar automatización Git salvo que el usuario haya indicado `SKIP_GIT=true`

## Remisión al Skill de Arquitectura

Este skill no redefine la arquitectura backend. La fuente de verdad para:

- organización de capas y paquetes
- convenciones de `Result<T>`
- `@UseCase`
- `@Transactional`
- `application.port.out`
- `infrastructure.persistence`
- `ResultHttpMapper`
- OpenAPI en `/api-docs`
- Flyway
- reglas de base de datos

es el skill `arquitectura-stack-tecnologico-backend`.

La fuente de verdad para la estructura base del servicio existente es:
- `generar-solucion-backend`

Si durante la implementación aparece una duda de estructura, naming, stack o baseline técnico, prevalecen siempre esos skills.

## Criterios de Validación

- [ ] Se identificó el servicio correcto dentro de `backEnd/src/[nombre-servicio-en-kebab-case]/`
- [ ] Se analizó el caso de uso y la API existente del servicio
- [ ] No se duplicaron endpoints existentes
- [ ] No se duplicaron entidades o conceptos ya modelados
- [ ] Los Use Cases viven en `application.usecase`
- [ ] Los puertos de salida viven en `application.port.out`
- [ ] `application` no depende de `JpaRepository`
- [ ] La infraestructura implementa puertos mediante adapters en `infrastructure.persistence`
- [ ] La lógica de negocio retorna `Result<T>`
- [ ] El mapping HTTP usa `ResultHttpMapper`
- [ ] La transaccionalidad se resolvió en Use Cases/capa de aplicación
- [ ] Si el caso requería procesamiento asíncrono persistido, se consultó `procesamiento-asincrono-backend`
- [ ] Si se implementó procesamiento asíncrono, la intención quedó modelada en `application` mediante puertos en `application.port.out`
- [ ] Si se implementó procesamiento asíncrono, `application` no depende directamente de JobRunr
- [ ] Si se implementó procesamiento asíncrono, los controllers no disparan jobs ni scheduling directamente
- [ ] No se usó `Liquibase`
- [ ] Si hubo cambios de esquema, existe migración Flyway
- [ ] Si hubo cambios de endpoints, `/api-docs` quedó actualizado
- [ ] Si el cambio impacta integraciones, existe handoff actualizado (`swagger.json` u `openapi.json`)
- [ ] Se actualizaron tests y documentación necesaria
- [ ] Se mantuvo trazabilidad CU/RN
- [ ] Los archivos nuevos o modificados del backend quedaron guardados en UTF-8 sin BOM
- [ ] Los archivos `.java` nuevos o modificados del backend no tienen BOM
- [ ] El build file del servicio mantiene o declara UTF-8 sin BOM según el build tool real

## Automatización Git

Regla por defecto:
- Si el usuario no indicó `SKIP_GIT=true`, se debe invocar el skill `crear-branch-pr` al finalizar.

Si `SKIP_GIT=true`:
- documentar la omisión en el README del servicio o en la respuesta final, según corresponda

Parámetros sugeridos para `crear-branch-pr`:

| Parámetro | Valor |
|-----------|-------|
| `tipo` | `feature` |
| `identificador` | `CU-XXX` |
| `descripcion` | `{nombre-caso-uso-kebab-case}-backend` |
| `archivos` | todos los archivos modificados |
| `mensaje_commit` | `feat(backend): implementar CU-XXX {NombreCasoUso}` |
| `base_branch` | `dev` |
| `titulo_pr` | `[CU-XXX] Implementar {NombreCasoUso} - BackEnd` |

## Notas Importantes

- No redefinir la arquitectura del servicio.
- Mantener la implementación subordinada al skill `arquitectura-stack-tecnologico-backend`.
- Mantener la estructura del servicio subordinada a `generar-solucion-backend`.
- Si hay conflicto documental, prevalecen esos skills.
- No introducir dependencias o patrones fuera del baseline validado.
