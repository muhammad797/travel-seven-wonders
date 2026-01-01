/**
 * Places API Module
 * 
 * This module provides functions to interact with the places API endpoints.
 * Used for searching airports and cities for flight booking.
 */

import { API_CONFIG, type ApiResponse } from './config';

/**
 * Place type matching the API response
 */
export interface Place {
  code: string; // IATA code
  name: string;
  city: string;
  country: string;
  type: 'airport' | 'city';
}

/**
 * Search places input parameters
 */
export interface SearchPlacesParams {
  q: string; // Search query (required)
  types?: ('airport' | 'city')[]; // Filter by place type
  limit?: number; // Maximum number of results (default: 20)
}

/**
 * Search for places (airports and cities)
 * 
 * @param params - Search parameters
 * @returns Promise resolving to an array of places
 */
export async function searchPlaces(params: SearchPlacesParams): Promise<Place[]> {
  const { q, types, limit } = params;

  if (!q || q.trim().length === 0) {
    return [];
  }

  const urlParams = new URLSearchParams({
    q: q.trim(),
  });

  if (types && types.length > 0) {
    types.forEach((type) => urlParams.append('types[]', type));
  }

  if (limit && limit > 0) {
    urlParams.append('limit', limit.toString());
  }

  const url = `${API_CONFIG.baseUrl}/api/places/search?${urlParams.toString()}`;

  try {
    const response = await fetch(url, {
      // Don't cache search results - they should be fresh
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      console.error(`[Places API] Failed to search places:`, {
        status: response.status,
        statusText: response.statusText,
        url,
        query: q,
        error: errorText,
      });
      throw new Error(`Failed to search places: ${response.status} ${response.statusText}`);
    }

    const result: ApiResponse<Place[]> = await response.json();
    return result.data || [];
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error(`[Places API] Network error fetching from:`, url);
      throw new Error(`Unable to connect to API server at ${API_CONFIG.baseUrl}. Make sure the server is running.`);
    }
    throw error;
  }
}

/**
 * Search for airports only
 * 
 * @param query - Search query
 * @param limit - Maximum number of results
 * @returns Promise resolving to an array of airport places
 */
export async function searchAirports(query: string, limit?: number): Promise<Place[]> {
  return searchPlaces({
    q: query,
    types: ['airport'],
    limit,
  });
}

/**
 * Search for cities only
 * 
 * @param query - Search query
 * @param limit - Maximum number of results
 * @returns Promise resolving to an array of city places
 */
export async function searchCities(query: string, limit?: number): Promise<Place[]> {
  return searchPlaces({
    q: query,
    types: ['city'],
    limit,
  });
}

