# Trazabilidad CU -> Pantallas por Rol

## Objetivo

Este documento mapea las pantallas reales implementadas hoy en el frontend de Dimagraf contra:

- los roles habilitados en la aplicación
- las tareas operativas que resuelve cada pantalla
- los casos de uso documentados en `skills y analisis`
- los componentes concretos del código que hoy renderizan cada vista

Se usa como base para dos fines:

1. mantener trazabilidad UI entre análisis funcional y código
2. servir como guion para armar en Figma una página por rol con secciones por tarea

## Estado de sincronización con Figma

El archivo de Figma indicado por negocio es:

- `https://www.figma.com/design/E6BY4zpmFYWNBLxlATHo2y/Dise%C3%B1o-dimagraf`

En este entorno pude abrir el enlace público, pero no hay herramientas MCP de Figma disponibles para crear frames, autolayouts o pegar nodos directamente en el archivo. Por eso este documento deja cerrada la especificación lista para volcar a Figma cuando el conector esté habilitado.

## Fuentes usadas

- Código UI actual en `src/app/App.tsx` y `src/app/components/*`
- Skill `skills y analisis/skills/implementar-caso-uso-frontend/SKILL.md`
- Casos de uso transformados en `skills y analisis/Analisis/Caso-Uso-Transformados/*.md`

## Mapa global de roles y vistas

| Rol | Vista inicial en código | Vistas principales disponibles |
|---|---|---|
| Importaciones | `carpetas` | Carpetas, Arrivals, Vencimientos, detalle de carpeta, detalle de subcarpeta |
| Dirección | `dashboard` | Control gerencial, Auditoría de costos, Carpetas, Vencimientos |
| Comercial | `arrivals` | Arrivals, Carpetas, detalle de carpeta sin importes |
| Tesorería | `cashflow` | Flujo de caja, Vencimientos |
| Depósito | `reception` | Recepciones |
| Despachante | `carpetas` | Dashboard despachante, detalle operativo por carpeta |
| Administración | `admin-users` | Usuarios, Auditoría, Artículos, Proveedores |
| Design System | `admin-design-system` | Catálogo visual interno |

---

## Página: Importaciones

### Tarea: abrir y administrar carpetas de importación

- Pantalla: `OperatorDashboard`
- Componente: `src/app/components/OperatorDashboard.tsx`
- Acción principal: listar carpetas, filtrar por estado, crear carpeta, cargar artículos, exportar plantilla y navegar al detalle.
- Casos de uso cubiertos:
  - `CU-001 Gestionar Orden de Compra`
  - `CU-027 Cargar artículos de la OC en forma masiva`
- Qué debe mostrar en Figma:
  - barra de búsqueda y filtros
  - tabla principal de carpetas
  - acción de alta de carpeta
  - wizard de carga manual/masiva
  - acceso inline a subcarpetas

### Tarea: consultar y editar la carpeta madre

- Pantalla: `CarpetaDetail` > tabs `general`, `articulos`
- Componente: `src/app/components/CarpetaDetail.tsx`
- Acción principal: visualizar datos base de la OC, artículos, proveedor, montos, referencias y observaciones; editar según permisos.
- Casos de uso cubiertos:
  - `CU-001 Gestionar Orden de Compra`
  - `CU-027 Cargar artículos de la OC en forma masiva`
- Qué debe mostrar en Figma:
  - header de carpeta con proveedor y estado
  - tabs persistentes
  - formulario general
  - grilla de artículos con cantidades y saldos

### Tarea: registrar embarques parciales y navegar subcarpetas

- Pantalla: `CarpetaDetail` > tab `subcarpetas` y `SubcarpetaDetail`
- Componentes:
  - `src/app/components/CarpetaDetail.tsx`
  - `src/app/components/SubcarpetaDetail.tsx`
- Acción principal: crear embarques, distribuir artículos por apertura y consultar el detalle operativo de cada subcarpeta.
- Casos de uso cubiertos:
  - `CU-002 Registrar y actualizar embarque / subcarpeta`
- Qué debe mostrar en Figma:
  - lista de embarques por carpeta
  - CTA de nueva subcarpeta
  - tarjeta o tabla por embarque
  - vista detallada por subcarpeta

### Tarea: hacer seguimiento del proveedor y del preembarque

- Pantalla: `CarpetaDetail` > tab `produccion`
- Componente: `src/app/components/CarpetaDetail.tsx`
- Acción principal: registrar seguimiento productivo, fechas estimadas, observaciones y estado de avance previo al embarque.
- Casos de uso cubiertos:
  - `CU-003 Hacer seguimiento de producción pre-embarque`
- Qué debe mostrar en Figma:
  - timeline o bloque de hitos del proveedor
  - campos de seguimiento y observaciones
  - estado operativo visible

### Tarea: adjuntar y consultar documentación

- Pantalla: `CarpetaDetail` > tab `documentos` y `SubcarpetaDetail`
- Componentes:
  - `src/app/components/CarpetaDetail.tsx`
  - `src/app/components/SubcarpetaDetail.tsx`
- Acción principal: cargar, clasificar y consultar documentación por carpeta madre o subcarpeta.
- Casos de uso cubiertos:
  - `CU-004 Gestionar documentación del embarque`
- Qué debe mostrar en Figma:
  - listado de documentos por tipo
  - carga de archivo
  - distinción entre carpeta madre y embarque
  - visibilidad condicionada por rol

### Tarea: controlar tránsito, ETA y arribos

- Pantalla: `CommercialArrivals` accesible también para Importaciones
- Componente: `src/app/components/CommercialArrivals.tsx`
- Acción principal: consultar artículos en viaje agrupados por carpeta y subcarpeta, con ETA y transporte.
- Casos de uso cubiertos:
  - `CU-005 Gestionar tránsito, arribos y alertas operativas`
- Qué debe mostrar en Figma:
  - KPIs superiores
  - filtros por línea y búsqueda
  - agrupación madre -> hija -> artículos

### Tarea: consultar vencimientos próximos

- Pantalla: `VencimientosPage` en modo solo lectura
- Componente: `src/app/components/VencimientosPage.tsx`
- Acción principal: ver calendario de vencimientos y proyección, sin registrar pago.
- Casos de uso cubiertos:
  - `CU-009 Generar alertas de vencimiento de pago`
- Qué debe mostrar en Figma:
  - banner de vencimientos
  - calendario/listado de pagos próximos
  - estados sin edición

### Tarea: consultar aduana, costeo y pagos dentro de la carpeta

- Pantalla: `CarpetaDetail` > tabs `aduana`, `costeo`, `pagos`
- Componente: `src/app/components/CarpetaDetail.tsx`
- Acción principal: seguir el estado aduanero, ver costeo y revisar la situación de pagos desde la carpeta.
- Casos de uso cubiertos:
  - `CU-006 Gestionar despacho aduanero`
  - `CU-011 Registrar costeo y referencia SAP`
  - `CU-028 Gestionar instancia de Pagos de la carpeta`
- Qué debe mostrar en Figma:
  - bloque aduanero por subcarpeta
  - resumen de costos y coeficientes
  - solapa de pagos con vencimientos y estado

---

## Página: Dirección

### Tarea: monitorear KPIs ejecutivos

- Pantalla: `DirectorDashboard` > sección `kpi`
- Componente: `src/app/components/DirectorDashboard.tsx`
- Acción principal: ver contenedores en tránsito, monto comprometido, alertas críticas y desvíos.
- Casos de uso cubiertos:
  - `CU-005 Gestionar tránsito, arribos y alertas operativas`
  - `CU-011 Registrar costeo y referencia SAP`
  - `CU-012 Exportar reportes`
- Qué debe mostrar en Figma:
  - KPI strip ejecutivo
  - alertas críticas
  - gráficos resumidos
  - botón de exportación

### Tarea: auditar desvíos de costos

- Pantalla: `DirectorDashboard` > sección `audit`
- Componente: `src/app/components/DirectorDashboard.tsx`
- Acción principal: revisar variaciones entre coeficiente estimado y real, con acceso a la carpeta.
- Casos de uso cubiertos:
  - `CU-011 Registrar costeo y referencia SAP`
  - `CU-012 Exportar reportes`
- Qué debe mostrar en Figma:
  - tabla de auditoría de costos
  - indicador de variación
  - acceso directo a la carpeta

### Tarea: consultar carpetas y vencimientos sin edición

- Pantallas:
  - `OperatorDashboard` en modo consulta
  - `CarpetaDetail` readonly
  - `VencimientosPage` readonly
- Acción principal: Dirección consulta el detalle operativo sin mutar datos.
- Casos de uso cubiertos:
  - `CU-001`, `CU-002`, `CU-004`, `CU-005`, `CU-009`
- Qué debe mostrar en Figma:
  - mismos layouts operativos
  - estados de solo lectura
  - ocultamiento de acciones destructivas o de edición

---

## Página: Comercial

### Tarea: consultar arribos en tiempo real

- Pantalla: `CommercialArrivals`
- Componente: `src/app/components/CommercialArrivals.tsx`
- Acción principal: ver artículos en viaje y fechas de arribo sin exponer costos ni pagos.
- Casos de uso cubiertos:
  - `CU-008 Consultar Arribos (Comercial)`
  - `CU-005 Gestionar tránsito, arribos y alertas operativas`
- Qué debe mostrar en Figma:
  - KPI de artículos en viaje
  - agrupación por carpeta y embarque
  - filtros comerciales

### Tarea: consultar carpetas sin importes

- Pantallas:
  - `OperatorDashboard` con `hideImportes`
  - `CarpetaDetail` readonly con `hideImportes`
- Acción principal: navegar la operación evitando exponer información financiera.
- Casos de uso cubiertos:
  - `CU-001`
  - `CU-004`
  - `CU-005`
  - `CU-008`
- Qué debe mostrar en Figma:
  - misma estructura de carpetas
  - importes ocultos
  - acceso solo a información logística/comercial

---

## Página: Tesorería

### Tarea: proyectar flujo de caja

- Pantalla: `TreasuryCashFlow`
- Componente: `src/app/components/TreasuryCashFlow.tsx`
- Acción principal: agrupar obligaciones por carpeta y subcarpeta, proyectar egresos y alternar estado de pago.
- Casos de uso cubiertos:
  - `CU-009 Generar alertas de vencimiento de pago`
  - `CU-010 Confirmar pago al proveedor`
  - `CU-028 Gestionar instancia de Pagos de la carpeta`
- Qué debe mostrar en Figma:
  - KPI financieros
  - filtro por horizonte
  - agrupación carpeta -> subcarpeta -> obligaciones
  - acción para marcar pago emitido

### Tarea: operar el calendario de vencimientos

- Pantalla: `VencimientosPage` con edición habilitada
- Componente: `src/app/components/VencimientosPage.tsx`
- Acción principal: consultar vencimientos y cambiar estado del pago cuando corresponde.
- Casos de uso cubiertos:
  - `CU-009 Generar alertas de vencimiento de pago`
  - `CU-010 Confirmar pago al proveedor`
- Qué debe mostrar en Figma:
  - calendario/listado de vencimientos
  - CTA de cambio de estado
  - señalización de pagos críticos

---

## Página: Depósito

### Tarea: revisar agenda de recepciones

- Pantalla: `WarehouseReception` > vista `agenda`
- Componente: `src/app/components/WarehouseReception.tsx`
- Acción principal: listar embarques listos para control físico con proveedor, ETA, remito/SAP e incidencias.
- Casos de uso cubiertos:
  - `CU-007 Confirmar recepción en depósito`
  - `CU-015 Confirmar recepción e ingreso en Depósito`
- Qué debe mostrar en Figma:
  - tabla o cards de agenda
  - búsqueda por embarque/carpeta/proveedor
  - indicador de incidencias

### Tarea: hacer check-in físico del embarque

- Pantalla: `WarehouseReception` > vista `checkin`
- Componente: `src/app/components/WarehouseReception.tsx`
- Acción principal: confirmar cantidades recibidas, detectar discrepancias y registrar incidentes.
- Casos de uso cubiertos:
  - `CU-007 Confirmar recepción en depósito`
  - `CU-015 Confirmar recepción e ingreso en Depósito`
- Qué debe mostrar en Figma:
  - detalle del embarque
  - cantidades esperadas vs recibidas
  - modal o formulario de incidencia
  - confirmación de recepción

---

## Página: Despachante

### Tarea: cargar datos aduaneros por embarque

- Pantalla: `DispatcherDashboard` y modal `EditModal`
- Componente: `src/app/components/DispatcherDashboard.tsx`
- Acción principal: registrar canal, tipo de despacho, gastos, VEP y fechas por subcarpeta.
- Casos de uso cubiertos:
  - `CU-014 Cargar datos de despacho aduanero (Despachante)`
  - `CU-006 Gestionar despacho aduanero`
- Qué debe mostrar en Figma:
  - dashboard de carpetas asignadas
  - detalle por carpeta
  - tabla de embarques
  - modal de edición aduanera

### Tarea: consultar estado del despacho cargado

- Pantalla: `DispatcherDashboard` > `DetailView`
- Componente: `src/app/components/DispatcherDashboard.tsx`
- Acción principal: ver qué embarques ya tienen datos completos y cuáles están pendientes.
- Casos de uso cubiertos:
  - `CU-014 Cargar datos de despacho aduanero (Despachante)`
- Qué debe mostrar en Figma:
  - badges de canal
  - estado completo/incompleto
  - CTA de cargar o editar embarque

---

## Página: Administración

### Tarea: administrar usuarios y roles

- Pantalla: `AdminDashboard` > tab `admin-users`
- Componente: `src/app/components/AdminDashboard.tsx`
- Acción principal: alta, edición, baja y multirol de usuarios.
- Casos de uso cubiertos:
  - `CU-013 Administrar maestros y configuración`
- Qué debe mostrar en Figma:
  - tabla responsive de usuarios
  - modal de alta/edición
  - selección multirol
  - estado activo/inactivo

### Tarea: auditar movimientos del sistema

- Pantalla: `AdminDashboard` > tab `admin-audit`
- Componente: `src/app/components/AdminDashboard.tsx`
- Acción principal: consultar el log de auditoría funcional.
- Casos de uso cubiertos:
  - `CU-013 Administrar maestros y configuración`
- Qué debe mostrar en Figma:
  - tabla de auditoría
  - filtros por entidad/usuario
  - detalle expandible

### Tarea: mantener artículos maestros

- Pantalla: `AdminDashboard` > tab `admin-articles`
- Componente: `src/app/components/AdminDashboard.tsx`
- Acción principal: administrar el catálogo base de artículos.
- Casos de uso cubiertos:
  - `CU-013 Administrar maestros y configuración`
- Qué debe mostrar en Figma:
  - tabla de artículos
  - acciones CRUD
  - validaciones mínimas de catálogo

### Tarea: mantener proveedores

- Pantalla: `AdminDashboard` > tab `admin-providers`
- Componente: `src/app/components/AdminDashboard.tsx`
- Acción principal: administrar ficha de proveedor.
- Casos de uso cubiertos:
  - `CU-013 Administrar maestros y configuración`
- Qué debe mostrar en Figma:
  - tabla de proveedores
  - edición de datos operativos
  - espacio para futuros parámetros documentales del bloque VAL

---

## Página: Sistema y transversales

### Tarea: autenticar acceso

- Pantalla: `LoginScreen`
- Componente: `src/app/components/LoginScreen.tsx`
- Acción principal: ingresar por usuario, resolver acceso por rol y habilitar preview de design system según usuario.
- Fuente funcional relacionada:
  - control de acceso por rol descrito en análisis refinable

### Tarea: recuperar acceso

- Pantalla: `PasswordRecoveryPage`
- Componente: `src/app/components/PasswordRecoveryPage.tsx`
- Acción principal: restablecer la contraseña desde flujo de recuperación.

### Tarea: configurar perfil y reportes

- Pantalla: `AccountSettingsPage`
- Componente: `src/app/components/AccountSettingsPage.tsx`
- Acción principal: editar perfil, cambiar contraseña y configurar reportes por correo.
- Casos de uso relacionados:
  - `CU-012 Exportar reportes`
  - `CU-013 Administrar maestros y configuración`

### Tarea: recibir notificaciones y estados de error

- Pantallas:
  - `NotificationPanel`
  - `ErrorStatePage`
  - `LoadingState`
- Acción principal: mostrar feedback global, alertas y manejo de estados no felices.

---

## Cobertura pendiente o parcial detectada

- El código actual no expone todavía una UI dedicada para el bloque VAL como flujo independiente, aunque parte del soporte documental existe en los casos `CU-016` a `CU-026`.
- Administración de proveedores todavía no refleja en UI todos los parámetros de análisis documental mencionados en la documentación funcional.
- Tesorería no navega hoy al detalle de carpeta desde el layout principal, aunque la lógica de pagos existe dentro de `CarpetaDetail`.
- La sincronización visual en Figma queda pendiente hasta contar con herramientas MCP de Figma con escritura de autolayout.

## Recomendación para armado en Figma

Crear una página por rol con este orden interno:

1. portada del rol
2. navegación principal
3. una sección por tarea
4. detalle de estados vacíos, loading y error
5. modales y overlays propios del rol

Esto permite que Figma siga exactamente el comportamiento actual del código, sin mezclar vistas de roles distintos en una sola página.