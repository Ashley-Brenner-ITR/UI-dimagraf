---
name: transformar-caso-uso
description: Este Skill se utiliza para transformar un archivo de análisis de caso de uso al formato estandarizado del proyecto. Debe utilizarse cuando se solicite transformar o estandarizar un Caso de Uso.
user-invocable: true
argument-hint: adjunte el archivo de análisis de Caso de Uso a transformar.
---

# 🔄 Transformador de Caso de Uso

## Objetivo

Este skill transforma un archivo de análisis de caso de uso en formato Markdown al formato estandarizado definido en el skill `template-caso-uso`.

---

## 📥 Entrada

- **Carpeta origen:** `docs/Caso-Uso-Analisis/`
- **Formato:** Archivo `.md` con análisis de caso de uso en formato libre o parcialmente estructurado.

---

## 📤 Salida

- **Carpeta destino:** `docs/Caso-Uso-Transformados/`
- **Formato:** Archivo `.md` siguiendo estrictamente el template estandarizado con encoding UTF-8 With BOM.

---

## 📋 Instrucciones para la IA

### 1. Lectura y Análisis

1. Lee el archivo de análisis ubicado en `docs/Caso-Uso-Analisis/`
2. Lee el skill `template-caso-uso` para obtener el template de referencia
3. Identifica y extrae la información relevante del archivo de análisis para cada sección del template

### 2. Mapeo de Información

Mapea la información extraída a las siguientes secciones del template:

| Sección Template | Información a Extraer |
|------------------|----------------------|
| **1. Identificación** | ID, nombre, actores, tipo, nivel, prioridad, versión, autor, fecha |
| **2. Descripción** | Resumen del objetivo y valor del caso de uso |
| **3. Actores** | Lista de actores con descripción e interés |
| **4. Objetivo del Caso de Uso** | Meta principal a lograr |
| **5. Precondiciones** | Condiciones previas necesarias |
| **6. Postcondiciones** | Estado del sistema después de ejecutar el caso de uso |
| **7. Flujo Principal** | Secuencia de pasos del escenario exitoso |
| **8. Flujos Alternativos** | Caminos alternativos al flujo principal |
| **9. Flujos de Excepción** | Manejo de errores y condiciones excepcionales |
| **10. Reglas de Negocio** | Reglas que aplican al caso de uso |
| **11. Datos Utilizados** | Entradas y salidas del caso de uso |
| **12. Relaciones** | Casos de uso y requisitos relacionados |
| **13. Criterios de Aceptación** | Criterios para validar el caso de uso |
| **14. Notas y Consideraciones** | Información adicional relevante |

### 3. Reglas de Transformación

#### Generación de ID
- Si el archivo no tiene ID, genera uno con formato `CU-XXX` donde XXX es un número secuencial
- Mantén el ID existente si ya está definido

#### Completitud de Información
- **Si falta información en el análisis original:**
  - Marca la sección con `*[Por definir]*` o `*[No especificado en el análisis]*`
  - NO inventes información que no esté en el documento fuente

#### Formato y Estilo
- Respeta exactamente la estructura del template
- Usa las tablas Markdown tal como están definidas
- Mantén los separadores `---` entre secciones
- Conserva los checkboxes `- [ ]` para criterios de aceptación

#### Flujos
- Numera los pasos secuencialmente
- Identifica claramente condiciones y disparadores en flujos alternativos y de excepción

### 4. Proceso de Transformación

1. Leer archivo origen de `docs/Caso-Uso-Analisis/[nombre-archivo].md`
2. Analizar contenido e identificar información para cada sección
3. Aplicar mapeo según tabla de correspondencias
4. Generar archivo transformado respetando template
5. Guardar en `docs/Caso-Uso-Transformados/[nombre-archivo].md`
6. Reportar secciones que quedaron incompletas o sin información
7. **NO tomar en cuenta definiciones técnicas del archivo origen:**
   - No tomar en cuenta Endpoints definidos
   - No tomar en cuenta Tablas de la base de datos definidas
   - No tomar en cuenta JSON técnicos definidos
8. **Detección de incoherencias:** Si se detectan incoherencias que pueden generar dudas, generar un archivo de salida con todas las dudas e incoherencias detectadas. Nombre: `[nombre-archivo-salida]-DUDAS.md`

### 5. Validaciones Post-Transformación

- [ ] Todas las secciones del template están presentes (1-14)
- [ ] Los separadores `---` están correctamente ubicados
- [ ] Las tablas tienen el formato correcto
- [ ] Los flujos están numerados secuencialmente
- [ ] No hay información inventada (solo lo que está en el análisis)

---

## 🚀 Ejemplo de Uso

### Comando
```
Transforma el archivo [nombre-archivo].md de la carpeta docs/Caso-Uso-Analisis/ 
al formato estandarizado y guárdalo en docs/Caso-Uso-Transformados/
```

### Ejemplo de Invocación
```
Transforma el archivo CU-Login-Usuario.md ubicado en docs/Caso-Uso-Analisis/ 
siguiendo el template de casos de uso.
```

---

## 📝 Notas Importantes

1. **Preservación de Contenido:** El contenido original no debe perderse. Si hay información que no encaja en ninguna sección, inclúyela en "14. Notas y Consideraciones".

2. **Trazabilidad:** El nombre del archivo transformado debe mantener relación con el archivo original para facilitar la trazabilidad.

3. **Iteración:** Si el análisis original es muy incompleto, sugiere al usuario qué información adicional sería necesaria para completar el caso de uso.

---

## 🔗 Referencias

- Skill relacionado: `template-caso-uso`
- Casos de Uso de Análisis: `docs/Caso-Uso-Analisis/`
- Casos de Uso Transformados: `docs/Caso-Uso-Transformados/`
