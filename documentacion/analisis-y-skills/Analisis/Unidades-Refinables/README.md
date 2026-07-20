# Unidades refinables - Dimagraf ERS Consolidado v1.0

Fuente: `Analisis/Dimagraf-ERS-Consolidado-v1.0.docx`

Criterio aplicado:
- Convertir solo comportamiento funcional con sentido de caso de uso.
- Excluir RNF, detalle tecnico y metadatos de arquitectura.
- Agrupar acciones que pertenezcan a una misma intencion de negocio.
- Marcar ambiguedades o conflictos cuando aparecen.

## Resumen de unidades

| ID | Nombre sugerido | RF origen |
|---|---|---|
| UR-001 | gestionar-orden-de-compra-y-saldos-por-articulo | RF-001, RF-002, RF-005, RF-014 |
| UR-002 | gestionar-embarques-y-subcarpetas-multi-oc | RF-003, RF-004 |
| UR-003 | seguir-produccion-y-estado-operativo | RF-006, RF-007 |
| UR-004 | gestionar-documentacion-y-anexos | RF-008, RF-041 |
| UR-005 | gestionar-transito-arribos-y-alertas-operativas | RF-009, RF-010, RF-019, RF-043 |
| UR-006 | gestionar-pagos-vencimientos-y-proyeccion-financiera | RF-011, RF-012, RF-022, RF-047 |
| UR-007 | registrar-recepcion-en-deposito-y-datos-operativos | RF-013, RF-045 |
| UR-008 | administrar-proveedores-configuracion-y-permisos | RF-016, RF-039, RF-044, RF-046 |
| UR-009 | exportar-datos-y-registrar-costeo-sap | RF-017, RF-040 |
| UR-010 | autenticar-usuarios-y-controlar-acceso-por-rol | RF-018 |
| UR-011 | importar-documentos-y-obtener-oc-para-val | RF-024, RF-025, RF-026 |
| UR-012 | comparar-documentos-con-oc | RF-027, RF-028, RF-029, RF-032, RF-033 |
| UR-013 | aprobar-cancelar-y-auditar-validacion | RF-034, RF-035, RF-036, RF-037, RF-038 |
| UR-014 | cargar-articulos-de-oc-en-forma-masiva | RF-042 |

## Unidades del Discovery AS-IS

Fuente: `Analisis/Dimagraf-Dis-Especificación proceso Importaciones.docx`

| ID | Nombre sugerido | Seccion origen |
|---|---|---|
| UR-ASI-001 | originar-y-cargar-orden-de-compra | 5.1 Generacion de la Orden de Compra |
| UR-ASI-002 | confirmar-orden-de-compra-manualmente | 5.2 Confirmacion del Proveedor |
| UR-ASI-003 | seguir-produccion-y-aperturas-parciales | 5.3 Seguimiento de Produccion |
| UR-ASI-004 | preparar-facturacion-y-documentacion-de-embarque | 5.4 Facturacion y Preparacion del Embarque |
| UR-ASI-005 | seguir-transito-y-publicar-arrivals | 5.5 Transito Maritimo / Terrestre |
| UR-ASI-006 | gestionar-despacho-aduanero-y-fondos | 5.6 Despacho Aduanero |
| UR-ASI-007 | recepcionar-mercaderia-e-ingresar-a-sap | 5.7 Recepcion en Deposito/Ingreso a SAP |
| UR-ASI-008 | mantener-maestro-de-proveedores-y-plazos | Secciones 5.1, 5.3 y 5.6 |

## Relacion entre fuentes

- El ERS consolidado describe el `TO-BE` y el alcance comprometido.
- El Discovery describe el `AS-IS` real y sirve para contextualizar los CU.
- Ambos documentos se usan juntos para mantener trazabilidad entre problema actual y solucion futura.

## Unidades generadas en este workspace

- [UR-001 - Gestionar orden de compra](UR-001-gestionar-orden-de-compra.md)
- [UR-002 - Gestionar documentación de embarque](UR-002-gestionar-documentacion-de-embarque.md)
- [UR-003 - Validar despacho aduanero](UR-003-validar-despacho-aduanero.md)

## Detalle de unidades

### UR-001 - gestionar-orden-de-compra-y-saldos-por-articulo
Estado: PRE-REFINADO

Intencion:
Registrar y administrar una OC de importacion con seguimiento a nivel de articulo y control automatico de saldos.

Problema detectado:
La gestion por cabecera no alcanza para controlar consumo real ni cierre de la OC.

Actores:
- Operador de Importaciones
- Administrador del sistema para parametros asociados

Contexto:
Alta y mantenimiento de OCs dentro del flujo de importaciones.

Disparador:
El operador crea o modifica una OC.

Resultado esperado:
La OC queda identificada, sus articulos quedan desglosados y el saldo se actualiza automaticamente.

Flujo estimado:
1. Registrar la OC con su carpeta interna unica.
2. Cargar articulos y cantidades.
3. Calcular saldo pendiente por articulo.
4. Actualizar saldos ante movimientos asociados.
5. Cerrar la OC cuando todos los saldos lleguen a cero.

Reglas detectadas:
- La carpeta interna debe ser unica.
- El saldo se controla por articulo y por OC.
- El cierre de la OC depende del saldo cero global.

Excepciones posibles:
- Carpeta duplicada.
- Saldo negativo por sobreconsumo.

Datos involucrados:
- Proveedor
- Incoterm
- Condicion de pago
- Articulos
- Cantidades
- Saldos

Dependencias:
- MOD-001
- MOD-002

Ambiguedades / dudas:
- No se aclara si la modificacion de una OC abierta tiene limites por tipo de cambio o por embarques ya creados.

Origen:
RF-001, RF-002, RF-005, RF-014

Elementos descartados:
- Detalles de implementacion tecnica del almacenamiento.

### UR-002 - gestionar-embarques-y-subcarpetas-multi-oc
Estado: PRE-REFINADO

Intencion:
Permitir embarques parciales, subcarpetas y asociaciones de un mismo despacho a multiples OCs.

Problema detectado:
Un embarque puede repartir articulos entre varias OCs y necesita trazabilidad independiente.

Actores:
- Operador de Importaciones

Contexto:
Operacion de embarques parciales o consolidados.

Disparador:
Se crea o actualiza un embarque asociado a una OC o a varias OCs.

Resultado esperado:
Se genera la subcarpeta operativa y se descuentan saldos por articulo y por OC.

Flujo estimado:
1. Abrir un embarque.
2. Asociar una o mas OCs.
3. Crear subcarpeta cuando corresponda.
4. Descontar saldos de los articulos involucrados.

Reglas detectadas:
- Una OC puede tener multiples subcarpetas.
- Un mismo despacho puede incluir articulos de varias OCs.

Excepciones posibles:
- Intentar embarcar mas unidades que el saldo disponible.

Datos involucrados:
- OC
- Subcarpeta
- Articulo
- Cantidad

Dependencias:
- RF-003, RF-004
- MOD-003

Origen:
RF-003, RF-004

### UR-003 - seguir-produccion-y-estado-operativo
Estado: PRE-REFINADO

Intencion:
Registrar el estado de produccion pre-embarque y reflejar el avance operativo del proceso.

Problema detectado:
Sin seguimiento formal, el equipo no sabe en que punto esta cada OC o embarque.

Actores:
- Operador de Importaciones
- Comercial como consumidor de estado

Contexto:
Seguimiento previo al embarque y estados del proceso alineados con la operacion.

Disparador:
Cambios de estado o actualizacion manual del seguimiento.

Resultado esperado:
El sistema conserva el estado de produccion y expone el estado operativo del flujo.

Flujo estimado:
1. Registrar avance pre-embarque.
2. Guardar observaciones.
3. Mostrar historial cronologico.
4. Exponer el estado para otras vistas.

Reglas detectadas:
- Los estados deben alinearse con el flujo operativo definido.

Excepciones posibles:
- Falta de datos de avance.

Datos involucrados:
- Estado de produccion
- Timestamp
- Observaciones

Dependencias:
- RF-006, RF-007
- MOD-004

Origen:
RF-006, RF-007

### UR-004 - gestionar-documentacion-y-anexos
Estado: PRE-REFINADO

Intencion:
Adjuntar, clasificar y visualizar documentacion asociada a cada embarque.

Problema detectado:
La documentacion necesaria debe quedar ordenada por tipo y por visibilidad.

Actores:
- Operador de Importaciones
- Roles con acceso a anexos

Contexto:
Embarques, carpetas y documentos anexos.

Disparador:
Carga de un documento o consulta de anexos.

Resultado esperado:
Los documentos quedan asociados al embarque y visibles segun rol y tipo.

Flujo estimado:
1. Subir documento.
2. Clasificar por tipo.
3. Asociar permisos de visualizacion.
4. Consultar anexos desde la instancia correspondiente.

Reglas detectadas:
- Un anexo debe poder clasificarse por tipo.
- La visibilidad puede depender del rol.

Excepciones posibles:
- Documento sin tipo definido.

Datos involucrados:
- Tipo de documento
- Rol
- Archivo adjunto

Dependencias:
- RF-008, RF-041
- MOD-005

Ambiguedades / dudas:
- Existe una contradiccion funcional sobre si los anexos van en una solapa general o dentro de la instancia que los requiere.

Origen:
RF-008, RF-041

### UR-005 - gestionar-transito-arribos-y-alertas-operativas
Estado: PRE-REFINADO

Intencion:
Gestionar ETA, arribos en tiempo real y alertas operativas para Importaciones y Comercial.

Problema detectado:
El seguimiento manual en planillas no permite visibilidad confiable ni oportuna.

Actores:
- Operador de Importaciones
- Comercial
- Tesoreria, como destinatario de alertas relacionadas

Contexto:
Transito, arribo y notificaciones de eventos relevantes.

Disparador:
Actualizacion de ETA, proximidad de arribo o evento operativo relevante.

Resultado esperado:
El sistema muestra arribos actualizados y genera alertas segun reglas del negocio.

Flujo estimado:
1. Registrar ETA y fechas reales.
2. Actualizar vista de arribos.
3. Emitir alertas por eventos relevantes.

Reglas detectadas:
- La vista de arribos debe ser en tiempo real.
- Las alertas operativas deben ser configurables.

Excepciones posibles:
- Datos de ETA faltantes o inconsistentes.

Datos involucrados:
- ETA
- Medio de transporte
- Estado de arribo
- Notificacion

Dependencias:
- RF-009, RF-010, RF-019, RF-043
- MOD-006

Origen:
RF-009, RF-010, RF-019, RF-043

### UR-006 - gestionar-pagos-vencimientos-y-proyeccion-financiera
Estado: PRE-REFINADO

Intencion:
Controlar vencimientos, proyeccion de pagos y saldos financieros vinculados a la importacion.

Problema detectado:
Tesoreria necesita anticipar pagos y controlar compromisos con proveedores y despachantes.

Actores:
- Tesoreria
- Direccion
- Operador de Importaciones

Contexto:
Pagos a proveedor, fletes, aduana y control de saldos a favor.

Disparador:
Vencimiento proximo, necesidad de proyectar flujo o registrar un pago.

Resultado esperado:
El sistema genera alertas, calcula proyecciones y administra la instancia de pagos de la carpeta.

Flujo estimado:
1. Calcular vencimientos y proyecciones.
2. Alertar vencimientos.
3. Registrar pagos ejecutados.
4. Consultar saldos con despachantes.
5. Exponer una instancia de pagos por carpeta.

Reglas detectadas:
- Los parametros de pago deben poder configurarse.
- El saldo a favor con despachantes se consulta antes de transferir fondos.

Excepciones posibles:
- Saldo insuficiente.
- Condicion de pago faltante.

Datos involucrados:
- Fechas de vencimiento
- Importes
- Saldo a favor
- Estado de pago

Dependencias:
- RF-011, RF-012, RF-022, RF-047
- MOD-010

Origen:
RF-011, RF-012, RF-022, RF-047

### UR-007 - registrar-recepcion-en-deposito-y-datos-operativos
Estado: PRE-REFINADO

Intencion:
Registrar la recepcion fisica en deposito y sus diferencias respecto de lo esperado.

Problema detectado:
El deposito necesita confirmar ingreso y reportar discrepancias.

Actores:
- Depósito (Garin)
- Operador de Importaciones

Contexto:
Recepcion fisica e ingreso de mercaderia/articulos al deposito.

Disparador:
Arribo o recepcion efectiva de la carga.

Resultado esperado:
Queda registrada la recepcion y las discrepancias si existieran.

Flujo estimado:
1. Confirmar recepcion.
2. Registrar diferencias.
3. Exponer datos operativos del articulo recibido.

Reglas detectadas:
- La vista de deposito debe incluir UME y UM.

Excepciones posibles:
- Recepcion parcial.
- Diferencia de cantidades.

Datos involucrados:
- Articulos recibidos
- UME
- UM
- Discrepancias

Dependencias:
- RF-013, RF-045
- MOD-008

Origen:
RF-013, RF-045

### UR-008 - administrar-proveedores-configuracion-y-permisos
Estado: PRE-REFINADO

Intencion:
Mantener configuracion maestra de proveedores, parametros por proveedor y permisos por rol/campo.

Problema detectado:
Parte de la operacion depende de reglas configurables y no de hardcode.

Actores:
- Administrador del sistema

Contexto:
Maestros, configuracion y acceso al sistema.

Disparador:
Alta o ajuste de proveedor, permisos o roles.

Resultado esperado:
La configuracion queda disponible para el resto del sistema con fallback al valor global cuando aplique.

Flujo estimado:
1. Mantener el maestro de proveedores.
2. Definir parametros por proveedor.
3. Configurar que campos puede editar cada rol.
4. Asignar multiples roles a un mismo usuario.

Reglas detectadas:
- Los parametros por proveedor tienen prioridad sobre el global.
- Un usuario puede tener mas de un rol.

Excepciones posibles:
- Parametro faltante en proveedor.

Datos involucrados:
- Proveedor
- Idioma de documentos
- Tolerancias
- Umbral de confianza
- Roles
- Permisos por campo

Dependencias:
- RF-016, RF-039, RF-044, RF-046
- MOD-012

Ambiguedades / dudas:
- RF-044 menciona dependencia RNF-004, pero funcionalmente describe una regla de permisos.

Origen:
RF-016, RF-039, RF-044, RF-046

### UR-009 - exportar-datos-y-registrar-costeo-sap
Estado: PRE-REFINADO

Intencion:
Preparar informacion operativa para carga manual en SAP y registrar costeo.

Problema detectado:
SAP sigue siendo fuente externa y la operacion necesita puentes manuales consistentes.

Actores:
- Operador de Importaciones
- Direccion o Finanzas como consumidor de costeo

Contexto:
Cierre operativo, costeo y exportacion de datos.

Disparador:
Necesidad de cargar informacion en SAP o analizar costos.

Resultado esperado:
El sistema genera datos exportables y permite registrar costeo y referencia SAP.

Flujo estimado:
1. Consolidar datos de la operacion.
2. Exportar a formato utilizable.
3. Registrar referencia SAP y costos.

Reglas detectadas:
- El sistema no modifica SAP directamente.

Excepciones posibles:
- Datos incompletos para costeo.

Datos involucrados:
- Tx 45, 55, 18
- Coeficiente
- Referencia SAP

Dependencias:
- RF-017, RF-040
- MOD-009

Origen:
RF-017, RF-040

### UR-010 - autenticar-usuarios-y-controlar-acceso-por-rol
Estado: PRE-REFINADO

Intencion:
Permitir acceso seguro al sistema y restringir pantallas y acciones segun rol.

Problema detectado:
La aplicacion requiere control de acceso centralizado y trazable.

Actores:
- Todos los usuarios internos y externos

Contexto:
Ingreso al sistema, sesiones y autorizaciones.

Disparador:
Intento de acceso a cualquier pantalla o accion sensible.

Resultado esperado:
El usuario solo accede a lo permitido por su rol o combinacion de roles.

Flujo estimado:
1. Autenticar usuario.
2. Validar sesion.
3. Resolver permisos por rol.
4. Bloquear accesos no habilitados.

Reglas detectadas:
- La sesion expira por inactividad.
- Los perfiles se administran desde MOD-012.

Excepciones posibles:
- Credenciales invalidas.
- Cuenta bloqueada.

Datos involucrados:
- Usuario
- Credencial
- Rol
- Sesion

Dependencias:
- RF-018

Origen:
RF-018

### UR-011 - importar-documentos-y-obtener-oc-para-val
Estado: PRE-REFINADO

Intencion:
Cargar documentos externos y recuperar la OC del sistema como fuente de verdad para validacion.

Problema detectado:
El control manual de confirmaciones y preembarque se reemplaza por una validacion automatica.

Actores:
- Operador de Importaciones

Contexto:
Componente VAL, sobre confirmaciones y facturas de proveedor.

Disparador:
Carga de un documento de proveedor para validar.

Resultado esperado:
El sistema importa el documento y obtiene la OC asociada para comparacion.

Flujo estimado:
1. Cargar documento.
2. Curar el archivo para su analisis.
3. Recuperar la OC desde MOD-001.

Reglas detectadas:
- La OC es la unica fuente de verdad.
- El documento puede ser PDF o Excel.

Excepciones posibles:
- Documento no compatible.

Datos involucrados:
- Archivo de confirmacion
- Archivo de factura
- OC

Dependencias:
- RF-024, RF-025, RF-026
- MOD-004, MOD-001

Origen:
RF-024, RF-025, RF-026

### UR-012 - comparar-documentos-con-oc
Estado: PRE-REFINADO

Intencion:
Comparar articulos de documentos externos contra la OC por SKU, descripcion y cantidad.

Problema detectado:
La validacion necesita combinar comparacion exacta y semantica.

Actores:
- Operador de Importaciones

Contexto:
Etapa de comparacion del componente VAL.

Disparador:
Documento cargado y OC disponible.

Resultado esperado:
El sistema determina coincidencias y diferencias por articulo.

Flujo estimado:
1. Comparar por SKU.
2. Comparar por descripcion.
3. Comparar cantidades.
4. Consolidar diferencias.
5. Mostrar resultado por articulo.

Reglas detectadas:
- SKU exacto.
- Descripcion con matching semantico.
- Cantidad con tolerancia configurable.

Excepciones posibles:
- Descripcion ambigua.
- Diferencia de cantidad.

Datos involucrados:
- SKU
- Descripcion
- Cantidad
- Umbral de similitud

Dependencias:
- RF-027, RF-028, RF-029, RF-032, RF-033

Origen:
RF-027, RF-028, RF-029, RF-032, RF-033

### UR-013 - aprobar-cancelar-y-auditar-validacion
Estado: PRE-REFINADO

Intencion:
Tomar una decision sobre la validacion y dejar trazabilidad completa de la ejecucion.

Problema detectado:
El flujo no termina en la comparacion; necesita aprobacion, rechazo y auditoria.

Actores:
- Operador de Importaciones
- Sistema, para notificaciones de error

Contexto:
Final de la validacion automatica.

Disparador:
Resultados comparativos disponibles.

Resultado esperado:
El usuario aprueba o cancela y el sistema registra auditoria de la decision.

Flujo estimado:
1. Visualizar el comparativo.
2. Aprobar o cancelar.
3. Registrar auditoria.
4. Notificar errores si el servicio de IA falla o si el documento no es procesable.

Reglas detectadas:
- La decision puede ser OK aun con diferencias dentro del margen de negocio.
- Debe quedar registro de usuario, fecha, resultado y confianza.

Excepciones posibles:
- Error de OpenAI.
- Timeout.
- Documento con baja confianza.

Datos involucrados:
- Decision final
- Timestamp
- Resultado por articulo
- Porcentaje de confianza

Dependencias:
- RF-034, RF-035, RF-036, RF-037, RF-038

Origen:
RF-034, RF-035, RF-036, RF-037, RF-038

### UR-014 - cargar-articulos-de-oc-en-forma-masiva
Estado: PRE-REFINADO

Intencion:
Permitir una forma masiva de cargar articulos de una OC.

Problema detectado:
La carga manual articulo por articulo no siempre es viable.

Actores:
- Operador de Importaciones

Contexto:
Alta o mantenimiento de OCs.

Disparador:
Necesidad de importar una lista de articulos.

Resultado esperado:
La OC queda poblada con articulos desde un archivo o fuente masiva.

Flujo estimado:
1. Importar archivo.
2. Validar estructura.
3. Crear o actualizar articulos.

Reglas detectadas:
- Debe contemplar codigo de articulo y cantidad.

Excepciones posibles:
- Archivo invalido.

Datos involucrados:
- Codigo de articulo
- Cantidad
- Archivo de importacion

Dependencias:
- RF-042

Origen:
RF-042

## Elementos descartados

### RNF excluidos
- RNF-001 Usabilidad
- RNF-002 Performance
- RNF-003 Disponibilidad
- RNF-004 Seguridad de perfiles
- RNF-005 Trazabilidad
- RNF-006 Compatibilidad SAP no intrusiva
- RNF-007 Escalabilidad
- RNF-008 Mantenibilidad
- RNF-009 Integracion futura
- RNF-011 Seguridad de autenticacion
- RNF-012 Interfaz clara
- RNF-013 Performance de comparacion
- RNF-014 Control de acceso a validaciones
- RNF-015 Trazabilidad de validacion
- RNF-016 Escalabilidad de grillas

### Ruido tecnico o de arquitectura excluido
- Stack tecnologico
- Pipeline tecnico por etapas
- Endpoints HTTP
- Entidades internas de implementacion
- Mecanismos de curado, masking y retry
- Detalle de modelo OpenAI y JSON de salida

### Historicos o reemplazados
- RF-021 fue reemplazado funcionalmente por el componente VAL; se conserva solo por trazabilidad historica.

## Siguiente paso sugerido

Tomar estas unidades y pasar la siguiente skill: `refinamiento`.
