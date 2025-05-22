import { CalculusVisualizer } from "@/components/calculus-visualizer"

export default function CalculusPage() {
  return (
    <div className="container mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Calculus Visualizer</h1>
        <p className="text-muted-foreground mb-8">
          Explore differentiation and integration through interactive visualizations
        </p>
      </div>

      <CalculusVisualizer />
    </div>
  )
}
