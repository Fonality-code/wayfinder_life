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
      <section id="how" className="relative py-24 md:py-32 bg-gray-50">
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        <div className="relative mx-auto w-full max-w-7xl px-6">
          <div className="glass-card rounded-2xl p-8 md:p-12 shadow-premium">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">How it works</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Get started in minutes with our simple three-step process
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <StepCard 
                step="1" 
                title="Add tracking numbers" 
                description="Paste a tracking number or connect your carrier accounts for automatic imports." 
                icon={<PackageSearch className="h-8 w-8" />}
              />
              <StepCard 
                step="2" 
                title="Get live updates" 
                description="We fetch real-time status and delivery windows from all major carriers worldwide." 
                icon={<Zap className="h-8 w-8" />}
              />
              <StepCard 
                step="3" 
                title="Stay informed" 
                description="Email alerts and dashboard insights keep you ahead of any delivery issues." 
                icon={<BarChart3 className="h-8 w-8" />}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section id="integrations" className="py-24 md:py-32">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Integrations</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Works seamlessly with major carriers and platforms worldwide
            </p>
          </div>
          <div className="glass-card rounded-2xl p-8 md:p-12 shadow-premium">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
              {[
                "FedEx", "UPS", "DHL", "USPS", "Amazon", "TNT"
              ].map((carrier, i) => (
                <div key={i} className="glass-light rounded-lg p-6 text-center">
                  <div className="text-lg font-semibold text-gray-700">{carrier}</div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <p className="text-gray-600">...and 40+ more carriers worldwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 md:py-32 bg-gray-50">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Loved by teams</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Thousands of businesses trust Wayfinder for their package tracking needs
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <TestimonialCard 
              quote="Wayfinder has transformed how we handle logistics. The real-time updates save us hours of manual checking every week."
              author="Sarah Chen"
              role="Operations Lead"
              company="TechCorp"
              rating={5}
            />
            <TestimonialCard 
              quote="The team features are incredible. We can finally track all our shipments in one place and collaborate effectively."
              author="Mike Rodriguez"
              role="Supply Chain Manager"
              company="GlobalTrade Inc"
              rating={5}
            />
            <TestimonialCard 
              quote="Customer support is outstanding, and the platform is intuitive. Our delivery satisfaction scores have improved significantly."
              author="Emily Watson"
              role="Fulfillment Director"
              company="E-commerce Plus"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="glass-card rounded-2xl p-8 md:p-16 shadow-premium text-center">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Ready to streamline your shipments?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses that trust Wayfinder for reliable package tracking. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="glass-light text-blue-900 font-semibold shadow-glow h-12 px-8">
                  Get started free
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="glass-effect text-gray-700 font-semibold h-12 px-8">
                  Schedule demo
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                14-day free trial
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Cancel anytime
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
    <Card className="glass-effect border-white/20 text-white backdrop-blur shadow-premium">
      <CardContent className="flex items-center gap-3 p-4">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-white/20">
          {icon}
        </div>
        <div>
          <div className="text-sm text-white/80">{label}</div>
          <div className="text-xl font-bold">{value}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function Feature({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode
  title: string 
  description: string 
}) {
  return (
    <div className="glass-card rounded-xl p-8 shadow-premium text-center">
      <div className="flex justify-center mb-4 text-blue-600">
        {icon}
      </div>
      <h3 className="text-xl font-bold gradient-text mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}

function StepCard({
  step,
  title,
  description,
  icon,
}: {
  step: string
  title: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {step}
          </div>
          <div className="absolute -bottom-2 -right-2 text-blue-500">
            {icon}
          </div>
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}

function TestimonialCard({
  quote,
  author,
  role,
  company,
  rating,
}: {
  quote: string
  author: string
  role: string
  company: string
  rating: number
}) {
  return (
    <Card className="glass-card p-8 shadow-premium">
      <CardContent className="p-0">
        <div className="flex mb-4">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
          ))}
        </div>
        <p className="text-gray-700 mb-6 leading-relaxed italic">"{quote}"</p>
        <div>
          <div className="font-semibold text-gray-900">{author}</div>
          <div className="text-sm text-gray-600">{role} • {company}</div>
        </div>
      </CardContent>
    </Card>
  )
}
