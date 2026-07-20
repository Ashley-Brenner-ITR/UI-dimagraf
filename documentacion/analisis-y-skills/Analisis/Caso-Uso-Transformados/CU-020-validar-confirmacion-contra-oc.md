# Caso de Uso: Validar confirmacion contra OC

## 1. Identificacion
- **ID:** CU-020
- **Nombre:** Validar confirmacion contra OC
- **Actor(es) Principal(es):** Operador de Importaciones
- **Actor(es) Secundario(s):** Sistema
- **Tipo:** Primario
- **Nivel:** Sistema
- **Prioridad:** Alta
- **Version:** v1.0
- **Autor:** *[Por definir]*
- **Fecha:** *[Por definir]*

---
## 2. Descripcion
Ejecuta la validacion completa de la confirmacion del proveedor contra la OC.

---
## 3. Actores
| Actor | Descripcion | Interes |
|-------|-------------|---------|
| Operador de Importaciones | Inicia y revisa | Obtener resultado consolidado |
| Sistema | Orquesta la validacion | Presentar el resultado |

---
## 4. Objetivo del Caso de Uso
Obtener el resultado consolidado de validacion de confirmacion.

---
## 5. Precondiciones
- Confirmacion importada.
- OC obtenida.

---
## 6. Postcondiciones
- La validacion queda lista para visualizacion.

---
## 7. Flujo Principal
1. El sistema ejecuta CU-019.
2. Consolida el resultado.
3. Deja listo el resultado para CU-022.

---
## 8. Flujos Alternativos
- Validacion con diferencias aceptables.

---
## 9. Flujos de Excepcion
- Error de documentos o servicio.

---
## 10. Reglas de Negocio
- La validacion depende de la comparacion previa.

---
## 11. Datos Utilizados
Documento importado, OC, resultado comparativo.

---
## 12. Relaciones
- **Casos de uso relacionados:** CU-016, CU-018, CU-019, CU-022
- **Requisitos relacionados:** RF-030

---
## 13. Criterios de Aceptacion
- [ ] Se presenta el resultado consolidado.
- [ ] El resultado queda listo para visualizacion.

---
## 14. Notas y Consideraciones
- El flujo de confirmacion es previo al preembarque.

