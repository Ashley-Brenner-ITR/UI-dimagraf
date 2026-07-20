# Caso de Uso: Cancelar validacion

## 1. Identificacion
- **ID:** CU-024
- **Nombre:** Cancelar validacion
- **Actor(es) Principal(es):** Operador de Importaciones
- **Actor(es) Secundario(s):** Sistema
- **Tipo:** Primario
- **Nivel:** Usuario
- **Prioridad:** Media
- **Version:** v1.0
- **Autor:** *[Por definir]*
- **Fecha:** *[Por definir]*

---
## 2. Descripcion
Permite cancelar el proceso de validacion y mantener el estado previo.

---
## 3. Actores
| Actor | Descripcion | Interes |
|-------|-------------|---------|
| Operador de Importaciones | Cancela la validacion | Detener el flujo |
| Sistema | Registra la cancelacion | Mantener trazabilidad |

---
## 4. Objetivo del Caso de Uso
Registrar la cancelacion sin avanzar el proceso.

---
## 5. Precondiciones
- Existe un resultado visualizado.

---
## 6. Postcondiciones
- La validacion queda cancelada y el estado anterior se conserva.

---
## 7. Flujo Principal
1. El Operador presiona Cancelar.
2. Confirma en el modal.
3. El sistema registra la cancelacion.

---
## 8. Flujos Alternativos
- Cancelacion a mitad del flujo.

---
## 9. Flujos de Excepcion
- Cancelacion sin confirmacion.

---
## 10. Reglas de Negocio
- No debe avanzarse en el proceso.

---
## 11. Datos Utilizados
Decision, usuario, fecha, estado anterior.

---
## 12. Relaciones
- **Casos de uso relacionados:** CU-022, CU-023
- **Requisitos relacionados:** RF-035

---
## 13. Criterios de Aceptacion
- [ ] La cancelacion queda registrada.
- [ ] El flujo no avanza.

---
## 14. Notas y Consideraciones
- El embarque u OC conserva su estado anterior.

