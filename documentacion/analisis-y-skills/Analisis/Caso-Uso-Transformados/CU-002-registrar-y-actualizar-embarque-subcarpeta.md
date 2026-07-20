# Caso de Uso: Registrar y actualizar embarque / subcarpeta

## 1. Identificacion
- **ID:** CU-002
- **Nombre:** Registrar y actualizar embarque / subcarpeta
- **Actor(es) Principal(es):** Operador de Importaciones
- **Actor(es) Secundario(s):** *[No especificado en el analisis]*
- **Tipo:** Primario
- **Nivel:** Usuario
- **Prioridad:** Alta
- **Version:** v1.0
- **Autor:** *[Por definir]*
- **Fecha:** *[Por definir]*

---

## 2. Descripcion
Permite crear embarques parciales o completos, asociarlos a una o mas OCs y mantener la trazabilidad mediante subcarpetas operativas.

---

## 3. Actores
| Actor | Descripcion | Interes |
|-------|-------------|---------|
| Operador de Importaciones | Usuario que administra embarques y subcarpetas | Mantener el flujo operativo y el saldo actualizado |

---

## 4. Objetivo del Caso de Uso
Registrar y actualizar embarques de importacion, incluyendo escenarios con una o varias OCs y descuentos automaticos de saldos.

---

## 5. Precondiciones
- El usuario debe estar autenticado.
- Debe existir al menos una OC abierta con saldo disponible.

---

## 6. Postcondiciones
- El embarque queda registrado o actualizado.
- La subcarpeta queda creada cuando corresponde.
- Los saldos quedan descontados por OC y articulo.

---

## 7. Flujo Principal
1. El Operador accede a la gestion de embarques.
2. Crea o actualiza un embarque.
3. Asocia una o mas OCs al embarque.
4. Indica si el embarque es parcial o completo.
5. El sistema genera la subcarpeta operativa cuando aplica.
6. El sistema descuenta los saldos por articulo y por OC.

---

## 8. Flujos Alternativos

### 8.1 Embarque completo
- **Condicion:** El embarque incluye todos los articulos de la OC asociada.
- **Pasos:**
  1. El Operador selecciona todos los articulos.
  2. El sistema registra el embarque completo.

### 8.2 Despacho multi-OC
- **Condicion:** Un mismo despacho incluye articulos de varias OCs.
- **Pasos:**
  1. El Operador asocia articulos de varias OCs.
  2. El sistema descuenta los saldos individualmente.

---

## 9. Flujos de Excepcion

### E1 - Saldo insuficiente
- **Condicion:** Se intenta embarcar una cantidad mayor al saldo disponible.
- **Pasos:**
  1. El sistema valida el saldo.
  2. El sistema bloquea la operacion.

---

## 10. Reglas de Negocio
- Una OC puede tener multiples subcarpetas.
- Un mismo despacho puede incluir articulos de varias OCs.
- No se puede embarcar por encima del saldo disponible.

---

## 11. Datos Utilizados

### Entradas
| Dato | Descripcion | Fuente |
|------|-------------|--------|
| OC | Orden de compra asociada | Operador |
| Subcarpeta | Identificador operativo del embarque | Sistema / Operador |
| Articulo | Item afectado por el embarque | Operador |
| Cantidad | Unidades a embarcar | Operador |

### Salidas
| Dato | Descripcion | Destino |
|------|-------------|---------|
| Embarque registrado | Registro operativo del movimiento | Sistema |
| Saldos actualizados | Saldo por OC y articulo | Sistema / usuarios |

---

## 12. Relaciones
- **Casos de uso relacionados:** CU-001, CU-003, CU-004
- **Requisitos relacionados:** RF-003, RF-004

---

## 13. Criterios de Aceptacion
- [ ] El sistema permite crear un embarque completo.
- [ ] El sistema permite crear un embarque parcial.
- [ ] El sistema permite asociar un mismo despacho a varias OCs.
- [ ] El sistema descuenta saldos por OC y por articulo.
- [ ] El sistema impide embarcar por encima del saldo disponible.

---

## 14. Notas y Consideraciones
- El analisis no define una nomenclatura obligatoria para la subcarpeta.
- No se precisa si la actualizacion del embarque puede revertirse.
- En el proceso actual, cada apertura o subcarpeta puede manejar su propia factura y documentacion de embarque.
