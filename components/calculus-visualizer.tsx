"use client"

import { useState } from "react"
import { FunctionPlotter } from "@/components/function-plotter"
import { StepByStepSolver } from "@/components/step-by-step-solver"
import { Card, CardContent } from "@/components/ui/card"

export function CalculusVisualizer() {
  const [currentFunction, setCurrentFunction] = useState("x^2")

  const handleFunctionChange = (func: string) => {
    setCurrentFunction(func)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Function Visualization</h2>
        <p className="text-muted-foreground mb-4">
          Enter a function below to visualize it. The derivative and integral will be shown in separate graphs.
        </p>
        <FunctionPlotter defaultFunction={currentFunction} onFunctionChange={handleFunctionChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Derivative Visualization</h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">Derivative of f(x) = {currentFunction}</p>
              <FunctionPlotter
                defaultFunction={currentFunction}
                showDerivative={true}
                onFunctionChange={handleFunctionChange}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Integral Visualization</h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">Integral of f(x) = {currentFunction}</p>
              <FunctionPlotter
                defaultFunction={currentFunction}
                showIntegral={true}
                onFunctionChange={handleFunctionChange}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Step-by-Step Derivative Solver</h2>
        <p className="text-muted-foreground mb-4">
          Get a detailed step-by-step solution for finding derivatives, integrals, and limits.
        </p>
        <StepByStepSolver initialExpression={currentFunction} />
      </div>
    </div>
  )
}
