# Documentación del Proyecto Newton-Raphson Normal

## 1. Descripción general

Este proyecto consiste en una aplicación web desarrollada para resolver ejercicios utilizando el método numérico de **Newton-Raphson Normal**.

La idea principal de la aplicación es permitir que el usuario ingrese una función, su derivada, un valor inicial, una tolerancia y un número máximo de iteraciones. Con estos datos, el sistema realiza automáticamente los cálculos necesarios para encontrar una raíz aproximada de la función.

La aplicación muestra el procedimiento de forma clara mediante una tabla de iteraciones, el error obtenido, el resultado final y una gráfica donde se puede observar el comportamiento de la función. Esto permite comprender mejor cómo funciona el método, ya que no solo se muestra el resultado, sino también el proceso realizado paso a paso.

---

## 2. Objetivo general

Desarrollar una aplicación web que permita aplicar el método de **Newton-Raphson Normal** para encontrar raíces aproximadas de funciones no lineales de una forma rápida, ordenada y visual.

---

## 3. Objetivos específicos

- Permitir que el usuario ingrese los datos necesarios para aplicar el método Newton-Raphson.
- Realizar automáticamente las iteraciones del método.
- Mostrar una tabla con el procedimiento realizado en cada iteración.
- Calcular el error aproximado para saber cuándo se alcanza la tolerancia.
- Mostrar la raíz aproximada encontrada.
- Representar la función en una gráfica para facilitar su interpretación.
- Diseñar una interfaz sencilla y presentable para que el usuario pueda utilizar la aplicación fácilmente.

---

## 4. Método utilizado

El método utilizado en este proyecto es el **Newton-Raphson Normal**.

Este método sirve para encontrar raíces aproximadas de una función. Es decir, busca el valor de `x` donde la función se aproxima a cero.

La fórmula utilizada es:

```txt
xₙ₊₁ = xₙ - f(xₙ) / f'(xₙ)
```

Donde:

- `xₙ`: valor actual.
- `xₙ₊₁`: nuevo valor calculado.
- `f(xₙ)`: valor de la función evaluada en `xₙ`.
- `f'(xₙ)`: valor de la derivada evaluada en `xₙ`.

El método inicia con un valor inicial dado por el usuario. Luego, con ayuda de la fórmula, se van calculando nuevos valores hasta que el error sea menor que la tolerancia indicada.

---

## 5. Funcionamiento de la aplicación

La aplicación está dividida en tres partes principales:

- Inicio
- Resolver
- Información

---

## 6. Pantalla de inicio

En esta sección se presenta el proyecto de forma general. Aquí se explica que la aplicación sirve para automatizar el método de Newton-Raphson y encontrar raíces aproximadas de funciones no lineales.

También se muestra la fórmula principal del método para que el usuario tenga una idea clara de lo que se va a realizar.

---

## 7. Pantalla de resolver

Esta es la parte principal de la aplicación. En esta sección el usuario ingresa los datos necesarios para aplicar el método.

Los datos solicitados son:

- Función `f(x)`.
- Derivada `f'(x)`.
- Valor inicial `x₀`.
- Tolerancia `ε`.
- Máximo de iteraciones.

Después de ingresar los datos, el usuario presiona el botón **Calcular** y la aplicación realiza el procedimiento automáticamente.

Al finalizar, se muestra:

- La raíz aproximada.
- El número de iteraciones realizadas.
- El error final.
- El estado de convergencia.
- La tabla de iteraciones.
- La gráfica de la función.

Esto permite observar de manera clara cómo el método se va acercando poco a poco a la solución.

---

## 8. Pantalla de información

En esta sección se presenta información adicional sobre el proyecto, como el objetivo, el modelo matemático utilizado y la bibliografía sugerida.

Esta parte funciona como apoyo para explicar mejor el propósito de la aplicación y el método utilizado.

---

## 9. Explicación de los datos de entrada

### 9.1 Función `f(x)`

Es la función que se desea resolver. El objetivo es encontrar un valor de `x` donde la función sea aproximadamente igual a cero.

Ejemplo:

```txt
x^3 - x - 2
```

### 9.2 Derivada `f'(x)`

Es la derivada de la función ingresada. Esta parte es muy importante porque el método Newton-Raphson necesita la derivada para calcular la siguiente aproximación.

Ejemplo:

```txt
3*x^2 - 1
```

### 9.3 Valor inicial `x₀`

Es el valor con el que inicia el método. Este dato es importante porque, dependiendo del valor inicial, el método puede converger más rápido o puede no llegar a una solución.

Ejemplo:

```txt
1.5
```

### 9.4 Tolerancia `ε`

La tolerancia indica qué tan preciso se desea que sea el resultado. Mientras más pequeña sea la tolerancia, más exacto será el resultado.

En este proyecto se puede usar:

```txt
0.00001
```

Esto significa que el método se detendrá cuando el error sea menor que ese valor.

### 9.5 Máximo de iteraciones

Es el número máximo de veces que el método puede repetirse. Esto sirve como límite de seguridad para evitar que el proceso continúe indefinidamente si no se logra encontrar una solución.

En el proyecto se puede usar:

```txt
25
```

---

## 10. Ejemplo de prueba

Para probar el funcionamiento de la aplicación se puede utilizar el siguiente ejercicio:

```txt
Función: x^3 - x - 2
Derivada: 3*x^2 - 1
Valor inicial: 1.5
Tolerancia: 0.00001
Máximo de iteraciones: 25
```

Con estos datos, la aplicación realiza las iteraciones necesarias hasta encontrar una raíz aproximada.

---

## 11. Procedimiento realizado por la aplicación

Cuando el usuario presiona el botón **Calcular**, la aplicación realiza el siguiente proceso:

1. Toma la función ingresada por el usuario.
2. Evalúa la función en el valor inicial.
3. Evalúa la derivada en ese mismo valor.
4. Aplica la fórmula de Newton-Raphson.
5. Calcula una nueva aproximación.
6. Calcula el error entre el valor anterior y el nuevo valor.
7. Verifica si el error es menor que la tolerancia.
8. Si el error cumple con la tolerancia, el proceso termina.
9. Si no cumple, continúa con la siguiente iteración.

De esta manera, el sistema se acerca poco a poco a la raíz de la función.

---

## 12. Tabla de iteraciones

La tabla de iteraciones es una de las partes más importantes de la aplicación, porque permite observar el procedimiento completo.

La tabla contiene las siguientes columnas:

| Columna | Descripción |
|---|---|
| Iteración | Número de repetición del método. |
| `xᵢ` | Valor actual de la aproximación. |
| `f(xᵢ)` | Resultado de evaluar la función en `xᵢ`. |
| `f'(xᵢ)` | Resultado de evaluar la derivada en `xᵢ`. |
| `xᵢ₊₁` | Nuevo valor calculado. |
| Error | Diferencia aproximada entre el valor anterior y el nuevo valor. |

---

## 13. Gráfica de la función

La aplicación también muestra una gráfica de la función ingresada.

Esta gráfica permite visualizar el comportamiento de la función y ubicar de forma aproximada el punto donde se encuentra la raíz. Además, se marca la raíz aproximada encontrada por el método, lo cual ayuda a comprender mejor el resultado obtenido.

En la versión final, la gráfica también permite moverse y hacer acercamiento para observar mejor el comportamiento de la función.

---

## 14. Diseño de la aplicación

La aplicación fue diseñada con una interfaz tipo dashboard para que se vea ordenada y fácil de usar.

Se utilizaron colores en tonos vino, blanco y rosado claro para darle una apariencia formal y presentable.

La interfaz incluye:

- Menú lateral.
- Encabezado principal.
- Tarjeta de datos de entrada.
- Gráfica de la función.
- Panel de resultados.
- Fórmula del método.
- Tabla de iteraciones.
- Sección informativa.

El diseño busca que el usuario pueda entender fácilmente qué datos debe ingresar y cómo se obtiene el resultado.

---

## 15. Tecnologías utilizadas

### 15.1 HTML

Se utilizó para crear la estructura de la aplicación, como las secciones, formularios, botones, tablas y tarjetas.

### 15.2 CSS

Se utilizó para darle diseño a la aplicación, incluyendo colores, tamaños, distribución, sombras y estilo visual.

### 15.3 JavaScript

Se utilizó para programar la lógica del método Newton-Raphson, realizar los cálculos, llenar la tabla de iteraciones y mostrar los resultados.

### 15.4 Chart.js

Se utilizó para generar la gráfica de la función de una forma más visual y entendible.

---

## 16. Ventajas de la aplicación

- Permite resolver ejercicios de Newton-Raphson de forma más rápida.
- Ayuda a evitar errores que pueden ocurrir al hacer los cálculos manualmente.
- Muestra el procedimiento paso a paso.
- Presenta el resultado final de forma clara.
- Incluye una gráfica para visualizar mejor la función y la raíz aproximada.
- Facilita el aprendizaje del método numérico.

---

## 17. Limitaciones de la aplicación

Aunque la aplicación facilita el cálculo, existen algunas limitaciones importantes:

- El usuario debe ingresar correctamente la función y su derivada.
- Es necesario elegir un buen valor inicial.
- El método puede no converger si el punto inicial no es adecuado.
- La derivada no debe ser cero o estar muy cerca de cero.
- Para escribir multiplicaciones, se debe usar el símbolo `*`.

Ejemplo correcto:

```txt
3*x^2 - 1
```

Ejemplo incorrecto:

```txt
3x^2 - 1
```

---

## 18. Conclusión

El desarrollo de esta aplicación permitió aplicar de manera práctica el método numérico de Newton-Raphson Normal mediante una herramienta web sencilla, visual y funcional.

La aplicación no solo permite obtener una raíz aproximada de una función, sino que también muestra el proceso completo mediante una tabla de iteraciones y una gráfica. Esto ayuda a que el usuario comprenda mejor cómo se realizan los cálculos y cómo el método se acerca progresivamente a la solución.

Además, el proyecto permitió integrar conocimientos de HTML, CSS, JavaScript y Chart.js para construir una interfaz ordenada y fácil de utilizar. Aunque existen limitaciones relacionadas con la correcta escritura de la función, la derivada y la elección del valor inicial, la aplicación representa una herramienta útil para el aprendizaje y la práctica del método Newton-Raphson.

---

## 19. Bibliografía sugerida

- Chapra, S. C., & Canale, R. P. *Métodos numéricos para ingenieros*.
- Burden, R. L., & Faires, J. D. *Análisis numérico*.
- Documentación oficial de Chart.js.
- Material de clase sobre métodos numéricos.
