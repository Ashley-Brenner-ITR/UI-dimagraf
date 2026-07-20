# Documento de Racionales de Componentes y Decisiones de UX (Dimagraf)

Este documento detalla las decisiones arquitectónicas, de experiencia de usuario (UX) y de diseño de interfaz de la plataforma de Gestión de Importaciones de Dimagraf. Explica la justificación de los patrones aplicados, la consistencia entre pantallas y la resolución de flujos críticos del negocio.

---

## 1. Racionales de Diseño e Interfaz (UI/UX)

### ¿Por qué el Dashboard y el Detalle utilizan un patrón basado en Cards / Bento Grid?
1. **Contención y Legibilidad**: Las importaciones manejan una alta densidad de información (números de carpeta, despachantes, buques, ETAs, contenedores, aduanas, etc.). Organizar estos bloques lógicos en tarjetas independientes permite al usuario asimilar la información de un solo vistazo, sin fatiga cognitiva.
2. **Jerarquía Visual y Foco**: En lugar de presentar tablas densas de borde a borde, las tarjetas separan visualmente los módulos operativos (Aduana, Costeo, Pagos, Documentación). Cada tarjeta tiene una cabecera clara, metadatos y acciones contextuales.
3. **Escalabilidad Móvil y Desktop (Responsive Design)**:
   - **En Escritorio (Desktop)**: Se utiliza una grilla fluida y auto-ajustable (`getAutoFitGridStyle` o bento grids de 2 o 3 columnas) que aprovecha la amplitud de la pantalla para mostrar comparativas colaterales o paneles desplegados de manera armónica.
   - **En Dispositivos Móviles**: La grilla colapsa de forma natural en una sola columna vertical. Las tarjetas se apilan manteniendo el mismo tamaño de fuente, iconos y botones interactivos (que cumplen con el estándar de touch target de $\ge 44\text{px}$). No hay desbordamientos horizontales de tablas complejas, lo cual es crítico para los operarios del **Depósito Garín** quienes consultan el sistema desde tablets o celulares.
4. **Escalabilidad de Filtros y Acciones**: Al desacoplar la barra de filtros principal y las solapas flotantes del contenedor de contenidos, se pueden añadir nuevos criterios de búsqueda, filtros de divisa o nuevos botones de acción sin alterar el esqueleto de la aplicación.

### Rediseño de las Tabs de Carpeta a "Solapas Flotantes"
Siguiendo la sugerencia de unificar estilos con la barra de búsqueda y filtros principal, las solapas de navegación de `CarpetaDetail` ahora son **flotantes**:
- **Estilo Píldora Desacoplada**: El selector de solapas flota sobre el lienzo con un fondo blanco puro, bordes redondeados suaves, y una sombra sutil de profundidad. Ya no encierra de forma rígida a todo el contenido de la solapa.
- **Micro-interacciones y Feedback Cohesivo**: El estado activo de cada solapa utiliza un lavado verde suave (`rgba(26,92,56,0.08)`) y un borde verde sutil, eliminando la rigidez del diseño clásico de pestañas de navegador y aportando un aire moderno y premium.

---

## 2. Dominio de Datos: Artículos, Órdenes de Compra y Saldos

### ¿Quién tiene saldo ("saldos"): los artículos o las órdenes de compra?
El control de saldos opera a **nivel de Artículo**, y su consolidación determina el estado de la **Orden de Compra (OC / Carpeta)**:
1. **Nivel de Artículo**: Cada artículo individual dentro de una OC tiene una cantidad solicitada original (`cantidadSolicitada`) y una cantidad que ya ha sido asignada a uno o más embarques (`cantidadAsignada`).
   - El **saldo pendiente del artículo** se calcula dinámicamente como:
     $$\text{Saldo Pendiente} = \text{Cantidad Solicitada} - \text{Cantidad Asignada}$$
   - Esto permite realizar múltiples embarques parciales (A, B y C) descontando cantidades de cada ítem de manera granular.
2. **Nivel de Orden de Compra**: La carpeta madre (OC) consolida los artículos. Una OC se considera en estado "abierto" mientras al menos uno de sus artículos tenga un saldo pendiente mayor a cero. De acuerdo con el requerimiento **RF-014**, el sistema realiza el **cierre automático de la OC** cuando el saldo acumulado de todos sus artículos llega a cero.

---

## 3. Motor de Validación Automática (VAL) y Estado "Con Error"

### ¿Qué significa el estado "Con error" en la validación?
El estado `Con error` (o `Duplicado` / `Con advertencia`) representa el resultado del motor **VAL** al comparar un documento subido por el proveedor contra la Orden de Compra del sistema:
- **Discrepancia de Cantidades**: El proveedor confirma o factura un volumen que excede la tolerancia establecida (ej. más del 5% de desvío).
- **Incompatibilidad de SKU / Código SAP**: El código de artículo extraído del PDF o Excel no existe en la OC original.
- **Falta de Coincidencia Semántica**: La descripción técnica del ítem (ej. en inglés u otro formato) no se asimila semánticamente al artículo maestro cargado.

### ¿Quién carga y dispara esta validación?
1. **Carga y Disparo**: El **Operador de Importaciones** (Johana/Julián) sube el documento del proveedor (Confirmación de Pedido o Factura de Preembarque) mediante drag-and-drop en la solapa de **Anexos** o **Documentos**.
2. **Procesamiento Automático (VAL)**: El sistema envía el documento curado y enmascarado (para protección de datos PII) al pipeline de Inteligencia Artificial (OpenAI/Gemini). El motor realiza la extracción y comparación semántica, devolviendo y marcando automáticamente los artículos con su respectivo estado (`Válido`, `Con advertencia` o `Con error`).
3. **Revisión y Aceptación**:
   - Si un artículo queda marcado **"Con error"**, el operador visualiza la comparativa detallada en pantalla.
   - El operador es el único que puede decidir si **acepta la discrepancia** (lo que actualiza el estado a *Con advertencia* y permite continuar la operación con una nota de auditoría) o si **rechaza la validación** para iniciar un reclamo formal con el proveedor vía mail.

---

## 4. Matriz de Gobernanza y Permisos de Edición por Rol

El ciclo de vida del expediente de importación determina qué rol puede editar la información y en qué momento:

| Rol de Usuario | Solapas Visibles | Permisos de Edición | Momento de Edición / Reglas de Negocio |
| :--- | :--- | :--- | :--- |
| **Operador (Importaciones)** | Todas las solapas | - OC Original (General, Artículos)<br>- Producción / Proveedor<br>- Datos de Aduana<br>- Datos de Costeo | - La **OC Original** solo se puede editar si **no existen embarques creados** (`subs.length === 0`). Una vez creado el primer embarque, la OC se bloquea permanentemente.<br>- Puede editar hitos de aduana y de producción en cualquier momento del tránsito. |
| **Tesorería** | General, Artículos, Documentos, Pagos | - Registrar/Confirmar pagos divisa exterior<br>- Cargar impuestos AFIP / VEP y gastos de terminal | - Gestiona el flujo financiero en cualquier momento de la carpeta.<br>- No puede editar cantidades de la OC ni datos del despacho aduanero. |
| **Despachante Aduanero** | General, Embarques (limitado), Aduana, Anexos | - Cargar DUA y canal asignado (Verde/Rojo)<br>- Cargar gastos y fecha de salida del puerto | - Edita únicamente los campos aduaneros una vez que el embarque arriba al puerto.<br>- **No tiene acceso a precios, márgenes de costeo ni datos financieros**. |
| **Comercial** | General, Artículos, Embarques, Anexos | - Solo Consulta (Solo Lectura) | - No puede realizar modificaciones.<br>- Su pantalla principal al iniciar sesión es la **Matriz de Arribos** para monitorear el stock que ingresará próximamente. |
| **Depósito (Garín)** | General, Embarques, Receptions, Anexos | - Registrar recepción física<br>- Cargar incidencias (roturas, faltantes) | - Edita la recepción una vez que el estado del embarque es *Oficializado*.<br>- Registra sobrantes o daños de mercadería para la posterior auditoría de Importaciones. |
| **Dirección** | Todas las solapas | - Solo Consulta / Aprobación | - Acceso total de consulta a métricas de desvío de coeficiente de costo e informes globales. No realiza carga operativa. |

---

## 5. Componentes Compartidos Incorporados en Carpetas y Arribos

### `TransportModeIcon`
Se consolidó un único componente para representar el tipo de transporte en `Carpetas`, `Arribos` y los listados de detalle:
1. **Forma consistente**: el contenedor es cuadrado con bordes suaves, no circular, para seguir el patrón visual del resto de la aplicación.
2. **Color por modo, con jerarquía secundaria**: terrestre, aéreo y marítimo mantienen familias cromáticas distintas, pero con saturación baja. El objetivo es que el icono identifique el modo logístico sin competir visualmente con los estados operativos (`Vencido`, `En tránsito`, `Rojo`, `Verde`, etc.), que deben leerse primero.
3. **Dos variantes de uso**: la variante estándar mantiene el contenedor cuadrado para contexts de detalle o listados ricos, mientras que la variante `minimal` deja solo el glifo coloreado para usarlo inline junto al campo `Modo`.
4. **Escala reutilizable**: el mismo componente funciona en filas compactas, cards y tablas sin recrear lógica local de iconografía.

### Patrón de filas y cards de embarques
En las vistas de `Carpetas` y `Arribos` se fijó un patrón común para evitar deriva entre pantallas:
1. **Iconografía no líder**: se retiraron los iconos de apertura de `Carpeta` y de `Transporte` de la primera columna visual. En las vistas operativas, el único icono persistente de transporte queda junto al valor del campo `Modo`, para no robar jerarquía al número de carpeta o embarque.
2. **Chevron centrado**: la acción de avance queda en una celda fija y centrada verticalmente, separada del bloque de estado para que no parezca otro dato.
3. **Espaciado interno controlado**: cada bloque `label/value` mantiene separación explícita entre rótulo y dato, evitando que ETA, modo, cantidades o proveedor queden “pegados” en cards compactas o listados densos.
4. **Estado por encima del decorativo**: badges, dots y colores de estado tienen prioridad visual sobre iconos de transporte o acentos estructurales, porque comunican riesgo y urgencia operativa.
5. **Cards madres más bajas**: en `Carpetas`, el estado `Pendiente de embarque` se ubica inline junto al monto cuando aplica, evitando una línea adicional que aumente la altura de la tarjeta.

### Escala tipográfica compartida de embarques
Se incorporó una escala única en `theme.ts` para unificar jerarquías visuales entre `Carpetas`, `Arribos` y `CarpetaDetail`:
1. **`title`**: número principal de carpeta o embarque.
2. **`value`**: dato operativo base dentro de grillas y cards.
3. **`companion`**: metadatos secundarios como `de 2026/437`, conteos o líneas de apoyo.
4. **`label`**: rótulos en mayúscula como `ETA`, `Modo`, `Cantidad`, `Actualiz.`.
5. **`tableHead`**: encabezados de tablas compactas.

El objetivo de esta escala es que el usuario reconozca la misma jerarquía de lectura aunque cambie de pantalla o de densidad de vista.

### Componentes base reutilizados en este flujo
1. **`WelcomeBanner`**: conserva encabezados limpios y evita meter KPIs decorativos en una zona cuyo foco principal es el contexto y la acción primaria.
2. **`FilterToolbar`**: mantiene una entrada consistente para búsqueda y filtros avanzados sin duplicar shells o bordes extras entre pantallas operativas.
3. **Paginado inline compartido**: `Arribos` adoptó el mismo patrón de resumen + navegación de `Carpetas` para no forzar al usuario a reaprender controles según la vista.
