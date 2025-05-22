"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Download, RotateCcw } from "lucide-react"
import { multiply, det, matrix } from "mathjs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MatrixTransformerProps {
  defaultMatrix?: number[][]
}

export function MatrixTransformer({
  defaultMatrix = [
    [1, 0],
    [0, 1],
  ],
}: MatrixTransformerProps) {
  const [matrixSize, setMatrixSize] = useState<"2x2" | "3x3">("2x2")
  const [matrix2x2, setMatrix2x2] = useState<number[][]>(defaultMatrix)
  const [matrix3x3, setMatrix3x3] = useState<number[][]>([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ])
  const [error, setError] = useState<string | null>(null)
  const [shape, setShape] = useState<"square" | "triangle" | "grid" | "cube">("square")
  const [matrixInfo, setMatrixInfo] = useState<{
    determinant: number
    invertible: boolean
    eigenvalues?: number[]
    type: string
  }>({ determinant: 1, invertible: true, type: "Identity" })
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Update a single matrix element
  const updateMatrix = (row: number, col: number, value: string) => {
    const numValue = Number.parseFloat(value) || 0
    if (matrixSize === "2x2") {
      const newMatrix = [...matrix2x2]
      newMatrix[row][col] = numValue
      setMatrix2x2(newMatrix)
    } else {
      const newMatrix = [...matrix3x3]
      newMatrix[row][col] = numValue
      setMatrix3x3(newMatrix)
    }
  }

  // Reset matrix to identity
  const resetMatrix = () => {
    if (matrixSize === "2x2") {
      setMatrix2x2([
        [1, 0],
        [0, 1],
      ])
    } else {
      setMatrix3x3([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ])
    }
  }

  // Apply common transformations
  const applyTransformation = (type: string) => {
    if (matrixSize === "2x2") {
      switch (type) {
        case "rotate90":
          setMatrix2x2([
            [0, -1],
            [1, 0],
          ])
          break
        case "scale2":
          setMatrix2x2([
            [2, 0],
            [0, 2],
          ])
          break
        case "reflect":
          setMatrix2x2([
            [1, 0],
            [0, -1],
          ])
          break
        case "shear":
          setMatrix2x2([
            [1, 1],
            [0, 1],
          ])
          break
        default:
          break
      }
    } else {
      switch (type) {
        case "rotate90x":
          setMatrix3x3([
            [1, 0, 0],
            [0, 0, -1],
            [0, 1, 0],
          ])
          break
        case "rotate90y":
          setMatrix3x3([
            [0, 0, 1],
            [0, 1, 0],
            [-1, 0, 0],
          ])
          break
        case "rotate90z":
          setMatrix3x3([
            [0, -1, 0],
            [1, 0, 0],
            [0, 0, 1],
          ])
          break
        case "scale2":
          setMatrix3x3([
            [2, 0, 0],
            [0, 2, 0],
            [0, 0, 2],
          ])
          break
        case "reflectxy":
          setMatrix3x3([
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, -1],
          ])
          break
        case "shear":
          setMatrix3x3([
            [1, 1, 0],
            [0, 1, 0],
            [0, 0, 1],
          ])
          break
        default:
          break
      }
    }
  }

  // Calculate matrix properties
  const calculateMatrixProperties = () => {
    try {
      const currentMatrix = matrixSize === "2x2" ? matrix2x2 : matrix3x3
      const determinant = det(currentMatrix)
      const invertible = Math.abs(determinant) > 1e-10

      // Determine matrix type
      let type = "General"
      const m = matrix(currentMatrix)

      // Check if identity
      if (matrixSize === "2x2") {
        if (
          currentMatrix[0][0] === 1 &&
          currentMatrix[0][1] === 0 &&
          currentMatrix[1][0] === 0 &&
          currentMatrix[1][1] === 1
        ) {
          type = "Identity"
        }
        // Check if rotation
        else if (
          Math.abs(determinant - 1) < 1e-10 &&
          Math.abs(currentMatrix[0][0] - currentMatrix[1][1]) < 1e-10 &&
          Math.abs(currentMatrix[0][1] + currentMatrix[1][0]) < 1e-10
        ) {
          type = "Rotation"
        }
        // Check if scaling
        else if (currentMatrix[0][1] === 0 && currentMatrix[1][0] === 0) {
          type = "Scaling"
        }
        // Check if reflection
        else if (Math.abs(determinant + 1) < 1e-10) {
          type = "Reflection"
        }
        // Check if shear
        else if (
          (currentMatrix[0][1] !== 0 && currentMatrix[1][0] === 0) ||
          (currentMatrix[0][1] === 0 && currentMatrix[1][0] !== 0)
        ) {
          type = "Shear"
        }
      } else {
        // 3x3 matrix type checks
        if (
          currentMatrix[0][0] === 1 &&
          currentMatrix[0][1] === 0 &&
          currentMatrix[0][2] === 0 &&
          currentMatrix[1][0] === 0 &&
          currentMatrix[1][1] === 1 &&
          currentMatrix[1][2] === 0 &&
          currentMatrix[2][0] === 0 &&
          currentMatrix[2][1] === 0 &&
          currentMatrix[2][2] === 1
        ) {
          type = "Identity"
        }
        // Other types would require more complex checks
      }

      setMatrixInfo({
        determinant,
        invertible,
        type,
      })
    } catch (e) {
      setError("Error calculating matrix properties")
    }
  }

  // Draw the transformation visualization
  const drawTransformation = () => {
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

    // Draw original shape
    let originalPoints: number[][] = []

    switch (shape) {
      case "square":
        originalPoints = [
          [-1, -1],
          [1, -1],
          [1, 1],
          [-1, 1],
        ]
        break
      case "triangle":
        originalPoints = [
          [0, -1],
          [1, 1],
          [-1, 1],
        ]
        break
      case "grid":
        originalPoints = []
        for (let x = -2; x <= 2; x += 0.5) {
          for (let y = -2; y <= 2; y += 0.5) {
            originalPoints.push([x, y])
          }
        }
        break
      case "cube":
        if (matrixSize === "3x3") {
          // 3D cube vertices (for 3x3 matrix)
          originalPoints = [
            [-1, -1, -1],
            [1, -1, -1],
            [1, 1, -1],
            [-1, 1, -1],
            [-1, -1, 1],
            [1, -1, 1],
            [1, 1, 1],
            [-1, 1, 1],
          ]
        } else {
          // Fallback to square for 2x2 matrix
          originalPoints = [
            [-1, -1],
            [1, -1],
            [1, 1],
            [-1, 1],
          ]
        }
        break
    }

    // Draw original shape
    ctx.beginPath()
    ctx.strokeStyle = "#3b82f6" // Blue
    ctx.lineWidth = 2

    if (shape === "grid") {
      // Draw points for grid
      originalPoints.forEach(([x, y]) => {
        ctx.beginPath()
        ctx.fillStyle = "#3b82f6"
        ctx.arc(centerX + x * scale, centerY - y * scale, 2, 0, 2 * Math.PI)
        ctx.fill()
      })
    } else if (shape === "cube" && matrixSize === "3x3") {
      // Draw 3D cube with perspective projection
      const edges = [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0], // bottom face
        [4, 5],
        [5, 6],
        [6, 7],
        [7, 4], // top face
        [0, 4],
        [1, 5],
        [2, 6],
        [3, 7], // connecting edges
      ]

      // Simple perspective projection
      const project = (point: number[]) => {
        const z = point[2]
        const factor = 5 / (5 + z) // perspective factor
        return [point[0] * factor, point[1] * factor]
      }

      edges.forEach(([i, j]) => {
        const [x1, y1] = project([originalPoints[i][0], originalPoints[i][1], originalPoints[i][2]])
        const [x2, y2] = project([originalPoints[j][0], originalPoints[j][1], originalPoints[j][2]])

        ctx.beginPath()
        ctx.moveTo(centerX + x1 * scale, centerY - y1 * scale)
        ctx.lineTo(centerX + x2 * scale, centerY - y2 * scale)
        ctx.stroke()
      })
    } else {
      // Draw lines for shapes
      originalPoints.forEach(([x, y], i) => {
        const xPos = centerX + x * scale
        const yPos = centerY - y * scale // Flip y-axis to match mathematical convention

        if (i === 0) {
          ctx.moveTo(xPos, yPos)
        } else {
          ctx.lineTo(xPos, yPos)
        }
      })

      // Close the shape
      if (shape !== "grid") {
        ctx.closePath()
      }

      ctx.stroke()
    }

    try {
      // Transform each point using the matrix
      let transformedPoints

      if (matrixSize === "2x2") {
        transformedPoints = originalPoints.map((point) => {
          // For 2x2 matrix, we only use x and y
          const [x, y] = point.slice(0, 2)
          // Use the actual matrix values
          const result = [matrix2x2[0][0] * x + matrix2x2[0][1] * y, matrix2x2[1][0] * x + matrix2x2[1][1] * y]
          return result
        })
      } else {
        transformedPoints = originalPoints.map((point) => {
          // For 3x3 matrix
          let [x, y, z] = point
          if (point.length === 2) {
            z = 0 // Add z=0 for 2D points
          }
          // Use the actual matrix values
          const result = [
            matrix3x3[0][0] * x + matrix3x3[0][1] * y + matrix3x3[0][2] * z,
            matrix3x3[1][0] * x + matrix3x3[1][1] * y + matrix3x3[1][2] * z,
            matrix3x3[2][0] * x + matrix3x3[2][1] * y + matrix3x3[2][2] * z,
          ]
          return result
        })
      }

      // Draw transformed shape
      ctx.beginPath()
      ctx.strokeStyle = "#f97316" // Orange
      ctx.lineWidth = 2

      if (shape === "grid") {
        // Draw points for grid
        transformedPoints.forEach(([x, y]) => {
          ctx.beginPath()
          ctx.fillStyle = "#f97316"
          ctx.arc(centerX + x * scale, centerY - y * scale, 2, 0, 2 * Math.PI)
          ctx.fill()
        })
      } else if (shape === "cube" && matrixSize === "3x3") {
        // Draw transformed 3D cube
        const edges = [
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 0], // bottom face
          [4, 5],
          [5, 6],
          [6, 7],
          [7, 4], // top face
          [0, 4],
          [1, 5],
          [2, 6],
          [3, 7], // connecting edges
        ]

        // Simple perspective projection
        const project = (point: number[]) => {
          const z = point[2]
          const factor = 5 / (5 + z) // perspective factor
          return [point[0] * factor, point[1] * factor]
        }

        edges.forEach(([i, j]) => {
          const [x1, y1] = project([transformedPoints[i][0], transformedPoints[i][1], transformedPoints[i][2]])
          const [x2, y2] = project([transformedPoints[j][0], transformedPoints[j][1], transformedPoints[j][2]])

          ctx.beginPath()
          ctx.moveTo(centerX + x1 * scale, centerY - y1 * scale)
          ctx.lineTo(centerX + x2 * scale, centerY - y2 * scale)
          ctx.stroke()
        })
      } else {
        // Draw lines for shapes
        transformedPoints.forEach(([x, y], i) => {
          const xPos = centerX + x * scale
          const yPos = centerY - y * scale // Flip y-axis to match mathematical convention

          if (i === 0) {
            ctx.moveTo(xPos, yPos)
          } else {
            ctx.lineTo(xPos, yPos)
          }
        })

        // Close the shape
        if (shape !== "grid") {
          ctx.closePath()
        }

        ctx.stroke()
      }

      // Draw basis vectors
      // Original basis vectors
      ctx.beginPath()
      ctx.strokeStyle = "#22c55e" // Green
      ctx.lineWidth = 2
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(centerX + scale, centerY)
      ctx.stroke()

      ctx.beginPath()
      ctx.strokeStyle = "#22c55e" // Green
      ctx.lineWidth = 2
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(centerX, centerY - scale)
      ctx.stroke()

      if (matrixSize === "3x3") {
        // Draw z-axis for 3D
        ctx.beginPath()
        ctx.strokeStyle = "#22c55e" // Green
        ctx.lineWidth = 2
        ctx.setLineDash([2, 2])
        ctx.moveTo(centerX, centerY)
        // Project z-axis with perspective
        const z = 1
        const factor = 5 / (5 + z)
        ctx.lineTo(centerX + 0.3 * scale, centerY - 0.3 * scale)
        ctx.stroke()
        ctx.setLineDash([])
      }

      // Transformed basis vectors
      if (matrixSize === "2x2") {
        const transformedI = multiply(matrix2x2, [[1], [0]])
        const transformedJ = multiply(matrix2x2, [[0], [1]])

        ctx.beginPath()
        ctx.strokeStyle = "#ef4444" // Red
        ctx.lineWidth = 2
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(centerX + transformedI[0][0] * scale, centerY - transformedI[1][0] * scale)
        ctx.stroke()

        ctx.beginPath()
        ctx.strokeStyle = "#ef4444" // Red
        ctx.lineWidth = 2
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(centerX + transformedJ[0][0] * scale, centerY - transformedJ[1][0] * scale)
        ctx.stroke()
      } else {
        const transformedI = multiply(matrix3x3, [[1], [0], [0]])
        const transformedJ = multiply(matrix3x3, [[0], [1], [0]])
        const transformedK = multiply(matrix3x3, [[0], [0], [1]])

        ctx.beginPath()
        ctx.strokeStyle = "#ef4444" // Red
        ctx.lineWidth = 2
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(centerX + transformedI[0][0] * scale, centerY - transformedI[1][0] * scale)
        ctx.stroke()

        ctx.beginPath()
        ctx.strokeStyle = "#ef4444" // Red
        ctx.lineWidth = 2
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(centerX + transformedJ[0][0] * scale, centerY - transformedJ[1][0] * scale)
        ctx.stroke()

        // Draw transformed z-axis
        ctx.beginPath()
        ctx.strokeStyle = "#ef4444" // Red
        ctx.lineWidth = 2
        ctx.setLineDash([2, 2])
        ctx.moveTo(centerX, centerY)
        // Project transformed z-axis with perspective
        const z = transformedK[2][0]
        const factor = 5 / (5 + z)
        ctx.lineTo(centerX + transformedK[0][0] * scale * factor, centerY - transformedK[1][0] * scale * factor)
        ctx.stroke()
        ctx.setLineDash([])
      }

      setError(null)
    } catch (e) {
      setError("Invalid matrix transformation")
    }
  }

  // Download the visualization as an image
  const downloadVisualization = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = "matrix-transformation.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  // Update matrix size
  const handleMatrixSizeChange = (size: string) => {
    setMatrixSize(size as "2x2" | "3x3")
    if (size === "2x2" && shape === "cube") {
      setShape("square")
    }
  }

  // Calculate matrix properties and redraw when parameters change
  useEffect(() => {
    calculateMatrixProperties()
    drawTransformation()
  }, [matrix2x2, matrix3x3, shape, matrixSize])

  // Render matrix inputs based on size
  const renderMatrixInputs = () => {
    if (matrixSize === "2x2") {
      return (
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Input
            value={matrix2x2[0][0]}
            onChange={(e) => updateMatrix(0, 0, e.target.value)}
            type="number"
            step="0.1"
          />
          <Input
            value={matrix2x2[0][1]}
            onChange={(e) => updateMatrix(0, 1, e.target.value)}
            type="number"
            step="0.1"
          />
          <Input
            value={matrix2x2[1][0]}
            onChange={(e) => updateMatrix(1, 0, e.target.value)}
            type="number"
            step="0.1"
          />
          <Input
            value={matrix2x2[1][1]}
            onChange={(e) => updateMatrix(1, 1, e.target.value)}
            type="number"
            step="0.1"
          />
        </div>
      )
    } else {
      return (
        <div className="grid grid-cols-3 gap-2 mt-2">
          <Input
            value={matrix3x3[0][0]}
            onChange={(e) => updateMatrix(0, 0, e.target.value)}
            type="number"
            step="0.1"
          />
          <Input
            value={matrix3x3[0][1]}
            onChange={(e) => updateMatrix(0, 1, e.target.value)}
            type="number"
            step="0.1"
          />
          <Input
            value={matrix3x3[0][2]}
            onChange={(e) => updateMatrix(0, 2, e.target.value)}
            type="number"
            step="0.1"
          />
          <Input
            value={matrix3x3[1][0]}
            onChange={(e) => updateMatrix(1, 0, e.target.value)}
            type="number"
            step="0.1"
          />
          <Input
            value={matrix3x3[1][1]}
            onChange={(e) => updateMatrix(1, 1, e.target.value)}
            type="number"
            step="0.1"
          />
          <Input
            value={matrix3x3[1][2]}
            onChange={(e) => updateMatrix(1, 2, e.target.value)}
            type="number"
            step="0.1"
          />
          <Input
            value={matrix3x3[2][0]}
            onChange={(e) => updateMatrix(2, 0, e.target.value)}
            type="number"
            step="0.1"
          />
          <Input
            value={matrix3x3[2][1]}
            onChange={(e) => updateMatrix(2, 1, e.target.value)}
            type="number"
            step="0.1"
          />
          <Input
            value={matrix3x3[2][2]}
            onChange={(e) => updateMatrix(2, 2, e.target.value)}
            type="number"
            step="0.1"
          />
        </div>
      )
    }
  }

  // Render transformation buttons based on matrix size
  const renderTransformationButtons = () => {
    if (matrixSize === "2x2") {
      return (
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => applyTransformation("rotate90")}>
            Rotate 90°
          </Button>
          <Button variant="outline" onClick={() => applyTransformation("scale2")}>
            Scale 2x
          </Button>
          <Button variant="outline" onClick={() => applyTransformation("reflect")}>
            Reflect Y
          </Button>
          <Button variant="outline" onClick={() => applyTransformation("shear")}>
            Shear X
          </Button>
        </div>
      )
    } else {
      return (
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => applyTransformation("rotate90x")}>
            Rotate 90° (X)
          </Button>
          <Button variant="outline" onClick={() => applyTransformation("rotate90y")}>
            Rotate 90° (Y)
          </Button>
          <Button variant="outline" onClick={() => applyTransformation("rotate90z")}>
            Rotate 90° (Z)
          </Button>
          <Button variant="outline" onClick={() => applyTransformation("scale2")}>
            Scale 2x
          </Button>
          <Button variant="outline" onClick={() => applyTransformation("reflectxy")}>
            Reflect XY
          </Button>
          <Button variant="outline" onClick={() => applyTransformation("shear")}>
            Shear X
          </Button>
        </div>
      )
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <Label>Transformation Matrix</Label>
                <Select value={matrixSize} onValueChange={handleMatrixSizeChange}>
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2x2">2×2</SelectItem>
                    <SelectItem value="3x3">3×3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {renderMatrixInputs()}
            </div>

            <div className="flex-1 space-y-2">
              <Label>Common Transformations</Label>
              {renderTransformationButtons()}
              <div className="flex justify-between">
                <Button variant="outline" onClick={resetMatrix} className="w-full">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button variant="outline" onClick={downloadVisualization} className="w-full ml-2">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-md bg-muted">
            <h3 className="font-medium mb-2">Matrix Properties</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Determinant: {matrixInfo.determinant.toFixed(2)}</div>
              <div>Invertible: {matrixInfo.invertible ? "Yes" : "No"}</div>
              <div>Type: {matrixInfo.type}</div>
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

          <Tabs defaultValue="shape">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="shape">Shape</TabsTrigger>
            </TabsList>

            <TabsContent value="shape" className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button variant={shape === "square" ? "default" : "outline"} onClick={() => setShape("square")}>
                  Square
                </Button>
                <Button variant={shape === "triangle" ? "default" : "outline"} onClick={() => setShape("triangle")}>
                  Triangle
                </Button>
                <Button variant={shape === "grid" ? "default" : "outline"} onClick={() => setShape("grid")}>
                  Grid
                </Button>
                {matrixSize === "3x3" && (
                  <Button variant={shape === "cube" ? "default" : "outline"} onClick={() => setShape("cube")}>
                    Cube
                  </Button>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}
