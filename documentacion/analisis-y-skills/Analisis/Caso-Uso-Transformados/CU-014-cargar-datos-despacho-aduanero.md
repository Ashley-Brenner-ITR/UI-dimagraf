# Caso de Uso: Cargar datos de despacho aduanero (Despachante)

## 1. Identificacion
- **ID:** CU-014
- **Nombre:** Cargar datos de despacho aduanero (Despachante)
- **Actor(es) Principal(es):** Despachante Aduanero
- **Actor(es) Secundario(s):** Operador de Importaciones
- **Tipo:** Primario
- **Nivel:** Usuario
- **Prioridad:** Alta
- **Version:** v1.0
- **Autor:** *[Por definir]*
- **Fecha:** *[Por definir]*

---
## 2. Descripcion
Permite al despachante cargar datos del despacho asignado, con acceso restringido a su alcance.

---
## 3. Actores
| Actor | Descripcion | Interes |
|-------|-------------|---------|
| Despachante Aduanero | Carga informacion aduanera | Completar su gestion |
| Operador de Importaciones | Recibe el estado | Mantener trazabilidad |

---
## 4. Objetivo del Caso de Uso
Registrar la informacion aduanera necesaria sin exponer datos financieros.

---
## 5. Precondiciones
- Existe un embarque asignado al despachante.

---
## 6. Postcondiciones
- Los datos del despacho quedan registrados.

---
## 7. Flujo Principal
1. El Despachante ingresa al embarque asignado.
2. Carga DUA, canal, gastos, VEP y fechas.
3. El sistema guarda la informacion y notifica al Operador.

---
## 8. Flujos Alternativos
- Actualizacion de un dato ya cargado.

---
## 9. Flujos de Excepcion
- Acceso a embarques no asignados.

---
## 10. Reglas de Negocio
- El Despachante no ve datos financieros ni costeo.

---
## 11. Datos Utilizados
DUA, canal, gastos, VEP, fechas.

---
## 12. Relaciones
- **Casos de uso relacionados:** CU-006, CU-015
- **Requisitos relacionados:** RF-020

---
## 13. Criterios de Aceptacion
- [ ] El Despachante puede cargar datos del despacho.
- [ ] No puede ver costos ni datos financieros.
- [ ] El sistema notifica al Operador.

---
## 14. Notas y Consideraciones
- El acceso se limita a embarques asignados.

