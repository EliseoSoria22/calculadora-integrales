let activeInputField = null;

// Detectar el campo de entrada activo
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('focus', function() {
        activeInputField = this;
    });
});

// Evento para calcular la integral
document.getElementById('calcular').addEventListener('click', function() {
    const funcion = document.getElementById('funcion').value.trim();
    const variable = document.getElementById('variable').value.trim();
    const limiteInferior = document.getElementById('limiteInferior').value.trim();
    const limiteSuperior = document.getElementById('limiteSuperior').value.trim();

    if (!funcion || !variable) {
        document.getElementById('resultado').innerText = 'Por favor ingresa una función y una variable.';
        return;
    }

    fetch('/calcular', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            funcion: funcion,
            variable: variable,
            limiteInferior: limiteInferior,
            limiteSuperior: limiteSuperior
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('resultado').innerHTML = `\\(${data.resultado}\\)`;
        MathJax.typesetPromise(['#resultado']); // Renderizar LaTeX
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('resultado').innerText = 'Ocurrió un error al calcular la integral.';
    });
});

// Funciones para autocompletar
document.getElementById('sqrtButton').addEventListener('click', function() {
    insertAtCursor('sqrt()');
});

document.getElementById('piButton').addEventListener('click', function() {
    insertAtCursor('pi');
});

document.getElementById('infinityButton').addEventListener('click', function() {
    insertAtCursor('oo');
});

document.getElementById('minusInfinityButton').addEventListener('click', function() {
    insertAtCursor('-oo');
});

document.getElementById('cosButton').addEventListener('click', function() {
    insertAtCursor('cos()');
});

document.getElementById('sinButton').addEventListener('click', function() {
    insertAtCursor('sin()');
});

document.getElementById('arctanButton').addEventListener('click', function() {
    insertAtCursor('atan()');
});

document.getElementById('expButton').addEventListener('click', function() {
    insertAtCursor('exp()');
});

document.getElementById('openParenButton').addEventListener('click', function() {
    insertAtCursor('(');
});

document.getElementById('closeParenButton').addEventListener('click', function() {
    insertAtCursor(')');
});

document.getElementById('multiplyButton').addEventListener('click', function() {
    insertAtCursor('*');
});

document.getElementById('divideButton').addEventListener('click', function() {
    insertAtCursor('/');
});

document.getElementById('clearButton').addEventListener('click', function() {
    clearFields();
});

document.getElementById('logButton').addEventListener('click', function() {
    insertAtCursor('log()');
});

document.getElementById('log10Button').addEventListener('click', function() {
    insertAtCursor('log(x, 10)');
});

document.getElementById('absButton').addEventListener('click', function() {
    insertAtCursor('abs()');
});

document.getElementById('powerButton').addEventListener('click', function() {
    insertAtCursor('^');
});

document.getElementById('arcsinButton').addEventListener('click', function() {
    insertAtCursor('asin()');
});

document.getElementById('arccosButton').addEventListener('click', function() {
    insertAtCursor('acos()');
});

document.getElementById('cotButton').addEventListener('click', function() {
    insertAtCursor('cot()');
});

document.getElementById('secButton').addEventListener('click', function() {
    insertAtCursor('sec()');
});

document.getElementById('cscButton').addEventListener('click', function() {
    insertAtCursor('csc()');
});

document.getElementById('tanButton').addEventListener('click', function(){
    insertAtCursor('tan()');
});

// Función para insertar texto en la posición del cursor
function insertAtCursor(text) {
    if (activeInputField) {
        const startPos = activeInputField.selectionStart;
        const endPos = activeInputField.selectionEnd;
        const value = activeInputField.value;

        // Insertar el texto en la posición del cursor
        activeInputField.value = value.substring(0, startPos) + text + value.substring(endPos);

        // Mover el cursor después del texto insertado
        activeInputField.selectionStart = activeInputField.selectionEnd = startPos + text.length;

        // Restaurar el foco al campo de entrada
        activeInputField.focus();

        // Actualizar la previsualización
        updatePreview();
    }
}

// Función para borrar todos los campos de entrada
function clearFields() {
    document.getElementById('funcion').value = '';
    document.getElementById('variable').value = '';
    document.getElementById('limiteInferior').value = '';
    document.getElementById('limiteSuperior').value = '';
    document.getElementById('resultado').innerText = '';
    updatePreview(); // Actualizar la previsualización
}

// Detectar cambios en el campo de la función
document.getElementById('funcion').addEventListener('input', function() {
    updatePreview();
});

// Detectar cambios en el campo de la variable
document.getElementById('variable').addEventListener('input', function() {
    updatePreview();
});

// Detectar cambios en los límites de integración
document.getElementById('limiteInferior').addEventListener('input', function() {
    updatePreview();
});

document.getElementById('limiteSuperior').addEventListener('input', function() {
    updatePreview();
});

// Función para actualizar la previsualización de la integral
function updatePreview() {
    const funcion = document.getElementById('funcion').value.trim();
    const variable = document.getElementById('variable').value.trim();
    const limiteInferior = document.getElementById('limiteInferior').value.trim();
    const limiteSuperior = document.getElementById('limiteSuperior').value.trim();

    let previewText = '';

    if (funcion && variable) {
        // Asegurar que la función se muestre correctamente en la previsualización
        let funcionFormateada = funcion;

        // Reemplazar oo con \infty y -oo con -\infty en la función
        funcionFormateada = funcionFormateada.replace(/oo/g, '\\infty');
        funcionFormateada = funcionFormateada.replace(/-oo/g, '-\\infty');

        // Reemplazar funciones inversas primero (acos, asin, atan) con notación alternativa y manejar potencias
        funcionFormateada = funcionFormateada.replace(/acos\(([^)]+)\)\^(\d+)/g, '\\text{arccos}^{$2}($1)');
        funcionFormateada = funcionFormateada.replace(/asin\(([^)]+)\)\^(\d+)/g, '\\text{arcsin}^{$2}($1)');
        funcionFormateada = funcionFormateada.replace(/atan\(([^)]+)\)\^(\d+)/g, '\\text{arctan}^{$2}($1)');

        // Reemplazar funciones inversas sin potencias
        funcionFormateada = funcionFormateada.replace(/acos\(([^)]+)\)/g, '\\text{arccos}($1)');
        funcionFormateada = funcionFormateada.replace(/asin\(([^)]+)\)/g, '\\text{arcsin}($1)');
        funcionFormateada = funcionFormateada.replace(/atan\(([^)]+)\)/g, '\\text{arctan}($1)');

        // Reemplazar sin(x)^n con \sin^n(x)
        funcionFormateada = funcionFormateada.replace(/sin\(([^)]+)\)\^(\d+)/g, '\\sin^{$2}($1)');

        // Reemplazar cos(x)^n con \cos^n(x)
        funcionFormateada = funcionFormateada.replace(/cos\(([^)]+)\)\^(\d+)/g, '\\cos^{$2}($1)');

        // Reemplazar tan(x)^n con \tan^n(x)
        funcionFormateada = funcionFormateada.replace(/tan\(([^)]+)\)\^(\d+)/g, '\\tan^{$2}($1)');

        // Reemplazar cot(x)^n con \cot^n(x)
        funcionFormateada = funcionFormateada.replace(/cot\(([^)]+)\)\^(\d+)/g, '\\cot^{$2}($1)');

        // Reemplazar sec(x)^n con \sec^n(x)
        funcionFormateada = funcionFormateada.replace(/sec\(([^)]+)\)\^(\d+)/g, '\\sec^{$2}($1)');

        // Reemplazar csc(x)^n con \csc^n(x)
        funcionFormateada = funcionFormateada.replace(/csc\(([^)]+)\)\^(\d+)/g, '\\csc^{$2}($1)');

        // Reemplazar sin(x) con \sin(x)
        funcionFormateada = funcionFormateada.replace(/sin\(([^)]+)\)/g, '\\sin($1)');

        // Reemplazar cos(x) con \cos(x)
        funcionFormateada = funcionFormateada.replace(/cos\(([^)]+)\)/g, '\\cos($1)');

        // Reemplazar tan(x) con \tan(x)
        funcionFormateada = funcionFormateada.replace(/tan\(([^)]+)\)/g, '\\tan($1)');

        // Reemplazar cot(x) con \cot(x)
        funcionFormateada = funcionFormateada.replace(/cot\(([^)]+)\)/g, '\\cot($1)');

        // Reemplazar sec(x) con \sec(x)
        funcionFormateada = funcionFormateada.replace(/sec\(([^)]+)\)/g, '\\sec($1)');

        // Reemplazar csc(x) con \csc(x)
        funcionFormateada = funcionFormateada.replace(/csc\(([^)]+)\)/g, '\\csc($1)');

        // Reemplazar ln(x)^n con \ln^n(x)
        funcionFormateada = funcionFormateada.replace(/ln\(([^)]+)\)\^(\d+)/g, '\\ln^{$2}($1)');

        // Reemplazar ln(...) con \ln(...)
        funcionFormateada = funcionFormateada.replace(/ln\(([^)]+)\)/g, '\\ln($1)');

        // Reemplazar log(x, base) con \log_{base}(x)
        funcionFormateada = funcionFormateada.replace(/log\(([^,]+),\s*(\d+)\)/g, '\\log_{$2}($1)');

        // Reemplazar log(...) con \ln(...) (para logaritmos sin base específica)
        funcionFormateada = funcionFormateada.replace(/log\(([^)]+)\)/g, '\\ln($1)');

        // Reemplazar exp(...) con e^{...}
        funcionFormateada = funcionFormateada.replace(/exp\(([^)]+)\)/g, 'e^{$1}');

        // Reemplazar sqrt(...) con \sqrt{...}
        funcionFormateada = funcionFormateada.replace(/sqrt\(([^)]+)\)/g, '\\sqrt{$1}');

        // Reemplazar pi con \pi
        funcionFormateada = funcionFormateada.replace(/pi/g, '\\pi');

        // Reemplazar abs(...) con \left| ... \right|
        funcionFormateada = funcionFormateada.replace(/abs\(([^)]+)\)/g, '\\left| $1 \\right|');

        // Eliminar símbolos de multiplicación (*) y \cdot
        funcionFormateada = funcionFormateada.replace(/\*|\\cdot/g, '');

        // Asegurar que la función se muestre como fracción si contiene un "/"
        if (funcionFormateada.includes('/')) {
            const [numerador, denominador] = funcionFormateada.split('/');

            // Eliminar paréntesis innecesarios en la previsualización
            const numeradorLimpio = numerador.replace(/^\((.*)\)$/, '$1');
            const denominadorLimpio = denominador.replace(/^\((.*)\)$/, '$1');

            // Construir la integral con o sin límites
            if (limiteInferior && limiteSuperior) {
                previewText = `\\[\\int_{${limiteInferior}}^{${limiteSuperior}} \\frac{${numeradorLimpio}}{${denominadorLimpio}} \\, d${variable}\\]`;
            } else {
                previewText = `\\[\\int \\frac{${numeradorLimpio}}{${denominadorLimpio}} \\, d${variable}\\]`;
            }
        } else {
            // Construir la integral con o sin límites
            if (limiteInferior && limiteSuperior) {
                previewText = `\\[\\int_{${limiteInferior}}^{${limiteSuperior}} ${funcionFormateada} \\, d${variable}\\]`;
            } else {
                previewText = `\\[\\int ${funcionFormateada} \\, d${variable}\\]`;
            }
        }
    }

    // Función para formatear los límites con \text{} y potencias
    const formatearLimite = (limite) => {
        // Eliminar símbolos de multiplicación (*) en los límites
        limite = limite.replace(/\*/g, '');

        // Reemplazar sqrt(...) con \sqrt{...} en los límites
        limite = limite.replace(/sqrt\(([^)]+)\)/g, '\\sqrt{$1}');

        // Reemplazar potencias como 2^sqrt(2) con 2^{\sqrt{2}}
        limite = limite.replace(/(\d+)\^sqrt\(([^)]+)\)/g, '$1^{\\sqrt{$2}}');

        // Reemplazar abs(...) con \left| ... \right|
        limite = limite.replace(/abs\(([^)]+)\)/g, '\\left| $1 \\right|');

        // Reemplazar log(x, base) con \log_{base}(x) en los límites
        limite = limite.replace(/log\(([^,]+),\s*(\d+)\)/g, '\\log_{$2}($1)');

        // Si el límite contiene una fracción, formatearla como fracción en LaTeX
        if (limite.includes('/')) {
            const [numerador, denominador] = limite.split('/');

            // Eliminar paréntesis innecesarios en la previsualización
            const numeradorLimpio = numerador.replace(/^\((.*)\)$/, '$1');
            const denominadorLimpio = denominador.replace(/^\((.*)\)$/, '$1');

            limite = `\\frac{${numeradorLimpio}}{${denominadorLimpio}}`;
        }

        // Reemplazar pi con \pi en los límites
        limite = limite.replace(/pi/g, '\\pi');

        // Reemplazar funciones con potencias
        limite = limite.replace(/acos\(([^)]+)\)\^(\d+)/g, '\\text{arccos}^{$2}($1)')
                      .replace(/asin\(([^)]+)\)\^(\d+)/g, '\\text{arcsin}^{$2}($1)')
                      .replace(/atan\(([^)]+)\)\^(\d+)/g, '\\text{arctan}^{$2}($1)')
                      .replace(/sin\(([^)]+)\)\^(\d+)/g, '\\text{sin}^{$2}($1)')
                      .replace(/cos\(([^)]+)\)\^(\d+)/g, '\\text{cos}^{$2}($1)')
                      .replace(/tan\(([^)]+)\)\^(\d+)/g, '\\text{tan}^{$2}($1)')
                      .replace(/cot\(([^)]+)\)\^(\d+)/g, '\\text{cot}^{$2}($1)')
                      .replace(/sec\(([^)]+)\)\^(\d+)/g, '\\text{sec}^{$2}($1)')
                      .replace(/csc\(([^)]+)\)\^(\d+)/g, '\\text{csc}^{$2}($1)');

        // Reemplazar funciones sin potencias
        limite = limite.replace(/acos\(([^)]+)\)/g, '\\text{arccos}($1)')
                      .replace(/asin\(([^)]+)\)/g, '\\text{arcsin}($1)')
                      .replace(/atan\(([^)]+)\)/g, '\\text{arctan}($1)')
                      .replace(/sin\(([^)]+)\)/g, '\\text{sin}($1)')
                      .replace(/cos\(([^)]+)\)/g, '\\text{cos}($1)')
                      .replace(/tan\(([^)]+)\)/g, '\\text{tan}($1)')
                      .replace(/cot\(([^)]+)\)/g, '\\text{cot}($1)')
                      .replace(/sec\(([^)]+)\)/g, '\\text{sec}($1)')
                      .replace(/csc\(([^)]+)\)/g, '\\text{csc}($1)')
                      .replace(/oo/g, '\\infty')
                      .replace(/-oo/g, '-\\infty');

        return limite;
    };

    // Formatear los límites inferior y superior
    let limiteInferiorFormateado = formatearLimite(limiteInferior);
    let limiteSuperiorFormateado = formatearLimite(limiteSuperior);

    // Actualizar los límites en la previsualización solo si ambos límites están presentes
    if (limiteInferior && limiteSuperior) {
        previewText = previewText.replace(limiteInferior, limiteInferiorFormateado)
                                 .replace(limiteSuperior, limiteSuperiorFormateado);
    }

    document.getElementById('previewContent').innerHTML = previewText;
    MathJax.typesetPromise(['#previewContent']); // Renderizar LaTeX
}

// Llamar a updatePreview cuando se cargue la página
document.addEventListener('DOMContentLoaded', function() {
    updatePreview();
});