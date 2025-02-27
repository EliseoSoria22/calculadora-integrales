import sympy as sp
import sys
import json

# Leer datos desde la entrada estándar
data = json.loads(sys.stdin.read())
funcion = data['funcion']
variable = data['variable']
limite_inferior = data['limiteInferior']
limite_superior = data['limiteSuperior']

# Definir la variable simbólica
x = sp.symbols(variable)
expr = sp.sympify(funcion)

# Función para agregar valor absoluto a argumentos de logaritmos
def aplicar_valor_absoluto(expr):
    return expr.replace(sp.log, lambda arg: sp.log(sp.Abs(arg)))

# Verificar si es una integral definida o indefinida
if limite_inferior and limite_superior:
    # Integral definida
    limite_inferior_sym = sp.sympify(limite_inferior)
    limite_superior_sym = sp.sympify(limite_superior)
    resultado = sp.integrate(expr, (x, limite_inferior_sym, limite_superior_sym))
else:
    # Integral indefinida
    resultado = sp.integrate(expr, x)
    resultado = aplicar_valor_absoluto(resultado)  # Aplicar valor absoluto en logaritmos

# Convertir el resultado a LaTeX
resultado_latex = sp.latex(resultado)

# Agregar la constante de integración en caso de integral indefinida
if not (limite_inferior and limite_superior):
    resultado_latex += " + C"

# Reemplazar funciones trigonométricas para mejor formato LaTeX
resultado_latex = resultado_latex.replace(r'\operatorname{atan}', r'\arctan')
resultado_latex = resultado_latex.replace(r'\operatorname{asin}', r'\arcsin')
resultado_latex = resultado_latex.replace(r'\operatorname{acos}', r'\arccos')

# Convertir log a ln
resultado_latex = resultado_latex.replace(r'\log', r'\ln')

# Asegurar que los valores sean racionales si son flotantes
if isinstance(resultado, sp.Float):
    resultado = sp.Rational(resultado).limit_denominator()

# Imprimir el resultado en formato JSON
print(json.dumps({"resultado": resultado_latex}))