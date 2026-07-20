# Patrones UI e Interacciones del Frontend

## Objetivo

Este documento define las reglas visuales y de comportamiento del frontend completo de Dimagraf.

No cubre solo modales. Debe servir para barrer una pantalla nueva o existente desde:

- acceso y login
- layout general y navegacion
- busqueda, filtros y tablas
- formularios, estados y feedback
- modales, wizard y dialogs
- reglas por rol y por pantalla

La intencion es que, antes de ajustar UI, quede claro:

- que componentes ya existen
- cual es su patron visual
- como se comportan
- cuando una accion es primaria, secundaria o destructiva
- que diferencias hay entre edicion, consulta y solo lectura

## Regla de implementacion

No crear componentes nuevos para resolver variaciones visuales menores.

No usar `!important`.

Cuando haga falta construir o extender UI:

- reutilizar `AppButton`, `FormField`, `SearchField`, `FilterToolbar`, `AppDialog`, `StatusBadge`, `MetricCardGrid`, `ResponsiveTable` y `AppSelect*`
- componer con primitives existentes de shadcn ya presentes en el repo
- reutilizar tokens y helpers de `chromeStyles.ts` y `theme.ts`
- tocar primero layout local y variantes antes que introducir una nueva abstraccion
- mantener el mismo lenguaje entre desktop y mobile

## Fuentes de verdad tecnica

- tokens, shell, tablas, header, footer y helpers: `src/app/components/chromeStyles.ts`
- colores, radios y semantica de tema: `src/app/components/theme.ts`
- botones: `src/app/components/AppButton.tsx`
- formularios: `src/app/components/FormField.tsx`
- busqueda: `src/app/components/SearchField.tsx`
- filtros: `src/app/components/FilterToolbar.tsx`
- select del sistema: `src/app/components/ui/select.tsx`
- dialog base: `src/app/components/AppDialog.tsx`
- layout y navegacion por rol: `src/app/components/Layout.tsx`
- trazabilidad de pantallas: `docs/Ui/Trazabilidad-CU-Pantallas.md`

---

## Capa 1: Acceso y autenticacion

## `LoginScreen.tsx`

### Patron visual

- pantalla centrada con card unica
- fondo con textura repetida y wash verde suave
- header superior fijo con marca
- card con borde fino, radio amplio y blur ligero

### Interacciones obligatorias

- usuario y contrasena viven en campos separados con label arriba
- el foco cambia el borde interno al color de marca
- el toggle de ojo solo cambia visibilidad de contrasena, no altera layout
- el link `Olvide mi contrasena` abre recuperacion en una nueva ventana con usuario precargado si existe texto
- los chips de acceso rapido disparan login directo como atajo de demo
- los errores de acceso aparecen como toast fijo arriba a la derecha, no dentro del card

### Reglas de inputs en acceso

- labels en mayuscula chica
- placeholder solo orienta, nunca reemplaza label
- el borde de foco debe ser de marca, no azul de navegador
- los campos no llevan iconos a la izquierda salvo casos ya definidos como busqueda

## `PasswordRecoveryPage.tsx`

### Patron visual

- mismo lenguaje de fondo y card que login
- boton `Volver` arriba del encabezado del card
- mensaje de estado como toast flotante

### Interacciones obligatorias

- si el usuario existe, el mensaje confirma mail real
- si no existe, el mensaje igual confirma envio a una direccion derivada para no exponer validacion de usuarios
- `Volver` intenta primero cerrar o devolver foco a la ventana original; si no puede, usa historial o vuelve a la ruta principal

## `ErrorStatePage.tsx`

### Patron visual

- card centrada
- icono de error dentro de circulo tonal
- titulo, descripcion y dos acciones

### Interacciones obligatorias

- variante `404`, `500` y generica
- accion primaria para reintentar
- accion secundaria para volver al inicio

---

## Capa 2: Shell general y navegacion

## `Layout.tsx`

### Sidebar desktop

- ancho expandido de 240 px
- ancho colapsado de 60 px
- estado colapsado conservado dentro de la sesion
- fondo glass claro con blur, borde derecho y sombra suave

### Interacciones de sidebar

- el boton de colapsar no cambia la navegacion, solo la densidad visual
- si el sidebar esta colapsado, se muestran solo iconos con `title`
- el item activo usa fondo verde suave y texto de marca
- hover de item usa wash sutil, no cambia jerarquia

### Navegacion por rol

- cada rol ve solo sus items permitidos
- al cambiar de rol se navega a la vista inicial de ese rol
- `carpeta-detail` y `subcarpeta-detail` siguen marcando `carpetas` como seccion activa
- en mobile la navegacion se reduce y usa labels abreviados cuando hace falta

### Menu de perfil y rol

- el avatar muestra iniciales del usuario
- el perfil da acceso a configuracion y logout
- el selector de rol nunca se mezcla con acciones de contenido

### Campana y notificaciones

- la campana abre panel anclado a su posicion en desktop
- en mobile se comporta como drawer lateral
- el badge de no leidas se actualiza en tiempo real

### Breadcrumb

- se usa en paginas de detalle
- no es obligatorio en dashboards principales

---

## Capa 3: Reglas base de componentes

## Botones

### Fuente de verdad

- `AppButton.tsx`

### Variantes

- `primary`: accion principal de avanzar, guardar, crear, confirmar o enviar
- `secondary`: cancelar, volver atras, omitir, cerrar con intencion explicita
- `tertiary`: accion de baja prominencia, iconografica o de soporte
- `danger`: accion destructiva o de alto impacto
- `danger-soft`: destructiva no terminal o seleccion de estado riesgoso
- `success-soft`: confirmacion positiva secundaria o seleccion de estado saludable
- `ghost-light` y `solid-light`: uso puntual sobre fondos de color

### Reglas de convivencia

- una sola accion primaria por grupo visual
- `Cancelar` dentro de modales usa siempre secundario
- acciones destructivas no compiten con la accion primaria salvo confirmacion explicita
- icon-only se reserva para cerrar, editar, borrar puntual o acciones compactas

### Tamanos

- `sm`: acciones compactas de tabla o toolbar
- `md`: accion estandar
- `lg`: acciones de peso medio
- `xl`: CTA principal de formularios de acceso o confirmacion grande

### Estados

- hover cambia color, borde o fondo sin mover layout
- disabled baja opacidad y elimina affordance de hover
- loading, si existe en una pantalla, debe preservar ancho y altura del boton

## Inputs de texto

### Fuente de verdad

- `FormField.tsx`
- `AppInput` dentro de `FormField.tsx`

### Regla visual

- altura consistente con selects del sistema
- fondo claro o parchment segun contexto
- borde fino neutro
- foco en color de marca
- radio medio o pill segun componente base

### Regla funcional

- label siempre por encima
- help text y error text viven debajo del control
- `aria-invalid` o equivalente debe reflejar error real
- placeholder solo ayuda a completar formato o ejemplo

## Labels

- labels operativos cortos en mayuscula chica cuando el componente ya sigue ese patron
- no alternar estilos de label dentro de un mismo formulario
- si hay error, el color del label puede virar a danger, pero no cambiar de tamano

## Selects y desplegables

### Fuente de verdad

- `ui/select.tsx`
- wrappers `AppSelectTrigger`, `AppSelectContent`, `AppSelectItem`

### Regla visual

- los selects deben verse como input material/tailwind del sistema
- misma altura visual que input equivalente
- borde default igual al de los inputs operativos: contorno inset de `controlBorder`, sin reemplazarlo por un gris alternativo ni por un borde externo mas pesado
- en filtros y formularios operativos el radio base es medio `10px`; el radio pill queda reservado al buscador u otros casos donde el patron ya lo defina
- el estado focus u open conserva la misma geometria del campo y solo cambia a borde de marca con halo suave
- trigger con chevron del sistema
- contenido en panel claro, borde fino y sombra consistente

### Regla funcional

- abrir con click sobre el trigger completo
- el placeholder vive dentro del trigger y desaparece al seleccionar
- si el select esta en modal, el content debe respetar z-index del flujo
- no volver a usar `<select>` nativo en modales o formularios nuevos salvo caso tecnico justificado

## Inputs de fecha y calendario

### Fuente de verdad

- `AppCalendarPopoverPanel.tsx`
- `AppCalendarTriggerField.tsx`
- `AppDateField.tsx`
- `ui/calendar.tsx`
- `ui/popover.tsx`

### Referencia visual adoptada

- material: el date picker se compone de `field` editable + `calendar` en popover, no de un boton suelto disfrazado de input
- shadcn/tailwind: el picker se construye por composicion `Popover + Calendar`, manteniendo el campo con look de input del sistema

### Regla visual

- el campo cerrado se ve como cualquier otro input del sistema: mismo alto, mismo borde, mismo foco y mismo color de texto
- `ETA desde` y `ETA hasta` deben compartir exactamente el mismo shell que los desplegables del toolbar: fondo `surface`, radio medio, altura compacta y borde inset `controlBorder`
- el buscador no es la referencia de radio para fechas ni selects; solo comparte el color de borde del sistema
- el icono de calendario vive dentro del campo, no en un bloque separado
- el chevron de apertura vive al extremo derecho como affordance secundaria
- el popover debe nacer visualmente desde el chevron del campo y reposicionarse arriba o abajo segun el viewport
- el header del calendario es liviano: flechas laterales para navegar meses, nombre del mes centrado y acceso directo solo al año
- no agregar un segundo input o un bloque de filtros dentro del calendario para elegir mes; el salto de mes ocurre con las flechas

### Regla funcional

- el usuario puede escribir manualmente la fecha en formato local `DD/MM/AAAA` o en formato ISO `AAAA-MM-DD`
- al perder foco o confirmar, el campo normaliza el valor al formato interno del sistema
- el calendario es una segunda via de seleccion, no la unica
- el año puede saltarse de forma directa desde su selector dedicado; el mes se recorre con las flechas del header
- si el valor cambia desde el calendario, el input se actualiza de inmediato

### Regla de implementacion

- no usar `input type="date"` nativo en nuevas pantallas si rompe consistencia visual o no abre el calendario esperado
- no delegar la UX de mes/año al caption nativo del browser o del calendar si no respeta el lenguaje del sistema
- si hace falta reutilizar el patron, instanciar `AppDateField` antes que volver a componer `Popover + Calendar` desde cero
- si una pantalla necesita selector de mes/año sin campo de fecha, reutilizar `AppCalendarTriggerField` junto con `AppCalendarPopoverPanel` para mantener el mismo shell y la misma jerarquia visual

## Checkboxes y toggles

- se usan para habilitar bloques opcionales o listas de reportes
- el label clickable debe envolver al control cuando la accion sea simple
- el estado activo puede colorear el contenedor para reforzar seleccion

## SearchField

### Fuente de verdad

- `SearchField.tsx`

### Regla visual

- icono de busqueda siempre a la izquierda
- input en una sola pieza, sin borde azul del navegador
- variante `default` y `compact`

### Regla funcional

- busqueda inmediata, sin debounce
- normalizacion de acentos y mayusculas para matching en espanol
- placeholder contextual por pantalla

## FilterToolbar

### Fuente de verdad

- `FilterToolbar.tsx`

### Regla visual

- barra superior con `SearchField` a la izquierda y boton de filtros a la derecha
- al expandir, los chips viven en una superficie separada con punta visual
- chips activos usan color tonal y borde del filtro

### Regla funcional

- boton de filtro alterna expandido/contraido
- cada chip representa seleccion simple, no multiseleccion
- el recuento por chip puede ser fijo o derivado
- acciones extra o hijos aparecen debajo de los chips, separadas por divider si aplica

## Badges, estados y chips

### Fuente de verdad

- `StatusBadge.tsx`
- `NeonBadge.tsx`

### Regla visual

- estados con borde fino y fondo tonal suave
- tamanos `sm` y `md`
- colores semanticos: neutral, brand, success, warning, danger, info, violet

### Regla funcional

- un badge informa estado, no dispara acciones por si mismo
- los chips de filtro si son interactivos y deben diferenciarse de un badge estatico
- `CanalBadge` y `NeonBadge` son traducciones visuales de estados de negocio, no nuevos sistemas de color

## Cards y superficies

### Fuente de verdad

- `SurfaceCard.tsx`
- `SectionCard.tsx`
- `MetricCardGrid.tsx`

### Regla visual

- una card agrupa una unidad de lectura o accion
- borde fino y sombra minima o nula segun densidad de pantalla
- el contenido nunca debe quedar pegado al borde

## KPI cards

- numero fuerte a la izquierda
- label abajo o asociado
- icono a la derecha en circulo tonal
- en mobile cae a 2 columnas o 3 si el set tiene exactamente 3 items

## Tablas y listas responsivas

### Fuente de verdad

- `ResponsiveTable.tsx`
- `DataTable.tsx`
- helpers de tabla en `chromeStyles.ts`

### Regla desktop

- `thead` en mayuscula chica, color muteado
- divisores suaves por fila
- acciones al extremo derecho
- si hay summary sticky, su fondo debe mantenerse legible

### Regla mobile

- una fila se convierte en card
- campos primarios arriba
- secundarios en grilla de 2 columnas o stacking simple

### Regla funcional

- row click solo cuando la fila navega o expande
- acciones puntuales deben seguir disponibles como boton propio
- el empty state se muestra centrado y con texto muteado

## Paginacion

### Fuente de verdad

- `AppPagination.tsx`

### Regla funcional

- solo aparece si hay mas de una pagina
- muestra pagina actual y total
- botones prev/next se deshabilitan en extremos

## Notificaciones

### Fuente de verdad

- `NotificationPanel.tsx`
- estado en `App.tsx`

### Regla visual

- panel desktop fijo al borde superior derecho, anclado a la campana
- mobile como panel lateral ocupando alto completo
- cada item usa color e icono por tipo

### Regla funcional

- orden descendente por timestamp
- `Marcar todas como leidas` aparece solo si hay pendientes
- click sobre una notificacion la marca como leida
- cerrar panel no cambia el estado de lectura
- el footer del panel resume totales y no leidas

## Loading states

### Fuente de verdad

- `LoadingState.tsx`

### Regla visual

- skeleton con shimmer
- preview de header, toolbar y tabla
- no usar spinners aislados donde ya existe skeleton estructural

### Regla funcional

- debe anticipar la estructura real de la pantalla
- si hay carga por cambio de vista, la transicion no debe romper layout

## Calendario de vencimientos

### Fuente de verdad

- `VencimientosCalendar.tsx`

### Regla visual

- modo calendario mensual y modo lista
- colores por urgencia y estado de pago
- panel de detalle lateral en desktop y hoja inferior en mobile

### Regla funcional

- click en fecha abre detalle de pagos del dia
- si el rol puede gestionar pagos, la accion de marcar pago aparece inline
- filtros por tipo y busqueda se aplican sobre la misma fuente de datos

---

## Capa 4: Patrones de formularios

## Distribucion

- maximo 2 campos legibles por fila en desktop
- 1 columna en mobile
- textarea, observaciones y bloques explicativos van full-width
- no comprimir 3 campos en una fila si baja legibilidad

## Jerarquia de campos

- primero datos estructurales
- luego dependencias y metadatos
- despues observaciones o notas libres
- finalmente acciones

## Campos dependientes

- un selector condicionado por otro campo debe vivir cerca de su disparador
- si aparece por una seleccion, no debe romper la lectura del resto del formulario
- cuando un estado vacio y uno completo sean distintos, disenar ambos por separado

## Solo lectura vs edicion

- readonly conserva la estructura visual, pero quita affordance de accion
- ocultar o deshabilitar CTA de mutacion segun rol y contexto
- no mezclar controles editables con campos bloqueados sin explicacion

---

## Capa 5: Patrones de modales, dialogs y wizard

## Modal base

### Shell

- overlay centrado con blur suave
- un solo contenedor principal por tarea
- borde fino, radio amplio y sombra suave
- en mobile reduce margen lateral, no cambia de lenguaje

### Header

- titulo principal a la izquierda
- subtitulo solo si agrega contexto operativo
- cierre iconografico arriba a la derecha
- el cierre no reemplaza `Cancelar` o `Volver`

### Body

- formularios cortos en 2 columnas desktop y 1 mobile
- estados vacios o de exito centrados y con menos ruido
- si el modal tiene altura fija, el body debe crecer con `flex: 1`

### Footer

- pegado abajo del modal
- `Cancelar` secundario, `Guardar` o `Confirmar` primario
- una sola linea de acciones salvo necesidad real de doble grupo

## Wizard modal

- header y shell constantes
- stepper superior fijo
- footer anclado abajo
- `Volver` arriba del contenido del paso, no en footer
- no abrir un wizard dentro de otro

## Modal de resultado

- un solo bloque visual
- mensaje corto, explicacion y siguiente accion
- no duplicar `Cerrar`, `Cancelar` y `Aceptar` con la misma intencion

## Modal con dropzone

- estado vacio centrado
- estado con archivo cargado en layout horizontal o compacto
- metadata del archivo separada del area de drop
- CTA de adjuntar visible cuando no hay archivo o cuando se reemplaza explicitamente

---

## Capa 6: Reglas globales de interaccion

## Busqueda

- siempre filtra en vivo
- siempre mantiene el mismo lenguaje visual sin importar el rol
- al borrar el texto, vuelve a mostrarse el universo completo del contexto

## Filtros

- abrir filtro no navega ni recarga
- el estado expandido pertenece a la pantalla actual
- los chips muestran la seleccion actual de forma inequivoca

## Tablas

- una tabla lista o resume; no debe transformarse en formulario salvo caso puntual
- la accion principal sobre una fila debe ser clara: navegar, expandir o editar
- si la fila no es clickeable, la accion debe vivir en un boton separado

## Estados vacios

- texto claro, tono muteado, centrado
- si corresponde accion, una sola CTA clara
- no llenar vacios con texto explicativo excesivo

## Feedback de exito o error

- usar bloques o toasts segun duracion e importancia
- error bloqueante vive cerca del flujo que se corta
- exito resumido debe permitir continuar sin releer toda la pantalla

## Responsive

- formularios bajan a una columna
- tablas pasan a cards o listas apiladas
- sidebars y paneles se simplifican antes de crear nuevas pantallas

---

## Capa 7: Inventario por pantalla y por rol

## Flujo de entrada y global

### `LoginScreen.tsx`

- ingreso principal
- acceso rapido por usuario demo
- recuperacion de contrasena

### `PasswordRecoveryPage.tsx`

- recuperacion externa
- confirmacion por toast

### `Layout.tsx`

- shell comun para todos los roles autenticados
- sidebar, rol, perfil, notificaciones

### `AccountSettingsPage.tsx`

- perfil y roles visibles
- cambio de contrasena
- configuracion de reportes automaticos
- preview tabular de reportes

### `ErrorStatePage.tsx`

- pantalla fallback de error

### `LoadingState.tsx`

- skeleton de carga global

## Rol: Importaciones

### `OperatorDashboard.tsx`

#### Vista principal: Carpetas

- toolbar con busqueda y filtros
- tabla principal de carpetas
- acceso a crear carpeta
- acceso a detalle y subcarpetas

#### Modal: `Nueva Carpeta de Importacion`

- wizard principal
- shell unico para todos los pasos
- header y stepper constantes
- footer fijo abajo

#### Reglas del wizard

- paso 1 con pares de datos generales y observaciones full-width
- paso 2 selecciona modo de carga
- paso 3 manual separa formulario y tabla
- paso 3 masivo usa dropzone y CTA claras
- pasos finales muestran resultado sin ruido

### `CarpetaDetail.tsx`

#### Tabs principales

- `general`
- `articulos`
- `produccion`
- `subcarpetas`
- `aduana`
- `costeo`
- `documentos`
- `pagos`

#### Patron global

- el header de carpeta es persistente
- las tabs viven como navegacion secundaria del mismo objeto
- los permisos por rol ocultan o limitan mutacion segun contexto

#### Modales y flujos relevantes

- `Editar datos de cabecera`: edicion simple, pares y observaciones full-width
- `Carga masiva de articulos`: dropzone, textarea y preview
- `Adjuntar anexo`: wizard corto de archivo, clasificacion y analisis
- `Editar produccion y pre-embarque`: pares y bloque de control por articulos
- `Editar aduana`: secciones por pares y bloque de canal aduanero por toggles
- `Imputacion contable de saldo a favor`: formulario con resumen y estado final de exito
- `Editar costeo`: coeficientes en par y observaciones
- `Confirmar giro de fondos`: confirmacion corta con dos campos
- `Registrar Compromiso de Pago`: concepto, condicional de otro concepto, moneda y estado con selects del sistema

### `SubcarpetaDetail.tsx`

#### Tabs principales

- `transito`
- `aduana`
- `costeo`
- `documentos`
- `recepcion`

#### Patron global

- misma logica de detalle persistente que carpeta madre
- lectura por subcarpeta o apertura operativa
- documentos y estados deben respetar el mismo lenguaje que `CarpetaDetail`

### `CommercialArrivals.tsx`

- vista de arribos y transito
- KPIs arriba
- filtros y busqueda en toolbar
- filtros base: estado, linea, importador, orden ETA y rango ETA
- el rango `ETA desde / ETA hasta` se usa para acotar cargas por ventana de llegada cuando el usuario necesita concentrarse en una franja temporal
- agrupacion madre -> hija -> articulos

### `VencimientosPage.tsx`

- banner superior
- calendario/listado de obligaciones
- solo lectura para importaciones

## Rol: Direccion

### `DirectorDashboard.tsx`

#### Secciones

- `KPIs`
- `Auditoria Costos`

#### Patron visual

- header con control segmentado y accion `Exportar`
- strip de metricas arriba
- alertas criticas destacadas en cards de borde tonal
- graficos simples dentro de cards

#### Interacciones

- cambio de segmento no navega a otra pantalla, alterna contenido interno
- `Ver carpeta` navega al detalle en modo consulta
- la auditoria combina busqueda, tabla y chips de variacion

### Vistas compartidas en readonly

- `OperatorDashboard` en consulta
- `CarpetaDetail` readonly
- `VencimientosPage` readonly

#### Regla de readonly para Direccion

- mantener estructura operativa
- quitar mutaciones
- conservar estados y trazabilidad

## Rol: Comercial

### `CommercialArrivals.tsx`

- consulta de cargas en viaje y ETA
- sin costos ni pagos

### `OperatorDashboard` y `CarpetaDetail` con `hideImportes`

- misma estructura que importaciones
- ocultamiento de montos y datos financieros

#### Regla de Comercial

- se ve la operacion, no la capa financiera

## Rol: Tesoreria

### `TreasuryCashFlow.tsx`

#### Patron visual

- banner superior con `Exportar`
- KPI strip
- toolbar con busqueda y horizonte temporal via chips
- cards madre que contienen subcarpetas y obligaciones

#### Interacciones

- el horizonte se selecciona con chips simples
- la busqueda filtra por carpeta, subcarpeta o proveedor
- cada subcarpeta puede colapsar o expandir obligaciones
- el estado del pago se puede alternar dentro del mismo flujo

### `VencimientosPage.tsx`

- misma estructura del calendario
- edicion habilitada para marcar pagos segun permiso

#### Regla de Tesoreria

- la accion financiera vive en el estado del pago, no en cambios operativos del embarque

## Rol: Deposito

### `WarehouseReception.tsx`

#### Pantalla principal

- recepciones pendientes o en curso
- lectura de articulos y cantidades

#### Modal: `Registro de Incidencia`

- `Tipo de incidencia` con select del sistema
- `Cantidad afectada` como numero
- `Comentarios` full-width
- footer con `Cancelar` secundario y `Registrar Incidencia` danger

#### Regla de Deposito

- la accion critica es reportar desvio fisico, no editar datos administrativos

## Rol: Despachante

### `DispatcherDashboard.tsx`

#### Pantalla principal

- foco en datos de aduana y despacho

#### Modal: `Datos de despacho`

- `Canal aduana` como bloque de seleccion
- `Despacho / ZFI / ZFE` con select del sistema
- `Gastos` + `VEP` en par
- `Fecha oficializacion` + `Fecha salida` en par

#### Regla de Despachante

- puede intervenir la capa aduanera, no el resto del ciclo comercial/financiero completo

## Rol: Administracion

### `AdminDashboard.tsx`

#### Secciones

- `Usuarios`
- `Auditoria`
- `Articulos`
- `Proveedores`

#### Modales principales

- `Nuevo Usuario` / `Editar Usuario`: formulario corto por pares y roles asignados
- `Eliminar Usuario`: confirmacion destructiva
- `Nuevo Articulo` / `Editar Articulo`: campos base, linea, U.M. y estado
- `Nuevo Proveedor` / `Editar Proveedor`: datos base, incoterm, moneda y tiempos

#### Regla de Administracion

- formularios administrativos cortos
- acciones claras y sin densidad operativa excesiva
- los selects deben seguir el mismo patron del resto del sistema

## Rol: Design System

### `DesignSystemPage.tsx`

- catalogo interno de componentes y variantes
- referencia visual, no flujo de negocio

#### Regla

- cualquier nuevo patron visual del producto debe poder rastrearse o incorporarse aca despues de validarse en un flujo real

---

## Capa 8: Reglas de barrido para nuevas pantallas

Antes de tocar una pantalla nueva:

1. Identificar si es acceso, dashboard, lista, detalle, formulario, modal, wizard, resultado o configuracion.
2. Ver si ya existe un primitivo equivalente antes de escribir estilos nuevos.
3. Reusar `SearchField` y `FilterToolbar` si hay busqueda o filtros.
4. Reusar `AppSelect*` si hay desplegables.
5. Si hay formulario, empezar con grilla de 2 columnas desktop y 1 mobile.
6. Si hay modal, anclar footer abajo y mantener shell unico.
7. Si hay readonly por rol, conservar layout y quitar mutaciones.
8. Si hay estado vacio, disenar vacio y estado con datos por separado.
9. No introducir una tercera accion principal en un mismo bloque.
10. Validar siempre contra el rol y el caso de uso real, no solo contra la pantalla aislada.

## Checklist de validacion

- ¿La pantalla respeta el shell y los tokens del sistema?
- ¿La accion primaria es unica y evidente?
- ¿Los inputs, selects y botones mantienen altura y lenguaje consistentes?
- ¿Los filtros se abren y se leen como el patron compartido?
- ¿Las tablas bajan bien a mobile?
- ¿Los modales tienen footer pegado abajo?
- ¿`Cancelar` sigue siendo secundario?
- ¿Readonly y editable se distinguen por permisos sin romper layout?
- ¿El estado vacio tiene intencion clara?
- ¿Se evito crear componentes nuevos o usar `!important`?

## Componentes que deben revisarse primero en cualquier futura barrida

- `Layout.tsx`
- `AppButton.tsx`
- `FormField.tsx`
- `SearchField.tsx`
- `FilterToolbar.tsx`
- `ui/select.tsx`
- `AppDialog.tsx`
- `StatusBadge.tsx`
- `MetricCardGrid.tsx`
- `ResponsiveTable.tsx`
- `chromeStyles.ts`
- `theme.ts`

---

## Matriz de componentes

## Matriz: primitives compartidos

| Componente | Archivo | Estados principales | Variantes / notas |
|---|---|---|---|
| `AppButton` | `src/app/components/AppButton.tsx` | default, hover, disabled, icon-only | `primary`, `secondary`, `tertiary`, `danger`, `danger-soft`, `success-soft`, `ghost-light`, `solid-light`; tamaños `sm`, `md`, `lg`, `xl` |
| `FormField` | `src/app/components/FormField.tsx` | default, help, error | wrapper de label + control + texto auxiliar; se usa con input, textarea y select |
| `AppInput` | `src/app/components/FormField.tsx` | default, focus, invalid, disabled | input base del sistema, alineado en altura con selects |
| `AppDateField` | `src/app/components/AppDateField.tsx` | empty, typed, selected, focus, popover open | campo editable + calendario; mes/año con selects del sistema |
| `SearchField` | `src/app/components/SearchField.tsx` | default, focus, compact | tamaño `default` y `compact`; normaliza acentos y mayúsculas |
| `FilterToolbar` | `src/app/components/FilterToolbar.tsx` | collapsed, expanded, chip active, chip inactive | admite `trailingActions`, `children` y counts por opción |
| `AppDialog` | `src/app/components/AppDialog.tsx` | open, close, body-scroll, form mode | shell base de modal; header, body y footer consistentes |
| `AppPagination` | `src/app/components/AppPagination.tsx` | enabled, disabled, single-page hidden | navegación simple prev/next |
| `StatusBadge` | `src/app/components/StatusBadge.tsx` | default | tonos `neutral`, `brand`, `success`, `warning`, `danger`, `info`, `violet`; tamaños `sm`, `md` |
| `NeonBadge` | `src/app/components/NeonBadge.tsx` | default | traduce estados de negocio de carpeta |
| `CanalBadge` | `src/app/components/NeonBadge.tsx` | default | `Verde`, `Rojo`, `Pendiente` |
| `MetricCardGrid` | `src/app/components/MetricCardGrid.tsx` | desktop grid, mobile compact | cards KPI con icono tonal |
| `ResponsiveTable` | `src/app/components/ResponsiveTable.tsx` | desktop table, mobile cards, empty | columnas primarias/secundarias |
| `SurfaceCard` | `src/app/components/SurfaceCard.tsx` | default | superficie neutra para agrupar contenido |
| `SectionCard` | `src/app/components/SectionCard.tsx` | default | card de sección, más semántica que `SurfaceCard` |
| `InfoField` | `src/app/components/InfoField.tsx` | default | lectura simple label/valor |
| `TransportModeIcon` | `src/app/components/TransportModeIcon.tsx` | marítimo, terrestre, aéreo | no interactivo |
| `WelcomeBanner` | `src/app/components/WelcomeBanner.tsx` | default | header superior con título, subtítulo y acciones |

## Matriz: controles shadcn usados como sistema

| Componente | Archivo | Estados principales | Variantes / notas |
|---|---|---|---|
| `Select` | `src/app/components/ui/select.tsx` | closed, open, selected, disabled | usar con `AppSelectTrigger`, `AppSelectContent`, `AppSelectItem` en flujos del producto |
| `Calendar` | `src/app/components/ui/calendar.tsx` | current month, selected day, outside day, disabled day | base para selector de fecha/calendario tipo material |
| `Popover` | `src/app/components/ui/popover.tsx` | open, close | contenedor para selects avanzados y picker flotante |
| `Tabs` | `src/app/components/ui/tabs.tsx` | active, inactive | navegación secundaria cuando no existe tab flat local |
| `Alert` | `src/app/components/ui/alert.tsx` | info, warning | usado para mensajes de contexto dentro de vistas |

## Matriz: shell y feedback

| Componente | Archivo | Estados principales | Variantes / notas |
|---|---|---|---|
| `Layout` | `src/app/components/Layout.tsx` | sidebar open, sidebar collapsed, mobile nav, role menu open, notifications open | navegación y shell global por rol |
| `NotificationPanel` | `src/app/components/NotificationPanel.tsx` | unread, read, empty, desktop anchored, mobile drawer | tipos `success`, `info`, `warning`, `error` |
| `LoadingState` | `src/app/components/LoadingState.tsx` | shimmer, pulse | skeleton global |
| `ErrorStatePage` | `src/app/components/ErrorStatePage.tsx` | `404`, `500`, `generic` | fallback de error |

## Matriz: acceso y cuenta

| Componente / pantalla | Archivo | Estados principales | Variantes / notas |
|---|---|---|---|
| `LoginScreen` | `src/app/components/LoginScreen.tsx` | default, focus, error toast, password visible/oculta | quick-access por usuario demo |
| `PasswordRecoveryPage` | `src/app/components/PasswordRecoveryPage.tsx` | default, success toast, error toast | vuelve a opener o historial |
| `AccountSettingsPage` | `src/app/components/AccountSettingsPage.tsx` | perfil, cambio de contraseña, reportes off/on, preview table | cambia disponibilidad por rol |

## Matriz: vistas por rol

| Pantalla | Archivo | Estados principales | Variantes / notas |
|---|---|---|---|
| `OperatorDashboard` | `src/app/components/OperatorDashboard.tsx` | tabla de carpetas, filtros, wizard create, carga manual, carga masiva, success | usa `hideImportes` en perfiles de consulta |
| `CarpetaDetail` | `src/app/components/CarpetaDetail.tsx` | tabs múltiples, readonly, editable, modales por sección, estados vacíos | fuente principal de reglas operativas |
| `SubcarpetaDetail` | `src/app/components/SubcarpetaDetail.tsx` | tabs múltiples, readonly, incidencias activas, vacío con datos | detalle por embarque |
| `CommercialArrivals` | `src/app/components/CommercialArrivals.tsx` | KPIs, filtros, agrupación madre/hija, readonly comercial | sin capa financiera |
| `VencimientosPage` | `src/app/components/VencimientosPage.tsx` | readonly o gestionable | envuelve `VencimientosCalendar` |
| `VencimientosCalendar` | `src/app/components/VencimientosCalendar.tsx` | calendar view, list view, filters open, selected day, empty day, mobile sheet | selector único de calendario, filtros y detalle diario |
| `DirectorDashboard` | `src/app/components/DirectorDashboard.tsx` | `kpi`, `audit`, alertas críticas, gráficos | solo lectura |
| `TreasuryCashFlow` | `src/app/components/TreasuryCashFlow.tsx` | horizonte 7/15/30, búsqueda, subcarpetas colapsadas/expandidas, toggle pago | foco financiero |
| `WarehouseReception` | `src/app/components/WarehouseReception.tsx` | agenda/checkin, modal de incidencia, vacío | foco depósito |
| `DispatcherDashboard` | `src/app/components/DispatcherDashboard.tsx` | dashboard, edición aduanera, modal despacho | foco aduana |
| `AdminDashboard` | `src/app/components/AdminDashboard.tsx` | tabs `users`, `audit`, `articles`, `providers`; CRUD modal | administración general |
| `DesignSystemPage` | `src/app/components/DesignSystemPage.tsx` | catálogo visual | referencia interna, no negocio |

## Matriz: tabs y secciones internas de negocio

| Contexto | Archivo | Estados principales | Variantes / notas |
|---|---|---|---|
| `GeneralTab` | `src/app/components/CarpetaDetail.tsx` | lectura, edición, bloqueo por permiso | datos de cabecera OC |
| `ArticulosTab` | `src/app/components/CarpetaDetail.tsx` | lista, búsqueda, filtro, expansión, vacío, modal alta/edición, carga masiva | usa toolbar y acciones de artículos |
| `ProduccionTab` | `src/app/components/CarpetaDetail.tsx` | lectura, edición, control conforme/no conforme | seguimiento proveedor |
| `SubcarpetasTab` | `src/app/components/CarpetaDetail.tsx` | lista de embarques, límite alcanzado, sin saldo, create modal | embarques parciales |
| `DocumentosTab` | `src/app/components/CarpetaDetail.tsx` | lista, upload wizard, análisis, vacío, diferencias | anexos y validación |
| `AduanaTab` | `src/app/components/CarpetaDetail.tsx` | selección de subcarpeta, edición, export SAP | gestión aduanera |
| `CosteoTab` | `src/app/components/CarpetaDetail.tsx` | selección de subcarpeta, edición, sin aperturas | coeficientes y costos |
| `PagosTab` | `src/app/components/CarpetaDetail.tsx` | resumen por divisa, nuevo pago, confirmar pago, saldo a favor | flujos de pagos de carpeta |
| `TransitoSection` | `src/app/components/SubcarpetaDetail.tsx` | lectura, artículos asignados, resumen carga | detalle tránsito |
| `AduanaSection` | `src/app/components/SubcarpetaDetail.tsx` | lectura | detalle aduanero por embarque |
| `CosteoSection` | `src/app/components/SubcarpetaDetail.tsx` | lectura, hideImportes | detalle costeo por embarque |
| `DocumentosSection` | `src/app/components/SubcarpetaDetail.tsx` | lista, vacío | anexos por embarque |
| `RecepcionSection` | `src/app/components/SubcarpetaDetail.tsx` | incidencias abiertas/cerradas, vacío | recepción física |

## Regla de uso de la matriz

- antes de tocar una pantalla, ubicar primero si el cambio cae en primitive compartido, shell, vista por rol o tab interna
- si un estado no aparece en la matriz pero existe en código, agregarlo antes o junto con la implementación
- si una variante visual no tiene fuente de verdad, no crearla sin antes cerrar su pertenencia al sistema