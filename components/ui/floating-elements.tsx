"use client"

import { useEffect, useState } from "react"
import { Package, Truck, MapPin, Clock } from "lucide-react"

const icons = [Package, Truck, MapPin, Clock]

export function FloatingElements() {
  const [elements, setElements] = useState<
    Array<{
      id: number
      Icon: typeof Package
      x: number
      y: number
      delay: number
    }>
  >([])

  useEffect(() => {
    const newElements = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      Icon: icons[Math.floor(Math.random() * icons.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }))
    setElements(newElements)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {elements.map((element) => (
        <div
          key={element.id}
          className="absolute animate-float opacity-10"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            animationDelay: `${element.delay}s`,
          }}
        >
          <element.Icon className="h-8 w-8 text-blue-500" />
        </div>
      ))}
    </div>
  )
}
