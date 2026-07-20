# Caso de Uso: Generar alertas de vencimiento de pago

## 1. Identificacion
- **ID:** CU-009
- **Nombre:** Generar alertas de vencimiento de pago
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
Permite generar alertas de vencimiento y proyeccion de egresos para Tesoreria.

---
## 3. Actores
| Actor | Descripcion | Interes |
|-------|-------------|---------|
| Tesoreria | Usuario financiero | Anticipar pagos |
| Operador de Importaciones | Usuario de soporte | Mantener seguimiento |

---
## 4. Objetivo del Caso de Uso
Avisar vencimientos proximos y proyectar cash flow de importaciones.

---
## 5. Precondiciones
- Existencia de OCs activas con condiciones de pago.

---
## 6. Postcondiciones
- La alerta se emite y la proyeccion queda disponible.

---
## 7. Flujo Principal
1. El sistema detecta vencimiento proximo.
2. Envía alerta por email a Tesoreria.
3. Tesoreria consulta la proyeccion de egresos.

---
## 8. Flujos Alternativos
- Consulta de flujo de caja desde MOD-010.

---
## 9. Flujos de Excepcion
- Vencimiento no configurado.

---
## 10. Reglas de Negocio
- Las alertas se disparan con parametros configurables.

---
## 11. Datos Utilizados
Fecha de vencimiento, importe, proveedor, moneda.

---
## 12. Relaciones
- **Casos de uso relacionados:** CU-010, CU-028
- **Requisitos relacionados:** RF-011, RF-012

---
## 13. Criterios de Aceptacion
- [ ] Se genera alerta cuando faltan 7 dias o menos.
- [ ] Se muestra la proyeccion de egresos.

---
## 14. Notas y Consideraciones
- Las alertas deben poder enviarse por email.

