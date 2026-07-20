# Caso de Uso: Gestionar instancia de Pagos de la carpeta

## 1. Identificacion
- **ID:** CU-028
- **Nombre:** Gestionar instancia de Pagos de la carpeta
- **Actor(es) Principal(es):** Tesoreria
- **Actor(es) Secundario(s):** Usuario con acceso
- **Tipo:** Primario
- **Nivel:** Usuario
- **Prioridad:** Alta
- **Version:** v1.0
- **Autor:** *[Por definir]*
- **Fecha:** *[Por definir]*

---
## 2. Descripcion
Permite visualizar y actualizar la solapa Pagos de una carpeta con sus vencimientos y pagos ejecutados.

---
## 3. Actores
| Actor | Descripcion | Interes |
|-------|-------------|---------|
| Tesoreria | Registra pagos | Mantener la carpeta actualizada |
| Usuario con acceso | Consulta pagos | Ver la situacion financiera |

---
## 4. Objetivo del Caso de Uso
Gestionar la informacion de pagos dentro de la carpeta.

---
## 5. Precondiciones
- Existe una carpeta con condicion de pago y vencimientos.

---
## 6. Postcondiciones
- La carpeta refleja estado de pagos actualizado.

---
## 7. Flujo Principal
1. El usuario abre la solapa Pagos.
2. El sistema muestra condicion de pago, vencimientos y pagos ejecutados.
3. Tesoreria registra un pago.
4. El sistema actualiza el estado a pagado.

---
## 8. Flujos Alternativos
- Visualizacion de vencimientos estimados y reales.

---
## 9. Flujos de Excepcion
- Falta de permisos o datos incompletos.

---
## 10. Reglas de Negocio
- El cambio debe reflejarse de inmediato en la vista de la carpeta.

---
## 11. Datos Utilizados
Condicion de pago, vencimientos, estado del pago.

---
## 12. Relaciones
- **Casos de uso relacionados:** CU-009, CU-010
- **Requisitos relacionados:** RF-047

---
## 13. Criterios de Aceptacion
- [ ] La solapa muestra condicion de pago y vencimientos.
- [ ] El pago ejecutado actualiza el estado a pagado.

---
## 14. Notas y Consideraciones
- La solapa debe convivir con el modulo de pagos existente.

