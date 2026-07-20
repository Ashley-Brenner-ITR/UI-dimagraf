# Caso de Uso: Importar confirmacion del proveedor

## 1. Identificacion
- **ID:** CU-016
- **Nombre:** Importar confirmacion del proveedor
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
Permite cargar el archivo de confirmacion del proveedor y disparar la validacion automatica.

---
## 3. Actores
| Actor | Descripcion | Interes |
|-------|-------------|---------|
| Operador de Importaciones | Carga el documento | Validar la confirmacion |
| Sistema | Procesa el archivo | Iniciar el pipeline |

---
## 4. Objetivo del Caso de Uso
Importar la confirmacion para compararla contra la OC.

---
## 5. Precondiciones
- Existe un embarque en instancia de confirmacion.

---
## 6. Postcondiciones
- El documento queda cargado y listo para curado.

---
## 7. Flujo Principal
1. El Operador carga el archivo.
2. El sistema valida el formato.
3. El sistema dispara el curado.

---
## 8. Flujos Alternativos
- Archivo no soportado.

---
## 9. Flujos de Excepcion
- Formato incorrecto.

---
## 10. Reglas de Negocio
- Solo se aceptan PDF o Excel estructurado.

---
## 11. Datos Utilizados
Archivo de confirmacion.

---
## 12. Relaciones
- **Casos de uso relacionados:** CU-018, CU-020
- **Requisitos relacionados:** RF-024

---
## 13. Criterios de Aceptacion
- [ ] El sistema acepta PDF o Excel.
- [ ] El sistema rechaza formatos no soportados.

---
## 14. Notas y Consideraciones
- El documento dispara la Etapa 1 del pipeline.

