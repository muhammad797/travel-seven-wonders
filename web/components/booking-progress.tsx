"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { CheckCircle2, Plane, Hotel, FileCheck, CreditCard, Calendar, Users, MapPin, ArrowRight, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { AIRPORTS, SEVEN_WONDERS } from "@/lib/mock-data"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useBooking } from "@/lib/contexts"

interface BookingProgressProps {
  className?: string
}

type Stage = "search" | "flight" | "hotel" | "confirm" | "pay"

const STAGES: Array<{ id: Stage; label: string; icon: typeof Plane }> = [
  { id: "search", label: "Search", icon: MapPin },
  { id: "flight", label: "Select Flight", icon: Plane },
  { id: "hotel", label: "Select Hotel", icon: Hotel },
  { id: "confirm", label: "Confirm", icon: FileCheck },
  { id: "pay", label: "Pay", icon: CreditCard },
]

export default function BookingProgress({ className }: BookingProgressProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { searchData, selectedFlight, hotelStays, clearBooking } = useBooking()
  const [currentStage, setCurrentStage] = useState<Stage>("search")

  // Determine current stage based on pathname
  useEffect(() => {
    if (pathname?.startsWith("/book/")) {
      setCurrentStage("search")
    } else if (pathname === "/flights") {
      setCurrentStage("flight")
    } else if (pathname === "/hotels") {
      setCurrentStage("hotel")
    } else if (pathname === "/checkout") {
      setCurrentStage("confirm")
    } else if (pathname === "/confirmation") {
      setCurrentStage("pay")
    }
  }, [pathname])


  // Check if we're on a booking-related page
  const isBookingPage =
    pathname?.startsWith("/book/") ||
    pathname === "/flights" ||
    pathname === "/hotels" ||
    pathname === "/checkout" ||
    pathname === "/confirmation"

  if (!isBookingPage) {
    return null
  }

  const getStageStatus = (stageId: Stage): "completed" | "current" | "upcoming" => {
    const stageIndex = STAGES.findIndex((s) => s.id === stageId)
    const currentIndex = STAGES.findIndex((s) => s.id === currentStage)

    if (stageIndex < currentIndex) return "completed"
    if (stageIndex === currentIndex) return "current"
    return "upcoming"
  }

  const handleStageClick = (stage: typeof STAGES[0]) => {
    const stageIndex = STAGES.findIndex((s) => s.id === stage.id)
    const currentIndex = STAGES.findIndex((s) => s.id === currentStage)

    // Only allow navigation to completed or current stages
    if (stageIndex > currentIndex) return

    if (stage.id === "search") {
      // Navigate back to search - need wonderId from searchData
      if (searchData?.wonderId) {
        router.push(`/book/${searchData.wonderId}`)
      } else {
        router.push("/")
      }
    } else if (stage.id === "flight") {
      // Navigate to flights with search params
      if (searchData) {
        const params = new URLSearchParams({
          origin: searchData.origin || "",
          wonderId: searchData.wonderId || "",
          destination: searchData.destination || "",
          departDate: searchData.departDate || "",
          ...(searchData.returnDate && { returnDate: searchData.returnDate }),
          travelers: searchData.travelers || "1",
        })
        router.push(`/flights?${params.toString()}`)
      }
    } else if (stage.id === "hotel") {
      router.push("/hotels")
    } else if (stage.id === "confirm" || stage.id === "pay") {
      router.push("/checkout")
    }
  }

  // Get summary data
  const originAirport = searchData?.origin ? AIRPORTS.find((a) => a.code === searchData.origin) : null
  const wonder = searchData?.wonderId ? SEVEN_WONDERS.find((w) => w.id === searchData.wonderId) : null
  const destinationAirport = wonder ? wonder.airport : searchData?.destination ? AIRPORTS.find((a) => a.code === searchData.destination) : null
  const flightDetails = selectedFlight

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const formatTime = (dateString: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }

  const handleCancelBooking = () => {
    if (confirm("Are you sure you want to cancel this booking? All your selections will be lost.")) {
      clearBooking()
      router.push("/")
    }
  }

  const renderStageContent = (stage: typeof STAGES[0]) => {
    const status = getStageStatus(stage.id)

    switch (stage.id) {
      case "search":
        if (status === "upcoming" && !searchData) return null
        return (
          <div className="space-y-1.5 text-sm">
            {(searchData?.originCity || originAirport) && (searchData?.destinationCity || destinationAirport) && (
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted/50 rounded px-2 py-1.5 text-center">
                  <p className="font-semibold text-xs text-muted-foreground">From</p>
                  <p className="font-medium">{searchData?.originCity || originAirport?.city || searchData?.origin}</p>
                  {originAirport && (
                    <p className="text-xs text-muted-foreground">{originAirport.code}</p>
                  )}
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 bg-muted/50 rounded px-2 py-1.5 text-center">
                  <p className="font-semibold text-xs text-muted-foreground">To</p>
                  <p className="font-medium">
                    {wonder ? wonder.name : (searchData?.destinationCity || destinationAirport?.city || searchData?.destination)}
                  </p>
                  {destinationAirport && (
                    <p className="text-xs text-muted-foreground">{destinationAirport.code}</p>
                  )}
                </div>
              </div>
            )}
            {searchData?.departDate && (
              <div className="flex items-center gap-2 text-xs">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {formatDate(searchData.departDate)}
                  {searchData.returnDate && ` - ${formatDate(searchData.returnDate)}`}
                </span>
              </div>
            )}
            {searchData?.travelers && (
              <div className="flex items-center gap-2 text-xs">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {searchData.travelers} {Number.parseInt(searchData.travelers) === 1 ? "traveler" : "travelers"}
                </span>
              </div>
            )}
          </div>
        )

      case "flight":
        if (status === "upcoming" && !flightDetails) return null
        if (!flightDetails) {
          return <p className="text-sm text-muted-foreground">No flight selected</p>
        }
        // Use city names from searchData if available, otherwise use flight details
        const departureCity = searchData?.originCity || flightDetails.departure.city || flightDetails.departure.airport
        const arrivalCity = searchData?.destinationCity || flightDetails.arrival.city || flightDetails.arrival.airport
        
        return (
          <div className="space-y-1.5 text-sm">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-muted/50 rounded px-2 py-1.5 text-center">
                <p className="font-semibold text-xs text-muted-foreground">From</p>
                <p className="font-medium">{departureCity}</p>
                {flightDetails.departure.airport && (
                  <p className="text-xs text-muted-foreground">{flightDetails.departure.airport}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">{formatTime(flightDetails.departure.time)}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 bg-muted/50 rounded px-2 py-1.5 text-center">
                <p className="font-semibold text-xs text-muted-foreground">To</p>
                <p className="font-medium">{arrivalCity}</p>
                {flightDetails.arrival.airport && (
                  <p className="text-xs text-muted-foreground">{flightDetails.arrival.airport}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">{formatTime(flightDetails.arrival.time)}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-muted-foreground">{flightDetails.airline} {flightDetails.flightNumber}</span>
              <span className="font-medium">${flightDetails.price.toFixed(2)}</span>
            </div>
          </div>
        )

      case "hotel":
        if (status === "upcoming" && hotelStays.length === 0) return null
        if (hotelStays.length === 0) {
          return <p className="text-sm text-muted-foreground">No hotels selected</p>
        }
        return (
          <div className="space-y-2 text-sm">
            {hotelStays.slice(0, 2).map((stay, idx) => (
              <div key={stay.id || idx} className="bg-muted/50 rounded px-2 py-1.5">
                <p className="font-medium text-xs">{stay.hotel?.name || "Hotel"}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(stay.checkIn)} - {formatDate(stay.checkOut)}
                </p>
              </div>
            ))}
            {hotelStays.length > 2 && (
              <p className="text-xs text-muted-foreground">+{hotelStays.length - 2} more</p>
            )}
          </div>
        )

      case "confirm":
        return (
          <div className="text-sm text-muted-foreground">
            {status === "upcoming" ? "Review your booking details" : "Ready to confirm"}
          </div>
        )

      case "pay":
        return (
          <div className="text-sm text-muted-foreground">
            {status === "upcoming" ? "Complete payment" : "Payment completed"}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={cn("w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60", className)}>
      <div className="container mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-muted-foreground">Booking Journey</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancelBooking}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4 mr-1.5" />
            Cancel Booking
          </Button>
        </div>
        <div className="flex items-stretch gap-3 overflow-x-auto pb-2">
          {STAGES.map((stage, index) => {
            const status = getStageStatus(stage.id)
            const Icon = stage.icon
            const isClickable = status === "completed" || status === "current"
            const content = renderStageContent(stage)

            return (
              <div key={stage.id} className="flex items-center flex-shrink-0">
                <button
                  onClick={() => isClickable && handleStageClick(stage)}
                  disabled={!isClickable}
                  className={cn(
                    "flex flex-col h-full min-w-[180px] max-w-[220px] rounded-lg border-2 transition-all text-left",
                    status === "completed" && "bg-accent/5 border-accent cursor-pointer hover:bg-accent/10",
                    status === "current" && "bg-accent/10 border-accent shadow-sm",
                    status === "upcoming" && "bg-muted/30 border-muted-foreground/30 cursor-not-allowed opacity-60",
                    !isClickable && "cursor-not-allowed"
                  )}
                >
                  <div className="p-3 pb-2 border-b border-border/50">
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className={cn(
                          "flex items-center justify-center w-7 h-7 rounded-full border-2 transition-all flex-shrink-0",
                          status === "completed" && "bg-accent border-accent text-accent-foreground",
                          status === "current" && "bg-accent border-accent text-accent-foreground",
                          status === "upcoming" && "bg-muted border-muted-foreground/30 text-muted-foreground"
                        )}
                      >
                        {status === "completed" ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          status === "completed" && "text-accent",
                          status === "current" && "text-accent",
                          status === "upcoming" && "text-muted-foreground"
                        )}
                      >
                        {stage.label}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 pt-2 flex-1">
                    {content || (
                      <p className="text-xs text-muted-foreground italic">Not started</p>
                    )}
                  </div>
                </button>
                {index < STAGES.length - 1 && (
                  <div className="flex items-center mx-1 flex-shrink-0">
                    <ArrowRight className="h-4 w-4 text-muted-foreground/50" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
