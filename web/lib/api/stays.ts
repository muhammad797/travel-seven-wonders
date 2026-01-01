/**
 * Stays API Module
 * 
 * This module provides functions to interact with the stays API endpoints.
 * Used for searching accommodations/hotels for booking.
 */

import { API_CONFIG, type ApiResponse } from './config';

/**
 * Accommodation type matching the API response
 */
export interface Accommodation {
  id: string;
  searchResultId: string;
  name: string;
  address: {
    lineOne: string;
    lineTwo?: string;
    city: string;
    region?: string;
    postalCode?: string;
    country: string;
    countryCode: string;
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
  starRating?: number;
}

/**
 * Room rate type matching the API response
 */
export interface RoomRate {
  id: string;
  searchResultId: string;
  room: {
    name: string;
    bedConfigurations?: Array<{
      type: string;
      count: number;
    }>;
    amenities?: Array<{
      name: string;
      category?: string;
    }>;
  };
  totalAmount: number; // Price in cents
  totalCurrency: string;
  cancellationPolicy?: {
    type: string;
    description?: string;
  };
}

/**
 * Search stays input parameters
 */
export interface SearchStaysParams {
  latitude: number;
  longitude: number;
  radius?: number; // in kilometers, default 5
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  rooms?: number; // default 1
  adults?: number; // default 1
  children?: number; // default 0
  childrenAges?: number[]; // Required if children > 0
}

/**
 * Search for accommodations/stays
 * 
 * @param params - Search parameters
 * @returns Promise resolving to an array of accommodations
 */
export async function searchStays(params: SearchStaysParams): Promise<Accommodation[]> {
  const {
    latitude,
    longitude,
    radius,
    checkInDate,
    checkOutDate,
    rooms = 1,
    adults = 1,
    children = 0,
    childrenAges,
  } = params;

  const urlParams = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    checkInDate,
    checkOutDate,
    rooms: rooms.toString(),
    adults: adults.toString(),
    children: children.toString(),
  });

  if (radius) {
    urlParams.append('radius', radius.toString());
  }

  if (childrenAges && childrenAges.length > 0) {
    urlParams.append('childrenAges', childrenAges.join(','));
  }

  const url = `${API_CONFIG.baseUrl}/api/stays/search?${urlParams.toString()}`;

  try {
    const response = await fetch(url, {
      // Don't cache search results - they should be fresh
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      console.error(`[Stays API] Failed to search stays:`, {
        status: response.status,
        statusText: response.statusText,
        url,
        params,
        error: errorText,
      });
      throw new Error(`Failed to search stays: ${response.status} ${response.statusText}`);
    }

    const result: ApiResponse<Accommodation[]> = await response.json();
    return result.data || [];
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error(`[Stays API] Network error fetching from:`, url);
      throw new Error(`Unable to connect to API server at ${API_CONFIG.baseUrl}. Make sure the server is running.`);
    }
    throw error;
  }
}

/**
 * Get room rates for a search result
 * 
 * @param searchResultId - The search result ID from stays search
 * @returns Promise resolving to an array of room rates
 */
export async function getStaysRates(searchResultId: string): Promise<RoomRate[]> {
  if (!searchResultId) {
    throw new Error('searchResultId is required');
  }

  const url = `${API_CONFIG.baseUrl}/api/stays/search-results/${encodeURIComponent(searchResultId)}/rates`;

  try {
    const response = await fetch(url, {
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      console.error(`[Stays API] Failed to fetch rates:`, {
        status: response.status,
        statusText: response.statusText,
        url,
        searchResultId,
        error: errorText,
      });
      throw new Error(`Failed to fetch rates: ${response.status} ${response.statusText}`);
    }

    const result: ApiResponse<RoomRate[]> = await response.json();
    return result.data || [];
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error(`[Stays API] Network error fetching from:`, url);
      throw new Error(`Unable to connect to API server at ${API_CONFIG.baseUrl}. Make sure the server is running.`);
    }
    throw error;
  }
}

