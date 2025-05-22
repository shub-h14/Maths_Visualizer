import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { BookOpen, ActivityIcon as Function, GitGraph, Grid3X3, Infinity, PenTool } from "lucide-react"

export default function Home() {
  const topics = [
    {
      title: "Calculus",
      description: "Explore differentiation and integration visually",
      icon: <Infinity className="h-8 w-8" />,
      href: "/calculus",
    },
    {
      title: "Algebra",
      description: "Plot and analyze functions and equations",
      icon: <Function className="h-8 w-8" />,
      href: "/algebra",
    },
    {
      title: "Linear Algebra",
      description: "Visualize matrices, vectors and transformations",
      icon: <Grid3X3 className="h-8 w-8" />,
      href: "/linear-algebra",
    },
    {
      title: "Geometry",
      description: "Interact with 2D shapes and curves",
      icon: <PenTool className="h-8 w-8" />,
      href: "/geometry",
    },
    {
      title: "Step-by-Step Solver",
      description: "Get detailed solutions to math problems",
      icon: <GitGraph className="h-8 w-8" />,
      href: "/solver",
    },
    {
      title: "Learning Resources",
      description: "Additional materials to support your learning",
      icon: <BookOpen className="h-8 w-8" />,
      href: "/resources",
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Math Visualizer</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Interactive visualizations to help you understand complex mathematical concepts
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic, index) => (
          <Link href={topic.href} key={index}>
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{topic.title}</CardTitle>
                  <div className="text-primary">{topic.icon}</div>
                </div>
                <CardDescription>{topic.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Explore
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
