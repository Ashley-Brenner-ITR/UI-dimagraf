# ESPECIFICACIONES  A DEFINIR.docx

ESPECIFICACIONES  A DEFINIR
Cliente: Dimagraf
Proyecto: Importaciones
Versión: 1Julio 2026Versión: 1Julio 2026
Versión: 1
Julio 2026
Versión: 1
Julio 2026
A. Gobernanza y aprobación del proyecto
Definir quién es el aprobador formal del ERS v2.0 por parte de Dimagraf (hoy figura "Pendiente" en la sección de Aprobaciones).
Confirmar si José Uranga sigue siendo el key user / decisor final, o si hay un contacto funcional dedicado para el día a día con el equipo de desarrollo.
Definir el canal y la frecuencia de validación funcional durante el desarrollo (¿sprints con demo? ¿quién valida criterios de aceptación por parte de Dimagraf?).
Validar con LT 2 o 3 semanas?
B. Accesos y cuentas técnicas (para poder arrancar infraestructura)
Cuenta OpenAI: ¿la da de alta Dimagraf o ITR? Método de pago, responsable de facturación, y a quién se le configuran alertas de gasto (Infra/Setup, RF-024 a RF-039).
Cuenta / dominio DigitalOcean, o definir si lo provisiona ITR bajo cuenta de Dimagraf.
Cuenta SendGrid (o proveedor de envío de mail) para notificaciones y reportes automáticos (RF-015, RF-019).
Dominio y casilla de correo corporativa desde la que el sistema enviará notificaciones (para que no caigan en spam).
Definir si habrá ambientes separados (dev/staging/producción) y quién administra las credenciales de cada uno.
C. Maestros de datos para la carga inicial
Maestro de proveedores completo, con todos los campos de RF-016: origen, medio de transporte, días de producción, días de tránsito, incoterm, condición de pago, banco asignado, despachante habitual.
Para cada proveedor, los parámetros nuevos de VAL (RF-039): idioma en que emite documentos, instrucciones particulares de extracción ("el SKU aparece en columna Ref.", etc.), tolerancia de cantidad si difiere de la global, umbral de confianza si difiere del global, campos PII adicionales a enmascarar.
Maestro de artículos (SKU, descripción, unidad de medida) tal como se usará para el matching contra los documentos del proveedor.
Listado de usuarios por rol (Importaciones, Comercial, Tesorería, Depósito, Dirección, Administrador, Despachantes) para la carga inicial de MOD-012.
Listado de despachantes aduaneros y qué embarques/proveedores tiene asignado cada uno.
D. Documentos reales del proceso (imprescindibles para el componente VAL)
Esto es lo más urgente porque bloquea la Etapa 2 y 3 del pipeline (el propio delta lo marca como "requiere revisión humana"):
3 a 5 confirmaciones de proveedor reales (PDF o Excel, de distintos proveedores/formatos) para probar el prompt de extracción.
3 a 5 facturas de preembarque reales, ídem.
Pares reales OC ↔ documento del proveedor que incluyan casos de descripciones técnicas parecidas pero no idénticas (medidas, espesores, variantes de nomenclatura de grafito/carbón), para calibrar el umbral de similitud semántica.
Ejemplo de OC del sistema con su estructura real de campos (la ORDEN COMPRA HUAGUANG II mencionada en el resumen de requerimiento, si todavía es representativa).
Confirmar en qué idiomas llegan habitualmente los documentos de los proveedores de Dimagraf (para configurar RF-039 por proveedor desde el arranque).
E. Definiciones de negocio pendientes (bloquean parametrización del pipeline)
Umbral de similitud semántica para descripciones (el resumen sugiere 80% a modo de referencia, pero debe validarse con documentos reales — ver punto D).
Tolerancia de cantidades: ¿exacta o con margen porcentual? ¿el margen es el mismo para todos los artículos o varía por tipo de producto?
Umbral mínimo de confianza de extracción (porcentaje_confianza) por debajo del cual se pide revisión manual.
Acción concreta que dispara el OK de una validación sobre el estado del embarque/carpeta (el resumen original lo deja abierto como "definir acción sobre carpeta /oc"; en el ERS quedó resuelto como actualización de estado en MOD-004, pero conviene que Dimagraf lo confirme).
Confirmar que el Despachante Aduanero no debe ver las validaciones de confirmación, solo las de preembarque (asumido en RNF-014, a validar con el cliente).
Lista definitiva de campos PII a enmascarar más allá de los genéricos (nombre, razón social, dirección, CUIT/RUT): ¿hay otros datos sensibles específicos del sector que deban taparse?
F. Datos para la puesta en marcha (go-live)
OCs actualmente abiertas (en curso) que deban cargarse manualmente al arrancar, con su estado real a esa fecha.
Definir fecha de corte para empezar a cargar operaciones nuevas en el sistema vs. las que siguen en la planilla Excel hasta cerrarse.
Acceso a la planilla Excel maestra actual (56 columnas) para usarla como referencia de migración y como fuente de verdad transitoria.
G. Formatos e integraciones con SAP (para RF-017)
Layout exacto que espera SAP para la carga manual de Tx 45, 55 y 18 (campos, orden, formato de fecha/moneda) para que la exportación Excel/CSV sea realmente utilizable.
Confirmar los campos de costeo y coeficientes que hoy se calculan manualmente, para replicarlos en MOD-009.

# Dimagraf-ERS-Consolidado-v1.0.docx

ESPECIFICACIÓN DE REQUERIMIENTOS DE SOFTWARE
Cliente: Dimagraf
Proyecto: Importaciones
Versión: 1Julio 2026Versión: 1Julio 2026
Versión: 1
Julio 2026
Versión: 1
Julio 2026
Contents
1. INTRODUCCIÓN2
1.1 Objetivo del documento2
1.2 Alcance del documento2
1.3 Glosario2
1.4 Documentos relacionados / fuentes de este consolidado3
2. CONTEXTO DEL PROCESO ACTUAL (AS-IS)3
2.1 Perfil de la empresa3
2.2 Proceso manual de confirmación y facturación del proveedor (origen del requerimiento VAL)3
2.3 Herramienta actual de seguimiento4
3. PROPÓSITO DE LA SOLUCIÓN4
3.1 Objetivo de la solución4
3.2 Alcance de la solución4
3.3 Contexto de la solución5
3.4 Arquitectura general5
3.5 Arquitectura del componente VAL — Pipeline de validación5
3.6 Listado de módulos / componentes7
3.7 Fuera del alcance de la solución8
3.8 Restricciones y supuestos8
4. DESCRIPCIÓN DETALLADA DE REQUERIMIENTOS9
4.1 Requerimientos de UX9
4.2 Requerimientos Funcionales11
4.3 Requerimientos No Funcionales15
4.4 Otros requerimientos (normativos, legales o del negocio)17
5. MODELO DE CASOS DE USO17
5.1 Listado de actores18
5.2 Listado de casos de uso18
5.3 Diagrama de proceso (flujo end-to-end, con validación incorporada)20
6. CRITERIOS DE ACEPTACIÓN22
6.1 Criterios — Base del sistema (CU-001 a CU-015)23
6.2 Criterios — Componente VAL (CU-016 a CU-026)29
6.3 Criterios — Relevamiento funcional complementario (CU-027 y CU-028)32
7. HISTORIAL DE VERSIONES DEL REGISTRO33
8. APROBACIONES35
1. INTRODUCCIÓN
1.1 Objetivo del documento
Definir con claridad y en un único documento todos los requerimientos funcionales y no funcionales del Sistema de Gestión de Importaciones de Dimagraf, incorporando tanto el alcance base (12 módulos) como el requerimiento incorporado posteriormente: el motor de validación automática de artículos contra la Orden de Compra (componente VAL). El documento debe permitir a desarrolladores, analista funcional y testers comenzar el trabajo con todo lo comprometido, identificar funcionalidades a implementar y servir de base para armar el plan de trabajo detallado.
1.2 Alcance del documento
Comprende la definición de requerimientos funcionales, no funcionales, de UX y normativos; el modelo de casos de uso con actores y criterios de aceptación (BDD); la arquitectura general de la solución y la especificación técnica del componente de validación automática (VAL). No incluye estimaciones de horas ni costos — esa información permanece en los documentos de estimación (ver 1.4) y se usará para el plan de trabajo detallado posterior a este ERS.
1.3 Glosario
RF: Requerimiento Funcional
RNF: Requerimiento No Funcional
RUX: Requerimiento de experiencia de usuario
RNT: Requerimiento normativo / legal / de negocio
OC: Orden de Compra registrada en el sistema — fuente única de verdad para la validación
Confirmación de OC: Documento del proveedor que confirma los artículos, cantidades y condiciones del pedido
Factura (preembarque): Documento del proveedor previo al embarque, con lo efectivamente a embarcar
Preembarque: Instancia previa al envío de los artículos
SKU: Código único de artículo
Matching: Comparación automática entre los datos de un documento externo y la OC del sistema
VAL: Componente transversal de Validación Automática contra OC (no es un módulo independiente; se apoya en MOD-001, MOD-004 y MOD-012)
PII: Información de identificación personal (nombres, razón social, direcciones, CUIT/RUT, etc.)
Artículo: Término de uso obligatorio en todo el sistema (pantallas, mensajes, reportes) para referirse a los ítems de una OC.
1.4 Documentos relacionados / fuentes de este consolidado
Título
Versión
Fecha
Contenido incorporado
Dimagraf-ITR-ERS-v1.3
1.3
Mayo 2026
Base completa: 12 módulos, RF-001 a RF-023, RNF-001 a RNF-011, RUX-001 a RUX-010, CU-001 a CU-015
Resumen Requerimiento — CU (Validación)
1.2
22/06/2026
Especificación funcional del motor de validación: RF, RNF, RUX y CU de origen (renumerados en este documento)
04 — Delta de Estimación: Validación Automática contra OC
1.6
26/06/2026
Arquitectura técnica del pipeline VAL (3 etapas), 11 CU definitivos, extensión de MOD-012, riesgos
Dimagraf-Dis-Especificación de proceso de Importaciones
1.0
Mayo 2026
Contexto AS-IS del proceso de negocio (usado en sección 2)
2. CONTEXTO DEL PROCESO ACTUAL (AS-IS)
Esta sección resume, a partir del relevamiento de Discovery (mayo 2026), la operatoria actual que el sistema viene a reemplazar. Se incluye aquí porque explica el origen y la justificación de negocio del componente de validación automática (sección 5.4 y componente VAL).
2.1 Perfil de la empresa
Atributo
Descripción
Empresa
Dimagraf S.A.
Rubro
Distribución e importación de insumos gráficos (papel, vinilos, artículos de imprenta)
Perfil
PyME, con procesos manuales
Equipo Importaciones
Johana y Julián (operadores de importaciones)
Actores internos
Importaciones, Comercial, Tesorería, Dirección, Depósito Garín
Actores externos
Proveedores internacionales, despachantes aduaneros, agencias de carga, navieras, transportistas terrestres
2.2 Proceso manual de confirmación y facturación del proveedor (origen del requerimiento VAL)
Una vez enviada la Orden de Compra, el proveedor responde por correo electrónico con su confirmación de pedido.
Importaciones realiza hoy un control manual artículo por artículo (código, descripción, cantidad, precio, formato, incoterm, condición de pago) para verificar que lo confirmado coincide con lo solicitado. Si existen diferencias, se reclama al proveedor por correo hasta resolver.
Más adelante, ya en la instancia de preembarque, el proveedor envía la factura informando la cantidad que efectivamente entregará en ese embarque (que puede ser el total de la OC o una parte, según lo fabricado). Este segundo control también se realiza manualmente contra la OC.
Ambos controles son manuales, dependen de la disponibilidad y el criterio del operador, y no dejan un registro sistemático de qué se comparó ni con qué resultado. El componente VAL (sección 5.4) automatiza estas dos instancias de control usando la OC del sistema como única fuente de verdad.
2.3 Herramienta actual de seguimiento
Hoy el seguimiento de todos los embarques activos se lleva en una planilla Excel maestra de 56 columnas (A-BD), alimentada manualmente, sin integración con ningún otro sistema. Es el único repositorio de trazabilidad del proceso. El sistema a construir reemplaza esta planilla como fuente de verdad operativa.
3. PROPÓSITO DE LA SOLUCIÓN
3.1 Objetivo de la solución
Desarrollar un sistema web de gestión de importaciones que centralice y digitalice el proceso end-to-end, desde la emisión de la Orden de Compra hasta el ingreso de los artículos en SAP, incluyendo la validación automática de lo informado por el proveedor contra esa OC en dos momentos críticos (confirmación y preembarque).
El sistema reemplaza las planillas Excel dispersas, los controles manuales artículo por artículo, los seguimientos informales y los reportes manuales semanales, brindando visibilidad en tiempo real a todas las áreas involucradas (Importaciones, Comercial, Tesorería, Depósito y Dirección).
3.2 Alcance de la solución
El sistema comprenderá doce módulos y un componente transversal de validación:
Administración de Órdenes de Compra (MOD-001)
Gestión de Artículos y Saldos (MOD-002)
Gestión de Embarques y Subcarpetas (MOD-003)
Seguimiento de Producción y Pre-Embarque (MOD-004)
Gestión Documental (MOD-005)
Tránsito y Arribos (MOD-006)
Nacionalización y Despacho Aduanero (MOD-007)
Recepción en Depósito (MOD-008)
Costeo y Referencia SAP (MOD-009)
Pagos y Proyección Financiera (MOD-010)
Reportes y Consulta para Áreas (MOD-011)
Seguridad, Perfiles y Auditoría (MOD-012, extendido con parámetros de análisis de documentos por proveedor)
VAL — Motor de Validación Automática contra OC (componente transversal, sin módulo ni persistencia propia de negocio; se apoya en MOD-001, MOD-004 y MOD-012)
La solución opera de forma independiente a SAP y no requiere integración automática con el ERP.
3.3 Contexto de la solución
El sistema de Gestión de Importaciones Dimagraf opera como una aplicación web independiente que complementa a SAP ERP sin integrarse directamente con él. Los flujos de datos hacia SAP (transacciones 45, 55 y 18) se mantienen manuales y son asistidos por el sistema.
El sistema interactúa con el correo electrónico corporativo para el envío de alertas y reportes automáticos, con el almacenamiento de archivos para la gestión documental, y —a través del componente VAL— con el servicio de OpenAI para la extracción y comparación semántica de documentos de proveedores, con enmascaramiento previo de datos personales (ver 3.5).
3.4 Arquitectura general
La solución se implementará bajo una arquitectura moderna compuesta por:
Frontend: Next.js 14+
Backend: Java 21 + Spring Boot 3 o .NET 8 + ASP.NET Core
Infraestructura: DigitalOcean + Droplets + PostgreSQL + Spaces + SendGrid
3.5 Arquitectura del componente VAL — Pipeline de validación
Stack específico del componente: Java + OpenAI. Todo el pipeline es parametrizable (prompts, modelos, umbrales de confianza, tolerancias de cantidad y modo de extracción) desde parámetros del sistema, sin cambio de código.
El principio central es que la OC del sistema es la única fuente de verdad; todos los documentos externos se validan contra ella.
El proceso se ejecuta en tres etapas orquestadas desde el backend Java:
Etapa 1 — Curado del documento
El archivo recibido (PDF o Excel, cualquier layout de proveedor) se procesa en dos pasos:
extracción estructural de texto, tablas y estructura mediante una librería de análisis (unstructured o equivalente integrable desde Java);
enmascaramiento de PII — nombres de personas, razones sociales, direcciones, CUIT/RUT y otros campos configurables se reemplazan por tokens neutros ([NOMBRE], [EMPRESA], [DIRECCION], etc.) antes de salir del sistema, eliminando la necesidad de permisos contractuales para enviar documentos a OpenAI.
Etapa 2 — Extracción con IA (OpenAI)
El contenido curado se envía a OpenAI junto con un prompt parametrizable (almacenado en configuración, no en código) que define las entidades a extraer y el schema de salida.
El modelo devuelve un JSON con los artículos extraídos más metadata de confianza. Ejemplo de salida:
{ "articulos": [ { "sku": "GR-001", "descripcion": "Grafito electrodo 450mm", "cantidad": 50.0 } ], "metadata": { "porcentaje_confianza": 0.94, "articulos_extraidos": 5, "advertencias": ["campo cantidad no encontrado en artículo 3"] } }
Si el porcentaje_confianza está por debajo del umbral configurado, el sistema puede rechazar la extracción o solicitar revisión manual antes de continuar (ver RF-038, CU-026).
Etapa 3 — Comparación semántica (segundo modelo)
El JSON extraído en la Etapa 2 se compara contra el JSON de la OC cargada en el sistema. Ambos se envían a un segundo modelo (puede ser el mismo u otro de menor costo, configurado para comparación) que evalúa equivalencia de SKU, similitud de descripciones técnicas y diferencias de cantidad, devolviendo el resultado diferenciado por artículo (✅ correcto / ⚠️ diferencia / ❌ faltante o sobrante).
Qué se valida en cada documento:
Campo
Tipo de matching
Prioridad
Código de artículo (SKU)
Exacto
Alta
Descripción técnica
Semántica (IA, umbral configurable)
Complementario
Cantidades
Numérico con tolerancia configurable
Alta
Componentes técnicos y endpoints que expone VAL:
DocumentCurationService — Etapa 1, soporte PDF y Excel
PiiMaskingService — detección y reemplazo de entidades PII (lista configurable)
ExtractionService — cliente OpenAI, Etapa 2, con retry/backoff exponencial
SemanticComparisonService — Etapa 3, comparación contra JSON de la OC
POST /validate/confirmation y POST /validate/preshipment — endpoints de orquestación, con DTOs de entrada/salida
Entidad ValidationLog — resultado por artículo, decisión final (OK/Cancelar), timestamp y metadata de confianza (auditoría)
Tabla de configuración de parámetros del pipeline (prompts, modelos, umbrales, tolerancias)
Integración con módulos existentes:
Módulo
Tipo de integración
MOD-001 — Órdenes de Compra
Lectura de artículos y cantidades de la OC como fuente de verdad (RF-026). Solo lectura; VAL no modifica el módulo.
MOD-004 — Seguimiento de Producción y Pre-Embarque
Los dos flujos de validación se ejecutan dentro del ciclo de vida de este módulo. VAL es invocado desde MOD-004 y no reemplaza su lógica existente.
MOD-012 — Maestros y Configuración
Extensión de la ficha de proveedor con parámetros de análisis de documentos (idioma, instrucciones de extracción, tolerancias, umbral de confianza, campos PII adicionales). El pipeline los lee antes de invocar cada etapa, con fallback al valor global.
Nota v2.0: El perfil Despachante Aduanero (AC-007) no debe tener acceso a las validaciones de confirmación; su acceso se limita a las validaciones de preembarque, en línea con su alcance definido en RF-020. Ver RNF-014.
3.6 Listado de módulos / componentes
Id
Módulo / Componente
Descripción
MOD-001
Administración de Órdenes de Compra
Alta, consulta y mantenimiento de OCs de importación: carpeta interna, proveedor, condiciones comerciales, incoterm y datos generales. Punto de inicio del proceso. Es leída (solo lectura) por VAL como fuente de verdad.
MOD-002
Gestión de Artículos y Saldos
Desglose de OCs a nivel artículo, cantidades, unidades, equivalencias y saldos pendientes. Cierre lógico de OC cuando el saldo llega a cero.
MOD-003
Gestión de Embarques y Subcarpetas
Administra embarques asociados a una o múltiples OCs, incluyendo subcarpetas (A, B, C, etc.), despachos parciales y embarques compuestos.
MOD-004
Seguimiento de Producción y Pre-Embarque
Estado de producción antes del embarque, fechas comprometidas, seguimientos, alertas por demoras. Invoca al componente VAL en los dos momentos de validación (confirmación y preembarque).
MOD-005
Gestión Documental de Importaciones
Carga, almacenamiento y consulta de documentación asociada a OCs y embarques.
MOD-006
Tránsito y Arribos
Seguimiento del tránsito marítimo o terrestre, fechas estimadas y reales.
MOD-007
Nacionalización y Despacho Aduanero
Estado del despacho aduanero: despachante, canal, gastos, VEP, fechas clave.
MOD-008
Recepción en Depósito
Notificación al depósito, control de recepción física, confirmación e incidencias.
MOD-009
Costeo y Referencia SAP
Información para costeo y carga manual en SAP (Tx 45, 55, 18). El coeficiente de costeo es un atributo de la apertura/subcarpeta (ej. 437-A), no de la carpeta madre; una carpeta madre sin aperturas propias no tiene coeficiente (ver RF-040).
MOD-010
Pagos y Proyección Financiera
Condiciones de pago, vencimientos, proyección de cash flow, alertas a Tesorería.
MOD-011
Reportes y Consulta para Áreas
Vistas y reportes en tiempo real para Comercial, Tesorería y Dirección.
MOD-012
Seguridad, Perfiles y Auditoría (extendido)
Perfiles de usuario, control de accesos, auditoría. Extendido con la ficha "Análisis de documentos" por proveedor que usa VAL (idioma, instrucciones de extracción, tolerancias, umbral de confianza, campos PII adicionales).
VAL
Motor de Validación Automática contra OC (componente transversal)
Pipeline de 3 etapas (curado, extracción IA, comparación semántica) que valida confirmaciones y facturas del proveedor contra la OC del sistema. No es un módulo con persistencia de negocio propia; se integra a MOD-001, MOD-004 y MOD-012.
3.7 Fuera del alcance de la solución
Quedan fuera del alcance del MVP:
Integración automática o en tiempo real con SAP.
Gestión de notas de crédito o devoluciones de proveedores.
Módulo de cotización o solicitud de compra previa a la OC.
Gestión de importaciones por courier o pequeños envíos.
Aplicación móvil nativa instalable.
Integración con sistemas de navieras o tracking automático de contenedores (posible en fases futuras).
Coordinación del transporte por medio del sistema.
Validaciones financieras dentro de VAL (precios, totales) — VAL valida únicamente código, descripción y cantidad.
Integraciones externas no definidas para VAL, más allá de OpenAI.
OCR complejo para formatos de documento no estructurables por la librería de curado (Etapa 1).
3.8 Restricciones y supuestos
Restricciones:
El sistema no debe modificar ni integrarse directamente con SAP (restricción explícita de Dirección).
El equipo de Dimagraf tiene capacidad técnica limitada; la solución debe ser operable sin conocimientos de programación.
El depósito de Garín requiere una interfaz mínima funcional en dispositivos móviles o tablets.
Los archivos de entrada al pipeline VAL deben ser estructurables (PDF o Excel); no se soporta OCR sobre imágenes de baja calidad ni formatos no estructurados.
Supuestos:
Los usuarios contarán con acceso a internet durante el horario laboral.
Dimagraf proveerá los datos iniciales de maestros (proveedores, artículos, usuarios) mediante carga inicial asistida antes del go-live.
Volumetría: ingresan aproximadamente 20 embarques nuevos por mes, pero pueden existir hasta 100 carpetas/embarques activos en simultáneo, dado que muchos permanecen abiertos a la espera de recepción. Se corrige así el supuesto original de 20 activos simultáneos; se mantiene la referencia de hasta 500 carpetas históricas. Esta corrección debe trasladarse también a la propuesta comercial / estimación de esfuerzo, ya que impacta en RNF-007 (Escalabilidad) y en el dimensionamiento de listados y grillas (ver RUX-016 a RUX-021 y RNF-016).
Los estados de las órdenes serán cambiados manualmente por los usuarios, no automáticamente por el sistema (excepto el resultado de la validación VAL, que sí es automático).
El sistema implementará un flujo único unificado para embarques marítimos y terrestres; las diferencias operativas se resuelven por parametrización en el maestro de proveedores.
Volumen estimado de uso de VAL: ~500 validaciones/año (~42/mes), 2 llamadas a modelo por validación, documentos de 1 a 3 páginas. Costo operativo estimado a presupuestar: USD 5/mes (gasto real esperado USD 1-2/mes).
4. DESCRIPCIÓN DETALLADA DE REQUERIMIENTOS
4.1 Requerimientos de UX
ID
Requerimiento
Descripción
Dependencias
RUX-001
Vista centralizada
El usuario debe contar con una vista única que muestre el estado general de todas las OCs y embarques.
RF-006
RUX-002
Navegación por jerarquía
La navegación debe respetar la jerarquía OC → subcarpeta → artículo.
RF-002
RUX-003
Indicadores visuales
Los estados críticos (demoras, vencimientos próximos, canal rojo) deben destacarse visualmente.
RF-006
RUX-004
Búsqueda rápida
El usuario debe poder buscar por número de carpeta, proveedor, producto o estado.
RF-001
RUX-005
Autonomía de áreas
Comercial y Tesorería deben poder consultar información sin depender de Importaciones.
RF-011
RUX-006
Reducción de errores
El sistema debe prevenir inconsistencias mediante validaciones y mensajes claros.
RF-002
RUX-007
Consistencia visual
Las pantallas deben mantener estructura y nomenclatura consistentes con el lenguaje actual del negocio.
---
RUX-008
Carga asistida para minimizar doble entrada de datos
El sistema debe reducir la carga manual redundante precargando datos del proveedor al seleccionarlo, calculando fechas estimadas y permitiendo duplicar carpetas anteriores.
RF-001, RF-016
RUX-009
Gestión de documentos adjuntos por carpeta
Cada carpeta actúa como legajo digital: adjuntar archivos por drag & drop, categorizar por tipo, previsualizar PDFs y descargar individualmente o en ZIP.
RF-008
RUX-010
Reportes exportables a Excel y PDF
Los reportes deben poder exportarse en un click a Excel o PDF; los automáticos se envían por mail en el formato correspondiente.
RF-015
RUX-011
Vista comparativa OC vs. documento importado
Pantalla comparativa que muestra, artículo por artículo, la OC del sistema frente al documento importado (confirmación o factura).
RF-033
RUX-012
Indicadores visuales de resultado por artículo
Cada artículo debe mostrar un indicador claro: coincidencia correcta, diferencia, o faltante/sobrante.
RF-033
RUX-013
Acciones claras de aprobación
Botones explícitos OK (aprobar) / Cancelar, con confirmación antes de avanzar.
RF-034, RF-035
RUX-014
Detalle técnico visible en la comparación
La vista debe mostrar código, descripción y cantidad tanto de la OC como del documento importado, en el contexto de artículos técnicos (grafito, carbón, materiales industriales).
RF-033
Requerimientos de UX adicionales
A continuación se incorpora el detalle relevado con el cliente sobre grillas, anexos, alertas, seguridad y ajustes de flujo. Se numera en continuidad con las secciones 4.1 a 4.4 (RUX-015 en adelante, RF-040 en adelante, RNF-016 en adelante).
ID
Requerimiento
Descripción
Dependencias
RUX-015
Vista plana de carpeta madre y aperturas en la grilla principal
En la grilla principal, la carpeta madre y sus aperturas deben listarse a la misma altura (mismo nivel de fila), por ejemplo 437 y 437-A como filas consecutivas del mismo nivel, sin obligar a expandir un árbol para verlas.
RF-001, RF-003
RUX-016
Columnas dinámicas en la grilla principal
El usuario debe poder agregar o quitar columnas/atributos visibles en la grilla principal (más allá de las mínimas por defecto), de forma configurable sin desarrollo.
RF-041
RUX-017
Filtros avanzados en la grilla principal
La grilla principal debe permitir filtros combinados (más allá de la búsqueda simple de RUX-004): por proveedor, estado, rango de fechas, canal, etc.
RUX-004
RUX-018
Expandir artículos inline en la grilla de carpetas
Cada fila de carpeta/apertura debe tener un control +/- que despliegue inline el detalle de artículos de esa carpeta, sin navegar a la vista interna.
RF-002
RUX-019
Ordenamiento y filtros avanzados en la Matriz de Arribos
La Matriz de Arribos debe permitir ordenar por descripción de artículo y por fecha de llegada, además de contar con filtros adicionales equivalentes a los de la grilla principal.
RF-010
RUX-020
Matriz de Arribos como vista principal del perfil Comercial
Al iniciar sesión, el usuario con perfil Comercial debe ingresar directamente a la Matriz de Arribos como pantalla principal (home), no a la grilla general de carpetas.
RF-010
RUX-021
Paginado en listados de artículos
Todo listado de artículos (dentro de una carpeta, en resultados de validación, en reportes) debe implementar paginado para evitar listas extensas sin control.
RF-002, RF-033
RUX-022
Calendario de vencimientos visible para múltiples perfiles
El calendario de vencimientos de pago debe estar disponible, además de para Tesorería, para los perfiles Importaciones y Dirección (en modo consulta para estos últimos si no gestionan pagos).
RF-011, RF-012
RUX-023
Ubicación de los documentos anexos
Todos los documentos anexos de una carpeta se listan en una única solapa general de Anexos, filtrados según lo que el rol del usuario puede ver. Hay que clasificarlos.
RF-008, RF-041
4.2 Requerimientos Funcionales
Base del sistema (RF-001 a RF-023):
Id
Requerimiento
Descripción
Dependencias
RF-001
Gestión de Órdenes de Compra
Registrar y gestionar OCs de importación, identificándolas con una carpeta interna única (Año/Secuencia).
---
RF-002
Gestión por artículo
Desglose y seguimiento de cada OC a nivel de artículo, no solo a nivel cabecera.
RF-001
RF-003
Embarques parciales
Una OC puede tener múltiples subcarpetas (A, B, C, ...) sin límite, cada una con vida operativa independiente.
RF-001
RF-004
Despacho multi-OC
Asociar un mismo despacho a artículos de múltiples OCs y descontar saldos automáticamente.
RF-002
RF-005
Control automático de saldos
Calcular y actualizar automáticamente el saldo pendiente por artículo y por OC.
RF-002
RF-006
Estados del proceso
Reflejar los estados del proceso alineados con SAP (45, 55, 18) y estados operativos intermedios.
RF-001
RF-007
Seguimiento de producción
Registrar y consultar el estado de producción pre-embarque por OC y artículo.
RF-001
RF-008
Gestión documental
Adjuntar y consultar documentación por embarque (factura, B/L, CRT, packing list, etc.).
RF-001
RF-009
Gestión de tránsito
Registrar ETA, fechas reales y medio de transporte por embarque.
RF-001
RF-010
Arribos en tiempo real
Vista de Arribos en tiempo real para Comercial, eliminando la planilla semanal manual.
RF-009
RF-011
Alertas de vencimientos de pago
Generar alertas automáticas de vencimientos de pago a proveedores.
RF-001
RF-012
Cash flow de importaciones
Calcular la proyección de pagos (proveedor, flete, aduana) en función de fechas y condiciones.
RF-011
RF-013
Recepción en depósito
Registrar la confirmación de recepción del depósito y las discrepancias detectadas.
RF-006
RF-014
Cierre automático de OC
Cerrar automáticamente una OC cuando todos sus artículos tengan saldo cero.
RF-005
RF-015
Reportes automáticos periódicos
Generar y enviar automáticamente los reportes: Arribos (Comercial), vencimientos (Tesorería), saldos mensuales (Dirección). Frecuencia y destinatarios configurables.
RF-010, RF-011
RF-016
Maestro de proveedores con parámetros de importación
Mantener maestro de proveedores con parámetros operativos (origen, transporte, días de producción/tránsito, incoterm, condición de pago, banco, despachante habitual) para calcular fechas estimadas automáticamente.
---
RF-017
Exportación de datos para carga manual en SAP
Preparar datos para carga manual en SAP (Tx 45, 55, 18): resumen copiable y exportación a Excel/CSV en el formato esperado.
RF-006
RF-018
Login y autenticación
Requerir autenticación de usuario para acceder a cualquier pantalla; sesión expira por inactividad; altas/bajas gestionadas por el administrador desde MOD-012.
MOD-012
RF-019
Notificaciones y alertas por eventos
Enviar notificaciones por correo y alertas en la interfaz ante eventos clave (nueva OC/embarque, cambio de estado, canal aduanero, arribo inminente, discrepancias). Destinatarios y umbrales configurables.
RF-006, RF-011, RF-013
RF-020
Acceso del Despachante a la aplicación
Proveer al Despachante Aduanero (AC-007) acceso para consultar embarques asignados y cargar datos del despacho (DUA, canal, gastos, VEP, fechas), sin visibilidad de datos financieros ni de costos.
RF-006, MOD-007
RF-021
Registro de confirmación del proveedor
Registrar la confirmación del proveedor por cada OC: referencia interna, resultado del control artículo por artículo (conforme/con diferencias) y observaciones de desvío, con reclamo y re-comparación hasta resolución.
RF-001, RF-002
RF-022
Gestión de saldos a favor con despachantes
Registrar y consultar saldos a favor con cada despachante; comparar requerimientos de fondos contra el saldo disponible antes de generar una nueva transferencia.
RF-001, MOD-007, MOD-010
RF-023
Alertas automáticas de variación de coeficiente
Detectar automáticamente variaciones de coeficiente de costo comparando contra el promedio de los últimos tres ingresos del mismo artículo; alertar por correo a Dirección si supera un umbral configurable.
RF-001, MOD-009, MOD-011
Nota v2.0: RF-021 queda funcionalmente reemplazado y ampliado por el motor automático de validación (RF-024 a RF-039). Se conserva por trazabilidad histórica.
Componente VAL — Motor de Validación Automática contra OC (RF-024 a RF-039):
Id
Requerimiento
Descripción
Dependencias
RF-024
Importar confirmación
Permitir la carga del archivo de confirmación del proveedor (PDF o Excel estructurado).
MOD-004
RF-025
Importar factura (preembarque)
Permitir la carga de la factura del proveedor en la instancia de preembarque.
MOD-004
RF-026
Obtener OC del sistema
Recuperar los artículos y cantidades originales de la OC como fuente de verdad para la comparación.
MOD-001
RF-027
Comparar por SKU
Matching exacto por código de artículo entre el documento importado y la OC.
RF-026
RF-028
Comparar por descripción
Matching por similitud semántica (IA, umbral configurable) como respaldo al matching por SKU.
RF-026
RF-029
Comparar cantidades
Validar cantidades solicitadas vs. informadas, con tolerancia numérica configurable.
RF-026
RF-030
Validar confirmación contra OC
Ejecutar la comparación completa (RF-027 a RF-029) sobre el documento de confirmación del proveedor.
RF-024, RF-027, RF-028, RF-029
RF-031
Validar factura contra OC
Ejecutar la comparación completa (RF-027 a RF-029) sobre la factura de preembarque.
RF-025, RF-027, RF-028, RF-029
RF-032
Detectar diferencias
Identificar y clasificar diferencias por artículo: faltantes, sobrantes o inconsistencias de código/descripción/cantidad.
RF-027, RF-028, RF-029
RF-033
Mostrar resultados
Visualización comparativa con indicador por artículo, detalle de código, descripción y cantidad de ambas fuentes.
RF-032
RF-034
Aprobar validación
Permitir que el usuario apruebe (OK) el resultado de la validación, aunque existan diferencias dentro de los márgenes de negocio; dispara la actualización de estado en MOD-004.
RF-033
RF-035
Cancelar validación
Permitir cancelar el proceso de validación sin avanzar.
RF-033
RF-036
Actualizar OC / auditoría de la validación
Registrar en el log de auditoría (ValidationLog) cada ejecución: usuario, momento, resultado por artículo, decisión final (OK/Cancelar), timestamp y porcentaje de confianza de extracción.
RF-034, RF-035
RF-037
Gestionar error de servicio de IA
Detectar y notificar errores del servicio de OpenAI (no disponible, timeout, HTTP 5xx, sin crédito/HTTP 429, respuesta malformada no recuperable); permitir reintentar o cancelar sin perder el contexto de la OC.
RF-030, RF-031
RF-038
Gestionar documento no procesable
Detectar y notificar cuando el curado del documento falla o la confianza de extracción (Etapa 2) está por debajo del umbral configurado, indicando el tipo de error (curado vs. confianza) y ofreciendo recargar o revisar manualmente.
RF-030, RF-031
RF-039
Configurar parámetros de análisis de documentos por proveedor
Extender la ficha de proveedor (MOD-012) con parámetros: idioma de documentos, instrucciones de extracción, tolerancia de cantidades, umbral mínimo de confianza y campos PII adicionales, cada uno con fallback al valor global si está vacío.
RF-016
Requerimientos Funcionales adicionales:
Id
Requerimiento
Descripción
Dependencias
RF-040
Coeficiente como atributo de la apertura
El coeficiente de costeo es un dato propio de cada apertura/subcarpeta (ej. 437-A), no de la carpeta madre. Una carpeta madre sin aperturas asociadas no debe mostrar ni permitir cargar coeficiente.
MOD-002, MOD-009
RF-041
Clasificación de anexos por tipo y visibilidad por rol
Al subir un documento anexo, el sistema debe permitir clasificarlo por tipo (factura, B/L, packing list, DUA, etc.) y asociarlo a los roles que pueden visualizarlo, de modo que cada perfil solo vea los documentos habilitados para él.
RF-008
RF-042
Carga masiva de artículos de la OC
El sistema debe permitir cargar los artículos de una OC de forma masiva (por ejemplo, importando un archivo con código de artículo, cantidad a comprar y otros datos definidos), como alternativa a la carga manual artículo por artículo actualmente prevista.
RF-002
RF-043
Alertas de Comex según reglas de negocio
El sistema debe generar alertas específicas para el perfil Importaciones (Comex) según reglas de negocio configurables: embarques próximos a embarcar, confirmaciones de proveedor pendientes, y otros próximos eventos relevantes del ciclo de la carpeta.
RF-019, RF-024
RF-044
Atributos editables según rol
El sistema debe permitir definir, por atributo/campo, qué roles pueden editarlo y cuáles solo pueden visualizarlo, de forma configurable desde MOD-012.
RNF-004, MOD-012
RF-045
Datos UME y UM para el perfil Depósito
La vista del perfil Depósito debe incluir los campos UME (unidad de medida de embarque) y UM (unidad de medida) de cada artículo recibido.
RF-013, MOD-008
RF-046
Asignación de múltiples roles a un usuario
El sistema debe permitir asignar más de un rol a un mismo usuario (por ejemplo, un usuario de Tesorería con el rol adicional de Importaciones), acumulando los permisos y accesos correspondientes a cada rol asignado.
MOD-012
RF-047
Instancia de Pagos en el flujo de la carpeta
El flujo de una carpeta debe incluir una instancia/solapa de Pagos (hoy ausente), donde se visualice y gestione la información de condición de pago, vencimientos y pagos ejecutados de esa carpeta, en línea con MOD-010.
MOD-010, RF-011, RF-013
4.3 Requerimientos No Funcionales
Base del sistema (RNF-001 a RNF-011):
Id
Tipo
Descripción
Dependencias
RNF-001
Usabilidad
Baja carga manual: minimizar la carga manual de datos y evitar duplicación de información ya registrada.
---
RNF-002
Performance
Tiempo de respuesta: las consultas de estado y arribos deben responder en menos de 3 segundos en condiciones normales.
---
RNF-003
Disponibilidad
Acceso continuo: el sistema debe estar disponible al menos el 99% del tiempo en horario laboral.
---
RNF-004
Seguridad
Control de accesos: perfiles diferenciados (Importaciones, Comercial, Tesorería, Dirección).
---
RNF-005
Trazabilidad
Auditoría: registrar quién y cuándo se realizaron cambios relevantes en OCs y embarques.
RF-001
RNF-006
Compatibilidad
SAP no intrusivo: el sistema no debe modificar SAP ni requerir desarrollos dentro del ERP.
---
RNF-007
Escalabilidad
Crecimiento de datos: soportar crecimiento en cantidad de OCs, embarques y documentos sin degradar performance.
---
RNF-008
Mantenibilidad
Configuración simple: los parámetros (plazos por proveedor, medios de transporte, alertas) deben ser configurables sin desarrollo.
---
RNF-009
Integración futura
Arquitectura abierta para integraciones futuras: API REST documentada y diseño de datos compatible con los campos de SAP (Tx 45/55/18).
---
RNF-011
Seguridad
Autenticación segura con contraseña cifrada, control de sesión con expiración configurable y bloqueo de cuenta tras intentos fallidos reiterados.
RF-018, MOD-012
Componente VAL (RNF-012 a RNF-015):
Id
Tipo
Descripción
Dependencias
RNF-012
Usabilidad
Interfaz clara: fácil lectura de diferencias en la pantalla comparativa (RUX-011 a RUX-014).
MOD-004
RNF-013
Performance
La comparación (Etapa 3) debe responder en menos de 5 segundos en condiciones normales.
RF-030, RF-031
RNF-014
Seguridad
Control de acceso a validaciones: solo perfiles autorizados. El Despachante Aduanero (AC-007) no debe tener acceso a validaciones de confirmación, solo a las de preembarque.
RF-034, RF-035
RNF-015
Trazabilidad
Auditoría de cada validación ejecutada (ver RF-036 / ValidationLog): resultado, decisión y confianza de extracción.
RF-036
Requerimientos No Funcionales adicionales:
Id
Tipo
Descripción
Dependencias
RNF-016
Escalabilidad
La grilla principal, la Matriz de Arribos y los listados de artículos deben soportar sin degradar performance hasta 100 carpetas/embarques activos en simultáneo (ver corrección de volumetría en 3.8), además de las hasta 500 carpetas históricas.
RNF-007
4.4 Otros requerimientos (normativos, legales o del negocio)
Id
Tipo
Descripción
RNT-001
Normativa aduanera argentina
El sistema debe soportar los códigos y nomenclaturas del proceso aduanero argentino (NCM, DUA, VEP, canal verde/rojo) conforme a la normativa AFIP-Aduana vigente.
RNT-002
Protección de datos personales
El sistema debe cumplir con la Ley 25.326 de Protección de Datos Personales de Argentina respecto al almacenamiento y tratamiento de datos de proveedores y usuarios. El componente VAL enmascara PII antes de enviar contenido a OpenAI (ver 3.5, Etapa 1), lo que refuerza este cumplimiento.
5. MODELO DE CASOS DE USO
5.1 Listado de actores
ID
Actor
Descripción
Tipo
AC-001
Operador de Importaciones
Usuario principal del sistema. Gestiona el ciclo completo de las OC, incluyendo la ejecución de las validaciones automáticas (importa documentos, revisa resultados, aprueba o cancela).
Concreto
AC-002
Comercial
Usuario de consulta. Accede a la vista de arribos en tiempo real, sin visibilidad sobre costos ni pagos.
Concreto
AC-003
Tesorería
Usuario financiero. Accede a la proyección de pagos, vencimientos y flujo de caja. Confirma pagos ejecutados.
Concreto
AC-004
Depósito (Garín)
Usuario operativo. Recibe notificaciones de arribos, confirma recepción física e informa discrepancias.
Concreto
AC-005
Dirección
Usuario ejecutivo. Accede a reportes consolidados de estado, costos, variaciones y saldos.
Concreto
AC-006
Administrador del sistema
Gestiona maestros (proveedores, artículos, usuarios), configuración de alertas, perfiles de acceso y parámetros del sistema, incluyendo los parámetros del pipeline VAL y los parámetros por proveedor.
Concreto
AC-007
Despachante Aduanero
Usuario externo. Consulta embarques asignados y carga la información del despacho aduanero. Sin visibilidad de datos financieros ni de costeo, y sin acceso a validaciones de confirmación (solo a las de preembarque).
Concreto
5.2 Listado de casos de uso
Casos de uso base del sistema (CU-001 a CU-015):
ID
Nombre del caso de uso
Prioridad
Complejidad
Dependencia
CU-001
Gestionar Orden de Compra
Esencial
Complejo
RF-001, RF-002
CU-002
Registrar y actualizar embarque / subcarpeta
Esencial
Complejo
RF-003, RF-004, RF-005
CU-003
Hacer seguimiento de producción pre-embarque
Esencial
Medio
RF-007
CU-004
Gestionar documentación del embarque
Esencial
Medio
RF-008
CU-005
Actualizar tránsito y ETA
Esencial
Simple
RF-009, RF-010
CU-006
Gestionar despacho aduanero
Esencial
Medio
RF-010
CU-007
Confirmar recepción en depósito
Esencial
Simple
RF-013
CU-008
Consultar Arribos (Comercial)
Esencial
Simple
RF-010
CU-009
Generar alertas de vencimiento de pago
Esencial
Medio
RF-011, RF-012
CU-010
Confirmar pago al proveedor (Tesorería)
Esencial
Medio
RF-013
CU-011
Registrar costeo y referencia SAP
Deseable
Medio
RF-017
CU-012
Exportar reportes
Deseable
Simple
RF-015
CU-013
Administrar maestros y configuración
Esencial
Medio
RF-016, RNF-003
CU-014
Cargar datos de despacho aduanero (Despachante)
Esencial
Medio
RF-020, MOD-007
CU-015
Confirmar recepción e ingreso en Depósito
Esencial
Simple
RF-013, MOD-008
Componente VAL — Motor de Validación Automática contra OC (CU-016 a CU-026):
ID
Nombre del caso de uso
Prioridad
Complejidad
Dependencia
CU-016
Importar confirmación del proveedor
Alta
Simple
RF-024
CU-017
Importar factura (preembarque)
Alta
Simple
RF-025
CU-018
Obtener OC del sistema
Alta
Medio
RF-026
CU-019
Comparar artículos (SKU + descripción + cantidad)
Alta
Complejo
CU-018; RF-027, RF-028, RF-029
CU-020
Validar confirmación contra OC
Alta
Medio
CU-016, CU-019; RF-030
CU-021
Validar factura contra OC
Alta
Medio
CU-017, CU-019; RF-031
CU-022
Visualizar resultados comparativos
Alta
Simple
CU-019; RF-032, RF-033
CU-023
Aprobar validación
Alta
Simple
CU-022; RF-034, RF-036
CU-024
Cancelar validación
Media
Simple
CU-022; RF-035
CU-025
Notificar error de servicio de IA (Sistema)
Alta
Simple
RF-037
CU-026
Notificar documento no procesable (Sistema)
Alta
Simple
RF-038
CU-027
Cargar artículos de la OC en forma masiva
Alta
Medio
RF-042
CU-028
Gestionar instancia de Pagos de la carpeta
Alta
Medio
RF-047
Actor de CU-016 a CU-024: AC-001 (Operador de Importaciones). CU-025 y CU-026 son disparados automáticamente por el sistema durante la ejecución de CU-020/CU-021, no requieren un actor humano adicional.
5.3 Diagrama de proceso (flujo end-to-end, con validación incorporada)
Paso
Actividad
Módulo(s)
Resultado / Salida
1
Recepción y registro de OC
MOD-001, MOD-002
Carpeta única Año/Secuencia. Saldos calculados por artículo.
1.b
Validación de la confirmación del proveedor contra la OC (nuevo)
VAL, MOD-004
El proveedor confirma el pedido; el sistema importa el documento, lo compara contra la OC (CU-016, CU-018 a CU-020) y el Operador aprueba o reclama diferencias.
2
¿Embarque parcial?
MOD-003
Si Sí: se crea subcarpeta (A, B, C...). Si No: embarque completo asociado a la OC.
3
Seguimiento producción y carga documental
MOD-004, MOD-005
Estado de producción actualizado. Documentos (B/L, factura, CRT, packing list) adjuntos al embarque.
3.b
Validación de la factura de preembarque contra la OC (nuevo)
VAL, MOD-004
Antes de confirmar el embarque, el sistema importa la factura, la compara contra la OC (CU-017 a CU-019, CU-021) y el Operador aprueba o cancela (CU-022 a CU-024).
4
Registro de embarque y ETA
MOD-003, MOD-006
Embarque activo con fechas estimadas. Vista Arribos disponible para Comercial.
5
Despacho aduanero
MOD-007
Canal asignado (verde/rojo), gastos, VEP y despachantes registrados.
6
¿Canal rojo?
MOD-007
Si Sí: revisión adicional con inspección. Si No: continuidad del proceso.
7
Recepción en depósito
MOD-008
Confirmación de artículos recibidos. Incidencias registradas (si las hay).
8
Costeo y referencia SAP
MOD-009
Coeficientes, gastos y referencias de Tx 45/55/18 registrados. Exportación para carga en SAP.
9
¿Saldo = 0?
MOD-002
Si Sí: OC cerrada automáticamente. Si No: retorno al paso 2 para el próximo embarque.
Nota v2.0: Los pasos 1.b y 3.b son las dos instancias de validación automática (confirmación y preembarque) incorporadas por el componente VAL; no existían en el ERS base v1.3.
6. CRITERIOS DE ACEPTACIÓN
Los criterios de aceptación se definen en formato Dado / Cuando / Entonces (BDD) para cada caso de uso esencial. Cada criterio debe ser verificado durante las pruebas de aceptación con el cliente antes del cierre de cada sprint.
6.1 Criterios — Base del sistema (CU-001 a CU-015)
CU-001 — Gestionar Orden de Compra
ID
Escenario
Dado (Given)
Cuando (When)
Entonces (Then)
AC-001-1
Alta exitosa de OC
Un Operador autenticado con acceso a MOD-001
Registra una OC con proveedor, incoterm, condición de pago y al menos 1 artículo
El sistema genera una carpeta única (Año/Secuencia), calcula saldos por artículo y muestra la OC en estado 'Abierta'.
AC-001-2
Carpeta duplicada rechazada
Una OC con número de carpeta ya existente en el sistema
El Operador intenta registrar la misma carpeta
El sistema muestra error de duplicado y no permite guardar la OC.
AC-001-3
Precarga de parámetros del proveedor
Un proveedor con parámetros configurados (incoterm, condición pago, despachante)
El Operador selecciona ese proveedor al crear la OC
El sistema precarga automáticamente incoterm, condición de pago y despachante habitual del maestro.
AC-001-4
Modificación de OC abierta
Una OC en estado 'Abierta' sin embarques activos
El Operador modifica datos de cabecera (fechas, condiciones)
El sistema guarda los cambios y registra auditoría (usuario, fecha, campo modificado).
CU-002 — Registrar y actualizar embarque / subcarpeta
ID
Escenario
Dado (Given)
Cuando (When)
Entonces (Then)
AC-002-1
Creación de embarque completo
Una OC abierta con artículos y saldos pendientes
El Operador crea un embarque asociando todos los artículos
El sistema crea el embarque, descuenta saldos de cada artículo y genera la subcarpeta correspondiente.
AC-002-2
Embarque parcial multi-OC
Dos o más OCs abiertas con artículos del mismo proveedor
El Operador asocia artículos de distintas OCs a un mismo despacho
El sistema descuenta saldos individualmente por OC y artículo, mostrando el balance actualizado en cada OC.
AC-002-3
Control de saldo insuficiente
Un artículo con saldo pendiente = 10 unidades
El Operador intenta embarcar 15 unidades de ese artículo
El sistema bloquea la operación y muestra el saldo disponible real.
CU-003 — Seguimiento de producción pre-embarque
ID
Escenario
Dado (Given)
Cuando (When)
Entonces (Then)
AC-003-1
Registro de seguimiento
Un embarque activo con fecha de producción comprometida
El Operador registra el estado de producción con observación
El sistema guarda el seguimiento con timestamp y muestra historial cronológico.
AC-003-2
Alerta por demora en producción
Una OC con fecha de embarque comprometida en 7 días o menos
El estado de producción no ha avanzado al 100%
El sistema genera una alerta visual en el dashboard del Operador.
CU-004 — Gestionar documentación del embarque
ID
Escenario
Dado (Given)
Cuando (When)
Entonces (Then)
AC-004-1
Carga de documento
Un embarque activo
El Operador carga un archivo PDF (B/L, factura, packing list) hasta 20 MB
El sistema guarda el documento, lo categoriza por tipo y lo asocia al embarque con fecha de carga.
AC-004-2
Descarga en ZIP
Un embarque con 3 o más documentos adjuntos
El Operador solicita descargar todos los documentos
El sistema genera un ZIP con todos los archivos del embarque y lo descarga en menos de 10 segundos.
CU-005 — Actualizar tránsito y ETA
ID
Escenario
Dado (Given)
Cuando (When)
Entonces (Then)
AC-005-1
Actualización de ETA
Un embarque en tránsito con ETA estimado configurado
El Operador actualiza la fecha de arribo real
El sistema actualiza la vista de arribos en tiempo real para todos los usuarios con rol Comercial.
AC-005-2
Cálculo automático de fechas
Un proveedor con días de tránsito configurados en el maestro
El Operador registra la fecha de embarque
El sistema calcula y precarga automáticamente la fecha estimada de arribo.
CU-006 — Gestionar despacho aduanero
ID
Escenario
Dado (Given)
Cuando (When)
Entonces (Then)
AC-006-1
Registro de canal aduanero
Un embarque que ha arribado a puerto/frontera
El Operador registra el canal asignado (verde o rojo)
El sistema actualiza el estado del embarque y resalta con indicador visual el canal rojo en el dashboard.
AC-006-2
Registro de gastos y VEP
Un despacho en proceso
El Operador carga los montos de gastos aduaneros y VEP
El sistema guarda los importes y los incluye en el costeo del embarque.
CU-007 — Confirmar recepción en depósito
ID
Escenario
Dado (Given)
Cuando (When)
Entonces (Then)
AC-007-1
Confirmación sin discrepancias
Una notificación de arribo enviada al Depósito
El responsable de Depósito confirma recepción completa
El sistema actualiza el estado del embarque a 'Recibido' y notifica al Operador.
AC-007-2
Registro de incidencias
Una recepción con faltante de artículos
El responsable de Depósito registra la discrepancia con detalle
El sistema guarda la incidencia, alerta al Operador y la vincula al embarque para seguimiento.
CU-008 — Consultar Arribos (Comercial)
ID
Escenario
Dado (Given)
Cuando (When)
Entonces (Then)
AC-008-1
Vista Arribos en tiempo real
Un usuario con rol Comercial autenticado
Accede a la vista de Arribos
El sistema muestra todos los embarques activos con ETA, proveedor, artículos y estado, sin mostrar datos de costos ni pagos.
AC-008-2
Filtro por producto o proveedor
Múltiples embarques activos
El usuario Comercial filtra por nombre de artículo
La vista se actualiza mostrando solo los embarques que contienen ese artículo, en menos de 3 segundos.
CU-009 — Generar alertas de vencimiento de pago
ID
Escenario
Dado (Given)
Cuando (When)
Entonces (Then)
AC-009-1
Alerta de vencimiento próximo
Una OC con condición de pago a 30 días y fecha de embarque registrada
Faltan 7 días o menos para el vencimiento
El sistema envía alerta automática por email a Tesorería con los datos del pago pendiente.
AC-009-2
Proyección de cash flow
Múltiples OCs activas con condiciones de pago distintas
Tesorería accede al módulo de pagos (MOD-010)
El sistema muestra la proyección de egresos (proveedor, flete, aduana) ordenados por fecha de vencimiento.
CU-010 — Confirmar pago al proveedor (Tesorería)
ID
Escenario
Dado (Given)
Cuando (When)
Entonces (Then)
AC-010-1
Registro de pago ejecutado
Una OC con vencimiento de pago activo y Tesorería autenticada en MOD-010
El responsable de Tesorería registra la fecha y monto del pago ejecutado
El sistema actualiza el campo Vencimiento Real, registra la Fecha de Pago Real y cambia el estado del pago a 'Pagado'. El Operador recibe notificación.
AC-010-2
Pago anticipado al vencimiento
Una OC con Vencimiento Estimado a 15 días
Tesorería registra el pago con fecha anterior al vencimiento estimado
El sistema acepta la fecha sin bloqueo, la registra como anticipo y actualiza el estado a 'Pagado'.
AC-010-3
Consulta de pagos pendientes
Múltiples OCs activas con distintas condiciones de pago
Tesorería accede al módulo de pagos (MOD-010)
El sistema lista los vencimientos próximos ordenados por fecha, mostrando proveedor, importe, moneda y banco asignado, sin exponer datos de costeo ni coeficientes.
CU-011 — Registrar costeo y referencia SAP
ID
Escenario
Dado (Given)
Cuando (When)
Entonces (Then)
AC-011-1
Registro de referencia SAP
Un embarque en estado 'Recibido'
El Operador registra los números de transacción SAP (Tx 45, 55, 18) y coeficiente
El sistema guarda las referencias, las asocia al embarque y las incluye en el resumen de costeo.
AC-011-2
Exportación para SAP
Un embarque con costeo completo
El Operador solicita exportar datos para SAP
El sistema genera un archivo Excel/CSV con los campos en el formato esperado por SAP para Tx 45, 55 y 18.
CU-012 — Exportar reportes
ID
Escenario
Dado (Given)
Cuando (When)
Entonces (Then)
AC-012-1
Exportación manual
Un usuario con acceso a reportes
Solicita exportar el reporte de Arribos o vencimientos
El sistema genera el archivo Excel o PDF y lo descarga en menos de 5 segundos.
AC-012-2
Reporte automático semanal
Configuración de reportes automáticos activa
Se cumple el día/hora configurada
El sistema envía por email el reporte correspondiente (Arribos a Comercial, Vencimientos a Tesorería, Saldos a Dirección) en el formato configurado.
CU-013 — Administrar maestros y configuración
ID
Escenario
Dado (Given)
Cuando (When)
Entonces (Then)
AC-013-1
Alta de proveedor con parámetros
Un Administrador autenticado
Registra un nuevo proveedor con todos los parámetros (origen, días producción, días tránsito, incoterm, banco, despachante)
El sistema guarda el proveedor y los parámetros quedan disponibles para precarga automática en nuevas OCs.
AC-013-2
Gestión de perfiles de acceso
Un Administrador con acceso a MOD-012
Asigna o modifica el perfil de un usuario
El sistema aplica los permisos inmediatamente y registra el cambio en el log de auditoría.
CU-014 — Cargar datos de despacho aduanero (Despachante)
ID
Escenario
Dado (Given)
Cuando (When)
Entonces (Then)
AC-014-1
Carga completa del despacho
Un embarque asignado al Despachante Aduanero (AC-007) con canal ya determinado
El Despachante ingresa DUA, canal, gastos en ARS, VEP en USD, fecha de oficialización y fecha de salida de puerto/frontera
El sistema guarda los datos, actualiza el estado del embarque, notifica al Operador y resalta el canal rojo si corresponde. El Despachante no tiene visibilidad de datos financieros ni de costeo.
AC-014-2
Acceso restringido del Despachante
Un Despachante autenticado en el sistema
Intenta acceder a la proyección de pagos o a datos de costo de otros embarques no asignados
El sistema deniega el acceso y muestra únicamente los embarques que tiene asignados, sin datos financieros ni de costeo en ninguna pantalla.
AC-014-3
Actualización de dato ya cargado
Un despacho con canal y gastos ya ingresados por el Despachante
El Despachante corrige el monto de gastos por un dato actualizado
El sistema guarda el nuevo valor, registra en auditoría el cambio (usuario, fecha, valor anterior y nuevo) y notifica al Operador.
CU-015 — Confirmar recepción e ingreso en Depósito
ID
Escenario
Dado (Given)
Cuando (When)
Entonces (Then)
AC-015-1
Notificación de arribo al depósito
Un embarque con fecha de arribo estimado a Garín calculada por el sistema
La fecha de arribo estimado se alcanza o el Operador actualiza manualmente la fecha de llegada
El sistema envía notificación automática al Depósito (AC-004) con el detalle del embarque: carpeta, proveedor, artículos, cantidades y fecha estimada.
AC-015-2
Confirmación de recepción sin discrepancias
El Depósito recibió la notificación de arribo y cuenta los bultos físicamente sin diferencias
El responsable del Depósito confirma la recepción completa desde la interfaz (móvil o tablet)
El sistema actualiza el estado del embarque a 'Recibido', registra la fecha de Llegada Garín y notifica al Operador para que proceda con la carga en SAP (Tx 18).
AC-015-3
Registro de discrepancia en la recepción
El Depósito detectó una diferencia de cantidad o producto al comparar con la lista del embarque
El Depósito registra la discrepancia indicando artículo afectado, cantidad recibida y cantidad esperada
El sistema guarda la incidencia, alerta al Operador de Importaciones, mantiene la carpeta abierta y no cierra la OC automáticamente hasta la resolución del reclamo.
6.2 Criterios — Componente VAL (CU-016 a CU-026)
CU-016 — Importar confirmación del proveedor
ID
Escenario
Dado (Given)
Cuando (When)
Entonces (Then)
AV-016-1
Carga exitosa de confirmación
Un embarque en instancia de confirmación
El Operador carga el archivo de confirmación (PDF o Excel estructurado) por drag & drop
El sistema acepta el archivo, valida el formato y dispara el pipeline de curado (Etapa 1).
AV-016-2
Formato de archivo incorrecto
Un embarque en instancia de confirmación
El Operador intenta cargar un archivo con formato no soportado
El sistema rechaza la carga y muestra un mensaje indicando los formatos aceptados (PDF, Excel).
CU-017 — Importar factura (preembarque)
ID
Escenario
Dado (Given)
Cuando (When)
Entonces (Then)
AV-017-1
Carga exitosa de factura
Un embarque en instancia de preembarque
El Operador carga la factura del proveedor
El sistema acepta el archivo y dispara el pipeline de curado (Etapa 1) para la instancia de preembarque.
CU-018 — Obtener OC del sistema
ID
Escenario
Dado (Given)
Cuando (When)
Entonces (Then)
AV-018-1
Obtención de artículos de la OC
Una OC registrada en MOD-001 asociada al embarque en validación
El motor de comparación solicita los artículos de la OC
El sistema recupera código, descripción y cantidad de cada artículo de la OC en modo solo lectura, sin modificar MOD-001.
CU-019 — Comparar artículos (SKU + descripción + cantidad)
ID
Escenario
Dado (Given)
Cuando (When)
Entonces (Then)
AV-019-1
Matching exacto sin diferencias
Un documento extraído (Etapa 2) cuyos artículos coinciden exactamente en código y cantidad con la OC
Se ejecuta la comparación (Etapa 3)
El sistema marca todos los artículos como coincidencia correcta (✅).
AV-019-2
SKU correcto con descripción diferente
Un artículo con el mismo SKU pero descripción con redacción distinta a la de la OC
Se ejecuta la comparación semántica
El sistema evalúa la similitud de descripción contra el umbral configurado y marca el artículo como correcto si supera el umbral, o como diferencia (⚠️) si no lo supera, indicando la discrepancia textual.
AV-019-3
Cantidad dentro de tolerancia
Un artículo con cantidad informada distinta a la solicitada, dentro del margen de tolerancia configurado
Se ejecuta la comparación de cantidades
El sistema marca el artículo como coincidencia correcta, indicando que la diferencia está dentro de la tolerancia permitida.
AV-019-4
Artículo faltante
Un artículo presente en la OC que no aparece en el documento importado
Se ejecuta la comparación
El sistema marca el artículo como faltante (❌) en el resultado comparativo.
AV-019-5
Artículo sobrante
Un artículo presente en el documento importado que no existe en la OC
Se ejecuta la comparación
El sistema marca el artículo como sobrante (❌) en el resultado comparativo.
CU-020 — Validar confirmación contra OC
ID
Escenario
Dado (Given)
Cuando (When)
Entonces (Then)
AV-020-1
Validación completa de confirmación
Una confirmación importada (CU-016) y la OC obtenida (CU-018)
El sistema ejecuta la comparación de artículos (CU-019)
El sistema presenta el resultado consolidado de la validación de confirmación, listo para su visualización (CU-022).
CU-021 — Validar factura contra OC
ID
Escenario
Dado (Given)
Cuando (When)
Entonces (Then)
AV-021-1
Validación completa de factura preembarque
Una factura importada (CU-017) y la OC obtenida (CU-018)
El sistema ejecuta la comparación de artículos (CU-019)
El sistema presenta el resultado consolidado de la validación de preembarque, listo para su visualización (CU-022).
CU-022 — Visualizar resultados comparativos
ID
Escenario
Dado (Given)
Cuando (When)
Entonces (Then)
AV-022-1
Vista comparativa con indicadores
Una validación (confirmación o preembarque) ejecutada
El Operador abre la pantalla de resultados
El sistema muestra una tabla con la OC del sistema y el documento importado lado a lado, con indicador por artículo y detalle de código, descripción y cantidad.
CU-023 — Aprobar validación
ID
Escenario
Dado (Given)
Cuando (When)
Entonces (Then)
AV-023-1
Aprobación con diferencias dentro de márgenes de negocio
Una validación con resultado que incluye diferencias aceptables para el Operador
El Operador presiona OK
El sistema registra la decisión 'Aprobada' en el log de auditoría (ValidationLog), actualiza el estado en MOD-004 y habilita el siguiente paso del flujo.
CU-024 — Cancelar validación
ID
Escenario
Dado (Given)
Cuando (When)
Entonces (Then)
AV-024-1
Cancelación a mitad del flujo
Una validación con resultado visualizado, aún sin decisión
El Operador presiona Cancelar y confirma en el modal
El sistema no avanza en el proceso, registra la cancelación en el log de auditoría y mantiene la OC/embarque en su estado anterior.
CU-025 — Notificar error de servicio de IA (Sistema)
ID
Escenario
Dado (Given)
Cuando (When)
Entonces (Then)
AV-025-1
Servicio de OpenAI no disponible
Una validación en curso (Etapa 2 o 3)
El servicio de OpenAI responde timeout o HTTP 5xx
El sistema muestra un banner de error 'Servicio no disponible', ofrece reintentar o cancelar, y no avanza en el flujo hasta resolver.
AV-025-2
Cuenta sin crédito disponible
Una validación en curso
El servicio de OpenAI responde HTTP 429 / error de billing
El sistema muestra un mensaje 'Sin crédito disponible', ofrece reintentar o cancelar sin perder el contexto de la OC.
AV-025-3
Respuesta malformada no recuperable
Una validación en curso
El modelo devuelve una respuesta que no cumple el schema JSON esperado tras los reintentos configurados
El sistema registra el error, informa al Operador de forma descriptiva y ofrece reintentar o cancelar.
CU-026 — Notificar documento no procesable (Sistema)
ID
Escenario
Dado (Given)
Cuando (When)
Entonces (Then)
AV-026-1
Archivo corrupto o formato no reconocido
Un documento cargado (CU-016 o CU-017)
La Etapa 1 (curado) no logra procesar el archivo
El sistema muestra un mensaje específico de falla de curado y ofrece recargar el documento.
AV-026-2
Confianza de extracción insuficiente
Un documento curado correctamente
El porcentaje_confianza devuelto por la Etapa 2 está por debajo del umbral configurado
El sistema muestra el valor de confianza obtenido, indica que requiere revisión manual y ofrece recargar el documento o continuar con revisión manual, según configuración del umbral.
6.3 Criterios — Relevamiento funcional complementario (CU-027 y CU-028)
CU-027 — Cargar artículos de la OC en forma masiva
ID
Escenario
Dado (Given)
Cuando (When)
Entonces (Then)
AC-027-1
Carga masiva exitosa
Una OC en alta, sin artículos cargados aún
El Operador importa un archivo con código de artículo, cantidad a comprar y los datos adicionales definidos
El sistema valida el formato, crea todos los artículos de la OC en un solo paso y muestra el resumen de artículos cargados.
AC-027-2
Archivo con errores de formato
Una OC en alta
El Operador importa un archivo con filas inválidas (código inexistente, cantidad no numérica, etc.)
El sistema identifica las filas con error, las informa de forma clara y permite corregir y reintentar sin perder las filas válidas ya procesadas.
CU-028 — Gestionar instancia de Pagos de la carpeta
ID
Escenario
Dado (Given)
Cuando (When)
Entonces (Then)
AC-028-1
Visualización de Pagos dentro de la carpeta
Una carpeta con condición de pago y vencimientos definidos
El usuario con acceso ingresa a la solapa Pagos de la carpeta
El sistema muestra la condición de pago, los vencimientos estimados y reales, y el estado de los pagos ejecutados de esa carpeta.
AC-028-2
Registro de pago desde la solapa de la carpeta
Una carpeta con un vencimiento de pago pendiente
Tesorería registra el pago ejecutado desde la solapa Pagos de esa carpeta
El sistema actualiza el estado del pago a 'Pagado', igual que en MOD-010, y lo refleja de inmediato en la vista de la carpeta.
7. HISTORIAL DE VERSIONES DEL REGISTRO
Fecha
Versión
Descripción
Realizó
Controló
Aprobó
Mayo 2026
1.0
Armado inicial del documento base (12 módulos)
Isabel Soldo
Beatriz Czarniecki
Mayo 2026
1.2
Incorporación: Login, Notificaciones y alertas, Exportación Excel, Actor Despachante (AC-007, CU-014), confirmación de entrega en Depósito (CU-015), mantenimiento de datos maestros y carga inicial. RNF-011, RF-018, RF-019, RF-020.
Isabel Soldo
Beatriz Czarniecki
Mayo 2026
1.3
Incorporación de criterios de aceptación faltantes (CU-010, CU-014, CU-015) y nuevos RF-021, RF-022, RF-023 surgidos del análisis de cobertura del proceso de importaciones.
Isabel Soldo
Beatriz Czarniecki
22/06/2026
Resumen Req. CU v1.2
Especificación funcional del requerimiento de Validación Automática contra OC: 13 RF, 4 RNF, 4 RUX, 9 CU (numeración propia, fuente de este consolidado).
Sistema / equipo Dimagraf
26/06/2026
Delta v1.6
Especificación técnica del pipeline VAL (3 etapas, Java + OpenAI), versión definitiva de 11 CU y extensión de MOD-012 con parámetros por proveedor.
ITR
07/07/2026
2.0
Consolidación en un único ERS: se incorpora el componente VAL completo (RF-024 a RF-039, RNF-012 a RNF-015, RUX-011 a RUX-014, CU-016 a CU-026, arquitectura del pipeline y criterios de aceptación asociados) sobre la base del ERS v1.3, enriquecido con el contexto de proceso AS-IS.
ITR
Pendiente
07/07/2026
2.1
Incorporación de relevamiento funcional complementario (21 puntos del cliente): grillas principales (jerarquía plana, columnas dinámicas, filtros), coeficiente como atributo de apertura, clasificación y visibilidad de anexos por rol (punto pendiente de definición), Matriz de Arribos (orden, filtros, home de Comercial), alertas de Comex, atributos editables por rol, carga masiva de artículos (CU-027), datos UME/UM para Depósito, múltiples roles por usuario, instancia de Pagos en la carpeta (CU-028), paginado de listados, corrección de terminología (artículo en lugar de mercadería) y corrección de volumetría (hasta 100 carpetas activas simultáneas).
ITR
Pendiente
8. APROBACIONES
Versión
Aprobador
Fecha
Estado
1.0
Pendiente de designación por Dimagraf
Pendiente

# Dimagraf-Dis-Especificación proceso Importaciones (1).docx

ESPECIFICACIÓN DEL PROCESO ACTUAL DE IMPORTACIONES
Cliente: Dimagraf
Proyecto: Discovery
Versión 1.0
Mayo 2026
ÍNDICE DE CONTENIDOS
1. OBJETIVO DEL DOCUMENTO3
2. ALCANCE3
3. CONTEXTO EMPRESARIAL3
4. HERRAMIENTAS Y SISTEMAS ACTUALES4
5. MÓDULOS DEL PROCESO DE IMPORTACIONES6
6. GESTIÓN DE EMBARQUES PARCIALES17
7. ESTRUCTURA - PLANILLA EXCEL MAESTRA18
8. CIRCUITO DE INFORMACIÓN ACTUAL24
9. PROBLEMAS IDENTIFICADOS - Diagnóstico25
10. EXCELS AUXILIARES27
11. ESTADOS Y TRANSICIONES EN SAP28
12. DEFINICIONES Y TÉRMINOS CLAVES29
13. HISTORIAL DE VERSIONES DEL REGISTRO32
1. OBJETIVO DEL DOCUMENTO
Este documento describe el funcionamiento actual del proceso de Importaciones de Dimagraf S.A., tal como fue relevado durante las reuniones de Discovery llevadas a cabo en mayo de 2026 por ITR.
Su propósito es triple:
Servir como base de conocimiento compartida entre el equipo de ITR y el equipo de Dimagraf.
Permitir al equipo de ITR conocer cómo opera hoy el proceso, sus herramientas, actores e integraciones.
Documentar los hallazgos progresivos del Discovery para construir, sobre esta base, la propuesta de solución tecnológica.
2. ALCANCE
Dentro del alcance — Proceso cubierto
Ciclo completo de Importaciones: desde la generación de la Orden de Compra, su confirmación, el registro de la factura del proveedor hasta el registro de costos del embarque, la generación de vencimientos con carácter informativo a Tesorería y el cierre administrativo de la carpeta y el registro de pagos que informa Tesorería.
Fuera del alcance — Proceso excluido
Proceso de Créditos y Cobranzas (gestionado por plataforma Intisa, fuera del alcance de este Discovery).
Integración directa con SAP (costo prohibitivo; cualquier solución debe complementar SAP sin modificarlo).
Gestión de ventas y servicio posventa, (después de entrega de mercadería)
Proceso de cotización de forwarders en contratos FOB (excluido por decisión de José Uranga en Reunión Kickoff).
Todo lo previo (análisis de ventas, negociación de precios, armado de Órdenes de Compra (OC)).
Se deja abierta la posibilidad de un proyecto futuro para compras/proveedores.
3. CONTEXTO EMPRESARIAL
Atributo
Descripción
Empresa
Dimagraf S.A.
Rubro
Distribución e importación de insumos gráficos (papel, vinilos, artículos de imprenta)
Perfil
PyME - con procesos manuales
Key User
José Uranga (director)
Equipo Importaciones
(Comex)
Integrantes: Johana y Julián (operadores importaciones)
Actores internos
Importaciones, Comercial, Tesorería, Dirección, Depósito Garín.
Actores externos:
Proveedores internacionales, despachantes aduaneros, agencias de carga (forwarders), navieras, empresas de fletes terrestre
4. HERRAMIENTAS Y SISTEMAS ACTUALES
A continuación, se detalla el ecosistema detectado.
Herramienta / Sistema
Uso
Integración con otros sistemas
Observaciones
Planilla Excel maestra
Seguimiento de todos los embarques activos (56 columnas A-BD)
Ninguna. Alimentada manualmente.
Es el único repositorio de trazabilidad del proceso.
Correo electrónico
Comunicación con proveedores, despachantes, navieras, depósito
Ninguna. Información llega y se carga a mano.
Toda la coordinación operativa pasa por aquí.
SAP (ERP)
Costeo, inventario, estados de OC (Tx 45/55/18), reporte ZMR21
NINGUNA automática. Todo ingreso es manual.
Sin soporte post-2030. Intocable como eje de inventario.
Estructura de carpetas compartidas
Carpetas compartidas de arrivals para Comercial (actualización semanal manual)
Ninguna.
Actualización manual los viernes.
MarineTraffic (.com)
Rastreo manual de barcos en casos urgentes (bajo stock)
Ninguna. Consulta puntual sin automatizar.
Acceso web gratuito. Sin API integrada actualmente.
SICNEA / ARCA
Declaraciones ante AFIP
Ninguna.
Portal AFIP para cumplimiento regulatorio.
WhatsApp / Teléfono
Seguimiento urgente con proveedores (Brasil, casos críticos)
Ninguna.
Uso informal. Sin registro sistematizado.
Legajos físicos
Carpetas físicas numeradas por OC (ej: 26/437). Una por embarque.
Ninguna. Repositorio físico.
Contienen documentación original: B/L, facturas, DUA, etc.
Excels Auxiliares
Control de saldos, Planilla de Arrivals, Reporte de vencimientos,
Cash flow de pagos
Ninguna
Planillas auxiliares para complementar la gestión del proceso.
5. MÓDULOS DEL PROCESO DE IMPORTACIONES
El proceso completo de Importaciones se estructura en diferentes fases, desde la Orden de Compra (OC) hasta el cierre administrativo.
A continuación, se describe cada fase en detalle.
5.1 Generación de la Orden de Compra
Descripción general
El proceso de importación se inicia cuando Comercial (Mateo o Nicolas) determina la necesidad de importar un producto, ya sea por agotamiento de stock o planificación de demanda. La definición de stocks mínimos se realiza por una comparativa entre proyecciones de venta y stock de artículos. sin parámetros configurados en SAP.
Pasos del proceso
Comercial genera la OC en Excel, PDF, papel o correo electrónico (sin formato estándar). Se utilizan para este punto los stocks existentes desde SAP.
Importaciones recibe la orden de compra y realiza un control inicial: verifica artículos solicitados, cantidades, precios, proveedor y existencia de los códigos de artículos en SAP. Los precios de la compra se negocian previamente con cada proveedor.
Se envía la OC al proveedor por correo electrónico. Ningún proveedor tiene un portal web ni sistema automático para recibir órdenes, todo es manual por correo.
El estado de la carpeta es apenas se carga es “6- pendiente de embarque”
Al enviar por correo la OC al proveedor, el área de importaciones registra en la planilla maestra las siguientes columnas:
CARPETA: Orden de compra con formato y numeración propia. (formato: AÑO/SECUENCIA, ej: 2026/437).
FECHA O/C: la fecha del correo enviado al proveedor.
PROVEEDOR: Nombre del proveedor destinatario de la OC
PRODUCTO:  Describe una idea de las líneas de producto que contiene la OC. Ej. “papel estucado”; no contiene códigos. Este dato se encuentra también en la apertura de la OC de cada embarque.
LINEA: Líneas a la cual pertenece la OC. Puede pertenecer a más de una línea. Ejemplo: LCA, LDA. Este dato se encuentra también en la apertura de la OC.
CANTIDAD SAP: Total de la OC en la unidad común del producto (kilos, Metro cuadrado, litros).
UNIDAD_SAP: Unidad de medida utilizada (tonelada, metro cuadrado, litro etc.) MONTO OC: Importe total de la OC
MONEDA: Moneda negociada
INCOTERM: Clausula acordada de flete (FOB, CIF etc)
FECHA DE EMBARQUE ESTIMADA: es la Fecha OC más cantidad de días corridos que el proveedor tarda en embarcar
ESTADO: Se fija en “1- pendiente de embarque”; es el estado en cuanto se carga la carpeta.
Si algún artículo incluido en la orden de compra no existe en SAP, se envía una solicitud al área de Sistemas para su alta. Este paso es previo a la carga de la orden de compra y su demora depende del tiempo de gestión del alta, aproximadamente es 24 o 48 hs.
Se carga la OC en SAP bajo contrato marco - Transacción 45 (Ej: 4599437). Cada artículo se carga como posición separada. La carga en SAP es posterior al envío al proveedor, siempre se prioriza enviar la OC primero.
CONTRATO MARCO:  número que asigna SAP al cargar la OC en SAP; para seguir la OC se utiliza el número de carpeta. Este dato es una referencia interna de SAP. Este dato es uno sólo indistintamente si se hacen aperturas de la carpeta
Condición de Pago Proveedor: se registra la condición de cómo se le pagará al proveedor; es información que está en la OC
5.2 Confirmación del Proveedor
Descripción general
Una vez enviada la OC, el proveedor responde por correo electrónico con su confirmación de pedido. Importaciones realiza entonces un control manual artículo por artículo para verificar que lo confirmado coincide exactamente con lo solicitado.
Pasos del proceso
El proveedor responde por correo con su confirmación (a veces acusa recibo, otras no) e informe el número de referencia interna del mismo.
Importaciones realiza control MANUAL artículo a artículo: código / descripción, cantidad, precio, formato, incoterm, condición de pago.
En este momento se cargan en la planilla maestra las celdas:
REFERENCIA PROVEEDOR: número de referencia interna del proveedor
Si existen diferencias, se reclama al proveedor por correo hasta resolver.
5.3 Seguimiento de Producción (Pre-embarque)
Descripción general
Mientras el proveedor fabrica el pedido y lo puede entregar en distintos embarques según su producción. Cada embarque es una apertura dentro de la carpeta. Ejemplo 2026014 se puede aperturar en 2026014-A y en 2026014-B. Cada apertura posee su propia factura y documentación de embarque.
Importaciones realiza seguimiento activo del estado de producción, consultando periódicamente si ya se inició la fabricación, si se mantiene la fecha de embarque comprometida y si existe alguna demora. No existe ningún sistema de alertas automáticas: el seguimiento vive en un cuaderno físico que lleva el equipo de importaciones.
Pasos del proceso
Se identifican todas las OC en estado "pendiente" (no embarcadas) desde la planilla Excel.
Tres veces por semana: revisión de pendientes y contacto con proveedores urgentes por correo.
Cada 10 días: consulta sistemática al proveedor por estado de producción.
En casos críticos (bajo stock): contacto por WhatsApp o teléfono.
Las fechas estimadas de embarque las provee el proveedor con un margen de tiempo de 2-3 días para absorber demoras habituales.
Plazos de producción
Independientemente del origen, los plazos de producción de cada proveedor se parametrizan individualmente en el maestro de proveedores. La fecha estimada de embarque se calcula como Fecha de OC + días del maestro de proveedores.
5.4 Facturación y Preparación del Embarque
Descripción general
El proveedor envía la factura informando la cantidad que entregará en ese embarque (total de la OC o lo que haya fabricado, es decir embarques parciales).
Cuando la carga está lista, el proveedor envía la documentación de embarque. Importaciones realiza un control manual exhaustivo de todos los documentos. Todo este proceso ocurre mientras la mercadería todavía está en el país de origen, antes o durante la carga en el medio de transporte.
Se identifica en SAP que la mercadería está en tránsito.
Documentos recibidos por tipo de transporte
Documento
Marítimo
Terrestre (Brasil)
Factura comercial del proveedor
Sí
Bill of Lading (B/L)
Sí
No
Carta de Porte (CRT)
No
Sí
Certificado de origen
Sí
Packing list
Sí
Pasos del proceso
El proveedor notifica por correo que la carga está lista y adjunta la documentación (la factura y documento de conocimiento de embarque para marítimos o MIC para terrestre). Teniendo esta documentación se establece que la mercadería ya es del comprador; es un cambio legal de titularidad.
El documento de conocimiento de embarque posee la información de cantidad, peso, fechas, proveedor, posición arancelaria (código dentro del nomenclador aduanero) que determina los impuestos a pagar; datos genéricos del embarque. Nos posee información de artículos.
Importaciones realiza control MANUAL completo: quién envía (proveedor), quién recibe (Dimagraf), NCM (posición arancelaria), kilajes, volúmenes, número de bultos, descripción de artículos.
Si la carga viene en parciales (sub-embarques A, B, C), se abre un Excel separado por sub-embarque. Cada uno tiene vida independiente: factura, despachante y estado SAP propios. Son subcarpetas.
Si la documentación del proveedor esta OK, se actualiza en SAP al estado intermedio (Tx 55) que identifica la mercadería de ese embarque en tránsito.
La fecha de entrega informada por el proveedor se registra como referencia, pero NO se valida sistemáticamente.
Si el incoterm es FOB: se solicitan cotizaciones a 2-3 forwarders (proceso paralelo).
Se asigna el despachante aduanero y el área de Importaciones le envía la documentación disponible para revisión y preparación del despacho.
Si el artículo es nuevo: se envía información al despachante para clasificación arancelaria (NCM).
Una vez validada toda la documentación y con el despachante informado, el embarque queda preparado para zarpar. El proceso continúa en la fase de tránsito.
En este momento se cargan en la planilla maestra las celdas:
FACTURA/S: Se carga el número de factura del proveedor correspondiente a lo que enviará en ese embarque; hay una factura por cada subcarpeta que se aperture; si toda la OC se envía en un embarque será una solo factura.
FECHA FACTURA/S: Fecha de generación de la factura del proveedor
TOTAL IMPORTE FACTURA/S: Importe total de la factura; misma moneda que la OC.
UME: Unidad de medida estadística: Es la cantidad
Unidad UME:  Unidad UME
PESO NETO KGS: información que viene en la factura
PESO BRUTO KGS: información que viene en la factura
FECHA DE EMBARQUE ESTIMADA: Se carga cuando se crea la carpeta; se calcula como OC + días (según proveedor en maestro). Ej  OC +60 días corridos
FECHA DE EMBARQUE REAL: se completa cuando se cuenta con el documento de conocimiento de embarque que contiene este dato o el MIC (Manifiesto Internacional de Carga / Declaración de Tránsito Aduanero) en caso de tránsito terrestre
VAPOR: Buque o empresa logística que traslada la mercadería o aerolínea; el dato es más relevante por buque porque es el que tarda más en el viaje y así hacer seguimiento
MEDIO DE TRANSPORTE:  Tipo: marítimo / terrestre / aéreo.
EMPRESA DE TRANSPORTE/FF: Forwarders - Empresa contratada para hacer el cruce de frontera y traslado y en caso de marítimas la empresa de buques (ej: MSC, Cargo, etc.).
CANTIDAD DE CTNS / CAMIONES: Cantidad de conteiners que se declara en el conocimiento de embarque o la cantidad de camiones que se envía vía terrestre
BL/CRT/AWB: Número del documento que certifica la titularidad de la mercadería
FECHA ARRIBO ESTIMADO: Fecha embarque estimada más X días de tránsito en función del embarque (por maestro); se necesita para saber cuándo se pagará el despacho
Nº 55 (PEDIDO): identificador en SAP que marca que está en tránsito la mercadería de ese despacho
5.5 Tránsito Marítimo / Terrestre
Descripción general
Con la carga embarcada, el seguimiento se hace más preciso, ya que el barco tiene una fecha de arribo estimada con poca variación (salvo trasbordo). Para el tránsito terrestre, por lo general desde Brasil, el tránsito es por camión (48 horas) sin tracking dinámico disponible y en casos especiales, dependiendo el nivel de urgencia, la carga podría venir por transporte aéreo.
Pasos del proceso
La naviera envía por correo el estimado de arribo (ETA) al puerto de Buenos Aires.
Para cargas LCL (grupaje): contacto 3 veces por semana con la naviera para confirmar estado.
En casos urgentes (bajo stock): búsqueda manual del barco en MarineTraffic.com, sin automatización.
Para contratos FOB: solicitar factura al agente de carga. Para CIF: descargar y reenviar factura al despachante.
Cada viernes el área de importaciones elabora de forma manual una planilla de Arrivals para Comercial, con fechas estimadas de cada producto. Se sube a carpeta compartida.
Si cambia la fecha, se actualiza la planilla y se vuelve a avisar. El estado de la carpeta es apenas se carga es “5- En Transito”
Días antes del arribo: coordinan fondos con Tesorería para pago a la naviera/ despachante.
Origen
Tiempo de tránsito
Tracking disponible
Variabilidad
Asia / Europa (barco)
14-35 días
MarineTraffic manual (web)
Baja, salvo trasbordo
Brasil (camión)
48 horas
Sin tracking. Solo aviso del chofer.
Alta — sin visibilidad
5.6 Despacho Aduanero (Nacionalización)
Descripción general
Al arribar el barco al puerto de Buenos Aires, se inicia el proceso de nacionalización de la mercadería. El despachante aduanero asignado gestiona todos los trámites ante ARCA (SICNEA).
Pasos del proceso
Antes del arribo del barco o en el caso terrestre del cruce, Importaciones elige y asigna el despachante aduanero que gestionará la carpeta, seleccionándolo entre sus tres despachantes habituales según el tipo de carga y la experiencia del despachante con la mercadería a recibir. Importaciones registra el nombre del despachante asignado en la columna DESPACHANTE de la Planilla Maestra.
Al arribo del barco, la terminal portuaria —como TRP (Terminal Río de la Plata), Exolgan (terminal de contenedores), entre otras— demora aproximadamente entre 48 y 72 horas en completar la operación del buque y dejar los contenedores disponibles para su retiro.
Importaciones le informa al despachante a qué banco debe enviar la documentación ya que cuando se realiza el despacho se debe nominar un banco por el cual Dimagraf realizará el giro de divisas
El despachante solicita el turno de retiro vía web, compitiendo por disponibilidad con grandes importadores (por ejemplo, Techint, Ford, Renault).
Cuando el despachante tiene la documentación completa, emite un Requerimiento de Fondos enviando un correo electrónico a Importaciones,
Con ese requerimiento de fondos del despachante, Importaciones le solicita el monto a Tesorería, quien transfiere los fondos a una cuenta de Dimagraf de aduana esos fondos
En ocasiones se transfiere de más a la cuenta y en consecuencia se registra internamente que “HAY FONDOS” para próximas transacciones; representa un proceso similar a una cuenta corriente que se gestiona con los despachantes de aduana, ante cada despacho. Es decir, Dimagraf realiza la transferencia a los despachantes de aduana y puede darse el caso que la transferencia sea mayor a un importe a abonar y quede saldo a favor de Dimagraf.
Importaciones calcula manualmente la semana de pago de cada concepto y lo registra con el número de semana del año escribiendo la nomenclatura “WNum”, donde W = Week y Num = número de semana, Ej W17, esto lo carga el área de importaciones en la columna PAGO MARITIMA y PAGO ADUANA de la Planilla Maestra. Es de importancia mencionar que, en estas columnas se cargan importes a pagar o la leyenda “HAY FONDOS”, comentada en el punto anterior.
Proceso aduanero: declaración en SICNEA, validación en ARCA (portales AFIP), pago de aranceles e impuestos.
El canal asignado determina el proceso:
Canal Verde: sin inspección física → liberación rápida.
Canal Rojo: apertura del contenedor → demoras adicionales + posibles sobrecostos.
Cómo se obtiene el canal según el tipo de embarque:
Embarques marítimos: el canal figura directamente en el documento de despacho
Embarques terrestres (Brasil): el canal NO figura en el documento de despacho. Importaciones lo consulta al despachante por WhatApp o llamada telefónica
El despachante informa a Importaciones los siguientes datos e Importaciones los carga manualmente en la planilla Maestra el mismo día que los recibe:
MONTO GASTOS AR$
MONTO VEP USD
FECHA OFICIALIZACIÓN
FECHA SALIDA de Puerto/DF/FRONTERA
DESPACHO /ZF1 ZFE
CANAL
Se coordina el transporte: camiones propios o tercerizados retiran los contenedores y los trasladan al depósito de Garín.
Para cargas voluminosas: coordinar personal de descarga y devolución de contenedores vacíos.
Proceso por vía terrestre (Brasil)
El proceso de despacho aduanero por vía terrestre sigue la misma lógica que el proceso marítimo. Las diferencias operativas son:
El documento equivalente al B/L es el CRT (Carta de Porte) y el MIC.
Los períodos son más cortos, a las 48 hs de que el proveedor despacha la mercadería ya está en frontera y hay que empezar el despacho.
No hay tracking disponible durante el tránsito, a diferencia del barco, con el camión no se puede hacer seguimiento. Importaciones se comunica directamente con el transportista para saber cuándo llega.
Una vez que el despachante oficializa, Importaciones le manda un mail aparte al transportista para coordinar la fecha de llegada.
El canal aduanero no figura en el documento de despacho terrestre. Importaciones lo consulta al despachante por WhatsApp o llamada telefónica.
En este momento se cargan en la planilla maestra las celdas:
FECHA ARRIBO REAL:  Fecha real del arribo; a partir de esta fecha se calcula 48h/72h para pagar el despacho dependiendo lo que tarda en operar el buque
ARRIBO ESTIMADO GARIN: fecha de arribo real + X días de sacar la información de puerto o X días terrestre (se puede obtener de un maestro)
DESPACHANTE: nombre del despachante de aduana que gestionará la carpeta
OK DESPACHANTE: Indica si el despachante tiene toda la documentación correcta (factura, BL, etc.) luego que se le envía la documentación y responde que está todo OK
OK CRUCE / OK CARGA: Validación operativa que puede cruzar el proveedor la mercadería por tierra
MONTO GASTOS AR$: del despacho aduanero estimado informado por el despachante.
PAGO MARITIMA: Registro del pago a la marítima (puede contener la posible semana de pago (Ej. W22), la fecha de pago, el estado de Pagado, o la info que hay fondos)
MONTO VEP USD:  Impuesto arancelario por la mercadería; es informado por despachante.
PAGO ADUANA: Registro del pago a la aduana (puede contener la posible semana de pago (Ej. W22), la fecha de pago, el estado de Pagado, o el código del pago)
FECHA OFICIALIZACION: Fecha en que se nacionaliza la mercadería, la conoce el despachante
FECHA SALIDA Puerto/DF/FRONTERA: Informada por despachante, en caso de terrestre lo hace área importaciones con transportista.
DESPACHO / ZFI ZFE: Número de despacho asociado, va de la mano con el canal (marítimos están en el despacho-, terrestre no; se solicita el dato)
CANAL: Canal aduanero (verde/rojo); lo informa el despachante
ESTADO: Se actualiza a 4-Arribado Aduana y a 3-Oficializado según corresponde
BANCO: Es el banco a través del cual se paga la factura; se debe nominar cuando se hace el despacho
Ejemplo:
5.7 Recepción en Depósito/Ingreso a SAP
Descripción general
La mercadería llega al depósito de Dimagraf ubicado en Garín, provincia de Buenos Aires. El equipo del depósito realiza el control físico contra el detalle enviado por Importaciones.
Importaciones procede a cargar en SAP todos los costos del embarque. Este paso actualiza el stock disponible para venta y registra el costo unitario de cada artículo.
Pasos del proceso
Importaciones notifica al depósito con anticipación sobre el volumen de la llegada para evitar congestionamiento.
Importaciones genera en SAP la Transacción 18 (pre –ingreso) con el detalle de artículos y cantidades del embarque y lo envía al depósito por correo electrónico para que realice el control físico contra ese listado.
Esta transacción 18 genera el coeficiente en SAP, que luego se analiza. SAP prorratea automáticamente los costos entre todos los artículos del embarque en proporción a su valor / peso.
El personal del depósito cuenta los bultos físicamente y verifica, producto, estado y cantidad contra el detalle recibido desde Importaciones.
El depósito confirma el OK por correo electrónico, adjuntando planilla firmada o escaneada como respaldo del control físico.
Importaciones recibe el OK del depósito e ingresa en SAP esa conformidad sobre esa mercadería recibida; esta tarea puede llegar a realizarse unos días después de la entrega real.
En caso de discrepancias detectadas en el control físico, el depósito informa la novedad por correo electrónico. El área de Importaciones registra la incidencia en SAP (partidas reservadas / reclamo a proveedor) y mantiene la orden de compra abierta hasta su resolución.
La documentación del embarque queda archivada en carpetas y es utilizada posteriormente por el área de Contabilidad.
El stock queda disponible en SAP para que Comercial pueda ven
En este momento se cargan en la planilla maestra las celdas:
LLEGADA GARIN: Fecha en la cual llega realmente la mercadería a depósito
Nº 18 (PRE INGRESO): códigos de Ingreso de SAP de la mercadería que está llegando
ENVIO PRE-INGRESO: fecha de aviso al depósito que se llegando la mercadería
OK DEPOSITO: Fecha en que llegó la mercadería y el depósito la controló y mando el conforme
FECHA INGRESO SAP: Fecha en que se carga el OK en SAP de esa entrega; puede ser unos días más tarde
COEFICIENTE: este dato lo calcula SAP cuando se ejecuta la transacción 18, a partir de los precios cargados
OBSERVACIONES DE COSTEO: se carga una una observación que se detecte en en ese costeo; un warning
Estado:  1-En Stock:
Errores frecuentes en la recepción
Tipo de error
Descripción
Consecuencia
Cantidades incorrectas
Llegan menos unidades de las facturadas
Reclamo al proveedor. Partida reservada en SAP.
Producto equivocado
Llega un artículo distinto al pedido (ej: A4 vs Carta)
Devolución o negociación con proveedor.
Mercadería de otro cliente
Contenedor mixto con mercadería de terceros
Coordinación con naviera / despachante para devolución.
Daño en tránsito
Producto dañado o deteriorado
Reclamo al seguro o al proveedor.
Reporte SAP: ZMR21 — Variación de coeficientes
Campo
Descripción
Nombre del reporte
ZMR21 - Comparación de coeficientes de ingreso
Transacción SAP
Generado en el flujo de la Transacción 18
Comparación
Coeficiente actual del embarque vs. coeficiente anterior del mismo artículo
Destinatario
Dirección (José Uranga) - por correo electrónico
Frecuencia
Por cada embarque ingresado (no periódico)
5.8 Pagos y Cierre de carpeta
Descripción general
Una vez que la mercadería fue ingresada a stock en SAP y el depósito confirmó el OK, Importaciones gestiona el pago al proveedor y el cierre administrativo de la carpeta.
Pasos del proceso
La condición de pago está parametrizada por el proveedor en el maestro de proveedores ( Ej 60 días desde la fecha de embarque).
La fecha del conocimiento de embarque B/L o del CRT es el disparador del vencimiento de pago. Es la fecha legal a partir de la cual la mercadería es de Dimagraf y el plazo de pago comienza a correr.
Importaciones calcula manualmente la fecha estimada de vencimiento: Fecha de B/L + días de la condición de pago acordada con el proveedor. Y la carga en el campo VENCIMIENTO ESTIMADO de la planilla maestra.
Importaciones calcula la semana de pago del flete a la naviera y la carga en el campo PAGO MARITIMA con el formato W## (número de semana del año, ej: W17). Hace lo mismo para el pago del VEP a AFIP en el campo PAGO ADUANA.            o.
Importaciones consulta a Tesorería con qué banco se va a operar la transferencia al proveedor y lo carga en el campo BANCO de la planilla maestra.
Cuando se tienen los datos reales del embarque, la fecha estimada de vencimiento pasa a ser VENCIMIENTO REAL.
Una vez ejecutado el pago, Importaciones o José registra la FECHA REAL DE PAGO en la planilla maestra. Esta fecha puede ser anterior al vencimiento si se adelantó el pago por decisión financiera.
En este momento se cargan en la planilla maestra las celdas:
Condición de Pago Facturada: es la condición de pago que figura en la factura del proveedor; es un dato informativo; puede diferir con la condición de que decía la OC correspondiente
Vencimiento Estimado: Fecha estimada de pago. Se calcula de la fecha estimada de arribo más la condición de pago al proveedor en la OC.
Vencimiento Real:  Fecha real de vencimiento. Se calcula de la fecha real de arribo más la condición de pago al proveedor.
FECHA DE PAGO REAL:  es la fecha real de pago al proveedor que informa Tesorería; puede ser anterior a la fecha de vencimiento porque adelanté el pago. Este dato lo puede cargar Tesorería.
5.9 Observaciones Finales
Descripción general
Se registra durante todo el proceso las observaciones necesarias de la carpeta correspondiente de manera de tener una trazabilidad de la misma.
Pasos del proceso
Durante todo momento se carga en la planilla maestra las celdas:
OBSERVACIONES / INTERVENCIONES: se asienta trackeos de movimientos de flujos u observaciones necesarias sobre todo el proceso de la carpeta
5.10 Reportes
Descripción general
La reportería se genera de forma continua durante todo el proceso de importación para mantener informadas a las áreas de, Comercial, Tesorería y Deposito. Toda la elaboración es manual. No existe ningún sistema de reportería automática.
Reportes periódicos
Reporte
Destinatario
Frecuencia
Elaboración
Canal
Planilla de Arrivals (fechas estimadas por producto)
Comercial/ Ventas
Semanal (viernes)
MANUAL
Carpeta compartida
Reporte de vencimientos de pago (próximos 15 días)
Tesorería
Semanal (viernes)
MANUAL
Correo
Detalle de cargas entrantes
Depósito Garín
Por embarque
MANUAL
Correo
Justificación de variaciones ZMR21
Dirección
Por embarque
MANUAL
Correo
Detalle de cada reporte
Planilla de Arrivals (para Comercial)
Importaciones elabora manualmente una planilla con las fechas estimadas de arribo de cada producto que está en tránsito.
Se sube a una carpeta compartida en el directorio de red todos los viernes.
Solo se incluyen los embarques que ya están confirmados (con B/L o CRT). Si la mercadería no está embarcada, no se incluye en la planilla porque las fechas no son certeras.
Si cambia una fecha de arribo, se actualiza la planilla y se vuelve a subir.
Reporte de vencimiento de pago (para Tesorería)
Importaciones elabora manualmente todos los viernes un detalle de los vencimientos de pago de los próximos 15 días.
Incluye: embarques activos, fechas de vencimiento, montos estimados a pagar (flete, VEP, proveedor).
Se envía por correo electrónico a Tesorería.
Tesorería trabaja con esta información para planificar los fondos disponibles
Detalle de cargas entrantes (para Depósito Garin)
Importaciones genera la Transacción 18 en SAP con el detalle de artículos y cantidades del embarque.
Se envía por correo electrónico al depósito como pre-aviso antes de la llegada de la mercadería.
El depósito usa este documento para preparar el espacio y realizar el control físico cuando llega el camión.
Justificación de variaciones ZMR21 (para Dirección)
Al ingresar cada embarque a SAP, el sistema genera automáticamente el reporte ZMR21 con los coeficientes de costo actuales versus los del último ingreso del mismo artículo.
Importaciones analiza las variaciones y elabora una justificación manual por correo electrónico.
El correo se envía a Dirección.
No tiene periodicidad fija: se genera por cada embarque ingresado.
6. GESTIÓN DE EMBARQUES PARCIALES
La orden de compra (OC) puede ser entregada por el proveedor en múltiples embarques. Cada embarque genera una subcarpeta identificada con sufijo literal (A, B, C, D...)
Caso 1: Entregas parciales de una misma OC
El proveedor divide la entrega de una OC en despachos separados. Cada despacho se registra como una subcarpeta (Ej: 2026014-A, 2026-014-B, 2026-014-C). La carpeta madre (2026-014) permanece abierta hasta que complete la totalidad de la orden.
Cada subcarpeta tiene vida operativa y financiera independiente:
Factura propia del proveedor.
Conocimiento de embarque (B/L) o CRT propio.
Despachante propio asignado por Comex.
Estado SAP propio (Tx 55 y Tx 18 independientes).
Control de saldo ítems: se lleva en Excel auxiliar por subcarpeta.
Caso 2: Un mismo despacho incluye productos de dos OC distintas
Un proveedor especifico mezcla en una misma entrega mercadería perteneciente a dos OCs distintas. Esto genera una carpeta nueva con nomenclatura compuesta que referencia a ambas OC originales.
Ejemplo: De las carpetas 2026-014 y 2026-022 se arma el despacho que contiene parciales de dichas carpetas y si crea la nueva carpeta 2026-014-022-A
El tratamiento de documentación es propio de esta nueva carpeta-
7. ESTRUCTURA - PLANILLA EXCEL MAESTRA
La planilla Excel es el único repositorio centralizado de trazabilidad del proceso de Importaciones. Actúa como un CRM artesanal que concentra el estado de todos los embarques activos. Tiene 56 columnas (de la A a la BD), una fila por orden de compra (no por artículo). A continuación, se describe lo que representa cada módulo.
Módulos de la planilla (56 columnas A → BD)
Módulo
Columnas
Campos principales
Problema detectado
Orden de Compra
12 cols
Nro. carpeta, Fecha O/C, Proveedor, Referencia proveedor, Producto, Línea, Cantidad SAP, Unidad SAP, Monto OC, Moneda, Incoterm, Contrato Marco
Sin tabla de equivalencias código SAP ↔ código proveedor
Facturación
7 cols
factura, Fecha, Importe total, Cant Unidad de Medida, Unidad UME, Peso neto (kg), Peso bruto (kg)
Triple control manual por cada OC
Logística
11 cols
Estado, Fecha embarque, Fecha embarque real, Vapor, Medio de transporte, Empresa de transporte, Cant. contenedores, Doc. transporte (B/L / CRT / AWB), Fecha arribo estimado, Fecha arribo real), Llegada estimada a depósito
Sin seguimiento automático. Planilla a Ventas: manual, solo los viernes.
Nacionalización
11 cols
Despachante, OK Despachante, OK cruce, Monto gastos en pesos, Pago Marítima, Monto VEP USD, Pago aduana, Fecha oficialización, Fecha salida, Despacho ZFI-ZFE, Canal (verde/rojo),
Coordinación solo por teléfono y correo, sin trazabilidad sistematizada.
Ingreso a SAP
8 cols
Llegada a Garín,Nro. pedido SAP (Tx 55), Nro. pre-ingreso SAP (Tx 18), Fechade aviso a depósito, OK depósito, Fecha ingreso SAP, Coeficiente de costo, Observaciones de costeo
Confirmación del depósito por correo con planilla escaneada. Sin portal digital.
Pago al Proveedor
7 col
Banco asignado de pago, Condición de Pago Proveedor, Condición Pago Facturada, Vencimiento Estimado, Vencimiento Real, Fecha Pago real, Observaciones /Intervenciones.
Sin trazabilidad del pago ejecutado. Tesorería opera en sistema separado.
DETALLE DE SECCIONES Y COLUMNAS
A continuación, se listas las secciones, columnas y lo que almacena cada celda de la planilla maestra.
ORDEN DE COMPRA
Nombre del campo
Descripción
CARPETA
Identificador principal del seguimiento del proceso que representa el número de la OC con un formato de año/número incremental Ejemplo, 2026/45
FECHA O/C
la fecha del correo enviado al proveedor con la OC
Proveedor
Nombre del proveedor. Se encuentra su maestro en SAP
Referencia Proveedor
Número de referencia interna de confirmación del pedido enviado por el proveedor.
Producto
Descripción genérica del producto incluido en la OC. (no incluye detalles) Ejemplo: papel estucado pesado o papel estucado liviano
Línea
Línea a la cual pertenece la OC. Ejemplo: LCA, LDA.
Cantidad SAP
Total OC multiplicado por factor de unidad común ( ej: en palel son kilos Planchas son M2)
Unidad SAP
Unidad de medida en SAP. Ej, tonelada, M2
Monto OC
Total de la OC
Moneda
Moneda de la orden de compra. (dólar, euro)
Incoterm
Tipo de flete acordado. (CIF, FOB, etc)
Contrato Marco
Número interno que otorga SAP al cargar la OC; se usa dentro de SAP para búsquedas.
FACTURACIÓN
Nombre del campo
Descripción
FACTURA/S
Documentos de facturas recibidas (llegan por mail en PDF).
FECHA FACTURA/S
Fecha de generación de la factura. Esta fecha es disparadora del pago, si con el proveedor está negociado condiciones de pago
TOTAL IMPORTE FACTURA/S
Importe total en la misma moneda.
UME
Unidad de Medida Estadística (redundante con SAP).
Unidad UME
Unidad asociada a la UME.
PESO NETO KGS
Peso neto informado en la factura.
PESO BRUTO KGS
Peso bruto informado en la factura.
LOGÍSTICA
Nombre del campo
Descripción
ESTADO
Estados del proceso
6- Pendiente de embarque: cuando se carga la carpeta
5- En Transito: cuando se embarca
4-Arribado Aduana: cuando llega a aduana
3-Oficializado:  cuando se paga el despacho y se oficializa
1-En Stock: cuando llegó a depósito
Fecha Embarque estimada
Se carga cuando se crea la carpeta; se calcula como OC + días (según proveedor en maestro). Ej  OC +60 días corridos
Fecha Embarque Real
Fecha real según documento Conocimiento de Embarque o MIC (Manifiesto Internacional de Carga / Declaración de Tránsito Aduanero)
Vapor
Buque o empresa logística que traslada la mercadería o aerolínea; el dato es más relevante por buque porque es el que tarda más en el viaje y así hacer seguimiento
MEDIO DE TRANSPORTE
Tipo: marítimo / terrestre / aéreo.
EMPRESA DE TRANSPORTE/FF
Forwarders - Empresa contratada para hacer el cruce de frontera y traslado y en caso de marítimas la empresa de buques (ej: MSC, Cargo, etc.).
CANTIDAD DE CTNS / CAMIONES
Cantidad de containers que se declara en el conocimiento de embarque o la cantidad de camiones que se envía vía terrestre
BL/CRT/AWB
Número del documento que certifica la titularidad de la mercadería
Número de conocimiento de embarque o MIC
FECHA ARRIBO ESTIMADO
Fecha embarque estimada más X días de tránsito en función del embarque (por maestro); se necesita para saber cuándo se pagará el despacho
FECHA ARRIBO REAL
Fecha real del arribo; a partir de esta fecha se calcula 48h/72h para pagar el despacho dependiendo lo que tarda en operar el buque
ARRIBO ESTIMADO GARIN
fecha de arribo real + X días de sacar la información de puerto o X días terrestre (se puede obtener de un maestro)
NACIONALIZACIÓN
Nombre del campo
Descripción
DESPACHANTE
Responsable del despacho.
OK DESPACHANTE
Indica si el despachante tiene toda la documentación correcta (factura, BL, etc.) luego que se le envía la documentación y responde que está todo OK
OK CRUCE / OK CARGA
Validación operativa que puede cruzar el proveedor la mercadería por tierra
MONTO GASTOS AR$
Monto estimado del despacho aduanero informado por el despachante.
PAGO MARITIMA
Registro del pago a la marítima (puede contener la posible semana de pago (Ej. W22), la fecha de pago, el estado de Pagado, o la info que hay fondos)
MONTO VEP USD
Impuesto arancelario por la mercadería; es informado por despachante.
PAGO ADUANA
Registro del pago a la aduana (puede contener la posible semana de pago (Ej. W22), la fecha de pago, el estado de Pagado, o el código del pago)
FECHA OFICIALIZACION
Fecha en que se nacionaliza la mercadería, la conoce el despachante
FECHA SALIDA Puerto/DF/FRONTERA
Informada por despachante, en caso de terrestre lo hace área importaciones con transportista.
DESPACHO / ZFI ZFE
Número de despacho asociado, va de la mano con el canal
CANAL
Canal aduanero (verde/rojo). Lo informa el despachante
INGRESO A SAP
Nombre del campo
Descripción
LLEGADA GARIN
Fecha en la cual llega realmente la mercadería a depósito.
Nº 55 (PEDIDO)
identificador en SAP que marca que está en tránsito la mercadería de ese embarque; se realiza cuando el proveedor confirma el mismo
Nº 18 (PRE INGRESO)
Código de preingreso en SAP de la mercadería que está llegando
ENVIO PRE-INGRESO
Fecha de aviso al depósito sobre cuando está llegando la mercadería.
OK DEPOSITO
Fecha de confirmación de recepción y control de mercadería.
FECHA INGRESO SAP
Fecha en que se carga el OK en SAP de esa entrega; puede ser unos días más tarde
COEFICIENTE
Cálculo realizado por SAP (basado en la trx Nº 18).
OBSERVACIONES DE COSTEO
Alertas o comentarios sobre el coeficiente.
PAGO A PROVEEDOR
Nombre del campo
Descripción
BANCO
Es el banco a través del cual se paga la factura; se debe nominar cuando se hace el despacho
Condición de Pago Proveedor
La condición esta acordada en la OC.
Condición de Pago Facturada
Es la condición de pago que figura en la factura del proveedor; es un dato informativo; puede diferir con la condición de que decía la OC correspondiente
Vencimiento Estimado
Fecha estimada de pago. Se calcula de la fecha estimada de arribo más la condición de pago del proveedor en la OC
Vencimiento Real
Es la fecha real de pago al proveedor que informa Tesorería; puede ser anterior a la fecha de vencimiento porque adelanté el pago. Este dato lo puede cargar Tesorería.
FECHA DE PAGO REAL
Es la fecha real de pago al proveedor que informa Tesorería; puede ser anterior a la fecha de vencimiento porque adelanté el pago
OBSERVACIONES / INTERVENCIONES
Se asienta trackeos de movimientos de flujos u observaciones necesarias sobre toda la carpeta/OC
8. CIRCUITO DE INFORMACIÓN ACTUAL
El siguiente esquema describe cómo fluye la información entre los actores del proceso hoy. Todo el circuito es manual: no existe ningún sistema que distribuya información automáticamente.
Flujos de información relevados
Origen
Destino
Información
Medio
Frecuencia
Manual / Auto
Proveedor
Importaciones
Confirmación de pedido, documentos de embarque, factura, B/L
Correo
Por evento
MANUAL
Importaciones
SAP
Estado OC, costeo, ingresos de stock
Carga manual
Por evento
MANUAL
Importaciones
Despachante
Documentación para despacho aduanero
Correo
Por embarque
MANUAL
Importaciones
Depósito Garín
Detalle del embarque (extraído de SAP Tx18)
Correo
Por embarque
MANUAL
Importaciones
Comercial/Ventas
Planilla de Arribos con fechas estimadas por producto
Drive
Semanal
MANUAL
Importaciones
Tesorería
Reporte de vencimientos de pago (próximos 15 días)
Correo
Semanal
MANUAL
Importaciones
Dirección (José)
Justificación de variaciones ZMR21
Correo
Por embarque
MANUAL
SAP
Importaciones
Reporte ZMR21 de variación de coeficientes
SAP interno
Por embarque
AUTOMÁTICO
Depósito Garín
Importaciones
Confirmación de recepción (planilla escaneada)
Correo
Por embarque
MANUAL
Naviera
Importaciones
ETA (estimado de arribo al puerto)
Correo
Por llegada
MANUAL
9. PROBLEMAS IDENTIFICADOS - Diagnóstico
Diagnóstico crítico: El proceso íntegro de Importaciones opera 100% de forma manual y artesanal. No existe un sistema centralizado que integre las múltiples etapas, documentos, actores y estados por los que pasa cada embarque.
Los siguientes problemas fueron identificados a partir de los relevamientos realizados.
Se describe el punto de dolor, la descripción del problema, la fase que afecta y la criticidad.
ID
PROBLEMA
FASE
CRITICIDAD
P0
Toda la trazabilidad de la operación de importaciones está montada en una planilla Excel maestra
F1-F10
CRITICO
P1
Sin apertura por artículo en la planilla maestra, no tiene desglose por ítem, lo que obliga a rastreos manuales en SAP, solo nivel de OC/carpeta
F1-F10
CRÍTICO
P2
Triple control manual artículo × artículo en cada OC (OC vs SAP vs proveedor vs doc. final)
F1-F2
ALTO
P3
Sin tabla de conversión código SAP ↔ código proveedor. La identificación del artículo se realiza por descripción.
F1
ALTO
P4
Seguimiento de producción 100% mental + cuaderno físico
F3
CRÍTICO
P5
Planilla de Arrivals a Comercial elaborada manualmente cada viernes
F5-F10
ALTO
P6
Sin seguimiento automático de barcos (MarineTraffic solo en urgencias)
F3-F5
BAJO
P7
Reporte de pagos a Tesorería: solo 15 días de visibilidad, elaborado a mano
F9-F10
ALTO
P8
Importaciones recibe confirmación de que el pago al proveedor fue ejecutado cuando consulta a Tesorería; tarea manual
F8
MEDIO
P9
Confirmación del depósito por correo + planilla escaneada enviada por mail.
F7
MEDIO
P10
Planilla Excel aparte para control de saldos de cada OC; riesgo de errores en el seguimiento de saldos
F4-F10
CRITICO
P11
Sin reporte histórico de coeficientes de costo por proveedor / carpeta
F7
MEDIO
P12
Todas las notificaciones de vencimientos, cambios de estado de las importaciones, solicitudes de fondos, estados de la documentación, etc  entre áreas se generan en forma manual utilizando distintos canales de comunicación.
F1-F10
ALTO
P13
El despachante funciona por fuera de esta planilla de trazabilidad de carpeta
F6
MEDIO
P14
OC generada por Comercial sin formato estándar (Excel, PDF o papel) — Importaciones valida manualmente existencia en SAP, coherencia de artículos y alta de códigos faltantes antes de enviar al proveedor
F1
ALTO
P15
Existen tres numeraciones paralelas sin vinculación explícita (Número interno de carpeta/ OC SAP / contrato marco) — riesgo de desincronización y confusión operativa
F1-F10
ALTO
P16
Alta de nuevos productos/proveedores en SAP puede demorar 24–48 h y bloquea el inicio del proceso; no existe señal visual de pendiente en el flujo actual
F1
MEDIO
P17
Un mismo despacho puede contener productos de distintas órdenes; hoy sin modelo de datos que asocie 1 despacho → N órdenes, lo que obliga a controles manuales cruzados
F4-F8
ALTO
P18
Las facturas del proveedor llegan 100% por mail en PDF y son cargadas manualmente campo a campo; el monto puede diferir de la OC sin alertas automáticas de desvío. Puede no contener el dato de OC lo que obliga a deducir la info.
F4
ALTO
P19
Datos críticos del despachante (canal verde/rojo, fecha de oficialización, número de despacho, salida de puerto) llegan informalmente por WhatsApp/mail sin carga estructurada en ningún sistema
F6
ALTO
P20
Existen saldos a favor ("hay fondos") con despachantes sin visibilidad centralizada ni conciliación sistemática en el flujo de importaciones
F6
MEDIO
P21
Documentación física de cumplimiento regulatorio (AFIP, DUA) sin digitalización centralizada; trazabilidad documental por carpeta es manual y dispersa
F4-F10
MEDIO
P22
Las variaciones de costo al cierre (1%–4% detectadas) no generan alertas automáticas ni registro sistemático de desvíos por carpeta/proveedor para análisis futuro
F8-F10
MEDIO
P23
Comercial recibe información de embarques solo cuando la mercadería ya está embarcada, sin visibilidad anticipada de fechas estimadas para planificación en comercial y de stock
F5-F10
ALTO
P24
La planilla maestra en su cabecera contiene información que podría evitarse ya que se encuentra en la apertura de la OC (PRODUCTO, LÍNEA)
F1
MEDIO
P25
La documentación se comparte a través de carpetas físicas que se crean en repositorios dentro de la estructura de red
F1
ALTO
10. EXCELS AUXILIARES
Además de la planilla Excel maestra, el área de importaciones utiliza planillas auxiliares.
La tabla siguiente describe, el Excel utilizado, su propósito, quien lo usa y si se encuentra dentro o fuera del MVP.
Excel auxiliar
¿En MVP?
Propósito (verificado)
Quién lo usa
Control de saldos por carpeta / subcarpeta
✅ DENTRO
Controla cuánto queda pendiente de recibir por ítem en cada embarque parcial. Se descuenta cada vez que llega una entrega.
Johana / Julián
Planilla de Arrivals semanal (Carpeta compartida)
✅ DENTRO
Reporte manual de fechas estimadas de arribo por producto. Se sube al Drive todos los viernes para que Comercial y Tesorería consulten.
Comercial (consulta)
Reporte de vencimientos para Tesorería
✅ DENTRO
Reporte manual enviado todos los viernes por mail a Tesorería. Cubre los próximos 15 días de vencimientos de pago a proveedores.
Johana/Julián → Tesorería
Cash flow de pagos para Tesorería (semana W##)
✅ DENTRO
Proyección semanal de pagos: flete marítimo, VEP (aranceles AFIP), proveedor. Se calcula manualmente con calendario por Comex.
Johana/Julián → Tesorería
Planilla de notas de crédito de proveedores
❌ FUERA
Registra notas de crédito abiertas por mercadería incorrecta, faltante o dañada. Vinculada al número de carpeta. ~3 abiertas simultáneamente.
Johana / Julián
Excel de costeos aparte
❌ FUERA
Planilla auxiliar para hacer seguimiento de variaciones de coeficientes. Existía como complemento antes de validar vs. reporte ZMR21 de SAP.
Johana / Julián
Excel de bajada de SAP para proyección de compras (Comercial)
❌ FUERA
Excel propio de José/Mateo/Nicolás con movimientos de SAP, stocks y proyecciones de venta. Genera la OC que se pasa a Comex.
José / Mateo / Nicolás (Comercial)
11. ESTADOS Y TRANSICIONES EN SAP
El estado de cada Orden de Compra en SAP evoluciona a lo largo del proceso. Los estados son actualizados manualmente por el equipo de Importaciones en los momentos clave.
Estado SAP
Transacción
Significado
Disparador
45
Transacción 45
OC creada y enviada al proveedor
Carga manual por Importaciones al recibir la OC de Comercial
55
Transacción 55
Embarque confirmado por el proveedor
Actualización manual luego del control artículo × artículo
18
Transacción 18
Pre-ingreso / Recepción de mercadería
Ingreso manual tras la recepción física en depósito Garín
—
Reporte ZMR21
Variación de coeficientes de costo
Generado automáticamente por SAP al ingresar Tx 18
Transición de estados:
OC recibida  →  SAP 45 (creada)  →  SAP 55 (confirmada)  →  SAP 18 (recepción)  →  ZMR21 (variación de costos)  →  Stock disponible para venta
12. DEFINICIONES Y TÉRMINOS CLAVES
Sigla
Significado en inglés
Traducción
Uso / Contexto en Dimagraf
SAP
Systems, Applications, and Products
Sistema ERP
Software que Dimagraf usa para costeo, inventario y seguimiento de OC. Transacciones clave: 45, 55, 18.
Tx 45
Transacción 45 (SAP)
Orden de Compra en SAP
Estado inicial cuando se crea una OC en SAP.
Tx 55
Transacción 55 (SAP)
Confirmación en SAP
Estado intermedio al que pasa la orden de compra luego de recibir y validar la confirmación del proveedor
Tx 18
Transacción 18 (SAP)
Pre-ingreso / Recepción en SAP
Estado final cuando la mercadería es recibida en depósito. Se ingresan todos los costos.
ZMR21
Reporte de Variación de Coeficientes (SAP)
Reporte de Costos en SAP
Reporte que SAP genera al ingresar Tx 18. Compara el coeficiente de costo actual vs. el anterior.
ETA
Estimated Time of Arrival
Hora Estimada de Arribo
Fecha en que la naviera informa que el barco llegará al puerto de Buenos Aires.
LCL
Less Than Container Load
Carga Menor a Contenedor (Grupaje)
Cuando la mercadería de Dimagraf no llena un contenedor, se comparte con otros clientes. Requiere contacto frecuente con naviera.
FCL
Full Container Load
Contenedor Completo
Cuando la mercadería ocupa un contenedor entero. Más rápido y eficiente que LCL.
FOB
Free On Board
Libre a Bordo del Barco
Incoterm: el proveedor coloca la mercadería en el barco. Dimagraf paga el flete desde allá.
CIF
Cost, Insurance, and Freight
Costo, Seguro y Flete
Incoterm: el proveedor paga TODA la logística hasta Buenos Aires (flete + seguro incluidos).
B/L
Bill of Lading
Conocimiento de Embarque
Documento marítimo que prueba la propiedad de la mercadería. Es el 'título de propiedad' de la carga.
CRT
Carta de Porte
Comprobante de Transporte Terrestre
Documento equivalente al B/L pero para transporte por camión (usado en importaciones desde Brasil).
DUA
Declaración Única de Aduanas
Documento Aduanal
Documento que se presenta ante AFIP para nacionalizar la mercadería.
NCM
Nomenclatura Común del MERCOSUR
Clasificación Arancelaria
Código de 8 dígitos que clasifica cada producto para determinar qué aranceles paga en aduana.
SICNEA
Sistema Integral de Información de Gestión de Aduanas
Portal AFIP
Portal donde se registran las importaciones y se obtiene información sobre trámites aduanales.
ARCA
Sistema de Gestión Aduanera
Portal AFIP
Portal donde se valida despachos, se autoriza canales (Verde o Rojo) y se pagan aranceles.
VEP
Volante Electrónico de Pago
Comprobante de Pago Aduanal
Boleta electrónica para pagar aranceles e impuestos ante AFIP antes de retirar mercadería.
Canal Verde
Green Lane
Carril Verde (Aduanas)
Inspección aduanal SIN apertura de contenedor. La mercadería se libera rápidamente sin inspección física.
Canal Rojo
Red Lane
Carril Rojo (Aduanas)
Inspección aduanal CON apertura y revisión física del contenedor. Causa demoras y posibles sobrecostos.
SPOF
Single Point of Failure
Punto Único de Falla
Elemento crítico cuya ausencia causa que el proceso falle completamente. En Dimagraf: Johana es SPOF.
13. HISTORIAL DE VERSIONES DEL REGISTRO
Fecha
Versión
Descripción
Realizó
Controló
Aprobó
20/05/2026
1.0
Armado inicial
Roberto Abadia
Beatriz Czarniecki/ Ricardo Lazzati
Beatriz Czarniecki

# Follow up OC- 2026.xlsx

## FOLLOW
Orden de compra |  |  |  |  |  |  |  |  |  |  |  | FACTURACION |  |  |  |  |  |  | LOGISTICA |  |  |  |  |  |  |  |  |  |  | NACIONALIZACION |  |  |  |  |  |  |  |  |  |  | Ingreso a SAP |  |  |  |  |  |  |  | PAGO A PROVEEDOR |  |  |  |  |  | Observaciones Finales
CARPETA | FECHA O/C | Proveedor | Referencia Proveedor | Producto | Linea | Cantidad SAP | Unidad SAP | Monto OC | Moneda | Incoterm | Contrato Marco | FACTURA/S | FECHA FACTURA/S | TOTAL IMPORTE FACTURA/S | UME | Unidad UME | PESO NETO KGS | PESO BRUTO KGS | ESTADO | Fecha Embarque estimada | Fecha Embarque Real | Vapor | MEDIO de TRANSPORTE | EMPRESA DE TRANSPORTE/FF | CANTIDAD DE CTNS / CAMIONES | BL/CRT/AWB | Fecha Aribo Estimado | Fecha Aribo Real | ARRIBO ESTIMADO GARIN | DESPACHANTE | OK DESPACHANTE | OK CRUCE / OK CARGA | MONTO GASTOS AR$ | PAGO MARITIMA | MONTO VEP USD | PAGO ADUANA | FECHA OFICIALIZACION | FECHA SALIDA de Puerto/DF/FRONTERA | DESPACHO / ZFI  ZFE | CANAL | LLEGADA GARIN | Nº 55 (PEDIDO) | Nº 18 (PRE INGRESO) | ENVIO PRE-INGRESO | OK DEPOSITO | FECHA INGRESO SAP | COEFICIENTE | OBSERVACIONES DE COSTEO | BANCO | Condicion de Pago Proveedor | Condicion de Pago Facturada | Ventimiento Estimado | Vencimiento Real | FECHA DE PAGO REAL | OBSERVACIONES / INTERVENCIONES
Comex/es el número de la OC | Mandan al proveedor la OC y luego cargan la OC SAP | Nombre COMEX | Nro interno del proveedor de la confirmación del pedido | idea de las línea que trae la OC | Linea a las cual pertenece | Total OC multiplicado por factor común | Tonelasdas m2 |  |  | Tipo de flete | nro SAP interno que lo da SAP // sigue siendo el mismo por las aperturas | Llega por mail en pdf | fecha de generación de la Factura | Importe total misma moneda | Cantidad Unidad de medida estadística: cant de sa´p; redundante | redundante | en la factura | en la factura | estados posibles
Pendiente de embarque | Se sabe cuando se pone la OC: OC + 60 dias corridos (por proveedor; en el maestro) | cuando tenemos la documentación de conocimiento de embarque y ahí está la fecha real de embarque | nombre buque/camión empresa/avión (sólo se aclara mas por barco) | Maritimo/terrestre/aéreo | empresa contratata/MSC/Cargo | Cant de cointeners (en el conocimiento de embarque) y cant camiones lo dice el dueño de la flota | nro de conocimiento de titularidad
crt por tierra | Fecha real de embarque más X dias (por maestro); pago de despacho | fecha real; para pagar el despacho | feha de arriba real + x dias de sacar la info de puerto (maetsro) | quién es | si tiene todos los documentos; no se usa mucho // factura con datos OK, conocimiento embarque ok cant, peso, fecha, proveedor, posición arancelaria (nomenclador); posición arnacelaria dice los impuestos; certificado de origen | no se está usando; se deberia | estimado; lo informa el despachante | dato de cuando se paga a la maritima; nro comprobante y semana de pago (week) | Impuesto; lo sabe el despachante | código/semana | fecha que se nacionaliza; lo sabe el despachante | informa el despachante; terrestre no tanto; lo hace comex con el transportista | nro de despacho; va de la mano con la fecha y el canal | verde/rojo | fecha real de llegada | cód SAP cuando se abren en parciales | códigos de Ingreso de sap sin costo sin precio | fecha de aviso al depósito que se llegando la mercaderia | llegó la mercaderia y el depsósitoi la control+ó y mando el conforme | FECHA INGRESO SAP; puede ser unos dias mas tarde | calculo de sap; lo hace con el 18 | disparo del coeficiente/warning | banco que paga la factura; nominar cuando se hace el desapacho | está en la OC | no es la misma que el pago a proveedor | calculo; lo puede cargar Tesorería | calculo | Puede cargarla tesosria
 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | en Tránsito
 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | Arribando a aduano
 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | Oficializado
 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | En stock

