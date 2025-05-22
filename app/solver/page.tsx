import { StepByStepSolver } from "@/components/step-by-step-solver"

export default function SolverPage() {
  return (
    <div className="container mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Step-by-Step Solver</h1>
        <p className="text-muted-foreground mb-8">Get detailed solutions to math problems</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Mathematical Problem Solver</h2>
          <p className="text-muted-foreground mb-4">
            Enter a mathematical expression and get a step-by-step solution. Choose between differentiation,
            integration, or limit calculations.
          </p>
          <StepByStepSolver />
        </div>

        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-4">Common Mathematical Expressions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium">Polynomial Functions</h3>
              <p className="text-sm">
                <code>x^2 + 3*x - 4</code>
              </p>
              <p className="text-sm">
                <code>2*x^3 - 5*x^2 + x - 7</code>
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Trigonometric Functions</h3>
              <p className="text-sm">
                <code>sin(x)</code>
              </p>
              <p className="text-sm">
                <code>cos(x) + sin(x)</code>
              </p>
              <p className="text-sm">
                <code>tan(x) * sin(x)</code>
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Exponential Functions</h3>
              <p className="text-sm">
                <code>e^x</code>
              </p>
              <p className="text-sm">
                <code>2^x</code>
              </p>
              <p className="text-sm">
                <code>e^(x^2)</code>
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Logarithmic Functions</h3>
              <p className="text-sm">
                <code>log(x)</code> (base 10)
              </p>
              <p className="text-sm">
                <code>ln(x)</code> (natural log)
              </p>
              <p className="text-sm">
                <code>log(x, 2)</code> (base 2)
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Combined Functions</h3>
              <p className="text-sm">
                <code>x^2 * sin(x)</code>
              </p>
              <p className="text-sm">
                <code>e^x * cos(x)</code>
              </p>
              <p className="text-sm">
                <code>ln(x) / x</code>
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Rational Functions</h3>
              <p className="text-sm">
                <code>1/x</code>
              </p>
              <p className="text-sm">
                <code>(x^2 + 1)/(x - 2)</code>
              </p>
              <p className="text-sm">
                <code>x/(x^2 + 4)</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
