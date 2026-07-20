# Caso de Uso: Notificar documento no procesable (Sistema)

## 1. Identificacion
- **ID:** CU-026
- **Nombre:** Notificar documento no procesable (Sistema)
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
Notifica cuando el documento no puede procesarse o cuando la confianza de extraccion es insuficiente.

---
## 3. Actores
| Actor | Descripcion | Interes |
|-------|-------------|---------|
| Sistema | Detecta la falla | Detener o pedir revision |
| Operador de Importaciones | Recibe la notificacion | Recargar o revisar manualmente |

---
## 4. Objetivo del Caso de Uso
Informar que el documento requiere recarga o revision manual.

---
## 5. Precondiciones
- Existe un documento cargado.

---
## 6. Postcondiciones
- El Operador conoce el motivo de la falla.

---
## 7. Flujo Principal
1. La Etapa 1 falla o la confianza queda debajo del umbral.
2. El sistema muestra el mensaje.
3. El Operador decide recargar o revisar manualmente.

---
## 8. Flujos Alternativos
- Falla de curado.
- Baja confianza de extraccion.

---
## 9. Flujos de Excepcion
- Archivo corrupto o no reconocido.

---
## 10. Reglas de Negocio
- Debe indicarse si la falla es de curado o de confianza.

---
## 11. Datos Utilizados
Documento, porcentaje de confianza, umbral configurado.

---
## 12. Relaciones
- **Casos de uso relacionados:** CU-016, CU-017, CU-025
- **Requisitos relacionados:** RF-038

---
## 13. Criterios de Aceptacion
- [ ] El sistema muestra el motivo de la falla.
- [ ] El sistema ofrece recargar o continuar con revision manual.

---
## 14. Notas y Consideraciones
- La regla depende del umbral configurado.

