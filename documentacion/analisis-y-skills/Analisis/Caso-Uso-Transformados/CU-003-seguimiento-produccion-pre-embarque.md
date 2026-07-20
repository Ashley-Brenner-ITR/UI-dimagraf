# Caso de Uso: Hacer seguimiento de produccion pre-embarque

## 1. Identificacion
- **ID:** CU-003
- **Nombre:** Hacer seguimiento de produccion pre-embarque
- **Actor(es) Principal(es):** Operador de Importaciones
- **Actor(es) Secundario(s):** Comercial
- **Tipo:** Primario
- **Nivel:** Usuario
- **Prioridad:** Alta
- **Version:** v1.0
- **Autor:** *[Por definir]*
- **Fecha:** *[Por definir]*

---

## 2. Descripcion
Permite registrar el avance de produccion previo al embarque, conservar observaciones y exponer el estado operativo para consulta.

---

## 3. Actores
| Actor | Descripcion | Interes |
|-------|-------------|---------|
| Operador de Importaciones | Usuario que actualiza el seguimiento | Mantener visible el avance real |
| Comercial | Usuario que consulta el estado | Conocer la situacion operativa del embarque |

---

## 4. Objetivo del Caso de Uso
Registrar y consultar el estado de produccion pre-embarque para tener trazabilidad del avance operativo.

---

## 5. Precondiciones
- El usuario debe estar autenticado.
- Debe existir un embarque u OC sobre el que se hará el seguimiento.

---

## 6. Postcondiciones
- El estado de produccion queda registrado.
- El historial cronologico queda actualizado.
- El estado puede ser consultado por otras vistas.

---

## 7. Flujo Principal
1. El Operador accede al seguimiento de produccion.
2. Registra el estado o avance pre-embarque.
3. Agrega observaciones si corresponde.
4. El sistema guarda el cambio con su timestamp.
5. El sistema actualiza el historial cronologico.
6. El sistema expone el estado para otras areas.

---

## 8. Flujos Alternativos

### 8.1 Actualizacion manual del seguimiento
- **Condicion:** El Operador necesita corregir o completar el estado.
- **Pasos:**
  1. El Operador actualiza el seguimiento.
  2. El sistema conserva el nuevo estado como parte del historial.

---

## 9. Flujos de Excepcion

### E1 - Falta de informacion de avance
- **Condicion:** No hay datos suficientes para registrar el seguimiento.
- **Pasos:**
  1. El sistema detecta la falta de informacion.
  2. El sistema impide completar el registro.

---

## 10. Reglas de Negocio
- El estado debe alinearse con el proceso operativo definido.
- El historial debe conservar el orden cronologico.

---

## 11. Datos Utilizados

### Entradas
| Dato | Descripcion | Fuente |
|------|-------------|--------|
| Estado de produccion | Situacion actual del embarque | Operador |
| Observaciones | Comentarios del seguimiento | Operador |
| Timestamp | Momento del registro | Sistema |

### Salidas
| Dato | Descripcion | Destino |
|------|-------------|---------|
| Historial de seguimiento | Registro cronologico del avance | Sistema / usuarios |
| Estado operativo | Estado visible del proceso | Usuarios |

---

## 12. Relaciones
- **Casos de uso relacionados:** CU-002, CU-004
- **Requisitos relacionados:** RF-006, RF-007

---

## 13. Criterios de Aceptacion
- [ ] El sistema permite registrar un avance de produccion.
- [ ] El sistema guarda observaciones del seguimiento.
- [ ] El sistema conserva el historial cronologico.
- [ ] El sistema expone el estado para consultas de otras areas.

---

## 14. Notas y Consideraciones
- El analisis no precisa el catalogo completo de estados intermedios.
- No se define un flujo especifico para estados de retraso o bloqueo.
- En el proceso actual, el seguimiento se hace con una cadencia operativa recurrente y puede escalar a contacto urgente por canales informales cuando hay criticidad.
