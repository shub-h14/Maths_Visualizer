"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Download } from "lucide-react"
import { useTheme } from "next-themes"

interface GeometryVisualizerProps {
  defaultShape?: string
}

export function GeometryVisualizer({ defaultShape = "circle" }: GeometryVisualizerProps) {
  const [shape, setShape] = useState(defaultShape)
  const [parameters, setParameters] = useState<Record<string, number>>({
    // Circle
    circleRadius: 3,
    circleCenterX: 0,
    circleCenterY: 0,

    // Line
    lineSlope: 1,
    lineIntercept: 0,

    // Parabola
    parabolaA: 1,
    parabolaH: 0,
    parabolaK: 0,

    // Ellipse
    ellipseA: 4,
    ellipseB: 2,
    ellipseCenterX: 0,
    ellipseCenterY: 0,

    // Hyperbola
    hyperbolaA: 3,
    hyperbolaB: 2,
    hyperbolaCenterX: 0,
    hyperbolaCenterY: 0,
  })
  const [error, setError] = useState<string | null>(null)
  const [showProperties, setShowProperties] = useState(true)
  const [calculations, setCalculations] = useState<Record<string, string>>({})
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  // Update a parameter
  const updateParameter = (name: string, value: string) => {
    const newParameters = { ...parameters }
    newParameters[name] = Number.parseFloat(value) || 0
    setParameters(newParameters)
  }

  // Calculate shape properties
  const calculateProperties = () => {
    const props: Record<string, string> = {}

    switch (shape) {
      case "circle": {
        const { circleRadius } = parameters
        props["Area"] = (Math.PI * circleRadius * circleRadius).toFixed(2)
        props["Circumference"] = (2 * Math.PI * circleRadius).toFixed(2)
        props["Diameter"] = (2 * circleRadius).toFixed(2)
        break
      }

      case "line": {
        const { lineSlope, lineIntercept } = parameters
        props["Slope"] = lineSlope.toFixed(2)
        props["Y-intercept"] = lineIntercept.toFixed(2)
        props["X-intercept"] = lineIntercept !== 0 ? (-lineIntercept / lineSlope).toFixed(2) : "0"
        props["Angle with x-axis"] = ((Math.atan(lineSlope) * 180) / Math.PI).toFixed(2) + "°"
        break
      }

      case "parabola": {
        const { parabolaA, parabolaH, parabolaK } = parameters
        props["Vertex"] = `(${parabolaH}, ${parabolaK})`
        props["Focus"] = `(${parabolaH}, ${Number((parabolaK + 1 / (4 * parabolaA)).toFixed(3))})`
        props["Directrix"] = `y = ${Number((parabolaK - 1 / (4 * parabolaA)).toFixed(3))}`
        props["Opens"] = parabolaA > 0 ? "Upward" : "Downward"
        props["Axis of Symmetry"] = `x = ${parabolaH}`
        break
      }

      case "ellipse": {
        const { ellipseA, ellipseB, ellipseCenterX, ellipseCenterY } = parameters
        const a = Math.max(ellipseA, ellipseB)
        const b = Math.min(ellipseA, ellipseB)
        const c = Math.sqrt(a * a - b * b)

        props["Area"] = (Math.PI * ellipseA * ellipseB).toFixed(2)
        props["Perimeter"] =
          (2 * Math.PI * Math.sqrt((ellipseA * ellipseA + ellipseB * ellipseB) / 2)).toFixed(2) + " (approx)"
        props["Semi-major axis"] = a.toFixed(2)
        props["Semi-minor axis"] = b.toFixed(2)
        props["Eccentricity"] = (c / a).toFixed(4)
        props["Foci"] =
          ellipseA >= ellipseB
            ? `(${(ellipseCenterX - c).toFixed(2)}, ${ellipseCenterY}), (${(ellipseCenterX + c).toFixed(2)}, ${ellipseCenterY})`
            : `(${ellipseCenterX}, ${(ellipseCenterY - c).toFixed(2)}), (${ellipseCenterX}, ${(ellipseCenterY + c).toFixed(2)})`
        break
      }

      case "hyperbola": {
        const { hyperbolaA, hyperbolaB, hyperbolaCenterX, hyperbolaCenterY } = parameters
        const c = Math.sqrt(hyperbolaA * hyperbolaA + hyperbolaB * hyperbolaB)

        props["Transverse axis"] = (2 * hyperbolaA).toFixed(2)
        props["Conjugate axis"] = (2 * hyperbolaB).toFixed(2)
        props["Eccentricity"] = (c / hyperbolaA).toFixed(4)
        props["Foci"] =
          `(${(hyperbolaCenterX - c).toFixed(2)}, ${hyperbolaCenterY}), (${(hyperbolaCenterX + c).toFixed(2)}, ${hyperbolaCenterY})`
        props["Asymptotes"] =
          `y = ${hyperbolaCenterY.toFixed(2)} ± ${(hyperbolaB / hyperbolaA).toFixed(2)}(x - ${hyperbolaCenterX.toFixed(2)})`
        break
      }
    }

    setCalculations(props)
  }

  // Draw the geometric shape
  const drawShape = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set dimensions
    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const scale = 40 // Scale factor for better visualization

    // Draw grid
    ctx.beginPath()
    ctx.strokeStyle = "#ddd"
    ctx.setLineDash([2, 2])

    // Vertical grid lines
    for (let x = -10; x <= 10; x++) {
      const xPos = centerX + x * scale
      ctx.moveTo(xPos, 0)
      ctx.lineTo(xPos, height)
    }

    // Horizontal grid lines
    for (let y = -10; y <= 10; y++) {
      const yPos = centerY + y * scale
      ctx.moveTo(0, yPos)
      ctx.lineTo(width, yPos)
    }

    ctx.stroke()
    ctx.setLineDash([])

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "#888"
    ctx.lineWidth = 1

    // X-axis
    ctx.moveTo(0, centerY)
    ctx.lineTo(width, centerY)

    // Y-axis
    ctx.moveTo(centerX, 0)
    ctx.lineTo(centerX, height)

    ctx.stroke()

    // Set text color based on theme
    const textColor = theme === "dark" ? "#ffffff" : "#000000"

    try {
      // Draw the selected shape
      ctx.strokeStyle = "#3b82f6" // Blue
      ctx.lineWidth = 2

      switch (shape) {
        case "circle": {
          const { circleRadius, circleCenterX, circleCenterY } = parameters

          ctx.beginPath()
          ctx.arc(
            centerX + circleCenterX * scale,
            centerY - circleCenterY * scale,
            circleRadius * scale,
            0,
            2 * Math.PI,
          )
          ctx.stroke()

          // Draw center point
          ctx.fillStyle = "#ef4444" // Red
          ctx.beginPath()
          ctx.arc(centerX + circleCenterX * scale, centerY - circleCenterY * scale, 4, 0, 2 * Math.PI)
          ctx.fill()

          // Draw radius line
          ctx.beginPath()
          ctx.strokeStyle = "#22c55e" // Green
          ctx.moveTo(centerX + circleCenterX * scale, centerY - circleCenterY * scale)
          ctx.lineTo(centerX + (circleCenterX + circleRadius) * scale, centerY - circleCenterY * scale)
          ctx.stroke()

          // Label properties if enabled
          if (showProperties) {
            ctx.font = "14px Arial"
            ctx.fillStyle = textColor
            ctx.fillText(
              `r = ${circleRadius}`,
              centerX + (circleCenterX + circleRadius / 2) * scale,
              centerY - (circleCenterY - 0.5) * scale,
            )
            ctx.fillText(
              `(${circleCenterX}, ${circleCenterY})`,
              centerX + (circleCenterX + 0.2) * scale,
              centerY - (circleCenterY - 0.2) * scale,
            )
          }
          break
        }

        case "line": {
          const { lineSlope, lineIntercept } = parameters

          // Calculate two points on the line
          const x1 = -10
          const y1 = lineSlope * x1 + lineIntercept
          const x2 = 10
          const y2 = lineSlope * x2 + lineIntercept

          ctx.beginPath()
          ctx.moveTo(centerX + x1 * scale, centerY - y1 * scale)
          ctx.lineTo(centerX + x2 * scale, centerY - y2 * scale)
          ctx.stroke()

          // Label properties if enabled
          if (showProperties) {
            ctx.font = "14px Arial"
            ctx.fillStyle = textColor
            ctx.fillText(`y = ${lineSlope}x + ${lineIntercept}`, centerX + 2 * scale, centerY - 2 * scale)

            // Mark y-intercept
            if (lineIntercept >= -10 && lineIntercept <= 10) {
              ctx.fillStyle = "#ef4444" // Red
              ctx.beginPath()
              ctx.arc(centerX, centerY - lineIntercept * scale, 4, 0, 2 * Math.PI)
              ctx.fill()
            }
          }
          break
        }

        case "parabola": {
          const { parabolaA, parabolaH, parabolaK } = parameters

          ctx.beginPath()

          // Draw the parabola: y = a(x-h)² + k
          for (let x = -10; x <= 10; x += 0.05) {
            const y = parabolaA * Math.pow(x - parabolaH, 2) + parabolaK

            if (y >= -10 && y <= 10) {
              const xPos = centerX + x * scale
              const yPos = centerY - y * scale

              if (x === -10) {
                ctx.moveTo(xPos, yPos)
              } else {
                ctx.lineTo(xPos, yPos)
              }
            }
          }

          ctx.stroke()

          // Draw vertex
          ctx.fillStyle = "#ef4444" // Red
          ctx.beginPath()
          ctx.arc(centerX + parabolaH * scale, centerY - parabolaK * scale, 4, 0, 2 * Math.PI)
          ctx.fill()

          // Draw focus
          const focusY = parabolaK + 1 / (4 * parabolaA)
          ctx.fillStyle = "#22c55e" // Green
          ctx.beginPath()
          ctx.arc(centerX + parabolaH * scale, centerY - focusY * scale, 4, 0, 2 * Math.PI)
          ctx.fill()

          // Draw directrix
          const directrixY = parabolaK - 1 / (4 * parabolaA)
          ctx.beginPath()
          ctx.strokeStyle = "#f97316" // Orange
          ctx.setLineDash([5, 3])
          ctx.moveTo(centerX - 10 * scale, centerY - directrixY * scale)
          ctx.lineTo(centerX + 10 * scale, centerY - directrixY * scale)
          ctx.stroke()
          ctx.setLineDash([])

          // Label properties if enabled
          if (showProperties) {
            ctx.font = "14px Arial"
            ctx.fillStyle = textColor
            ctx.fillText(`y = ${parabolaA}(x-${parabolaH})² + ${parabolaK}`, centerX + 2 * scale, centerY - 2 * scale)
            ctx.fillText(
              `Vertex: (${parabolaH}, ${parabolaK})`,
              centerX + parabolaH * scale + 10,
              centerY - parabolaK * scale - 10,
            )
            ctx.fillText(`Focus`, centerX + parabolaH * scale + 10, centerY - focusY * scale)
            ctx.fillText(`Directrix`, centerX + 8 * scale, centerY - directrixY * scale - 5)
          }
          break
        }

        case "ellipse": {
          const { ellipseA, ellipseB, ellipseCenterX, ellipseCenterY } = parameters

          // Draw the ellipse
          ctx.beginPath()

          // Parametric equation of ellipse
          for (let t = 0; t <= 2 * Math.PI; t += 0.01) {
            const x = ellipseCenterX + ellipseA * Math.cos(t)
            const y = ellipseCenterY + ellipseB * Math.sin(t)

            const xPos = centerX + x * scale
            const yPos = centerY - y * scale

            if (t === 0) {
              ctx.moveTo(xPos, yPos)
            } else {
              ctx.lineTo(xPos, yPos)
            }
          }

          ctx.closePath()
          ctx.stroke()

          // Draw center
          ctx.fillStyle = "#ef4444" // Red
          ctx.beginPath()
          ctx.arc(centerX + ellipseCenterX * scale, centerY - ellipseCenterY * scale, 4, 0, 2 * Math.PI)
          ctx.fill()

          // Draw major and minor axes
          ctx.beginPath()
          ctx.strokeStyle = "#22c55e" // Green

          // Major axis
          if (ellipseA >= ellipseB) {
            ctx.moveTo(centerX + (ellipseCenterX - ellipseA) * scale, centerY - ellipseCenterY * scale)
            ctx.lineTo(centerX + (ellipseCenterX + ellipseA) * scale, centerY - ellipseCenterY * scale)
          } else {
            ctx.moveTo(centerX + ellipseCenterX * scale, centerY - (ellipseCenterY - ellipseB) * scale)
            ctx.lineTo(centerX + ellipseCenterX * scale, centerY - (ellipseCenterY + ellipseB) * scale)
          }

          ctx.stroke()

          // Minor axis
          ctx.beginPath()
          ctx.strokeStyle = "#f97316" // Orange

          if (ellipseA >= ellipseB) {
            ctx.moveTo(centerX + ellipseCenterX * scale, centerY - (ellipseCenterY - ellipseB) * scale)
            ctx.lineTo(centerX + ellipseCenterX * scale, centerY - (ellipseCenterY + ellipseB) * scale)
          } else {
            ctx.moveTo(centerX + (ellipseCenterX - ellipseA) * scale, centerY - ellipseCenterY * scale)
            ctx.lineTo(centerX + (ellipseCenterX + ellipseA) * scale, centerY - ellipseCenterY * scale)
          }

          ctx.stroke()

          // Draw foci
          const a = Math.max(ellipseA, ellipseB)
          const b = Math.min(ellipseA, ellipseB)
          const c = Math.sqrt(a * a - b * b)

          ctx.fillStyle = "#a855f7" // Purple

          if (ellipseA >= ellipseB) {
            // Horizontal ellipse
            ctx.beginPath()
            ctx.arc(centerX + (ellipseCenterX - c) * scale, centerY - ellipseCenterY * scale, 4, 0, 2 * Math.PI)
            ctx.fill()

            ctx.beginPath()
            ctx.arc(centerX + (ellipseCenterX + c) * scale, centerY - ellipseCenterY * scale, 4, 0, 2 * Math.PI)
            ctx.fill()
          } else {
            // Vertical ellipse
            ctx.beginPath()
            ctx.arc(centerX + ellipseCenterX * scale, centerY - (ellipseCenterY - c) * scale, 4, 0, 2 * Math.PI)
            ctx.fill()

            ctx.beginPath()
            ctx.arc(centerX + ellipseCenterX * scale, centerY - (ellipseCenterY + c) * scale, 4, 0, 2 * Math.PI)
            ctx.fill()
          }

          // Label properties if enabled
          if (showProperties) {
            ctx.font = "14px Arial"
            ctx.fillStyle = textColor
            ctx.fillText(
              `Center: (${ellipseCenterX}, ${ellipseCenterY})`,
              centerX + ellipseCenterX * scale + 10,
              centerY - ellipseCenterY * scale - 10,
            )
            ctx.fillText(`a = ${a.toFixed(1)}, b = ${b.toFixed(1)}`, centerX + 2 * scale, centerY - 2 * scale)
            ctx.fillText(
              `Foci`,
              centerX + (ellipseA >= ellipseB ? ellipseCenterX + c : ellipseCenterX) * scale + 10,
              centerY - (ellipseA >= ellipseB ? ellipseCenterY : ellipseCenterY + c) * scale,
            )
          }
          break
        }

        case "hyperbola": {
          const { hyperbolaA, hyperbolaB, hyperbolaCenterX, hyperbolaCenterY } = parameters

          // Draw the hyperbola
          ctx.beginPath()

          // Right branch
          for (let t = -1.5; t <= 1.5; t += 0.01) {
            const x = hyperbolaCenterX + hyperbolaA * Math.cosh(t)
            const y = hyperbolaCenterY + hyperbolaB * Math.sinh(t)

            const xPos = centerX + x * scale
            const yPos = centerY - y * scale

            if (t === -1.5) {
              ctx.moveTo(xPos, yPos)
            } else {
              ctx.lineTo(xPos, yPos)
            }
          }

          ctx.stroke()

          // Left branch
          ctx.beginPath()

          for (let t = -1.5; t <= 1.5; t += 0.01) {
            const x = hyperbolaCenterX - hyperbolaA * Math.cosh(t)
            const y = hyperbolaCenterY - hyperbolaB * Math.sinh(t)

            const xPos = centerX + x * scale
            const yPos = centerY - y * scale

            if (t === -1.5) {
              ctx.moveTo(xPos, yPos)
            } else {
              ctx.lineTo(xPos, yPos)
            }
          }

          ctx.stroke()

          // Draw center
          ctx.fillStyle = "#ef4444" // Red
          ctx.beginPath()
          ctx.arc(centerX + hyperbolaCenterX * scale, centerY - hyperbolaCenterY * scale, 4, 0, 2 * Math.PI)
          ctx.fill()

          // Draw transverse axis
          ctx.beginPath()
          ctx.strokeStyle = "#22c55e" // Green
          ctx.moveTo(centerX + (hyperbolaCenterX - hyperbolaA) * scale, centerY - hyperbolaCenterY * scale)
          ctx.lineTo(centerX + (hyperbolaCenterX + hyperbolaA) * scale, centerY - hyperbolaCenterY * scale)
          ctx.stroke()

          // Draw conjugate axis
          ctx.beginPath()
          ctx.strokeStyle = "#f97316" // Orange
          ctx.moveTo(centerX + hyperbolaCenterX * scale, centerY - (hyperbolaCenterY - hyperbolaB) * scale)
          ctx.lineTo(centerX + hyperbolaCenterX * scale, centerY - (hyperbolaCenterY + hyperbolaB) * scale)
          ctx.stroke()

          // Draw asymptotes
          ctx.beginPath()
          ctx.strokeStyle = "#a855f7" // Purple
          ctx.setLineDash([5, 3])

          // First asymptote
          ctx.moveTo(
            centerX + (hyperbolaCenterX - 10) * scale,
            centerY - (hyperbolaCenterY - (10 * hyperbolaB) / hyperbolaA) * scale,
          )
          ctx.lineTo(
            centerX + (hyperbolaCenterX + 10) * scale,
            centerY - (hyperbolaCenterY + (10 * hyperbolaB) / hyperbolaA) * scale,
          )

          // Second asymptote
          ctx.moveTo(
            centerX + (hyperbolaCenterX - 10) * scale,
            centerY - (hyperbolaCenterY + (10 * hyperbolaB) / hyperbolaA) * scale,
          )
          ctx.lineTo(
            centerX + (hyperbolaCenterX + 10) * scale,
            centerY - (hyperbolaCenterY - (10 * hyperbolaB) / hyperbolaA) * scale,
          )

          ctx.stroke()
          ctx.setLineDash([])

          // Draw foci
          const c = Math.sqrt(hyperbolaA * hyperbolaA + hyperbolaB * hyperbolaB)

          ctx.fillStyle = "#a855f7" // Purple
          ctx.beginPath()
          ctx.arc(centerX + (hyperbolaCenterX - c) * scale, centerY - hyperbolaCenterY * scale, 4, 0, 2 * Math.PI)
          ctx.fill()

          ctx.beginPath()
          ctx.arc(centerX + (hyperbolaCenterX + c) * scale, centerY - hyperbolaCenterY * scale, 4, 0, 2 * Math.PI)
          ctx.fill()

          // Label properties if enabled
          if (showProperties) {
            ctx.font = "14px Arial"
            ctx.fillStyle = textColor
            ctx.fillText(
              `Center: (${hyperbolaCenterX}, ${hyperbolaCenterY})`,
              centerX + hyperbolaCenterX * scale + 10,
              centerY - hyperbolaCenterY * scale - 10,
            )
            ctx.fillText(
              `a = ${hyperbolaA.toFixed(1)}, b = ${hyperbolaB.toFixed(1)}`,
              centerX + 2 * scale,
              centerY - 2 * scale,
            )
            ctx.fillText(`Foci`, centerX + (hyperbolaCenterX + c) * scale + 10, centerY - hyperbolaCenterY * scale)
            ctx.fillText(
              `Asymptotes`,
              centerX + 8 * scale,
              centerY - (hyperbolaCenterY + (8 * hyperbolaB) / hyperbolaA) * scale - 5,
            )
          }
          break
        }
      }

      setError(null)
    } catch (e) {
      setError("Error drawing shape")
    }
  }

  // Download the visualization as an image
  const downloadVisualization = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = "geometry-visualization.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  // Calculate properties and redraw when parameters change
  useEffect(() => {
    calculateProperties()
    drawShape()
  }, [shape, parameters, showProperties, theme])

  // Render parameter inputs based on selected shape
  const renderParameters = () => {
    switch (shape) {
      case "circle":
        return (
          <>
            <div>
              <Label htmlFor="circleRadius">Radius</Label>
              <Input
                id="circleRadius"
                type="number"
                step="0.1"
                value={parameters.circleRadius}
                onChange={(e) => updateParameter("circleRadius", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="circleCenterX">Center X</Label>
              <Input
                id="circleCenterX"
                type="number"
                step="0.1"
                value={parameters.circleCenterX}
                onChange={(e) => updateParameter("circleCenterX", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="circleCenterY">Center Y</Label>
              <Input
                id="circleCenterY"
                type="number"
                step="0.1"
                value={parameters.circleCenterY}
                onChange={(e) => updateParameter("circleCenterY", e.target.value)}
              />
            </div>
          </>
        )

      case "line":
        return (
          <>
            <div>
              <Label htmlFor="lineSlope">Slope (m)</Label>
              <Input
                id="lineSlope"
                type="number"
                step="0.1"
                value={parameters.lineSlope}
                onChange={(e) => updateParameter("lineSlope", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="lineIntercept">Y-Intercept (b)</Label>
              <Input
                id="lineIntercept"
                type="number"
                step="0.1"
                value={parameters.lineIntercept}
                onChange={(e) => updateParameter("lineIntercept", e.target.value)}
              />
            </div>
          </>
        )

      case "parabola":
        return (
          <>
            <div>
              <Label htmlFor="parabolaA">Coefficient (a)</Label>
              <Input
                id="parabolaA"
                type="number"
                step="0.1"
                value={parameters.parabolaA}
                onChange={(e) => updateParameter("parabolaA", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="parabolaH">Horizontal Shift (h)</Label>
              <Input
                id="parabolaH"
                type="number"
                step="0.1"
                value={parameters.parabolaH}
                onChange={(e) => updateParameter("parabolaH", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="parabolaK">Vertical Shift (k)</Label>
              <Input
                id="parabolaK"
                type="number"
                step="0.1"
                value={parameters.parabolaK}
                onChange={(e) => updateParameter("parabolaK", e.target.value)}
              />
            </div>
          </>
        )

      case "ellipse":
        return (
          <>
            <div>
              <Label htmlFor="ellipseA">Semi-axis a</Label>
              <Input
                id="ellipseA"
                type="number"
                step="0.1"
                min="0.1"
                value={parameters.ellipseA}
                onChange={(e) => updateParameter("ellipseA", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="ellipseB">Semi-axis b</Label>
              <Input
                id="ellipseB"
                type="number"
                step="0.1"
                min="0.1"
                value={parameters.ellipseB}
                onChange={(e) => updateParameter("ellipseB", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="ellipseCenterX">Center X</Label>
              <Input
                id="ellipseCenterX"
                type="number"
                step="0.1"
                value={parameters.ellipseCenterX}
                onChange={(e) => updateParameter("ellipseCenterX", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="ellipseCenterY">Center Y</Label>
              <Input
                id="ellipseCenterY"
                type="number"
                step="0.1"
                value={parameters.ellipseCenterY}
                onChange={(e) => updateParameter("ellipseCenterY", e.target.value)}
              />
            </div>
          </>
        )

      case "hyperbola":
        return (
          <>
            <div>
              <Label htmlFor="hyperbolaA">Semi-axis a</Label>
              <Input
                id="hyperbolaA"
                type="number"
                step="0.1"
                min="0.1"
                value={parameters.hyperbolaA}
                onChange={(e) => updateParameter("hyperbolaA", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="hyperbolaB">Semi-axis b</Label>
              <Input
                id="hyperbolaB"
                type="number"
                step="0.1"
                min="0.1"
                value={parameters.hyperbolaB}
                onChange={(e) => updateParameter("hyperbolaB", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="hyperbolaCenterX">Center X</Label>
              <Input
                id="hyperbolaCenterX"
                type="number"
                step="0.1"
                value={parameters.hyperbolaCenterX}
                onChange={(e) => updateParameter("hyperbolaCenterX", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="hyperbolaCenterY">Center Y</Label>
              <Input
                id="hyperbolaCenterY"
                type="number"
                step="0.1"
                value={parameters.hyperbolaCenterY}
                onChange={(e) => updateParameter("hyperbolaCenterY", e.target.value)}
              />
            </div>
          </>
        )

      default:
        return null
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label>
                Shape Type: <span className="font-bold">{shape.charAt(0).toUpperCase() + shape.slice(1)}</span>
              </Label>
              <div className="flex flex-wrap gap-2 mt-2">
                <Button variant={shape === "circle" ? "default" : "outline"} onClick={() => setShape("circle")}>
                  Circle
                </Button>
                <Button variant={shape === "line" ? "default" : "outline"} onClick={() => setShape("line")}>
                  Line
                </Button>
                <Button variant={shape === "parabola" ? "default" : "outline"} onClick={() => setShape("parabola")}>
                  Parabola
                </Button>
                <Button variant={shape === "ellipse" ? "default" : "outline"} onClick={() => setShape("ellipse")}>
                  Ellipse
                </Button>
                <Button variant={shape === "hyperbola" ? "default" : "outline"} onClick={() => setShape("hyperbola")}>
                  Hyperbola
                </Button>
              </div>
            </div>

            <div className="flex-1 flex items-end">
              <div className="flex gap-2 w-full">
                <Button
                  variant={showProperties ? "default" : "outline"}
                  onClick={() => setShowProperties(!showProperties)}
                  className="flex-1"
                >
                  {showProperties ? "Hide Properties" : "Show Properties"}
                </Button>
                <Button variant="outline" onClick={downloadVisualization} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Tabs defaultValue="parameters">
                <TabsList className="grid w-full grid-cols-1">
                  <TabsTrigger value="parameters">Parameters</TabsTrigger>
                </TabsList>

                <TabsContent value="parameters" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{renderParameters()}</div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="p-4 border rounded-md bg-muted">
              <h3 className="font-medium mb-4">Shape Properties</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                {Object.entries(calculations).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="font-medium">{key}:</span>
                    <span className="break-words max-w-[150px]">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
