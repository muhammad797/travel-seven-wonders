"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plane, Hotel, Phone, Mail, MessageSquare, AlertCircle, ChevronRight, XCircle, Edit3 } from "lucide-react"
import type { Booking } from "@/lib/types"
import { CONTACT_INFO } from "@/lib/constants"

export default function MyTripsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [supportReason, setSupportReason] = useState<"cancel" | "change" | "support" | null>(null)
  const [supportMessage, setSupportMessage] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("bookings")
    if (stored) {
      setBookings(JSON.parse(stored))
    }
  }, [])

  const handleSupportRequest = () => {
    if (!selectedBooking || !supportReason || !supportMessage.trim()) {
      alert("Please provide details for your request")
      return
    }

    // Simulate support request submission
    alert(
      `Your ${supportReason} request for booking ${selectedBooking.bookingNumber} has been submitted. Our support team will contact you at ${selectedBooking.contactDetails.email} within 24 hours.`,
    )

    setSupportReason(null)
    setSupportMessage("")
    setSelectedBooking(null)
    setIsDialogOpen(false)
  }

  const openSupportDialog = (booking: Booking, reason: "cancel" | "change" | "support") => {
    setSelectedBooking(booking)
    setSupportReason(reason)
    setIsDialogOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-12 max-w-6xl">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-12 text-center">
              <Plane className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-2">No trips yet</h2>
              <p className="text-muted-foreground mb-6">Start planning your adventure to Rome and the Colosseum</p>
              <Button onClick={() => router.push("/")} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Book a Trip
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">My Trips</h1>
          <p className="text-muted-foreground">View and manage your bookings</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
          {/* Bookings List */}
          <div className="space-y-6">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="mb-2">Rome Trip</CardTitle>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="font-mono">{booking.bookingNumber}</span>
                        <span>·</span>
                        <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                      </div>
                    </div>
                    <span className="text-2xl font-bold">${booking.pricing.total}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Flight */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Plane className="h-5 w-5 text-accent" />
                      <h4 className="font-semibold">Flight</h4>
                    </div>
                    <div className="ml-7 space-y-1 text-sm">
                      <p className="font-medium">
                        {booking.flight.airline} {booking.flight.flightNumber}
                      </p>
                      <p className="text-muted-foreground">
                        {booking.flight.departure.airport.code} → {booking.flight.arrival.airport.code}
                      </p>
                      <p className="text-muted-foreground">
                        {new Date(booking.flight.departure.time).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Hotels */}
                  {booking.hotelStays.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Hotel className="h-5 w-5 text-accent" />
                          <h4 className="font-semibold">Hotels ({booking.hotelStays.length})</h4>
                        </div>
                        <div className="ml-7 space-y-3">
                          {booking.hotelStays.slice(0, 2).map((stay) => (
                            <div key={stay.id} className="text-sm">
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
                                })}{" "}
                                · {stay.nights} nights
                              </p>
                            </div>
                          ))}
                          {booking.hotelStays.length > 2 && (
                            <p className="text-sm text-muted-foreground">+{booking.hotelStays.length - 2} more</p>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  <Separator />

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/confirmation?bookingNumber=${booking.bookingNumber}`)}
                    >
                      View Details
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>

                    {booking.changeAllowed && booking.status === "confirmed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openSupportDialog(booking, "change")}
                        className="bg-transparent"
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Request Change
                      </Button>
                    )}

                    {booking.cancellationAllowed && booking.status === "confirmed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openSupportDialog(booking, "cancel")}
                        className="bg-transparent text-destructive hover:text-destructive"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Request Cancellation
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Support Sidebar */}
          <aside>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-accent" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3 text-sm">Contact Support</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <p className="text-sm text-muted-foreground">{CONTACT_INFO.support.phoneDisplay}</p>
                        <p className="text-xs text-muted-foreground mt-1">{CONTACT_INFO.support.availability}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{CONTACT_INFO.support.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">{CONTACT_INFO.support.responseTime}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Live Chat</p>
                        <Button size="sm" variant="link" className="h-auto p-0 text-accent">
                          Start conversation
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-accent" />
                    Important Information
                  </h4>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div>
                      <p className="font-medium text-foreground mb-1">Cancellation Policy</p>
                      <p className="text-xs">Free cancellation up to 48 hours before departure. 50% refund after.</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-1">Change Policy</p>
                      <p className="text-xs">Changes allowed up to 24 hours before departure with applicable fees.</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-1">Travel Requirements</p>
                      <p className="text-xs">Valid passport required. Check visa requirements for your country.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>

      {/* Support Request Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {supportReason === "cancel" && "Request Cancellation"}
              {supportReason === "change" && "Request Change"}
              {supportReason === "support" && "Contact Support"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedBooking && (
              <div className="rounded-lg bg-secondary p-3">
                <p className="text-sm font-medium mb-1">Booking: {selectedBooking.bookingNumber}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedBooking.flight.departure.airport.code} → {selectedBooking.flight.arrival.airport.code} ·{" "}
                  {new Date(selectedBooking.flight.departure.time).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="message">
                {supportReason === "cancel"
                  ? "Please tell us why you'd like to cancel"
                  : supportReason === "change"
                    ? "What changes would you like to make?"
                    : "How can we help you?"}
              </Label>
              <Textarea
                id="message"
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                placeholder="Provide details about your request..."
                rows={5}
              />
            </div>

            {supportReason === "cancel" && (
              <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-900 dark:text-yellow-200 mb-1">Cancellation Policy</p>
                    <p className="text-yellow-800 dark:text-yellow-300 text-xs">
                      Cancellations made less than 48 hours before departure may incur fees. Our team will review your
                      request and contact you with details.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false)
                  setSupportMessage("")
                  setSupportReason(null)
                  setSelectedBooking(null)
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSupportRequest}
                className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Submit Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
