---
name: arquitectura-stack-tecnologico-backend
description: Skill FUNDAMENTAL que define la Arquitectura Clean Architecture, Stack tecnológico (Java 25, Spring Boot 4.0.5, PostgreSQL, Flyway), patrones obligatorios (ROP, CQRS, Repository), y REGLAS DE DISEÑO DE BASE DE DATOS (normalización 3NF obligatoria, nomenclatura singular, snake_case). DEBE consultarse SIEMPRE antes de generar o modificar código BackEnd, entidades, migraciones, endpoints o casos de uso.
user-invocable: false
argument-hint: arquitectura y stack tecnologico de BackEnd Java
---

## **1.0. Arquitectura del Sistema**

Se implementará una **Arquitectura Limpia (Clean Architecture)** basada en separación de responsabilidades, inversión de dependencias y aislamiento del dominio respecto de detalles técnicos. Cada servicio backend del monorepo mantiene su propia estructura estándar de proyecto Java y organiza las capas mediante paquetes Java bajo un root package único.

## Nombre del Servicio
**[NombreDeTuServicio]**

## Ubicación del Servicio (Monorepo)
**`backEnd/src/[nombre-servicio-en-kebab-case]/`**

Cada servicio backend es **autónomo** y contiene:
- ✅ un build file del tool elegido:
  - `pom.xml` si usa Maven
  - `build.gradle` o `build.gradle.kts` si usa Gradle
- ✅ wrapper obligatorio del build tool elegido:
  - `./mvnw` y `.mvn/` si usa Maven
  - `./gradlew`, `gradlew.bat` y `gradle/wrapper/` si usa Gradle
- ✅ estructura estándar:
  - `src/main/java`
  - `src/main/resources`
  - `src/test/java`
- ❌ No existe `parent pom` en `backEnd/`

**Estructura de Capas:**

1. **Domain (Kernel)**:
- ✅ Paquete exacto: **`com.[empresa].domain`**
- ✅ Qué contiene:
  - entidades de dominio
  - value objects
  - enums
  - contratos base del dominio
  - interfaces puras de dominio cuando realmente apliquen
  - excepciones de dominio
  - `Result<T>` y tipos asociados si aplica
- ✅ Dependencias permitidas:
  - JDK estándar
  - otros tipos del mismo paquete `domain`
- ❌ Prohibido:
  - depender de Spring
  - depender de JPA/Hibernate
  - depender de HTTP
  - depender de `application`, `infrastructure` o `api`
  - contener DTOs de transporte o requests/responses HTTP

2. **Application (Use Cases)**:
- ✅ Paquete exacto: **`com.[empresa].application`**
- ✅ Qué contiene:
  - casos de uso
  - servicios de aplicación
  - puertos de salida
  - intención de procesamiento asíncrono cuando el caso de uso lo requiera
  - orquestación del flujo de negocio
  - validaciones de entrada y reglas de aplicación
- ✅ Dependencias permitidas:
  - `com.[empresa].domain`
- ❌ Prohibido:
  - depender de `infrastructure`
  - depender de `api`
  - acceder a detalles de persistencia
  - contener lógica HTTP

3. **Infrastructure (Implementaciones técnicas)**:
- ✅ Paquete exacto: **`com.[empresa].infrastructure`**
- ✅ Qué contiene:
  - entidades JPA
  - repositorios Spring Data
  - implementaciones concretas de interfaces de dominio
  - adaptadores externos
  - implementación de puertos de procesamiento asíncrono con JobRunr cuando aplique
  - configuración técnica
  - migraciones Flyway en resources
- ✅ Dependencias permitidas:
  - `com.[empresa].domain`
  - `com.[empresa].application` **SOLO** para implementar puertos definidos en `application.port.out.*`
  - librerías técnicas de persistencia, observabilidad, seguridad o integración
- ❌ Prohibido:
  - depender de `api`
  - contener controllers
  - mover lógica de negocio del dominio a clases técnicas

4. **API / Presentation (HTTP)**:
- ✅ Paquete exacto: **`com.[empresa].api`**
- ✅ Qué contiene:
  - controllers REST
  - filtros HTTP
  - manejo global de errores
  - configuración de seguridad, CORS y observabilidad
  - documentación OpenAPI
- ✅ Dependencias permitidas:
  - `com.[empresa].application`
  - `com.[empresa].domain` si aplica
  - componentes de Spring Boot para capa web
- ❌ Prohibido:
  - acceder directamente a repositorios JPA
  - implementar lógica de negocio
  - acoplarse a detalles de persistencia fuera del wiring por IoC

5. **Tests**:
- ✅ Paquete exacto base: **`backEnd/src/[nombre-servicio-en-kebab-case]/src/test/java`**
- ✅ Qué contiene:
  - tests unitarios de dominio
  - tests unitarios de casos de uso
  - tests de integración de infraestructura
  - soporte y utilidades de prueba
- ✅ Dependencias permitidas:
  - JUnit 5
  - Mockito
  - AssertJ
  - Testcontainers con PostgreSQL
  - JaCoCo
- ❌ Prohibido:
  - dejar código crítico sin pruebas
  - asumir base de datos mockeada para pruebas de integración
- ⚠️ **Requerimiento de Cobertura de Código:**
  - **Cobertura mínima obligatoria:** 80% de líneas de código
  - **Comando de verificación:** usar el wrapper real del servicio y la tarea equivalente de tests + coverage del build tool elegido
    ```bash
    cd backEnd/src/[nombre-servicio-en-kebab-case]
    ./mvnw test jacoco:report
    # o, si el servicio usa Gradle
    ./gradlew test jacocoTestReport
    ```
  - **Verificación obligatoria:** Antes de considerar completa cualquier implementación

**Patrones Aplicados:**
- Repository Pattern
- Clean Architecture por separación en paquetes
- Dependency Injection (Spring IoC)
- Railway Oriented Programming (ROP) con `Result<T>` propio

## **2.0. Stack Tecnológico**

* **Lenguaje**: **Java 25**
  - ⚠️ **FIJO Y NO NEGOCIABLE:** el baseline backend del proyecto usa Java 25
  - ❌ **PROHIBIDO:** generar servicios backend con otra versión de Java
* **Framework Principal**: **Spring Boot 4.0.5**
    - ⚠️ **FIJO PARA EL SCAFFOLD BASE:** el bootstrap backend del proyecto usa Spring Boot 4.0.5
    - ❌ **PROHIBIDO:** generar el scaffold base con otra versión de Spring Boot salvo actualización explícita de este skill
* **Build Tool**: **Maven o Gradle**
  - ✅ la elección del build tool puede ser `maven` o `gradle`
  - ✅ el wrapper del build tool elegido es obligatorio
  - ❌ **PROHIBIDO:** usar el comando global del tool (`mvn` o `gradle`) como convención base del servicio
  - ✅ los comandos operativos deben ejecutarse con `./mvnw` o `./gradlew` según corresponda
* **Base de Datos**: **PostgreSQL 16+**
* **Persistencia**: **Spring Data JPA + Hibernate**
* **Migraciones**: **Flyway** con scripts SQL versionados en `src/main/resources/db/migration`
* **Validación**: **Jakarta Validation (Bean Validation)**
* **Documentación API**: **OpenAPI 3** con **springdoc-openapi**
  - Swagger UI en: `/swagger-ui.html`
  - OpenAPI JSON obligatorio en runtime: `/api-docs`
  - Si el servicio expone endpoints consumidos por FrontEnd, debe entregarse además un artefacto manual de handoff: `swagger.json` u `openapi.json`
  - El contrato OpenAPI publicado por el servicio es la fuente de verdad para consumidores HTTP del proyecto
* **Seguridad (opcional)**: **Spring Security + JWT**
* **Logging**: **SLF4J + Logback** con MDC para `TraceId` / `SpanId`
* **Observabilidad**: **Micrometer + OpenTelemetry**
* **Health Checks**: **Spring Boot Actuator** (`/actuator/health`)
* **Procesamiento Asíncrono Backend**: **JobRunr** cuando el caso de uso requiera background jobs persistidos
  - fire-and-forget persistido
  - delayed jobs
  - recurring jobs
  - retries operativos
  - dashboard/monitoring permitido y recomendado, restringido o protegido fuera de desarrollo
  - las dependencias JobRunr se incorporan solo en servicios que realmente requieran procesamiento asíncrono persistido
* **AOP / AspectJ**: soporte para `@Aspect` y `@Around` en la capa `infrastructure`
  - ✅ usar `org.aspectj:aspectjweaver` (versión gestionada por BOM de Spring Boot 4.0.5)
  - ❌ `spring-boot-starter-aop` **no existe** como starter en Spring Boot 4.0.5; no usarlo
  - ✅ Spring Boot 4.0.5 habilita `@EnableAspectJAutoProxy` automáticamente cuando `aspectjweaver` está en el classpath
* **Testing**: **JUnit 5**, **Mockito**, **AssertJ**, **Testcontainers**, **JaCoCo**
  - JUnit 5: framework de pruebas unitarias
  - Mockito: mocking de dependencias
  - AssertJ: assertions expresivas
  - Testcontainers: base de datos real en tests de integración
  - JaCoCo: cobertura de código
* **Cobertura mínima obligatoria**: **80%**
* **Manejo de Errores**: `@RestControllerAdvice` global

### **2.0.0. Bootstrap Operativo del Servicio**

- ✅ El bootstrap operativo preferente del servicio puede realizarse con **Spring Initializr**.
- ✅ Cuando se utilice Spring Initializr para generar el scaffold base, debe usarse exactamente **Spring Boot 4.0.5**.
- ✅ Si se utiliza Spring Initializr, debe aprovecharse lo que el bootstrap resuelve correctamente:
  - proyecto base
  - build file inicial
  - wrapper del build tool elegido
  - estructura estándar del proyecto
- ✅ Luego del bootstrap, el servicio debe ajustarse al baseline arquitectónico de este skill.
- ❌ Este skill no obliga a reconstruir manualmente desde cero el build file ni el wrapper si el bootstrap ya los generó correctamente.
- ✅ Las dependencias solicitadas en el bootstrap deben validarse contra el catálogo real de Spring Initializr cuando se use ese mecanismo.
- ❌ No deben inventarse starters o dependencias como si existieran en el catálogo.
- ✅ Debe distinguirse entre:
  - dependencias de bootstrap
  - dependencias de evolución posterior del servicio

### **2.0.0.1. Regla General para Comandos**

- El build tool elegido al crear el servicio gobierna:
  - wrapper obligatorio
  - comandos de build
  - comandos de test
  - comandos de run
  - validaciones de cobertura
  - ejemplos operativos aplicables al servicio
- Cuando el servicio use Maven, aplicar los ejemplos con `./mvnw`.
- Cuando el servicio use Gradle, aplicar los ejemplos equivalentes con `./gradlew`.
- Si un bloque del skill muestra un solo formato de build file o un solo comando, debe leerse como ejemplo de referencia y traducirse al build tool real del servicio.
- Ningún skill posterior debe asumir Maven si el servicio fue creado con Gradle.

### **2.0.1. Procesamiento Asíncrono Backend (JobRunr)**

- ✅ **JobRunr** es la tecnología estándar del proyecto para procesamiento asíncrono backend cuando un caso de uso requiera jobs persistidos en segundo plano.
- ✅ Su uso aplica para:
  - fire-and-forget persistido
  - delayed jobs
  - recurring jobs
  - retries operativos
  - background processing con persistencia
- ✅ No redefine un sistema de mensajería enterprise ni reemplaza procesos batch masivos especializados.
- ✅ No se preinstala por defecto en todos los servicios; se incorpora cuando el caso de uso lo requiere.

**Reglas de arquitectura:**
- ✅ La capa `application` expresa la intención de encolar o programar trabajo en segundo plano.
- ✅ Los puertos para procesamiento asíncrono viven en `application.port.out`.
- ✅ La implementación concreta vive en `infrastructure` mediante adaptadores JobRunr.
- ✅ Como convención técnica sugerida, esos adaptadores pueden ubicarse en paquetes como `infrastructure.background` o equivalente del servicio.
- ⛔ `application` no depende directamente de JobRunr.
- ⛔ Los controllers no contienen lógica de scheduling ni se acoplan directamente a JobRunr.
- ✅ La lógica transaccional mantiene la convención general del proyecto: `@Transactional` en Use Cases o servicios de aplicación, nunca en controllers.
- ✅ Logging estructurado, trazabilidad y correlación deben mantenerse también en procesamiento asíncrono.
- ✅ El dashboard/monitoring puede existir, pero debe quedar restringido o protegido fuera de desarrollo.

## **2.1. Estándar de Documentación CU/RN (OBLIGATORIO)**

> ⚠️ **OBLIGATORIO:** Todo el código que implementa Casos de Uso DEBE documentar la trazabilidad hacia los CU y RN correspondientes.

### Documentación en Use Cases

Todos los Use Cases DEBEN incluir en su JavaDoc:

```java
/**
 * [Descripción funcional del caso de uso]
 * CU-XXX: [Nombre del Caso de Uso]
 * Patrón: ROP
 */
@UseCase
public class MiUseCase {

    public Result<MiResponse> execute(MiCommand command) {
        return Result.success(new MiResponse());
    }
}
```

### Documentación en Commands / Queries

Todos los Commands DEBEN:
1. Indicar en el JavaDoc qué RNs implementan
2. Comentar cada campo validado con la RN que corresponde

```java
/**
 * Comando para [Nombre]
 * Implementa RN-01 a RN-07 del CU-XXX
 */
public record MiCommand(

    // RN-01: El email debe ser válido y único
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email no tiene un formato válido")
    String email,

    // RN-02: El nombre es obligatorio y no supera 200 caracteres
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 200, message = "El nombre no puede superar 200 caracteres")
    String nombre

) {}
```

Las anotaciones de Jakarta Validation representan **validación de entrada/formato**. Las reglas de negocio que requieren datos o acceso a otros componentes deben resolverse dentro del Use Case mediante el pipeline ROP con `Result<T>`.

### Documentación de Constantes de Negocio

Las constantes numéricas que representen límites o reglas de negocio DEBEN documentar la RN que implementan:

```java
private static final int MAX_INTENTOS = 5; // RN-12: Límite de intentos de login
private static final int HORAS_EXPIRACION = 48; // RN-07: Tiempo de expiración
```

### Use Cases Utilitarios

Para Use Cases que no corresponden a un CU específico (catálogos, geografía, etc.):

```java
/**
 * Obtiene todos los catálogos del sistema.
 * Sin CU asociado - Use Case utilitario para obtención de datos maestros.
 */
@UseCase
public class GetAllCatalogsUseCase {

    public Result<List<CatalogModel>> execute() {
        return Result.success(List.of());
    }
}
```

### Documentación en Métodos Internos de Use Cases (Validaciones ROP)

Los métodos privados de validación dentro de los Use Cases (siguiendo el patrón ROP) DEBEN documentarse según su tipo:

**Para validaciones que implementan Precondiciones del CU:**

```java
/**
 * Verificar que el email esté verificado.
 * Precondición CU-XXX: El usuario debe haber verificado su email.
 */
private Result<CrearContext> validarEmailVerificado(CrearContext ctx) {
    return Result.success(ctx);
}
```

**Para validaciones que implementan Reglas de Negocio:**

```java
/**
 * Verificar unicidad del DNI.
 * RN-02 CU-XXX: El DNI debe ser único en el sistema.
 */
private Result<CrearContext> validarDniUnico(CrearContext ctx) {
    return Result.success(ctx);
}
```

**Para validaciones de seguridad (propiedad/permisos):**

```java
/**
 * Verificar que pertenece al profesional.
 * Validación de seguridad: Solo el propietario puede modificar su recurso.
 */
private Result<CrearContext> validarPropietario(CrearContext ctx) {
    return Result.success(ctx);
}
```

**Para validaciones de estado:**

```java
/**
 * Verificar estado editable.
 * Validación de estado: Solo se pueden editar entidades en estado Borrador.
 */
private Result<CrearContext> validarEstadoEditable(CrearContext ctx) {
    return Result.success(ctx);
}
```

**Para validaciones de catálogo:**

```java
/**
 * Validar IDs de catálogos.
 * Validación de catálogo: Los IDs deben existir en el sistema.
 */
private Result<CrearContext> validarIdsCatalogos(CrearContext ctx) {
    return Result.success(ctx);
}
```

### Verificación

Ejecutar auditoría de documentación con:
```bash
cd backEnd/src/scripts
./audit-cu-rn-documentation.sh
```

- ✅ Verifica que los Use Cases tengan referencia explícita al CU correspondiente.
- ✅ Verifica que Commands/Queries documenten las RN relevantes en sus campos y validaciones.
- ✅ Verifica que los métodos privados de validación mantengan trazabilidad funcional cuando aplican reglas del CU.

## **3.0. Estructura de Proyecto**
```text
backEnd/
└── src/
    ├── scripts/
    │   └── audit-cu-rn-documentation.sh
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
            │   │           ├── domain/
            │   │           │   ├── model/
            │   │           │   ├── valueobject/
            │   │           │   ├── enums/
            │   │           │   ├── repository/
            │   │           │   ├── exception/
            │   │           │   └── result/
            │   │           ├── application/
            │   │           │   ├── usecase/
            │   │           │   ├── port/
            │   │           │   ├── service/
            │   │           │   └── common/
            │   │           │       └── errors/
            │   │           ├── infrastructure/
            │   │           │   ├── persistence/
            │   │           │   │   ├── entity/
            │   │           │   │   ├── repository/
            │   │           │   │   └── mapper/
            │   │           │   ├── config/
            │   │           │   ├── client/
            │   │           │   └── security/
            │   │           └── api/
            │   │               ├── controller/
            │   │               ├── advice/
            │   │               ├── filter/
            │   │               └── config/
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
                            ├── domain/
                            ├── application/
                            └── infrastructure/
```

- ✅ Hoy hay 1 servicio; mañana puede haber varios al mismo nivel dentro de `backEnd/src/`.
- ✅ Cada servicio es build/deploy independiente, sin `parent pom`.
- ✅ La separación de Clean Architecture se aplica por paquetes.
- ✅ `architecture/` en tests se reserva para pruebas de reglas de arquitectura, por ejemplo con ArchUnit.

### **3.1. Logging**

- El logging se implementa con **SLF4J** como API y **Logback** como backend.
- La configuración se define en `application-dev.yml`.
- Convención por clase:
```java
private static final Logger log = LoggerFactory.getLogger(MiClase.class);
```

Ejemplo de configuración:
```yaml
logging:
  level:
    root: INFO
    com.[empresa]: DEBUG
    org.springframework: WARN
    org.hibernate: WARN
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss.SSS} [%level] [TraceId:%X{traceId} SpanId:%X{spanId}] [%thread] [%logger{36}] %msg%n"
  file:
    name: logs/app.log
```

### **3.1.1. LoggingBehavior equivalente con Spring AOP o interceptor**
La convención del proyecto define una anotación `@UseCase` para marcar casos de uso y registrar el bean como componente Spring:

```java
package com.[empresa].application.usecase;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.stereotype.Service;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Service
public @interface UseCase {
}
```

El `LoggingBehavior` se implementa con un interceptor AOP que registra inicio, fin y error de cada Use Case:

```java
@Aspect
@Component
public class UseCaseLoggingAspect {

    private static final Logger log = LoggerFactory.getLogger(UseCaseLoggingAspect.class);

    @Around("@within(com.[empresa].application.usecase.UseCase)")
    public Object logUseCase(ProceedingJoinPoint joinPoint) throws Throwable {
        String useCaseName = joinPoint.getSignature().getDeclaringType().getSimpleName();
        long start = System.nanoTime();

        log.info("[START] {}", useCaseName);
        try {
            Object result = joinPoint.proceed();
            long durationMs = (System.nanoTime() - start) / 1_000_000;
            log.info("[END] {} durationMs={}", useCaseName, durationMs);
            return result;
        } catch (Exception ex) {
            long durationMs = (System.nanoTime() - start) / 1_000_000;
            log.error("[ERROR] {} durationMs={} exception={}", useCaseName, durationMs, ex.getClass().getSimpleName(), ex);
            throw ex;
        }
    }
}
```

**Nota:** El `TraceId` y `SpanId` se incluyen automáticamente en cada línea de log mediante el `MDC` configurado en el `TraceIdFilter` (ver sección 3.6).

### **3.2. Exceptions**
### **3.2.1. CustomValidationException en Domain**
```java
/**
 * Excepción para validaciones de dominio.
 * Contiene múltiples mensajes de validación.
 */
public class CustomValidationException extends RuntimeException {

    private final List<String> messages;

    public CustomValidationException(List<String> messages) {
        super(String.join(", ", messages));
        this.messages = Collections.unmodifiableList(messages);
    }

    public CustomValidationException(String message) {
        this(List.of(message));
    }

    public List<String> getMessages() {
        return messages;
    }
}
```

### **3.2.2. Manejador Global con @RestControllerAdvice**
```java
package com.[empresa].api.advice;

import com.[empresa].api.dto.ApiError;
import com.[empresa].api.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Value;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    private final boolean includeDetails;

    public GlobalExceptionHandler(
            @Value("${app.errors.include-details:false}") boolean includeDetails) {
        this.includeDetails = includeDetails;
    }

    @ExceptionHandler(CustomValidationException.class)
    public ResponseEntity<ApiResponse<Void>> handleCustomValidation(
            CustomValidationException ex) {
        String traceId = MDC.get("traceId");
        var errors = ex.getMessages().stream()
            .map(m -> new ApiError("VALIDATION_ERROR", m))
            .toList();
        log.error("Error de validación traceId={}: {}", traceId, ex.getMessages());
        return ResponseEntity.badRequest().body(ApiResponse.failure(errors));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpServletRequest request) {
        String traceId = MDC.get("traceId");
        List<ApiError> errors;
        if (includeDetails) {
            errors = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> new ApiError("VALIDATION_ERROR", e.getDefaultMessage()))
                .toList();
        } else {
            errors = List.of(new ApiError(
                "INVALID_REQUEST",
                "El requerimiento enviado no tiene un formato válido."));
        }
        log.error("Error de formato en request traceId={}: {}", traceId, ex.getMessage());
        return ResponseEntity.badRequest()
            .body(ApiResponse.failure(errors));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneral(Exception ex) {
        String traceId = MDC.get("traceId");
        var error = new ApiError(
            "INTERNAL_ERROR",
            "Ha ocurrido un error inesperado.");
        log.error("Error inesperado traceId={}: {}", MDC.get("traceId"), ex.getMessage(), ex);
        return ResponseEntity.internalServerError()
            .body(ApiResponse.failure(List.of(error)));
    }
}
```

- ✅ El handler global debe residir en `com.[empresa].api.advice.GlobalExceptionHandler`.
- ✅ Tanto errores funcionales como errores técnicos deben devolverse usando el envelope HTTP estándar del proyecto: `success`, `value`, `errors`.
- ✅ `GlobalExceptionHandler` no debe introducir formatos de error alternativos al contrato del proyecto.
- ✅ El handler debe registrar errores y conservar el `TraceId` desde `MDC` para correlación operativa.

### **3.3. Endpoints documentados con OpenAPI (springdoc-openapi) y versionado**

```java
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/[controller-kebab-case]")
@Tag(name = "[NombreEntidad]", description = "Gestión de [NombreEntidad]")
public abstract class BaseController {
}
```

**OpenAPI 3** define la especificación del contrato HTTP del servicio.  
**Swagger UI** es la interfaz visual para explorar y ejecutar esos endpoints.

**Convención de versionado:**
La versión va en la ruta: `/api/v1/`, `/api/v2/`, etc.

Para nueva versión de un endpoint:
- se crea un nuevo controller, o
- se agrega el segmento de versión al `@RequestMapping` del método específico.

**Importante:** `kebab-case` se aplica manualmente en las rutas; Spring no transforma automáticamente el nombre del controller.

### **3.3.1. Handoff OpenAPI Backend -> Frontend**

> ⚠️ **REGLA OBLIGATORIA:** Todo servicio backend que expone endpoints consumidos por FrontEnd debe dejar disponible su contrato HTTP actualizado como insumo explícito del handoff técnico.

**Publicación obligatoria del contrato:**
- ✅ El servicio debe exponer OpenAPI JSON en `/api-docs`
- ✅ Si hubo cambios consumidos por FrontEnd, debe entregarse además un artefacto manual `swagger.json` u `openapi.json`
- ✅ El contrato debe reflejar la implementación Java actual del servicio

**Fuente de verdad para consumidores:**
- ✅ endpoints reales
- ✅ DTOs request/response
- ✅ status codes
- ✅ envelope estándar del proyecto: `success`, `value`, `errors`

**Reglas de workflow:**
- ✅ Si cambia un endpoint o DTO HTTP, debe actualizarse el contrato OpenAPI publicado
- ✅ El FrontEnd debe consumir ese contrato como fuente de verdad, no ejemplos heredados ni supuestos manuales
- ✅ No se adopta `/swagger/v1/swagger.json` como convención del skill Java; la convención obligatoria del proyecto en Java es `/api-docs`

### **3.4. Perfil de arranque local (application-dev.yml)**

```yaml
server:
  port: 8080

spring:
  # Recomendado: activar el perfil desde línea de comando
  # spring.profiles.active puede declararse aquí solo si el equipo lo necesita
  profiles:
    active: dev

springdoc:
  swagger-ui:
    path: /swagger-ui.html
    try-it-out-enabled: true
  api-docs:
    path: /api-docs
  show-actuator: true
```

**Nota:** Para arrancar en modo dev usar el wrapper real del servicio:
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
# o, si el servicio usa Gradle
./gradlew bootRun --args='--spring.profiles.active=dev'
```

- ✅ `springdoc.api-docs.path` debe mantenerse en `/api-docs` como convención obligatoria del skill backend Java.
- ✅ Si el servicio es consumido por FrontEnd, además del endpoint `/api-docs` debe existir handoff manual del contrato actualizado (`swagger.json` u `openapi.json`).

### **3.5. Convención de Rutas REST (kebab-case)**

> ⚠️ **REGLA OBLIGATORIA:** todos los `@RequestMapping`, `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`, `@PatchMapping` deben usar `kebab-case` explícito.

En Spring las rutas se definen explícitamente en `@RequestMapping`.
No hay transformación automática; la convención `kebab-case` se aplica escribiendo directamente la ruta en minúsculas con guiones.

#### **Comparativa**

| ❌ PascalCase/camelCase en URL | ✅ kebab-case en URL |
|-------------------------------|---------------------|
| `/api/v1/ExperienciaLaboral` | `/api/v1/experiencia-laboral` |
| `/api/v1/usuarioPersonaFisica` | `/api/v1/usuario-persona-fisica` |
| Mezcla de mayúsculas y minúsculas | URLs uniformes y legibles |
| Menor consistencia visual | Convención REST clara |

#### **Ejemplo de Transformación**

| Nombre del Controller | Ruta Generada |
|----------------------|---------------|
| `ProfesionalController` | `/api/v1/profesional/` |
| `ExperienciaLaboralController` | `/api/v1/experiencia-laboral/` |
| `UsuarioPersonaFisicaController` | `/api/v1/usuario-persona-fisica/` |
| `AuthController` | `/api/v1/auth/` |

#### **Implementación: convención manual en Java**

```java
ProfesionalController           @RequestMapping("/api/v1/profesional")
ExperienciaLaboralController    @RequestMapping("/api/v1/experiencia-laboral")
UsuarioPersonaFisicaController  @RequestMapping("/api/v1/usuario-persona-fisica")
AuthController                  @RequestMapping("/api/v1/auth")
```

#### **Utilidad para tests**

```java
public final class KebabCaseUtils {

    private KebabCaseUtils() {
    }

    public static String toKebabCase(String input) {
        if (input == null || input.isEmpty()) {
            return input;
        }
        return input.replaceAll("([a-z])([A-Z])", "$1-$2").toLowerCase();
    }
}
```

#### **Notas Importantes**

1. Las rutas deben escribirse explícitamente en `kebab-case`.
2. NO usar underscores en rutas.
3. El versionado va siempre primero: `/api/v1/...`.
4. Debe existir consistencia entre la ruta base del controller y las rutas de sus métodos.

### **3.6. Exposición de TraceId en Headers**

Para facilitar la trazabilidad y correlación de requests con logs, se implementa un filtro que expone el **TraceId** en los headers de cada respuesta HTTP.

#### **¿Por qué exponer el TraceId?**

| Aspecto | Justificación |
|---------|---------------|
| **Debugging** | Permite correlacionar un request específico con sus logs en el servidor |
| **Soporte al Cliente** | El cliente puede reportar el TraceId para facilitar la investigación de problemas |
| **Trazabilidad Distribuida** | El mismo TraceId se propaga a través de todos los servicios en una arquitectura de microservicios |
| **Monitoreo** | Herramientas como Jaeger, Zipkin o Application Insights pueden usar el TraceId para visualizar la traza completa |

#### **Header de Respuesta**

```http
GET /api/v1/profesional HTTP/1.1
Host: localhost:8080
X-Request-Id: abc-123

HTTP/1.1 200 OK
Content-Type: application/json
X-TraceId: 4bf92f3577b34da6a3ce929d0e0e4736
```

#### **Implementación con OncePerRequestFilter**

```java
package com.[empresa].api.filter;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class TraceIdFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String traceId = Optional
            .ofNullable(MDC.get("traceId"))
            .orElse(UUID.randomUUID().toString().replace("-", ""));
        String spanId = UUID.randomUUID().toString().replace("-", "").substring(0, 16);

        MDC.put("traceId", traceId);
        MDC.put("spanId", spanId);

        response.addHeader("X-TraceId", traceId);

        try {
            filterChain.doFilter(request, response);
        } finally {
            MDC.clear();
        }
    }
}
```

#### **Registro en application.yml**

El filtro se registra automáticamente por ser un `@Component` de Spring.
No requiere registro manual.

#### **Notas Importantes**

1. Usa `MDC` para propagar `traceId` y `spanId` a los logs.
2. `response.addHeader()` garantiza que el header esté presente en la respuesta.
3. El bloque `finally` garantiza que `MDC.clear()` siempre se ejecute.
4. Funciona incluso cuando se producen excepciones en el procesamiento del request.

### **3.7. Convenciones de Controllers**

Los controllers deben ser **thin controllers**: su responsabilidad es hacer binding de entrada, orquestar el caso de uso y devolver la respuesta HTTP. No deben contener lógica de negocio.

#### **Principio de Controllers "Thin"**

| ❌ NO hacer en Controller | ✅ SÍ hacer en Controller |
|---------------------------|---------------------------|
| Validar reglas de negocio con `if`/`else` | Binding con `@PathVariable`, `@RequestParam`, `@RequestBody` |
| Acceder a repositorios JPA desde el controller | Construir `Command` / `Query` |
| Normalizar datos funcionales | Invocar `UseCase` |
| Armar respuestas de negocio manuales | Usar `@Valid` y delegar la respuesta a `ResultHttpMapper` |

**Ejemplo correcto (Controller thin):**

```java
@PostMapping("/{solicitudId}/postulaciones/search")
public ResponseEntity<?> searchPostulaciones(
        @PathVariable UUID solicitudId,
        @RequestParam UUID solicitanteId,
        @RequestParam int tipoSolicitante,
        @Valid @RequestBody GetPostulacionesRequest request) {

    var query = new GetPostulacionesQuery(
        solicitudId, solicitanteId, tipoSolicitante, request);
    var result = getPostulacionesUseCase.execute(query);
    return ResultHttpMapper.ok(result);
}
```

**Ejemplo incorrecto (NO usar):**

```java
@PostMapping("/{solicitudId}/postulaciones/search")
public ResponseEntity<?> searchPostulaciones(...) {
    // INCORRECTO: validación en controller
    if (tipoSolicitante != 2 && tipoSolicitante != 3) {
        return ResponseEntity.badRequest().body("Tipo inválido");
    }

    // INCORRECTO: normalización en controller
    request.setTamanioPagina(Math.min(request.getTamanioPagina(), 50));
    ...
}
```

#### **Responsabilidades por Capa**

| Capa | Responsabilidad |
|------|-----------------|
| **Controller** | binding + orquestación |
| **Validación** | Jakarta Validation en records/DTOs |
| **UseCase** | normalización y reglas de negocio |

#### **Patrón POST `/search` para Búsquedas Complejas**

Cuando una query tiene **5 o más parámetros de filtro**, usar el patrón POST `/search` en lugar de GET con query params.

| Aspecto | GET con Query Params | POST `/search` |
|---------|---------------------|----------------|
| **Usar cuando** | ≤4 parámetros simples | ≥5 parámetros o filtros complejos |
| **URL** | `/recurso?filtro1=x&filtro2=y` | `/recurso/search` |
| **Parámetros de filtro** | Query string | Body JSON |
| **Auth params** | Query string | Query string (se mantienen) |
| **Ejemplo** | `GET /items?estado=1&page=1` | `POST /items/search` con body |

#### **Notas Importantes**

1. El controller no debe contener lógica de negocio.
2. La validación de entrada debe apoyarse en `@Valid` y anotaciones Jakarta Validation.
3. El acceso a persistencia se resuelve en capas internas, nunca desde el controller.
4. El resultado del caso de uso debe traducirse a HTTP con `ResultHttpMapper` y no con respuestas ad hoc.

## **4.0. Dependencias del Servicio y Build File**

El build file del servicio puede expresarse en:

- `pom.xml` si el servicio usa Maven
- `build.gradle` o `build.gradle.kts` si el servicio usa Gradle

Las dependencias base del servicio deben declararse en el formato real del build tool elegido, no en un formato impuesto por otro skill.

Los nombres listados a continuación representan capacidades base o dependencias de referencia del servicio. Su declaración concreta debe expresarse en `pom.xml`, `build.gradle` o `build.gradle.kts` según corresponda.

**Capacidades/dependencias base esperadas del servicio:**

- `spring-boot-starter-web`
- `spring-boot-starter-validation`
- `spring-boot-starter-data-jpa`
- `postgresql`
- `flyway-core`
- `flyway-database-postgresql`
- `springdoc-openapi-starter-webmvc-ui`
- `spring-boot-starter-actuator`
- `micrometer-tracing-bridge-otel`
- `opentelemetry-exporter-otlp`
- `org.aspectj:aspectjweaver`
- `spring-boot-starter-security` cuando el servicio realmente requiera seguridad
- `springdoc-openapi` es obligatorio en el scaffold del servicio porque `/api-docs` es obligatorio en el baseline

**Reglas:**

- ✅ Las versiones deben gestionarse desde el mecanismo de build del proyecto alineado con Spring Boot.
- ✅ Usar SIEMPRE el wrapper real del servicio: `./mvnw` o `./gradlew`.
- ✅ El build tool elegido gobierna la sintaxis del build file, los plugins, tareas y comandos del servicio.
- ✅ El build file generado en el bootstrap se toma como base para el servicio.
- ✅ Ajustar solo lo necesario para cumplir mínimos obligatorios del baseline.
- ✅ Evitar cambios cosméticos o reordenamientos masivos del build file.
- ❌ Prohibido cambiar de build tool durante esos ajustes.
- ❌ Prohibido tratar `pom.xml` como formato normativo exclusivo si el servicio usa Gradle.
- ❌ Prohibido agregar dependencias por si acaso.
- ✅ Si se usó Spring Initializr para bootstrapear el servicio, el build file generado debe tomarse como base y ajustarse solo cuando el baseline del proyecto lo requiera.
- ✅ Las dependencias de bootstrap deben validarse contra el catálogo real de Spring Initializr cuando se use ese mecanismo.
- ❌ No inventar starters o coordenadas como si formaran parte del catálogo de Spring Initializr.

## **4.1. Testing y Coverage**

**Dependencias/capacidades mínimas para testing:**

- `spring-boot-starter-test`
- `org.testcontainers:junit-jupiter`
- `org.testcontainers:postgresql`

**Reglas de cobertura:**

- ✅ Configurar cobertura con el mecanismo equivalente del build tool real del servicio.
- ✅ Si el servicio usa Maven, puede aplicarse `jacoco-maven-plugin` como referencia.
- ✅ Si el servicio usa Gradle, debe configurarse la tarea equivalente de JaCoCo en `build.gradle` o `build.gradle.kts`.
- ✅ El umbral mínimo obligatorio sigue siendo 80% de líneas.
- ❌ Prohibido asumir que la única configuración válida de coverage es la de Maven.

**Comandos de referencia para tests y coverage:**

```bash
cd backEnd/src/[nombre-servicio-en-kebab-case]
./mvnw test jacoco:report
./mvnw -q verify
# o, si el servicio usa Gradle
./gradlew test jacocoTestReport
./gradlew check
```

- ✅ Los comandos deben ejecutarse siempre con el wrapper del build tool real del servicio.
- ✅ Si el servicio fue creado con Gradle, toda validación de tests/coverage debe expresarse con `./gradlew`, no con `./mvnw`.

## **4.1.1. Testing de Arquitectura con ArchUnit**

**ArchUnit** es la herramienta estándar del proyecto para validar que la arquitectura del servicio cumple con las reglas de Clean Architecture y las convenciones definidas en este skill.

### Propósito

Los tests de arquitectura son **pruebas automáticas** que verifican que:

- Las capas no dependen unas de otras de forma incorrecta (inversión de control).
- Las anotaciones `@UseCase`, `@Repository`, etc., se aplican en los lugares correctos.
- Los paquetes respetan la separación de responsabilidades.
- Las reglas de naming y convenciones se cumplen consistentemente.

### Ubicación

Los tests de arquitectura viven en:

```text
src/test/java/com/[empresa]/architecture/
```

**Estructura recomendada:**

```text
src/test/java/com/[empresa]/architecture/
├── ArchitectureTest.java
├── LayerDependencyTest.java
├── ConventionTest.java
└── AnnotationTest.java
```

### Dependencias Requeridas

Agregar al `pom.xml` o `build.gradle(.kts)` del servicio:

**Maven (`pom.xml`):**
```xml
<dependency>
    <groupId>com.tngtech.archunit</groupId>
    <artifactId>archunit-junit5</artifactId>
    <version>1.4.2</version>
    <scope>test</scope>
</dependency>
```

**Gradle (`build.gradle`):**
```gradle
testImplementation 'com.tngtech.archunit:archunit-junit5:1.4.2'
```

> Nota de compatibilidad: para Java 25 se debe usar una versión de ArchUnit compatible con class file major version 69. La referencia mínima para este baseline es `1.4.2`.

> Nota para scaffold inicial: cuando todavía no existan controllers, use cases o repositorios concretos, las reglas de `ConventionTest` y `AnnotationTest` deben declararse con `.allowEmptyShould(true)` para evitar falsos negativos durante la generación base.

### Reglas Obligatorias de Arquitectura

#### Regla 1: Aislamiento de Capas

La capa `application` no debe depender de `infrastructure`.
La capa `api` no debe depender directamente de `infrastructure.persistence`.

```java
package com.[empresa].architecture;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import org.junit.jupiter.api.Test;

class LayerDependencyTest {

    private static final String BASE_PACKAGE = "com.[empresa]";
    private final JavaClasses classes = new ClassFileImporter()
            .importPackages(BASE_PACKAGE);

    @Test
    void applicationShouldNotDependOnInfrastructure() {
        noClasses()
                .that().resideInAPackage(BASE_PACKAGE + ".application..")
                .should().dependOnClassesThat()
                .resideInAPackage(BASE_PACKAGE + ".infrastructure..")
                .check(classes);
    }

    @Test
    void apiShouldNotDependOnPersistence() {
        noClasses()
                .that().resideInAPackage(BASE_PACKAGE + ".api..")
                .should().dependOnClassesThat()
                .resideInAPackage(BASE_PACKAGE + ".infrastructure.persistence..")
                .check(classes);
    }

    @Test
    void domainShouldNotDependOnOtherLayers() {
        noClasses()
                .that().resideInAPackage(BASE_PACKAGE + ".domain..")
                .should().dependOnClassesThat()
                .resideInAPackage(BASE_PACKAGE + ".application..")
                .orShould().dependOnClassesThat()
                .resideInAPackage(BASE_PACKAGE + ".infrastructure..")
                .check(classes);
    }
}
```

#### Regla 2: Anotaciones Obligatorias

Todo Use Case debe estar anotado con `@UseCase`.
Todo repositorio debe estar anotado con `@Repository`.

```java
package com.[empresa].architecture;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import org.junit.jupiter.api.Test;
import org.springframework.stereotype.Repository;
import com.[empresa].application.common.UseCase;

class AnnotationTest {

    private static final String BASE_PACKAGE = "com.[empresa]";
    private final JavaClasses classes = new ClassFileImporter()
            .importPackages(BASE_PACKAGE);

    @Test
    void useCasesInApplicationShouldBeAnnotatedWithUseCase() {
        classes()
                .that().resideInAPackage(BASE_PACKAGE + ".application.usecase..")
                .and().haveNameMatching(".*UseCase$")
                .should().beAnnotatedWith(UseCase.class)
                .check(classes);
    }

    @Test
    void repositoriesInInfrastructureShouldBeAnnotatedWithRepository() {
        classes()
                .that().resideInAPackage(BASE_PACKAGE + ".infrastructure.persistence.repository..")
                .and().haveNameMatching(".*Repository$")
                .should().beAnnotatedWith(Repository.class)
                .check(classes);
    }
}
```

#### Regla 3: Convenciones de Naming

Los controllers deben residir en el paquete `api.controller`.
Los servicios deben residir en `application`.

```java
package com.[empresa].architecture;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import org.junit.jupiter.api.Test;
import org.springframework.web.bind.annotation.RestController;

class ConventionTest {

    private static final String BASE_PACKAGE = "com.[empresa]";
    private final JavaClasses classes = new ClassFileImporter()
            .importPackages(BASE_PACKAGE);

    @Test
    void controllersInApiShouldResideInControllerPackage() {
        classes()
                .that().areAnnotatedWith(RestController.class)
                .should().resideInAPackage(BASE_PACKAGE + ".api.controller..")
                .check(classes);
    }

    @Test
    void controllerNamesShouldEndWithController() {
        classes()
                .that().resideInAPackage(BASE_PACKAGE + ".api.controller..")
                .and().areAnnotatedWith(RestController.class)
                .should().haveNameMatching(".*Controller$")
                .check(classes);
    }
}
```

### Ejecución de Tests de Arquitectura

Los tests de arquitectura se ejecutan junto con el resto de tests:

```bash
cd backEnd/src/[nombre-servicio-en-kebab-case]
./mvnw test
# o, si el servicio usa Gradle
./gradlew test
```

**En CI/CD:** Los tests de arquitectura son parte del pipeline de validación. Si alguna regla se viola, la compilación falla.

### Integración con CI/CD

Agregar a la pipeline:

```yaml
# Ejemplo para GitHub Actions
- name: Run tests and architecture validation
  run: |
    cd backEnd/src/[nombre-servicio-en-kebab-case]
    ./mvnw verify
```

Si el servicio usa Gradle:

```yaml
- name: Run tests and architecture validation
  run: |
    cd backEnd/src/[nombre-servicio-en-kebab-case]
    ./gradlew check
```

### Extensibilidad

Se pueden agregar nuevas reglas según el contexto del proyecto. Las reglas deben:

- ✅ Residir en `src/test/java/.../architecture/`
- ✅ Extender o estar en armonía con las reglas base
- ✅ Tener una documentación clara del propósito
- ✅ Ejecutarse automáticamente en CI/CD

## **4.1.2. Scaffold Técnico Mínimo Obligatorio (/api/v1/hello)**

Además del esqueleto por capas, el scaffold base debe incluir un endpoint técnico mínimo para demostrar el patrón ROP y el mapeo HTTP estándar del proyecto.

### Endpoint obligatorio

- Ruta: `GET /api/v1/hello`
- Objetivo: validar wiring técnico del servicio y contrato base de respuesta.
- Debe publicarse en OpenAPI (`/api-docs`).

### Clases mínimas obligatorias

**API:**
- `api/controller/HelloController`
- `api/mapper/ResultHttpMapper`
- `api/response/ApiResponse`
- `api/response/ApiError`
- `api/response/HelloResponse`

**Application:**
- `application/common/UseCase`
- `application/usecase/hello/GetHelloUseCase`
- `application/usecase/hello/GetHelloResult`

**Domain:**
- `domain/result/Result`

### Reglas de implementación

- El controller no debe contener lógica de negocio.
- El caso de uso debe devolver `Result<T>` y respetar el pipeline ROP.
- La traducción de `Result<T>` a contrato HTTP debe centralizarse en `ResultHttpMapper`.
- No devolver respuestas ad hoc directamente desde controllers.

## **4.1.3. Revisión de Código Muerto (Obligatoria al Final)**

Al finalizar la generación del scaffold o cualquier implementación backend:

1. identificar posibles clases/archivos sin referencias (código muerto),
2. reportar explícitamente los candidatos,
3. solicitar confirmación del usuario antes de eliminar,
4. eliminar solo los elementos confirmados.

Regla estricta:
- ❌ Prohibido eliminar código de forma silenciosa o automática sin confirmación explícita del usuario.

## **4.2. Result<T> (ROP)**

El uso de **ROP con `Result<T>`** es **OBLIGATORIO** en la capa de Use Cases.

**Ubicación:** `com.[empresa].domain.result.Result`

```java
package com.[empresa].domain.result;

import java.util.List;
import java.util.Objects;
import java.util.function.Consumer;
import java.util.function.Function;

public final class Result<T> {

    private final T value;
    private final List<String> errors;

    private Result(T value, List<String> errors) {
        this.value = value;
        this.errors = List.copyOf(errors);
    }

    public static <T> Result<T> success(T value) {
        return new Result<>(value, List.of());
    }

    public static <T> Result<T> failure(String message) {
        return new Result<>(null, List.of(message));
    }

    public static <T> Result<T> failure(List<String> messages) {
        return new Result<>(null, messages);
    }

    public boolean isSuccess() {
        return errors.isEmpty();
    }

    public boolean isFailure() {
        return !isSuccess();
    }

    public T getValue() {
        if (isFailure()) {
            throw new IllegalStateException("No se puede obtener value de un Result en failure");
        }
        return value;
    }

    public List<String> getErrors() {
        return errors;
    }

    public <R> Result<R> map(Function<T, R> mapper) {
        Objects.requireNonNull(mapper);
        if (isFailure()) {
            return Result.failure(errors);
        }
        return Result.success(mapper.apply(value));
    }

    public <R> Result<R> flatMap(Function<T, Result<R>> binder) {
        Objects.requireNonNull(binder);
        if (isFailure()) {
            return Result.failure(errors);
        }
        return Objects.requireNonNull(binder.apply(value));
    }

    public Result<T> onFailure(Consumer<List<String>> consumer) {
        Objects.requireNonNull(consumer);
        if (isFailure()) {
            consumer.accept(errors);
        }
        return this;
    }
}
```

- ✅ Los Use Cases retornan `Result<T>`.
- ✅ Las reglas de negocio no lanzan exceptions.
- ✅ Las exceptions se reservan para errores técnicos inesperados, que serán manejados por `GlobalExceptionHandler`.

## **4.3. Anti-patrón PROHIBIDO: if/return espagueti**

> ⛔ **PROHIBIDO:** No usar validaciones secuenciales con `if/return` repetidos dentro del método principal del Use Case.

```java
// ❌ PROHIBIDO
public Result<ProductoResponse> execute(CrearProductoCommand command) {
    if (command.nombre() == null || command.nombre().isBlank()) {
        return Result.failure("El nombre es obligatorio");
    }

    if (productoRepository.existsByCodigo(command.codigo())) {
        return Result.failure("Ya existe un producto con ese código");
    }

    if (!categoriaRepository.existsById(command.categoriaId())) {
        return Result.failure("La categoría no existe");
    }

    if (command.precio().signum() <= 0) {
        return Result.failure("El precio debe ser mayor a cero");
    }

    return Result.failure("Implementación incompleta");
}
```

**Por qué se prohíbe:**
- ❌ Aumenta la complejidad ciclomática del caso de uso.
- ❌ Duplica patrones de validación y mensajes de error.
- ❌ Reduce la trazabilidad entre RN/CU y pasos del flujo.
- ❌ Dificulta el testeo unitario y la mantenibilidad.

## **4.4. Patrón correcto: pipeline con map/flatMap**

```java
package com.[empresa].application.usecase.producto;

import com.[empresa].domain.result.Result;

@UseCase
public class CrearProductoUseCase {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    public CrearProductoUseCase(
            ProductoRepository productoRepository,
            CategoriaRepository categoriaRepository) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    public Result<ProductoResponse> execute(CrearProductoCommand command) {
        return crearContexto(command)
            .flatMap(this::validarNombre)
            .flatMap(this::validarCategoriaExistente)
            .flatMap(this::validarCodigoUnico)
            .flatMap(this::crearEntidad)
            .map(this::toResponse);
    }

    private Result<Context> crearContexto(CrearProductoCommand command) {
        return Result.success(new Context(command, null, null));
    }

    private Result<Context> validarNombre(Context ctx) {
        if (ctx.command().nombre() == null || ctx.command().nombre().isBlank()) {
            return Result.failure("El nombre es obligatorio");
        }
        return Result.success(ctx);
    }

    private Result<Context> validarCategoriaExistente(Context ctx) {
        return categoriaRepository.findById(ctx.command().categoriaId())
            .map(categoria -> Result.success(ctx.withCategoria(categoria)))
            .orElseGet(() -> Result.failure("La categoría no existe"));
    }

    private Result<Context> validarCodigoUnico(Context ctx) {
        if (productoRepository.existsByCodigo(ctx.command().codigo())) {
            return Result.failure("Ya existe un producto con ese código");
        }
        return Result.success(ctx);
    }

    private Result<Context> crearEntidad(Context ctx) {
        var producto = new Producto(
            ctx.command().codigo(),
            ctx.command().nombre(),
            ctx.command().precio(),
            ctx.categoria().id()
        );
        return Result.success(ctx.withProducto(producto));
    }

    private ProductoResponse toResponse(Context ctx) {
        return new ProductoResponse(
            ctx.producto().codigo(),
            ctx.producto().nombre(),
            ctx.producto().precio()
        );
    }

    private record Context(
        CrearProductoCommand command,
        Categoria categoria,
        Producto producto
    ) {
        private Context withCategoria(Categoria value) {
            return new Context(command, value, producto);
        }

        private Context withProducto(Producto value) {
            return new Context(command, categoria, value);
        }
    }
}
```

- ✅ Cada método valida una RN/CU específica.
- ✅ La composición con `flatMap/map` evita el `if/return` espagueti.

## **4.5. ErrorMessageCreator**

**Ubicación:** `com.[empresa].application.common.errors.ErrorMessageCreator`

```java
package com.[empresa].application.common.errors;

public final class ErrorMessageCreator {

    private ErrorMessageCreator() {
    }

    public static String required(String field) {
        return "El campo '" + field + "' es obligatorio";
    }

    public static String invalid(String field) {
        return "El campo '" + field + "' no es válido";
    }

    public static String notFound(String entity, Object id) {
        return "No se encontró " + entity + " con identificador '" + id + "'";
    }

    public static String forbidden(String action) {
        return "No tiene permisos para " + action;
    }

    public static String conflict(String entity, String reason) {
        return "No se puede procesar " + entity + ": " + reason;
    }
}
```

## **4.6. DTO estándar de error para API**

```java
package com.[empresa].api.dto;

import java.util.List;

public record ApiError(String code, String message) {
}
```

```java
package com.[empresa].api.dto;

import java.util.List;

public record ApiResponse<T>(
    boolean success,
    T value,
    List<ApiError> errors
) {
    public static <T> ApiResponse<T> success(T value) {
        return new ApiResponse<>(true, value, List.of());
    }

    public static <T> ApiResponse<T> failure(List<ApiError> errors) {
        return new ApiResponse<>(false, null, List.copyOf(errors));
    }
}
```

- ✅ El contrato HTTP estándar del proyecto usa siempre el envelope `success`, `value`, `errors`.
- ✅ `value` contiene el payload solo cuando `success=true`.
- ✅ `errors` contiene los errores de negocio o técnicos cuando `success=false`.
- ✅ `TraceId` se expone por header `X-TraceId` y logging; no reemplaza el envelope funcional del contrato.
- ✅ Estos DTOs se usan tanto en `GlobalExceptionHandler` como para mapear `Result.failure(...)` a HTTP.

## **4.7. Result<T> -> ResponseEntity**

**Ubicación recomendada:** `com.[empresa].api.controller.ResultHttpMapper`

```java
package com.[empresa].api.controller;

import com.[empresa].api.dto.ApiError;
import com.[empresa].api.dto.ApiResponse;
import com.[empresa].domain.result.Result;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public final class ResultHttpMapper {

    private ResultHttpMapper() {
    }

    public static <T> ResponseEntity<ApiResponse<T>> ok(Result<T> result) {
        if (result.isSuccess()) {
            return ResponseEntity.ok(ApiResponse.success(result.getValue()));
        }
        return ResponseEntity.badRequest().body(ApiResponse.failure(toErrors(result)));
    }

    public static <T> ResponseEntity<ApiResponse<T>> created(Result<T> result) {
        if (result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(result.getValue()));
        }
        return ResponseEntity.badRequest().body(ApiResponse.failure(toErrors(result)));
    }

    private static List<ApiError> toErrors(Result<?> result) {
        return result.getErrors().stream()
            .map(message -> new ApiError("BUSINESS_ERROR", message))
            .toList();
    }
}
```

- ✅ Los controllers NO deben repetir lógica de conversión.
- ✅ Los controllers delegan la conversión a un helper único.
- ✅ Las respuestas exitosas y fallidas deben mantener el mismo envelope HTTP estándar del proyecto.
- ✅ Los controllers no deben devolver payload plano ni errores ad hoc cuando el flujo sale de un `Result<T>`.

## **5.0. Persistencia y Base de Datos (PostgreSQL + JPA)**

- ✅ La persistencia del servicio se implementa con **Spring Data JPA + Hibernate** sobre **PostgreSQL**.
- ✅ La evolución del esquema se gestiona con **Flyway** mediante scripts SQL versionados.
- ✅ El esquema de base de datos y el modelo JPA deben mantenerse alineados en todo momento.

**Reglas obligatorias:**
- ✅ `hibernate.ddl-auto` debe configurarse en `validate` o `none` en todos los entornos.
- ⛔ **PROHIBIDO** usar `create`, `create-drop` o `update`.
- ✅ Todo cambio de esquema se realiza **solo** mediante migraciones Flyway.
- ✅ Tablas, columnas, índices y constraints deben seguir convención `snake_case`.

## **5.1. Convenciones de Naming en DB**

- ✅ Las tablas se nombran en **singular** y `snake_case`.
- ✅ La primary key estándar es `id`.
- ✅ Las foreign keys siguen la convención `<tabla>_id`.
- ✅ Las fechas de auditoría estándar son `created_at` y `updated_at`.
- ✅ Los booleanos deben usar la convención `is_active` y mantenerse igual en todo el servicio.
- ✅ Los índices deben nombrarse como `ix_<tabla>_<columna>`.
- ✅ Las restricciones únicas deben nombrarse como `ux_<tabla>_<columna>`.

```sql
create table usuario (
    id bigserial primary key,
    perfil_id bigint not null,
    email varchar(150) not null,
    nombre varchar(200) not null,
    is_active boolean not null default true,
    created_at timestamp without time zone not null default current_timestamp,
    updated_at timestamp without time zone null,
    constraint fk_usuario_perfil_id
        foreign key (perfil_id) references perfil(id),
    constraint ux_usuario_email
        unique (email)
);

create index ix_usuario_perfil_id
    on usuario (perfil_id);
```

## **5.2. Flyway (Migraciones SQL)**

**Ubicación obligatoria:** `src/main/resources/db/migration/`

**Convención de nombres:**
- ✅ `V1__init.sql`
- ✅ `V2__add_usuario_table.sql`
- ✅ `V3__add_ix_usuario_email.sql`

**Reglas:**
- ✅ Toda modificación de esquema requiere una nueva migración.
- ✅ Las migraciones aplicadas son **inmutables**; no se editan una vez ejecutadas en un entorno compartido.
- ✅ Usar scripts idempotentes cuando aplique:
  - por ejemplo, en scripts auxiliares o de seed controlado
  - cuando exista riesgo de ejecución repetida por automatizaciones
  - sin romper la trazabilidad ni la secuencia versionada de Flyway

**Ejemplo de estructura:**
```text
src/main/resources/db/migration/
├── V1__init.sql
├── V2__create_usuario_table.sql
└── V3__add_ux_usuario_email.sql
```

**Ejecución de migraciones:**
- ✅ Spring Boot ejecuta Flyway automáticamente al levantar la aplicación.
- ✅ No se deben correr cambios manuales de esquema por fuera del circuito de migraciones.

```yaml
spring:
  flyway:
    enabled: true
    locations: classpath:db/migration
```

## **5.3. Configuración de Datasource y JPA**

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/[nombre_bd]
    username: postgres
    password: postgres
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        format_sql: true

logging:
  level:
    org.hibernate.SQL: DEBUG
```

- ✅ En desarrollo se pueden usar credenciales locales de conveniencia.
- ✅ En producción las credenciales reales deben gestionarse mediante variables de entorno o secretos externos.
- ✅ Se recomienda observar SQL por logging antes que habilitar `show-sql` en forma permanente.

## **5.4. Mapeo JPA: Entities, Repositories y Mappers**

- ✅ Las entidades JPA viven en `com.[empresa].infrastructure.persistence.entity`.
- ✅ Los repositorios Spring Data viven en `com.[empresa].infrastructure.persistence.repository`.
- ✅ Los mappers viven en `com.[empresa].infrastructure.persistence.mapper`.
- ✅ El modelo de dominio **NO** lleva anotaciones JPA.
- ✅ La conversión `Domain <-> JPA` se realiza en mappers dentro de infraestructura.

```java
package com.[empresa].infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;

@Entity
@Table(name = "usuario")
public class UsuarioJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "email", nullable = false, length = 150)
    private String email;

    @Column(name = "nombre", nullable = false, length = 200)
    private String nombre;

    @Column(name = "is_active", nullable = false)
    private boolean isActive;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "perfil_id", nullable = false)
    private PerfilJpaEntity perfil;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public PerfilJpaEntity getPerfil() {
        return perfil;
    }

    public void setPerfil(PerfilJpaEntity perfil) {
        this.perfil = perfil;
    }
}
```

```java
package com.[empresa].infrastructure.persistence.repository;

import com.[empresa].infrastructure.persistence.entity.UsuarioJpaEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioSpringDataRepository extends JpaRepository<UsuarioJpaEntity, Long> {

    Optional<UsuarioJpaEntity> findByEmail(String email);

    boolean existsByEmail(String email);
}
```

```java
package com.[empresa].infrastructure.persistence.mapper;

import com.[empresa].domain.model.Usuario;
import com.[empresa].infrastructure.persistence.entity.PerfilJpaEntity;
import com.[empresa].infrastructure.persistence.entity.UsuarioJpaEntity;
import org.springframework.stereotype.Component;

@Component
public class UsuarioPersistenceMapper {

    public Usuario toDomain(UsuarioJpaEntity entity) {
        return new Usuario(
            entity.getId(),
            entity.getEmail(),
            entity.getNombre(),
            entity.isActive(),
            entity.getPerfil().getId(),
            entity.getCreatedAt()
        );
    }

    public UsuarioJpaEntity toEntity(Usuario domain, PerfilJpaEntity perfil) {
        UsuarioJpaEntity entity = new UsuarioJpaEntity();
        entity.setId(domain.id());
        entity.setEmail(domain.email());
        entity.setNombre(domain.nombre());
        entity.setActive(domain.isActive());
        entity.setCreatedAt(domain.createdAt());
        entity.setPerfil(perfil);
        return entity;
    }
}
```

## **6.0. Repositorios por Puertos (Hexagonal)**

- ✅ Las capas `domain` y `application` definen contratos abstractos para acceso a datos.
- ✅ La capa `infrastructure` implementa esos contratos usando JPA y PostgreSQL.
- ✅ La lógica de aplicación nunca depende directamente de `JpaRepository`.

**Ubicaciones:**
- ✅ Puerto OUT en application: `com.[empresa].application.port.out`
- ✅ Implementación en infrastructure: `com.[empresa].infrastructure.persistence`

**Flujo:**
- `UseCase`
- `-> PortOut`
- `-> Adapter (infrastructure)`
- `-> SpringDataRepo`
- `-> DB`

## **6.1. Interfaces de Repositorio (Port Out)**

Se recomienda usar `Result<T>` en los puertos cuando el servicio ya adoptó ROP como convención transversal, porque mantiene el contrato homogéneo entre Application e Infrastructure.

```java
package com.[empresa].application.port.out;

import com.[empresa].domain.model.Usuario;
import com.[empresa].domain.result.Result;
import java.util.Optional;

public interface UsuarioRepositoryPort {

    Result<Optional<Usuario>> findById(Long id);

    Result<Usuario> save(Usuario usuario);

    boolean existsByEmail(String email);
}
```

- ✅ La capa `application` no conoce `JpaRepository`.
- ✅ El puerto expresa intención funcional, no detalles técnicos de persistencia.

## **6.2. Implementación de Port Out con JPA**

```java
package com.[empresa].infrastructure.persistence;

import com.[empresa].application.port.out.UsuarioRepositoryPort;
import com.[empresa].domain.model.Usuario;
import com.[empresa].domain.result.Result;
import com.[empresa].infrastructure.persistence.entity.PerfilJpaEntity;
import com.[empresa].infrastructure.persistence.entity.UsuarioJpaEntity;
import com.[empresa].infrastructure.persistence.mapper.UsuarioPersistenceMapper;
import com.[empresa].infrastructure.persistence.repository.PerfilSpringDataRepository;
import com.[empresa].infrastructure.persistence.repository.UsuarioSpringDataRepository;
import java.util.Optional;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Repository;

@Repository
public class UsuarioRepositoryAdapter implements UsuarioRepositoryPort {

    private final UsuarioSpringDataRepository usuarioRepository;
    private final PerfilSpringDataRepository perfilRepository;
    private final UsuarioPersistenceMapper mapper;

    public UsuarioRepositoryAdapter(
            UsuarioSpringDataRepository usuarioRepository,
            PerfilSpringDataRepository perfilRepository,
            UsuarioPersistenceMapper mapper) {
        this.usuarioRepository = usuarioRepository;
        this.perfilRepository = perfilRepository;
        this.mapper = mapper;
    }

    @Override
    public Result<Optional<Usuario>> findById(Long id) {
        try {
            return Result.success(
                usuarioRepository.findById(id)
                    .map(mapper::toDomain)
            );
        } catch (DataAccessException ex) {
            return Result.failure("No fue posible consultar la información del usuario.");
        }
    }

    @Override
    public Result<Usuario> save(Usuario usuario) {
        try {
            PerfilJpaEntity perfil = perfilRepository.findById(usuario.perfilId())
                .orElseThrow(() -> new IllegalStateException("Perfil no encontrado para persistencia."));

            UsuarioJpaEntity entity = mapper.toEntity(usuario, perfil);
            UsuarioJpaEntity saved = usuarioRepository.save(entity);
            return Result.success(mapper.toDomain(saved));
        } catch (DataAccessException ex) {
            return Result.failure("No fue posible guardar la información del usuario.");
        } catch (RuntimeException ex) {
            return Result.failure("Ocurrió un error técnico al persistir el usuario.");
        }
    }

    @Override
    public boolean existsByEmail(String email) {
        return usuarioRepository.existsByEmail(email);
    }
}
```

- ✅ La implementación puede capturar `DataAccessException` o `RuntimeException` para encapsular fallos técnicos.
- ✅ Nunca se debe exponer stacktrace ni detalles internos al cliente final.

## **6.3. Transacciones con @Transactional**

**Reglas:**
- ✅ `@Transactional` se usa en Use Cases o servicios de aplicación.
- ⛔ **PROHIBIDO** usar `@Transactional` en controllers.
- ✅ Las queries de solo lectura usan `@Transactional(readOnly = true)`.
- ✅ Los commands usan `@Transactional`.
- ✅ `@Transactional` reemplaza la necesidad de un `Unit of Work` explícito.

**Ejemplo de Command Use Case:**
```java
package com.[empresa].application.usecase.usuario.command;

import com.[empresa].application.port.out.UsuarioRepositoryPort;
import com.[empresa].application.usecase.usuario.dto.CreateUsuarioResponse;
import com.[empresa].domain.model.Usuario;
import com.[empresa].domain.result.Result;
import java.time.OffsetDateTime;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CreateUsuarioUseCase {

    private final UsuarioRepositoryPort usuarioRepositoryPort;

    public CreateUsuarioUseCase(UsuarioRepositoryPort usuarioRepositoryPort) {
        this.usuarioRepositoryPort = usuarioRepositoryPort;
    }

    private record Context(
        CreateUsuarioCommand command,
        Usuario usuario
    ) {
        static Context of(CreateUsuarioCommand command) {
            return new Context(command, null);
        }

        Context withUsuario(Usuario usuario) {
            return new Context(command, usuario);
        }
    }

    @Transactional
    public Result<CreateUsuarioResponse> execute(CreateUsuarioCommand command) {
        return crearContexto(command)
            .flatMap(this::validarEmailUnico)
            .flatMap(this::construirModeloDominio)
            .flatMap(this::persistir)
            .map(this::toResponse);
    }

    private Result<Context> crearContexto(CreateUsuarioCommand command) {
        return Result.success(Context.of(command));
    }

    private Result<Context> validarEmailUnico(Context ctx) {
        if (usuarioRepositoryPort.existsByEmail(ctx.command().email())) {
            return Result.failure("Ya existe un usuario con el email informado.");
        }
        return Result.success(ctx);
    }

    private Result<Context> construirModeloDominio(Context ctx) {
        Usuario usuario = new Usuario(
            null,
            ctx.command().email(),
            ctx.command().nombre(),
            true,
            ctx.command().perfilId(),
            OffsetDateTime.now()
        );
        return Result.success(ctx.withUsuario(usuario));
    }

    private Result<Context> persistir(Context ctx) {
        return usuarioRepositoryPort.save(ctx.usuario())
            .map(ctx::withUsuario);
    }

    private CreateUsuarioResponse toResponse(Context ctx) {
        return new CreateUsuarioResponse(
            ctx.usuario().id(),
            ctx.usuario().email(),
            ctx.usuario().nombre()
        );
    }
}
```

**Ejemplo de Query Use Case:**
```java
package com.[empresa].application.usecase.usuario.query;

import com.[empresa].application.port.out.UsuarioRepositoryPort;
import com.[empresa].application.common.errors.ErrorMessageCreator;
import com.[empresa].application.usecase.usuario.dto.GetUsuarioByIdResponse;
import com.[empresa].domain.result.Result;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GetUsuarioByIdUseCase {

    private final UsuarioRepositoryPort usuarioRepositoryPort;

    public GetUsuarioByIdUseCase(UsuarioRepositoryPort usuarioRepositoryPort) {
        this.usuarioRepositoryPort = usuarioRepositoryPort;
    }

    @Transactional(readOnly = true)
    public Result<GetUsuarioByIdResponse> execute(GetUsuarioByIdQuery query) {
        return usuarioRepositoryPort.findById(query.id())
            .flatMap(optionalUsuario -> optionalUsuario
                .map(usuario -> Result.success(
                    new GetUsuarioByIdResponse(usuario.id(), usuario.email(), usuario.nombre(), usuario.isActive())))
                .orElseGet(() -> Result.failure(ErrorMessageCreator.notFound("Usuario", query.id()))));
    }
}
```

## **6.4. Anti-patrones de Persistencia (PROHIBIDOS)**

**⛔ PROHIBIDO:**
- ⛔ Usar entidades JPA en controllers.
- ⛔ Devolver entidades JPA como DTOs de API.
- ⛔ Usar `ddl-auto: update`, `ddl-auto: create` o `ddl-auto: create-drop`.
- ⛔ Escribir SQL en controllers.
- ⛔ Saltarse puertos e ir directo a `JpaRepository` desde `application` o `api`.

**✅ SÍ:**
- ✅ Usar domain models puros.
- ✅ Mantener mappers en infraestructura.
- ✅ Definir ports en application.
- ✅ Gestionar cambios de esquema con migraciones Flyway.

## **7.0. Estructura de Casos de Uso (Use Cases)**

Toda funcionalidad del sistema debe implementarse como un **Use Case** dentro de la capa `application`.

Se utiliza un enfoque **CQRS liviano**:
- ✅ **Commands** para operaciones de mutación.
- ✅ **Queries** para operaciones de lectura.

**Reglas obligatorias:**
- ✅ 1 clase por Use Case.
- ✅ 1 `Command` o `Query` por Use Case.
- ✅ El Use Case retorna `Result<ResponseDto>`.
- ✅ Los controllers no contienen lógica de negocio.
- ✅ Los Use Cases no dependen directamente de infraestructura, solo de puertos (`application.port.out`).

## **7.1. Estructura de paquetes para Use Cases**

**Ubicación recomendada:** `com.[empresa].application.usecase.[feature]/`

Dentro de cada feature:
- ✅ `command/`
- ✅ `query/`
- ✅ `dto/`

**Ejemplo:**
```text
com/[empresa]/application/usecase/usuario/
├── command/
│   ├── CreateUsuarioCommand.java
│   └── CreateUsuarioUseCase.java
├── query/
│   ├── GetUsuarioByIdQuery.java
│   └── GetUsuarioByIdUseCase.java
└── dto/
    ├── CreateUsuarioResponse.java
    └── GetUsuarioByIdResponse.java
```

## **7.2. Commands (mutación)**

Los Commands representan entradas de mutación y deben expresarse como `record` con validaciones de formato mediante **Jakarta Validation**.

```java
package com.[empresa].application.usecase.usuario.command;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateUsuarioCommand(

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email no tiene un formato válido")
    String email,

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 200, message = "El nombre no puede superar 200 caracteres")
    String nombre,

    @NotNull(message = "El perfil es obligatorio")
    Long perfilId
) {
}
```

**Reglas:**
- ✅ La validación de formato y entrada se realiza con anotaciones.
- ✅ La validación de negocio se realiza dentro del Use Case mediante ROP y `Result<T>`.

**Ejemplo de endpoint:**
```java
@PostMapping
public ResponseEntity<?> create(@Valid @RequestBody CreateUsuarioCommand command) {
    return ResultHttpMapper.created(createUsuarioUseCase.execute(command));
}
```

## **7.3. Queries (lectura)**

Las Queries representan operaciones de consulta y no deben modificar estado.

```java
package com.[empresa].application.usecase.usuario.query;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record GetUsuarioByIdQuery(

    @NotNull(message = "El id es obligatorio")
    @Positive(message = "El id debe ser mayor a cero")
    Long id
) {
}
```

**Reglas:**
- ✅ Las Queries NO modifican estado.
- ✅ El Use Case asociado debe usar `@Transactional(readOnly = true)`.

**Ejemplo de endpoint GET:**
```java
@GetMapping("/{id}")
public ResponseEntity<?> getById(@PathVariable Long id) {
    var query = new GetUsuarioByIdQuery(id);
    return ResultHttpMapper.ok(getUsuarioByIdUseCase.execute(query));
}
```

## **7.4. Use Case ejemplo completo (Command) con ROP**

```java
package com.[empresa].application.usecase.usuario.command;

import com.[empresa].application.common.errors.ErrorMessageCreator;
import com.[empresa].application.port.out.UsuarioRepositoryPort;
import com.[empresa].application.usecase.usuario.dto.CreateUsuarioResponse;
import com.[empresa].domain.model.Usuario;
import com.[empresa].domain.result.Result;
import java.time.OffsetDateTime;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CreateUsuarioUseCase {

    private final UsuarioRepositoryPort usuarioRepositoryPort;

    public CreateUsuarioUseCase(UsuarioRepositoryPort usuarioRepositoryPort) {
        this.usuarioRepositoryPort = usuarioRepositoryPort;
    }

    private record Context(
        CreateUsuarioCommand command,
        Usuario usuario
    ) {
        static Context of(CreateUsuarioCommand command) {
            return new Context(command, null);
        }

        Context withUsuario(Usuario usuario) {
            return new Context(command, usuario);
        }
    }

    public Result<CreateUsuarioResponse> execute(CreateUsuarioCommand command) {
        return crearContexto(command)
            .flatMap(this::validarPrecondiciones)
            .flatMap(this::validarEmailUnico)
            .flatMap(this::construirModeloDominio)
            .flatMap(this::persistir)
            .map(this::toResponse);
    }

    private Result<Context> crearContexto(CreateUsuarioCommand command) {
        return Result.success(Context.of(command));
    }

    private Result<Context> validarPrecondiciones(Context ctx) {
        if (ctx.command().perfilId() <= 0) {
            return Result.failure(ErrorMessageCreator.invalid("perfilId"));
        }
        return Result.success(ctx);
    }

    private Result<Context> validarEmailUnico(Context ctx) {
        if (usuarioRepositoryPort.existsByEmail(ctx.command().email())) {
            return Result.failure(ErrorMessageCreator.conflict("Usuario", "el email ya está registrado"));
        }
        return Result.success(ctx);
    }

    private Result<Context> construirModeloDominio(Context ctx) {
        Usuario usuario = new Usuario(
            null,
            ctx.command().email(),
            ctx.command().nombre(),
            true,
            ctx.command().perfilId(),
            OffsetDateTime.now()
        );
        return Result.success(ctx.withUsuario(usuario));
    }

    private Result<Context> persistir(Context ctx) {
        return usuarioRepositoryPort.save(ctx.usuario())
            .map(ctx::withUsuario);
    }

    private CreateUsuarioResponse toResponse(Context ctx) {
        return new CreateUsuarioResponse(
            ctx.usuario().id(),
            ctx.usuario().email(),
            ctx.usuario().nombre()
        );
    }
}
```

- ✅ Cada método privado valida una RN/CU específica.
- ✅ La composición con `flatMap/map` evita el anti-patrón de `if/return` espagueti.

## **7.5. Use Case ejemplo completo (Query)**

```java
package com.[empresa].application.usecase.usuario.query;

import com.[empresa].application.common.errors.ErrorMessageCreator;
import com.[empresa].application.port.out.UsuarioRepositoryPort;
import com.[empresa].application.usecase.usuario.dto.GetUsuarioByIdResponse;
import com.[empresa].domain.result.Result;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class GetUsuarioByIdUseCase {

    private final UsuarioRepositoryPort usuarioRepositoryPort;

    public GetUsuarioByIdUseCase(UsuarioRepositoryPort usuarioRepositoryPort) {
        this.usuarioRepositoryPort = usuarioRepositoryPort;
    }

    public Result<GetUsuarioByIdResponse> execute(GetUsuarioByIdQuery query) {
        return usuarioRepositoryPort.findById(query.id())
            .flatMap(optionalUsuario -> optionalUsuario
                .map(Result::success)
                .orElseGet(() -> Result.failure(ErrorMessageCreator.notFound("Usuario", query.id()))))
            .map(usuario -> new GetUsuarioByIdResponse(
                usuario.id(),
                usuario.email(),
                usuario.nombre(),
                usuario.isActive()
            ));
    }
}
```

## **8.0. Clase principal y bootstrap (@SpringBootApplication)**

La clase principal debe ubicarse en el **root package** para que Spring Boot realice el component scanning de `api`, `application` e `infrastructure`.

```java
package com.[empresa];

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class NombreServicioApplication {

    public static void main(String[] args) {
        SpringApplication.run(NombreServicioApplication.class, args);
    }
}
```

**Ubicación recomendada:**
```text
backEnd/src/[nombre-servicio-en-kebab-case]/
└── src/main/java/com/[empresa]/
    ├── NombreServicioApplication.java
    ├── api/
    ├── application/
    ├── domain/
    └── infrastructure/
```

**Reglas:**
- ✅ `@SpringBootApplication` debe estar en el root package.
- ✅ Debe existir una sola clase principal `@SpringBootApplication` por proyecto backend.
- ✅ El método `main` es el punto de arranque estándar.
- ✅ La ubicación en el paquete raíz permite escanear componentes de todas las capas técnicas.
- ❌ La clase principal no debe ubicarse en `api`.
- ❌ La carpeta física `backEnd/src/[nombre-servicio-en-kebab-case]/` no define por sí sola el package root Java.

## **8.1. Configuración base (application.yml)**

```yaml
spring:
  application:
    name: [nombre-servicio-en-kebab-case]

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus

logging:
  level:
    root: INFO

springdoc:
  swagger-ui:
    path: /swagger-ui.html
  api-docs:
    path: /api-docs

app:
  errors:
    include-details: false
```

- ✅ `application.yml` contiene defaults compartidos entre ambientes.
- ✅ La configuración sensible o variable por entorno se externaliza a `application-dev.yml` y `application-prod.yml`.
- ✅ `/api-docs` es obligatorio para todos los servicios backend Java del proyecto.

## **8.2. OpenTelemetry + Micrometer (config mínima)**

OpenTelemetry y Micrometer permiten capturar **traces** y **metrics** del servicio para observabilidad técnica y diagnóstico distribuido.

```yaml
management:
  tracing:
    sampling:
      probability: 1.0

otel:
  exporter:
    otlp:
      endpoint: http://localhost:4317
  resource:
    attributes:
      service.name: [nombre-servicio-en-kebab-case]
      service.version: 1.0.0
```

- ✅ El `TraceId` se expone al consumidor mediante el header `X-TraceId` según la sección `3.6`.
- ✅ Los logs incluyen `traceId` y `spanId` vía MDC según la sección `3.1`.
- ✅ La configuración debe mantenerse mínima y clara; las opciones avanzadas se agregan solo si el servicio realmente las necesita.

## **9.0. Convenciones generales y reglas no negociables**

- ✅ La separación por capas se implementa mediante paquetes: `domain`, `application`, `infrastructure`, `api`.
- ✅ `domain` no depende de Spring, JPA/Hibernate, HTTP ni de otras capas.
- ✅ `application` depende solo de `domain` y de puertos declarados en su propia capa.
- ✅ `infrastructure` implementa puertos y adaptadores técnicos; no contiene lógica de negocio.
- ✅ Los controllers deben ser **thin controllers**: binding, orquestación y delegación al Use Case.
- ✅ Las reglas de negocio deben expresarse con `Result<T>` y pipeline ROP.
- ✅ `@Transactional` se usa en Use Cases o servicios de aplicación, nunca en controllers.
- ✅ Si un caso de uso requiere background jobs persistidos, el estándar del proyecto es **JobRunr** integrado mediante puertos en `application.port.out` e implementación en `infrastructure`.
- ✅ Flyway es la **única** forma permitida de cambiar el esquema de base de datos.
- ✅ Todas las rutas HTTP deben escribirse explícitamente en `kebab-case`.
- ✅ Toda request debe propagar `TraceId` vía `MDC` y exponer `X-TraceId` en la respuesta.
- ✅ Toda API documentada debe usar OpenAPI con `springdoc-openapi`.
- ✅ Todo servicio backend Java debe publicar su contrato en `/api-docs`.
- ✅ Si un cambio de contrato impacta al FrontEnd, debe entregarse handoff manual actualizado como `swagger.json` u `openapi.json`.
- ✅ Toda respuesta HTTP funcional del proyecto debe respetar el envelope `success`, `value`, `errors`.
- ✅ Toda entrega debe incluir tests relevantes y mantener cobertura mínima del 80%.

| ✅ Permitido | ⛔ Prohibido |
|-------------|-------------|
| Use Case -> Port -> Adapter | Controller -> JpaRepository |
| `Result<T>` para errores de negocio | Excepciones para reglas funcionales |
| `@Transactional` en Use Cases | `@Transactional` en controllers |
| Flyway para cambios de DB | `ddl-auto: update/create/create-drop` |
| Rutas `/api/v1/...` en kebab-case | rutas camelCase o sin versionado |
| DTOs de API separados del modelo JPA | devolver entidades JPA por HTTP |
| MDC + `X-TraceId` | logs sin correlación |
| Tests unitarios e integración | mergear sin validar cobertura |

## **10.0. Checklist de PR / Definition of Done**

Antes de abrir un PR, validar como mínimo lo siguiente:

- [ ] La solución respeta la separación por capas y no introduce dependencias inválidas entre paquetes.
- [ ] Los controllers se mantienen delgados y toda la lógica funcional vive en Use Cases.
- [ ] Las rutas nuevas o modificadas usan `kebab-case` y versionado `/api/v1/...`.
- [ ] Los errores funcionales usan `Result<T>` y los errores técnicos quedan centralizados en `GlobalExceptionHandler`.
- [ ] Los logs relevantes incluyen trazabilidad y el `TraceId` se expone en `X-TraceId`.
- [ ] Si el caso usa procesamiento asíncrono persistido, se implementó mediante JobRunr sin acoplar controllers ni `application` a detalles técnicos del scheduler.
- [ ] Si hubo cambios de esquema, existe migración Flyway en `src/main/resources/db/migration/`.
- [ ] No se modificó el esquema mediante `ddl-auto`.
- [ ] Los nombres de tablas, columnas, índices y constraints respetan la convención definida.
- [ ] Los paquetes y clases siguen la estructura estándar del servicio.
- [ ] Si cambió un endpoint, se actualizó su documentación OpenAPI/springdoc.
- [ ] Si cambió un endpoint o DTO HTTP, el contrato actualizado está disponible en `/api-docs`.
- [ ] Si el cambio impacta al FrontEnd, se entregó handoff manual actualizado (`swagger.json` u `openapi.json`).
- [ ] Las respuestas HTTP mantienen el envelope estándar `success`, `value`, `errors`.
- [ ] Existen tests unitarios o de integración para el cambio realizado.
- [ ] La cobertura se mantiene en el umbral mínimo exigido.

**Comandos estándar antes de abrir PR:**
```bash
cd backEnd/src/[nombre-servicio-en-kebab-case]
./mvnw -q test
./mvnw -q verify
# o, si el servicio usa Gradle
./gradlew test
./gradlew check
```
---

## **11.0. Reglas de Diseño de Base de Datos**

> ⚠️ **REGLAS FUNDAMENTALES:** Las siguientes reglas son **OBLIGATORIAS** para todo diseño de base de datos en el proyecto. Establecen los estándares de normalización y nomenclatura que garantizan consistencia, integridad y mantenibilidad.

### **11.0.1. Normalización Obligatoria (Tercera Forma Normal - 3NF)**

**REGLA FUNDAMENTAL:** Todas las tablas de la base de datos **DEBEN cumplir como mínimo con la Tercera Forma Normal (3NF)**, salvo excepciones explícitamente justificadas por razones de rendimiento.

#### Requisitos de Normalización:

| Forma Normal | Requisitos | Verificación |
|--------------|------------|---------------|
| **1FN** | Todos los atributos son atómicos, no hay grupos repetitivos, cada campo contiene un único valor | ❌ `Telefonos: "123,456"` → ✅ Tabla `telefono` con FK |
| **2FN** | Cumple 1FN + sin dependencias parciales de la clave primaria | Atributos no-clave dependen de **toda** la clave |
| **3FN** | Cumple 2FN + sin dependencias transitivas entre atributos no-clave | ❌ `CiudadNombre` en `Profesional` → ✅ FK a tabla `ciudad` |

#### Ejemplos de Violaciones Comunes:

| Violación | Problema | Solución |
|-----------|----------|----------|
| `direccion1, direccion2, direccion3` | Grupos repetitivos (viola 1FN) | Tabla `direccion` con relación 1:N |
| `Profesional(id, ciudad_id, ciudad_nombre)` | Dependencia transitiva (viola 3FN) | `ciudad_nombre` debe estar en tabla `ciudad` |
| `Pedido(pedido_id, producto_id, producto_nombre)` | Dependencia parcial (viola 2FN) | `producto_nombre` depende solo de `producto_id` |

#### Excepciones Permitidas:

Las excepciones a 3NF **SOLO** se permiten cuando:
1. El Caso de Uso lo indica explícitamente con justificación de rendimiento
2. Se trata de campos calculados para reporting/consultas frecuentes
3. Se documenta la decisión con análisis de trade-off

**Formato de documentación para excepciones:**

| Campo Desnormalizado | Tabla | Justificación | Impacto | Mitigación |
|---------------------|-------|---------------|---------|------------|
| `total_pedido` | `pedido` | Evitar cálculo en cada consulta | Puede desincronizarse | Trigger o evento de dominio |

---

### **11.1. Nombres de Tablas**
| Regla | Descripción | Ejemplo Correcto | Ejemplo Incorrecto |
|-------|-------------|------------------|-------------------|
| **Formato** | `snake_case` siempre | `usuario_profesional` | `UsuarioProfesional`, `usuarioprofesional` |
| **Idioma** | Español (consistente con el dominio del negocio) | `tipo_servicio` | `service_type` |
| **Número** | **Singular** siempre, salvo indicación explícita | `usuario`, `provincia` | `usuarios`, `provincias` |

### **11.2. Tablas de Relación N:N (Tablas Intermedias)**
| Regla | Descripción | Ejemplo Correcto | Ejemplo Incorrecto |
|-------|-------------|------------------|-------------------|
| **Formato** | `{tabla_principal}_{tabla_relacionada}` | `usuario_profesional_tipo_servicio` | `usuario_profesional_tipos_servicios` |
| **Número** | **Singular** en ambas partes | `profesional_tarea_especifica` | `profesionales_tareas_especificas` |
| **Orden** | Tabla principal primero, relacionada después | `pedido_producto` | `producto_pedido` |

### **11.3. Nombres de Columnas**
| Regla | Descripción | Ejemplo Correcto | Ejemplo Incorrecto |
|-------|-------------|------------------|-------------------|
| **Formato** | `snake_case` | `fecha_nacimiento` | `FechaNacimiento`, `fechanacimiento` |
| **Claves Foráneas** | `{entidad_referenciada}_id` | `usuario_id`, `provincia_id` | `id_usuario`, `usuarioId` |
| **Booleanos** | Prefijo `is_` o `tiene_` | `is_deleted`, `tiene_vehiculo` | `deleted`, `vehiculo` |
| **Fechas** | Sin prefijo especial | `created_at`, `fecha_inicio` | `dtCreatedAt` |

### **11.4. Índices y Constraints**
| Tipo | Formato | Ejemplo |
|------|---------|---------|
| **Índice regular** | `ix_{tabla}_{columna(s)}` | `ix_usuario_profesional_usuario_id` |
| **Índice único** | `uq_{tabla}_{columna(s)}` | `uq_usuario_email` |
| **Clave primaria** | `pk_{tabla}` | `pk_usuario_profesional` |
| **Clave foránea** | `fk_{tabla_origen}_{tabla_destino}` | `fk_usuario_profesional_usuario` |

### **11.5. Ejemplos Completos**

**Entidad simple:**
```
Tabla: usuario
Columnas: id, email, password_hash, is_deleted, created_at, updated_at
```

**Entidad con relación 1:1:**
```
Tabla: usuario_profesional
Columnas: id, usuario_id, nombre_completo, dni, fecha_nacimiento, is_deleted
FK: fk_usuario_profesional_usuario
Índice: ix_usuario_profesional_usuario_id (UNIQUE)
```

**Tabla de relación N:N:**
```
Tabla: usuario_profesional_tipo_servicio
Columnas: usuario_profesional_id, tipo_servicio_id
PK compuesta: (usuario_profesional_id, tipo_servicio_id)
FK: fk_usuario_profesional_tipo_servicio_usuario_profesional
FK: fk_usuario_profesional_tipo_servicio_tipo_servicio_catalogo
Índice: ix_usuario_profesional_tipo_servicio_tipo_servicio_id
```

---

## **Instrucciones para Copilot**

1. Usa siempre el wrapper real del servicio dentro de `backEnd/src/[nombre-servicio-en-kebab-case]/`; `./mvnw` si usa Maven o `./gradlew` si usa Gradle. No uses el comando global del tool.
2. Respeta la estructura de proyecto backend dentro de `backEnd/src/<nombre-servicio-en-kebab-case>/`.
3. Mantén los paquetes bajo el root package definido explícitamente para el proyecto backend, respetando la convención vigente `com.[empresa].domain`, `application`, `infrastructure` y `api`. No derives el root package automáticamente desde la carpeta física del backend.
4. Genera controllers thin: solo binding, orquestación y delegación al Use Case.
5. Usa `Result<T>` para flujos funcionales y compón el pipeline con `map` y `flatMap`.
6. No implementes `if/return` espagueti para validar reglas de negocio en Use Cases.
7. No lances exceptions por reglas de negocio; usa `Result.failure(...)`.
8. Aplica `@Transactional` en Use Cases o servicios de aplicación, nunca en controllers.
9. Toda modificación de base de datos debe hacerse con Flyway; no uses `ddl-auto update`, `create` ni `create-drop`.
10. Respeta `snake_case` en tablas, columnas, índices y constraints de PostgreSQL.
11. Define todas las rutas HTTP en `kebab-case` y versionadas bajo `/api/v1/...`.
12. Expón siempre `X-TraceId` en la respuesta y registra logs con `MDC` usando `traceId` y `spanId`.
13. Documenta endpoints con `springdoc-openapi` usando `@Tag`, `@Operation` y anotaciones relacionadas cuando corresponda.
14. Publica siempre el contrato OpenAPI en `/api-docs`; no cambies esa ruta en servicios backend Java del proyecto.
15. Si implementas o modificas endpoints consumidos por FrontEnd, entrega además el contrato actualizado como `swagger.json` u `openapi.json`.
16. Mantén el contrato HTTP estándar del proyecto con envelope `success`, `value`, `errors`; no devuelvas formatos alternativos por endpoint.
17. Escribe tests con JUnit 5, Mockito y AssertJ para casos de uso y componentes relevantes.
18. Usa Testcontainers con PostgreSQL real para pruebas de integración de persistencia.
19. Mantén JaCoCo con umbral mínimo del 80%; no bajes ese valor ni omitas la validación.
20. No uses entidades JPA como DTOs de API; mantén mappers `Domain <-> JPA` en infraestructura.
21. No accedas a `JpaRepository` desde controllers ni desde `application`; usa siempre ports y adapters.
