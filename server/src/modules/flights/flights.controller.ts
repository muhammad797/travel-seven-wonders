/**
 * Flights Controller
 * 
 * HTTP request handlers for flight search
 */

import { Request, Response } from 'express';
import { flightsService } from './flights.service';
import { SearchFlightsInput } from './flights.types';
import logger from '../../utils/logger';
import { NODE_ENV } from '../../config/env';
import { duffelService } from '../../integrations/duffel';

export class FlightsController {
  /**
   * Search for flights
   */
  searchFlights = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        origin,
        destination,
        departureDate,
        returnDate,
        adults = '1',
        children = '0',
        infants = '0',
        cabinClass,
        maxConnections,
      } = req.query;

      // Validate required parameters
      if (!origin || !destination || !departureDate) {
        res.status(400).json({
          success: false,
          message: 'Missing required parameters: origin, destination, and departureDate are required',
        });
        return;
      }

      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(departureDate as string)) {
        res.status(400).json({
          success: false,
          message: 'Invalid departureDate format. Expected YYYY-MM-DD',
        });
        return;
      }

      if (returnDate && !dateRegex.test(returnDate as string)) {
        res.status(400).json({
          success: false,
          message: 'Invalid returnDate format. Expected YYYY-MM-DD',
        });
        return;
      }

      // Parse and validate passenger counts
      const adultsCount = parseInt(adults as string, 10);
      const childrenCount = parseInt(children as string, 10);
      const infantsCount = parseInt(infants as string, 10);

      if (isNaN(adultsCount) || adultsCount < 1 || adultsCount > 9) {
        res.status(400).json({
          success: false,
          message: 'Invalid adults count. Must be between 1 and 9',
        });
        return;
      }

      if (isNaN(childrenCount) || childrenCount < 0 || childrenCount > 9) {
        res.status(400).json({
          success: false,
          message: 'Invalid children count. Must be between 0 and 9',
        });
        return;
      }

      if (isNaN(infantsCount) || infantsCount < 0 || infantsCount > 9) {
        res.status(400).json({
          success: false,
          message: 'Invalid infants count. Must be between 0 and 9',
        });
        return;
      }

      // Validate cabin class if provided
      const validCabinClasses = ['economy', 'premium_economy', 'business', 'first'];
      if (cabinClass && !validCabinClasses.includes(cabinClass as string)) {
        res.status(400).json({
          success: false,
          message: `Invalid cabinClass. Must be one of: ${validCabinClasses.join(', ')}`,
        });
        return;
      }

      // Build search input
      const input: SearchFlightsInput = {
        origin: (origin as string).toUpperCase().trim(),
        destination: (destination as string).toUpperCase().trim(),
        departureDate: departureDate as string,
        returnDate: returnDate as string | undefined,
        passengers: {
          adults: adultsCount,
          children: childrenCount > 0 ? childrenCount : undefined,
          infants: infantsCount > 0 ? infantsCount : undefined,
        },
        cabinClass: cabinClass as SearchFlightsInput['cabinClass'] | undefined,
        maxConnections: maxConnections ? parseInt(maxConnections as string, 10) : undefined,
      };

      const flights = await flightsService.searchFlights(input);

      res.json({
        success: true,
        data: flights,
        count: flights.length,
      });
    } catch (error: any) {
      logger.error('Search flights error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to search flights',
        error: NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  };

  /**
   * List offer requests
   */
  listOfferRequests = async (req: Request, res: Response): Promise<void> => {
    try {
      const { limit, after, before } = req.query;

      const limitNum = limit ? parseInt(limit as string, 10) : undefined;
      const afterStr = after as string | undefined;
      const beforeStr = before as string | undefined;

      // Validate limit if provided
      if (limitNum !== undefined && (isNaN(limitNum) || limitNum < 1 || limitNum > 200)) {
        res.status(400).json({
          success: false,
          message: 'Invalid limit. Must be between 1 and 200',
        });
        return;
      }

      const response = await duffelService.listOfferRequests(limitNum, afterStr, beforeStr);

      res.json({
        success: true,
        data: response.data || [],
        meta: response.meta,
        count: response.data?.length || 0,
      });
    } catch (error: any) {
      logger.error('List offer requests error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to list offer requests',
        error: NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  };

  /**
   * Get a single offer request by ID
   */
  getOfferRequest = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Offer request ID is required',
        });
        return;
      }

      const response = await duffelService.getOfferRequest(id);

      res.json({
        success: true,
        data: response.data,
      });
    } catch (error: any) {
      logger.error('Get offer request error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get offer request',
        error: NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  };
}

export const flightsController = new FlightsController();

