const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000; // Usar el puerto asignado por Render

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Ruta para calcular la integral
app.post('/calcular', (req, res) => {
    const { funcion, variable, limiteInferior, limiteSuperior } = req.body;

    // Ejecutar el script de Python
    exec(`python3 ${path.join(__dirname, 'sympy_script.py')} "${funcion}" "${variable}" "${limiteInferior}" "${limiteSuperior}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${stderr}`);
            return res.status(500).send(stderr);
        }
        res.json({ resultado: stdout });
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});