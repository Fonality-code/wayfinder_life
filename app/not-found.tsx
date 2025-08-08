import { Button } from "@/components/ui/button"
import { GradientCard } from "@/components/ui/gradient-card"
import { Package, Home, Search } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        <GradientCard gradient="blue" className="p-12">
          <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Package className="h-12 w-12 text-white" />
          </div>

          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            404
          </h1>

          <h2 className="text-3xl font-bold text-slate-900 mb-4">Package Not Found</h2>

          <p className="text-xl text-slate-600 mb-8">
            Oops! The page you're looking for seems to have been delivered to the wrong address. Let's get you back on
            track.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3"
              >
                <Home className="mr-2 h-5 w-5" />
                Go Home
              </Button>
            </Link>

            <Link href="/help">
              <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent">
                <Search className="mr-2 h-5 w-5" />
                Search Help
              </Button>
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-500 mb-4">Common destinations:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  Track Package
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="ghost" size="sm">
                  Pricing
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="ghost" size="sm">
                  About Us
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="ghost" size="sm">
                  Contact
                </Button>
              </Link>
            </div>
          </div>
        </GradientCard>
      </div>
    </div>
  )
}
