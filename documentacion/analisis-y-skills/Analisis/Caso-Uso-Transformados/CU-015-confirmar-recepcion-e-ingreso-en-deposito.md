# Caso de Uso: Confirmar recepcion e ingreso en Deposito

## 1. Identificacion
- **ID:** CU-015
- **Nombre:** Confirmar recepcion e ingreso en Deposito
- **Actor(es) Principal(es):** Depósito (Garin)
- **Actor(es) Secundario(s):** Operador de Importaciones
- **Tipo:** Primario
- **Nivel:** Usuario
- **Prioridad:** Alta
- **Version:** v1.0
- **Autor:** *[Por definir]*
- **Fecha:** *[Por definir]*

---
## 2. Descripcion
Permite confirmar el arribo al deposito y registrar diferencias durante la recepción.

---
## 3. Actores
| Actor | Descripcion | Interes |
|-------|-------------|---------|
| Depósito (Garin) | Confirma ingreso físico | Registrar recepción |
| Operador de Importaciones | Sigue la resolución | Mantener la OC controlada |

---
## 4. Objetivo del Caso de Uso
Registrar la recepción del embarque y su eventual discrepancia.

---
## 5. Precondiciones
- Existe una notificación de arribo o una llegada registrada.

---
## 6. Postcondiciones
- El estado del embarque queda actualizado y, si hay discrepancia, permanece abierto.

---
## 7. Flujo Principal
1. El Depósito recibe la notificación.
2. Confirma la recepción completa.
3. El sistema actualiza el estado y notifica al Operador.

---
## 8. Flujos Alternativos
- Recepción con discrepancia y reclamo.

---
## 9. Flujos de Excepcion
- Faltante de cantidad o producto.

---
## 10. Reglas de Negocio
- La discrepancia no cierra la OC automaticamente.

---
## 11. Datos Utilizados
Detalle de embarque, cantidad esperada, cantidad recibida.

---
## 12. Relaciones
- **Casos de uso relacionados:** CU-007, CU-014
- **Requisitos relacionados:** RF-013, RF-045

---
## 13. Criterios de Aceptacion
- [ ] El Depósito puede confirmar recepción.
- [ ] El sistema registra discrepancias.
- [ ] El Operador es notificado.

---
## 14. Notas y Consideraciones
- La recepción puede hacerse desde interfaz movil o tablet.

