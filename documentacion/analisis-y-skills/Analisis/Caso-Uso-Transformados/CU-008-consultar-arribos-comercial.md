# Caso de Uso: Consultar Arribos (Comercial)

## 1. Identificacion
- **ID:** CU-008
- **Nombre:** Consultar Arribos (Comercial)
- **Actor(es) Principal(es):** Comercial
- **Actor(es) Secundario(s):** *[No especificado en el analisis]*
- **Tipo:** Primario
- **Nivel:** Usuario
- **Prioridad:** Alta
- **Version:** v1.0
- **Autor:** *[Por definir]*
- **Fecha:** *[Por definir]*

---
## 2. Descripcion
Permite a Comercial consultar la vista de arribos en tiempo real sin exponer datos de costos ni pagos.

---
## 3. Actores
| Actor | Descripcion | Interes |
|-------|-------------|---------|
| Comercial | Usuario de consulta | Ver arribos actualizados |

---
## 4. Objetivo del Caso de Uso
Mostrar embarques activos con informacion operativa para el area Comercial.

---
## 5. Precondiciones
- Usuario autenticado con rol Comercial.

---
## 6. Postcondiciones
- La vista de arribos se muestra filtrable y actualizada.

---
## 7. Flujo Principal
1. Comercial accede a la vista.
2. El sistema muestra embarques activos con ETA, proveedor, articulos y estado.
3. El usuario filtra si lo necesita.

---
## 8. Flujos Alternativos
- Filtrar por articulo o proveedor.

---
## 9. Flujos de Excepcion
- Acceso sin permisos o datos sin actualizar.

---
## 10. Reglas de Negocio
- No mostrar costos ni pagos.

---
## 11. Datos Utilizados
ETA, proveedor, articulos, estado.

---
## 12. Relaciones
- **Casos de uso relacionados:** CU-005
- **Requisitos relacionados:** RF-010

---
## 13. Criterios de Aceptacion
- [ ] Se muestran arribos en tiempo real.
- [ ] Se puede filtrar por articulo o proveedor.
- [ ] No se exponen costos ni pagos.

---
## 14. Notas y Consideraciones
- El criterio de aceptación indica respuesta en menos de 3 segundos.

