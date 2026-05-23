let chartNewton = null;
let ultimoResultado = null;

function mostrarSeccion(id, boton) {
    document.querySelectorAll(".section").forEach(sec => {
        sec.classList.remove("active-section");
    });

    document.querySelectorAll(".menu-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    document.getElementById(id).classList.add("active-section");
    boton.classList.add("active");

    if (id === "solver") {
        calcularNewton();
    }
}

function abrirSolver() {
    document.querySelectorAll(".section").forEach(sec => {
        sec.classList.remove("active-section");
    });

    document.querySelectorAll(".menu-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    document.getElementById("solver").classList.add("active-section");
    document.querySelectorAll(".menu-btn")[1].classList.add("active");

    calcularNewton();
}

function prepararExpresion(expr) {
    let e = expr.replace(/\s+/g, "");

    // Reemplazar constantes primero (antes de renombrar funciones)
    e = e.replace(/\bpi\b/g, "Math.PI");
    // Reemplazar 'e' solo cuando está sola (no dentro de palabras como "exp", "sec", etc.)
    e = e.replace(/(?<![a-zA-Z])e(?![a-zA-Z])/g, "Math.E");

    // Reemplazar funciones matemáticas (orden importa: más largas primero)
    e = e.replace(/\basin\b/g, "Math.asin");
    e = e.replace(/\bacos\b/g, "Math.acos");
    e = e.replace(/\batan\b/g, "Math.atan");
    e = e.replace(/\bsinh\b/g, "Math.sinh");
    e = e.replace(/\bcosh\b/g, "Math.cosh");
    e = e.replace(/\btanh\b/g, "Math.tanh");
    e = e.replace(/\bsin\b/g, "Math.sin");
    e = e.replace(/\bcos\b/g, "Math.cos");
    e = e.replace(/\btan\b/g, "Math.tan");
    e = e.replace(/\bsqrt\b/g, "Math.sqrt");
    e = e.replace(/\babs\b/g, "Math.abs");
    e = e.replace(/\bexp\b/g, "Math.exp");
    e = e.replace(/\blog10\b/g, "Math.log10");
    e = e.replace(/\blog2\b/g, "Math.log2");
    e = e.replace(/\blog\b/g, "Math.log");   // ln natural
    e = e.replace(/\bln\b/g, "Math.log");
    e = e.replace(/\bcbrt\b/g, "Math.cbrt");
    e = e.replace(/\bsign\b/g, "Math.sign");
    e = e.replace(/\bfloor\b/g, "Math.floor");
    e = e.replace(/\bceil\b/g, "Math.ceil");
    e = e.replace(/\bround\b/g, "Math.round");

    // Multiplicación implícita: número seguido de x  →  número*x
    // Ej: 2x → 2*x,  3.5x → 3.5*x
    e = e.replace(/(\d+\.?\d*)(x)/g, "$1*$2");

    // Multiplicación implícita: número seguido de (  →  número*(
    // Ej: 2(x+1) → 2*(x+1)
    e = e.replace(/(\d+\.?\d*)(\()/g, "$1*$2");

    // Multiplicación implícita: ) seguido de x  →  )*x
    // Ej: (x+1)x → (x+1)*x
    e = e.replace(/(\))(x)/g, "$1*$2");

    // Multiplicación implícita: x seguido de (  →  x*(
    // Ej: x(x+1) → x*(x+1)
    e = e.replace(/(x)(\()/g, "$1*$2");

    // Convertir potencias: ^ → **
    e = e.replace(/\^/g, "**");

    return e;
}

function evaluarFuncion(expr, x) {
    const expresion = prepararExpresion(expr);
    try {
        return Function("x", `return ${expresion}`)(x);
    } catch (err) {
        throw new Error(`Error al evaluar la expresión: "${expr}"\nExpresión procesada: "${expresion}"\n${err.message}`);
    }
}

function calcularNewton() {
    const funcion = document.getElementById("funcion").value.trim();
    const derivada = document.getElementById("derivada").value.trim();

    let x = parseFloat(document.getElementById("x0").value);
    const tolerancia = parseFloat(document.getElementById("tolerancia").value);
    const maxIteraciones = parseInt(document.getElementById("iteraciones").value);

    const tabla = document.getElementById("tablaNewton");
    const pasos = document.getElementById("pasosNewton");

    tabla.innerHTML = "";
    pasos.innerHTML = "";

    if (!funcion || !derivada || isNaN(x) || isNaN(tolerancia) || isNaN(maxIteraciones)) {
        alert("Completa todos los datos correctamente.");
        return;
    }

    if (tolerancia <= 0 || maxIteraciones <= 0) {
        alert("La tolerancia y el número máximo de iteraciones deben ser mayores que cero.");
        return;
    }

    let error = 0;
    let siguienteX = x;
    let convergencia = false;
    let iteracionFinal = 0;
    let datosIteraciones = [];

    for (let i = 0; i < maxIteraciones; i++) {
        let xi = x;
        let fx, dfx;

        try {
            fx = evaluarFuncion(funcion, xi);
            dfx = evaluarFuncion(derivada, xi);
        } catch (e) {
            alert("La función o la derivada tienen un formato no válido.\n\n" + e.message);
            return;
        }

        if (!isFinite(fx) || !isFinite(dfx)) {
            alert("La función ingresada produce valores no válidos (infinito o NaN) en x = " + xi.toFixed(6));
            return;
        }

        if (Math.abs(dfx) < 1e-12) {
            alert("La derivada es cero o muy cercana a cero en x = " + xi.toFixed(6) + ". No se puede continuar.");
            return;
        }

        siguienteX = xi - (fx / dfx);
        error = Math.abs(siguienteX - xi);

        datosIteraciones.push({
            i,
            xi,
            fx,
            dfx,
            siguienteX,
            error
        });

        tabla.innerHTML += `
            <tr>
                <td>${i}</td>
                <td>${xi.toFixed(6)}</td>
                <td>${fx.toFixed(6)}</td>
                <td>${dfx.toFixed(6)}</td>
                <td class="green">${siguienteX.toFixed(6)}</td>
                <td>${error.toFixed(6)}</td>
            </tr>
        `;

        pasos.innerHTML += `
            <div class="step-box">
                <h4>Iteración ${i}</h4>

                <ul class="step-list">
                    <li>x<sub>${i}</sub> = ${xi.toFixed(6)}</li>
                    <li>f(x<sub>${i}</sub>) = ${fx.toFixed(6)}</li>
                    <li>f'(x<sub>${i}</sub>) = ${dfx.toFixed(6)}</li>
                </ul>

                <div class="step-formula">
                    x<sub>${i + 1}</sub> = x<sub>${i}</sub> - [ f(x<sub>${i}</sub>) / f'(x<sub>${i}</sub>) ]
                </div>

                <div class="step-formula">
                    x<sub>${i + 1}</sub> = ${xi.toFixed(6)} - [ ${fx.toFixed(6)} / ${dfx.toFixed(6)} ]
                </div>

                <div class="step-result">
                    x<sub>${i + 1}</sub> = ${siguienteX.toFixed(6)}
                    <br>
                    Error = ${error.toFixed(6)}
                </div>
            </div>
        `;

        iteracionFinal = i + 1;

        if (error < tolerancia) {
            convergencia = true;
            break;
        }

        x = siguienteX;
    }

    document.getElementById("resultadoRaiz").innerText = "x ≈ " + siguienteX.toFixed(6);
    document.getElementById("resIter").innerText = iteracionFinal;
    document.getElementById("resTol").innerText = tolerancia;
    document.getElementById("resError").innerText = error.toFixed(6);

    document.getElementById("mensajeRaiz").innerText =
        "● La raíz está cerca de x ≈ " + siguienteX.toFixed(6);

    document.getElementById("mensajeTablaNewton").innerText =
        convergencia
            ? "★ Convergencia alcanzada en la iteración " + (iteracionFinal - 1) + "."
            : "⚠ No se alcanzó la tolerancia en el máximo de iteraciones.";

    document.getElementById("estadoNewton").innerText =
        convergencia ? "✔ Convergencia alcanzada" : "⚠ Sin convergencia";

    document.getElementById("funcionLabel").innerText = "f(x) = " + funcion;

    dibujarGrafica(funcion, siguienteX);

    ultimoResultado = {
        funcion,
        derivada,
        x0: parseFloat(document.getElementById("x0").value),
        tolerancia,
        maxIteraciones,
        raiz: siguienteX,
        errorFinal: error,
        iteracionesRealizadas: iteracionFinal,
        convergencia,
        datosIteraciones
    };
}

function dibujarGrafica(funcion, raiz) {
    const ctx = document.getElementById("graficaNewton").getContext("2d");

    let datosFuncion = [];
    let puntoRaiz = [{ x: raiz, y: 0 }];

    for (let i = -600; i <= 600; i++) {
        const x = i / 100;

        try {
            const y = evaluarFuncion(funcion, x);

            if (isFinite(y) && Math.abs(y) <= 20) {
                datosFuncion.push({ x, y });
            }
        } catch (error) {
            // Ignora puntos inválidos
        }
    }

    if (chartNewton) {
        chartNewton.destroy();
    }

    chartNewton = new Chart(ctx, {
        type: "scatter",
        data: {
            datasets: [
                {
                    label: "f(x)",
                    data: datosFuncion,
                    showLine: true,
                    borderColor: "#a00038",
                    backgroundColor: "transparent",
                    borderWidth: 3,
                    pointRadius: 0,
                    tension: 0.25
                },
                {
                    label: "Raíz aproximada",
                    data: puntoRaiz,
                    backgroundColor: "#a00038",
                    borderColor: "#a00038",
                    pointRadius: 8,
                    pointHoverRadius: 10,
                    showLine: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    position: "top",
                    labels: {
                        color: "#3a1a26",
                        font: {
                            weight: "bold"
                        },
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `x: ${context.parsed.x.toFixed(4)}, y: ${context.parsed.y.toFixed(4)}`;
                        }
                    }
                },
                zoom: {
                    pan: {
                        enabled: true,
                        mode: "xy"
                    },
                    zoom: {
                        wheel: {
                            enabled: true
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: "xy"
                    }
                }
            },

            scales: {
                x: {
                    type: "linear",
                    min: -3,
                    max: 3,
                    title: {
                        display: true,
                        text: "x",
                        color: "#3a1a26",
                        font: {
                            weight: "bold"
                        }
                    },
                    grid: {
                        color: function(context) {
                            return context.tick.value === 0 ? "#3a1a26" : "#ead9df";
                        },
                        lineWidth: function(context) {
                            return context.tick.value === 0 ? 2 : 1;
                        }
                    },
                    ticks: {
                        color: "#3a1a26",
                        stepSize: 1
                    }
                },
                y: {
                    min: -2,
                    max: 2,
                    title: {
                        display: true,
                        text: "f(x)",
                        color: "#3a1a26",
                        font: {
                            weight: "bold"
                        }
                    },
                    grid: {
                        color: function(context) {
                            return context.tick.value === 0 ? "#3a1a26" : "#ead9df";
                        },
                        lineWidth: function(context) {
                            return context.tick.value === 0 ? 2 : 1;
                        }
                    },
                    ticks: {
                        color: "#3a1a26",
                        stepSize: 0.5
                    }
                }
            }
        }
    });
}

function resetearGrafica() {
    if (chartNewton) {
        chartNewton.resetZoom();
    }
}

function limpiarNewton() {
    document.getElementById("funcion").value = "";
    document.getElementById("derivada").value = "";
    document.getElementById("x0").value = "";
    document.getElementById("tolerancia").value = "";
    document.getElementById("iteraciones").value = "";

    document.getElementById("tablaNewton").innerHTML = "";
    document.getElementById("pasosNewton").innerHTML = `
        <div class="step-empty">
            Presiona <b>Calcular</b> para ver el desarrollo paso a paso.
        </div>
    `;

    document.getElementById("resultadoRaiz").innerText = "x ≈ 0.000000";
    document.getElementById("resIter").innerText = "0";
    document.getElementById("resTol").innerText = "0";
    document.getElementById("resError").innerText = "0.000000";
    document.getElementById("estadoNewton").innerText = "Esperando cálculo";
    document.getElementById("mensajeRaiz").innerText = "● Presiona calcular para mostrar la raíz aproximada.";
    document.getElementById("mensajeTablaNewton").innerText = "★ Esperando cálculo.";
    document.getElementById("funcionLabel").innerText = "f(x) =";

    ultimoResultado = null;

    if (chartNewton) {
        chartNewton.destroy();
        chartNewton = null;
    }
}

function exportarNewton() {
    if (!ultimoResultado) {
        alert("Primero realiza un cálculo para poder exportar.");
        return;
    }

    let contenido = "";
    contenido += "NEWTON-RAPHSON SOLVER\n";
    contenido += "======================\n\n";
    contenido += `Función: ${ultimoResultado.funcion}\n`;
    contenido += `Derivada: ${ultimoResultado.derivada}\n`;
    contenido += `Valor inicial x0: ${ultimoResultado.x0}\n`;
    contenido += `Tolerancia: ${ultimoResultado.tolerancia}\n`;
    contenido += `Máximo de iteraciones: ${ultimoResultado.maxIteraciones}\n\n`;

    contenido += "RESULTADO FINAL\n";
    contenido += "---------------\n";
    contenido += `Raíz aproximada: ${ultimoResultado.raiz.toFixed(6)}\n`;
    contenido += `Error final: ${ultimoResultado.errorFinal.toFixed(6)}\n`;
    contenido += `Iteraciones realizadas: ${ultimoResultado.iteracionesRealizadas}\n`;
    contenido += `Estado: ${ultimoResultado.convergencia ? "Convergencia alcanzada" : "Sin convergencia"}\n\n`;

    contenido += "TABLA DE ITERACIONES\n";
    contenido += "--------------------\n";
    contenido += "Iter\t xi\t\t f(xi)\t\t f'(xi)\t\t xi+1\t\t Error\n";

    ultimoResultado.datosIteraciones.forEach(item => {
        contenido += `${item.i}\t ${item.xi.toFixed(6)}\t ${item.fx.toFixed(6)}\t ${item.dfx.toFixed(6)}\t ${item.siguienteX.toFixed(6)}\t ${item.error.toFixed(6)}\n`;
    });

    const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = "resultado_newton_raphson.txt";
    enlace.click();

    URL.revokeObjectURL(url);
}

window.onload = function () {
    // Inicia en la pantalla de Inicio.
};
