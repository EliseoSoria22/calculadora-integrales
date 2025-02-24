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

// Nuevos botones
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

// Nuevos botones
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
    }
}

// Función para borrar todos los campos de entrada
function clearFields() {
    document.getElementById('funcion').value = '';
    document.getElementById('variable').value = '';
    document.getElementById('limiteInferior').value = '';
    document.getElementById('limiteSuperior').value = '';
    document.getElementById('resultado').innerText = '';
}