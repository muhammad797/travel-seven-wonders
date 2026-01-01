/**
 * Duffel API Types
 * 
 * Type definitions for Duffel API requests and responses
 */

/**
 * Duffel API base URL
 */
export const DUFFEL_API_BASE_URL = 'https://api.duffel.com';

/**
 * Airport information
 */
export interface DuffelAirport {
  iata_code: string;
  name: string;
  city_name: string;
  city_iata_code?: string;
  country_name: string;
  latitude: number;
  longitude: number;
  time_zone: string;
}

/**
 * Place information from Duffel Places API
 */
export interface DuffelPlace {
  type: 'airport' | 'city';
  iata_code?: string;
  iata_country_code?: string;
  name: string;
  city_name?: string;
  city_iata_code?: string;
  country_name?: string;
  latitude?: number;
  longitude?: number;
  time_zone?: string;
}

/**
 * Flight search request
 */
export interface DuffelFlightSearchRequest {
  slices: Array<{
    origin: string; // IATA code
    destination: string; // IATA code
    departure_date: string; // ISO 8601 date (YYYY-MM-DD)
  }>;
  passengers: Array<{
    type: 'adult' | 'child' | 'infant_without_seat';
    age?: number;
  }>;
  cabin_class?: 'economy' | 'premium_economy' | 'business' | 'first';
  max_connections?: number;
}

/**
 * Offer Request response
 */
export interface DuffelOfferRequest {
  id: string;
  slices: Array<{
    origin: string;
    destination: string;
    departure_date: string;
  }>;
  passengers: Array<{
    type: string;
  }>;
  cabin_class?: string;
  created_at: string;
}

/**
 * Flight offer response
 */
export interface DuffelOffer {
  id: string;
  offer_request_id?: string;
  total_amount: string;
  total_currency: string;
  slices: Array<{
    segments: Array<{
      origin: {
        iata_code: string;
        name: string;
        city: string;
        city_name: string;
      };
      destination: {
        iata_code: string;
        name: string;
        city: string;
        city_name: string;
      };
      departing_at: string; // ISO 8601 datetime
      arriving_at: string; // ISO 8601 datetime
      duration: string; // ISO 8601 duration (e.g., "PT2H30M")
      marketing_carrier: {
        name: string;
        iata_code: string;
      };
      operating_carrier: {
        name: string;
        iata_code: string;
      };
      flight_number: string;
    }>;
    duration: string;
  }>;
  passengers: Array<{
    type: string;
    given_name?: string;
    family_name?: string;
  }>;
}

/**
 * Duffel API response wrapper
 */
export interface DuffelApiResponse<T> {
  data: T;
  meta?: {
    limit?: number;
    before?: string;
    after?: string;
  };
}

/**
 * Create order request
 */
export interface DuffelCreateOrderRequest {
  selected_offers: string[]; // Array of offer IDs
  passengers: Array<{
    id: string;
    title: 'mr' | 'ms' | 'mrs' | 'miss';
    gender: 'm' | 'f';
    given_name: string;
    family_name: string;
    born_on: string; // YYYY-MM-DD
    email: string;
    phone_number: string;
  }>;
  payments: Array<{
    type: 'balance' | 'arc_bsp_cash' | 'arc_bsp_cheque' | 'arc_bsp_credit_card';
    amount: string;
    currency: string;
  }>;
}

/**
 * Order response
 */
export interface DuffelOrder {
  id: string;
  booking_reference: string;
  status: string;
  total_amount: string;
  total_currency: string;
  slices: Array<{
    segments: Array<{
      origin: {
        iata_code: string;
        name: string;
      };
      destination: {
        iata_code: string;
        name: string;
      };
      departing_at: string;
      arriving_at: string;
    }>;
  }>;
}

/**
 * Stays search request
 */
export interface DuffelStaysSearchRequest {
  location: {
    geographic_coordinates: {
      latitude: number;
      longitude: number;
    };
    radius: number; // in kilometers
  };
  check_in_date: string; // ISO 8601 date (YYYY-MM-DD)
  check_out_date: string; // ISO 8601 date (YYYY-MM-DD)
  rooms: number;
  guests: Array<{
    type: 'adult' | 'child';
    age?: number; // Required for children
  }>;
}

/**
 * Stays search result (accommodation)
 */
export interface DuffelStaysSearchResult {
  id: string;
  accommodation: {
    id: string;
    name: string;
    address: {
      line_one: string;
      line_two?: string;
      city: string;
      region?: string;
      postal_code?: string;
      country: string;
      country_code: string;
    };
    coordinates: {
      latitude: number;
      longitude: number;
    };
    images?: Array<{
      url: string;
      category?: string;
    }>;
    amenities?: Array<{
      name: string;
      category?: string;
    }>;
    star_rating?: number;
  };
}

/**
 * Stays rate (room option)
 */
export interface DuffelStaysRate {
  id: string;
  search_result_id: string;
  room: {
    name: string;
    bed_configurations?: Array<{
      type: string;
      count: number;
    }>;
    amenities?: Array<{
      name: string;
      category?: string;
    }>;
  };
  total_amount: string; // Price as string
  total_currency: string;
  cancellation_policy?: {
    type: string;
    description?: string;
  };
}

/**
 * Stays quote
 */
export interface DuffelStaysQuote {
  id: string;
  rate_id: string;
  total_amount: string;
  total_currency: string;
  expires_at: string;
}

/**
 * Stays booking request
 */
export interface DuffelStaysBookingRequest {
  quote_id: string;
  guests: Array<{
    given_name: string;
    family_name: string;
    born_on: string; // YYYY-MM-DD
  }>;
  email: string;
  phone_number: string;
  accommodation_special_requests?: string;
}

/**
 * Stays booking response
 */
export interface DuffelStaysBooking {
  id: string;
  booking_reference: string;
  status: string;
  total_amount: string;
  total_currency: string;
  accommodation: {
    name: string;
    address: {
      line_one: string;
      city: string;
      country: string;
    };
  };
  check_in_date: string;
  check_out_date: string;
}

