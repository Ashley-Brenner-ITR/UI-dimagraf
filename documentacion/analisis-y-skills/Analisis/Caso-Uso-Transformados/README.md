# Casos de uso transformados - Dimagraf ERS Consolidado v1.0

Este directorio contiene la salida consolidada del flujo:

1. `Unidades-Refinables`
2. `Caso-Uso-Analisis`
3. `Caso-Uso-Transformados`

## Cobertura

### Base del sistema
- [CU-001 Gestionar Orden de Compra](CU-001-gestionar-orden-de-compra.md)
- [CU-002 Registrar y actualizar embarque / subcarpeta](CU-002-registrar-y-actualizar-embarque-subcarpeta.md)
- [CU-003 Hacer seguimiento de produccion pre-embarque](CU-003-seguimiento-produccion-pre-embarque.md)
- [CU-004 Gestionar documentacion del embarque](CU-004-gestionar-documentacion-del-embarque.md)
- [CU-005 Gestionar transito, arribos y alertas operativas](CU-005-gestionar-transito-arribos-y-alertas-operativas.md)
- [CU-006 Gestionar despacho aduanero](CU-006-gestionar-despacho-aduanero.md)
- [CU-007 Confirmar recepcion en deposito](CU-007-confirmar-recepcion-en-deposito.md)
- [CU-008 Consultar Arribos (Comercial)](CU-008-consultar-arribos-comercial.md)
- [CU-009 Generar alertas de vencimiento de pago](CU-009-generar-alertas-vencimiento-pago.md)
- [CU-010 Confirmar pago al proveedor (Tesoreria)](CU-010-confirmar-pago-proveedor.md)
- [CU-011 Registrar costeo y referencia SAP](CU-011-registrar-costeo-y-referencia-sap.md)
- [CU-012 Exportar reportes](CU-012-exportar-reportes.md)
- [CU-013 Administrar maestros y configuracion](CU-013-administrar-maestros-configuracion.md)
- [CU-014 Cargar datos de despacho aduanero (Despachante)](CU-014-cargar-datos-despacho-aduanero.md)
- [CU-015 Confirmar recepcion e ingreso en Deposito](CU-015-confirmar-recepcion-e-ingreso-en-deposito.md)

### Componente VAL
- [CU-016 Importar confirmacion del proveedor](CU-016-importar-confirmacion-del-proveedor.md)
- [CU-017 Importar factura (preembarque)](CU-017-importar-factura-preembarque.md)
- [CU-018 Obtener OC del sistema](CU-018-obtener-oc-del-sistema.md)
- [CU-019 Comparar articulos (SKU + descripcion + cantidad)](CU-019-comparar-articulos-sku-descripcion-cantidad.md)
- [CU-020 Validar confirmacion contra OC](CU-020-validar-confirmacion-contra-oc.md)
- [CU-021 Validar factura contra OC](CU-021-validar-factura-contra-oc.md)
- [CU-022 Visualizar resultados comparativos](CU-022-visualizar-resultados-comparativos.md)
- [CU-023 Aprobar validacion](CU-023-aprobar-validacion.md)
- [CU-024 Cancelar validacion](CU-024-cancelar-validacion.md)
- [CU-025 Notificar error de servicio de IA (Sistema)](CU-025-notificar-error-servicio-ia.md)
- [CU-026 Notificar documento no procesable (Sistema)](CU-026-notificar-documento-no-procesable.md)

### Complementarios
- [CU-027 Cargar articulos de la OC en forma masiva](CU-027-cargar-articulos-oc-masivamente.md)
- [CU-028 Gestionar instancia de Pagos de la carpeta](CU-028-gestionar-instancia-pagos-carpeta.md)

## Dudas y trazabilidad

Cada caso de uso relevante tiene su archivo `-DUDAS.md` con:
- dudas abiertas
- incoherencias detectadas
- ajuste AS-IS cuando aplica

## Observaciones de consistencia

- La OC puede originarse fuera del sistema y luego incorporarse al circuito operativo.
- Las aperturas parciales de una carpeta pueden tener documentación propia.
- El seguimiento de producción hoy se hace con cadencia manual y escalado informal.
- El control documental y el control de arribos hoy dependen de operación manual.
- El bloque VAL reemplaza un control manual artículo por artículo hoy resuelto por correo.
- La solapa de Pagos complementa el control financiero informal que hoy vive en Excels auxiliares.

