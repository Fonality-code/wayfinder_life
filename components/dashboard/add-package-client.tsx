"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Package,
  Plus,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Info
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

const popularCarriers = [
  { value: "ups", label: "UPS" },
  { value: "fedex", label: "FedEx" },
  { value: "usps", label: "USPS" },
  { value: "dhl", label: "DHL" },
  { value: "amazon", label: "Amazon Logistics" },
  { value: "other", label: "Other" }
]

export default function AddPackageClient() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    tracking_number: "",
    carrier: "",
    custom_carrier: "",
    expected_from: "",
    description: "",
    notes: "",
    transport_type: "",
    payment_amount: "",
    payment_method: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.tracking_number.trim()) {
      toast({
        title: "Error",
        description: "Please enter a tracking number",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const carrier = formData.carrier === "other"
        ? formData.custom_carrier
        : formData.carrier || "Unknown"

      const response = await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tracking_number: formData.tracking_number.trim(),
          carrier,
          expected_from: formData.expected_from.trim() || null,
          description: formData.description.trim() || null,
          notes: formData.notes.trim() || null,
          transport_type: formData.transport_type || null,
          payment_amount: formData.payment_amount ? parseFloat(formData.payment_amount) : null,
          payment_method: formData.payment_method || null
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Package added successfully. You can now track its progress.",
        })

        // Reset form
        setFormData({
          tracking_number: "",
          carrier: "",
          custom_carrier: "",
          expected_from: "",
          description: "",
          notes: "",
          transport_type: "",
          payment_amount: "",
          payment_method: ""
        })

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to add package. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to add package:", error)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Add Package</h1>
        <p className="text-slate-600 mt-2">
          Add a package you&apos;re expecting to track its delivery progress
        </p>
      </div>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-blue-800 font-medium mb-1">How it works:</p>
              <ul className="text-blue-700 space-y-1">
                <li>• Enter your tracking number from any carrier</li>
                <li>• We&apos;ll automatically start monitoring your package</li>
                <li>• Get real-time updates on your dashboard</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Package Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Package Details
          </CardTitle>
          <CardDescription>
            Enter the tracking information for your package
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tracking Number */}
            <div className="space-y-2">
              <Label htmlFor="tracking_number" className="text-sm font-medium">
                Tracking Number *
              </Label>
              <Input
                id="tracking_number"
                placeholder="e.g., 1Z999AA10123456784"
                value={formData.tracking_number}
                onChange={(e) => handleInputChange("tracking_number", e.target.value)}
                className="font-mono"
                required
              />
              <p className="text-xs text-slate-500">
                Enter the tracking number provided by the carrier
              </p>
            </div>

            {/* Carrier */}
            <div className="space-y-2">
              <Label htmlFor="carrier" className="text-sm font-medium">
                Carrier
              </Label>
              <Select
                value={formData.carrier}
                onValueChange={(value) => handleInputChange("carrier", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select carrier (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {popularCarriers.map((carrier) => (
                    <SelectItem key={carrier.value} value={carrier.value}>
                      {carrier.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {formData.carrier === "other" && (
                <Input
                  placeholder="Enter carrier name"
                  value={formData.custom_carrier}
                  onChange={(e) => handleInputChange("custom_carrier", e.target.value)}
                  className="mt-2"
                />
              )}
            </div>

            {/* Expected From */}
            <div className="space-y-2">
              <Label htmlFor="expected_from" className="text-sm font-medium">
                Expected From
              </Label>
              <Input
                id="expected_from"
                placeholder="e.g., Amazon, Best Buy, John Doe"
                value={formData.expected_from}
                onChange={(e) => handleInputChange("expected_from", e.target.value)}
              />
              <p className="text-xs text-slate-500">
                Who or where is this package coming from? (optional)
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Input
                id="description"
                placeholder="e.g., Electronics, Clothing, Books"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
              <p className="text-xs text-slate-500">
                What&apos;s in this package? (optional)
              </p>
            </div>

            {/* Transport Type */}
            <div className="space-y-2">
              <Label htmlFor="transport_type" className="text-sm font-medium">
                Transport Type
              </Label>
              <Select
                value={formData.transport_type}
                onValueChange={(value) => handleInputChange("transport_type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select transport type (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="air">✈️ Air (Fastest - 1-3 days)</SelectItem>
                  <SelectItem value="truck">🚛 Truck (Standard - 3-7 days)</SelectItem>
                  <SelectItem value="ship">🚢 Ship (Economy - 7-30 days)</SelectItem>
                  <SelectItem value="rail">🚂 Rail (Eco-friendly - 5-10 days)</SelectItem>
                  <SelectItem value="local">🚐 Local Delivery (Same day)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">
                How will this package be transported?
              </p>
            </div>

            {/* Payment Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="payment_method" className="text-sm font-medium">
                  Payment Method
                </Label>
                <Select
                  value={formData.payment_method}
                  onValueChange={(value) => handleInputChange("payment_method", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="How did you pay?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit_card">💳 Credit Card</SelectItem>
                    <SelectItem value="debit_card">💳 Debit Card</SelectItem>
                    <SelectItem value="paypal">💰 PayPal</SelectItem>
                    <SelectItem value="bank_transfer">🏦 Bank Transfer</SelectItem>
                    <SelectItem value="cash">💵 Cash</SelectItem>
                    <SelectItem value="cod">📦 Cash on Delivery</SelectItem>
                    <SelectItem value="prepaid">🎫 Prepaid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment_amount" className="text-sm font-medium">
                  Amount Paid
                </Label>
                <Input
                  id="payment_amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.payment_amount}
                  onChange={(e) => handleInputChange("payment_amount", e.target.value)}
                />
                <p className="text-xs text-slate-500">
                  How much did you pay for shipping?
                </p>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes about this package..."
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard")}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Package
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Recent Packages Hint */}
      <Card className="border-dashed border-2 border-slate-200">
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
          <h3 className="font-medium text-slate-900 mb-1">Track Multiple Packages</h3>
          <p className="text-sm text-slate-600 mb-4">
            You can add multiple packages and track them all from your dashboard
          </p>
          <Button variant="outline" size="sm" onClick={() => router.push("/dashboard")}>
            <ArrowRight className="h-4 w-4 mr-1" />
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
