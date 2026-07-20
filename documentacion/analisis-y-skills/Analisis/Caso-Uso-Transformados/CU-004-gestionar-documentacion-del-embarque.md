# Caso de Uso: Gestionar documentacion del embarque

## 1. Identificacion
- **ID:** CU-004
- **Nombre:** Gestionar documentacion del embarque
- **Actor(es) Principal(es):** Operador de Importaciones
- **Actor(es) Secundario(s):** Roles autorizados a ver anexos
- **Tipo:** Primario
- **Nivel:** Usuario
- **Prioridad:** Alta
- **Version:** v1.0
- **Autor:** *[Por definir]*
- **Fecha:** *[Por definir]*

---

## 2. Descripcion
Permite adjuntar, clasificar y consultar la documentacion asociada a un embarque, con control de visibilidad segun tipo de documento y rol.

---

## 3. Actores
| Actor | Descripcion | Interes |
|-------|-------------|---------|
| Operador de Importaciones | Usuario que carga y administra los documentos | Mantener la documentacion ordenada y disponible |
| Roles autorizados a ver anexos | Usuarios con permisos de consulta | Acceder solo a los anexos habilitados |

---

## 4. Objetivo del Caso de Uso
Administrar la documentacion asociada a un embarque de forma clasificada y controlada por permisos.

---

## 5. Precondiciones
- El usuario debe estar autenticado.
- Debe existir un embarque o entidad sobre la que asociar documentos.

---

## 6. Postcondiciones
- La documentacion queda cargada y clasificada.
- La visibilidad de los anexos queda definida segun permisos.

---

## 7. Flujo Principal
1. El Operador accede a la gestion documental del embarque.
2. Carga un documento adjunto.
3. Clasifica el documento por tipo.
4. Define su visibilidad segun rol, cuando corresponda.
5. El sistema guarda el documento asociado al embarque.
6. Los usuarios habilitados pueden consultarlo.

---

## 8. Flujos Alternativos

### 8.1 Visualizacion restringida por rol
- **Condicion:** El usuario no tiene permiso para ver cierto anexo.
- **Pasos:**
  1. El sistema oculta el documento.
  2. El usuario solo ve los anexos permitidos.

---

## 9. Flujos de Excepcion

### E1 - Documento sin clasificacion
- **Condicion:** El documento se intenta guardar sin tipo definido.
- **Pasos:**
  1. El sistema detecta la falta de clasificacion.
  2. El sistema impide completar el guardado o solicita completar el tipo.

---

## 10. Reglas de Negocio
- El anexo debe tener tipo.
- La visibilidad depende del rol.

---

## 11. Datos Utilizados

### Entradas
| Dato | Descripcion | Fuente |
|------|-------------|--------|
| Tipo de documento | Clasificacion del anexo | Operador |
| Rol | Perfil autorizado a visualizar | Sistema / administrador |
| Archivo adjunto | Documento cargado | Operador |

### Salidas
| Dato | Descripcion | Destino |
|------|-------------|---------|
| Documento asociado | Anexo vinculado al embarque | Sistema |
| Visibilidad de anexos | Permisos de consulta | Usuarios |

---

## 12. Relaciones
- **Casos de uso relacionados:** CU-002, CU-005
- **Requisitos relacionados:** RF-008, RF-041

---

## 13. Criterios de Aceptacion
- [ ] El sistema permite adjuntar documentos al embarque.
- [ ] El sistema permite clasificar cada documento por tipo.
- [ ] El sistema permite definir visibilidad por rol.
- [ ] El sistema oculta anexos no habilitados para un rol.

---

## 14. Notas y Consideraciones
- Existe una contradiccion funcional sobre si los anexos deben ubicarse en una solapa general o dentro de la instancia que los requiere.
- El alcance exacto de la visibilidad por rol debe resolverse antes de construir.
- En el proceso actual, cada apertura del embarque puede tener su propia factura y documentacion asociada.
