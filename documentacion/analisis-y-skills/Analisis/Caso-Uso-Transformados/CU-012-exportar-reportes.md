# Caso de Uso: Exportar reportes

## 1. Identificacion
- **ID:** CU-012
- **Nombre:** Exportar reportes
- **Actor(es) Principal(es):** Usuario con acceso a reportes
- **Actor(es) Secundario(s):** Sistema
- **Tipo:** Secundario
- **Nivel:** Usuario
- **Prioridad:** Media
- **Version:** v1.0
- **Autor:** *[Por definir]*
- **Fecha:** *[Por definir]*

---
## 2. Descripcion
Permite exportar reportes operativos o enviarlos automaticamente segun configuracion.

---
## 3. Actores
| Actor | Descripcion | Interes |
|-------|-------------|---------|
| Usuario con acceso a reportes | Solicita exportaciones | Obtener informacion util |
| Sistema | Genera y envía reportes | Automatizar salida |

---
## 4. Objetivo del Caso de Uso
Generar reportes manuales o automaticos para las areas interesadas.

---
## 5. Precondiciones
- Existe configuracion de reportes o una solicitud manual.

---
## 6. Postcondiciones
- El archivo se genera o se envía por email.

---
## 7. Flujo Principal
1. El usuario solicita un reporte.
2. El sistema genera el archivo.
3. El sistema lo descarga o lo envía.

---
## 8. Flujos Alternativos
- Envio automatico semanal.

---
## 9. Flujos de Excepcion
- Datos insuficientes para generar el reporte.

---
## 10. Reglas de Negocio
- El formato puede ser Excel o PDF segun configuracion.

---
## 11. Datos Utilizados
Arribos, vencimientos, saldos.

---
## 12. Relaciones
- **Casos de uso relacionados:** CU-008, CU-009
- **Requisitos relacionados:** RF-015

---
## 13. Criterios de Aceptacion
- [ ] El reporte se genera en menos de 5 segundos.
- [ ] El sistema puede enviarlo automáticamente.

---
## 14. Notas y Consideraciones
- Los destinatarios y la frecuencia deben ser configurables.

