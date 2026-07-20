# Caso de Uso: Obtener OC del sistema

## 1. Identificacion
- **ID:** CU-018
- **Nombre:** Obtener OC del sistema
- **Actor(es) Principal(es):** Sistema
- **Actor(es) Secundario(s):** Operador de Importaciones
- **Tipo:** Secundario
- **Nivel:** Sistema
- **Prioridad:** Alta
- **Version:** v1.0
- **Autor:** *[Por definir]*
- **Fecha:** *[Por definir]*

---
## 2. Descripcion
Permite recuperar la OC asociada al embarque para usarla como fuente de verdad.

---
## 3. Actores
| Actor | Descripcion | Interes |
|-------|-------------|---------|
| Sistema | Recupera la OC | Alimentar la validacion |
| Operador de Importaciones | Consume el resultado | Comparar contra el documento |

---
## 4. Objetivo del Caso de Uso
Obtener los articulos y cantidades de la OC sin modificarla.

---
## 5. Precondiciones
- Existe una OC registrada y asociada al embarque.

---
## 6. Postcondiciones
- La OC queda disponible para comparacion.

---
## 7. Flujo Principal
1. El motor solicita la OC.
2. El sistema recupera codigo, descripcion y cantidad.
3. Devuelve la informacion en modo solo lectura.

---
## 8. Flujos Alternativos
- OC no encontrada o no asociada.

---
## 9. Flujos de Excepcion
- Falta de datos de la OC.

---
## 10. Reglas de Negocio
- La OC no debe modificarse.

---
## 11. Datos Utilizados
Codigo, descripcion y cantidad de articulos de la OC.

---
## 12. Relaciones
- **Casos de uso relacionados:** CU-019, CU-020, CU-021
- **Requisitos relacionados:** RF-026

---
## 13. Criterios de Aceptacion
- [ ] El sistema devuelve la OC en modo solo lectura.
- [ ] No se modifica MOD-001.

---
## 14. Notas y Consideraciones
- La OC es la fuente de verdad del componente VAL.

