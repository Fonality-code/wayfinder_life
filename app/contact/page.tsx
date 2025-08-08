"use client"

import { MainHeader } from "@/components/ui/main-header"
import { PremiumCard } from "@/components/ui/premium-card"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { FloatingElements } from "@/components/ui/floating-elements"
import { Package, Mail, Phone, MapPin, Clock, Send } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Get in touch via email",
      contact: "hello@wayfinder.com",
      action: "mailto:hello@wayfinder.com",
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak with our team",
      contact: "+1 (555) 123-4567",
      action: "tel:+15551234567",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Our headquarters",
      contact: "123 Tech Street, San Francisco, CA 94105",
      action: "#",
    },
    {
      icon: Clock,
      title: "Business Hours",
      description: "We're here to help",
      contact: "Mon-Fri: 9AM-6PM PST",
      action: "#",
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
            <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">Get in Touch</h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Have questions about Wayfinder? We'd love to hear from you. Send us a message and we'll respond as soon as
              possible.
            </p>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {contactInfo.map((info, index) => (
                <PremiumCard
                  key={index}
                  className="text-center group hover:scale-105 transition-transform duration-300"
                >
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <info.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{info.title}</h3>
                  <p className="text-gray-600 mb-3">{info.description}</p>
                  {info.action.startsWith("#") ? (
                    <p className="text-blue-600 font-medium">{info.contact}</p>
                  ) : (
                    <a href={info.action} className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
                      {info.contact}
                    </a>
                  )}
                </PremiumCard>
              ))}
            </div>

            {/* Contact Form */}
            <div className="max-w-2xl mx-auto">
              <PremiumCard className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold gradient-text mb-2">Send us a Message</h2>
                  <p className="text-gray-600">We'll get back to you within 24 hours</p>
                </div>

                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" className="mt-1" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="company">Company (Optional)</Label>
                    <Input id="company" placeholder="Your Company" className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="How can we help you?" className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Tell us more about your inquiry..." rows={6} className="mt-1" />
                  </div>

                  <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </PremiumCard>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Quick Answers</h2>
              <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                Looking for immediate help? Check out these common questions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="text-white">
                <h3 className="text-xl font-bold mb-3">How do I track my package?</h3>
                <p className="text-blue-100 mb-6">
                  Simply enter your tracking number on our homepage or use our mobile app for real-time updates.
                </p>
              </div>

              <div className="text-white">
                <h3 className="text-xl font-bold mb-3">What carriers do you support?</h3>
                <p className="text-blue-100 mb-6">
                  We support all major carriers including FedEx, UPS, DHL, USPS, and 200+ international carriers.
                </p>
              </div>

              <div className="text-white">
                <h3 className="text-xl font-bold mb-3">Is there a mobile app?</h3>
                <p className="text-blue-100 mb-6">
                  Yes! Download our mobile app from the App Store or Google Play for tracking on the go.
                </p>
              </div>

              <div className="text-white">
                <h3 className="text-xl font-bold mb-3">Do you offer API access?</h3>
                <p className="text-blue-100 mb-6">
                  Our Professional and Enterprise plans include full API access with documentation.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link href="/help">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Visit Help Center
                </Button>
              </Link>
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
