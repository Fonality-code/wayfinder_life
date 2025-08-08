"use client"

import { MainHeader } from "@/components/ui/main-header"
import { PremiumCard } from "@/components/ui/premium-card"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { FloatingElements } from "@/components/ui/floating-elements"
import { Package, Search, Book, MessageCircle, Phone, Mail, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function HelpPage() {
  const helpCategories = [
    {
      icon: Package,
      title: "Getting Started",
      description: "Learn the basics of package tracking",
      articles: [
        "How to track your first package",
        "Understanding tracking statuses",
        "Setting up notifications",
        "Creating your account",
      ],
    },
    {
      icon: Search,
      title: "Tracking & Updates",
      description: "Everything about tracking your packages",
      articles: [
        "Real-time tracking explained",
        "Why tracking updates are delayed",
        "International tracking guide",
        "Troubleshooting tracking issues",
      ],
    },
    {
      icon: Book,
      title: "Account Management",
      description: "Manage your Wayfinder account",
      articles: ["Updating your profile", "Managing notifications", "Billing and subscriptions", "Privacy settings"],
    },
    {
      icon: MessageCircle,
      title: "API & Integrations",
      description: "Developer resources and guides",
      articles: ["API documentation", "Webhook setup guide", "Rate limits and quotas", "SDK and libraries"],
    },
  ]

  const popularArticles = [
    "How to track a package without a tracking number",
    "What to do if your package is lost",
    "Understanding delivery exceptions",
    "How to change delivery address",
    "Setting up SMS notifications",
    "Tracking international packages",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <AnimatedBackground />
      <FloatingElements />

      <MainHeader />

      <main>
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">Help Center</h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Find answers to your questions and get the most out of Wayfinder.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search for help articles..."
                  className="pl-12 pr-4 py-3 text-lg border-blue-200 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Popular Articles */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold gradient-text mb-8 text-center">Popular Articles</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {popularArticles.map((article, index) => (
                <Link key={index} href="#" className="block">
                  <div className="flex items-center gap-3 p-4 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors">
                    <Book className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700 hover:text-blue-600">{article}</span>
                    <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Help Categories */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">Browse by Category</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Find detailed guides and tutorials organized by topic.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {helpCategories.map((category, index) => (
                <PremiumCard key={index} className="group hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <category.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{category.title}</h3>
                  <p className="text-gray-600 mb-6 text-center">{category.description}</p>

                  <ul className="space-y-2">
                    {category.articles.map((article, articleIndex) => (
                      <li key={articleIndex}>
                        <Link
                          href="#"
                          className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <ChevronRight className="h-3 w-3" />
                          {article}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </PremiumCard>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Still Need Help?</h2>
              <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                Can't find what you're looking for? Our support team is here to help.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center text-white">
                <div className="w-16 h-16 mx-auto mb-6 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <MessageCircle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Live Chat</h3>
                <p className="text-blue-100 mb-4">Get instant help from our support team</p>
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  Start Chat
                </Button>
              </div>

              <div className="text-center text-white">
                <div className="w-16 h-16 mx-auto mb-6 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Mail className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Email Support</h3>
                <p className="text-blue-100 mb-4">Send us a detailed message</p>
                <Link href="/contact">
                  <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                    Send Email
                  </Button>
                </Link>
              </div>

              <div className="text-center text-white">
                <div className="w-16 h-16 mx-auto mb-6 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Phone className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Phone Support</h3>
                <p className="text-blue-100 mb-4">Speak directly with our team</p>
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  Call Now
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container mx-auto text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">Ready to Start Tracking?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Join millions of users who trust Wayfinder for reliable package tracking.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                  >
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-blue-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Package className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">Wayfinder</span>
              </div>
              <p className="text-gray-600">
                The most advanced package tracking platform trusted by millions worldwide.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="/about" className="hover:text-blue-600">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-blue-600">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-blue-600">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="/contact" className="hover:text-blue-600">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-blue-600">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-blue-600">
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="#" className="hover:text-blue-600">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-600">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-600">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2024 Wayfinder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
