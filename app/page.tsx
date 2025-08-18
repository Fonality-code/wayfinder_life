import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PackageSearch, ShieldCheck, Truck, Zap, Globe, Clock, CheckCircle, Star, MapPin } from 'lucide-react'
import Link from "next/link"
import { PublicTrackingForm } from "@/components/tracking/public-tracking-form"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default function HomePage() {
  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        {/* Background image */}
        <img
          src="https://sjc.microlink.io/GsGSI8pkV4OnDbB0cGgxS3ADYsSUAUAFswcWWf2wHDDpKmahHNRxvaY4TgLtNC8EXIpAl7fP0sMpzYsIAdoAYw.jpeg"
          alt="Courier pushing a hand truck with packages across a rainy city street"
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="eager"
        />
        {/* Overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-white/0" />
        <div className="relative mx-auto max-w-7xl px-6 py-28 md:py-40">
          <div className="max-w-3xl text-white">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs backdrop-blur">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              <span>{"Reliable, real-time package tracking"}</span>
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              Track every package with confidence
            </h1>
            <p className="mt-4 max-w-2xl text-pretty text-white/90 sm:text-lg">
              Experience seamless package tracking across all major carriers worldwide. Get instant updates,
              delivery notifications, detailed tracking history, payment information, and transport details -
              no registration required. Simply enter your tracking number below.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>Global Coverage</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>24/7 Monitoring</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>99.9% Accuracy</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Payment & Transport Info</span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="#tracking">
                <Button size="lg" className="bg-neutral-900 hover:bg-neutral-800 text-white">
                  <PackageSearch className="mr-2 h-5 w-5" />
                  Track a package now
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="secondary" className="backdrop-blur bg-white/80 hover:bg-white">
                  View pricing
                </Button>
              </Link>
            </div>

            <div className="mt-8 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-4">
              <StatCard icon={<Truck className="h-5 w-5" />} label="Carriers" value="50+" />
              <StatCard icon={<Globe className="h-5 w-5" />} label="Countries" value="180+" />
              <StatCard icon={<Zap className="h-5 w-5" />} label="Updates" value="Live" />
              <StatCard icon={<ShieldCheck className="h-5 w-5" />} label="Uptime" value="99.9%" />
            </div>
          </div>
        </div>
      </section>

      {/* Package Tracking Section - Main Feature */}
      <section id="tracking" className="mx-auto w-full max-w-7xl px-6 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Complete Package Information
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-4xl mx-auto">
            Get detailed information about your package including real-time location, payment details,
            transport method, cost breakdown, and delivery timeline. We support all major carriers
            including UPS, FedEx, DHL, USPS, and many more.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
            <div className="flex items-center justify-center gap-2 bg-blue-50 rounded-lg p-3">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span className="text-blue-800 font-medium">Real-time tracking</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-green-50 rounded-lg p-3">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-green-800 font-medium">Payment information</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-purple-50 rounded-lg p-3">
              <Truck className="h-4 w-4 text-purple-600" />
              <span className="text-purple-800 font-medium">Transport details</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-orange-50 rounded-lg p-3">
              <Clock className="h-4 w-4 text-orange-600" />
              <span className="text-orange-800 font-medium">Delivery estimates</span>
            </div>
          </div>
        </div>
        <PublicTrackingForm />
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-7xl px-6 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Complete Package Information</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about your package in one place - no registration required.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Feature
            title="Payment Details"
            description="See how much you paid, payment method used, payment status, and complete cost breakdown including shipping, handling, and insurance fees."
            icon={<CheckCircle className="h-6 w-6 text-green-600" />}
          />
          <Feature
            title="Transport Information"
            description="Know exactly how your package is being transported - by air, truck, ship, rail, or local delivery with estimated delivery times."
            icon={<Truck className="h-6 w-6 text-blue-600" />}
          />
          <Feature
            title="Real-time Tracking"
            description="Get live updates on your package location, delivery status, and complete tracking history from pickup to delivery."
            icon={<MapPin className="h-6 w-6 text-purple-600" />}
          />
          <Feature
            title="Universal Coverage"
            description="Track packages from UPS, FedEx, DHL, USPS, Amazon, and 50+ other carriers worldwide with consistent information format."
            icon={<Globe className="h-6 w-6 text-orange-600" />}
          />
          <Feature
            title="No Registration Required"
            description="Get all package information instantly with just your tracking number. No sign-up, no account needed, no hassle."
            icon={<Zap className="h-6 w-6 text-indigo-600" />}
          />
          <Feature
            title="Secure & Private"
            description="Your tracking information is secure and private. We don't store your tracking data or personal information."
            icon={<ShieldCheck className="h-6 w-6 text-red-600" />}
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50">
        <div className="mx-auto w-full max-w-7xl px-6 py-16 md:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">Get comprehensive package information in just one step.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Enter Tracking Number</h3>
              <p className="text-gray-600">
                Simply enter your tracking number from any major carrier. We support UPS, FedEx, DHL, USPS, Amazon, and 50+ more carriers worldwide.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Complete Information</h3>
              <p className="text-gray-600">
                Instantly see tracking status, current location, payment details, transport method, cost breakdown, and estimated delivery time.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-gray-600">
                View detailed tracking history, real-time updates, payment status, and all the information you need about your package delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Carriers */}
      <section className="mx-auto w-full max-w-7xl px-6 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Supported Carriers
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            We work with all major shipping companies worldwide.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
          <div className="text-center p-4 rounded-lg bg-white border">
            <div className="font-bold text-lg text-brown-600">UPS</div>
            <p className="text-sm text-gray-500">United Parcel Service</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-white border">
            <div className="font-bold text-lg text-purple-600">FedEx</div>
            <p className="text-sm text-gray-500">Federal Express</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-white border">
            <div className="font-bold text-lg text-yellow-600">DHL</div>
            <p className="text-sm text-gray-500">Express Delivery</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-white border">
            <div className="font-bold text-lg text-blue-600">USPS</div>
            <p className="text-sm text-gray-500">US Postal Service</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-white border">
            <div className="font-bold text-lg text-orange-600">Amazon</div>
            <p className="text-sm text-gray-500">Amazon Logistics</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-white border">
            <div className="font-bold text-lg text-gray-600">+45 More</div>
            <p className="text-sm text-gray-500">International Carriers</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-neutral-50">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <div className="rounded-2xl border bg-white p-8 md:p-12">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  Need help with your shipment?
                </h2>
                <p className="mt-2 text-neutral-600">
                  Get in touch with our support team for assistance.
                </p>
              </div>
              <div className="flex gap-3">
                <Link href="/contact">
                  <Button size="lg" className="bg-neutral-900 hover:bg-neutral-800 text-white">
                    Contact Support
                  </Button>
                </Link>
                <Link href="/help">
                  <Button size="lg" variant="outline">Help Center</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <Card className="border-white/20 bg-white/10 text-white backdrop-blur">
      <CardContent className="flex items-center gap-3 p-4">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-white/20">
          {icon}
        </div>
        <div>
          <div className="text-sm text-white/80">{label}</div>
          <div className="text-lg font-semibold">{value}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function Feature({ title, description, icon }: {
  title: string;
  description: string;
  icon?: React.ReactNode
}) {
  return (
    <div className="rounded-xl border p-6">
      {icon && (
        <div className="mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-neutral-600">{description}</p>
    </div>
  )
}
