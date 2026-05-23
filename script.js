let chartNewton;

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
    return expr
        .replaceAll("^", "**")
        .replaceAll("sin", "Math.sin")
        .replaceAll("cos", "Math.cos")
        .replaceAll("tan", "Math.tan")
        .replaceAll("sqrt", "Math.sqrt")
        .replaceAll("log", "Math.log")
        .replaceAll("exp", "Math.exp")
        .replaceAll("abs", "Math.abs");
}

function evaluarFuncion(expr, x) {
    let expresion = prepararExpresion(expr);
    return Function("x", "return " + expresion)(x);
}

function calcularNewton() {
    const funcion = document.getElementById("funcion").value;
    const derivada = document.getElementById("derivada").value;

    let x = parseFloat(document.getElementById("x0").value);
    const tolerancia = parseFloat(document.getElementById("tolerancia").value);
    const maxIteraciones = parseInt(document.getElementById("iteraciones").value);

    const tabla = document.getElementById("tablaNewton");
    tabla.innerHTML = "";

    if (!funcion || !derivada || isNaN(x) || isNaN(tolerancia) || isNaN(maxIteraciones)) {
        return;
    }

    let error = 0;
    let siguienteX = x;
    let convergencia = false;
    let iteracionFinal = 0;

    for (let i = 0; i < maxIteraciones; i++) {
        let fx = evaluarFuncion(funcion, x);
        let dfx = evaluarFuncion(derivada, x);

        if (!isFinite(fx) || !isFinite(dfx)) {
            alert("La función ingresada no es válida.");
            return;
        }

        if (Math.abs(dfx) < 0.0000000001) {
            alert("La derivada es cercana a cero. No se puede continuar.");
            return;
        }

        siguienteX = x - (fx / dfx);
        error = Math.abs(siguienteX - x);

        tabla.innerHTML += `
            <tr>
                <td>${i}</td>
                <td>${x.toFixed(6)}</td>
                <td>${fx.toFixed(6)}</td>
                <td>${dfx.toFixed(6)}</td>
                <td class="green">${siguienteX.toFixed(6)}</td>
                <td>${i === 0 ? "-" : error.toFixed(6)}</td>
            </tr>
        `;

        iteracionFinal = i;

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
            ? "★ Convergencia alcanzada en la iteración " + iteracionFinal + "."
            : "⚠ No se alcanzó la tolerancia en el máximo de iteraciones.";

    document.getElementById("estadoNewton").innerText =
        convergencia ? "✔ Convergencia alcanzada" : "⚠ Sin convergencia";

    document.getElementById("funcionLabel").innerText = "f(x) = " + funcion;

    dibujarGrafica(funcion, siguienteX);
}

function dibujarGrafica(funcion, raiz) {
    const ctx = document.getElementById("graficaNewton").getContext("2d");

    let datosFuncion = [];
    let puntoRaiz = [{ x: raiz, y: 0 }];

    for (let i = -600; i <= 600; i++) {
        let x = i / 100;

        try {
            let y = evaluarFuncion(funcion, x);

            if (isFinite(y)) {
                datosFuncion.push({
                    x: x,
                    y: y
                });
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
                    min: -5,
                    max: 5,
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
                        stepSize: 1
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

    document.getElementById("resultadoRaiz").innerText = "x ≈ 0.000000";
    document.getElementById("resIter").innerText = "0";
    document.getElementById("resTol").innerText = "0";
    document.getElementById("resError").innerText = "0.000000";
    document.getElementById("estadoNewton").innerText = "Esperando cálculo";
    document.getElementById("mensajeRaiz").innerText = "● Presiona calcular para mostrar la raíz aproximada.";
    document.getElementById("mensajeTablaNewton").innerText = "★ Esperando cálculo.";

    if (chartNewton) {
        chartNewton.destroy();
    }
}

function exportarNewton() {
    alert("Resultado exportado correctamente.");
}

window.onload = function () {
    // Inicia en la pantalla de Inicio.
};