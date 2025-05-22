"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  BookOpen,
  ActivityIcon as Function,
  GitGraph,
  Grid3X3,
  Home,
  Infinity,
  Menu,
  PenTool,
  CuboidIcon as Cube,
} from "lucide-react"
import { ModeToggle } from "./mode-toggle"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const routes = [
    {
      label: "Home",
      icon: <Home className="h-5 w-5" />,
      href: "/",
    },
    {
      label: "Calculus",
      icon: <Infinity className="h-5 w-5" />,
      href: "/calculus",
    },
    {
      label: "Algebra",
      icon: <Function className="h-5 w-5" />,
      href: "/algebra",
    },
    {
      label: "Linear Algebra",
      icon: <Grid3X3 className="h-5 w-5" />,
      href: "/linear-algebra",
    },
    {
      label: "Geometry",
      icon: <PenTool className="h-5 w-5" />,
      href: "/geometry",
    },
    {
      label: "Step-by-Step Solver",
      icon: <GitGraph className="h-5 w-5" />,
      href: "/solver",
    },
    {
      label: "Learning Resources",
      icon: <BookOpen className="h-5 w-5" />,
      href: "/resources",
    },
    {
      label: "3D Visualization",
      icon: <Cube className="h-5 w-5" />,
      href: "/3d-visualization",
    },
  ]

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed left-4 top-4 z-40">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="h-full border-r bg-background">
            <div className="flex h-16 items-center justify-between px-4">
              <Link href="/" className="flex items-center font-bold text-lg">
                Math Visualizer
              </Link>
              <ModeToggle />
            </div>
            <ScrollArea className="h-[calc(100vh-4rem)]">
              <div className="px-2 py-2">
                <nav className="flex flex-col gap-1">
                  {routes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
                        pathname === route.href ? "bg-accent" : "transparent",
                      )}
                    >
                      {route.icon}
                      {route.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>
      <div className={cn("hidden md:flex h-screen w-64 flex-col border-r bg-background", className)}>
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center font-bold text-lg">
            Math Visualizer
          </Link>
          <ModeToggle />
        </div>
        <ScrollArea className="flex-1">
          <div className="px-2 py-2">
            <nav className="flex flex-col gap-1">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
                    pathname === route.href ? "bg-accent" : "transparent",
                  )}
                >
                  {route.icon}
                  {route.label}
                </Link>
              ))}
            </nav>
          </div>
        </ScrollArea>
      </div>
    </>
  )
}
