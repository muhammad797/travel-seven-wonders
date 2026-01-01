/**
 * Flights Service
 * 
 * Business logic for flight search
 * Abstracts away the underlying provider (Duffel)
 */

import { duffelService } from '../../integrations/duffel';
import { SearchFlightsInput, FlightOffer, FlightSegment } from './flights.types';
import logger from '../../utils/logger';

export class FlightsService {
  /**
   * Convert ISO 8601 duration to minutes
   * Example: "PT2H30M" -> 150
   */
  private parseDuration(duration: string): number {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return 0;
    
    const hours = parseInt(match[1] || '0', 10);
    const minutes = parseInt(match[2] || '0', 10);
    return hours * 60 + minutes;
  }

  /**
   * Convert Duffel offer to domain model
   */
  private mapDuffelOfferToFlightOffer(duffelOffer: any, cabinClass: string): FlightOffer {
    const slices = duffelOffer.slices || [];
    const firstSlice = slices[0] || {};
    const segments: FlightSegment[] = [];

    // Process all segments from all slices
    slices.forEach((slice: any) => {
      (slice.segments || []).forEach((segment: any) => {
        segments.push({
          origin: {
            code: segment.origin?.iata_code || '',
            name: segment.origin?.name || '',
            city: segment.origin?.city_name || segment.origin?.city || '',
          },
          destination: {
            code: segment.destination?.iata_code || '',
            name: segment.destination?.name || '',
            city: segment.destination?.city_name || segment.destination?.city || '',
          },
          departureTime: segment.departing_at || '',
          arrivalTime: segment.arriving_at || '',
          duration: this.parseDuration(segment.duration || 'PT0M'),
          airline: {
            name: segment.marketing_carrier?.name || segment.operating_carrier?.name || 'Unknown',
            code: segment.marketing_carrier?.iata_code || segment.operating_carrier?.iata_code || '',
          },
          flightNumber: segment.flight_number || '',
        });
      });
    });

    // Calculate total duration
    const totalDuration = this.parseDuration(firstSlice.duration || 'PT0M');

    // Calculate number of stops (segments - 1)
    const stops = Math.max(0, segments.length - 1);

    // Parse price (Duffel returns price as string, e.g., "123.45")
    const priceAmount = parseFloat(duffelOffer.total_amount || '0');
    const priceInCents = Math.round(priceAmount * 100); // Convert to cents

    return {
      id: duffelOffer.id || '',
      price: priceInCents,
      currency: duffelOffer.total_currency || 'USD',
      segments,
      totalDuration,
      stops,
      cabinClass: (cabinClass as any) || 'economy',
    };
  }

  /**
   * Search for flights
   * Maps provider-specific responses to our domain model
   */
  async searchFlights(input: SearchFlightsInput): Promise<FlightOffer[]> {
    try {
      logger.info('Searching flights', {
        origin: input.origin,
        destination: input.destination,
        departureDate: input.departureDate,
        returnDate: input.returnDate,
        passengers: input.passengers,
      });

      // Build passengers array for Duffel API
      const passengers: Array<{ type: 'adult' | 'child' | 'infant_without_seat'; age?: number }> = [];
      
      // Add adults
      for (let i = 0; i < input.passengers.adults; i++) {
        passengers.push({ type: 'adult' });
      }
      
      // Add children (if any)
      if (input.passengers.children) {
        for (let i = 0; i < input.passengers.children; i++) {
          passengers.push({ type: 'child', age: 10 }); // Default age, can be made configurable
        }
      }
      
      // Add infants (if any)
      if (input.passengers.infants) {
        for (let i = 0; i < input.passengers.infants; i++) {
          passengers.push({ type: 'infant_without_seat' });
        }
      }

      // Build slices (outbound and optionally return)
      const slices: Array<{
        origin: string;
        destination: string;
        departure_date: string;
      }> = [
        {
          origin: input.origin,
          destination: input.destination,
          departure_date: input.departureDate,
        },
      ];

      // Add return slice if return date is provided
      if (input.returnDate) {
        slices.push({
          origin: input.destination,
          destination: input.origin,
          departure_date: input.returnDate,
        });
      }

      // Call Duffel API
      // Set limit to 50 to get multiple flight options (Duffel defaults to 1 if not specified)
      const duffelResponse = await duffelService.searchFlights({
        slices,
        passengers,
        cabin_class: input.cabinClass || 'economy',
        max_connections: input.maxConnections !== undefined ? input.maxConnections : undefined,
      }, 50);

      // Map Duffel offers to our domain model
      const flightOffers: FlightOffer[] = (duffelResponse.data || [])
        .map((offer: any) => this.mapDuffelOfferToFlightOffer(offer, input.cabinClass || 'economy'))
        .filter((offer: FlightOffer) => offer.id && offer.segments.length > 0);

      logger.info(`Found ${flightOffers.length} flight offers`);
      return flightOffers;
    } catch (error) {
      logger.error('Error searching flights:', error);
      throw error;
    }
  }
}

export const flightsService = new FlightsService();

