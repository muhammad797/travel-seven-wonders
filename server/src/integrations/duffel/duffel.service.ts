/**
 * Duffel Service
 * 
 * Wrapper service for Duffel API calls
 */

import { DUFFEL_TOKEN } from '../../config/env';
import logger from '../../utils/logger';
import {
  DUFFEL_API_BASE_URL,
  DuffelFlightSearchRequest,
  DuffelApiResponse,
  DuffelOffer,
  DuffelOfferRequest,
  DuffelCreateOrderRequest,
  DuffelOrder,
  DuffelAirport,
  DuffelPlace,
  DuffelStaysSearchRequest,
  DuffelStaysSearchResult,
  DuffelStaysRate,
  DuffelStaysQuote,
  DuffelStaysBookingRequest,
  DuffelStaysBooking,
} from './duffel.types';

export class DuffelService {
  private apiToken: string;
  private baseUrl: string;

  constructor() {
    this.apiToken = DUFFEL_TOKEN;
    this.baseUrl = DUFFEL_API_BASE_URL;
  }

  /**
   * Get authorization headers for Duffel API
   */
  private getHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json',
      'Duffel-Version': 'v2',
    };
  }

  /**
   * Make a request to Duffel API
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (!this.apiToken) {
      throw new Error('Duffel API token is not configured');
    }

    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Duffel API error: ${response.status} ${response.statusText}`;
        
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.errors?.[0]?.message || errorMessage;
        } catch {
          // If not JSON, use the text
          errorMessage = errorText || errorMessage;
        }

        logger.error(`Duffel API error: ${errorMessage}`, {
          status: response.status,
          endpoint,
        });

        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data as T;
    } catch (error: any) {
      logger.error('Duffel API request failed:', error);
      throw error;
    }
  }

  /**
   * Create an offer request
   * This is the first step in the flight search flow
   * @param returnOffers - If false, offers won't be returned in the response (default: false)
   */
  async createOfferRequest(searchRequest: DuffelFlightSearchRequest, returnOffers: boolean = false): Promise<DuffelApiResponse<DuffelOfferRequest>> {
    try {
      logger.info('Creating offer request via Duffel API', {
        origin: searchRequest.slices[0]?.origin,
        destination: searchRequest.slices[0]?.destination,
        departureDate: searchRequest.slices[0]?.departure_date,
        returnOffers,
      });

      // Build URL with query parameter
      const url = returnOffers 
        ? '/air/offer_requests?return_offers=true'
        : '/air/offer_requests?return_offers=false';

      const response = await this.request<DuffelApiResponse<DuffelOfferRequest>>(
        url,
        {
          method: 'POST',
          body: JSON.stringify({
            data: searchRequest,
          }),
        }
      );

      logger.info(`Created offer request: ${response.data?.id}`);
      return response;
    } catch (error) {
      logger.error('Error creating offer request:', error);
      throw error;
    }
  }

  /**
   * List offer requests
   * Retrieves a paginated list of offer requests
   * @param limit - Maximum number of records to return per page (1-200, default: 50)
   * @param after - Cursor pointing to the previous page of records
   * @param before - Cursor pointing to the next page of records
   */
  async listOfferRequests(limit?: number, after?: string, before?: string): Promise<DuffelApiResponse<DuffelOfferRequest[]>> {
    try {
      logger.info('Listing offer requests via Duffel API', { limit, after, before });

      const params = new URLSearchParams();

      if (limit) {
        params.append('limit', limit.toString());
      }

      if (after) {
        params.append('after', after);
      }

      if (before) {
        params.append('before', before);
      }

      const url = params.toString() 
        ? `/air/offer_requests?${params.toString()}`
        : '/air/offer_requests';

      const response = await this.request<DuffelApiResponse<DuffelOfferRequest[]>>(
        url,
        {
          method: 'GET',
        }
      );

      logger.info(`Found ${response.data?.length || 0} offer requests`);
      return response;
    } catch (error) {
      logger.error('Error listing offer requests:', error);
      throw error;
    }
  }

  /**
   * Get a single offer request by ID
   */
  async getOfferRequest(offerRequestId: string): Promise<DuffelApiResponse<DuffelOfferRequest>> {
    try {
      logger.info(`Fetching offer request: ${offerRequestId}`);

      const response = await this.request<DuffelApiResponse<DuffelOfferRequest>>(
        `/air/offer_requests/${offerRequestId}`,
        {
          method: 'GET',
        }
      );

      return response;
    } catch (error) {
      logger.error(`Error fetching offer request ${offerRequestId}:`, error);
      throw error;
    }
  }

  /**
   * Get offers for an offer request
   * This fetches the offers after creating an offer request
   */
  async getOffers(offerRequestId: string, limit?: number, after?: string): Promise<DuffelApiResponse<DuffelOffer[]>> {
    try {
      logger.info(`Fetching offers for offer request: ${offerRequestId}`);

      const params = new URLSearchParams({
        offer_request_id: offerRequestId,
      });

      if (limit) {
        params.append('limit', limit.toString());
      }

      if (after) {
        params.append('after', after);
      }

      const response = await this.request<DuffelApiResponse<DuffelOffer[]>>(
        `/air/offers?${params.toString()}`,
        {
          method: 'GET',
        }
      );

      logger.info(`Found ${response.data?.length || 0} offers`);
      return response;
    } catch (error) {
      logger.error(`Error fetching offers for offer request ${offerRequestId}:`, error);
      throw error;
    }
  }

  /**
   * Search for flights (convenience method)
   * Creates an offer request and fetches offers in one call
   */
  async searchFlights(searchRequest: DuffelFlightSearchRequest, limit?: number): Promise<DuffelApiResponse<DuffelOffer[]>> {
    try {
      // Step 1: Create offer request
      const offerRequestResponse = await this.createOfferRequest(searchRequest);
      const offerRequestId = offerRequestResponse.data?.id;

      if (!offerRequestId) {
        throw new Error('Failed to create offer request: no ID returned');
      }

      // Step 2: Fetch offers using the offer request ID
      const offersResponse = await this.getOffers(offerRequestId, limit);

      return offersResponse;
    } catch (error) {
      logger.error('Error searching flights:', error);
      throw error;
    }
  }

  /**
   * Get flight offer by ID
   */
  async getOffer(offerId: string): Promise<DuffelApiResponse<DuffelOffer>> {
    try {
      logger.info(`Fetching offer: ${offerId}`);
      
      const response = await this.request<DuffelApiResponse<DuffelOffer>>(
        `/air/offers/${offerId}`,
        {
          method: 'GET',
        }
      );

      return response;
    } catch (error) {
      logger.error(`Error fetching offer ${offerId}:`, error);
      throw error;
    }
  }

  /**
   * Create an order (book a flight)
   */
  async createOrder(orderRequest: DuffelCreateOrderRequest): Promise<DuffelApiResponse<DuffelOrder>> {
    try {
      logger.info('Creating order via Duffel API', {
        selectedOffers: orderRequest.selected_offers,
        passengers: orderRequest.passengers.length,
      });

      const response = await this.request<DuffelApiResponse<DuffelOrder>>(
        '/air/orders',
        {
          method: 'POST',
          body: JSON.stringify({
            data: orderRequest,
          }),
        }
      );

      logger.info(`Order created: ${response.data?.id}`);
      return response;
    } catch (error) {
      logger.error('Error creating order:', error);
      throw error;
    }
  }

  /**
   * Get order by ID
   */
  async getOrder(orderId: string): Promise<DuffelApiResponse<DuffelOrder>> {
    try {
      logger.info(`Fetching order: ${orderId}`);
      
      const response = await this.request<DuffelApiResponse<DuffelOrder>>(
        `/air/orders/${orderId}`,
        {
          method: 'GET',
        }
      );

      return response;
    } catch (error) {
      logger.error(`Error fetching order ${orderId}:`, error);
      throw error;
    }
  }

  /**
   * Search for airports
   */
  async searchAirports(query: string): Promise<DuffelApiResponse<DuffelAirport[]>> {
    try {
      logger.info(`Searching airports: ${query}`);
      
      const response = await this.request<DuffelApiResponse<DuffelAirport[]>>(
        `/air/airports?iata_code=${encodeURIComponent(query)}`,
        {
          method: 'GET',
        }
      );

      return response;
    } catch (error) {
      logger.error(`Error searching airports:`, error);
      throw error;
    }
  }

  /**
   * Search for places (airports and cities) using Duffel Places API
   */
  async searchPlaces(query: string, types?: ('airport' | 'city')[]): Promise<DuffelApiResponse<DuffelPlace[]>> {
    try {
      logger.info(`Searching places: ${query}`, { types });
      
      const params = new URLSearchParams({
        query: query,
      });
      
      if (types && types.length > 0) {
        types.forEach(type => params.append('type', type));
      }

      const response = await this.request<DuffelApiResponse<DuffelPlace[]>>(
        `/places/suggestions?${params.toString()}`,
        {
          method: 'GET',
        }
      );

      logger.info(`Found ${response.data?.length || 0} places`);
      return response;
    } catch (error) {
      logger.error(`Error searching places:`, error);
      throw error;
    }
  }

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: string): Promise<DuffelApiResponse<DuffelOrder>> {
    try {
      logger.info(`Cancelling order: ${orderId}`);
      
      const response = await this.request<DuffelApiResponse<DuffelOrder>>(
        `/air/orders/${orderId}/actions/cancel`,
        {
          method: 'POST',
        }
      );

      logger.info(`Order cancelled: ${orderId}`);
      return response;
    } catch (error) {
      logger.error(`Error cancelling order ${orderId}:`, error);
      throw error;
    }
  }

  /**
   * Search for stays/accommodations
   */
  async searchStays(searchRequest: DuffelStaysSearchRequest): Promise<DuffelApiResponse<DuffelStaysSearchResult[]>> {
    try {
      logger.info('Searching stays via Duffel API', {
        latitude: searchRequest.location.geographic_coordinates.latitude,
        longitude: searchRequest.location.geographic_coordinates.longitude,
        checkIn: searchRequest.check_in_date,
        checkOut: searchRequest.check_out_date,
        rooms: searchRequest.rooms,
      });

      const response = await this.request<DuffelApiResponse<DuffelStaysSearchResult[]>>(
        '/stays/search',
        {
          method: 'POST',
          body: JSON.stringify({
            data: searchRequest,
          }),
        }
      );

      logger.info(`Found ${response.data?.length || 0} accommodations`);
      return response;
    } catch (error) {
      logger.error('Error searching stays:', error);
      throw error;
    }
  }

  /**
   * Get all rates for a search result
   */
  async getStaysRates(searchResultId: string): Promise<DuffelApiResponse<DuffelStaysRate[]>> {
    try {
      logger.info(`Fetching rates for search result: ${searchResultId}`);
      
      const response = await this.request<DuffelApiResponse<DuffelStaysRate[]>>(
        `/stays/search_results/${searchResultId}/rates`,
        {
          method: 'GET',
        }
      );

      logger.info(`Found ${response.data?.length || 0} rates`);
      return response;
    } catch (error) {
      logger.error(`Error fetching rates for search result ${searchResultId}:`, error);
      throw error;
    }
  }

  /**
   * Create a quote for a rate
   */
  async createStaysQuote(rateId: string): Promise<DuffelApiResponse<DuffelStaysQuote>> {
    try {
      logger.info(`Creating quote for rate: ${rateId}`);
      
      const response = await this.request<DuffelApiResponse<DuffelStaysQuote>>(
        '/stays/quotes',
        {
          method: 'POST',
          body: JSON.stringify({
            data: {
              rate_id: rateId,
            },
          }),
        }
      );

      logger.info(`Quote created: ${response.data?.id}`);
      return response;
    } catch (error) {
      logger.error(`Error creating quote for rate ${rateId}:`, error);
      throw error;
    }
  }

  /**
   * Create a booking
   */
  async createStaysBooking(bookingRequest: DuffelStaysBookingRequest): Promise<DuffelApiResponse<DuffelStaysBooking>> {
    try {
      logger.info('Creating stays booking via Duffel API', {
        quoteId: bookingRequest.quote_id,
        guests: bookingRequest.guests.length,
      });

      const response = await this.request<DuffelApiResponse<DuffelStaysBooking>>(
        '/stays/bookings',
        {
          method: 'POST',
          body: JSON.stringify({
            data: bookingRequest,
          }),
        }
      );

      logger.info(`Booking created: ${response.data?.id}`);
      return response;
    } catch (error) {
      logger.error('Error creating stays booking:', error);
      throw error;
    }
  }

  /**
   * Get a booking by ID
   */
  async getStaysBooking(bookingId: string): Promise<DuffelApiResponse<DuffelStaysBooking>> {
    try {
      logger.info(`Fetching stays booking: ${bookingId}`);
      
      const response = await this.request<DuffelApiResponse<DuffelStaysBooking>>(
        `/stays/bookings/${bookingId}`,
        {
          method: 'GET',
        }
      );

      return response;
    } catch (error) {
      logger.error(`Error fetching stays booking ${bookingId}:`, error);
      throw error;
    }
  }
}

export const duffelService = new DuffelService();

