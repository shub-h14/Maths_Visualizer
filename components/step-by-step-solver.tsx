"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { derivative, simplify, parse, evaluate } from "mathjs"

interface StepByStepSolverProps {
  initialExpression?: string
}

export function StepByStepSolver({ initialExpression = "x^2" }: StepByStepSolverProps) {
  const [expression, setExpression] = useState(initialExpression)
  const [variable, setVariable] = useState("x")
  const [error, setError] = useState<string | null>(null)
  const [solverType, setSolverType] = useState<"derivative" | "integral" | "limit" | "equation">("derivative")
  const [steps, setSteps] = useState<string[]>([])
  const [result, setResult] = useState<string>("")
  const [equations, setEquations] = useState<string[]>(["x + y = 10", "2x - y = 5"])
  const [variables, setVariables] = useState<string[]>(["x", "y"])
  const [limitPoint, setLimitPoint] = useState<string>("0")

  // Update expression when initialExpression changes
  useEffect(() => {
    setExpression(initialExpression)
    // Auto-solve when expression changes
    if (initialExpression) {
      solveExpression()
    }
  }, [initialExpression])

  // Solve the expression
  const solveExpression = () => {
    try {
      // Parse the expression to check validity
      parse(expression)
      setError(null)

      // Clear previous results
      setSteps([])
      setResult("")

      switch (solverType) {
        case "derivative":
          solveDerivative()
          break
        case "integral":
          solveIntegral()
          break
        case "limit":
          solveLimit()
          break
        case "equation":
          solveEquation()
          break
      }
    } catch (e) {
      setError("Invalid expression")
    }
  }

  // Solve derivative
  const solveDerivative = () => {
    try {
      // Step 1: Show the original expression
      setSteps([`Step 1: Start with the expression f(${variable}) = ${expression}`])

      // Step 2: Apply the derivative rules
      let step2 = "Step 2: Apply the derivative rules"

      // Check for common patterns to provide more detailed steps
      if (expression.includes("^")) {
        step2 += "\n- For terms with powers (x^n), use the power rule: d/dx(x^n) = n·x^(n-1)"
      }
      if (expression.includes("sin") || expression.includes("cos")) {
        step2 += "\n- For trigonometric functions, use: d/dx(sin(x)) = cos(x) and d/dx(cos(x)) = -sin(x)"
      }
      if (expression.includes("e^")) {
        step2 += "\n- For exponential functions, use: d/dx(e^x) = e^x"
      }
      if (expression.includes("ln") || expression.includes("log")) {
        step2 += "\n- For logarithmic functions, use: d/dx(ln(x)) = 1/x and d/dx(log(x)) = 1/(x·ln(10))"
      }

      setSteps((prev) => [...prev, step2])

      // Step 3: Calculate the derivative
      const derivativeExpr = derivative(expression, variable).toString()
      setSteps((prev) => [...prev, `Step 3: Calculate the derivative\nf'(${variable}) = ${derivativeExpr}`])

      // Step 4: Simplify if possible
      try {
        const simplified = simplify(derivativeExpr).toString()
        if (simplified !== derivativeExpr) {
          setSteps((prev) => [...prev, `Step 4: Simplify the result\nf'(${variable}) = ${simplified}`])
          setResult(simplified)
        } else {
          setResult(derivativeExpr)
        }
      } catch (e) {
        // If simplification fails, use the unsimplified result
        setResult(derivativeExpr)
      }
    } catch (e) {
      setError("Error calculating derivative: " + (e as Error).message)
    }
  }

  // Solve integral (improved approach)
  const solveIntegral = () => {
    try {
      // Step 1: Show the original expression
      setSteps([`Step 1: Start with the expression to integrate: ∫${expression} d${variable}`])

      // Step 2: Apply integration rules
      let step2 = "Step 2: Apply the integration rules"

      // Check for common patterns to provide more detailed steps
      if (expression.includes("^")) {
        step2 += "\n- For terms with powers (x^n), use the power rule: ∫x^n dx = x^(n+1)/(n+1) + C (for n ≠ -1)"
      }
      if (expression.includes("sin")) {
        step2 += "\n- For sin(x), use: ∫sin(x) dx = -cos(x) + C"
      }
      if (expression.includes("cos")) {
        step2 += "\n- For cos(x), use: ∫cos(x) dx = sin(x) + C"
      }
      if (expression.includes("e^")) {
        step2 += "\n- For exponential functions, use: ∫e^x dx = e^x + C"
      }
      if (expression.includes("1/x") || expression === "1/x") {
        step2 += "\n- For 1/x, use: ∫1/x dx = ln|x| + C"
      }
      if (expression.includes("log") || expression.includes("ln")) {
        step2 += "\n- For logarithmic functions, use: ∫ln(x) dx = x·ln(x) - x + C"
      }

      setSteps((prev) => [...prev, step2])

      // Step 3: Provide a result based on pattern matching (improved approach)
      let integralResult = ""

      // Handle polynomial expressions with multiple terms
      if (expression.includes("+") || expression.includes("-")) {
        // Split the expression into terms
        const terms = expression.split(/(?=[-+])/).map((term) => term.trim())

        // Integrate each term separately
        const integratedTerms = terms.map((term) => {
          // Handle different types of terms
          if (term.includes(`${variable}^`)) {
            // Term with variable raised to a power
            const match = term.match(new RegExp(`([+-]?\\d*\\.?\\d*)?\\*?${variable}\\^(\\d+\\.?\\d*)`))
            if (match) {
              const coef = match[1] ? (match[1] === "-" ? -1 : Number.parseFloat(match[1])) : 1
              const power = Number.parseFloat(match[2])
              const newPower = power + 1
              return `${coef / newPower} * ${variable}^${newPower}`
            }
          } else if (term === variable || term === `+${variable}`) {
            // Just the variable
            return `${variable}^2/2`
          } else if (term === `-${variable}`) {
            // Negative variable
            return `-${variable}^2/2`
          } else if (term.includes(variable)) {
            // Term with variable but no power
            const match = term.match(new RegExp(`([+-]?\\d*\\.?\\d*)?\\*?${variable}`))
            if (match) {
              const coef = match[1] ? (match[1] === "-" ? -1 : Number.parseFloat(match[1])) : 1
              return `${coef / 2} * ${variable}^2`
            }
          } else if (term.match(/^[+-]?\d+(\.\d+)?$/)) {
            // Constant term
            const constant = Number.parseFloat(term)
            return `${constant} * ${variable}`
          } else if (term.includes("sin")) {
            // Handle sin(x)
            if (term === `sin(${variable})` || term === `+sin(${variable})`) {
              return `-cos(${variable})`
            } else {
              const match = term.match(/([+-]?\d*\.?\d*)?\*?sin\(/)
              if (match) {
                const coef = match[1] ? (match[1] === "-" ? -1 : Number.parseFloat(match[1])) : 1
                return `${-coef} * cos(${variable})`
              }
            }
          } else if (term.includes("cos")) {
            // Handle cos(x)
            if (term === `cos(${variable})` || term === `+cos(${variable})`) {
              return `sin(${variable})`
            } else {
              const match = term.match(/([+-]?\d*\.?\d*)?\*?cos\(/)
              if (match) {
                const coef = match[1] ? (match[1] === "-" ? -1 : Number.parseFloat(match[1])) : 1
                return `${coef} * sin(${variable})`
              }
            }
          } else if (term.includes("e^")) {
            // Handle e^x
            if (term === `e^${variable}` || term === `+e^${variable}`) {
              return `e^${variable}`
            } else {
              const match = term.match(/([+-]?\d*\.?\d*)?\*?e\^/)
              if (match) {
                const coef = match[1] ? (match[1] === "-" ? -1 : Number.parseFloat(match[1])) : 1
                return `${coef} * e^${variable}`
              }
            }
          }

          // If we can't parse the term, return it as is
          return `(∫${term} d${variable})`
        })

        // Join the integrated terms
        integralResult = integratedTerms.join(" + ").replace(/\+ -/g, "- ") + " + C"
      } else {
        // Handle single term expressions
        if (expression === "x") {
          integralResult = "x^2/2 + C"
        } else if (expression === "x^2") {
          integralResult = "x^3/3 + C"
        } else if (expression.match(/x\^(\d+)/)) {
          const match = expression.match(/x\^(\d+)/)
          if (match && match[1]) {
            const power = Number.parseInt(match[1])
            integralResult = `x^${power + 1}/${power + 1} + C`
          }
        } else if (expression === "1/x") {
          integralResult = "ln|x| + C"
        } else if (expression === "sin(x)") {
          integralResult = "-cos(x) + C"
        } else if (expression === "cos(x)") {
          integralResult = "sin(x) + C"
        } else if (expression === "tan(x)") {
          integralResult = "-ln|cos(x)| + C"
        } else if (expression === "e^x") {
          integralResult = "e^x + C"
        } else if (expression === "ln(x)") {
          integralResult = "x·ln(x) - x + C"
        } else if (expression === "1/(1+x^2)") {
          integralResult = "arctan(x) + C"
        } else if (expression === "1/sqrt(1-x^2)") {
          integralResult = "arcsin(x) + C"
        } else {
          integralResult = `∫${expression} d${variable} (requires advanced techniques)`
        }
      }

      setSteps((prev) => [...prev, `Step 3: Calculate the integral\n∫${expression} d${variable} = ${integralResult}`])
      setResult(integralResult)
    } catch (e) {
      setError("Error calculating integral. Please check your expression and try again.")
    }
  }

  // Solve limit (improved approach)
  const solveLimit = () => {
    try {
      // Step 1: Show the original expression
      setSteps([`Step 1: Start with the limit expression: lim(${variable}→${limitPoint}) ${expression}`])

      // Step 2: Explain the approach
      setSteps((prev) => [
        ...prev,
        `Step 2: To evaluate the limit, we'll substitute ${variable} = ${limitPoint} into the expression if possible`,
      ])

      // Step 3: Try direct substitution
      try {
        const point = Number.parseFloat(limitPoint)
        const result = evaluate(expression, { [variable]: point })

        if (isNaN(result) || !isFinite(result)) {
          // Handle indeterminate forms
          if (expression.includes("/")) {
            setSteps((prev) => [
              ...prev,
              "Step 3: Direct substitution leads to an indeterminate form (like 0/0 or ∞/∞).",
              "Step 4: Apply L'Hôpital's rule: If lim f(x)/g(x) gives 0/0 or ∞/∞, then it equals lim f'(x)/g'(x)",
            ])

            // Try to handle simple cases
            const parts = expression.split("/")
            if (parts.length === 2) {
              try {
                const numerator = parts[0].trim()
                const denominator = parts[1].trim()

                const numDeriv = derivative(numerator, variable).toString()
                const denDeriv = derivative(denominator, variable).toString()

                setSteps((prev) => [
                  ...prev,
                  `Step 5: Find derivatives of numerator and denominator:`,
                  `   Numerator derivative: ${numDeriv}`,
                  `   Denominator derivative: ${denDeriv}`,
                ])

                try {
                  const lhopitalResult = evaluate(`(${numDeriv})/(${denDeriv})`, { [variable]: point })
                  if (!isNaN(lhopitalResult) && isFinite(lhopitalResult)) {
                    setSteps((prev) => [
                      ...prev,
                      `Step 6: Evaluate the limit of the derivatives at ${variable} = ${limitPoint}`,
                      `   Result: ${lhopitalResult}`,
                    ])
                    setResult(lhopitalResult.toString())
                  } else {
                    setSteps((prev) => [
                      ...prev,
                      "Step 6: Further application of L'Hôpital's rule or other techniques required",
                    ])
                    setResult("Requires advanced limit techniques")
                  }
                } catch (e) {
                  setSteps((prev) => [
                    ...prev,
                    "Step 6: Further application of L'Hôpital's rule or other techniques required",
                  ])
                  setResult("Requires advanced limit techniques")
                }
              } catch (e) {
                setSteps((prev) => [...prev, "Step 5: Advanced techniques required to evaluate this limit"])
                setResult("Requires advanced limit techniques")
              }
            } else {
              setResult("Requires advanced limit techniques")
            }
          } else {
            setSteps((prev) => [
              ...prev,
              "Step 3: Direct substitution leads to an indeterminate form. Advanced techniques required.",
            ])
            setResult("Requires advanced limit techniques")
          }
        } else {
          setSteps((prev) => [
            ...prev,
            `Step 3: Substitute ${variable} = ${limitPoint} into the expression\n${expression} = ${result}`,
          ])
          setResult(result.toString())
        }
      } catch (e) {
        // If direct substitution fails, provide a general explanation
        setSteps((prev) => [
          ...prev,
          "Step 3: Direct substitution leads to an indeterminate form. Advanced techniques like L'Hôpital's rule may be required.",
        ])
        setResult("Requires advanced limit techniques")
      }
    } catch (e) {
      setError("Error calculating limit: " + (e as Error).message)
    }
  }

  // Solve equation (new function)
  const solveEquation = () => {
    try {
      // For single variable equations
      if (equations.length === 1 && variables.length === 1) {
        const equation = equations[0]
        const variable = variables[0]

        setSteps([`Step 1: Start with the equation ${equation}`])

        // Check if it's a simple equation like x = 5 or x + 3 = 8
        if (equation.includes("=")) {
          const parts = equation.split("=").map((p) => p.trim())

          if (parts.length === 2) {
            setSteps((prev) => [...prev, `Step 2: Isolate the variable ${variable}`])

            // Very simple case: x = number
            if (parts[0] === variable) {
              setSteps((prev) => [...prev, `Step 3: The solution is ${variable} = ${parts[1]}`])
              setResult(`${variable} = ${parts[1]}`)
              return
            }

            // Simple case: x + number = number or number + x = number
            try {
              // Move everything except the variable to the right side
              if (parts[0].includes(variable)) {
                // Try to parse the equation
                const leftSide = parts[0]
                const rightSide = parts[1]

                // Handle x + a = b case
                if (leftSide.includes("+")) {
                  const leftParts = leftSide.split("+").map((p) => p.trim())
                  const varPart = leftParts.find((p) => p.includes(variable))
                  const constParts = leftParts.filter((p) => !p.includes(variable))

                  if (varPart && constParts.length > 0) {
                    const constValue = constParts.map((p) => Number.parseFloat(p)).reduce((a, b) => a + b, 0)
                    setSteps((prev) => [
                      ...prev,
                      `Step 3: Move constant terms to the right side`,
                      `${varPart} = ${rightSide} - ${constValue}`,
                      `${varPart} = ${Number.parseFloat(rightSide) - constValue}`,
                    ])

                    // Handle coefficient if present (like 2x)
                    if (varPart !== variable) {
                      const coef = Number.parseFloat(varPart.replace(variable, ""))
                      setSteps((prev) => [
                        ...prev,
                        `Step 4: Divide both sides by the coefficient ${coef}`,
                        `${variable} = ${(Number.parseFloat(rightSide) - constValue) / coef}`,
                      ])
                      setResult(`${variable} = ${(Number.parseFloat(rightSide) - constValue) / coef}`)
                    } else {
                      setResult(`${variable} = ${Number.parseFloat(rightSide) - constValue}`)
                    }
                    return
                  }
                }

                // Handle ax = b case
                if (!leftSide.includes("+") && !leftSide.includes("-")) {
                  if (leftSide !== variable) {
                    const coef = Number.parseFloat(leftSide.replace(variable, ""))
                    setSteps((prev) => [
                      ...prev,
                      `Step 3: Divide both sides by the coefficient ${coef}`,
                      `${variable} = ${Number.parseFloat(rightSide) / coef}`,
                    ])
                    setResult(`${variable} = ${Number.parseFloat(rightSide) / coef}`)
                    return
                  }
                }
              }
            } catch (e) {
              // Fall back to general approach
            }

            setSteps((prev) => [
              ...prev,
              `Step 3: This equation requires algebraic manipulation to isolate ${variable}`,
              `Step 4: After rearranging, solve for ${variable}`,
            ])
            setResult("Equation requires manual algebraic manipulation")
          }
        }
      }
      // For systems of equations with 2 variables
      else if (equations.length === 2 && variables.length === 2) {
        const [eq1, eq2] = equations
        const [var1, var2] = variables

        setSteps([`Step 1: Start with the system of equations`, `   ${eq1}`, `   ${eq2}`])

        setSteps((prev) => [
          ...prev,
          `Step 2: Solve the system using substitution or elimination method`,
          `Step 3: First, isolate one variable in one equation`,
        ])

        // Try to solve simple systems like:
        // x + y = a
        // x - y = b
        try {
          if (eq1.includes("+") && eq1.includes("=") && eq2.includes("-") && eq2.includes("=")) {
            const eq1Parts = eq1.split("=").map((p) => p.trim())
            const eq2Parts = eq2.split("=").map((p) => p.trim())

            if (eq1Parts.length === 2 && eq2Parts.length === 2) {
              const a = Number.parseFloat(eq1Parts[1])
              const b = Number.parseFloat(eq2Parts[1])

              setSteps((prev) => [
                ...prev,
                `Step 4: Add the equations to eliminate ${var2}`,
                `   ${eq1}`,
                `   ${eq2}`,
                `   Result: 2${var1} = ${a + b}`,
                `   ${var1} = ${(a + b) / 2}`,
                `Step 5: Substitute ${var1} = ${(a + b) / 2} into the first equation`,
                `   ${(a + b) / 2} + ${var2} = ${a}`,
                `   ${var2} = ${a} - ${(a + b) / 2}`,
                `   ${var2} = ${a - (a + b) / 2}`,
              ])

              setResult(`${var1} = ${(a + b) / 2}, ${var2} = ${a - (a + b) / 2}`)
              return
            }
          }
        } catch (e) {
          // Fall back to general approach
        }

        setSteps((prev) => [
          ...prev,
          `Step 4: This system requires algebraic manipulation to solve`,
          `Step 5: After substitution or elimination, solve for both variables`,
        ])
        setResult("System requires manual algebraic manipulation")
      } else {
        setSteps([
          `Step 1: Start with the system of ${equations.length} equations and ${variables.length} variables`,
          `Step 2: This system requires advanced techniques to solve`,
        ])
        setResult("Complex system requires advanced techniques")
      }
    } catch (e) {
      setError("Error solving equation: " + (e as Error).message)
    }
  }

  // Handle adding a new equation
  const addEquation = () => {
    setEquations([...equations, ""])
  }

  // Handle updating an equation
  const updateEquation = (index: number, value: string) => {
    const newEquations = [...equations]
    newEquations[index] = value
    setEquations(newEquations)
  }

  // Handle removing an equation
  const removeEquation = (index: number) => {
    if (equations.length > 1) {
      const newEquations = [...equations]
      newEquations.splice(index, 1)
      setEquations(newEquations)
    }
  }

  // Handle adding a variable
  const addVariable = () => {
    setVariables([...variables, ""])
  }

  // Handle updating a variable
  const updateVariable = (index: number, value: string) => {
    const newVariables = [...variables]
    newVariables[index] = value
    setVariables(newVariables)
  }

  // Handle removing a variable
  const removeVariable = (index: number) => {
    if (variables.length > 1) {
      const newVariables = [...variables]
      newVariables.splice(index, 1)
      setVariables(newVariables)
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          <Tabs value={solverType} onValueChange={(value) => setSolverType(value as any)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="derivative">Derivative</TabsTrigger>
              <TabsTrigger value="integral">Integral</TabsTrigger>
              <TabsTrigger value="limit">Limit</TabsTrigger>
              <TabsTrigger value="equation">Equation</TabsTrigger>
            </TabsList>

            <TabsContent value="derivative" className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="expression-input">Function to Differentiate</Label>
                  <Input
                    id="expression-input"
                    value={expression}
                    onChange={(e) => setExpression(e.target.value)}
                    placeholder="e.g., x^2, sin(x), e^x, log(x)"
                  />
                </div>
                <div className="w-24">
                  <Label htmlFor="variable-input">Variable</Label>
                  <Input
                    id="variable-input"
                    value={variable}
                    onChange={(e) => setVariable(e.target.value)}
                    placeholder="e.g., x"
                  />
                </div>
              </div>
              <Button onClick={solveExpression}>Calculate Derivative</Button>
            </TabsContent>

            <TabsContent value="integral" className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="integral-input">Function to Integrate</Label>
                  <Input
                    id="integral-input"
                    value={expression}
                    onChange={(e) => setExpression(e.target.value)}
                    placeholder="e.g., x^2, sin(x), e^x, 1/x"
                  />
                </div>
                <div className="w-24">
                  <Label htmlFor="integral-variable">Variable</Label>
                  <Input
                    id="integral-variable"
                    value={variable}
                    onChange={(e) => setVariable(e.target.value)}
                    placeholder="e.g., x"
                  />
                </div>
              </div>
              <Button onClick={solveExpression}>Calculate Integral</Button>
            </TabsContent>

            <TabsContent value="limit" className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="limit-input">Function</Label>
                  <Input
                    id="limit-input"
                    value={expression}
                    onChange={(e) => setExpression(e.target.value)}
                    placeholder="e.g., sin(x)/x, (e^x-1)/x"
                  />
                </div>
                <div className="w-24">
                  <Label htmlFor="limit-variable">Variable</Label>
                  <Input
                    id="limit-variable"
                    value={variable}
                    onChange={(e) => setVariable(e.target.value)}
                    placeholder="e.g., x"
                  />
                </div>
                <div className="w-24">
                  <Label htmlFor="limit-point">Approaching</Label>
                  <Input
                    id="limit-point"
                    value={limitPoint}
                    onChange={(e) => setLimitPoint(e.target.value)}
                    placeholder="e.g., 0"
                  />
                </div>
              </div>
              <Button onClick={solveExpression}>Calculate Limit</Button>
            </TabsContent>

            <TabsContent value="equation" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Variables</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {variables.map((v, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Input
                          value={v}
                          onChange={(e) => updateVariable(i, e.target.value)}
                          placeholder="e.g., x"
                          className="w-20"
                        />
                        {variables.length > 1 && (
                          <Button variant="outline" size="sm" onClick={() => removeVariable(i)}>
                            -
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addVariable}>
                      Add Variable
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Equations</Label>
                  <div className="space-y-2 mt-2">
                    {equations.map((eq, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Input
                          value={eq}
                          onChange={(e) => updateEquation(i, e.target.value)}
                          placeholder="e.g., x + y = 10"
                          className="flex-1"
                        />
                        {equations.length > 1 && (
                          <Button variant="outline" size="sm" onClick={() => removeEquation(i)}>
                            -
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addEquation}>
                      Add Equation
                    </Button>
                  </div>
                </div>
              </div>
              <Button onClick={solveExpression}>Solve Equation</Button>
            </TabsContent>
          </Tabs>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {steps.length > 0 && (
            <div className="space-y-4 mt-4">
              <h3 className="text-lg font-medium">Step-by-Step Solution</h3>
              <div className="bg-muted p-4 rounded-md">
                {steps.map((step, index) => (
                  <div key={index} className="mb-4 whitespace-pre-line">
                    {step}
                  </div>
                ))}
                {result && <div className="font-bold mt-4">Result: {result}</div>}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
