/**
 * Flights API Module
 * 
 * This module provides functions to interact with the flights API endpoints.
 */

import { API_CONFIG, type ApiResponse } from './config';

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
  departureTime: string;
  arrivalTime: string;
  duration: number; // minutes
  airline: {
    name: string;
    code: string;
  };
  flightNumber: string;
}

/**
 * Flight offer from API
 */
export interface FlightOffer {
  id: string;
  price: number; // Price in cents
  currency: string;
  segments: FlightSegment[];
  totalDuration: number; // Total duration in minutes
  stops: number;
  cabinClass: 'economy' | 'premium_economy' | 'business' | 'first';
}

/**
 * Search flights parameters
 */
export interface SearchFlightsParams {
  origin: string; // IATA code
  destination: string; // IATA code
  departureDate: string; // YYYY-MM-DD
  returnDate?: string; // YYYY-MM-DD (optional)
  adults?: number;
  children?: number;
  infants?: number;
  cabinClass?: 'economy' | 'premium_economy' | 'business' | 'first';
  maxConnections?: number;
}

/**
 * Search for flights
 * 
 * @param params - Search parameters
 * @returns Promise resolving to an array of flight offers
 */
export async function searchFlights(params: SearchFlightsParams): Promise<FlightOffer[]> {
  const {
    origin,
    destination,
    departureDate,
    returnDate,
    adults = 1,
    children = 0,
    infants = 0,
    cabinClass,
    maxConnections,
  } = params;

  const urlParams = new URLSearchParams({
    origin,
    destination,
    departureDate,
    adults: adults.toString(),
    children: children.toString(),
    infants: infants.toString(),
  });

  if (returnDate) {
    urlParams.append('returnDate', returnDate);
  }

  if (cabinClass) {
    urlParams.append('cabinClass', cabinClass);
  }

  if (maxConnections !== undefined) {
    urlParams.append('maxConnections', maxConnections.toString());
  }

  const url = `${API_CONFIG.baseUrl}/api/flights/search?${urlParams.toString()}`;

  try {
    const response = await fetch(url, {
      // Don't cache search results - they should be fresh
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      console.error(`[Flights API] Failed to search flights:`, {
        status: response.status,
        statusText: response.statusText,
        url,
        params,
        error: errorText,
      });
      throw new Error(`Failed to search flights: ${response.status} ${response.statusText}`);
    }

    const result: ApiResponse<FlightOffer[]> = await response.json();
    return result.data || [];
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error(`[Flights API] Network error fetching from:`, url);
      throw new Error(`Unable to connect to API server at ${API_CONFIG.baseUrl}. Make sure the server is running.`);
    }
    throw error;
  }
}

/**
 * Offer request from API
 */
export interface OfferRequest {
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
 * List offer requests parameters
 */
export interface ListOfferRequestsParams {
  limit?: number; // 1-200
  after?: string; // Cursor for pagination
  before?: string; // Cursor for pagination
}

/**
 * List offer requests
 * 
 * @param params - Query parameters
 * @returns Promise resolving to an array of offer requests
 */
export async function listOfferRequests(params: ListOfferRequestsParams = {}): Promise<{
  data: OfferRequest[];
  meta?: {
    limit?: number;
    before?: string;
    after?: string;
  };
  count: number;
}> {
  const { limit, after, before } = params;

  const urlParams = new URLSearchParams();

  if (limit) {
    urlParams.append('limit', limit.toString());
  }

  if (after) {
    urlParams.append('after', after);
  }

  if (before) {
    urlParams.append('before', before);
  }

  const url = `${API_CONFIG.baseUrl}/api/flights/offer-requests${urlParams.toString() ? `?${urlParams.toString()}` : ''}`;

  try {
    const response = await fetch(url, {
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      console.error(`[Flights API] Failed to list offer requests:`, {
        status: response.status,
        statusText: response.statusText,
        url,
        error: errorText,
      });
      throw new Error(`Failed to list offer requests: ${response.status} ${response.statusText}`);
    }

    const result: ApiResponse<OfferRequest[]> & { meta?: any; count?: number } = await response.json();
    return {
      data: result.data || [],
      meta: result.meta,
      count: result.count || 0,
    };
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error(`[Flights API] Network error fetching from:`, url);
      throw new Error(`Unable to connect to API server at ${API_CONFIG.baseUrl}. Make sure the server is running.`);
    }
    throw error;
  }
}

/**
 * Get a single offer request by ID
 * 
 * @param id - Offer request ID
 * @returns Promise resolving to the offer request
 */
export async function getOfferRequest(id: string): Promise<OfferRequest> {
  const url = `${API_CONFIG.baseUrl}/api/flights/offer-requests/${id}`;

  try {
    const response = await fetch(url, {
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      console.error(`[Flights API] Failed to get offer request:`, {
        status: response.status,
        statusText: response.statusText,
        url,
        id,
        error: errorText,
      });
      throw new Error(`Failed to get offer request: ${response.status} ${response.statusText}`);
    }

    const result: ApiResponse<OfferRequest> = await response.json();
    return result.data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error(`[Flights API] Network error fetching from:`, url);
      throw new Error(`Unable to connect to API server at ${API_CONFIG.baseUrl}. Make sure the server is running.`);
    }
    throw error;
  }
}

