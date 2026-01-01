"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Download, Mail, Plane, Hotel, Users } from "lucide-react"
import type { Booking } from "@/lib/types"

function ConfirmationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingNumber = searchParams.get("bookingNumber")

  const [booking, setBooking] = useState<Booking | null>(null)

  useEffect(() => {
    if (!bookingNumber) {
      router.push("/")
      return
    }

    const bookings = localStorage.getItem("bookings")
    if (bookings) {
      const allBookings: Booking[] = JSON.parse(bookings)
      const found = allBookings.find((b) => b.bookingNumber === bookingNumber)
      if (found) {
        setBooking(found)
      }
    }
  }, [bookingNumber, router])

  if (!booking) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-12 max-w-6xl text-center">
          <p>Loading booking...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Success Message */}
          <Card className="border-accent">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center">
                    <CheckCircle2 className="h-10 w-10 text-accent" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
                  <p className="text-muted-foreground">
                    Your trip to Rome has been successfully booked. A confirmation email has been sent to{" "}
                    {booking.contactDetails.email}
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-lg">
                  <span className="text-sm text-muted-foreground">Booking Number:</span>
                  <span className="font-mono font-bold text-lg">{booking.bookingNumber}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Itinerary Details */}
          <Card>
            <CardHeader>
              <CardTitle>Your Itinerary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Flight Details */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Plane className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-semibold text-lg">Flight</h3>
                </div>

                <div className="ml-12 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Airline</span>
                    <span className="font-medium">{booking.flight.airline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Flight Number</span>
                    <span className="font-medium">{booking.flight.flightNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Route</span>
                    <span className="font-medium">
                      {booking.flight.departure.airport.code} → {booking.flight.arrival.airport.code}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Departure</span>
                    <span className="font-medium">
                      {new Date(booking.flight.departure.time).toLocaleString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Arrival</span>
                    <span className="font-medium">
                      {new Date(booking.flight.arrival.time).toLocaleString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hotel Stays */}
              {booking.hotelStays.length > 0 && (
                <>
                  <Separator />
                  {booking.hotelStays.map((stay, index) => (
                    <div key={stay.id}>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                          <Hotel className="h-5 w-5 text-accent" />
                        </div>
                        <h3 className="font-semibold text-lg">Hotel Stay {index + 1}</h3>
                      </div>

                      <div className="ml-12 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Hotel</span>
                          <span className="font-medium">{stay.hotel.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Room Type</span>
                          <span className="font-medium">{stay.room.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Check-in</span>
                          <span className="font-medium">
                            {new Date(stay.checkIn).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Check-out</span>
                          <span className="font-medium">
                            {new Date(stay.checkOut).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Nights</span>
                          <span className="font-medium">{stay.nights}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Guests</span>
                          <span className="font-medium">{stay.guests}</span>
                        </div>
                      </div>
                      {index < booking.hotelStays.length - 1 && <Separator className="mt-6" />}
                    </div>
                  ))}
                </>
              )}

              <Separator />

              {/* Travelers */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-semibold text-lg">Travelers</h3>
                </div>

                <div className="ml-12 space-y-2">
                  {booking.travelers.map((traveler, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-muted-foreground">
                        Traveler {index + 1} {index === 0 && "(Primary)"}
                      </span>
                      <span className="font-medium">
                        {traveler.firstName} {traveler.lastName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Flight</span>
                  <span>${booking.pricing.flightPrice}</span>
                </div>
                {booking.pricing.hotelPrice > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Hotels</span>
                    <span>${booking.pricing.hotelPrice}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxes</span>
                  <span>${booking.pricing.taxes}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fees</span>
                  <span>${booking.pricing.fees}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Paid</span>
                  <span>${booking.pricing.total}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button variant="outline" className="flex-1 bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              <Mail className="h-4 w-4 mr-2" />
              Email Itinerary
            </Button>
          </div>

          <div className="flex gap-4">
            <Button onClick={() => router.push("/my-trips")} className="flex-1 bg-accent hover:bg-accent/90">
              View My Trips
            </Button>
            <Button onClick={() => router.push("/")} variant="outline" className="flex-1">
              Book Another Trip
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  )
}
