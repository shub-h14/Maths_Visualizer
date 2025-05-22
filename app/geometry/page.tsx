import { GeometryVisualizer } from "@/components/geometry-visualizer"

export default function GeometryPage() {
  return (
    <div className="container mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Geometry Visualizer</h1>
        <p className="text-muted-foreground mb-8">Interact with 2D shapes and curves</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Geometric Shapes</h2>
          <p className="text-muted-foreground mb-4">
            Visualize and explore properties of various geometric shapes and curves. Select a shape type and adjust its
            parameters to see how it changes.
          </p>
          <GeometryVisualizer />
        </div>

        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-4">Geometric Formulas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium">Circle</h3>
              <p className="text-sm">Equation: (x - h)² + (y - k)² = r²</p>
              <p className="text-sm">Area: πr²</p>
              <p className="text-sm">Circumference: 2πr</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Line</h3>
              <p className="text-sm">Slope-intercept form: y = mx + b</p>
              <p className="text-sm">Point-slope form: y - y₁ = m(x - x₁)</p>
              <p className="text-sm">General form: Ax + By + C = 0</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Parabola</h3>
              <p className="text-sm">Vertex form: y = a(x - h)² + k</p>
              <p className="text-sm">Standard form: y = ax² + bx + c</p>
              <p className="text-sm">Vertex: (h, k)</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Ellipse</h3>
              <p className="text-sm">Standard form: (x-h)²/a² + (y-k)²/b² = 1</p>
              <p className="text-sm">Area: πab</p>
              <p className="text-sm">Semi-major axis: max(a, b)</p>
              <p className="text-sm">Semi-minor axis: min(a, b)</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Hyperbola</h3>
              <p className="text-sm">Standard form: (x-h)²/a² - (y-k)²/b² = 1</p>
              <p className="text-sm">Asymptotes: y = ±(b/a)(x - h) + k</p>
\
