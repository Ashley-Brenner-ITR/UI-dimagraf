# UR-001 - Gestionar orden de compra

Estado: PRE-REFINADO

## 1. Intención
Lograr que una orden de compra sea ingresada y puesta en contexto para iniciar el proceso de importación.

## 2. Problema detectado
El proceso requiere una referencia formal de compra para dar inicio a la gestión operativa y documental.

## 3. Actores
- Operador de importaciones
- Usuario del proceso de compras o importación
- Sistema de soporte de documentación

## 4. Contexto
Se activa cuando se inicia una carpeta o flujo de importación asociada a un pedido o orden de compra.

## 5. Disparador
La recepción o carga de una orden de compra que debe pasar a revisión operativa.

## 6. Resultado esperado
La orden queda registrada y disponible como base para la ejecución del proceso.

## 7. Flujo estimado (alto nivel)
1. Se recibe la orden de compra.
2. Se valida que se pueda vincular al proceso.
3. Se registra la referencia y se deja disponible para la siguiente etapa.

## 8. Reglas detectadas
- Debe existir una orden de compra válida para iniciar el proceso.
- La referencia debe quedar asociada a la carpeta de importación.

## 9. Excepciones posibles
- Orden incompleta.
- Orden no identificada.
- Orden duplicada.

## 10. Datos involucrados
- Número de orden
- Proveedor
- Artículos
- Fecha de creación

## 11. Dependencias
Depende de la disponibilidad de la información de la orden y de la carpeta de importación.

## 12. Ambigüedades / dudas
No queda completamente claro si la carpeta puede iniciarse con información mínima o si es obligatorio completar todos los datos desde el inicio.

## 13. Origen
Documento de análisis y casos de uso relacionados a la gestión de orden de compra.

## Elementos descartados
- Detalles técnicos de integración
- Reglas de infraestructura
- Requisitos no funcionales

## Criterio de calidad
La unidad permite avanzar a refinamiento sin perder el foco en la intención funcional del proceso.
