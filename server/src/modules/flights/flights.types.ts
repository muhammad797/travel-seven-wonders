/**
 * Flights Module Types
 * 
 * Domain-specific types for flight search
 * These are NOT tied to any specific provider (Duffel, etc.)
 */

/**
 * Flight search input parameters
 */
export interface SearchFlightsInput {
  origin: string; // IATA code
  destination: string; // IATA code
  departureDate: string; // ISO 8601 date (YYYY-MM-DD)
  returnDate?: string; // ISO 8601 date (YYYY-MM-DD) - optional for round trip
  passengers: {
    adults: number;
    children?: number;
    infants?: number;
  };
  cabinClass?: 'economy' | 'premium_economy' | 'business' | 'first';
  maxConnections?: number; // Maximum number of connections (0 = nonstop)
}

/**
 * Flight segment information
 */
export interface FlightSegment {
  origin: {
    code: string;
    name: string;
    city: string;
  };
  destination: {
    code: string;
    name: string;
    city: string;
  };
  departureTime: string; // ISO 8601 datetime
  arrivalTime: string; // ISO 8601 datetime
  duration: number; // minutes
  airline: {
    name: string;
    code: string;
  };
  flightNumber: string;
}

/**
 * Flight offer (domain model)
 */
export interface FlightOffer {
  id: string;
  price: number; // Total price in cents (will be converted to dollars)
  currency: string;
  segments: FlightSegment[];
  totalDuration: number; // Total duration in minutes
  stops: number; // Number of stops/connections
  cabinClass: 'economy' | 'premium_economy' | 'business' | 'first';
}

