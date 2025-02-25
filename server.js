const express = require('express');
const { exec } = require('child_process');
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

    const comando = `python sympy_script.py`;
    const inputData = JSON.stringify({
        funcion: funcion,
        variable: variable,
        limiteInferior: limiteInferior,
        limiteSuperior: limiteSuperior
    });

    console.log("Datos enviados a Python:", inputData); // Log input data

    const proceso = exec(comando, (error, stdout, stderr) => {
        console.log("Python stdout:", stdout); // Log stdout
        console.error("Python stderr:", stderr); // Log stderr (important for errors!)

        if (error) {
            console.error("Error al ejecutar Python (exec error):", error);
            return res.status(500).json({ error: stderr || error.message || 'Error al ejecutar Python script' }); // Include error details
        }

        try {
            const resultData = JSON.parse(stdout); // Parse output
            if (resultData.error) { // Check for Python script errors
                console.error("Error reportado desde Python:", resultData.error);
                console.error("Traceback desde Python:", resultData.traceback);
                return res.status(500).json({ error: `Error en script de Python: ${resultData.error}` }); // Send Python error back to client
            }
            const resultado = resultData.resultado;
            res.json({ resultado: resultado });
        } catch (e) {
            console.error("Error al parsear la salida de Python (JSON parse error):", e);
            res.status(500).json({ error: "Error al procesar el resultado." });
        }
    });

    proceso.stdin.write(inputData);
    proceso.stdin.end();
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});