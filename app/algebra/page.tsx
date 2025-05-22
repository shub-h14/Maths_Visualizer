"use client"

import { useState } from "react"
import { FunctionPlotter } from "@/components/function-plotter"
import { StepByStepSolver } from "@/components/step-by-step-solver"

export default function AlgebraPage() {
  const [currentFunction, setCurrentFunction] = useState("x^2")

  const handleFunctionChange = (func: string) => {
    setCurrentFunction(func)
  }

  return (
    <div className="container mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Algebra Visualizer</h1>
        <p className="text-muted-foreground mb-8">Plot and analyze functions and equations</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Function Plotter</h2>
          <p className="text-muted-foreground mb-4">
            Plot functions and analyze their key points (roots, maxima, minima, inflection points). Try entering
            functions like <code>x^2</code>, <code>sin(x)</code>, <code>log(x)</code>, <code>e^x</code>,{" "}
            <code>a*x^2 + 2*x + 1</code>, or <code>x^3 - 3*x</code>.
          </p>
          <FunctionPlotter defaultFunction={currentFunction} onFunctionChange={handleFunctionChange} />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Parameter Exploration</h2>
          <p className="text-muted-foreground mb-4">
            Explore how parameters affect function behavior. Use the parameter slider to change the value of{" "}
            <code>a</code> in the function.
          </p>
          <FunctionPlotter defaultFunction={currentFunction} onFunctionChange={handleFunctionChange} />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Step-by-Step Solver</h2>
          <p className="text-muted-foreground mb-4">Get detailed step-by-step solutions for algebraic problems.</p>
          <StepByStepSolver initialExpression={currentFunction} />
        </div>
      </div>
    </div>
  )
}
