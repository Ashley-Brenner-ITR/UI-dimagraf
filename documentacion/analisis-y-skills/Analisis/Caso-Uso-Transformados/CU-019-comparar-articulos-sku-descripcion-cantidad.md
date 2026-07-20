# Caso de Uso: Comparar articulos (SKU + descripcion + cantidad)

## 1. Identificacion
- **ID:** CU-019
- **Nombre:** Comparar articulos (SKU + descripcion + cantidad)
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
Permite comparar los articulos del documento importado contra la OC con criterios exactos, semanticos y numericos.

---
## 3. Actores
| Actor | Descripcion | Interes |
|-------|-------------|---------|
| Operador de Importaciones | Revisa el resultado | Detectar diferencias |
| Sistema | Ejecuta la comparacion | Clasificar coincidencias |

---
## 4. Objetivo del Caso de Uso
Determinar coincidencias, diferencias, faltantes y sobrantes por articulo.

---
## 5. Precondiciones
- Existe una OC obtenida y un documento extraido.

---
## 6. Postcondiciones
- Quedan marcados los resultados comparativos por articulo.

---
## 7. Flujo Principal
1. El sistema compara por SKU.
2. Compara por descripcion.
3. Compara cantidades.
4. Consolida el resultado por articulo.

---
## 8. Flujos Alternativos
- SKU correcto con descripcion diferente.
- Cantidad dentro de tolerancia.

---
## 9. Flujos de Excepcion
- Articulo faltante.
- Articulo sobrante.

---
## 10. Reglas de Negocio
- SKU exacto.
- Descripcion semantica.
- Cantidad con tolerancia.

---
## 11. Datos Utilizados
SKU, descripcion, cantidad, umbral de similitud, tolerancia.

---
## 12. Relaciones
- **Casos de uso relacionados:** CU-018, CU-020, CU-021
- **Requisitos relacionados:** RF-027, RF-028, RF-029, RF-032, RF-033

---
## 13. Criterios de Aceptacion
- [ ] Se marca coincidencia correcta cuando todo coincide.
- [ ] Se detecta diferencia textual o cuantitativa.
- [ ] Se marcan faltantes y sobrantes.

---
## 14. Notas y Consideraciones
- La comparacion semantica complementa el SKU.

