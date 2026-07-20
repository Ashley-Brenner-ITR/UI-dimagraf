# Matriz de correspondencia AS-IS -> TO-BE

Esta matriz vincula las unidades refinables del proceso actual con los casos de uso futuros del ERS consolidado.

## Correspondencia principal

| UR AS-IS | Caso AS-IS | CU TO-BE principal | Observacion |
|---|---|---|---|
| UR-ASI-001 | Originar y cargar orden de compra | CU-001 | El TO-BE formaliza carpeta unica, saldos y trazabilidad |
| UR-ASI-002 | Confirmar orden de compra manualmente | CU-016, CU-020 | El TO-BE automatiza la confirmacion y su validacion |
| UR-ASI-003 | Seguir produccion y aperturas parciales | CU-002, CU-003 | El TO-BE separa embarques/subcarpetas y seguimiento de produccion |
| UR-ASI-004 | Preparar facturacion y documentacion de embarque | CU-004, CU-017, CU-021 | El TO-BE formaliza gestion documental y validacion de factura |
| UR-ASI-005 | Seguir transito y publicar arrivals | CU-005, CU-008 | El TO-BE convierte la planilla manual en vistas y alertas operativas |
| UR-ASI-006 | Gestionar despacho aduanero y fondos | CU-006, CU-009, CU-010, CU-014 | El TO-BE distribuye la operacion en despacho, pagos y rol despachante |
| UR-ASI-007 | Recepcionar mercaderia e ingresar a SAP | CU-007, CU-015, CU-011 | El TO-BE separa recepcion, conformidad y costeo/referencia SAP |
| UR-ASI-008 | Mantener maestro de proveedores y plazos | CU-013, CU-001, CU-005, CU-006 | El TO-BE centraliza configuracion y parametros por proveedor |

## Correspondencia inversa

| CU TO-BE | Origen AS-IS principal | Origen AS-IS secundario |
|---|---|---|
| CU-001 | UR-ASI-001 | UR-ASI-008 |
| CU-002 | UR-ASI-003 | UR-ASI-001 |
| CU-003 | UR-ASI-003 | UR-ASI-005 |
| CU-004 | UR-ASI-004 | UR-ASI-003 |
| CU-005 | UR-ASI-005 | UR-ASI-006 |
| CU-006 | UR-ASI-006 | UR-ASI-005 |
| CU-007 | UR-ASI-007 | UR-ASI-005 |
| CU-008 | UR-ASI-005 | UR-ASI-001 |
| CU-009 | UR-ASI-006 | UR-ASI-008 |
| CU-010 | UR-ASI-006 | UR-ASI-007 |
| CU-011 | UR-ASI-007 | UR-ASI-006 |
| CU-012 | UR-ASI-005 | UR-ASI-006 |
| CU-013 | UR-ASI-008 | UR-ASI-001 |
| CU-014 | UR-ASI-006 | UR-ASI-004 |
| CU-015 | UR-ASI-007 | UR-ASI-004 |
| CU-016 | UR-ASI-002 | UR-ASI-004 |
| CU-017 | UR-ASI-004 | UR-ASI-002 |
| CU-018 | UR-ASI-001 | UR-ASI-002 |
| CU-019 | UR-ASI-002 | UR-ASI-004 |
| CU-020 | UR-ASI-002 | UR-ASI-001 |
| CU-021 | UR-ASI-004 | UR-ASI-002 |
| CU-022 | UR-ASI-002 | UR-ASI-004 |
| CU-023 | UR-ASI-002 | UR-ASI-006 |
| CU-024 | UR-ASI-002 | UR-ASI-004 |
| CU-025 | UR-ASI-002 | UR-ASI-004 |
| CU-026 | UR-ASI-004 | UR-ASI-002 |
| CU-027 | UR-ASI-001 | UR-ASI-004 |
| CU-028 | UR-ASI-006 | UR-ASI-008 |

## Criterio de lectura

- `AS-IS` describe lo que el proceso hace hoy.
- `TO-BE` describe la solucion comprometida en el ERS consolidado.
- Una misma unidad AS-IS puede alimentar varios CU futuros.
- Una misma funcionalidad futura puede tener mas de un origen AS-IS.

