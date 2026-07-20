---
name: procesamiento-asincrono-backend
description: Skill de REFERENCIA que define convenciones, estructura y patrones para implementar procesamiento asíncrono backend con JobRunr en servicios Java del monorepo. Debe consultarse cuando un caso de uso requiera emails, notificaciones, expiraciones, recordatorios o tareas persistidas en background.
user-invocable: false
argument-hint: procesamiento asíncrono backend, background jobs, JobRunr
---

# Procesamiento Asíncrono Backend

## 1. Objetivo

Definir la estrategia estándar del proyecto para implementar procesamiento asíncrono backend en servicios `Java 25 + Spring Boot`, manteniendo coherencia con:

- `arquitectura-stack-tecnologico-backend`
- `generar-solucion-backend`
- `implementar-caso-uso-backend`

Este skill existe para resolver tareas en segundo plano que deben persistirse, programarse o reintentarse sin romper la arquitectura por capas ni acoplar los casos de uso a detalles técnicos del scheduler.

## 2. Alcance

Este skill aplica cuando un caso de uso requiere:

- background jobs persistidos
- ejecución diferida
- ejecución recurrente
- retries operativos
- monitoreo de jobs en ejecución o fallidos

No redefine:

- la arquitectura limpia del servicio
- el contrato HTTP del servicio
- la persistencia funcional del dominio
- una plataforma de mensajería enterprise
- un sistema de batch processing masivo

## 3. Cuándo usar procesamiento asíncrono

Usar procesamiento asíncrono backend cuando la tarea:

- no debe bloquear la respuesta HTTP inmediata
- puede ejecutarse después de completar el caso de uso principal
- requiere persistencia del job para sobrevivir reinicios
- puede necesitar retries automáticos
- tiene costo operativo o de I/O relevante
- tiene valor en ser programada o reprogramada

Casos típicos:

| Escenario | ¿Usar JobRunr? | Motivo |
|-----------|----------------|--------|
| Enviar emails | ✅ Sí | Operación externa, lenta y reintentable |
| Enviar notificaciones | ✅ Sí | Puede ejecutarse fuera del request principal |
| Crear recordatorios diferidos | ✅ Sí | Requiere delayed jobs |
| Expirar registros por tiempo | ✅ Sí | Requiere recurring jobs |
| Tareas de limpieza ligera programada | ✅ Sí | Job recurrente persistido |
| Recalcular procesos de compatibilidad o consolidación | ✅ Sí, si el volumen lo justifica | No bloquear el flujo principal |

## 4. Cuándo no usarlo

No corresponde usar procesamiento asíncrono cuando el problema requiere:

- validación inmediata de input
- reglas de negocio síncronas que afectan el resultado inmediato del caso de uso
- confirmación instantánea antes de responder HTTP
- operaciones CRUD simples y rápidas
- procesamiento batch masivo especializado
- mensajería/event streaming enterprise

Casos donde **NO** corresponde:

| Escenario | ¿Usar JobRunr? | Motivo |
|-----------|----------------|--------|
| Validar campos de request | ❌ No | Debe resolverse antes de responder |
| Verificar precondiciones de negocio | ❌ No | Pertenece al Use Case síncrono |
| Confirmar unicidad o permisos | ❌ No | Debe impactar la respuesta inmediata |
| Batch masivo de alto volumen | ❌ No | Evaluar otra estrategia especializada |
| Publicación de eventos enterprise | ❌ No | No es el objetivo de este skill |

## 5. Estrategia estándar del proyecto

La tecnología estándar del proyecto para procesamiento asíncrono backend es **JobRunr**, cuando el caso de uso requiera background jobs persistidos.

Capacidades cubiertas:

- fire-and-forget persistido
- delayed jobs
- recurring jobs
- retries operativos
- dashboard/monitoring
- integración con Spring Boot

Reglas:

- ✅ JobRunr **no** se preinstala por defecto en todos los servicios.
- ✅ Se incorpora solo cuando el caso de uso lo requiere.
- ✅ Su incorporación debe respetar la arquitectura del servicio existente.
- ✅ El servicio sigue publicando y manteniendo su contrato OpenAPI en `/api-docs`.
- ✅ El uso de JobRunr no reemplaza `Result<T>`, `@UseCase`, `@Transactional`, ni la separación por capas.

## 6. Integración arquitectónica

### 6.1 Regla general

El procesamiento asíncrono debe integrarse mediante puertos y adaptadores:

- `application` expresa la intención
- `application.port.out` define el puerto
- `infrastructure` implementa el puerto con JobRunr
- `application` no conoce JobRunr directamente

### 6.2 Responsabilidades por capa

**Application**
- define el puerto de salida para scheduling o encolado
- decide cuándo se debe disparar trabajo asíncrono
- mantiene la orquestación del caso de uso
- puede ejecutar la intención dentro del mismo Use Case

**Infrastructure**
- implementa el puerto con JobRunr
- resuelve detalles técnicos de encolado, programación, retries y configuración
- aloja configuración, adaptadores y jobs concretos

**API**
- delega al Use Case
- no dispara jobs directamente
- no contiene lógica de scheduling

### 6.3 Relación con `@Transactional`

Se mantiene la regla general del proyecto:

- ✅ `@Transactional` en Use Cases o servicios de aplicación
- ⛔ nunca en controllers

La capa `application` decide el momento funcional en el que debe registrarse la intención de trabajo asíncrono. La implementación concreta del scheduling no debe romper la convención transaccional del servicio.

### 6.4 Relación con `Result<T>`

El caso de uso sigue devolviendo `Result<T>` como convención obligatoria del proyecto.

Reglas:

- el flujo funcional del Use Case sigue siendo síncrono y explícito
- la intención de disparar un job forma parte de la orquestación del Use Case
- los errores funcionales siguen modelándose con `Result.failure(...)`
- JobRunr no reemplaza el manejo funcional de errores del proyecto

## 7. Tipos de jobs soportados

### 7.1 Fire-and-forget persistido

Usar cuando se requiere ejecutar una tarea después de completar el caso de uso principal, sin bloquear la respuesta.

Ejemplos:

- enviar email de confirmación
- crear notificación
- registrar tarea secundaria no crítica

### 7.2 Delayed jobs

Usar cuando la tarea debe ejecutarse en el futuro a partir de una acción del negocio.

Ejemplos:

- recordatorio 24h antes de una entrevista
- confirmación diferida
- caducidad programada de un recurso

### 7.3 Recurring jobs

Usar cuando la tarea es periódica y debe ejecutarse según una frecuencia controlada.

Ejemplos:

- expiración de registros vencidos
- recordatorios recurrentes
- limpieza programada de datos temporales ligeros

### 7.4 Retries

Los retries son válidos cuando el fallo es técnico y potencialmente transitorio.

Ejemplos donde suele aplicar:

- timeouts de red
- proveedor de email temporalmente indisponible
- fallo externo recuperable

No usar retries ciegos cuando el error es funcional o definitivo.

## 8. Ubicación sugerida de paquetes y artefactos

Convención sugerida dentro de un servicio:

```text
backEnd/src/[nombre-servicio-en-kebab-case]/
└── src/
    ├── main/
    │   ├── java/com/[empresa]/
    │   │   ├── application/
    │   │   │   ├── usecase/
    │   │   │   └── port/
    │   │   │       └── out/
    │   │   └── infrastructure/
    │   │       ├── background/
    │   │       │   ├── config/
    │   │       │   ├── job/
    │   │       │   └── scheduler/
    │   │       └── persistence/
    │   └── resources/
    └── test/
        └── java/com/[empresa]/
            ├── application/
            └── infrastructure/
```

Notas:

- `application.port.out` define el contrato del scheduling
- `infrastructure.background` es la convención sugerida para los adaptadores JobRunr
- no hace falta crear todos los subpaquetes si el caso no lo requiere

## 9. Patrones de uso correctos

### 9.1 Puerto de salida en application

Ejemplo breve:

```java
package com.[empresa].application.port.out;

public interface NotificationJobPort {

    void enqueueWelcomeEmail(Long usuarioId);

    void scheduleInterviewReminder(Long entrevistaId);
}
```

### 9.2 Use Case que expresa la intención

```java
@UseCase
public class RegistrarUsuarioUseCase {

    private final UsuarioRepositoryPort usuarioRepositoryPort;
    private final NotificationJobPort notificationJobPort;

    public RegistrarUsuarioUseCase(
        UsuarioRepositoryPort usuarioRepositoryPort,
        NotificationJobPort notificationJobPort
    ) {
        this.usuarioRepositoryPort = usuarioRepositoryPort;
        this.notificationJobPort = notificationJobPort;
    }

    @Transactional
    public Result<RegistrarUsuarioResponse> execute(RegistrarUsuarioCommand command) {
        return crearContexto(command)
            .flatMap(this::validarEmailUnico)
            .flatMap(this::persistir)
            .map(this::encolarNotificacion)
            .map(this::toResponse);
    }

    private Context encolarNotificacion(Context ctx) {
        notificationJobPort.enqueueWelcomeEmail(ctx.usuario().id());
        return ctx;
    }
}
```

### 9.3 Adaptador técnico en infrastructure

```java
package com.[empresa].infrastructure.background;

import com.[empresa].application.port.out.NotificationJobPort;
import org.springframework.stereotype.Component;

@Component
public class JobRunrNotificationJobAdapter implements NotificationJobPort {

    @Override
    public void enqueueWelcomeEmail(Long usuarioId) {
        // Implementación concreta con JobRunr
    }

    @Override
    public void scheduleInterviewReminder(Long entrevistaId) {
        // Implementación concreta con JobRunr
    }
}
```

### 9.4 Reglas obligatorias

- ✅ Los controllers delegan al Use Case; no programan jobs directamente.
- ✅ `application` expresa intención, no detalles técnicos.
- ✅ `application` no importa clases de JobRunr.
- ✅ Los adaptadores concretos viven en `infrastructure`.
- ✅ Mantener naming claro de jobs, puertos y responsabilidades.

## 10. Logging, trazabilidad y observabilidad

Mantener las reglas generales del proyecto:

- logging con `SLF4J + Logback`
- correlación con `TraceId`
- evitar exponer datos sensibles

Además:

- loguear encolado, scheduling, ejecución y fallo relevante de jobs
- mantener identificadores claros de job, entidad funcional y contexto
- si el servicio expone dashboard/monitoring, debe estar restringido o protegido fuera de desarrollo

El dashboard es:

- ✅ permitido
- ✅ recomendado cuando el servicio realmente usa procesamiento asíncrono persistido
- ⛔ no debe quedar libre en ambientes no controlados

## 11. Persistencia y consideraciones de datos

### 11.1 Qué persiste JobRunr

JobRunr persiste el estado técnico del job:

- encolado
- programado
- ejecutado
- reintentado
- fallido

### 11.2 Qué no reemplaza

JobRunr **no** reemplaza:

- el estado funcional del dominio
- la persistencia JPA del negocio
- las migraciones Flyway del servicio
- la trazabilidad funcional del caso de uso

### 11.3 Convivencia con el baseline del servicio

Reglas:

- cualquier decisión concreta de configuración, storage o esquema técnico debe respetar el baseline del servicio
- no inventar una arquitectura paralela de persistencia
- si la incorporación de JobRunr requiere configuración o artefactos adicionales, deben quedar alineados con el servicio, su configuración y su operación real

## 12. Testing

Debe cubrirse, según el caso:

- tests del Use Case que dispara o programa el job
- tests del puerto y/o adaptador cuando corresponda
- tests de integración si el flujo async es relevante
- tests de jobs específicos si contienen lógica relevante

Reglas:

- el Use Case debe poder probarse sin depender directamente de JobRunr
- el adaptador técnico puede verificarse por integración si el servicio lo necesita
- no mezclar la validación del negocio con la validación del scheduler

## 13. Criterios de validación

- [ ] El caso justifica realmente procesamiento asíncrono persistido
- [ ] Se eligió JobRunr como tecnología estándar del proyecto
- [ ] `application` expresa intención mediante un puerto en `application.port.out`
- [ ] `application` no depende directamente de JobRunr
- [ ] Los controllers no disparan jobs directamente
- [ ] La implementación concreta vive en `infrastructure`
- [ ] La convención transaccional del proyecto se mantiene (`@Transactional` en Use Cases/application)
- [ ] La implementación distingue entre estado técnico del job y estado funcional del dominio
- [ ] Se mantuvieron logging, trazabilidad y observabilidad
- [ ] Si existe dashboard, quedó restringido o protegido fuera de desarrollo
- [ ] Se agregaron tests relevantes para el flujo async
- [ ] No se convirtió la solución en batch masivo ni en mensajería enterprise

## 14. Notas importantes para Copilot

1. Usa JobRunr solo cuando el caso realmente requiera procesamiento asíncrono persistido.
2. No importes JobRunr directamente en `application`.
3. Modela la intención con puertos en `application.port.out`.
4. Implementa adaptadores JobRunr en `infrastructure.background`.
5. No dispares jobs directamente desde controllers.
6. Mantén `@Transactional` en Use Cases o servicios de aplicación, nunca en controllers.
7. No reemplaces el estado funcional del dominio por estado técnico del scheduler.
8. Mantén logging estructurado y trazabilidad en jobs y scheduling.
9. Si el servicio no necesita async persistido, no agregues JobRunr por defecto.
10. Si el caso parece batch masivo o mensajería enterprise, no fuerces este skill: escalar la decisión arquitectónica.
