/**
 * Places Service
 * 
 * Business logic for places/airports search
 * Abstracts away the underlying provider (Duffel)
 */

import { duffelService } from '../../integrations/duffel';
import { Place, SearchPlacesInput } from './places.types';
import logger from '../../utils/logger';

export class PlacesService {
  /**
   * Search for places (airports and cities)
   * Maps provider-specific responses to our domain model
   */
  async searchPlaces(input: SearchPlacesInput): Promise<Place[]> {
    try {
      logger.info('Searching places', { query: input.query, types: input.types });

      // Call Duffel Places API (internal implementation detail)
      const duffelResponse = await duffelService.searchPlaces(
        input.query,
        input.types
      );

      // Map Duffel response to our domain model
      const places: Place[] = (duffelResponse.data || [])
        .map((place) => {
          // Determine the IATA code based on place type
          let code = '';
          if (place.type === 'airport') {
            code = place.iata_code || '';
          } else if (place.type === 'city') {
            // For cities, prefer city_iata_code, fallback to iata_code if available
            code = place.city_iata_code || place.iata_code || '';
          }

          // Only include places with valid IATA codes (required for flight search)
          if (!code) {
            return null;
          }

          // Map Duffel place to our Place type
          return {
            code,
            name: place.name,
            city: place.city_name || place.name,
            country: place.country_name || '',
            type: place.type,
          };
        })
        .filter((place): place is Place => place !== null) // Remove null entries
        .slice(0, input.limit || 20); // Apply limit

      logger.info(`Found ${places.length} places matching "${input.query}"`);
      return places;
    } catch (error) {
      logger.error('Error searching places:', error);
      throw error;
    }
  }

  /**
   * Search for airports only
   */
  async searchAirports(query: string, limit?: number): Promise<Place[]> {
    return this.searchPlaces({
      query,
      types: ['airport'],
      limit,
    });
  }

  /**
   * Search for cities only
   */
  async searchCities(query: string, limit?: number): Promise<Place[]> {
    return this.searchPlaces({
      query,
      types: ['city'],
      limit,
    });
  }
}

export const placesService = new PlacesService();

