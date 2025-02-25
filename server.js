const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const app = express();

// Sirve archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Ruta raíz para servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para calcular la integral
app.post('/calcular', (req, res) => {
    const { funcion, variable, limiteInferior, limiteSuperior } = req.body;

    if (!funcion || !variable) {
        return res.status(400).json({ error: 'Se requiere una función y una variable.' });
    }

    const comando = `python3 sympy_script.py`; // Usar 'python3' para garantizar compatibilidad
    const inputData = JSON.stringify({
        funcion: funcion,
        variable: variable,
        limiteInferior: limiteInferior || '',
        limiteSuperior: limiteSuperior || ''
    });

    console.log("Datos enviados a Python:", inputData);

    const proceso = exec(comando, (error, stdout, stderr) => {
        if (error) {
            console.error("Error al ejecutar Python:", stderr);
            return res.status(500).json({ error: stderr });
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

// Escuchar en el puerto proporcionado por Render o 3000 por defecto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});