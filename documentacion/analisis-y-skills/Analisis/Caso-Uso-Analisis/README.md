# Refinamiento funcional - Dimagraf ERS Consolidado v1.0

Fuente de entrada: `Analisis/Unidades-Refinables/README.md`

Objetivo:
- Convertir las unidades refinables en requerimientos funcionales claros.
- Mantener trazabilidad con las UR originales.
- Dejar cada item listo para transformarse en Caso de Uso.

## RF-001-gestionar-orden-de-compra-y-saldos-por-articulo

Estado: REFINADO

## Resultado del refinamiento

### 1. Problema
La empresa necesita registrar OCs de importacion y controlar el consumo real de cada articulo para evitar desfasajes y cierres incompletos.

### 2. Objetivo
Permitir la alta y administracion de una OC con desgloses por articulo, saldo pendiente y cierre automatico cuando corresponda.

### 3. Actores
- Operador de Importaciones
- Administrador del sistema

### 4. Contexto
Operacion de importaciones sobre la OC como unidad principal de trabajo.

### 5. Flujo esperado (alto nivel)
1. Crear la OC con su identificacion unica.
2. Registrar los articulos y cantidades.
3. Calcular saldos por articulo.
4. Actualizar saldos ante movimientos.
5. Cerrar la OC cuando no queden saldos.

### 6. Casos alternativos identificados
- Modificacion de una OC ya abierta.

### 7. Errores o excepciones posibles
- Carpeta duplicada.
- Intento de sobreconsumo.

### 8. Reglas de negocio
- La carpeta interna debe ser unica.
- El saldo se controla por articulo y por OC.
- La OC se cierra cuando todos los saldos llegan a cero.

### 9. Datos involucrados
- Proveedor
- Incoterm
- Condicion de pago
- Articulos
- Cantidades
- Saldos

### 10. Precondiciones
- El usuario debe tener acceso a la administracion de OCs.

### 11. Resultado esperado (postcondiciones)
- La OC queda registrada y operativa con trazabilidad por articulo.

### 12. Restricciones
- No se debe permitir duplicar la carpeta interna.

### 13. Supuestos
- La OC es el contenedor principal de control del proceso.

### 14. Dudas pendientes
- No se especifica el criterio exacto para limitar modificaciones sobre OCs ya vinculadas a embarques.

## RF-002-gestionar-embarques-y-subcarpetas-multi-oc

Estado: REFINADO

### 1. Problema
Un mismo embarque puede incluir articulos de varias OCs y el proceso necesita trazabilidad independiente por subcarpeta.

### 2. Objetivo
Permitir crear embarques parciales o consolidados, con descuento de saldos por OC y por articulo.

### 3. Actores
- Operador de Importaciones

### 4. Contexto
Gestion de embarques dentro del flujo de importaciones.

### 5. Flujo esperado (alto nivel)
1. Crear o actualizar un embarque.
2. Asociar una o mas OCs.
3. Generar la subcarpeta correspondiente.
4. Descontar saldos de los articulos involucrados.

### 6. Casos alternativos identificados
- Embarque completo.
- Embarque parcial.
- Despacho multi-OC.

### 7. Errores o excepciones posibles
- Exceso de unidades respecto del saldo disponible.

### 8. Reglas de negocio
- Una OC puede tener multiples subcarpetas.
- Un despacho puede incluir articulos de varias OCs.

### 9. Datos involucrados
- OC
- Subcarpeta
- Articulo
- Cantidad

### 10. Precondiciones
- Deben existir OCs abiertas y articulos con saldo disponible.

### 11. Resultado esperado (postcondiciones)
- El embarque queda registrado y los saldos quedan actualizados.

### 12. Restricciones
- No se pueden embarcar cantidades por encima del saldo.

### 13. Supuestos
- El sistema controla el saldo en tiempo de registro.

### 14. Dudas pendientes
- No se define si la subcarpeta tiene una nomenclatura obligatoria adicional.

## RF-003-seguir-produccion-y-estado-operativo

Estado: REFINADO

### 1. Problema
Sin seguimiento formal, el equipo no puede saber en que punto operativo esta cada embarque u OC.

### 2. Objetivo
Registrar el avance de produccion pre-embarque y reflejar el estado operativo del flujo.

### 3. Actores
- Operador de Importaciones
- Comercial

### 4. Contexto
Seguimiento previo al embarque.

### 5. Flujo esperado (alto nivel)
1. Registrar el avance o estado.
2. Guardar observaciones.
3. Mantener historial cronologico.
4. Exponer el estado a las vistas correspondientes.

### 6. Casos alternativos identificados
- Actualizacion manual del seguimiento.

### 7. Errores o excepciones posibles
- Falta de informacion de avance.

### 8. Reglas de negocio
- El estado debe alinearse con el proceso operativo definido.

### 9. Datos involucrados
- Estado de produccion
- Observaciones
- Timestamp

### 10. Precondiciones
- Debe existir un embarque u OC a la que se le siga el estado.

### 11. Resultado esperado (postcondiciones)
- El historial de produccion queda actualizado y consultable.

### 12. Restricciones
- No debe perderse el orden cronologico de los cambios.

### 13. Supuestos
- El estado es utilizable por otras areas del negocio.

### 14. Dudas pendientes
- No se precisa el catalogo completo de estados intermedios.

## RF-004-gestionar-documentacion-y-anexos

Estado: REFINADO

### 1. Problema
La documentacion operativa debe poder clasificarse y mostrarse segun el tipo de documento y el rol del usuario.

### 2. Objetivo
Adjuntar, clasificar y visualizar documentos asociados a cada embarque.

### 3. Actores
- Operador de Importaciones
- Roles autorizados a ver anexos

### 4. Contexto
Embarques y documentos de soporte.

### 5. Flujo esperado (alto nivel)
1. Subir un documento.
2. Clasificarlo por tipo.
3. Definir su visibilidad.
4. Consultarlo desde la instancia correspondiente.

### 6. Casos alternativos identificados
- Visualizacion restringida por rol.

### 7. Errores o excepciones posibles
- Documento sin clasificacion.

### 8. Reglas de negocio
- El anexo debe tener tipo.
- La visibilidad depende del rol.

### 9. Datos involucrados
- Tipo de documento
- Rol
- Archivo adjunto

### 10. Precondiciones
- Debe existir un embarque o entidad donde asociar el archivo.

### 11. Resultado esperado (postcondiciones)
- La documentacion queda disponible segun permisos.

### 12. Restricciones
- No todos los roles deben ver todos los anexos.

### 13. Supuestos
- La clasificacion por tipo es obligatoria para ordenar la documentacion.

### 14. Dudas pendientes
- Existe una contradiccion abierta sobre la ubicacion de visualizacion de anexos.

## RF-005-gestionar-transito-arribos-y-alertas-operativas

Estado: REFINADO

### 1. Problema
El seguimiento manual no da visibilidad suficiente sobre ETA, arribos y eventos relevantes.

### 2. Objetivo
Gestionar transito, arribos en tiempo real y alertas operativas para las areas involucradas.

### 3. Actores
- Operador de Importaciones
- Comercial
- Tesoreria

### 4. Contexto
Proceso logístico de embarques y llegada.

### 5. Flujo esperado (alto nivel)
1. Registrar ETA y fechas reales.
2. Actualizar la vista de arribos.
3. Emitir alertas por eventos relevantes.

### 6. Casos alternativos identificados
- Diferentes destinatarios segun tipo de alerta.

### 7. Errores o excepciones posibles
- ETA incompleta o desactualizada.

### 8. Reglas de negocio
- La vista de arribos debe reflejar informacion actualizada.
- Las alertas deben ser configurables.

### 9. Datos involucrados
- ETA
- Medio de transporte
- Estado de arribo
- Notificaciones

### 10. Precondiciones
- Debe existir un embarque a monitorear.

### 11. Resultado esperado (postcondiciones)
- Arribos y alertas quedan disponibles para consulta.

### 12. Restricciones
- No debe depender de una planilla manual.

### 13. Supuestos
- Los eventos operativos pueden parametrizarse.

### 14. Dudas pendientes
- No se detallan todas las reglas de priorizacion de alertas.

## RF-006-gestionar-pagos-vencimientos-y-proyeccion-financiera

Estado: REFINADO

### 1. Problema
Tesoreria necesita anticipar vencimientos, pagos y saldos relacionados con la operacion.

### 2. Objetivo
Controlar vencimientos, proyeccion de pagos e instancia de pagos por carpeta.

### 3. Actores
- Tesoreria
- Direccion
- Operador de Importaciones

### 4. Contexto
Pago a proveedores, fletes, aduana y control financiero.

### 5. Flujo esperado (alto nivel)
1. Calcular vencimientos.
2. Generar alertas.
3. Registrar pagos ejecutados.
4. Administrar saldos a favor con despachantes.
5. Exponer la instancia de pagos de la carpeta.

### 6. Casos alternativos identificados
- Consulta de saldo antes de transferir fondos.

### 7. Errores o excepciones posibles
- Fondos insuficientes.
- Vencimiento no configurado.

### 8. Reglas de negocio
- La configuracion de pagos debe ser parametrizable.
- El saldo a favor con despachantes debe considerarse antes de transferencias.

### 9. Datos involucrados
- Fechas de vencimiento
- Importes
- Saldos
- Estado de pago

### 10. Precondiciones
- Debe existir una carpeta o compromiso financiero asociado.

### 11. Resultado esperado (postcondiciones)
- Los pagos y vencimientos quedan controlados en el flujo.

### 12. Restricciones
- La informacion financiera no debe quedar accesible para roles sin permiso.

### 13. Supuestos
- La carpeta puede contener una instancia propia de pagos.

### 14. Dudas pendientes
- No queda totalmente definido el alcance de la nueva solapa de Pagos respecto de MOD-010.

## RF-007-registrar-recepcion-en-deposito-y-datos-operativos

Estado: REFINADO

### 1. Problema
El deposito necesita confirmar recepcion e informar diferencias contra lo esperado.

### 2. Objetivo
Registrar la recepcion fisica y las discrepancias detectadas.

### 3. Actores
- Depósito (Garin)
- Operador de Importaciones

### 4. Contexto
Recepcion en deposito e ingreso de articulos.

### 5. Flujo esperado (alto nivel)
1. Confirmar recepcion.
2. Informar diferencias.
3. Consultar los datos operativos del articulo.

### 6. Casos alternativos identificados
- Recepcion parcial.

### 7. Errores o excepciones posibles
- Diferencia de cantidades.

### 8. Reglas de negocio
- La vista debe incluir UME y UM.

### 9. Datos involucrados
- Articulos recibidos
- UME
- UM
- Discrepancias

### 10. Precondiciones
- Debe existir una llegada o entrega a recepcionar.

### 11. Resultado esperado (postcondiciones)
- La recepcion y sus diferencias quedan registradas.

### 12. Restricciones
- La informacion de deposito debe ser clara para operar rapidamente.

### 13. Supuestos
- La recepcion puede asociarse a una carpeta existente.

### 14. Dudas pendientes
- No se precisa el tratamiento de recepciones con faltantes parciales.

## RF-008-administrar-proveedores-configuracion-y-permisos

Estado: REFINADO

### 1. Problema
La operacion depende de parametros configurables por proveedor y reglas de acceso por rol/campo.

### 2. Objetivo
Mantener el maestro de proveedores, sus parametros y la configuracion de permisos.

### 3. Actores
- Administrador del sistema

### 4. Contexto
Administracion de maestros y seguridad funcional.

### 5. Flujo esperado (alto nivel)
1. Mantener proveedores.
2. Definir parametros operativos por proveedor.
3. Configurar edicion por rol y por campo.
4. Asignar multiples roles a un usuario.

### 6. Casos alternativos identificados
- Uso de valores globales cuando un proveedor no tenga parametro propio.

### 7. Errores o excepciones posibles
- Parametros incompletos.

### 8. Reglas de negocio
- Los parametros del proveedor prevalecen sobre los globales.
- Un usuario puede tener varios roles.

### 9. Datos involucrados
- Proveedor
- Idioma de documentos
- Tolerancias
- Umbral de confianza
- Roles
- Permisos por campo

### 10. Precondiciones
- Debe existir un administrador con acceso a la configuracion.

### 11. Resultado esperado (postcondiciones)
- La configuracion queda disponible para el resto del flujo.

### 12. Restricciones
- No debe requerir cambios de codigo para ajustar parametros operativos.

### 13. Supuestos
- La configuracion es reutilizada por otros procesos.

### 14. Dudas pendientes
- RF-044 se apoya en una dependencia RNF, pero su naturaleza es claramente funcional.

## RF-009-exportar-datos-y-registrar-costeo-sap

Estado: REFINADO

### 1. Problema
SAP sigue siendo una salida manual y se necesita preparar datos consistentes para su carga.

### 2. Objetivo
Preparar exportaciones para SAP y registrar costeo/referencia.

### 3. Actores
- Operador de Importaciones
- Direccion

### 4. Contexto
Cierre operativo y costeo.

### 5. Flujo esperado (alto nivel)
1. Consolidar informacion.
2. Exportar datos utilizable.
3. Registrar costeo y referencia SAP.

### 6. Casos alternativos identificados
- Exportacion para diferentes consumos manuales.

### 7. Errores o excepciones posibles
- Datos insuficientes para el costeo.

### 8. Reglas de negocio
- El sistema no modifica SAP directamente.

### 9. Datos involucrados
- Tx 45, 55, 18
- Coeficiente
- Referencia SAP

### 10. Precondiciones
- Debe existir informacion operativa completa.

### 11. Resultado esperado (postcondiciones)
- La informacion queda exportable y trazable.

### 12. Restricciones
- La salida debe ser compatible con la carga manual esperada.

### 13. Supuestos
- La exportacion sirve como puente, no como integracion automatica.

### 14. Dudas pendientes
- No se define el nivel exacto de detalle de la exportacion.

## RF-010-autenticar-usuarios-y-controlar-acceso-por-rol

Estado: REFINADO

### 1. Problema
El sistema necesita asegurar el acceso y limitar funciones segun rol.

### 2. Objetivo
Autenticar usuarios y controlar el acceso a pantallas y acciones.

### 3. Actores
- Todos los usuarios del sistema

### 4. Contexto
Ingreso y uso cotidiano de la aplicacion.

### 5. Flujo esperado (alto nivel)
1. Validar credenciales.
2. Mantener sesion activa.
3. Revisar permisos por rol.
4. Bloquear accesos no autorizados.

### 6. Casos alternativos identificados
- Expiracion por inactividad.

### 7. Errores o excepciones posibles
- Credenciales invalidas.
- Cuenta bloqueada.

### 8. Reglas de negocio
- Las altas y bajas se administran desde la configuracion.

### 9. Datos involucrados
- Usuario
- Credenciales
- Rol
- Sesion

### 10. Precondiciones
- El usuario debe contar con credenciales vigentes.

### 11. Resultado esperado (postcondiciones)
- El usuario accede solo a lo permitido.

### 12. Restricciones
- El acceso debe expirar por inactividad.

### 13. Supuestos
- El control de acceso aplica a cualquier pantalla.

### 14. Dudas pendientes
- No se explicita la politica completa de bloqueo por intentos fallidos.

## RF-011-importar-documentos-y-obtener-oc-para-val

Estado: REFINADO

### 1. Problema
Se necesita automatizar el control de documentos de proveedor contra la OC del sistema.

### 2. Objetivo
Importar documentos externos y recuperar la OC para validarlos como unica fuente de verdad.

### 3. Actores
- Operador de Importaciones

### 4. Contexto
Validacion de confirmaciones y facturas de preembarque.

### 5. Flujo esperado (alto nivel)
1. Cargar el documento.
2. Prepararlo para analisis.
3. Recuperar la OC asociada.

### 6. Casos alternativos identificados
- Confirmacion del proveedor.
- Factura de preembarque.

### 7. Errores o excepciones posibles
- Documento no compatible.

### 8. Reglas de negocio
- La OC es la fuente de verdad.
- El documento puede ser PDF o Excel.

### 9. Datos involucrados
- Archivo
- OC

### 10. Precondiciones
- Debe existir una OC registrada.

### 11. Resultado esperado (postcondiciones)
- El documento y la OC quedan listos para comparacion.

### 12. Restricciones
- El proceso debe respetar la informacion de la OC sin alterarla.

### 13. Supuestos
- El documento a cargar pertenece a una OC existente.

### 14. Dudas pendientes
- No se precisa si la carga admite otros formatos ademas de PDF o Excel.

## RF-012-comparar-documentos-con-oc

Estado: REFINADO

### 1. Problema
La validacion debe identificar coincidencias y diferencias por articulo con criterios distintos de comparacion.

### 2. Objetivo
Comparar documentos de proveedor contra la OC por SKU, descripcion y cantidad.

### 3. Actores
- Operador de Importaciones

### 4. Contexto
Etapa de comparacion dentro de la validacion automatica.

### 5. Flujo esperado (alto nivel)
1. Comparar por SKU.
2. Comparar por descripcion.
3. Comparar cantidades.
4. Consolidar diferencias.
5. Presentar el resultado por articulo.

### 6. Casos alternativos identificados
- Coincidencia exacta.
- Coincidencia parcial o semantica.

### 7. Errores o excepciones posibles
- Descripcion ambigua.
- Cantidad fuera de tolerancia.

### 8. Reglas de negocio
- SKU exacto.
- Descripcion con matching semantico.
- Cantidades con tolerancia configurable.

### 9. Datos involucrados
- SKU
- Descripcion
- Cantidad
- Umbral de similitud

### 10. Precondiciones
- Debe existir una OC y un documento importado.

### 11. Resultado esperado (postcondiciones)
- La validacion deja diferencias clasificadas por articulo.

### 12. Restricciones
- No puede quedarse en una comparacion aislada por campo.

### 13. Supuestos
- La comparacion semantica complementa, no reemplaza, el SKU.

### 14. Dudas pendientes
- No se establece el criterio exacto de ponderacion entre comparaciones.

## RF-013-aprobar-cancelar-y-auditar-validacion

Estado: REFINADO

### 1. Problema
La validacion necesita una decision final y trazabilidad completa.

### 2. Objetivo
Permitir aprobar o cancelar la validacion y registrar la decision.

### 3. Actores
- Operador de Importaciones
- Sistema, para eventos de error

### 4. Contexto
Cierre de una validacion automatica.

### 5. Flujo esperado (alto nivel)
1. Ver resultados comparativos.
2. Aprobar o cancelar.
3. Guardar auditoria.
4. Gestionar errores de documento o servicio.

### 6. Casos alternativos identificados
- Aprobacion con diferencias dentro del margen de negocio.

### 7. Errores o excepciones posibles
- Error de servicio de IA.
- Documento no procesable.

### 8. Reglas de negocio
- Debe registrarse usuario, fecha, resultado y confianza.

### 9. Datos involucrados
- Decision final
- Timestamp
- Resultado por articulo
- Porcentaje de confianza

### 10. Precondiciones
- Deben existir resultados comparativos.

### 11. Resultado esperado (postcondiciones)
- La decision queda registrada y el flujo puede continuar o detenerse.

### 12. Restricciones
- La auditoria no puede omitirse.

### 13. Supuestos
- La aprobacion/cancelacion forma parte de la operacion normal.

### 14. Dudas pendientes
- No se explicita si la decision "OK" puede convivir con observaciones obligatorias.

## RF-014-cargar-articulos-de-oc-en-forma-masiva

Estado: REFINADO

### 1. Problema
La carga manual articulo por articulo puede ser lenta o poco viable.

### 2. Objetivo
Permitir la carga masiva de articulos de una OC.

### 3. Actores
- Operador de Importaciones

### 4. Contexto
Alta o actualizacion de la OC.

### 5. Flujo esperado (alto nivel)
1. Importar un archivo.
2. Validar la estructura.
3. Crear o actualizar articulos.

### 6. Casos alternativos identificados
- Importacion desde archivo.

### 7. Errores o excepciones posibles
- Archivo invalido.

### 8. Reglas de negocio
- Debe incluir codigo de articulo y cantidad.

### 9. Datos involucrados
- Codigo de articulo
- Cantidad
- Archivo de importacion

### 10. Precondiciones
- Debe existir una OC objetivo.

### 11. Resultado esperado (postcondiciones)
- La OC queda poblada con articulos.

### 12. Restricciones
- El archivo debe ser procesable por el sistema.

### 13. Supuestos
- La carga masiva es una alternativa a la carga manual.

### 14. Dudas pendientes
- No se detalla el formato exacto del archivo de importacion.

