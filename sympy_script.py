import sympy as sp
import sys
import json
import traceback  # Import traceback module

try:
    data = json.loads(sys.stdin.read())
    funcion = data['funcion']
    variable = data['variable']
    limite_inferior = data['limiteInferior']
    limite_superior = data['limiteSuperior']

    x = sp.symbols(variable)
    expr = sp.sympify(funcion)

    # Verificar si es una integral definida o indefinida
    if limite_inferior and limite_superior:
        # Integral definida
        limite_inferior_sym = sp.sympify(limite_inferior)
        limite_superior_sym = sp.sympify(limite_superior)
        resultado = sp.integrate(expr, (x, limite_inferior_sym, limite_superior_sym))
        resultado_latex = sp.latex(resultado)  # Convertir a LaTeX
    else:
        # Integral indefinida
        resultado = sp.integrate(expr, x)
        # Convertir el resultado a LaTeX y agregar la constante C al final
        resultado_latex = sp.latex(resultado) + " + C"

    # Reemplazar \log por \ln en la salida de LaTeX
    resultado_latex = resultado_latex.replace(r'\log', r'\ln')
    resultado_latex = resultado_latex.replace(r'\operatorname{atan}', r'\arctan')
    resultado_latex = resultado_latex.replace(r'\operatorname{asin}', r'\arcsin')
    resultado_latex = resultado_latex.replace(r'\operatorname{acos}', r'\arccos')

    if isinstance(resultado, sp.Float):
        resultado = sp.Rational(resultado).limit_denominator()

    print(json.dumps({"resultado": resultado_latex}))

except Exception as e:
    # Capture the full traceback
    error_message = str(e)
    error_traceback = traceback.format_exc()  # Get traceback as a string

    # Log the error and traceback to stderr (will likely appear in Render logs)
    print(json.dumps({"error": error_message, "traceback": error_traceback})) # Send JSON error
    sys.stderr.write(f"Python script error: {error_message}\n{error_traceback}\n") # Also write to stderr
    sys.exit(1) # Indicate failure with an exit code