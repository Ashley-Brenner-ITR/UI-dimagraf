---
name: template-caso-uso
description: Este Skill contiene el template estandarizado para documentar Casos de Uso. Es utilizado internamente por otros skills como transformar-caso-uso.
user-invocable: false
---

# 📄 Template de Caso de Uso

## Objetivo

Este skill contiene el template estandarizado que debe seguir cada caso de uso en formato Markdown. Es utilizado como referencia por otros skills del proyecto.

---

## 🏗️ Template Estandarizado

```markdown
# Caso de Uso: *[Nombre del Caso de Uso]*

## 1. Identificación
- **ID:** CU-XXX  
- **Nombre:** *[Nombre del Caso de Uso]*  
- **Actor(es) Principal(es):** *[Actor primario]*  
- **Actor(es) Secundario(s):** *[Actores que apoyan]*  
- **Tipo:** *[Primario / Secundario / Abstracto]*  
- **Nivel:** *[Usuario / Sistema / Subfunción]*  
- **Prioridad:** *[Alta / Media / Baja]*  
- **Versión:** *[v1.0]*  
- **Autor:** *[Nombre]*  
- **Fecha:** *[dd/mm/aaaa]*  

---

## 2. Descripción
*[Breve resumen del objetivo del caso de uso y el valor que aporta]*

---

## 3. Actores
| Actor | Descripción | Interés |
|-------|-------------|---------|
| *Actor 1* | *Descripción del rol* | *Qué busca lograr* |
| *Actor 2* | *Descripción del rol* | *Qué busca lograr* |

---

## 4. Objetivo del Caso de Uso
*[Qué se pretende lograr con este caso de uso]*

---

## 5. Precondiciones
- *Precondición 1*  
- *Precondición 2*  

---

## 6. Postcondiciones
- *Postcondición 1*  
- *Postcondición 2*  

---

## 7. Flujo Principal
1. *Paso 1*  
2. *Paso 2*  
3. *Paso 3*  
4. *…*

---

## 8. Flujos Alternativos

### 8.1 Alternativa A – *[Nombre]*
- **Condición:** *Qué dispara esta alternativa*  
- **Pasos:**  
  1. *Paso A1*  
  2. *Paso A2*

### 8.2 Alternativa B – *[Nombre]*
- **Condición:**  
- **Pasos:**  

---

## 9. Flujos de Excepción

### E1 – *[Nombre de la Excepción]*
- **Condición:** *Qué error o condición la provoca*  
- **Pasos:**  
  1. *Paso E1.1*  
  2. *Paso E1.2*

---

## 10. Reglas de Negocio
- **RN-01:** *Descripción*  
- **RN-02:** *Descripción*

---

## 11. Datos Utilizados

### Entradas
| Dato | Descripción | Fuente |
|------|-------------|--------|
| *Dato 1* | *Descripción* | *Actor/Sistema* |

### Salidas
| Dato | Descripción | Destino |
|------|-------------|----------|
| *Dato 1* | *Descripción* | *Actor/Sistema* |

---

## 12. Relaciones
- **Casos de uso relacionados:** *[CU-XX, CU-YY]*  
- **Requisitos relacionados:** *[REQ-XX, REQ-YY]*  

---

## 13. Criterios de Aceptación
- [ ] *Criterio 1*
- [ ] *Criterio 2*
- [ ] *Criterio 3*

---

## 14. Notas y Consideraciones
*[Información adicional relevante, restricciones técnicas, dependencias, etc.]*
```

---

## 📋 Descripción de Secciones

| Sección | Propósito |
|---------|-----------|
| **1. Identificación** | Metadatos del caso de uso (ID, nombre, actores, tipo, prioridad, versión) |
| **2. Descripción** | Resumen del objetivo y valor del caso de uso |
| **3. Actores** | Tabla con actores, descripción e interés |
| **4. Objetivo** | Meta principal a lograr |
| **5. Precondiciones** | Condiciones previas necesarias |
| **6. Postcondiciones** | Estado del sistema después de ejecutar |
| **7. Flujo Principal** | Secuencia de pasos del escenario exitoso |
| **8. Flujos Alternativos** | Caminos alternativos al flujo principal |
| **9. Flujos de Excepción** | Manejo de errores y condiciones excepcionales |
| **10. Reglas de Negocio** | Reglas que aplican al caso de uso |
| **11. Datos Utilizados** | Entradas y salidas del caso de uso |
| **12. Relaciones** | Casos de uso y requisitos relacionados |
| **13. Criterios de Aceptación** | Criterios para validar el caso de uso |
| **14. Notas y Consideraciones** | Información adicional relevante |

---

## 🔗 Referencias

Este template es utilizado por:
- `transformar-caso-uso` - Para transformar análisis al formato estandarizado
- `implementar-caso-uso-backend` - Como referencia para la implementación
- `implementar-caso-uso-frontend` - Como referencia para la implementación
