/**
 * Places Controller
 * 
 * HTTP request handlers for places search
 */

import { Request, Response } from 'express';
import { placesService } from './places.service';
import { SearchPlacesInput } from './places.types';
import logger from '../../utils/logger';
import { NODE_ENV } from '../../config/env';

export class PlacesController {
  /**
   * Search for places (airports and cities)
   */
  searchPlaces = async (req: Request, res: Response): Promise<void> => {
    try {
      const query = req.query.q as string;
      const types = req.query.types as string | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;

      if (!query || query.trim().length === 0) {
        res.status(400).json({
          success: false,
          message: 'Query parameter "q" is required',
        });
        return;
      }

      const input: SearchPlacesInput = {
        query: query.trim(),
        types: types ? (Array.isArray(types) ? types as ('airport' | 'city')[] : [types as 'airport' | 'city']) : undefined,
        limit: limit && limit > 0 ? limit : 20,
      };

      const places = await placesService.searchPlaces(input);

      res.json({
        success: true,
        data: places,
      });
    } catch (error: any) {
      logger.error('Search places error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to search places',
        error: NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  };
}

export const placesController = new PlacesController();

