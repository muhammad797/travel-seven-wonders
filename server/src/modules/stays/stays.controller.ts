/**
 * Stays Controller
 * 
 * HTTP request handlers for stays/accommodations search
 */

import { Request, Response } from 'express';
import { staysService } from './stays.service';
import { SearchStaysInput } from './stays.types';
import logger from '../../utils/logger';
import { NODE_ENV } from '../../config/env';

export class StaysController {
  /**
   * Search for accommodations
   */
  searchStays = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        latitude,
        longitude,
        radius,
        checkInDate,
        checkOutDate,
        rooms = '1',
        adults = '1',
        children = '0',
        childrenAges,
      } = req.query;

      // Validate required parameters
      if (!latitude || !longitude || !checkInDate || !checkOutDate) {
        res.status(400).json({
          success: false,
          message: 'Missing required parameters: latitude, longitude, checkInDate, and checkOutDate are required',
        });
        return;
      }

      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(checkInDate as string)) {
        res.status(400).json({
          success: false,
          message: 'Invalid checkInDate format. Expected YYYY-MM-DD',
        });
        return;
      }

      if (!dateRegex.test(checkOutDate as string)) {
        res.status(400).json({
          success: false,
          message: 'Invalid checkOutDate format. Expected YYYY-MM-DD',
        });
        return;
      }

      // Validate dates
      const checkIn = new Date(checkInDate as string);
      const checkOut = new Date(checkOutDate as string);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkIn < today) {
        res.status(400).json({
          success: false,
          message: 'checkInDate cannot be in the past',
        });
        return;
      }

      if (checkOut <= checkIn) {
        res.status(400).json({
          success: false,
          message: 'checkOutDate must be after checkInDate',
        });
        return;
      }

      // Parse and validate numeric parameters
      const lat = parseFloat(latitude as string);
      const lon = parseFloat(longitude as string);
      const roomsCount = parseInt(rooms as string, 10);
      const adultsCount = parseInt(adults as string, 10);
      const childrenCount = parseInt(children as string, 10);
      const radiusKm = radius ? parseFloat(radius as string) : undefined;

      if (isNaN(lat) || isNaN(lon)) {
        res.status(400).json({
          success: false,
          message: 'Invalid latitude or longitude',
        });
        return;
      }

      if (isNaN(roomsCount) || roomsCount < 1 || roomsCount > 10) {
        res.status(400).json({
          success: false,
          message: 'rooms must be between 1 and 10',
        });
        return;
      }

      if (isNaN(adultsCount) || adultsCount < 1 || adultsCount > 20) {
        res.status(400).json({
          success: false,
          message: 'adults must be between 1 and 20',
        });
        return;
      }

      if (isNaN(childrenCount) || childrenCount < 0 || childrenCount > 20) {
        res.status(400).json({
          success: false,
          message: 'children must be between 0 and 20',
        });
        return;
      }

      // Parse children ages if provided
      let parsedChildrenAges: number[] | undefined;
      if (childrenCount > 0 && childrenAges) {
        if (typeof childrenAges === 'string') {
          parsedChildrenAges = childrenAges.split(',').map(age => parseInt(age.trim(), 10));
        } else if (Array.isArray(childrenAges)) {
          parsedChildrenAges = childrenAges.map(age => parseInt(age as string, 10));
        }

        if (parsedChildrenAges && parsedChildrenAges.length !== childrenCount) {
          res.status(400).json({
            success: false,
            message: 'childrenAges array length must match children count',
          });
          return;
        }
      }

      const searchInput: SearchStaysInput = {
        latitude: lat,
        longitude: lon,
        radius: radiusKm,
        checkInDate: checkInDate as string,
        checkOutDate: checkOutDate as string,
        rooms: roomsCount,
        guests: {
          adults: adultsCount,
          children: childrenCount > 0 ? childrenCount : undefined,
          childrenAges: parsedChildrenAges,
        },
      };

      const accommodations = await staysService.searchStays(searchInput);

      res.json({
        success: true,
        data: accommodations,
        count: accommodations.length,
      });
    } catch (error) {
      logger.error('Error searching stays:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to search stays',
        error: NODE_ENV === 'development' ? (error as Error).message : undefined,
      });
    }
  };

  /**
   * Get rates for a search result
   */
  getRates = async (req: Request, res: Response): Promise<void> => {
    try {
      const { searchResultId } = req.params;

      if (!searchResultId) {
        res.status(400).json({
          success: false,
          message: 'searchResultId is required',
        });
        return;
      }

      const rates = await staysService.getRates(searchResultId);

      res.json({
        success: true,
        data: rates,
        count: rates.length,
      });
    } catch (error) {
      logger.error('Error fetching rates:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch rates',
        error: NODE_ENV === 'development' ? (error as Error).message : undefined,
      });
    }
  };
}

export const staysController = new StaysController();

