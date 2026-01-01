/**
 * Stays Service
 * 
 * Business logic for stays/accommodations search
 * Abstracts away the underlying provider (Duffel)
 */

import { duffelService } from '../../integrations/duffel';
import { SearchStaysInput, Accommodation, RoomRate } from './stays.types';
import logger from '../../utils/logger';

export class StaysService {
  /**
   * Convert Duffel search result to domain model
   */
  private mapDuffelSearchResultToAccommodation(duffelResult: any): Accommodation {
    return {
      id: duffelResult.accommodation?.id || duffelResult.id,
      searchResultId: duffelResult.id,
      name: duffelResult.accommodation?.name || 'Unknown Accommodation',
      address: {
        lineOne: duffelResult.accommodation?.address?.line_one || '',
        lineTwo: duffelResult.accommodation?.address?.line_two,
        city: duffelResult.accommodation?.address?.city || '',
        region: duffelResult.accommodation?.address?.region,
        postalCode: duffelResult.accommodation?.address?.postal_code,
        country: duffelResult.accommodation?.address?.country || '',
        countryCode: duffelResult.accommodation?.address?.country_code || '',
      },
      coordinates: {
        latitude: duffelResult.accommodation?.coordinates?.latitude || 0,
        longitude: duffelResult.accommodation?.coordinates?.longitude || 0,
      },
      images: duffelResult.accommodation?.images?.map((img: any) => ({
        url: img.url,
        category: img.category,
      })),
      amenities: duffelResult.accommodation?.amenities?.map((amenity: any) => ({
        name: amenity.name,
        category: amenity.category,
      })),
      starRating: duffelResult.accommodation?.star_rating,
    };
  }

  /**
   * Convert Duffel rate to domain model
   */
  private mapDuffelRateToRoomRate(duffelRate: any): RoomRate {
    // Parse price (Duffel returns price as string, e.g., "123.45")
    const priceAmount = parseFloat(duffelRate.total_amount || '0');
    const priceInCents = Math.round(priceAmount * 100); // Convert to cents

    return {
      id: duffelRate.id,
      searchResultId: duffelRate.search_result_id,
      room: {
        name: duffelRate.room?.name || 'Standard Room',
        bedConfigurations: duffelRate.room?.bed_configurations?.map((bed: any) => ({
          type: bed.type,
          count: bed.count,
        })),
        amenities: duffelRate.room?.amenities?.map((amenity: any) => ({
          name: amenity.name,
          category: amenity.category,
        })),
      },
      totalAmount: priceInCents,
      totalCurrency: duffelRate.total_currency || 'USD',
      cancellationPolicy: duffelRate.cancellation_policy ? {
        type: duffelRate.cancellation_policy.type,
        description: duffelRate.cancellation_policy.description,
      } : undefined,
    };
  }

  /**
   * Search for accommodations
   */
  async searchStays(input: SearchStaysInput): Promise<Accommodation[]> {
    try {
      logger.info('Searching stays', {
        latitude: input.latitude,
        longitude: input.longitude,
        checkInDate: input.checkInDate,
        checkOutDate: input.checkOutDate,
        rooms: input.rooms,
        guests: input.guests,
      });

      // Build guests array for Duffel API
      const guests: Array<{ type: 'adult' | 'child'; age?: number }> = [];
      
      // Add adults
      for (let i = 0; i < input.guests.adults; i++) {
        guests.push({ type: 'adult' });
      }
      
      // Add children (if any)
      if (input.guests.children && input.guests.children > 0) {
        const childrenAges = input.guests.childrenAges || [];
        for (let i = 0; i < input.guests.children; i++) {
          const age = childrenAges[i] || 10; // Default age if not provided
          guests.push({ type: 'child', age });
        }
      }

      // Call Duffel API
      const duffelResponse = await duffelService.searchStays({
        location: {
          geographic_coordinates: {
            latitude: input.latitude,
            longitude: input.longitude,
          },
          radius: input.radius || 5, // Default 5km radius
        },
        check_in_date: input.checkInDate,
        check_out_date: input.checkOutDate,
        rooms: input.rooms,
        guests,
      });

      // Map Duffel results to our domain model
      const accommodations: Accommodation[] = (duffelResponse.data || [])
        .map((result: any) => this.mapDuffelSearchResultToAccommodation(result))
        .filter((acc: Accommodation) => acc.id && acc.name);

      logger.info(`Found ${accommodations.length} accommodations`);
      return accommodations;
    } catch (error) {
      logger.error('Error searching stays:', error);
      throw error;
    }
  }

  /**
   * Get rates for a search result
   */
  async getRates(searchResultId: string): Promise<RoomRate[]> {
    try {
      logger.info(`Fetching rates for search result: ${searchResultId}`);

      const duffelResponse = await duffelService.getStaysRates(searchResultId);

      // Map Duffel rates to our domain model
      const rates: RoomRate[] = (duffelResponse.data || [])
        .map((rate: any) => this.mapDuffelRateToRoomRate(rate))
        .filter((rate: RoomRate) => rate.id);

      logger.info(`Found ${rates.length} rates`);
      return rates;
    } catch (error) {
      logger.error(`Error fetching rates for search result ${searchResultId}:`, error);
      throw error;
    }
  }
}

export const staysService = new StaysService();

