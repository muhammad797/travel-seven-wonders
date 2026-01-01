import { Router } from 'express';
import { placesController } from './places.controller';

const router = Router();

/**
 * @swagger
 * /api/places/search:
 *   get:
 *     summary: Search for places (airports and cities)
 *     tags: [Places]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query (airport code, city name, or airport name)
 *       - in: query
 *         name: types
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: [airport, city]
 *         description: Filter by place type (airport, city, or both)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Maximum number of results to return
 *     responses:
 *       200:
 *         description: List of places matching the search query
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: string
 *                         description: IATA code
 *                       name:
 *                         type: string
 *                       city:
 *                         type: string
 *                       country:
 *                         type: string
 *                       type:
 *                         type: string
 *                         enum: [airport, city]
 *       400:
 *         description: Bad request (missing query parameter)
 *       500:
 *         description: Internal server error
 */
router.get('/search', placesController.searchPlaces);

export default router;

