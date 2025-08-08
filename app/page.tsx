import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PackageSearch, ShieldCheck, Truck, Zap } from 'lucide-react'
import Link from "next/link"

export default function HomePage() {
  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        {/* Background image from provided Source URL */}
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
              One dashboard for shipments, notifications, and delivery insights—built for teams and power users.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/dashboard">
                <Button size="lg" className="bg-neutral-900 hover:bg-neutral-800 text-white">
                  <PackageSearch className="mr-2 h-5 w-5" />
                  Track a package
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="secondary" className="backdrop-blur bg-white/80 hover:bg-white">
                  View pricing
                </Button>
              </Link>
            </div>

            <div className="mt-8 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard icon={<Truck className="h-5 w-5" />} label="Carriers" value="50+" />
              <StatCard icon={<Zap className="h-5 w-5" />} label="Realtime updates" value="Live" />
              <StatCard icon={<ShieldCheck className="h-5 w-5" />} label="Uptime" value="99.9%" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-7xl px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <Feature
            title="Unified tracking"
            description="Search across all carriers in one place and see status at a glance."
          />
          <Feature
            title="Smart notifications"
            description="Get email alerts for status changes, delays, and delivery windows."
          />
          <Feature
            title="Team-ready"
            description="Shareable lists, roles, and admin tools baked in from day one."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-neutral-50">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <div className="rounded-2xl border bg-white p-8 md:p-12">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  Ready to streamline your shipments?
                </h2>
                <p className="mt-2 text-neutral-600">
                  Start tracking in minutes—no credit card required.
                </p>
              </div>
              <div className="flex gap-3">
                <Link href="/dashboard">
                  <Button size="lg" className="bg-neutral-900 hover:bg-neutral-800 text-white">
                    Get started
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline">Talk to us</Button>
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

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border p-6">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-neutral-600">{description}</p>
    </div>
  )
}
