"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { Flight, HotelStay } from "../types"

interface FlightDetails {
  id: string
  airline: string
  flightNumber: string
  departure: {
    airport: string
    city: string
    time: string
  }
  arrival: {
    airport: string
    city: string
    time: string
  }
  price: number
}

interface BookingSearchData {
  origin?: string // Airport code
  originCity?: string // City name
  originAirportName?: string // Full airport name
  originAirportLocation?: string // Airport location (city, country)
  wonderId?: string
  destination?: string // Airport code
  destinationCity?: string // City name
  departDate?: string
  returnDate?: string
  travelers?: string
  travelClass?: string
}

interface BookingContextType {
  // Search data
  searchData: BookingSearchData | null
  setSearchData: (data: BookingSearchData) => void
  
  // Flight
  selectedFlight: FlightDetails | null
  setSelectedFlight: (flight: FlightDetails | null) => void
  
  // Hotels
  hotelStays: HotelStay[]
  setHotelStays: (stays: HotelStay[]) => void
  addHotelStay: (stay: HotelStay) => void
  removeHotelStay: (stayId: string) => void
  
  // Clear all booking data
  clearBooking: () => void
  
  // Check if booking is in progress
  isBookingInProgress: boolean
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

const STORAGE_KEYS = {
  BOOKING_DATA: "bookingData",
  HOTEL_STAYS: "hotelStays",
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [searchData, setSearchDataState] = useState<BookingSearchData | null>(null)
  const [selectedFlight, setSelectedFlightState] = useState<FlightDetails | null>(null)
  const [hotelStays, setHotelStaysState] = useState<HotelStay[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const bookingDataStr = localStorage.getItem(STORAGE_KEYS.BOOKING_DATA)
        const hotelStaysStr = localStorage.getItem(STORAGE_KEYS.HOTEL_STAYS)

        if (bookingDataStr) {
          const bookingData = JSON.parse(bookingDataStr)
          
          // Set search data
          setSearchDataState({
            origin: bookingData.origin,
            originCity: bookingData.originCity,
            originAirportName: bookingData.originAirportName,
            originAirportLocation: bookingData.originAirportLocation,
            wonderId: bookingData.wonderId,
            destination: bookingData.destination,
            destinationCity: bookingData.destinationCity,
            departDate: bookingData.departDate,
            returnDate: bookingData.returnDate,
            travelers: bookingData.travelers,
            travelClass: bookingData.travelClass,
          })

          // Set flight if flightDetails exists
          if (bookingData.flightDetails) {
            setSelectedFlightState(bookingData.flightDetails)
          } else if (bookingData.flight) {
            // Fallback: if only flight ID exists, try to reconstruct from search data
            // This handles legacy data
            setSelectedFlightState({
              id: bookingData.flight,
              airline: "Unknown",
              flightNumber: "",
              departure: {
                airport: bookingData.origin || "",
                city: "",
                time: bookingData.departDate || "",
              },
              arrival: {
                airport: bookingData.destination || "",
                city: "",
                time: bookingData.returnDate || bookingData.departDate || "",
              },
              price: 0,
            })
          }
        }

        if (hotelStaysStr) {
          const stays = JSON.parse(hotelStaysStr)
          setHotelStaysState(Array.isArray(stays) ? stays : [])
        }
      } catch (error) {
        console.error("Error loading booking data from storage:", error)
      }
    }

    loadFromStorage()
  }, [])

  // Sync search data to localStorage
  const setSearchData = useCallback((data: BookingSearchData) => {
    setSearchDataState(data)
    
    // Update localStorage
    try {
      const existingData = localStorage.getItem(STORAGE_KEYS.BOOKING_DATA)
      const bookingData = existingData ? JSON.parse(existingData) : {}
      
      const updatedData = {
        ...bookingData,
        ...data,
      }
      
      localStorage.setItem(STORAGE_KEYS.BOOKING_DATA, JSON.stringify(updatedData))
    } catch (error) {
      console.error("Error saving search data:", error)
    }
  }, [])

  // Sync flight to localStorage
  const setSelectedFlight = useCallback((flight: FlightDetails | null) => {
    setSelectedFlightState(flight)
    
    // Update localStorage
    try {
      const existingData = localStorage.getItem(STORAGE_KEYS.BOOKING_DATA)
      const bookingData = existingData ? JSON.parse(existingData) : {}
      
      const updatedData = {
        ...bookingData,
        flight: flight?.id,
        flightDetails: flight,
      }
      
      localStorage.setItem(STORAGE_KEYS.BOOKING_DATA, JSON.stringify(updatedData))
    } catch (error) {
      console.error("Error saving flight data:", error)
    }
  }, [])

  // Sync hotel stays to localStorage
  const setHotelStays = useCallback((stays: HotelStay[]) => {
    setHotelStaysState(stays)
    
    try {
      localStorage.setItem(STORAGE_KEYS.HOTEL_STAYS, JSON.stringify(stays))
      
      // Also update bookingData with hotel stay IDs
      const existingData = localStorage.getItem(STORAGE_KEYS.BOOKING_DATA)
      if (existingData) {
        const bookingData = JSON.parse(existingData)
        bookingData.hotelStays = stays.map((s) => s.id)
        localStorage.setItem(STORAGE_KEYS.BOOKING_DATA, JSON.stringify(bookingData))
      }
    } catch (error) {
      console.error("Error saving hotel stays:", error)
    }
  }, [])

  const addHotelStay = useCallback((stay: HotelStay) => {
    setHotelStaysState((prev) => {
      const updated = [...prev, stay]
      // Sync to localStorage
      try {
        localStorage.setItem(STORAGE_KEYS.HOTEL_STAYS, JSON.stringify(updated))
        const existingData = localStorage.getItem(STORAGE_KEYS.BOOKING_DATA)
        if (existingData) {
          const bookingData = JSON.parse(existingData)
          bookingData.hotelStays = updated.map((s) => s.id)
          localStorage.setItem(STORAGE_KEYS.BOOKING_DATA, JSON.stringify(bookingData))
        }
      } catch (error) {
        console.error("Error saving hotel stay:", error)
      }
      return updated
    })
  }, [])

  const removeHotelStay = useCallback((stayId: string) => {
    setHotelStaysState((prev) => {
      const updated = prev.filter((s) => s.id !== stayId)
      // Sync to localStorage
      try {
        localStorage.setItem(STORAGE_KEYS.HOTEL_STAYS, JSON.stringify(updated))
        const existingData = localStorage.getItem(STORAGE_KEYS.BOOKING_DATA)
        if (existingData) {
          const bookingData = JSON.parse(existingData)
          bookingData.hotelStays = updated.map((s) => s.id)
          localStorage.setItem(STORAGE_KEYS.BOOKING_DATA, JSON.stringify(bookingData))
        }
      } catch (error) {
        console.error("Error removing hotel stay:", error)
      }
      return updated
    })
  }, [])

  const clearBooking = useCallback(() => {
    setSearchDataState(null)
    setSelectedFlightState(null)
    setHotelStaysState([])
    
    localStorage.removeItem(STORAGE_KEYS.BOOKING_DATA)
    localStorage.removeItem(STORAGE_KEYS.HOTEL_STAYS)
  }, [])

  const isBookingInProgress = !!(searchData || selectedFlight || hotelStays.length > 0)

  return (
    <BookingContext.Provider
      value={{
        searchData,
        setSearchData,
        selectedFlight,
        setSelectedFlight,
        hotelStays,
        setHotelStays,
        addHotelStay,
        removeHotelStay,
        clearBooking,
        isBookingInProgress,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider")
  }
  return context
}

