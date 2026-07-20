# Caso de Uso: Administrar maestros y configuracion

## 1. Identificacion
- **ID:** CU-013
- **Nombre:** Administrar maestros y configuracion
- **Actor(es) Principal(es):** Administrador del sistema
- **Actor(es) Secundario(s):** *[No especificado en el analisis]*
- **Tipo:** Primario
- **Nivel:** Usuario
- **Prioridad:** Alta
- **Version:** v1.0
- **Autor:** *[Por definir]*
- **Fecha:** *[Por definir]*

---
## 2. Descripcion
Permite administrar proveedores, usuarios, perfiles y parametros del sistema.

---
## 3. Actores
| Actor | Descripcion | Interes |
|-------|-------------|---------|
| Administrador del sistema | Gestiona maestros y permisos | Mantener el sistema parametrizado |

---
## 4. Objetivo del Caso de Uso
Mantener actualizada la configuracion de negocio y seguridad.

---
## 5. Precondiciones
- Administrador autenticado.

---
## 6. Postcondiciones
- Los maestros y permisos quedan actualizados.

---
## 7. Flujo Principal
1. El Administrador registra o modifica un proveedor.
2. Configura parametros y perfiles.
3. El sistema aplica los cambios.

---
## 8. Flujos Alternativos
- Asignacion o modificacion de perfiles de acceso.

---
## 9. Flujos de Excepcion
- Datos incompletos o inconsistentes.

---
## 10. Reglas de Negocio
- La configuracion debe aplicarse de inmediato.

---
## 11. Datos Utilizados
Proveedor, parametros, usuarios, roles.

---
## 12. Relaciones
- **Casos de uso relacionados:** CU-001, CU-010, CU-016
- **Requisitos relacionados:** RF-016, RF-018, RF-039, RF-046

---
## 13. Criterios de Aceptacion
- [ ] Se puede dar de alta un proveedor con parametros.
- [ ] Se pueden administrar perfiles de acceso.

---
## 14. Notas y Consideraciones
- La configuracion debe quedar disponible para las nuevas OCs.

