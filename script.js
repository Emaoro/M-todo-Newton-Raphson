let chartNewton = null;
let ultimoResultado = null;

function mostrarSeccion(id, boton) {
    const secciones = document.querySelectorAll(".section");
    const botones = document.querySelectorAll(".menu-btn");
    const seccionSeleccionada = document.getElementById(id);

    if (!seccionSeleccionada) {
        console.error("No existe la sección:", id);
        return;
    }

    secciones.forEach(sec => {
        sec.classList.remove("active-section");
    });

    botones.forEach(btn => {
        btn.classList.remove("active");
    });

    seccionSeleccionada.classList.add("active-section");

    if (boton) {
        boton.classList.add("active");
    }
}

function abrirSolver() {
    const secciones = document.querySelectorAll(".section");
    const botones = document.querySelectorAll(".menu-btn");
    const solver = document.getElementById("solver");

    if (!solver) {
        console.error("No existe la sección solver.");
        return;
    }

    secciones.forEach(sec => {
        sec.classList.remove("active-section");
    });

    botones.forEach(btn => {
        btn.classList.remove("active");
    });

    solver.classList.add("active-section");

    if (botones[1]) {
        botones[1].classList.add("active");
    }
}

function convertirSuperindices(expr) {
    const mapa = {
        "⁰": "0",
        "¹": "1",
        "²": "2",
        "³": "3",
        "⁴": "4",
        "⁵": "5",
        "⁶": "6",
        "⁷": "7",
        "⁸": "8",
        "⁹": "9"
    };

    return expr.replace(/([x\d\)])([⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g, function(_, base, sup) {
        let numero = "";

        for (let c of sup) {
            numero += mapa[c];
        }

        return base + "^" + numero;
    });
}

function prepararExpresion(expr) {
    let e = expr.toLowerCase();

    e = e.replace(/\s+/g, "");
    e = e.replace(/,/g, ".");
    e = e.replace(/[−–—]/g, "-");
    e = convertirSuperindices(e);
    e = e.replace(/π/g, "pi");

    e = e.replace(/(\d)(x)/g, "$1*$2");
    e = e.replace(/(\d)(\()/g, "$1*$2");
    e = e.replace(/(x)(\d)/g, "$1*$2");
    e = e.replace(/(x)(\()/g, "$1*$2");
    e = e.replace(/(\))(\()/g, "$1*$2");
    e = e.replace(/(\))(x)/g, "$1*$2");
    e = e.replace(/(\))(\d)/g, "$1*$2");

    e = e.replace(/(\d)(sin|cos|tan|sqrt|log|ln|exp|abs)/g, "$1*$2");
    e = e.replace(/(x)(sin|cos|tan|sqrt|log|ln|exp|abs)/g, "$1*$2");
    e = e.replace(/(\))(sin|cos|tan|sqrt|log|ln|exp|abs)/g, "$1*$2");

    e = e.replace(/(\d)(pi)/g, "$1*$2");
    e = e.replace(/(x)(pi)/g, "$1*$2");
    e = e.replace(/(\))(pi)/g, "$1*$2");

    e = e.replaceAll("^", "**");

    e = e.replace(/\bsin\(/g, "Math.sin(");
    e = e.replace(/\bcos\(/g, "Math.cos(");
    e = e.replace(/\btan\(/g, "Math.tan(");
    e = e.replace(/\bsqrt\(/g, "Math.sqrt(");
    e = e.replace(/\blog\(/g, "Math.log(");
    e = e.replace(/\bln\(/g, "Math.log(");
    e = e.replace(/\bexp\(/g, "Math.exp(");
    e = e.replace(/\babs\(/g, "Math.abs(");

    e = e.replace(/\bpi\b/g, "Math.PI");
    e = e.replace(/(^|[+\-*/(])e(?=$|[+\-*/^)])/g, "$1Math.E");

    return e;
}

function evaluarFuncion(expr, x) {
    const expresion = prepararExpresion(expr);
    return Function("x", `"use strict"; return (${expresion})`)(x);
}

function limpiarResultadosVisuales() {
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

    ultimoResultado = null;

    if (chartNewton) {
        chartNewton.destroy();
        chartNewton = null;
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
        limpiarResultadosVisuales();
        alert("Completa todos los datos correctamente.");
        return;
    }

    if (tolerancia <= 0 || maxIteraciones <= 0) {
        limpiarResultadosVisuales();
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
        let fx;
        let dfx;

        try {
            fx = evaluarFuncion(funcion, xi);
            dfx = evaluarFuncion(derivada, xi);
        } catch (e) {
            limpiarResultadosVisuales();
            alert(
                "La función o la derivada tienen un formato no válido.\n\n" +
                "Puedes escribir ejemplos como:\n" +
                "2x - 2\n" +
                "x^2 - 4\n" +
                "2x^5 - 3x^2 + 2x\n" +
                "10x^4 - 6x + 2"
            );
            return;
        }

        if (!isFinite(fx) || !isFinite(dfx)) {
            limpiarResultadosVisuales();
            alert("La función ingresada produce valores no válidos.");
            return;
        }

        if (Math.abs(dfx) < 1e-12) {
            limpiarResultadosVisuales();
            alert("La derivada es cero o muy cercana a cero. No se puede continuar.");
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

function obtenerRangoGrafica(raiz) {
    let centro = isFinite(raiz) ? raiz : 0;

    return {
        minX: centro - 4,
        maxX: centro + 4
    };
}

function dibujarGrafica(funcion, raiz) {
    const ctx = document.getElementById("graficaNewton").getContext("2d");

    let datosFuncion = [];
    let puntoRaiz = [{ x: raiz, y: 0 }];

    const rango = obtenerRangoGrafica(raiz);

    for (let i = rango.minX * 100; i <= rango.maxX * 100; i++) {
        const x = i / 100;

        try {
            const y = evaluarFuncion(funcion, x);

            if (isFinite(y) && Math.abs(y) <= 1000) {
                datosFuncion.push({ x, y });
            }
        } catch (error) {
            // Ignorar puntos inválidos
        }
    }

    let valoresY = datosFuncion.map(p => p.y);
    let minY = Math.min(...valoresY, -5);
    let maxY = Math.max(...valoresY, 5);

    if (!isFinite(minY) || !isFinite(maxY)) {
        minY = -5;
        maxY = 5;
    }

    let margenY = (maxY - minY) * 0.15;

    if (margenY === 0) {
        margenY = 2;
    }

    minY -= margenY;
    maxY += margenY;

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
                    min: rango.minX,
                    max: rango.maxX,
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
                        color: "#3a1a26"
                    }
                },
                y: {
                    min: minY,
                    max: maxY,
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
                        color: "#3a1a26"
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

    limpiarResultadosVisuales();

    document.getElementById("funcionLabel").innerText = "f(x) =";
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
    mostrarSeccion("inicio", document.querySelector(".menu-btn"));
};
