# Caso de Uso: Visualizar resultados comparativos

## 1. Identificacion
- **ID:** CU-022
- **Nombre:** Visualizar resultados comparativos
- **Actor(es) Principal(es):** Operador de Importaciones
- **Actor(es) Secundario(s):** Sistema
- **Tipo:** Primario
- **Nivel:** Usuario
- **Prioridad:** Alta
- **Version:** v1.0
- **Autor:** *[Por definir]*
- **Fecha:** *[Por definir]*

---
## 2. Descripcion
Muestra la comparacion entre la OC y el documento importado con indicadores por articulo.

---
## 3. Actores
| Actor | Descripcion | Interes |
|-------|-------------|---------|
| Operador de Importaciones | Revisa el comparativo | Tomar una decision |
| Sistema | Renderiza el resultado | Facilitar la lectura |

---
## 4. Objetivo del Caso de Uso
Presentar el resultado comparativo de forma clara.

---
## 5. Precondiciones
- Existe una validacion ejecutada.

---
## 6. Postcondiciones
- El usuario puede aprobar o cancelar.

---
## 7. Flujo Principal
1. El Operador abre la pantalla.
2. El sistema muestra OC y documento lado a lado.
3. El sistema marca cada articulo con su indicador.

---
## 8. Flujos Alternativos
- Visualizacion de confirmacion o preembarque.

---
## 9. Flujos de Excepcion
- Resultado incompleto o no disponible.

---
## 10. Reglas de Negocio
- La visualizacion debe ser clara y legible.

---
## 11. Datos Utilizados
Codigo, descripcion, cantidad y estado comparativo.

---
## 12. Relaciones
- **Casos de uso relacionados:** CU-019, CU-023, CU-024
- **Requisitos relacionados:** RF-032, RF-033

---
## 13. Criterios de Aceptacion
- [ ] Se muestra una tabla lado a lado.
- [ ] Se indica el estado por articulo.

---
## 14. Notas y Consideraciones
- La interfaz debe priorizar la lectura de diferencias.

