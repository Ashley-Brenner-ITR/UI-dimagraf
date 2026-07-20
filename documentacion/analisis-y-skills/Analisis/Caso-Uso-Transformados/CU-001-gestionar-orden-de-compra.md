# Caso de Uso: Gestionar Orden de Compra

## 1. Identificación
- **ID:** CU-001
- **Nombre:** Gestionar Orden de Compra
- **Actor(es) Principal(es):** Operador de Importaciones
- **Actor(es) Secundario(s):** Administrador del sistema
- **Tipo:** Primario
- **Nivel:** Usuario
- **Prioridad:** Alta
- **Versión:** v1.0
- **Autor:** *[Por definir]*
- **Fecha:** *[Por definir]*

---

## 2. Descripción
Permite registrar y administrar una Orden de Compra de importación, con desagregación por artículo, control de saldos y cierre automático cuando todos los artículos alcanzan saldo cero. La OC puede ingresar al sistema desde una carga inicial o desde documentación recibida por el circuito operativo.

---

## 3. Actores
| Actor | Descripción | Interés |
|-------|-------------|---------|
| Operador de Importaciones | Usuario que registra y mantiene la OC | Gestionar correctamente la compra y su trazabilidad |
| Comercial | Area que origina o solicita la OC en el circuito actual | Iniciar la compra y su seguimiento |
| Administrador del sistema | Usuario que configura parámetros relacionados | Mantener reglas y datos maestros coherentes |

---

## 4. Objetivo del Caso de Uso
Registrar una OC de importación de forma completa y trazable, asegurando el control de sus artículos y saldos.

---

## 5. Precondiciones
- El usuario debe estar autenticado.
- El usuario debe tener acceso a la administración de OCs.
- Debe existir un proveedor válido para asociar a la OC.

---

## 6. Postcondiciones
- La OC queda registrada.
- Los artículos quedan asociados a la OC.
- Los saldos quedan calculados.
- La OC puede quedar abierta o cerrada según su saldo.

---

## 7. Flujo Principal
1. El Operador de Importaciones accede a la gestión de OCs.
2. Registra una nueva OC con sus datos generales.
3. Asocia el proveedor y los datos comerciales necesarios.
4. Carga uno o más artículos con sus cantidades.
5. El sistema calcula el saldo por artículo.
6. El sistema identifica la OC con una carpeta interna unica.
7. El sistema guarda la OC en estado abierto.

---

## 8. Flujos Alternativos

### 8.1 OC con modificación sobre una OC abierta
- **Condición:** Existe una OC abierta sin restricciones operativas adicionales.
- **Pasos:**
  1. El Operador modifica datos permitidos.
  2. El sistema guarda los cambios.

### 8.2 Precarga de parámetros del proveedor
- **Condición:** El proveedor seleccionado tiene parámetros configurados.
- **Pasos:**
  1. El Operador selecciona el proveedor.
  2. El sistema precarga incoterm, condición de pago y despachante habitual.

---

## 9. Flujos de Excepción

### E1 – Carpeta duplicada
- **Condición:** Ya existe una OC con la misma carpeta interna.
- **Pasos:**
  1. El Operador intenta guardar la OC.
  2. El sistema rechaza el alta y muestra el error.

### E2 – Sobreconsumo de saldo
- **Condición:** El Operador intenta cargar o consumir más unidades que el saldo disponible.
- **Pasos:**
  1. El sistema valida el saldo.
  2. El sistema bloquea la operación.

---

## 10. Reglas de Negocio
- La carpeta interna debe ser unica.
- El saldo se controla por articulo y por OC.
- La OC se cierra automaticamente cuando todos los saldos llegan a cero.
- La carga y mantenimiento deben preservar la trazabilidad.

---

## 11. Datos Utilizados

### Entradas
| Dato | Descripción | Fuente |
|------|-------------|--------|
| Proveedor | Proveedor asociado a la OC | Operador / maestro |
| Incoterm | Condicion comercial | Operador / maestro |
| Condicion de pago | Condicion financiera | Operador / maestro |
| Articulos | Items de la OC | Operador |
| Cantidades | Unidades por articulo | Operador |

### Salidas
| Dato | Descripción | Destino |
|------|-------------|---------|
| Carpeta interna | Identificador unico de la OC | Sistema |
| Saldos por articulo | Saldo pendiente calculado | Sistema / usuarios |
| Estado de la OC | Estado operativo de la OC | Usuarios |

---

## 12. Relaciones
- **Casos de uso relacionados:** CU-002, CU-011
- **Requisitos relacionados:** RF-001, RF-002, RF-005, RF-014

---

## 13. Criterios de Aceptación
- [ ] Al registrar una OC, el sistema genera una carpeta interna unica.
- [ ] El sistema calcula el saldo por articulo.
- [ ] El sistema muestra la OC en estado abierta al finalizar el alta.
- [ ] Si la carpeta ya existe, el sistema impide guardar la OC.
- [ ] Si el proveedor tiene parametros configurados, el sistema los precarga.

---

## 14. Notas y Consideraciones
- La modificacion de una OC abierta no esta completamente delimitada por el ERS.
- La trazabilidad del cambio debe conservarse si se permite edición.
- En el proceso actual, la OC puede originarse fuera del sistema y luego ser controlada por Importaciones.
