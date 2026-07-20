# Casos de uso de analisis AS-IS - Proceso actual de Importaciones

Fuente: `Analisis/Dimagraf-Dis-Especificación proceso Importaciones.docx`

Este directorio contiene la lectura funcional del proceso actual, expresada como casos de uso de analisis.
Su proposito es dejar claro el comportamiento vigente antes de comparar contra el `TO-BE` del ERS consolidado.

## Resumen

| ID | Caso de uso de analisis | Unidad refinable AS-IS | CU futuro relacionado |
|---|---|---|---|
| CU-ASI-001 | Originar y cargar orden de compra | UR-ASI-001 | CU-001 |
| CU-ASI-002 | Confirmar orden de compra manualmente | UR-ASI-002 | CU-016, CU-020 |
| CU-ASI-003 | Seguir produccion y aperturas parciales | UR-ASI-003 | CU-003, CU-002 |
| CU-ASI-004 | Preparar facturacion y documentacion de embarque | UR-ASI-004 | CU-004, CU-017, CU-021 |
| CU-ASI-005 | Seguir transito y publicar arrivals | UR-ASI-005 | CU-005, CU-008 |
| CU-ASI-006 | Gestionar despacho aduanero y fondos | UR-ASI-006 | CU-006, CU-009, CU-010, CU-014 |
| CU-ASI-007 | Recepcionar mercaderia e ingresar a SAP | UR-ASI-007 | CU-007, CU-015, CU-011 |
| CU-ASI-008 | Mantener maestro de proveedores y plazos | UR-ASI-008 | CU-013, CU-001, CU-005, CU-006 |

---

## CU-ASI-001 - Originar y cargar orden de compra

### 1. Problema
La compra nace en el area Comercial y llega a Importaciones en formatos heterogeneos; el circuito necesita normalizacion operativa.

### 2. Objetivo
Registrar la OC como carpeta operativa con datos basicos para que el proceso de importacion pueda seguirla.

### 3. Actores
- Comercial
- Operador de Importaciones

### 4. Contexto
Inicio del ciclo de importacion, antes de la confirmacion del proveedor.

### 5. Flujo esperado (alto nivel)
1. Comercial determina la necesidad de importar.
2. Genera la OC en un formato disponible.
3. Importaciones revisa articulos, cantidades, precios y proveedor.
4. Se registra la carpeta interna.
5. Se envía la OC al proveedor.

### 6. Casos alternativos identificados
- Articulos inexistentes en SAP.
- Necesidad de alta de codigo previo a la carga.

### 7. Errores o excepciones posibles
- OC con datos incompletos.
- OC con codigos no registrados en SAP.

### 8. Reglas de negocio
- La carpeta usa numeracion AÑO/SECUENCIA.
- El estado inicial se fija al cargar la carpeta.

### 9. Datos involucrados
- Carpeta
- Proveedor
- Producto
- Linea
- Cantidad SAP
- Unidad SAP
- Monto OC
- Moneda
- Incoterm

### 10. Precondiciones
- Necesidad de compra detectada.
- Disponibilidad de la OC o pedido origen.

### 11. Resultado esperado (postcondiciones)
- La OC queda registrada en el circuito operativo.

### 12. Restricciones
- La OC puede originarse en Excel, PDF, papel o correo.

### 13. Supuestos
- Importaciones valida la informacion antes de enviarla al proveedor.

### 14. Dudas pendientes
- No existe una plantilla unica de entrada.

---

## CU-ASI-002 - Confirmar orden de compra manualmente

### 1. Problema
La confirmacion del proveedor se controla manualmente y cualquier diferencia exige seguimiento por correo.

### 2. Objetivo
Verificar que la confirmacion del proveedor coincida con la OC antes de avanzar el proceso.

### 3. Actores
- Operador de Importaciones
- Proveedor

### 4. Contexto
Luego del envio de la OC y antes del embarque.

### 5. Flujo esperado (alto nivel)
1. El proveedor responde por correo.
2. Importaciones revisa codigo, descripcion, cantidad, precio, formato, incoterm y condicion de pago.
3. Se registra la referencia interna del proveedor.
4. Si hay diferencias, se reclama por correo.

### 6. Casos alternativos identificados
- El proveedor acusa recibo sin observaciones.
- El proveedor responde con diferencias que requieren reclamo.

### 7. Errores o excepciones posibles
- Confirmacion incompleta.
- Redaccion ambigua.

### 8. Reglas de negocio
- El control es articulo por articulo.
- La confirmacion puede o no acusar recibo.

### 9. Datos involucrados
- Referencia interna del proveedor
- Codigo
- Descripcion
- Cantidad
- Precio
- Formato
- Incoterm
- Condicion de pago

### 10. Precondiciones
- OC registrada y enviada al proveedor.

### 11. Resultado esperado (postcondiciones)
- La confirmacion queda revisada y resuelta o escalada.

### 12. Restricciones
- El canal operativo actual es el correo.

### 13. Supuestos
- Importaciones decide el criterio operativo ante diferencias menores.

### 14. Dudas pendientes
- No se formaliza el criterio de aceptacion de diferencias menores.

---

## CU-ASI-003 - Seguir produccion y aperturas parciales

### 1. Problema
La produccion puede dividirse en varios embarques y el seguimiento hoy depende de controles manuales recurrentes.

### 2. Objetivo
Monitorear el avance de fabricacion y gestionar aperturas parciales dentro de una misma carpeta.

### 3. Actores
- Operador de Importaciones
- Proveedor

### 4. Contexto
Periodo entre la OC y la factura/preparacion del embarque.

### 5. Flujo esperado (alto nivel)
1. Identificar OC pendientes.
2. Consultar al proveedor el avance.
3. Confirmar fecha estimada de embarque.
4. Si hay parciales, abrir subcarpetas A, B, C...

### 6. Casos alternativos identificados
- Demoras en fabricacion.
- Embarques parciales imprevistos.

### 7. Errores o excepciones posibles
- Falta de respuesta del proveedor.

### 8. Reglas de negocio
- Cada apertura puede tener factura y documentacion propia.
- El seguimiento tiene cadencias periodicas.

### 9. Datos involucrados
- Estado de la OC
- Fecha estimada de embarque
- Subcarpeta
- Factura por apertura

### 10. Precondiciones
- OC pendiente en la planilla o sistema de seguimiento.

### 11. Resultado esperado (postcondiciones)
- El avance queda conocido y la apertura parcial, registrada.

### 12. Restricciones
- Los casos criticos escalan por canales informales.

### 13. Supuestos
- El proveedor aporta fechas estimadas con margen de demoras.

### 14. Dudas pendientes
- No se formaliza el catalogo de estados de produccion.

---

## CU-ASI-004 - Preparar facturacion y documentacion de embarque

### 1. Problema
La documentacion de embarque tiene formatos distintos segun el medio de transporte y requiere control manual exhaustivo.

### 2. Objetivo
Recibir y validar factura y documentacion de embarque antes de avanzar a transito.

### 3. Actores
- Operador de Importaciones
- Proveedor
- Despachante aduanero

### 4. Contexto
Mercaderia aun en origen, antes o durante la carga.

### 5. Flujo esperado (alto nivel)
1. El proveedor notifica que la carga esta lista.
2. Envia factura y documentos de embarque.
3. Importaciones revisa titularidad, NCM, pesos, volumen y bultos.
4. Si hay parciales, abre subcarpetas.
5. Asigna despachante.

### 6. Casos alternativos identificados
- Cargas parciales con subcarpetas independientes.
- Articulos nuevos que requieren clasificacion arancelaria.

### 7. Errores o excepciones posibles
- Documentacion incompleta.
- Datos logisticos inconsistentes.

### 8. Reglas de negocio
- Cada subcarpeta tiene su propia factura.
- La fecha estimada se calcula desde la OC.

### 9. Datos involucrados
- Factura
- B/L, CRT, AWB
- Packing list
- Certificado de origen
- UME
- Peso neto
- Peso bruto
- Medio de transporte
- Banco

### 10. Precondiciones
- El proveedor notifico que la carga esta lista.

### 11. Resultado esperado (postcondiciones)
- La documentacion queda validada y lista para transito.

### 12. Restricciones
- La revision documental es manual.

### 13. Supuestos
- El despachante recibe la documentacion disponible para su preparacion.

### 14. Dudas pendientes
- No se distingue si la revision documental bloquea o solo condiciona la continuidad.

---

## CU-ASI-005 - Seguir transito y publicar arrivals

### 1. Problema
La visibilidad de arribos depende de un seguimiento manual y de una planilla compartida semanal.

### 2. Objetivo
Monitorear el transito y publicar arribos para Comercial.

### 3. Actores
- Operador de Importaciones
- Comercial
- Naviera

### 4. Contexto
Embarque ya despachado y en camino.

### 5. Flujo esperado (alto nivel)
1. Recepcion de ETA por correo.
2. Consulta del estado del viaje.
3. Actualizacion manual de la planilla de arrivals.
4. Publicacion de la informacion a Comercial.

### 6. Casos alternativos identificados
- Seguimiento urgente por consulta externa.
- Cambio de fecha de arribo.

### 7. Errores o excepciones posibles
- Falta de tracking dinamico.

### 8. Reglas de negocio
- La actualizacion para Comercial se hace semanalmente.

### 9. Datos involucrados
- ETA
- Medio de transporte
- Fecha de arribo
- Planilla de Arrivals

### 10. Precondiciones
- Embarque en transito.

### 11. Resultado esperado (postcondiciones)
- Los arribos quedan publicados y actualizados.

### 12. Restricciones
- La coordinacion urgente puede depender de correo, WhatsApp o telefono.

### 13. Supuestos
- La planilla compartida es la fuente de consulta de Comercial.

### 14. Dudas pendientes
- No se define versionado formal para la planilla.

---

## CU-ASI-006 - Gestionar despacho aduanero y fondos

### 1. Problema
La nacionalizacion y los pagos asociados requieren coordinacion manual con despachante, Tesoreria y transportistas.

### 2. Objetivo
Gestionar la nacionalizacion, los fondos y las fechas asociadas al despacho.

### 3. Actores
- Operador de Importaciones
- Despachante Aduanero
- Tesoreria

### 4. Contexto
Arribo del embarque y gestion de despacho aduanero.

### 5. Flujo esperado (alto nivel)
1. Asignar despachante.
2. Recibir requerimiento de fondos.
3. Coordinar transferencia con Tesoreria.
4. Registrar canal, gastos y fechas.
5. Coordinar salida de puerto o frontera.

### 6. Casos alternativos identificados
- Canal verde.
- Canal rojo con inspeccion adicional.
- Despacho terrestre sin canal en documento.

### 7. Errores o excepciones posibles
- Falta de documentacion.
- Fondos insuficientes.

### 8. Reglas de negocio
- El canal puede venir en el documento o consultarse al despachante.
- Puede existir saldo a favor con el despachante.

### 9. Datos involucrados
- Despachante
- Canal
- Monto gastos AR$
- VEP USD
- Fecha oficializacion
- Fecha salida
- Banco
- Estado

### 10. Precondiciones
- Embarque arribado o en frontera.

### 11. Resultado esperado (postcondiciones)
- El despacho queda oficializado y con pagos coordinados.

### 12. Restricciones
- La gestion del canal y fondos sigue siendo manual.

### 13. Supuestos
- Importaciones selecciona el despachante segun tipo de carga y experiencia.

### 14. Dudas pendientes
- No queda claro si el circuito de fondos se registra como saldo operativo o como pago formal.

---

## CU-ASI-007 - Recepcionar mercaderia e ingresar a SAP

### 1. Problema
La recepcion fisica y el ingreso a SAP dependen de confirmaciones por correo y controles manuales.

### 2. Objetivo
Confirmar la llegada al deposito, controlar la mercaderia e ingresar la informacion a SAP.

### 3. Actores
- Operador de Importaciones
- Depósito (Garín)

### 4. Contexto
Cierre operativo del embarque y liberacion de stock.

### 5. Flujo esperado (alto nivel)
1. Notificar al deposito con anticipacion.
2. Generar pre-ingreso en SAP.
3. El deposito controla fisicamente la mercaderia.
4. El deposito confirma por correo.
5. Importaciones registra el OK y completa el ingreso a SAP.

### 6. Casos alternativos identificados
- Discrepancias en el control fisico.
- Registro de incidencia en SAP.

### 7. Errores o excepciones posibles
- Faltantes.
- El OK se registra dias despues de la recepcion real.

### 8. Reglas de negocio
- Si hay discrepancias, la OC queda abierta hasta resolver.
- La documentacion queda archivada para contabilidad.

### 9. Datos involucrados
- Llegada Garin
- Pre-ingreso SAP
- OK deposito
- Fecha ingreso SAP
- Coeficiente
- Observaciones de costeo

### 10. Precondiciones
- Embarque arribado al deposito.

### 11. Resultado esperado (postcondiciones)
- El stock queda disponible en SAP y la recepcion queda confirmada.

### 12. Restricciones
- El ingreso a SAP puede ocurrir dias despues de la entrega real.

### 13. Supuestos
- La conformidad del deposito puede llegar en planilla firmada o escaneada.

### 14. Dudas pendientes
- No se explicita el criterio exacto para cerrar la OC despues de una discrepancia resuelta.

---

## CU-ASI-008 - Mantener maestro de proveedores y plazos

### 1. Problema
El proceso depende de plazos y datos de proveedor parametrizados manualmente.

### 2. Objetivo
Administrar los parametros del maestro de proveedores para calcular fechas y coordinar la operacion.

### 3. Actores
- Operador de Importaciones
- Administrador del sistema

### 4. Contexto
Configuracion transversal al ciclo de importacion.

### 5. Flujo esperado (alto nivel)
1. Registrar o actualizar parametros del proveedor.
2. Calcular fecha estimada de embarque.
3. Usar los plazos para seguimientos y pagos.
4. Aplicar los datos en despacho y recepcion.

### 6. Casos alternativos identificados
- Proveedor con parametros incompletos.

### 7. Errores o excepciones posibles
- Dato faltante o inconsistente.

### 8. Reglas de negocio
- Los plazos de produccion se parametrizan individualmente.
- La fecha estimada se calcula desde la OC y dias de proveedor.

### 9. Datos involucrados
- Dias de produccion
- Dias de transito
- Incoterm
- Condicion de pago
- Despachante
- Banco

### 10. Precondiciones
- Existe un proveedor a parametrizar.

### 11. Resultado esperado (postcondiciones)
- Los datos base del proveedor quedan disponibles para el proceso.

### 12. Restricciones
- La configuracion debe servir a varios pasos del circuito.

### 13. Supuestos
- El maestro de proveedores alimenta calculos y coordinaciones posteriores.

### 14. Dudas pendientes
- No se aclara si todos los campos son obligatorios para todos los proveedores.

