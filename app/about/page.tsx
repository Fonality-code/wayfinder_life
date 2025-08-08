import { MainHeader } from "@/components/ui/main-header"
import { PremiumCard } from "@/components/ui/premium-card"
import { FloatingElements } from "@/components/ui/floating-elements"
import { Package, Users, Globe, Award, Target, Heart } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30 relative overflow-hidden">
      <FloatingElements />

      <MainHeader currentPath="/about" />

      {/* Hero Section */}
      <section className="section-padding">
        <div className="container-responsive">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-display gradient-text mb-6">About Wayfinder</h1>
            <p className="text-body-large text-gray-600 mb-8">
              We're revolutionizing package tracking with cutting-edge technology, real-time updates, and a commitment
              to exceptional customer service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover-lift"
                >
                  Get Started
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-white/50 backdrop-blur-sm">
        <div className="container-responsive">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-headline gradient-text mb-6">Our Mission</h2>
              <p className="text-body-large text-gray-600 mb-6">
                At Wayfinder, we believe that tracking your packages shouldn't be a mystery. Our mission is to provide
                complete transparency, real-time updates, and peace of mind for every shipment.
              </p>
              <p className="text-gray-600 mb-8">
                We combine advanced GPS technology, machine learning algorithms, and a global network of logistics
                partners to deliver the most accurate and reliable package tracking experience available.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Precision Tracking</h3>
                  <p className="text-sm text-gray-600">GPS-accurate location updates</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                <Package className="h-24 w-24 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="text-headline gradient-text mb-4">Our Values</h2>
            <p className="text-body-large text-gray-600 max-w-3xl mx-auto">
              These core values guide everything we do and shape how we serve our customers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <PremiumCard
              icon={<Heart className="h-8 w-8 text-red-500" />}
              title="Customer First"
              description="Every decision we make is centered around providing the best possible experience for our customers."
              variant="glass"
            />
            <PremiumCard
              icon={<Award className="h-8 w-8 text-yellow-500" />}
              title="Excellence"
              description="We strive for perfection in every aspect of our service, from technology to customer support."
              variant="gradient"
            />
            <PremiumCard
              icon={<Globe className="h-8 w-8 text-green-500" />}
              title="Global Impact"
              description="We're building a worldwide network that connects people and businesses across all continents."
              variant="glass"
            />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="text-headline mb-4">Meet Our Team</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Our diverse team of experts is passionate about revolutionizing the logistics industry.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sarah Johnson</h3>
              <p className="text-blue-100 mb-2">CEO & Founder</p>
              <p className="text-sm text-blue-200">Former logistics executive with 15+ years of industry experience.</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mike Chen</h3>
              <p className="text-blue-100 mb-2">CTO</p>
              <p className="text-sm text-blue-200">
                Technology leader specializing in real-time tracking systems and AI.
              </p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Emily Davis</h3>
              <p className="text-blue-100 mb-2">Head of Operations</p>
              <p className="text-sm text-blue-200">
                Operations expert focused on global expansion and partnership development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="text-headline gradient-text mb-4">By the Numbers</h2>
            <p className="text-body-large text-gray-600">Our growth and impact speak for themselves.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold gradient-text mb-2">1M+</div>
              <div className="text-gray-600">Packages Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold gradient-text mb-2">50+</div>
              <div className="text-gray-600">Countries Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold gradient-text mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold gradient-text mb-2">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container-responsive">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-headline gradient-text mb-6">Join Our Journey</h2>
            <p className="text-body-large text-gray-600 mb-8">
              Be part of the future of package tracking. Experience the Wayfinder difference today.
            </p>
            <Link href="/auth">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover-lift"
              >
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white section-padding">
        <div className="container-responsive">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Package className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-bold">Wayfinder</span>
              </div>
              <p className="text-gray-400 mb-4">
                The most advanced package tracking platform for businesses and individuals.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    Press
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Wayfinder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
