# Caso de Uso: Importar factura (preembarque)

## 1. Identificacion
- **ID:** CU-017
- **Nombre:** Importar factura (preembarque)
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
Permite cargar la factura del proveedor para validar la instancia de preembarque.

---
## 3. Actores
| Actor | Descripcion | Interes |
|-------|-------------|---------|
| Operador de Importaciones | Carga la factura | Ejecutar la validacion |
| Sistema | Procesa el documento | Iniciar el pipeline |

---
## 4. Objetivo del Caso de Uso
Importar la factura de preembarque para compararla con la OC.

---
## 5. Precondiciones
- Existe un embarque en instancia de preembarque.

---
## 6. Postcondiciones
- La factura queda cargada y lista para curado.

---
## 7. Flujo Principal
1. El Operador carga la factura.
2. El sistema acepta el archivo.
3. El sistema dispara el curado.

---
## 8. Flujos Alternativos
- Documento no compatible.

---
## 9. Flujos de Excepcion
- Formato incorrecto.

---
## 10. Reglas de Negocio
- La factura participa en la validacion de preembarque.

---
## 11. Datos Utilizados
Archivo de factura.

---
## 12. Relaciones
- **Casos de uso relacionados:** CU-018, CU-021
- **Requisitos relacionados:** RF-025

---
## 13. Criterios de Aceptacion
- [ ] El sistema acepta la carga de factura.
- [ ] El sistema dispara el pipeline de curado.

---
## 14. Notas y Consideraciones
- La factura utiliza la misma etapa de curado que la confirmacion.

