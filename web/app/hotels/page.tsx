"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Star, MapPin, Bed, Users, Calendar, Trash2, AlertCircle, Loader2 } from "lucide-react"
import { SEVEN_WONDERS } from "@/lib/mock-data"
import type { Hotel, Room, HotelStay } from "@/lib/types"
import { useBooking } from "@/lib/contexts"
import { searchStays, getStaysRates, type Accommodation, type RoomRate } from "@/lib/api"

// Wonder coordinates mapping (latitude, longitude)
const WONDER_COORDINATES: Record<string, { latitude: number; longitude: number }> = {
  colosseum: { latitude: 41.8902, longitude: 12.4922 }, // Rome, Italy
  "great-wall": { latitude: 40.4319, longitude: 116.5704 }, // Beijing, China
  petra: { latitude: 30.3285, longitude: 35.4444 }, // Petra, Jordan
  "christ-redeemer": { latitude: -22.9519, longitude: -43.2105 }, // Rio de Janeiro, Brazil
  "machu-picchu": { latitude: -13.1631, longitude: -72.5450 }, // Machu Picchu, Peru
  "taj-mahal": { latitude: 27.1751, longitude: 78.0421 }, // Agra, India
  "chichen-itza": { latitude: 20.6843, longitude: -88.5678 }, // Yucatan, Mexico
}

export default function HotelsPage() {
  const router = useRouter()
  const { searchData, selectedFlight, hotelStays, addHotelStay, removeHotelStay, setHotelStays } = useBooking()
  
  const [selectedHotel, setSelectedHotel] = useState<Accommodation | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<RoomRate | null>(null)
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState("2")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  // API state
  const [accommodations, setAccommodations] = useState<Accommodation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadingRates, setLoadingRates] = useState<Record<string, boolean>>({})
  const [ratesCache, setRatesCache] = useState<Record<string, RoomRate[]>>({})

  // Get wonder and coordinates based on booking journey
  const wonder = searchData?.wonderId ? SEVEN_WONDERS.find((w) => w.id === searchData.wonderId) : null
  const wonderCoords = wonder?.id ? WONDER_COORDINATES[wonder.id] : null

  // Calculate default check-in date based on flight arrival or departure date
  useEffect(() => {
    if (selectedFlight?.arrival?.time) {
      // Use flight arrival date as check-in date
      const arrivalDate = new Date(selectedFlight.arrival.time)
      // Set check-in to arrival date (or next day if arrival is late)
      const checkInDate = arrivalDate.toISOString().split('T')[0]
      setCheckIn(checkInDate)
    } else if (searchData?.departDate) {
      // Fallback to departure date if no flight selected
      setCheckIn(searchData.departDate)
    }
  }, [selectedFlight, searchData])

  // Set default check-out date when check-in is set (check-in + 3 days)
  useEffect(() => {
    if (checkIn && !checkOut) {
      const checkInDate = new Date(checkIn)
      const defaultCheckOut = new Date(checkInDate)
      defaultCheckOut.setDate(defaultCheckOut.getDate() + 3) // Default to 3 nights
      
      // Make sure check-out doesn't exceed return date if available
      if (searchData?.returnDate) {
        const returnDate = new Date(searchData.returnDate)
        if (defaultCheckOut > returnDate) {
          setCheckOut(searchData.returnDate)
        } else {
          setCheckOut(defaultCheckOut.toISOString().split('T')[0])
        }
      } else {
        setCheckOut(defaultCheckOut.toISOString().split('T')[0])
      }
    }
  }, [checkIn, checkOut, searchData?.returnDate])

  // Set default guests from travelers in search data
  useEffect(() => {
    if (searchData?.travelers) {
      setGuests(searchData.travelers)
    }
  }, [searchData])

  // Redirect if no booking data
  useEffect(() => {
    if (!searchData && !selectedFlight) {
      // No booking in progress, redirect to home
      router.push("/")
    }
  }, [searchData, selectedFlight, router])

  // Fetch accommodations function
  const fetchAccommodations = async () => {
    if (!wonderCoords || !checkIn || !checkOut) {
      setError("Please select check-in and check-out dates")
      return
    }

    // Validate dates
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    if (checkOutDate <= checkInDate) {
      setError("Check-out date must be after check-in date")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const adults = parseInt(searchData?.travelers || guests || "1", 10)
      const searchParams = {
        latitude: wonderCoords.latitude,
        longitude: wonderCoords.longitude,
        radius: 10, // 10km radius
        checkInDate: checkIn,
        checkOutDate: checkOut,
        rooms: 1,
        adults,
      }
      console.log('[Hotels Page] Calling searchStays API with params:', searchParams)
      const results = await searchStays(searchParams)
      console.log('[Hotels Page] Search results received:', results.length, 'accommodations')
      setAccommodations(results)
      
      if (results.length === 0) {
        setError("No accommodations found for these dates. Try adjusting your dates or search radius.")
      }
    } catch (err) {
      console.error("Error fetching accommodations:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch accommodations")
      setAccommodations([])
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-fetch accommodations when dates and coordinates are available
  useEffect(() => {
    if (!wonderCoords || !checkIn || !checkOut) {
      console.log('[Hotels Page] Search conditions not met:', {
        wonderCoords: !!wonderCoords,
        checkIn,
        checkOut,
      })
      return
    }

    console.log('[Hotels Page] Triggering accommodation search:', {
      latitude: wonderCoords.latitude,
      longitude: wonderCoords.longitude,
      checkIn,
      checkOut,
      travelers: searchData?.travelers || guests,
    })

    // Debounce the search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchAccommodations()
    }, 500)

    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wonderCoords, checkIn, checkOut, searchData?.travelers])

  const calculateNights = (checkIn: string, checkOut: string) => {
    const diffTime = new Date(checkOut).getTime() - new Date(checkIn).getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  // Fetch rates for an accommodation
  const fetchRates = async (accommodation: Accommodation) => {
    if (ratesCache[accommodation.searchResultId]) {
      return ratesCache[accommodation.searchResultId]
    }

    setLoadingRates((prev) => ({ ...prev, [accommodation.searchResultId]: true }))
    try {
      const rates = await getStaysRates(accommodation.searchResultId)
      setRatesCache((prev) => ({ ...prev, [accommodation.searchResultId]: rates }))
      return rates
    } catch (err) {
      console.error("Error fetching rates:", err)
      return []
    } finally {
      setLoadingRates((prev) => ({ ...prev, [accommodation.searchResultId]: false }))
    }
  }

  const handleAddStay = () => {
    if (!selectedHotel || !selectedRoom || !checkIn || !checkOut) {
      alert("Please select hotel, room, and dates")
      return
    }

    const nights = calculateNights(checkIn, checkOut)
    if (nights <= 0) {
      alert("Check-out must be after check-in")
      return
    }

    const guestCount = Number.parseInt(guests)
    const pricePerNight = selectedRoom.totalAmount / 100 // Convert cents to dollars

    // Map Accommodation and RoomRate to Hotel and Room types
    const hotel: Hotel = {
      id: selectedHotel.id,
      name: selectedHotel.name,
      address: selectedHotel.address.lineOne,
      city: selectedHotel.address.city,
      rating: selectedHotel.starRating || 0,
      images: selectedHotel.images?.map((img) => img.url) || [],
      amenities: selectedHotel.amenities?.map((a) => a.name) || [],
      description: `${selectedHotel.name} in ${selectedHotel.address.city}`,
      distanceToAttraction: 0, // Could calculate from coordinates
      wonderId: wonder?.id || "",
    }

    const room: Room = {
      id: selectedRoom.id,
      hotelId: selectedHotel.id,
      type: selectedRoom.room.name,
      maxGuests: guestCount, // Use selected guest count as max
      pricePerNight,
      available: true,
      amenities: selectedRoom.room.amenities?.map((a) => a.name) || [],
    }

    const newStay: HotelStay = {
      id: `STAY${Date.now()}`,
      hotel,
      room,
      checkIn,
      checkOut,
      guests: guestCount,
      nights,
      totalPrice: pricePerNight * nights,
    }

    addHotelStay(newStay)
    setSelectedHotel(null)
    setSelectedRoom(null)
    // Set next check-in to current check-out for multi-stay bookings
    setCheckIn(checkOut)
    setCheckOut("")
    setIsDialogOpen(false)
  }

  const handleSkipHotels = () => {
    // Clear hotel stays and continue to checkout
    setHotelStays([])
    router.push("/checkout")
  }

  const handleContinue = () => {
    if (hotelStays.length === 0) {
      alert("Please add at least one hotel stay or skip to checkout")
      return
    }
    router.push("/checkout")
  }

  const totalHotelCost = hotelStays.reduce((sum, stay) => sum + stay.totalPrice, 0)

  // Show loading or redirect if no booking data
  if (!searchData && !selectedFlight) {
    return null
  }

  // Calculate min check-in date (flight arrival or departure date)
  const minCheckInDate = selectedFlight?.arrival?.time
    ? new Date(selectedFlight.arrival.time).toISOString().split('T')[0]
    : searchData?.departDate || ""

  // Calculate max check-out date (return date if round trip, or departure + 30 days)
  const maxCheckOutDate = searchData?.returnDate
    ? searchData.returnDate
    : searchData?.departDate
    ? new Date(new Date(searchData.departDate).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    : ""

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Select Your Stays</h1>
          <p className="text-muted-foreground">
            {wonder ? `Add hotel stays near ${wonder.name}` : "Add hotel stays to complete your journey"}
          </p>
          {selectedFlight && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Your flight arrives on{" "}
                  <span className="font-medium">
                    {new Date(selectedFlight.arrival.time).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </span>
              </div>
            </div>
          )}
          {wonderCoords && (
            <div className="mt-4 p-3 bg-accent/10 rounded-lg text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" />
                <span className="text-muted-foreground">
                  Searching accommodations within 10km of{" "}
                  <span className="font-medium text-accent">{wonder?.name}</span>
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* Hotel Selection */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Available Hotels</h2>
                  <div className="flex items-center gap-2">
                    {isLoading && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Searching...</span>
                      </div>
                    )}
                    {!isLoading && checkIn && checkOut && wonderCoords && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchAccommodations}
                        disabled={isLoading}
                      >
                        Refresh Search
                      </Button>
                    )}
                  </div>
                </div>
                {!checkIn || !checkOut ? (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="font-semibold mb-2">Select Dates</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Please select check-in and check-out dates to search for available accommodations
                      </p>
                    </CardContent>
                  </Card>
                ) : null}
                {error && checkIn && checkOut && (
                  <Card className="mb-4 border-destructive">
                    <CardContent className="py-4">
                      <div className="flex items-center gap-2 text-destructive mb-3">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">{error}</span>
                      </div>
                      {wonderCoords && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={fetchAccommodations}
                          disabled={isLoading}
                        >
                          Try Again
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )}
                {!isLoading && accommodations.length === 0 && !error && checkIn && checkOut ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Bed className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="font-semibold mb-2">No hotels available</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        We couldn't find any hotels for these dates. Try adjusting your dates or you can skip hotels and continue to checkout.
                      </p>
                      <div className="flex gap-2 justify-center">
                        {wonderCoords && (
                          <Button onClick={fetchAccommodations} variant="outline">
                            Search Again
                          </Button>
                        )}
                        <Button onClick={handleSkipHotels} variant="outline">
                          Skip Hotels
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : isLoading ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-muted-foreground" />
                      <h3 className="font-semibold mb-2">Searching for hotels...</h3>
                      <p className="text-sm text-muted-foreground">Please wait while we find the best options for you</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {accommodations.map((accommodation) => {
                      const accommodationRates = ratesCache[accommodation.searchResultId] || []
                      const isLoadingRates = loadingRates[accommodation.searchResultId]
                      
                      return (
                    <Card key={accommodation.id} className="overflow-hidden">
                      <div className="grid md:grid-cols-[200px_1fr] gap-4">
                        <img
                          src={accommodation.images?.[0]?.url || "/placeholder.svg"}
                          alt={accommodation.name}
                          className="w-full h-48 md:h-full object-cover"
                        />
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{accommodation.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                {accommodation.starRating && (
                                  <>
                                    <Star className="h-4 w-4 fill-accent text-accent" />
                                    <span className="text-sm font-medium">{accommodation.starRating}</span>
                                    <span className="text-sm text-muted-foreground">·</span>
                                  </>
                                )}
                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  {accommodation.address.city}, {accommodation.address.country}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {accommodation.address.lineOne}
                            {accommodation.address.lineTwo && `, ${accommodation.address.lineTwo}`}
                          </p>
                          {accommodation.amenities && accommodation.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {accommodation.amenities.slice(0, 4).map((amenity, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {amenity.name}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <Dialog 
                            open={isDialogOpen && selectedHotel?.id === accommodation.id} 
                            onOpenChange={(open) => {
                              setIsDialogOpen(open)
                              if (!open) {
                                setSelectedHotel(null)
                                setSelectedRoom(null)
                              } else {
                                // Fetch rates when dialog opens
                                fetchRates(accommodation)
                              }
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                onClick={async () => {
                                  setSelectedHotel(accommodation)
                                  setIsDialogOpen(true)
                                  // Pre-fetch rates
                                  await fetchRates(accommodation)
                                }}
                                className="bg-accent hover:bg-accent/90 text-accent-foreground"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add to Itinerary
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Add Hotel Stay</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-6 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="room">Select Room</Label>
                                  {isLoadingRates ? (
                                    <div className="flex items-center gap-2 py-2">
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                      <span className="text-sm text-muted-foreground">Loading room options...</span>
                                    </div>
                                  ) : accommodationRates.length === 0 ? (
                                    <p className="text-sm text-muted-foreground py-2">No rooms available</p>
                                  ) : (
                                    <Select
                                      value={selectedRoom?.id}
                                      onValueChange={(id) => {
                                        const rate = accommodationRates.find((r) => r.id === id)
                                        setSelectedRoom(rate || null)
                                      }}
                                    >
                                      <SelectTrigger id="room">
                                        <SelectValue placeholder="Choose a room type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {accommodationRates.map((rate) => {
                                          const pricePerNight = rate.totalAmount / 100
                                          return (
                                            <SelectItem key={rate.id} value={rate.id}>
                                              {rate.room.name} - ${pricePerNight.toFixed(2)}/night
                                            </SelectItem>
                                          )
                                        })}
                                      </SelectContent>
                                    </Select>
                                  )}
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                  <div className="space-y-2">
                                    <Label htmlFor="check-in">Check-in</Label>
                                    <Input
                                      id="check-in"
                                      type="date"
                                      value={checkIn}
                                      onChange={(e) => setCheckIn(e.target.value)}
                                      min={minCheckInDate}
                                      max={maxCheckOutDate}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="check-out">Check-out</Label>
                                    <Input
                                      id="check-out"
                                      type="date"
                                      value={checkOut}
                                      onChange={(e) => setCheckOut(e.target.value)}
                                      min={checkIn || minCheckInDate}
                                      max={maxCheckOutDate}
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="guests-select">Guests</Label>
                                  <Select 
                                    value={guests} 
                                    onValueChange={setGuests}
                                    disabled={!selectedRoom}
                                  >
                                    <SelectTrigger id="guests-select">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {[1, 2, 3, 4, 5, 6].map((num) => (
                                        <SelectItem key={num} value={num.toString()}>
                                          {num} {num === 1 ? "Guest" : "Guests"}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                {selectedRoom && checkIn && checkOut && (
                                  <div className="rounded-lg bg-secondary p-4">
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm">
                                        {calculateNights(checkIn, checkOut)} nights × ${(selectedRoom.totalAmount / 100).toFixed(2)}
                                      </span>
                                      <span className="font-semibold">
                                        ${((selectedRoom.totalAmount / 100) * calculateNights(checkIn, checkOut)).toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                )}

                                <Button
                                  onClick={handleAddStay}
                                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                                >
                                  Add to Itinerary
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </CardContent>
                      </div>
                    </Card>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Timeline Itinerary */}
          <aside className="space-y-4">
            <Card className="sticky top-20">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Your Itinerary</h2>

                  {/* Flight */}
                  {selectedFlight && (
                    <div className="mb-6 pb-6 border-b">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                          <span className="text-xs font-semibold text-accent">1</span>
                        </div>
                        <span className="font-semibold">Flight</span>
                      </div>
                      <div className="ml-10">
                        <p className="text-sm font-medium">{selectedFlight.airline} {selectedFlight.flightNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(selectedFlight.departure.time).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-sm font-semibold mt-1">${selectedFlight.price.toFixed(2)}/person</p>
                      </div>
                    </div>
                  )}

                  {/* Hotel Stays Timeline */}
                  <div className="space-y-4">
                    {hotelStays.map((stay, index) => (
                      <div key={stay.id} className="relative">
                        <div className="flex items-start gap-2">
                          <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-semibold text-accent">{index + 2}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <span className="font-semibold text-sm">{stay.hotel.name}</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeHotelStay(stay.id)}
                                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">{stay.room.type}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {new Date(stay.checkIn).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}{" "}
                                -{" "}
                                {new Date(stay.checkOut).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                              <div className="flex items-center gap-1">
                                <Bed className="h-3 w-3" />
                                <span>{stay.nights} nights</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span>{stay.guests} guests</span>
                              </div>
                            </div>
                            <p className="text-sm font-semibold">${stay.totalPrice}</p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {hotelStays.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Bed className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No hotel stays added yet</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Total */}
                <div className="pt-4 border-t space-y-2">
                  {selectedFlight && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Flight</span>
                      <span>
                        ${(selectedFlight.price * Number.parseInt(searchData?.travelers || "1")).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {hotelStays.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Hotels</span>
                      <span>${totalHotelCost.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>
                      $
                      {(
                        (selectedFlight?.price || 0) * Number.parseInt(searchData?.travelers || "1") +
                        totalHotelCost
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button
                    onClick={handleContinue}
                    disabled={hotelStays.length === 0}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    Continue to Checkout
                  </Button>
                  <Button onClick={handleSkipHotels} variant="outline" className="w-full bg-transparent">
                    Skip Hotels
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  )
}
