"use client"

import { MainHeader } from "@/components/ui/main-header"
import { PremiumCard } from "@/components/ui/premium-card"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { FloatingElements } from "@/components/ui/floating-elements"
import { Package, Check, Star, Zap, Shield, Globe } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for personal use and small shipments",
      features: [
        "Track up to 10 packages/month",
        "Basic tracking updates",
        "Email notifications",
        "Mobile app access",
        "Standard support",
      ],
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
      popular: false,
    },
    {
      name: "Professional",
      price: "$19",
      period: "/month",
      description: "Ideal for small businesses and frequent shippers",
      features: [
        "Track up to 500 packages/month",
        "Real-time GPS tracking",
        "SMS & email notifications",
        "API access",
        "Priority support",
        "Custom branding",
        "Analytics dashboard",
      ],
      buttonText: "Start Free Trial",
      buttonVariant: "default" as const,
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large businesses with high-volume needs",
      features: [
        "Unlimited package tracking",
        "Advanced analytics",
        "White-label solution",
        "Dedicated account manager",
        "24/7 phone support",
        "Custom integrations",
        "SLA guarantee",
        "Multi-user management",
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
      popular: false,
    },
  ]

  const faqs = [
    {
      question: "Can I change my plan at any time?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing adjustments.",
    },
    {
      question: "Is there a free trial available?",
      answer:
        "Yes, we offer a 14-day free trial for our Professional plan. No credit card required to start your trial.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers for Enterprise customers.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "Yes, we offer a 30-day money-back guarantee for all paid plans. Contact our support team for assistance.",
    },
    {
      question: "Can I track international packages?",
      answer: "We support package tracking in over 200 countries and territories worldwide.",
    },
    {
      question: "Is there an API available?",
      answer: "Yes, our Professional and Enterprise plans include full API access with comprehensive documentation.",
    },
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
            <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">Simple, Transparent Pricing</h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Choose the perfect plan for your tracking needs. Start free and scale as you grow.
            </p>
            <div className="flex items-center justify-center gap-4 mb-8">
              <Badge className="bg-green-100 text-green-800">
                <Check className="h-3 w-3 mr-1" />
                14-day free trial
              </Badge>
              <Badge className="bg-blue-100 text-blue-800">
                <Shield className="h-3 w-3 mr-1" />
                No setup fees
              </Badge>
              <Badge className="bg-purple-100 text-purple-800">
                <Zap className="h-3 w-3 mr-1" />
                Cancel anytime
              </Badge>
            </div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                <PremiumCard key={index} className={`relative ${plan.popular ? "ring-2 ring-blue-500 scale-105" : ""}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                        <Star className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold gradient-text">{plan.price}</span>
                      {plan.period && <span className="text-gray-600">{plan.period}</span>}
                    </div>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/auth" className="block">
                    <Button
                      className={`w-full ${
                        plan.buttonVariant === "default"
                          ? "bg-gradient-to-r from-blue-600 to-purple-600"
                          : "border-blue-200 text-blue-600 hover:bg-blue-50"
                      }`}
                      variant={plan.buttonVariant}
                      size="lg"
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>
                </PremiumCard>
              ))}
            </div>
          </div>
        </section>

        {/* Features Comparison */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose Wayfinder?</h2>
              <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                Advanced features that set us apart from the competition.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center text-white">
                <div className="w-16 h-16 mx-auto mb-6 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Globe className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Global Coverage</h3>
                <p className="text-blue-100">Track packages in 200+ countries with real-time updates.</p>
              </div>

              <div className="text-center text-white">
                <div className="w-16 h-16 mx-auto mb-6 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Zap className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
                <p className="text-blue-100">Get updates in real-time with our advanced tracking technology.</p>
              </div>

              <div className="text-center text-white">
                <div className="w-16 h-16 mx-auto mb-6 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Enterprise Security</h3>
                <p className="text-blue-100">Bank-level security with 99.9% uptime guarantee.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600">Everything you need to know about our pricing and features.</p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <PremiumCard key={index}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </PremiumCard>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container mx-auto text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">Ready to Get Started?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Join thousands of businesses that trust Wayfinder for their package tracking needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
                    Start Free Trial
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                  >
                    Contact Sales
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
