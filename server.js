const express = require('express');
const { spawn } = require('child_process');
const app = express();
const port = 3000;

app.use(express.static(__dirname));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/calcular', (req, res) => {
    const { funcion, variable, limiteInferior, limiteSuperior } = req.body;

    if (!funcion || !variable) {
        return res.status(400).json({ error: 'Se requiere una función y una variable.' });
    }

    const inputData = JSON.stringify({
        funcion,
        variable,
        limiteInferior,
        limiteSuperior
    });

    console.log("Datos enviados a Python:", inputData);

    // Ejecutar script de Python con `spawn`
    const proceso = spawn('python', ['sympy_script.py']);

    let resultadoPython = '';
    let errorPython = '';

    // Capturar salida estándar del script de Python
    proceso.stdout.on('data', (data) => {
        resultadoPython += data.toString();
    });

    // Capturar salida de error del script de Python
    proceso.stderr.on('data', (data) => {
        errorPython += data.toString();
    });

    // Manejar el cierre del proceso de Python
    proceso.on('close', (code) => {
        console.log(`Proceso de Python finalizado con código ${code}`);

        if (errorPython) {
            console.error("Error en Python:", errorPython);
            return res.status(500).json({ error: "Error en el procesamiento de Python.", detalles: errorPython });
        }

        try {
            if (!resultadoPython.trim()) {
                throw new Error("Salida de Python vacía.");
            }

            const resultado = JSON.parse(resultadoPython).resultado;
            res.json({ resultado });
        } catch (e) {
            console.error("Error al parsear la salida de Python:", e);
            console.error("Salida recibida:", resultadoPython);
            res.status(500).json({ error: "Error al procesar el resultado." });
        }
    });

    // Enviar los datos al script de Python
    proceso.stdin.write(inputData);
    proceso.stdin.end();
});
 
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
