"use client"

import { useState, useMemo, Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plane, ArrowRight, CircleDot, Loader2, Clock, Heart } from "lucide-react"
import { AIRPORTS, SEVEN_WONDERS } from "@/lib/mock-data"
import { searchFlights, listOfferRequests, type FlightOffer, type OfferRequest } from "@/lib/api"
import type { Flight } from "@/lib/types"
import { useBooking } from "@/lib/contexts"

function FlightSearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { searchData, setSearchData, setSelectedFlight } = useBooking()

  const origin = searchParams.get("origin") || ""
  const wonderId = searchParams.get("wonderId") || ""
  const destinationParam = searchParams.get("destination") || ""
  const departDate = searchParams.get("departDate") || ""
  const returnDate = searchParams.get("returnDate") || ""
  const travelers = searchParams.get("travelers") || "1"

  const originAirport = AIRPORTS.find((a) => a.code === origin)
  const wonder = SEVEN_WONDERS.find((w) => w.id === wonderId)

  // Always use wonder's airport as destination if wonder is selected, otherwise use destination param
  const destination = wonder ? wonder.airport.code : destinationParam
  const destinationAirport = wonder ? wonder.airport : AIRPORTS.find((a) => a.code === destinationParam)

  // Flight data state
  const [flights, setFlights] = useState<Flight[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Offer requests state
  const [offerRequests, setOfferRequests] = useState<OfferRequest[]>([])
  const [isLoadingOfferRequests, setIsLoadingOfferRequests] = useState(false)

  // Filter state
  const [maxPrice, setMaxPrice] = useState(80000) // Price in cents, default $800
  const [selectedStops, setSelectedStops] = useState<number[]>([])
  const [sortBy, setSortBy] = useState("price")
  const [maxDuration, setMaxDuration] = useState(720)

  // Get travel class from URL params (if available)
  const travelClass = searchParams.get("travelClass") || "economy"

  // Map FlightOffer to Flight type
  // For round trips, we show the outbound flight (first segment)
  const mapFlightOfferToFlight = (offer: FlightOffer): Flight & { isRoundTrip?: boolean; returnFlight?: { departure: { airport: { code: string; name: string; city: string }; time: string }; arrival: { airport: { code: string; name: string; city: string }; time: string }; duration: number } } => {
    const firstSegment = offer.segments[0]

    // Find the last segment of the outbound leg
    // For round trips: segments[0] is outbound, segments[1+] are return
    // For one-way: all segments are outbound
    // We need to find where the outbound leg ends (when origin changes from first segment's origin)
    let outboundArrivalSegment = firstSegment
    const outboundOrigin = firstSegment.origin.code
    let returnStartIndex = -1

    for (let i = 1; i < offer.segments.length; i++) {
      const segment = offer.segments[i]
      // If this segment starts from a different origin than the first segment,
      // we've reached the return leg (for round trips)
      if (segment.origin.code !== outboundOrigin) {
        returnStartIndex = i
        break
      }
      // This segment is still part of the outbound leg (connection)
      outboundArrivalSegment = segment
    }

    // Check if it's a round trip
    const isRoundTrip = returnStartIndex >= 0 && returnStartIndex < offer.segments.length

    // Extract return flight info if round trip
    let returnFlight = undefined
    if (isRoundTrip) {
      const returnSegments = offer.segments.slice(returnStartIndex)
      const returnFirstSegment = returnSegments[0]
      const returnLastSegment = returnSegments[returnSegments.length - 1]

      // Calculate return duration
      const returnDuration = returnSegments.reduce((sum, seg) => sum + seg.duration, 0)

      returnFlight = {
        departure: {
          airport: {
            code: returnFirstSegment.origin.code,
            name: returnFirstSegment.origin.name,
            city: returnFirstSegment.origin.city,
          },
          time: returnFirstSegment.departureTime,
        },
        arrival: {
          airport: {
            code: returnLastSegment.destination.code,
            name: returnLastSegment.destination.name,
            city: returnLastSegment.destination.city,
          },
          time: returnLastSegment.arrivalTime,
        },
        duration: returnDuration,
      }
    }

    return {
      id: offer.id,
      airline: firstSegment.airline.name,
      flightNumber: firstSegment.flightNumber,
      departure: {
        airport: {
          code: firstSegment.origin.code,
          name: firstSegment.origin.name,
          city: firstSegment.origin.city,
          country: "", // Not available in API response
        },
        time: firstSegment.departureTime,
      },
      arrival: {
        airport: {
          code: outboundArrivalSegment.destination.code,
          name: outboundArrivalSegment.destination.name,
          city: outboundArrivalSegment.destination.city,
          country: "", // Not available in API response
        },
        time: outboundArrivalSegment.arrivalTime,
      },
      duration: offer.totalDuration,
      stops: offer.stops,
      price: offer.price / 100, // Convert cents to dollars (keep decimals)
      class: offer.cabinClass === "premium_economy" ? "premium-economy" : offer.cabinClass,
      available: true,
      isRoundTrip,
      returnFlight,
    }
  }

  // Update search data in context when component mounts or params change
  useEffect(() => {
    if (origin && destination && departDate) {
      setSearchData({
        origin,
        originCity: originAirport?.city || "",
        originAirportName: originAirport?.name || "",
        originAirportLocation: originAirport ? `${originAirport.city}, ${originAirport.country}` : "",
        wonderId,
        destination: destinationAirport?.code || destination,
        destinationCity: wonder ? wonder.location : (destinationAirport?.city || ""),
        departDate,
        returnDate: returnDate || undefined,
        travelers,
        travelClass,
      })
    }
  }, [origin, wonderId, destination, departDate, returnDate, travelers, travelClass, setSearchData, destinationAirport, originAirport, wonder])

  // Fetch flights when component mounts or search params change
  useEffect(() => {
    if (!origin || !destination || !departDate) {
      setError("Missing required search parameters")
      return
    }

    const fetchFlights = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const adults = parseInt(travelers, 10) || 1
        const cabinClassMap: Record<string, "economy" | "premium_economy" | "business" | "first"> = {
          economy: "economy",
          premium: "premium_economy",
          business: "business",
          first: "first",
        }

        const offers = await searchFlights({
          origin,
          destination,
          departureDate: departDate,
          returnDate: returnDate || undefined,
          adults,
          cabinClass: cabinClassMap[travelClass] || "economy",
        })

        const mappedFlights = offers.map(mapFlightOfferToFlight)
        setFlights(mappedFlights)

        // Set max price based on results if available
        if (mappedFlights.length > 0) {
          const maxFlightPrice = Math.max(...mappedFlights.map((f) => f.price))
          setMaxPrice(Math.max(Math.round(maxFlightPrice * 100), 80000)) // Convert to cents, min $800
        }
      } catch (err) {
        console.error("Error fetching flights:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch flights")
        setFlights([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchFlights()
  }, [origin, destination, departDate, returnDate, travelers, travelClass])

  // Fetch offer requests for current search
  useEffect(() => {
    const fetchOfferRequests = async () => {
      setIsLoadingOfferRequests(true)
      try {
        const response = await listOfferRequests({ limit: 20 })
        // Filter offer requests that match current search criteria
        // Use uppercase for comparison to handle case differences
        const originUpper = origin.toUpperCase()
        const destinationUpper = destination.toUpperCase()

        const matchingRequests = response.data.filter((req) => {
          const firstSlice = req.slices?.[0]
          if (!firstSlice) return false

          // Compare with uppercase to handle case differences
          const reqOrigin = (firstSlice.origin || '').toUpperCase()
          const reqDestination = (firstSlice.destination || '').toUpperCase()

          return (
            reqOrigin === originUpper &&
            reqDestination === destinationUpper &&
            firstSlice.departure_date === departDate
          )
        })

        // Log for debugging - show all requests including invalid ones
        console.log('All offer requests from API:', response.data.map(req => ({
          id: req.id,
          slices: req.slices,
          origin: req.slices[0]?.origin,
          destination: req.slices[0]?.destination,
          departure_date: req.slices[0]?.departure_date,
        })))

        // Log matching requests
        if (matchingRequests.length > 0) {
          console.log('Matching offer requests after filter:', matchingRequests.map(req => ({
            id: req.id,
            origin: req.slices[0]?.origin,
            destination: req.slices[0]?.destination,
            departure_date: req.slices[0]?.departure_date,
          })))
        }

        setOfferRequests(matchingRequests)
      } catch (err) {
        console.error("Error fetching offer requests:", err)
        // Don't show error to user, just log it
      } finally {
        setIsLoadingOfferRequests(false)
      }
    }

    if (origin && destination && departDate) {
      fetchOfferRequests()
    }
  }, [origin, destination, departDate])

  // Filtered and sorted flights
  const filteredFlights = useMemo(() => {
    const filtered = flights.filter((flight) => {
      const priceInCents = flight.price * 100
      if (priceInCents > maxPrice) return false
      if (selectedStops.length > 0 && !selectedStops.includes(flight.stops)) return false
      if (flight.duration > maxDuration) return false
      return true
    })

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "price") return a.price - b.price
      if (sortBy === "duration") return a.duration - b.duration
      if (sortBy === "departure") return new Date(a.departure.time).getTime() - new Date(b.departure.time).getTime()
      return 0
    })

    return filtered
  }, [flights, maxPrice, selectedStops, sortBy, maxDuration])

  const handleSelectFlight = (flight: Flight) => {
    // Update search data in context
    setSearchData({
      origin,
      originCity: originAirport?.city || "",
      originAirportName: originAirport?.name || "",
      originAirportLocation: originAirport ? `${originAirport.city}, ${originAirport.country}` : "",
      wonderId,
      destination: destinationAirport?.code || destination,
      destinationCity: wonder ? wonder.location : (destinationAirport?.city || ""),
      departDate,
      returnDate,
      travelers,
    })

    // Set selected flight in context
    setSelectedFlight({
      id: flight.id,
      airline: flight.airline,
      flightNumber: flight.flightNumber,
      departure: {
        airport: flight.departure.airport.code,
        city: flight.departure.airport.city,
        time: flight.departure.time,
      },
      arrival: {
        airport: flight.arrival.airport.code,
        city: flight.arrival.airport.city,
        time: flight.arrival.time,
      },
      price: flight.price,
    })

    router.push("/hotels")
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      fullDate: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const toggleStops = (stops: number) => {
    setSelectedStops((prev) => (prev.includes(stops) ? prev.filter((s) => s !== stops) : [...prev, stops]))
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Search Summary */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-4">
                  {searchData?.originCity || originAirport?.city || origin} to {wonder ? wonder.name : (searchData?.destinationCity || destinationAirport?.city || destination)}
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* From Location */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">From</p>
                    <p className="font-semibold">{searchData?.originCity || originAirport?.city || origin}</p>
                    {(searchData?.originAirportName || originAirport?.name) && (
                      <p className="text-sm text-muted-foreground">
                        {searchData?.originAirportName || originAirport?.name}
                      </p>
                    )}
                    {(searchData?.originAirportLocation || originAirport) && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {searchData?.originAirportLocation || (originAirport ? `${originAirport.city}, ${originAirport.country}` : "")}
                      </p>
                    )}
                    {!searchData?.originAirportLocation && !originAirport && (
                      <p className="text-sm text-muted-foreground">{origin}</p>
                    )}
                  </div>

                  {/* To Location */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">To</p>
                    <p className="font-semibold">
                      {wonder ? wonder.name : (searchData?.destinationCity || destinationAirport?.city || destination)}
                    </p>
                    {wonder ? (
                      <p className="text-sm text-muted-foreground">
                        {wonder.airport.code} · {wonder.airport.name}
                      </p>
                    ) : destinationAirport ? (
                      <p className="text-sm text-muted-foreground">
                        {destinationAirport.code} · {destinationAirport.name}
                      </p>
                    ) : searchData?.destination ? (
                      <p className="text-sm text-muted-foreground">{searchData.destination}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">{destination}</p>
                    )}
                  </div>

                  {/* Dates */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Departure</p>
                    <p className="font-semibold">{departDate ? formatDate(departDate) : "Not set"}</p>
                    {returnDate && (
                      <>
                        <p className="text-xs text-muted-foreground mt-2 mb-1">Return</p>
                        <p className="font-semibold">{formatDate(returnDate)}</p>
                      </>
                    )}
                    {!returnDate && (
                      <p className="text-sm text-muted-foreground mt-1">One-way</p>
                    )}
                  </div>

                  {/* Passengers & Class */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Passengers</p>
                    <p className="font-semibold">{travelers} {Number.parseInt(travelers) === 1 ? "traveler" : "travelers"}</p>
                    <p className="text-xs text-muted-foreground mt-1 capitalize">{travelClass}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Filters Sidebar */}
          <aside className="space-y-6">
            <Card>
              <CardContent className="p-4 space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">Filters</h3>

                  {/* Sort By */}
                  <div className="mb-6">
                    <Label className="mb-2 block text-sm">Sort by</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="price">Lowest Price</SelectItem>
                        <SelectItem value="duration">Shortest Duration</SelectItem>
                        <SelectItem value="departure">Earliest Departure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Max Price */}
                  <div className="mb-6">
                    <Label className="mb-2 block text-sm">Max Price: ${Math.round(maxPrice / 100)}</Label>
                    <Slider
                      value={[maxPrice]}
                      onValueChange={(value) => setMaxPrice(value[0])}
                      min={0}
                      max={Math.max(maxPrice, 100000)}
                      step={5000}
                      className="mb-2"
                    />
                  </div>

                  {/* Number of Stops */}
                  <div className="mb-6">
                    <Label className="mb-3 block text-sm">Number of Stops</Label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="nonstop"
                          checked={selectedStops.includes(0)}
                          onCheckedChange={() => toggleStops(0)}
                        />
                        <label htmlFor="nonstop" className="text-sm cursor-pointer">
                          Nonstop
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="onestop"
                          checked={selectedStops.includes(1)}
                          onCheckedChange={() => toggleStops(1)}
                        />
                        <label htmlFor="onestop" className="text-sm cursor-pointer">
                          1 Stop
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Max Duration */}
                  <div>
                    <Label className="mb-2 block text-sm">Max Duration: {formatDuration(maxDuration)}</Label>
                    <Slider
                      value={[maxDuration]}
                      onValueChange={(value) => setMaxDuration(value[0])}
                      min={300}
                      max={720}
                      step={30}
                      className="mb-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Offer Requests Section */}
          {offerRequests.length > 0 && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-5 w-5 text-accent" />
                  <h3 className="font-semibold">Your Previous Searches</h3>
                </div>
                <div className="space-y-2">
                  {offerRequests
                    .filter((req) => {
                      const firstSlice = req.slices?.[0]
                      // Filter out invalid offer requests
                      if (!firstSlice || !firstSlice.origin || !firstSlice.destination) {
                        return false
                      }
                      // Filter out offer requests with same origin and destination
                      if (firstSlice.origin.toUpperCase() === firstSlice.destination.toUpperCase()) {
                        console.warn('Filtering out invalid offer request - same origin and destination:', {
                          id: req.id,
                          origin: firstSlice.origin,
                          destination: firstSlice.destination,
                          slices: req.slices,
                        })
                        return false
                      }
                      return true
                    })
                    .slice(0, 5)
                    .map((req) => {
                      const firstSlice = req.slices[0]
                      const secondSlice = req.slices[1] // For round trips
                      const createdDate = new Date(req.created_at)

                      // Build route display
                      const isRoundTrip = !!secondSlice
                      const routeDisplay = isRoundTrip
                        ? `${firstSlice.origin.toUpperCase()} → ${firstSlice.destination.toUpperCase()} → ${firstSlice.origin.toUpperCase()}`
                        : `${firstSlice.origin.toUpperCase()} → ${firstSlice.destination.toUpperCase()}`

                      return (
                        <div
                          key={req.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">
                                {routeDisplay}
                              </span>
                              {req.cabin_class && (
                                <span className="text-xs text-muted-foreground capitalize">
                                  {req.cabin_class.replace("_", " ")}
                                </span>
                              )}
                              {isRoundTrip && (
                                <span className="text-xs text-muted-foreground">Round Trip</span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {req.passengers.length} {req.passengers.length === 1 ? "passenger" : "passengers"} •{" "}
                              {createdDate.toLocaleDateString()} {createdDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground">{req.id.slice(0, 8)}...</span>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Flight Results */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Searching flights...
                  </span>
                ) : error ? (
                  <span className="text-destructive">{error}</span>
                ) : (
                  `${filteredFlights.length} ${filteredFlights.length === 1 ? "flight" : "flights"} found`
                )}
              </p>
            </div>

            {isLoading ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-muted-foreground" />
                  <h3 className="font-semibold mb-2">Searching for flights...</h3>
                  <p className="text-sm text-muted-foreground">Please wait while we find the best options for you</p>
                </CardContent>
              </Card>
            ) : error ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Plane className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">Error loading flights</h3>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </CardContent>
              </Card>
            ) : filteredFlights.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Plane className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">No flights found</h3>
                  <p className="text-sm text-muted-foreground">Try adjusting your filters or search dates</p>
                </CardContent>
              </Card>
            ) : (
              filteredFlights.map((flight) => (
                <Card key={flight.id} className="hover:shadow-md transition-shadow py-0">
                  <CardContent className="p-6">
                    <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                      {/* Flight Details */}
                      <div className="space-y-4">
                        {/* Airline */}
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded bg-secondary">
                            <Plane className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold">{flight.airline}</p>
                              {(flight as any).isRoundTrip && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent font-medium">
                                  Round Trip
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{flight.flightNumber}</p>
                          </div>
                        </div>

                        {/* Route */}
                        <div className="flex items-center gap-4 px-8">
                          <div className="flex-1">
                            <p className="text-2xl font-bold">{formatTime(flight.departure.time)}</p>
                            <p className="text-sm font-medium">{flight.departure.airport.code}</p>
                            <p className="text-xs text-muted-foreground break-words max-w-[200px]">{flight.departure.airport.name}</p>
                          </div>

                          <div className="flex flex-col items-center gap-1 min-w-[120px]">
                            <p className="text-xs text-muted-foreground">{formatDuration(flight.duration)}</p>
                            <div className="flex items-center gap-2 w-full">
                              <CircleDot className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                              <div className="h-px bg-border flex-1" />
                              <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {flight.stops === 0 ? "Nonstop" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
                            </p>
                          </div>

                          <div className="flex-1 text-right">
                            <p className="text-2xl font-bold">{formatTime(flight.arrival.time)}</p>
                            <p className="text-sm font-medium">{flight.arrival.airport.code}</p>
                            <p className="text-xs text-muted-foreground break-words max-w-[200px] ml-auto">{flight.arrival.airport.name}</p>
                          </div>
                        </div>

                        {/* Return Flight (if round trip) */}
                        {(flight as any).isRoundTrip && (flight as any).returnFlight && (
                          <div className="pt-4 border-t border-border px-8">
                            <div className="flex items-center gap-4">
                              <div className="flex-1">
                                <p className="text-2xl font-bold">{formatTime((flight as any).returnFlight.departure.time)}</p>
                                <p className="text-sm font-medium">{(flight as any).returnFlight.departure.airport.code}</p>
                                <p className="text-xs text-muted-foreground break-words max-w-[200px]">{(flight as any).returnFlight.departure.airport.name}</p>
                              </div>

                              <div className="flex flex-col items-center gap-1 min-w-[120px]">
                                <p className="text-xs text-muted-foreground">{formatDuration((flight as any).returnFlight.duration)}</p>
                                <div className="flex items-center gap-2 w-full">
                                  <CircleDot className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                  <div className="h-px bg-border flex-1" />
                                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {((flight as any).returnFlight.stops || 0) === 0 ? "Nonstop" : `${(flight as any).returnFlight.stops || 0} stop${((flight as any).returnFlight.stops || 0) > 1 ? "s" : ""}`}
                                </p>
                              </div>

                              <div className="flex-1 text-right">
                                <p className="text-2xl font-bold">{formatTime((flight as any).returnFlight.arrival.time)}</p>
                                <p className="text-sm font-medium">{(flight as any).returnFlight.arrival.airport.code}</p>
                                <p className="text-xs text-muted-foreground break-words max-w-[200px] ml-auto">{(flight as any).returnFlight.arrival.airport.name}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Price & Action */}
                      <div className="relative flex flex-col items-end justify-center gap-4 md:min-w-[160px] border-l border-border pl-6">
                        {/* Heart Favorite Icon */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute -top-2 -right-2 h-8 w-8 rounded-full hover:bg-muted opacity-40"
                          disabled
                          onClick={(e) => {
                            e.stopPropagation()
                            // TODO: Add favorite functionality
                          }}
                        >
                          <Heart className="h-4 w-4" />
                        </Button>

                        {/* Price Section */}
                        <div className="text-right">
                          <p className="text-3xl font-bold">${flight.price.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">per person</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Total: ${(flight.price * parseInt(travelers, 10)).toFixed(2)}
                          </p>
                        </div>

                        {/* Select Button */}
                        <Button
                          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                          onClick={() => handleSelectFlight(flight)}
                        >
                          Select <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function FlightsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FlightSearchContent />
    </Suspense>
  )
}
