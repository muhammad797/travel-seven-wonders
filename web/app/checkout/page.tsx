"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Lock } from "lucide-react"
import { MOCK_FLIGHTS } from "@/lib/mock-data"
import type { Traveler, Booking, HotelStay } from "@/lib/types"

export default function CheckoutPage() {
  const router = useRouter()
  const [bookingData, setBookingData] = useState<any>(null)
  const [hotelStays, setHotelStays] = useState<HotelStay[]>([])
  const [travelers, setTravelers] = useState<Traveler[]>([])
  const [contactEmail, setContactEmail] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvv, setCardCvv] = useState("")
  const [cardName, setCardName] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const data = localStorage.getItem("bookingData")
    const stays = localStorage.getItem("hotelStays")

    if (data) {
      const parsed = JSON.parse(data)
      setBookingData(parsed)

      // Initialize traveler forms
      const numTravelers = Number.parseInt(parsed.travelers || "1")
      setTravelers(
        Array(numTravelers)
          .fill(null)
          .map(() => ({
            firstName: "",
            lastName: "",
            dateOfBirth: "",
            passportNumber: "",
            email: "",
            phone: "",
          })),
      )
    }

    if (stays) {
      setHotelStays(JSON.parse(stays))
    }
  }, [])

  const flight = MOCK_FLIGHTS.find((f) => f.id === bookingData?.flight)

  const updateTraveler = (index: number, field: keyof Traveler, value: string) => {
    const updated = [...travelers]
    updated[index] = { ...updated[index], [field]: value }
    setTravelers(updated)
  }

  const flightTotal = (flight?.price || 0) * travelers.length
  const hotelTotal = hotelStays.reduce((sum, stay) => sum + stay.totalPrice, 0)
  const subtotal = flightTotal + hotelTotal
  const taxes = Math.round(subtotal * 0.08)
  const fees = 25
  const total = subtotal + taxes + fees

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Validate travelers
    for (const traveler of travelers) {
      if (!traveler.firstName || !traveler.lastName || !traveler.dateOfBirth) {
        alert("Please fill in all traveler information")
        setIsProcessing(false)
        return
      }
    }

    // Validate contact details
    if (!contactEmail || !contactPhone) {
      alert("Please provide contact details")
      setIsProcessing(false)
      return
    }

    // Validate payment
    if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
      alert("Please provide payment details")
      setIsProcessing(false)
      return
    }

    // Simulate revalidation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Create booking
    const booking: Booking = {
      id: `BK${Date.now()}`,
      bookingNumber: `CT${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      flight: flight!,
      hotelStays,
      travelers,
      contactDetails: {
        email: contactEmail,
        phone: contactPhone,
      },
      pricing: {
        flightPrice: flightTotal,
        hotelPrice: hotelTotal,
        taxes,
        fees,
        total,
      },
      cancellationAllowed: true,
      changeAllowed: true,
    }

    // Save booking
    const existingBookings = localStorage.getItem("bookings")
    const bookings = existingBookings ? JSON.parse(existingBookings) : []
    bookings.push(booking)
    localStorage.setItem("bookings", JSON.stringify(bookings))

    // Clear booking data
    localStorage.removeItem("bookingData")
    localStorage.removeItem("hotelStays")

    setIsProcessing(false)
    router.push(`/confirmation?bookingNumber=${booking.bookingNumber}`)
  }

  if (!bookingData || !flight) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-12 max-w-6xl text-center">
          <p>No booking found. Please start a new search.</p>
          <Button onClick={() => router.push("/")} className="mt-4">
            Start New Search
          </Button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Complete Your Booking</h1>
          <p className="text-muted-foreground">Enter traveler details and payment information</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
            {/* Left Column - Forms */}
            <div className="space-y-6">
              {/* Traveler Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Traveler Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {travelers.map((traveler, index) => (
                    <div key={index} className="space-y-4">
                      {index > 0 && <Separator />}
                      <h3 className="font-semibold">
                        Traveler {index + 1} {index === 0 && "(Primary Contact)"}
                      </h3>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor={`first-name-${index}`}>First Name *</Label>
                          <Input
                            id={`first-name-${index}`}
                            value={traveler.firstName}
                            onChange={(e) => updateTraveler(index, "firstName", e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`last-name-${index}`}>Last Name *</Label>
                          <Input
                            id={`last-name-${index}`}
                            value={traveler.lastName}
                            onChange={(e) => updateTraveler(index, "lastName", e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor={`dob-${index}`}>Date of Birth *</Label>
                          <Input
                            id={`dob-${index}`}
                            type="date"
                            value={traveler.dateOfBirth}
                            onChange={(e) => updateTraveler(index, "dateOfBirth", e.target.value)}
                            max={new Date().toISOString().split("T")[0]}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`passport-${index}`}>Passport Number</Label>
                          <Input
                            id={`passport-${index}`}
                            value={traveler.passportNumber}
                            onChange={(e) => updateTraveler(index, "passportNumber", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Contact Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                    <p className="text-xs text-muted-foreground">Booking confirmation will be sent to this email</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-accent" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-name">Cardholder Name *</Label>
                    <Input
                      id="card-name"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Name on card"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number *</Label>
                    <div className="relative">
                      <Input
                        id="card-number"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                      />
                      <CreditCard className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="card-expiry">Expiry Date *</Label>
                      <Input
                        id="card-expiry"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="card-cvv">CVV *</Label>
                      <Input
                        id="card-cvv"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="123"
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    <span>Your payment information is secure and encrypted</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Summary */}
            <aside>
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Flight */}
                  <div>
                    <h4 className="font-semibold mb-2">Flight</h4>
                    <div className="text-sm space-y-1">
                      <p className="font-medium">{flight.airline}</p>
                      <p className="text-muted-foreground">
                        {flight.departure.airport.code} → {flight.arrival.airport.code}
                      </p>
                      <p className="text-muted-foreground">
                        {new Date(flight.departure.time).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Hotels */}
                  {hotelStays.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-semibold mb-2">Hotels</h4>
                        <div className="space-y-3">
                          {hotelStays.map((stay) => (
                            <div key={stay.id} className="text-sm space-y-1">
                              <p className="font-medium">{stay.hotel.name}</p>
                              <p className="text-muted-foreground">
                                {new Date(stay.checkIn).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}{" "}
                                -{" "}
                                {new Date(stay.checkOut).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                              <p className="text-muted-foreground">{stay.nights} nights</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Flight ({travelers.length} travelers)</span>
                      <span>${flightTotal}</span>
                    </div>
                    {hotelTotal > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Hotels</span>
                        <span>${hotelTotal}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Taxes (8%)</span>
                      <span>${taxes}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Booking Fee</span>
                      <span>${fees}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${total}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    {isProcessing ? "Processing..." : `Pay $${total}`}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By completing this booking, you agree to our terms and conditions
                  </p>
                </CardContent>
              </Card>
            </aside>
          </div>
        </form>
      </main>
    </div>
  )
}
