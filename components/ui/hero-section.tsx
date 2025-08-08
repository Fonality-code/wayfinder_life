"use client"

import { ArrowRight, Package, Truck, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PremiumCard } from "./premium-card"

interface HeroSectionProps {
  title: string
  subtitle: string
  ctaText?: string
  ctaHref?: string
  showFeatures?: boolean
}

export function HeroSection({
  title,
  subtitle,
  ctaText = "Get Started",
  ctaHref = "#",
  showFeatures = true,
}: HeroSectionProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-mesh opacity-30" />
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/20 rounded-full shape-blob animate-float" />
        <div
          className="absolute top-40 right-20 w-24 h-24 bg-purple-400/20 rounded-full shape-organic animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-32 left-1/4 w-40 h-40 bg-pink-400/20 rounded-full shape-blob animate-float"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="container-responsive relative z-10">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-display gradient-text mb-6">{title}</h1>
          <p className="text-body-large text-gray-600 mb-8 max-w-2xl mx-auto">{subtitle}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
            >
              {ctaText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-2 hover:bg-blue-50 bg-transparent">
              Learn More
            </Button>
          </div>

          {showFeatures && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 animate-slide-up">
              <PremiumCard variant="glass" interactive className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-time Tracking</h3>
                <p className="text-gray-600">Track your packages in real-time with precise location updates</p>
              </PremiumCard>

              <PremiumCard variant="glass" interactive className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                <p className="text-gray-600">Lightning-fast delivery with our optimized logistics network</p>
              </PremiumCard>

              <PremiumCard variant="glass" interactive className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Global Coverage</h3>
                <p className="text-gray-600">Worldwide shipping with comprehensive tracking coverage</p>
              </PremiumCard>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
