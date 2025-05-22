import { MatrixTransformer } from "@/components/matrix-transformer"

export default function LinearAlgebraPage() {
  return (
    <div className="container mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Linear Algebra Visualizer</h1>
        <p className="text-muted-foreground mb-8">Visualize matrices, vectors, and transformations</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Matrix Transformation</h2>
          <p className="text-muted-foreground mb-4">
            Visualize how a matrix transforms vectors and shapes in 2D or 3D space. The original shape is shown in blue,
            and the transformed shape is shown in orange. The basis vectors are shown in green (original) and red
            (transformed).
          </p>
          <MatrixTransformer />
        </div>

        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-4">Common Matrix Transformations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium">Identity Matrix</h3>
              <pre className="bg-muted p-2 rounded-md">[1 0] [0 1]</pre>
              <p className="text-sm text-muted-foreground">No change to vectors</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Rotation (90° counterclockwise)</h3>
              <pre className="bg-muted p-2 rounded-md">[0 -1] [1 0]</pre>
              <p className="text-sm text-muted-foreground">Rotates vectors by 90°</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Scaling</h3>
              <pre className="bg-muted p-2 rounded-md">[2 0] [0 2]</pre>
              <p className="text-sm text-muted-foreground">Scales vectors by a factor of 2</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Reflection (across x-axis)</h3>
              <pre className="bg-muted p-2 rounded-md">[1 0] [0 -1]</pre>
              <p className="text-sm text-muted-foreground">Reflects vectors across the x-axis</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Shear (horizontal)</h3>
              <pre className="bg-muted p-2 rounded-md">[1 1] [0 1]</pre>
              <p className="text-sm text-muted-foreground">Shears vectors horizontally</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Projection (onto x-axis)</h3>
              <pre className="bg-muted p-2 rounded-md">[1 0] [0 0]</pre>
              <p className="text-sm text-muted-foreground">Projects vectors onto the x-axis</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
