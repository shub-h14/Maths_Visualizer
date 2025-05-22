"use client"

import { useEffect } from "react"
import katex from "katex"
import "katex/dist/katex.min.css"

interface LatexRendererProps {
  latex: string
  display?: boolean
  className?: string
}

export function LatexRenderer({ latex, display = false, className = "" }: LatexRendererProps) {
  useEffect(() => {
    const elements = document.querySelectorAll(".katex-render")
    elements.forEach((element) => {
      try {
        katex.render(element.textContent || "", element as HTMLElement, {
          throwOnError: false,
          displayMode: display,
        })
      } catch (error) {
        console.error("Error rendering LaTeX:", error)
      }
    })
  }, [latex, display])

  return (
    <div className={`katex-render ${className}`} style={{ overflow: "auto" }}>
      {latex}
    </div>
  )
}
