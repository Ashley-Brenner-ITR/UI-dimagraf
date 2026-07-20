# Caso de Uso: Cargar articulos de la OC en forma masiva

## 1. Identificacion
- **ID:** CU-027
- **Nombre:** Cargar articulos de la OC en forma masiva
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
Permite cargar todos los articulos de una OC desde un archivo, como carga inicial o masiva.

---
## 3. Actores
| Actor | Descripcion | Interes |
|-------|-------------|---------|
| Operador de Importaciones | Importa el archivo | Cargar articulos rapido |
| Sistema | Valida filas y crea articulos | Mantener consistencia |

---
## 4. Objetivo del Caso de Uso
Completar la OC con articulos en un solo paso.

---
## 5. Precondiciones
- La OC esta en alta y vacia de articulos.

---
## 6. Postcondiciones
- Los articulos quedan cargados o parcialmente cargados con errores informados.

---
## 7. Flujo Principal
1. El Operador importa el archivo.
2. El sistema valida el formato.
3. El sistema crea los articulos.
4. El sistema muestra el resumen.

---
## 8. Flujos Alternativos
- Archivo con filas invalidas.

---
## 9. Flujos de Excepcion
- Codigo inexistente o cantidad no numerica.

---
## 10. Reglas de Negocio
- La carga masiva coexiste con la carga manual.

---
## 11. Datos Utilizados
Codigo de articulo, cantidad, datos adicionales.

---
## 12. Relaciones
- **Casos de uso relacionados:** CU-001
- **Requisitos relacionados:** RF-042

---
## 13. Criterios de Aceptacion
- [ ] El sistema crea todos los articulos en un solo paso.
- [ ] El sistema informa filas con error.

---
## 14. Notas y Consideraciones
- El sistema no debe perder las filas validas si hay errores parciales.

