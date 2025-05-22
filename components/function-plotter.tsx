"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Download } from "lucide-react"
import { evaluate, derivative, parse } from "mathjs"
import { useTheme } from "next-themes"

interface FunctionPlotterProps {
  defaultFunction?: string
  showDerivative?: boolean
  showIntegral?: boolean
  xMin?: number
  xMax?: number
  yMin?: number
  yMax?: number
  onFunctionChange?: (func: string) => void
}

export function FunctionPlotter({
  defaultFunction = "x^2",
  showDerivative = false,
  showIntegral = false,
  xMin = -10,
  xMax = 10,
  yMin = -10,
  yMax = 10,
  onFunctionChange,
}: FunctionPlotterProps) {
  const [functionText, setFunctionText] = useState(defaultFunction)
  const [error, setError] = useState<string | null>(null)
  const [xRange, setXRange] = useState([xMin, xMax])
  const [yRange, setYRange] = useState([yMin, yMax])
  const [a, setA] = useState(1)
  const [showTangent, setShowTangent] = useState(false)
  const [tangentPoint, setTangentPoint] = useState(0)
  const [integralBounds, setIntegralBounds] = useState<[number, number]>([-1, 1])
  const [showDerivativeState, setShowDerivative] = useState(showDerivative)
  const [showIntegralState, setShowIntegral] = useState(showIntegral)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  // Function to evaluate the expression safely
  const evaluateSafe = (expr: string, x: number, y = 0) => {
    try {
      return evaluate(expr, { x, y, a })
    } catch (e) {
      return Number.NaN
    }
  }

  // Function to find roots, maxima, minima
  const findKeyPoints = (func: string, start: number, end: number, step: number) => {
    const points = {
      roots: [] as number[],
      maxima: [] as number[],
      minima: [] as number[],
      inflection: [] as number[],
    }

    try {
      const df = derivative(func, "x").toString()
      const ddf = derivative(df, "x").toString()

      for (let x = start; x <= end; x += step) {
        const y = evaluateSafe(func, x)
        const dy = evaluateSafe(df, x)
        const ddy = evaluateSafe(ddf, x)

        // Check for roots (y ≈ 0)
        if (Math.abs(y) < 0.1) {
          points.roots.push(x)
        }

        // Check for extrema (dy ≈ 0)
        if (Math.abs(dy) < 0.1) {
          if (ddy > 0) {
            points.minima.push(x)
          } else if (ddy < 0) {
            points.maxima.push(x)
          }
        }

        // Check for inflection points (ddy ≈ 0)
        if (Math.abs(ddy) < 0.1) {
          points.inflection.push(x)
        }
      }
    } catch (e) {
      // Silently fail if derivative calculation fails
    }

    return points
  }

  // Draw the graph
  const drawGraph = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set dimensions
    const width = canvas.width
    const height = canvas.height

    // Calculate scale factors
    const scaleX = width / (xRange[1] - xRange[0])
    const scaleY = height / (yRange[1] - yRange[0])

    // Transform coordinates
    const transformX = (x: number) => (x - xRange[0]) * scaleX
    const transformY = (y: number) => height - (y - yRange[0]) * scaleY

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "#888"
    ctx.lineWidth = 1

    // X-axis
    if (yRange[0] <= 0 && yRange[1] >= 0) {
      const y0 = transformY(0)
      ctx.moveTo(0, y0)
      ctx.lineTo(width, y0)
    }

    // Y-axis
    if (xRange[0] <= 0 && xRange[1] >= 0) {
      const x0 = transformX(0)
      ctx.moveTo(x0, 0)
      ctx.lineTo(x0, height)
    }

    ctx.stroke()

    // Draw grid
    ctx.beginPath()
    ctx.strokeStyle = "#ddd"
    ctx.setLineDash([2, 2])

    // Vertical grid lines
    for (let x = Math.ceil(xRange[0]); x <= Math.floor(xRange[1]); x++) {
      if (x === 0) continue // Skip axis
      const xPos = transformX(x)
      ctx.moveTo(xPos, 0)
      ctx.lineTo(xPos, height)
    }

    // Horizontal grid lines
    for (let y = Math.ceil(yRange[0]); y <= Math.floor(yRange[1]); y++) {
      if (y === 0) continue // Skip axis
      const yPos = transformY(y)
      ctx.moveTo(0, yPos)
      ctx.lineTo(width, yPos)
    }

    ctx.stroke()
    ctx.setLineDash([])

    try {
      // Replace 'a' in the function with its actual value
      const processedFunc = functionText.replace(/a/g, a.toString())

      // Parse the function to check validity
      parse(processedFunc)
      setError(null)

      // Draw the function
      ctx.beginPath()
      ctx.strokeStyle = "#3b82f6" // Blue
      ctx.lineWidth = 2

      let isFirstPoint = true
      const step = (xRange[1] - xRange[0]) / width

      for (let xPixel = 0; xPixel < width; xPixel++) {
        const x = xRange[0] + (xPixel / width) * (xRange[1] - xRange[0])
        const y = evaluateSafe(processedFunc, x)

        if (isNaN(y)) continue

        const xPos = transformX(x)
        const yPos = transformY(y)

        if (isFirstPoint) {
          ctx.moveTo(xPos, yPos)
          isFirstPoint = false
        } else {
          ctx.lineTo(xPos, yPos)
        }
      }

      ctx.stroke()

      // Find and draw key points
      const keyPoints = findKeyPoints(processedFunc, xRange[0], xRange[1], step * 5)

      // Draw roots
      ctx.fillStyle = "#22c55e" // Green
      keyPoints.roots.forEach((x) => {
        const y = evaluateSafe(processedFunc, x)
        ctx.beginPath()
        ctx.arc(transformX(x), transformY(y), 5, 0, 2 * Math.PI)
        ctx.fill()
      })

      // Draw maxima
      ctx.fillStyle = "#ef4444" // Red
      keyPoints.maxima.forEach((x) => {
        const y = evaluateSafe(processedFunc, x)
        ctx.beginPath()
        ctx.arc(transformX(x), transformY(y), 5, 0, 2 * Math.PI)
        ctx.fill()
      })

      // Draw minima
      ctx.fillStyle = "#f97316" // Orange
      keyPoints.minima.forEach((x) => {
        const y = evaluateSafe(processedFunc, x)
        ctx.beginPath()
        ctx.arc(transformX(x), transformY(y), 5, 0, 2 * Math.PI)
        ctx.fill()
      })

      // Draw inflection points
      ctx.fillStyle = "#a855f7" // Purple
      keyPoints.inflection.forEach((x) => {
        const y = evaluateSafe(processedFunc, x)
        ctx.beginPath()
        ctx.arc(transformX(x), transformY(y), 5, 0, 2 * Math.PI)
        ctx.fill()
      })

      // Draw derivative if enabled
      if (showDerivativeState) {
        try {
          const df = derivative(processedFunc, "x").toString()

          ctx.beginPath()
          ctx.strokeStyle = "#f97316" // Orange
          ctx.lineWidth = 2

          isFirstPoint = true

          for (let xPixel = 0; xPixel < width; xPixel++) {
            const x = xRange[0] + (xPixel / width) * (xRange[1] - xRange[0])
            const y = evaluateSafe(df, x)

            if (isNaN(y)) continue

            const xPos = transformX(x)
            const yPos = transformY(y)

            if (isFirstPoint) {
              ctx.moveTo(xPos, yPos)
              isFirstPoint = false
            } else {
              ctx.lineTo(xPos, yPos)
            }
          }

          ctx.stroke()
        } catch (e) {
          // Silently fail if derivative calculation fails
        }
      }

      // Draw tangent line if enabled
      if (showTangent) {
        try {
          const x0 = tangentPoint
          const y0 = evaluateSafe(processedFunc, x0)
          const df = derivative(processedFunc, "x").toString()
          const slope = evaluateSafe(df, x0)

          // Tangent line equation: y - y0 = m(x - x0) => y = m(x - x0) + y0
          const tangentFunc = `${slope} * (x - ${x0}) + ${y0}`

          ctx.beginPath()
          ctx.strokeStyle = "#a855f7" // Purple
          ctx.lineWidth = 2

          const x1 = Math.max(xRange[0], x0 - 5)
          const x2 = Math.min(xRange[1], x0 + 5)

          const y1 = evaluateSafe(tangentFunc, x1)
          const y2 = evaluateSafe(tangentFunc, x2)

          ctx.moveTo(transformX(x1), transformY(y1))
          ctx.lineTo(transformX(x2), transformY(y2))

          ctx.stroke()

          // Draw the point of tangency
          ctx.fillStyle = "#a855f7"
          ctx.beginPath()
          ctx.arc(transformX(x0), transformY(y0), 5, 0, 2 * Math.PI)
          ctx.fill()
        } catch (e) {
          // Silently fail if tangent calculation fails
        }
      }

      // Draw integral if enabled
      if (showIntegralState) {
        try {
          const [a, b] = integralBounds

          // Fill the area under the curve
          ctx.beginPath()
          ctx.fillStyle = "rgba(59, 130, 246, 0.3)" // Transparent blue

          // Start at the left bound
          ctx.moveTo(transformX(a), transformY(0))

          // Draw the curve
          for (let x = a; x <= b; x += (b - a) / 100) {
            const y = evaluateSafe(processedFunc, x)
            ctx.lineTo(transformX(x), transformY(y))
          }

          // Complete the path
          ctx.lineTo(transformX(b), transformY(0))
          ctx.closePath()
          ctx.fill()

          // Draw the bounds
          ctx.strokeStyle = "#3b82f6"
          ctx.lineWidth = 2
          ctx.setLineDash([5, 3])

          // Left bound
          ctx.beginPath()
          ctx.moveTo(transformX(a), transformY(0))
          ctx.lineTo(transformX(a), transformY(evaluateSafe(processedFunc, a)))
          ctx.stroke()

          // Right bound
          ctx.beginPath()
          ctx.moveTo(transformX(b), transformY(0))
          ctx.lineTo(transformX(b), transformY(evaluateSafe(processedFunc, b)))
          ctx.stroke()

          ctx.setLineDash([])
        } catch (e) {
          // Silently fail if integral calculation fails
        }
      }

      // Set text color based on theme
      ctx.fillStyle = theme === "dark" ? "#ffffff" : "#000000"

      // Add labels for axes
      ctx.font = "12px Arial"

      // X-axis labels
      for (let x = Math.ceil(xRange[0]); x <= Math.floor(xRange[1]); x++) {
        if (x === 0) continue // Skip origin
        const xPos = transformX(x)
        ctx.fillText(x.toString(), xPos - 5, transformY(0) + 15)
      }

      // Y-axis labels
      for (let y = Math.ceil(yRange[0]); y <= Math.floor(yRange[1]); y++) {
        if (y === 0) continue // Skip origin
        const yPos = transformY(y)
        ctx.fillText(y.toString(), transformX(0) + 5, yPos + 5)
      }

      // Origin label
      if (xRange[0] <= 0 && xRange[1] >= 0 && yRange[0] <= 0 && yRange[1] >= 0) {
        ctx.fillText("0", transformX(0) - 15, transformY(0) + 15)
      }
    } catch (e) {
      setError("Invalid function expression")
    }
  }

  // Download the graph as an image
  const downloadGraph = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = "math-visualization.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  // Handle function change
  const handleFunctionChange = (value: string) => {
    setFunctionText(value)
    if (onFunctionChange) {
      onFunctionChange(value)
    }
  }

  // Redraw the graph when parameters change
  useEffect(() => {
    drawGraph()
  }, [
    functionText,
    xRange,
    yRange,
    a,
    showTangent,
    tangentPoint,
    showIntegralState,
    integralBounds,
    showDerivativeState,
    theme,
  ])

  // Initialize states based on props
  useEffect(() => {
    setFunctionText(defaultFunction)
    setShowDerivative(showDerivative)
    setShowIntegral(showIntegral)
  }, [defaultFunction, showDerivative, showIntegral])

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="function-input">Function f(x, y)</Label>
              <div className="flex gap-2">
                <Input
                  id="function-input"
                  value={functionText}
                  onChange={(e) => handleFunctionChange(e.target.value)}
                  placeholder="e.g., x^2, sin(x), log(x), a*x^2, x^2 + y^2"
                />
                <Button variant="outline" size="icon" onClick={downloadGraph}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="aspect-video relative border rounded-md overflow-hidden">
            <canvas ref={canvasRef} width={800} height={450} className="w-full h-full" />
          </div>

          <Tabs defaultValue="parameters">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="parameters">Parameters</TabsTrigger>
              <TabsTrigger value="derivatives">Derivatives</TabsTrigger>
              <TabsTrigger value="integrals">Integrals</TabsTrigger>
            </TabsList>

            <TabsContent value="parameters" className="space-y-4">
              <div>
                <Label>Parameter a: {a}</Label>
                <Slider value={[a]} min={-5} max={5} step={0.1} onValueChange={(value) => setA(value[0])} />
              </div>

              <div>
                <Label>
                  X Range: [{xRange[0]}, {xRange[1]}]
                </Label>
                <Slider
                  value={xRange}
                  min={-20}
                  max={20}
                  step={1}
                  onValueChange={(value) => setXRange(value as [number, number])}
                />
              </div>

              <div>
                <Label>
                  Y Range: [{yRange[0]}, {yRange[1]}]
                </Label>
                <Slider
                  value={yRange}
                  min={-20}
                  max={20}
                  step={1}
                  onValueChange={(value) => setYRange(value as [number, number])}
                />
              </div>
            </TabsContent>

            <TabsContent value="derivatives" className="space-y-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant={showDerivativeState ? "default" : "outline"}
                  onClick={() => setShowDerivative(!showDerivativeState)}
                >
                  {showDerivativeState ? "Hide Derivative" : "Show Derivative"}
                </Button>
              </div>

              <div>
                <Label>Show Tangent Line</Label>
                <div className="flex items-center space-x-2">
                  <Button variant={showTangent ? "default" : "outline"} onClick={() => setShowTangent(!showTangent)}>
                    {showTangent ? "Hide Tangent" : "Show Tangent"}
                  </Button>
                </div>
              </div>

              {showTangent && (
                <div>
                  <Label>Tangent Point: x = {tangentPoint}</Label>
                  <Slider
                    value={[tangentPoint]}
                    min={xRange[0]}
                    max={xRange[1]}
                    step={0.1}
                    onValueChange={(value) => setTangentPoint(value[0])}
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="integrals" className="space-y-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant={showIntegralState ? "default" : "outline"}
                  onClick={() => setShowIntegral(!showIntegralState)}
                >
                  {showIntegralState ? "Hide Integral" : "Show Integral"}
                </Button>
              </div>

              {showIntegralState && (
                <div>
                  <Label>
                    Integration Bounds: [{integralBounds[0]}, {integralBounds[1]}]
                  </Label>
                  <Slider
                    value={integralBounds}
                    min={xRange[0]}
                    max={xRange[1]}
                    step={0.1}
                    onValueChange={(value) => setIntegralBounds(value as [number, number])}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}
