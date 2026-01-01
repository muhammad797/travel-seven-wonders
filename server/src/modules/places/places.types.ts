/**
 * Places Module Types
 * 
 * Domain-specific types for places/airports search
 * These are NOT tied to any specific provider (Duffel, etc.)
 */

/**
 * Place/Airport search result
 */
export interface Place {
  code: string; // IATA code
  name: string;
  city: string;
  country: string;
  type: 'airport' | 'city';
}

/**
 * Place search input
 */
export interface SearchPlacesInput {
  query: string;
  types?: ('airport' | 'city')[];
  limit?: number;
}

