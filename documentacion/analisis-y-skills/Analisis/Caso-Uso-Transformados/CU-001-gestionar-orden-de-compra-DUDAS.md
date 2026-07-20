# Dudas e incoherencias - CU-001 Gestionar Orden de Compra

## 1. Alcance de modificación de una OC abierta
- El ERS indica que se puede modificar una OC abierta sin embarques activos, pero no define si hay restricciones por cambios financieros, de proveedor o de articulos ya asociados.

## 2. Interacción con saldos y cierres
- Se menciona cierre automatico al llegar a saldo cero, pero no queda explicitado si existe una confirmacion previa o una excepcion manual.

## 3. Relación con carga masiva
- RF-042 coexiste con la carga manual: la carga masiva cubre la carga inicial o importaciones completas de articulos, y la carga manual queda como alternativa para altas puntuales o ajustes.

## 4. Ajuste AS-IS
- En el proceso actual, la OC suele originarse fuera del sistema y luego Importaciones la valida y la carga en el circuito operativo.
