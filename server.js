const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = process.env.PORT || 3000; // Usar el puerto dinámico de Railway

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

    const comando = `python3 sympy_script.py`; // Usar python3 en lugar de python
    const inputData = JSON.stringify({
        funcion: funcion,
        variable: variable,
        limiteInferior: limiteInferior,
        limiteSuperior: limiteSuperior
    });

    console.log("Datos enviados a Python:", inputData);

    const proceso = exec(comando, (error, stdout, stderr) => {
        if (error) {
            console.error("Error al ejecutar Python:", stderr);
            return res.status(500).json({ error: "Error al ejecutar el script de Python." });
        }

        console.log("Salida de Python:", stdout);

        try {
            const resultado = JSON.parse(stdout).resultado;
            res.json({ resultado: resultado });
        } catch (e) {
            console.error("Error al parsear la salida de Python:", e);
            res.status(500).json({ error: "Error al procesar el resultado." });
        }
    });

    proceso.stdin.write(inputData);
    proceso.stdin.end();
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});