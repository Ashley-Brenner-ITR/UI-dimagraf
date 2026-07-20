# Caso de Uso: Confirmar pago al proveedor (Tesoreria)

## 1. Identificacion
- **ID:** CU-010
- **Nombre:** Confirmar pago al proveedor (Tesoreria)
- **Actor(es) Principal(es):** Tesoreria
- **Actor(es) Secundario(s):** Operador de Importaciones
- **Tipo:** Primario
- **Nivel:** Usuario
- **Prioridad:** Alta
- **Version:** v1.0
- **Autor:** *[Por definir]*
- **Fecha:** *[Por definir]*

---
## 2. Descripcion
Permite registrar pagos ejecutados al proveedor y actualizar el estado del vencimiento.

---
## 3. Actores
| Actor | Descripcion | Interes |
|-------|-------------|---------|
| Tesoreria | Registra el pago | Dejar constancia del pago |
| Operador de Importaciones | Recibe notificacion | Mantener visibilidad |

---
## 4. Objetivo del Caso de Uso
Registrar el pago real y reflejarlo en el flujo financiero.

---
## 5. Precondiciones
- Existe una OC con vencimiento activo.

---
## 6. Postcondiciones
- El pago queda marcado como pagado.
- Se registra la fecha real del pago.

---
## 7. Flujo Principal
1. Tesoreria abre el vencimiento.
2. Registra fecha y monto del pago.
3. El sistema actualiza el estado a pagado.
4. El Operador recibe notificacion.

---
## 8. Flujos Alternativos
- Pago anticipado antes del vencimiento estimado.

---
## 9. Flujos de Excepcion
- Datos de pago incompletos.

---
## 10. Reglas de Negocio
- El pago puede registrarse antes del vencimiento.

---
## 11. Datos Utilizados
Fecha de pago, monto, estado del vencimiento.

---
## 12. Relaciones
- **Casos de uso relacionados:** CU-009, CU-028
- **Requisitos relacionados:** RF-013

---
## 13. Criterios de Aceptacion
- [ ] Se puede registrar un pago ejecutado.
- [ ] Se puede registrar un pago anticipado.
- [ ] El estado cambia a pagado.

---
## 14. Notas y Consideraciones
- La vista de pagos no debe exponer datos de costeo.

