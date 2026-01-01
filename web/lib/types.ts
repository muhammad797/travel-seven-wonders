export interface Airport {
  code: string
  name: string
  city: string
  country: string
}

export interface Flight {
  id: string
  airline: string
  flightNumber: string
  departure: {
    airport: Airport
    time: string
  }
  arrival: {
    airport: Airport
    time: string
  }
  duration: number // minutes
  stops: number
  price: number
  class: "economy" | "premium-economy" | "business" | "first"
  available: boolean
}

export interface Wonder {
  id: string
  name: string
  location: string
  country: string
  airport: Airport
  description: string
  image: string
  timezone: string
}

export interface Hotel {
  id: string
  name: string
  address: string
  city: string
  rating: number
  images: string[]
  amenities: string[]
  description: string
  distanceToAttraction: number // km
  wonderId: string
}

export interface Room {
  id: string
  hotelId: string
  type: string
  maxGuests: number
  pricePerNight: number
  available: boolean
  amenities: string[]
}

export interface HotelStay {
  id: string
  hotel: Hotel
  room: Room
  checkIn: string
  checkOut: string
  guests: number
  nights: number
  totalPrice: number
}

export interface Traveler {
  firstName: string
  lastName: string
  dateOfBirth: string
  passportNumber?: string
  email?: string
  phone?: string
}

export interface Booking {
  id: string
  bookingNumber: string
  status: "confirmed" | "pending" | "cancelled"
  createdAt: string
  flight: Flight
  hotelStays: HotelStay[]
  travelers: Traveler[]
  contactDetails: {
    email: string
    phone: string
  }
  pricing: {
    flightPrice: number
    hotelPrice: number
    taxes: number
    fees: number
    total: number
  }
  cancellationAllowed: boolean
  changeAllowed: boolean
}

export interface SearchParams {
  origin: string
  wonderId: string
  destination: string
  departDate: string
  returnDate?: string
  travelers: number
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: {
    name: string
    avatar: string
  }
  publishedAt: string
  readTime: number // minutes
  category: string
  image: string
  tags: string[]
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  phone?: string
  joinedAt: string
  rewardPoints: number
  isEmailVerified: boolean
}
