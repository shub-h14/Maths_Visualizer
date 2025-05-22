import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, ExternalLink, FileText, Video } from "lucide-react"
import { Grid3X3, PenTool } from "lucide-react"
import Link from "next/link"

export default function ResourcesPage() {
  return (
    <div className="container mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Learning Resources</h1>
        <p className="text-muted-foreground mb-8">Additional materials to support your mathematical learning journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Calculus Resources
            </CardTitle>
            <CardDescription>Materials for learning differentiation and integration</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://ocw.mit.edu/courses/mathematics/18-01sc-single-variable-calculus-fall-2010/"
                  target="_blank"
                  className="flex items-center text-blue-600 hover:underline"
                >
                  MIT OpenCourseWare: Single Variable Calculus
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.khanacademy.org/math/calculus-1"
                  target="_blank"
                  className="flex items-center text-blue-600 hover:underline"
                >
                  Khan Academy: Calculus 1
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link
                  href="https://tutorial.math.lamar.edu/Classes/CalcI/CalcI.aspx"
                  target="_blank"
                  className="flex items-center text-blue-600 hover:underline"
                >
                  Paul's Online Math Notes: Calculus I
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Grid3X3 className="mr-2 h-5 w-5" />
              Linear Algebra Resources
            </CardTitle>
            <CardDescription>Materials for learning matrices and vectors</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://ocw.mit.edu/courses/mathematics/18-06-linear-algebra-spring-2010/"
                  target="_blank"
                  className="flex items-center text-blue-600 hover:underline"
                >
                  MIT OpenCourseWare: Linear Algebra
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.khanacademy.org/math/linear-algebra"
                  target="_blank"
                  className="flex items-center text-blue-600 hover:underline"
                >
                  Khan Academy: Linear Algebra
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.3blue1brown.com/topics/linear-algebra"
                  target="_blank"
                  className="flex items-center text-blue-600 hover:underline"
                >
                  3Blue1Brown: Essence of Linear Algebra
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PenTool className="mr-2 h-5 w-5" />
              Geometry Resources
            </CardTitle>
            <CardDescription>Materials for learning shapes and curves</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://www.khanacademy.org/math/geometry"
                  target="_blank"
                  className="flex items-center text-blue-600 hover:underline"
                >
                  Khan Academy: Geometry
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.mathsisfun.com/geometry/index.html"
                  target="_blank"
                  className="flex items-center text-blue-600 hover:underline"
                >
                  Math is Fun: Geometry
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.geogebra.org/"
                  target="_blank"
                  className="flex items-center text-blue-600 hover:underline"
                >
                  GeoGebra: Interactive Geometry
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Video className="mr-2 h-5 w-5" />
              Video Tutorials
            </CardTitle>
            <CardDescription>Video resources for visual learners</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://www.youtube.com/c/3blue1brown"
                  target="_blank"
                  className="flex items-center text-blue-600 hover:underline"
                >
                  3Blue1Brown
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.youtube.com/user/patrickJMT"
                  target="_blank"
                  className="flex items-center text-blue-600 hover:underline"
                >
                  PatrickJMT
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.youtube.com/c/ProfessorLeonard"
                  target="_blank"
                  className="flex items-center text-blue-600 hover:underline"
                >
                  Professor Leonard
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Practice Problems
            </CardTitle>
            <CardDescription>Resources for practicing mathematical concepts</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://www.wolframalpha.com/problem-generator/"
                  target="_blank"
                  className="flex items-center text-blue-600 hover:underline"
                >
                  Wolfram Alpha Problem Generator
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link
                  href="https://brilliant.org/courses/math/"
                  target="_blank"
                  className="flex items-center text-blue-600 hover:underline"
                >
                  Brilliant.org Math Courses
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.symbolab.com/practice/"
                  target="_blank"
                  className="flex items-center text-blue-600 hover:underline"
                >
                  Symbolab Practice
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
