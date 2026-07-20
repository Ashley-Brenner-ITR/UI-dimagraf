# Caso de Uso: Notificar error de servicio de IA (Sistema)

## 1. Identificacion
- **ID:** CU-025
- **Nombre:** Notificar error de servicio de IA (Sistema)
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
Notifica errores del servicio de IA durante la validacion y permite reintentar o cancelar.

---
## 3. Actores
| Actor | Descripcion | Interes |
|-------|-------------|---------|
| Sistema | Detecta el error | Informar y detener el flujo |
| Operador de Importaciones | Recibe la notificacion | Resolver o cancelar |

---
## 4. Objetivo del Caso de Uso
Gestionar fallas del servicio de IA sin perder el contexto del proceso.

---
## 5. Precondiciones
- Existe una validacion en curso.

---
## 6. Postcondiciones
- El Operador puede reintentar o cancelar.

---
## 7. Flujo Principal
1. El servicio responde con error.
2. El sistema muestra el banner o mensaje.
3. El Operador decide reintentar o cancelar.

---
## 8. Flujos Alternativos
- Timeout, HTTP 5xx, HTTP 429, respuesta malformada.

---
## 9. Flujos de Excepcion
- Servicio no disponible de forma persistente.

---
## 10. Reglas de Negocio
- No se debe perder el contexto de la OC.

---
## 11. Datos Utilizados
Error, estado de la validacion, contexto de la OC.

---
## 12. Relaciones
- **Casos de uso relacionados:** CU-020, CU-021, CU-026
- **Requisitos relacionados:** RF-037

---
## 13. Criterios de Aceptacion
- [ ] El sistema muestra error descriptivo.
- [ ] El sistema ofrece reintentar o cancelar.

---
## 14. Notas y Consideraciones
- El error puede surgir en Etapa 2 o 3.

