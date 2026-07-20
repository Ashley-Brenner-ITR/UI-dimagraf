# Caso de Uso: Confirmar recepcion en deposito

## 1. Identificacion
- **ID:** CU-007
- **Nombre:** Confirmar recepcion en deposito
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
Permite confirmar la recepcion fisica del embarque y registrar incidencias o discrepancias.

---
## 3. Actores
| Actor | Descripcion | Interes |
|-------|-------------|---------|
| Depósito (Garin) | Confirma ingreso fisico | Registrar recepción |
| Operador de Importaciones | Recibe el estado | Seguir la trazabilidad |

---
## 4. Objetivo del Caso de Uso
Registrar la recepcion del embarque en deposito y las incidencias detectadas.

---
## 5. Precondiciones
- Existe notificacion de arribo.

---
## 6. Postcondiciones
- El embarque queda como recibido o con incidencia registrada.

---
## 7. Flujo Principal
1. El Depósito accede a la notificacion.
2. Confirma la recepcion completa.
3. El sistema actualiza el estado y notifica al Operador.

---
## 8. Flujos Alternativos
### 8.1 Recepcion con discrepancias
- Se registra la incidencia y se vincula al embarque.

---
## 9. Flujos de Excepcion
- Faltantes de articulos o diferencias de cantidad.

---
## 10. Reglas de Negocio
- La discrepancia debe quedar asociada al embarque.

---
## 11. Datos Utilizados
Articulos recibidos, incidencias, estado del embarque.

---
## 12. Relaciones
- **Casos de uso relacionados:** CU-005, CU-015
- **Requisitos relacionados:** RF-013

---
## 13. Criterios de Aceptacion
- [ ] Se puede confirmar recepción completa.
- [ ] Se puede registrar una discrepancia.
- [ ] El Operador recibe notificacion.

---
## 14. Notas y Consideraciones
- El analisis base y el criterio de aceptación muestran que el depósito puede operar desde interfaz movil o tablet.

