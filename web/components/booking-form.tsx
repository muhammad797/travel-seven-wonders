"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Users, ArrowLeft, Plane } from "lucide-react"
import type { Wonder } from "@/lib/types"
import Link from "next/link"
import { AirportSelector } from "@/components/airport-selector"
import { useBooking } from "@/lib/contexts"
import { AIRPORTS } from "@/lib/mock-data"

interface BookingFormProps {
  wonder: Wonder
}

export default function BookingForm({ wonder }: BookingFormProps) {
  const router = useRouter()
  const { setSearchData } = useBooking()
  const [origin, setOrigin] = useState("")
  const [originCity, setOriginCity] = useState("")
  const [originAirportName, setOriginAirportName] = useState("")
  const [originAirportLocation, setOriginAirportLocation] = useState("")
  const [departDate, setDepartDate] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [travelers, setTravelers] = useState("1")
  const [travelClass, setTravelClass] = useState("economy")

  const handleOriginChange = (airportCode: string, airportData?: { city: string; name: string; country: string }) => {
    setOrigin(airportCode)
    // Use airport data from API if available, otherwise try mock data
    if (airportData) {
      setOriginCity(airportData.city)
      setOriginAirportName(airportData.name)
      setOriginAirportLocation(`${airportData.city}, ${airportData.country}`)
    } else {
      // Fallback to mock data
      const airport = AIRPORTS.find((a) => a.code === airportCode)
      if (airport) {
        setOriginCity(airport.city)
        setOriginAirportName(airport.name)
        setOriginAirportLocation(`${airport.city}, ${airport.country}`)
      }
    }
  }

  const handleSearch = () => {
    if (!origin || !departDate) {
      alert("Please select origin and departure date")
      return
    }
    
    // Get airport details if not already set
    const airport = AIRPORTS.find((a) => a.code === origin)
    
    // Store search data in context with full airport information
    setSearchData({
      origin,
      originCity: originCity || airport?.city || "",
      originAirportName: originAirportName || airport?.name || "",
      originAirportLocation: originAirportLocation || (airport ? `${airport.city}, ${airport.country}` : ""),
      wonderId: wonder.id,
      destination: wonder.airport.code,
      destinationCity: wonder.location, // Use wonder location as destination city
      departDate,
      returnDate: returnDate || undefined,
      travelers,
      travelClass,
    })
    
    const params = new URLSearchParams({
      origin,
      wonderId: wonder.id,
      destination: wonder.airport.code,
      departDate,
      ...(returnDate && { returnDate }),
      travelers,
      travelClass,
    })
    router.push(`/flights?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      <Card className="mx-auto max-w-4xl bg-accent/10 border-accent/20">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium text-muted-foreground">Your Destination</span>
              </div>
              <h2 className="text-2xl font-bold mb-1">{wonder.name}</h2>
              <p className="text-muted-foreground">{wonder.location}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Flying to {wonder.airport.name} ({wonder.airport.code})
              </p>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                Change
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card className="mx-auto max-w-4xl shadow-lg">
        <CardContent className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Plan Your Journey</h2>
            <p className="text-muted-foreground">Choose your departure airport, travel dates, and preferences</p>
          </div>

          <div className="grid gap-6">
            {/* Origin Selection */}
            <div className="space-y-2">
              <Label htmlFor="origin" className="flex items-center gap-2">
                <Plane className="h-4 w-4 text-accent" />
                From
              </Label>
              <AirportSelector
                value={origin}
                onValueChange={handleOriginChange}
                excludeAirport={wonder.airport.code}
                placeholder="Search and select your departure airport"
              />
            </div>

            {/* Date Selection */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="depart-date" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-accent" />
                  Departure Date
                </Label>
                <Input
                  id="depart-date"
                  type="date"
                  value={departDate}
                  onChange={(e) => setDepartDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="return-date" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-accent" />
                  Return Date (Optional)
                </Label>
                <Input
                  id="return-date"
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={departDate || new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Travelers */}
              <div className="space-y-2">
                <Label htmlFor="travelers" className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-accent" />
                  Number of Travelers
                </Label>
                <Select value={travelers} onValueChange={setTravelers}>
                  <SelectTrigger id="travelers">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "Traveler" : "Travelers"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Travel Class */}
              <div className="space-y-2">
                <Label htmlFor="travel-class">Travel Class</Label>
                <Select value={travelClass} onValueChange={setTravelClass}>
                  <SelectTrigger id="travel-class">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economy">Economy</SelectItem>
                    <SelectItem value="premium">Premium Economy</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="first">First Class</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Search Button */}
            <Button
              size="lg"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={handleSearch}
            >
              Search Flights
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
