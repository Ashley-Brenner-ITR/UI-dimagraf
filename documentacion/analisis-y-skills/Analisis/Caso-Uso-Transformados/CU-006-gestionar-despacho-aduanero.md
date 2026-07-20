# Caso de Uso: Gestionar despacho aduanero

## 1. Identificacion
- **ID:** CU-006
- **Nombre:** Gestionar despacho aduanero
- **Actor(es) Principal(es):** Operador de Importaciones
- **Actor(es) Secundario(s):** Despachante Aduanero
- **Tipo:** Primario
- **Nivel:** Usuario
- **Prioridad:** Alta
- **Version:** v1.0
- **Autor:** *[Por definir]*
- **Fecha:** *[Por definir]*

---
## 2. Descripcion
Permite registrar canal aduanero, gastos y VEP, y mantener el estado del despacho para el flujo de importacion.

---
## 3. Actores
| Actor | Descripcion | Interes |
|-------|-------------|---------|
| Operador de Importaciones | Gestiona el despacho | Completar la operacion aduanera |
| Despachante Aduanero | Carga datos del despacho | Registrar su gestion asignada |

---
## 4. Objetivo del Caso de Uso
Registrar la informacion aduanera necesaria para continuar el flujo de importacion.

---
## 5. Precondiciones
- Usuario autenticado.
- Embarque arribado a puerto o frontera.

---
## 6. Postcondiciones
- Canal, gastos y VEP quedan registrados.
- El estado del embarque se actualiza.

---
## 7. Flujo Principal
1. El usuario accede al despacho.
2. Registra canal aduanero.
3. Carga gastos y VEP.
4. El sistema guarda y actualiza el estado.

---
## 8. Flujos Alternativos
### 8.1 Canal rojo
- El sistema resalta el canal rojo y mantiene el flujo de inspeccion.

---
## 9. Flujos de Excepcion
- Datos faltantes o inconsistentes del despacho.

---
## 10. Reglas de Negocio
- El canal asignado debe quedar registrado.
- Los gastos se integran al costeo.

---
## 11. Datos Utilizados
Canal, gastos, VEP, estado del embarque.

---
## 12. Relaciones
- **Casos de uso relacionados:** CU-005, CU-011, CU-014
- **Requisitos relacionados:** RF-020

---
## 13. Criterios de Aceptacion
- [ ] Se puede registrar canal aduanero.
- [ ] Se pueden registrar gastos y VEP.
- [ ] El estado del embarque se actualiza.

---
## 14. Notas y Consideraciones
- El Despachante no ve costos ni datos financieros.

