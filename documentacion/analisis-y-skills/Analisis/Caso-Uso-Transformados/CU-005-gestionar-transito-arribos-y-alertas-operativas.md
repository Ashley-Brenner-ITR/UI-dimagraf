# Caso de Uso: Gestionar transito, arribos y alertas operativas

## 1. Identificacion
- **ID:** CU-005
- **Nombre:** Gestionar transito, arribos y alertas operativas
- **Actor(es) Principal(es):** Operador de Importaciones
- **Actor(es) Secundario(s):** Comercial, Tesoreria
- **Tipo:** Primario
- **Nivel:** Usuario
- **Prioridad:** Alta
- **Version:** v1.0
- **Autor:** *[Por definir]*
- **Fecha:** *[Por definir]*

---

## 2. Descripcion
Permite registrar el transito, actualizar ETA y fechas reales, y mantener una vista de arribos y alertas operativas para las areas involucradas.

---

## 3. Actores
| Actor | Descripcion | Interes |
|-------|-------------|---------|
| Operador de Importaciones | Usuario que actualiza datos logistico-operativos | Mantener la informacion actualizada |
| Comercial | Usuario que consulta arribos | Conocer el estado de llegada |
| Tesoreria | Usuario que recibe alertas relacionadas | Anticipar eventos financieros u operativos |

---

## 4. Objetivo del Caso de Uso
Gestionar la informacion de transito y arribos para dar visibilidad operativa y disparar alertas configurables.

---

## 5. Precondiciones
- El usuario debe estar autenticado.
- Debe existir un embarque a monitorear.

---

## 6. Postcondiciones
- La informacion de ETA y transito queda actualizada.
- La vista de arribos queda disponible.
- Las alertas operativas pueden consultarse.

---

## 7. Flujo Principal
1. El Operador registra o actualiza ETA y fechas reales.
2. El sistema refleja el estado de transito.
3. El sistema actualiza la vista de arribos.
4. El sistema genera alertas segun las reglas configuradas.
5. Comercial y otros usuarios habilitados consultan el estado.

---

## 8. Flujos Alternativos

### 8.1 Diferentes destinatarios segun la alerta
- **Condicion:** La alerta corresponde a un evento especifico.
- **Pasos:**
  1. El sistema determina el destinatario.
  2. El sistema envia o muestra la alerta al perfil correspondiente.

---

## 9. Flujos de Excepcion

### E1 - ETA incompleta o desactualizada
- **Condicion:** No existe informacion suficiente para actualizar el transito.
- **Pasos:**
  1. El sistema detecta la falta de datos.
  2. El sistema solicita completar o corregir la informacion.

---

## 10. Reglas de Negocio
- La vista de arribos debe reflejar informacion actualizada.
- Las alertas deben ser configurables.

---

## 11. Datos Utilizados

### Entradas
| Dato | Descripcion | Fuente |
|------|-------------|--------|
| ETA | Fecha estimada de llegada | Operador |
| Medio de transporte | Tipo de transporte asociado | Operador |
| Estado de arribo | Situacion actual del embarque | Operador / sistema |

### Salidas
| Dato | Descripcion | Destino |
|------|-------------|---------|
| Vista de arribos | Consulta operativa actualizada | Comercial / usuarios |
| Notificaciones | Alertas sobre eventos relevantes | Usuarios habilitados |

---

## 12. Relaciones
- **Casos de uso relacionados:** CU-002, CU-004, CU-006
- **Requisitos relacionados:** RF-009, RF-010, RF-019, RF-043

---

## 13. Criterios de Aceptacion
- [ ] El sistema permite registrar ETA y fechas reales.
- [ ] El sistema actualiza la vista de arribos.
- [ ] El sistema genera alertas operativas configurables.
- [ ] Comercial puede consultar arribos en tiempo real.

---

## 14. Notas y Consideraciones
- El ERS no detalla todas las reglas de priorizacion de alertas.
- El reemplazo de la planilla manual es parte del objetivo de este caso de uso.
- El proceso actual usa actualizacion semanal/manual de arribos y seguimiento informal por correo o telefono en casos urgentes.
