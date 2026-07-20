# Unidades refinables - Especificacion del Proceso Actual de Importaciones

Fuente: `Analisis/Dimagraf-Dis-Especificación proceso Importaciones.docx`

Criterio aplicado:
- Extraer solo comportamientos funcionales observables del proceso actual.
- Agrupar pasos que formen una misma intencion operativa.
- Excluir herramientas, estados internos de SAP y detalle logistico puramente tecnico.
- Mantener foco en lo que el proceso hace hoy, no en la solucion futura.

## Resumen de unidades

| ID | Nombre sugerido | Origen |
|---|---|---|
| UR-ASI-001 | originar-y-cargar-orden-de-compra | 5.1 Generacion de la Orden de Compra |
| UR-ASI-002 | confirmar-orden-de-compra-manualmente | 5.2 Confirmacion del Proveedor |
| UR-ASI-003 | seguir-produccion-y-aperturas-parciales | 5.3 Seguimiento de Produccion |
| UR-ASI-004 | preparar-facturacion-y-documentacion-de-embarque | 5.4 Facturacion y Preparacion del Embarque |
| UR-ASI-005 | seguir-transito-y-publicar-arrivals | 5.5 Transito Maritimo / Terrestre |
| UR-ASI-006 | gestionar-despacho-aduanero-y-fondos | 5.6 Despacho Aduanero |
| UR-ASI-007 | recepcionar-mercaderia-e-ingresar-a-sap | 5.7 Recepcion en Deposito/Ingreso a SAP |
| UR-ASI-008 | mantener-maestro-de-proveedores-y-plazos | Secciones 5.1, 5.3 y 5.6 |

## Detalle de unidades

### UR-ASI-001 - originar-y-cargar-orden-de-compra
Estado: PRE-REFINADO

Intencion:
Iniciar el ciclo de importacion creando y registrando la orden de compra que da origen a la carpeta operativa.

Problema detectado:
La OC nace fuera del sistema o en formatos heterogeneos y luego debe ser normalizada para el seguimiento operativo.

Actores:
- Comercial
- Operador de Importaciones

Contexto:
Inicio del proceso de importacion, antes de la confirmacion del proveedor.

Disparador:
Necesidad de reponer stock o planificar demanda.

Resultado esperado:
La OC queda registrada con numeracion de carpeta y datos basicos para el circuito operativo.

Flujo estimado:
1. Comercial identifica la necesidad de importar.
2. Genera la OC.
3. Importaciones revisa articulos, cantidades, precios y proveedor.
4. La OC se envía al proveedor.
5. Se registra la carpeta interna y el estado inicial.

Reglas detectadas:
- La carpeta usa formato AÑO/SECUENCIA.
- El estado inicial se fija al cargar la carpeta.
- La OC puede originarse en Excel, PDF, papel o correo.

Excepciones posibles:
- Articulos inexistentes en SAP.
- Datos incompletos o inconsistentes en la OC.

Datos involucrados:
- Carpeta
- Proveedor
- Producto
- Linea
- Cantidad SAP
- Unidad SAP
- Monto OC
- Moneda
- Incoterm

Dependencias:
- SAP para validacion de articulos existentes.
- Maestro de proveedores.

Ambiguedades / dudas:
- No se define una plantilla unica para la OC de entrada.

Origen:
Seccion 5.1 Generacion de la Orden de Compra

Elementos descartados:
- El detalle de transaccion SAP se considera de soporte y no cambia la intencion funcional principal.

### UR-ASI-002 - confirmar-orden-de-compra-manualmente
Estado: PRE-REFINADO

Intencion:
Verificar que la confirmacion del proveedor coincida con la OC antes de seguir el proceso.

Problema detectado:
La validacion actual es manual y depende del control articulo por articulo del operador.

Actores:
- Operador de Importaciones
- Proveedor

Contexto:
Despues de enviar la OC y antes del embarque.

Disparador:
Recepcion por correo de la confirmacion del proveedor.

Resultado esperado:
La confirmacion queda revisada y, si hay diferencias, se inicia el reclamo al proveedor.

Flujo estimado:
1. El proveedor responde por correo.
2. Importaciones revisa codigo, descripcion, cantidad, precio, formato, incoterm y condicion de pago.
3. Se registra la referencia del proveedor.
4. Si hay diferencias, se reclama por correo.

Reglas detectadas:
- El control es articulo por articulo.
- La confirmacion puede o no acusar recibo.

Excepciones posibles:
- Diferencias con la OC.
- Confirmacion incompleta o ambiguamente redactada.

Datos involucrados:
- Referencia interna del proveedor
- Codigo
- Descripcion
- Cantidad
- Precio
- Formato
- Incoterm
- Condicion de pago

Dependencias:
- OC registrada.
- Correo como canal de entrada.

Ambiguedades / dudas:
- No se especifica el criterio formal para aceptar diferencias menores.

Origen:
Seccion 5.2 Confirmacion del Proveedor

### UR-ASI-003 - seguir-produccion-y-aperturas-parciales
Estado: PRE-REFINADO

Intencion:
Monitorear la produccion del proveedor y gestionar aperturas parciales dentro de una misma carpeta.

Problema detectado:
La produccion puede dividirse en varios embarques y el seguimiento se hace hoy con herramientas manuales.

Actores:
- Operador de Importaciones
- Proveedor

Contexto:
Periodo entre la OC y la facturacion/preparacion del embarque.

Disparador:
Seguimiento recurrente de pendientes o demora detectada.

Resultado esperado:
Se conoce el avance de fabricacion y se abren subcarpetas cuando corresponde.

Flujo estimado:
1. Identificar OC pendientes.
2. Consultar al proveedor sobre el avance.
3. Confirmar fecha estimada de embarque.
4. Si hay parciales, abrir subcarpetas A, B, C...

Reglas detectadas:
- Cada apertura puede tener factura y documentacion propia.
- El seguimiento tiene cadencias periodicas.
- Los casos criticos escalan por canales informales.

Excepciones posibles:
- Demoras en la fabricacion.
- Cargas parciales imprevistas.

Datos involucrados:
- Estado de la OC
- Fecha estimada de embarque
- Subcarpeta
- Factura por apertura

Dependencias:
- Maestro de proveedores para plazos.

Ambiguedades / dudas:
- No se formaliza el catalogo de estados de produccion.

Origen:
Seccion 5.3 Seguimiento de Produccion (Pre-embarque)

### UR-ASI-004 - preparar-facturacion-y-documentacion-de-embarque
Estado: PRE-REFINADO

Intencion:
Recibir y controlar la factura y documentacion de embarque antes de avanzar el proceso.

Problema detectado:
La documentacion tiene distintos formatos segun el medio de transporte y debe revisarse manualmente.

Actores:
- Operador de Importaciones
- Proveedor
- Despachante aduanero

Contexto:
Fase previa al transito, mientras la mercaderia aun esta en origen.

Disparador:
El proveedor notifica que la carga esta lista y envia la documentacion.

Resultado esperado:
La documentacion queda validada y el embarque puede pasar a transito.

Flujo estimado:
1. Recibir factura y documentos de embarque.
2. Revisar datos de titularidad, NCM, pesos, volumen y bultos.
3. Abrir subcarpeta si hay parcialidades.
4. Asignar despachante.
5. Registrar facturas y datos logisticos de la apertura.

Reglas detectadas:
- Cada subcarpeta tiene su propia factura.
- La fecha de embarque estimada se calcula desde la OC.
- La fecha de embarque real se completa con el documento de embarque.

Excepciones posibles:
- Documentacion incompleta.
- Necesidad de clasificacion arancelaria para articulos nuevos.

Datos involucrados:
- Factura
- B/L, CRT, AWB
- Packing list
- Certificado de origen
- UME
- Peso neto
- Peso bruto
- Medio de transporte
- Banco

Dependencias:
- Despachante aduanero
- Maestro de proveedores

Ambiguedades / dudas:
- No se distingue si la revision documental bloquea o solo condiciona la continuidad.

Origen:
Seccion 5.4 Facturacion y Preparacion del Embarque

### UR-ASI-005 - seguir-transito-y-publicar-arrivals
Estado: PRE-REFINADO

Intencion:
Monitorear el transito de la carga y publicar la informacion de arribos para las areas interesadas.

Problema detectado:
La actualizacion de arribos depende de seguimiento manual y de una planilla compartida.

Actores:
- Operador de Importaciones
- Comercial
- Naviera

Contexto:
Embarque ya despachado y en camino.

Disparador:
Recepcion de ETA o cambio en la fecha de arribo.

Resultado esperado:
La planilla de arribos queda actualizada y compartida con Comercial.

Flujo estimado:
1. Recibir ETA por correo.
2. Revisar estado del viaje.
3. Actualizar planilla de Arrivals manualmente.
4. Compartir o re-publicar la informacion.

Reglas detectadas:
- La actualizacion se hace semanalmente para Comercial.
- El seguimiento urgente puede apoyarse en consultas externas.

Excepciones posibles:
- Cambios de fecha.
- Falta de tracking dinamico.

Datos involucrados:
- ETA
- Medio de transporte
- Fecha de arribo
- Planilla de Arrivals

Dependencias:
- Navegacion/forwarder.
- Carpeta compartida de arrivals.

Ambiguedades / dudas:
- No se precisa si la planilla de arrivals tiene versionado formal.

Origen:
Seccion 5.5 Transito Maritimo / Terrestre

### UR-ASI-006 - gestionar-despacho-aduanero-y-fondos
Estado: PRE-REFINADO

Intencion:
Gestionar la nacionalizacion, los pagos asociados y la coordinacion con el despachante.

Problema detectado:
La liberacion aduanera depende de multiples datos manuales y coordinacion de fondos.

Actores:
- Operador de Importaciones
- Despachante Aduanero
- Tesoreria

Contexto:
Arribo de mercaderia y proceso de nacionalizacion.

Disparador:
Arribo del barco o cruce terrestre y necesidad de oficializar.

Resultado esperado:
El despacho queda oficializado, con canal, gastos y fechas registradas.

Flujo estimado:
1. Asignar despachante.
2. Recibir requerimiento de fondos.
3. Coordinar transferencia con Tesoreria.
4. Registrar canal, gastos, VEP y fechas.
5. Coordinar salida de puerto o frontera.

Reglas detectadas:
- El canal puede venir en el documento o consultarse al despachante.
- Puede existir saldo a favor con el despachante.
- Los pagos se organizan por semana.

Excepciones posibles:
- Canal rojo con inspeccion adicional.
- Falta de documentacion o fondos.

Datos involucrados:
- Despachante
- Canal
- Monto gastos AR$
- VEP USD
- Fecha oficializacion
- Fecha salida
- Banco
- Estado

Dependencias:
- Tesoreria
- ARCA/SICNEA
- Maestro de proveedores

Ambiguedades / dudas:
- No queda claro si el circuito de fondos se registra como saldo operativo o como pago formal.

Origen:
Seccion 5.6 Despacho Aduanero (Nacionalizacion)

### UR-ASI-007 - recepcionar-mercaderia-e-ingresar-a-sap
Estado: PRE-REFINADO

Intencion:
Confirmar la llegada al deposito, controlar fisicamente la mercaderia e ingresar la informacion a SAP.

Problema detectado:
La recepcion fisica y el ingreso a SAP hoy dependen de controles manuales y confirmaciones por correo.

Actores:
- Operador de Importaciones
- Depósito (Garín)

Contexto:
Cierre operativo del embarque y liberacion de stock.

Disparador:
Arribo al deposito.

Resultado esperado:
El deposito confirma recepcion, Importaciones registra conformidad e ingresa el costo en SAP.

Flujo estimado:
1. Notificar al deposito con anticipacion.
2. Generar pre-ingreso en SAP.
3. El deposito controla fisicamente la mercaderia.
4. El deposito confirma por correo.
5. Importaciones registra el OK y completa el ingreso a SAP.

Reglas detectadas:
- Si hay discrepancias, la OC queda abierta hasta resolver.
- La documentacion queda archivada para contabilidad.
- El stock queda disponible para Comercial.

Excepciones posibles:
- Faltantes o discrepancias en el control fisico.
- Carga de OK en SAP dias despues de la recepcion real.

Datos involucrados:
- Llegada Garin
- Pre-ingreso SAP
- OK deposito
- Fecha ingreso SAP
- Coeficiente
- Observaciones de costeo

Dependencias:
- SAP
- Deposito
- Planilla maestra

Ambiguedades / dudas:
- No se explicita el umbral exacto para cerrar la OC despues de una discrepancia resuelta.

Origen:
Seccion 5.7 Recepcion en Deposito/Ingreso a SAP

### UR-ASI-008 - mantener-maestro-de-proveedores-y-plazos
Estado: PRE-REFINADO

Intencion:
Administrar los parametros del maestro de proveedores usados para calcular plazos, fechas y coordinaciones operativas.

Problema detectado:
Gran parte del proceso depende de plazos parametrizados por proveedor y de referencias que hoy se cargan manualmente.

Actores:
- Operador de Importaciones
- Administrador del sistema

Contexto:
Configuracion operativa transversal al ciclo de importacion.

Disparador:
Alta o modificacion de proveedor, o necesidad de calcular fechas/plazos.

Resultado esperado:
Los plazos, condiciones y datos base del proveedor quedan disponibles para el proceso.

Flujo estimado:
1. Registrar parametros del proveedor.
2. Calcular fecha estimada de embarque.
3. Usar los plazos para seguimientos y pagos.
4. Aplicar los datos en despacho y recepcion.

Reglas detectadas:
- Los plazos de produccion se parametrizan individualmente.
- La fecha estimada se calcula desde la OC y dias de proveedor.
- Los datos del maestro alimentan varios pasos del ciclo.

Excepciones posibles:
- Parametros faltantes o inconsistentes.

Datos involucrados:
- Dias de produccion
- Dias de transito
- Incoterm
- Condicion de pago
- Despachante
- Banco

Dependencias:
- Maestro de proveedores.

Ambiguedades / dudas:
- No se aclara si todos los campos del maestro son obligatorios para todos los proveedores.

Origen:
- 5.1 Generacion de la Orden de Compra
- 5.3 Seguimiento de Produccion
- 5.6 Despacho Aduanero

## Elementos descartados

### Herramientas o sistemas
- Planilla Excel maestra
- SAP
- MarineTraffic
- SICNEA / ARCA
- WhatsApp / telefono
- legajos fisicos

### Detalle tecnico o de soporte
- Numeros de transacciones
- Nombres de columnas
- Estados SAP
- Formatos internos de planillas

### Notas de calidad
- Este documento describe el proceso actual, por eso las unidades refinables quedan orientadas a relevar intenciones operativas del AS-IS.

