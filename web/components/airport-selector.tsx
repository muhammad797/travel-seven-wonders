"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Plane, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { searchAirports, type Place } from "@/lib/api"

interface AirportSelectorProps {
  value: string
  onValueChange: (value: string, airport?: Place) => void
  excludeAirport?: string
  placeholder?: string
}

// Helper function to group airports by region
function groupAirportsByRegion(airports: Place[]): Record<string, Place[]> {
  const regions: Record<string, Place[]> = {
    "North America": [],
    Europe: [],
    Asia: [],
    "Middle East": [],
    "South America": [],
    Oceania: [],
    Africa: [],
    Other: [],
  }

  airports.forEach((airport) => {
    const country = airport.country
    if (["USA", "United States", "Canada", "Mexico"].some((c) => country.includes(c))) {
      regions["North America"].push(airport)
    } else if (
      [
        "UK",
        "United Kingdom",
        "France",
        "Italy",
        "Germany",
        "Netherlands",
        "Spain",
        "Turkey",
        "Switzerland",
        "Austria",
      ].some((c) => country.includes(c))
    ) {
      regions["Europe"].push(airport)
    } else if (
      ["China", "Japan", "South Korea", "Singapore", "Thailand", "India"].some((c) => country.includes(c))
    ) {
      regions["Asia"].push(airport)
    } else if (["UAE", "United Arab Emirates", "Qatar", "Jordan", "Israel", "Egypt"].some((c) => country.includes(c))) {
      regions["Middle East"].push(airport)
    } else if (["Brazil", "Peru", "Colombia", "Argentina"].some((c) => country.includes(c))) {
      regions["South America"].push(airport)
    } else if (["Australia", "New Zealand"].some((c) => country.includes(c))) {
      regions["Oceania"].push(airport)
    } else if (["South Africa", "Kenya"].some((c) => country.includes(c))) {
      regions["Africa"].push(airport)
    } else {
      regions["Other"].push(airport)
    }
  })

  return regions
}

export function AirportSelector({
  value,
  onValueChange,
  excludeAirport,
  placeholder = "Select airport",
}: AirportSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [airports, setAirports] = React.useState<Place[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Debounce search query
  React.useEffect(() => {
    if (!open) {
      setSearchQuery("")
      setAirports([])
      return
    }

    // If search query is empty, don't search
    if (!searchQuery.trim()) {
      setAirports([])
      return
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true)
      setError(null)
      try {
        const results = await searchAirports(searchQuery.trim(), 50)
        const filtered = excludeAirport ? results.filter((a) => a.code !== excludeAirport) : results
        setAirports(filtered)
      } catch (err) {
        console.error("Error searching airports:", err)
        setError(err instanceof Error ? err.message : "Failed to search airports")
        setAirports([])
      } finally {
        setIsLoading(false)
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(timeoutId)
  }, [searchQuery, open, excludeAirport])

  const selectedAirport = airports.find((airport) => airport.code === value)

  // Group airports by region
  const airportsByRegion = React.useMemo(() => {
    return groupAirportsByRegion(airports)
  }, [airports])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-transparent"
        >
          {selectedAirport ? (
            <span className="flex items-center gap-2">
              <Plane className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">
                {selectedAirport.city} ({selectedAirport.code}) - {selectedAirport.country}
              </span>
            </span>
          ) : value ? (
            <span className="flex items-center gap-2">
              <Plane className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{value}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search airports..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            {isLoading && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
              </div>
            )}
            {error && (
              <div className="px-2 py-6 text-center text-sm text-destructive">
                {error}
              </div>
            )}
            {!isLoading && !error && searchQuery.trim() && airports.length === 0 && (
              <CommandEmpty>No airports found.</CommandEmpty>
            )}
            {!isLoading && !error && !searchQuery.trim() && (
              <CommandEmpty>Type to search for airports...</CommandEmpty>
            )}
            {!isLoading && !error && airports.length > 0 && (
              <>
                {Object.entries(airportsByRegion).map(([region, regionAirports]) =>
                  regionAirports.length > 0 ? (
                    <CommandGroup key={region} heading={region}>
                      {regionAirports.map((airport) => (
                        <CommandItem
                          key={airport.code}
                          value={`${airport.city} ${airport.code} ${airport.name} ${airport.country}`}
                          onSelect={() => {
                            onValueChange(airport.code, airport)
                            setOpen(false)
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", value === airport.code ? "opacity-100" : "opacity-0")} />
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {airport.city} ({airport.code})
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {airport.name} • {airport.country}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ) : null,
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
