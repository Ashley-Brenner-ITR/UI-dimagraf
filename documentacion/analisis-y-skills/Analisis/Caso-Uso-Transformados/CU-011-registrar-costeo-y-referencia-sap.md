# Caso de Uso: Registrar costeo y referencia SAP

## 1. Identificacion
- **ID:** CU-011
- **Nombre:** Registrar costeo y referencia SAP
- **Actor(es) Principal(es):** Operador de Importaciones
- **Actor(es) Secundario(s):** Direccion
- **Tipo:** Primario
- **Nivel:** Usuario
- **Prioridad:** Media
- **Version:** v1.0
- **Autor:** *[Por definir]*
- **Fecha:** *[Por definir]*

---
## 2. Descripcion
Permite registrar el costeo y las referencias de SAP para preparar la carga manual.

---
## 3. Actores
| Actor | Descripcion | Interes |
|-------|-------------|---------|
| Operador de Importaciones | Completa el costeo | Dejar la operacion lista |
| Direccion | Consume informacion resumida | Controlar costos |

---
## 4. Objetivo del Caso de Uso
Dejar los datos de costeo y referencia listos para SAP.

---
## 5. Precondiciones
- El embarque debe estar recibido.

---
## 6. Postcondiciones
- El costeo y las referencias quedan registrados.

---
## 7. Flujo Principal
1. El Operador registra Tx 45, 55 y 18.
2. Registra el coeficiente.
3. El sistema guarda y permite exportar.

---
## 8. Flujos Alternativos
- Exportacion de datos para SAP.

---
## 9. Flujos de Excepcion
- Costeo incompleto.

---
## 10. Reglas de Negocio
- El sistema no modifica SAP directamente.

---
## 11. Datos Utilizados
Tx 45, 55, 18, coeficiente, referencia SAP.

---
## 12. Relaciones
- **Casos de uso relacionados:** CU-006, CU-012
- **Requisitos relacionados:** RF-017, RF-040

---
## 13. Criterios de Aceptacion
- [ ] Se registran las referencias SAP.
- [ ] Se registra el coeficiente.
- [ ] Se puede exportar a Excel o CSV.

---
## 14. Notas y Consideraciones
- El coeficiente es un atributo de la apertura/subcarpeta.

