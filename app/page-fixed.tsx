import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PackageSearch, ShieldCheck, Truck, Zap, Globe, Clock, Users, BarChart3, CheckCircle, Star } from 'lucide-react'
import Link from "next/link"
import { Navbar } from "@/components/site/navbar"

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero */}
      <section className="relative isolate overflow-hidden min-h-screen flex items-center">
        {/* Background image */}
        <img
          src="https://sjc.microlink.io/GsGSI8pkV4OnDbB0cGgxS3ADYsSUAUAFswcWWf2wHDDpKmahHNRxvaY4TgLtNC8EXIpAl7fP0sMpzYsIAdoAYw.jpeg"
          alt="Courier pushing a hand truck with packages across a rainy city street"
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="eager"
        />
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/30" />
        <div className="relative mx-auto max-w-7xl px-6 py-32 md:py-40 z-10">
          <div className="max-w-4xl">
            <div className="glass-effect rounded-2xl p-8 md:p-12 shadow-premium animate-fade-in">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur mb-6">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                <span className="text-white/90">Reliable, real-time package tracking</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight gradient-text mb-6">
                Track every package with confidence
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-3xl">
                One powerful dashboard for shipments, notifications, and delivery insights—built for teams and power users who demand reliability.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-12">
                <Link href="/dashboard">
                  <Button size="lg" className="glass-light text-blue-900 font-semibold shadow-glow h-12 px-8">
                    <PackageSearch className="mr-2 h-5 w-5" />
                    Start tracking
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="secondary" className="glass-effect text-white font-semibold h-12 px-8">
                    View pricing
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard icon={<Globe className="h-5 w-5" />} label="Global carriers" value="50+" />
                <StatCard icon={<Zap className="h-5 w-5" />} label="Real-time updates" value="Live" />
                <StatCard icon={<ShieldCheck className="h-5 w-5" />} label="Uptime guarantee" value="99.9%" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-24 md:py-32">
        <div className="absolute inset-0 gradient-mesh opacity-30" />
        <div className="relative mx-auto w-full max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Everything you need to track packages
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed for teams and individuals who manage multiple shipments.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Feature
              icon={<PackageSearch className="h-8 w-8" />}
              title="Unified tracking"
              description="Search across all carriers in one place and see status at a glance. No more jumping between carrier websites."
            />
            <Feature
              icon={<Clock className="h-8 w-8" />}
              title="Smart notifications"
              description="Get email alerts for status changes, delays, and delivery windows. Stay informed without constant checking."
            />
            <Feature
              icon={<Users className="h-8 w-8" />}
              title="Team collaboration"
              description="Shareable lists, roles, and admin tools baked in from day one. Perfect for teams and organizations."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative py-16 md:py-24">
        <div className="absolute inset-0 -z-10 gradient-mesh opacity-60" />
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="glass-card rounded-2xl p-8 shadow-premium">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">How it works</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Feature title="1. Add tracking" description="Paste a tracking number or connect carriers." />
              <Feature title="2. Get updates" description="We fetch live status and delivery windows." />
              <Feature title="3. Stay informed" description="Email alerts and dashboard insights keep you ahead." />
            </div>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section id="integrations" className="relative py-16 md:py-24">
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        <div className="relative mx-auto w-full max-w-7xl px-6">
          <div className="glass-card rounded-2xl p-8 shadow-premium">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
              Trusted integrations
            </h2>
            <p className="text-lg text-neutral-600 mb-8">Works with major carriers and platforms worldwide.</p>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {['UPS', 'FedEx', 'DHL', 'USPS', 'Amazon', 'Shopify'].map((carrier, i) => (
                <div key={i} className="glass-light rounded-lg p-6 text-center font-semibold text-blue-900 shadow-premium">
                  {carrier}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative py-16 md:py-24">
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        <div className="relative mx-auto w-full max-w-7xl px-6">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-12 text-center">
            Loved by teams worldwide
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                quote: "Wayfinder transformed our logistics tracking and saves us hours every week. The real-time updates are game-changing.",
                author: "Sarah Chen",
                role: "Operations Manager",
                company: "TechCorp"
              },
              {
                quote: "Finally, one dashboard for all our shipments. The team collaboration features are exactly what we needed.",
                author: "Michael Torres",
                role: "Supply Chain Director", 
                company: "GlobalTrade"
              },
              {
                quote: "The smart notifications keep us ahead of delivery issues. Our customer satisfaction has improved significantly.",
                author: "Emily Johnson",
                role: "Logistics Coordinator",
                company: "FastShip"
              }
            ].map((testimonial, i) => (
              <Card key={i} className="glass-card p-8 shadow-premium">
                <CardContent className="p-0">
                  <div className="flex mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-lg mb-6 leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div>
                    <div className="font-semibold text-blue-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 md:py-24">
        <div className="absolute inset-0 gradient-mesh opacity-30" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="glass-card rounded-2xl p-8 md:p-12 shadow-premium">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h2 className="text-3xl font-bold gradient-text md:text-4xl">
                  Ready to streamline your shipments?
                </h2>
                <p className="mt-2 text-lg text-neutral-600">
                  Start tracking in minutes—no credit card required.
                </p>
              </div>
              <div className="flex gap-3">
                <Link href="/dashboard">
                  <Button size="lg" className="glass-light text-blue-900 font-semibold shadow-glow">
                    Get started
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="glass-effect text-white font-semibold">
                    Talk to us
                  </Button>
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
    <Card className="border-white/20 bg-white/10 text-white backdrop-blur shadow-premium">
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

function Feature({ 
  title, 
  description,
  icon
}: { 
  title: string; 
  description: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="glass-card rounded-xl border p-6 shadow-premium">
      {icon && (
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold gradient-text">{title}</h3>
      <p className="mt-2 text-neutral-600">{description}</p>
    </div>
  )
}
