import { Router } from 'express';
import { staysController } from './stays.controller';

const router = Router();

/**
 * @swagger
 * /api/stays/search:
 *   get:
 *     summary: Search for accommodations/stays
 *     tags: [Stays]
 *     parameters:
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *         description: Latitude of the search location
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *         description: Longitude of the search location
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           default: 5
 *         description: Search radius in kilometers
 *       - in: query
 *         name: checkInDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Check-in date in YYYY-MM-DD format
 *       - in: query
 *         name: checkOutDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Check-out date in YYYY-MM-DD format
 *       - in: query
 *         name: rooms
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *           maximum: 10
 *         description: Number of rooms
 *       - in: query
 *         name: adults
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *           maximum: 20
 *         description: Number of adult guests
 *       - in: query
 *         name: children
 *         schema:
 *           type: integer
 *           default: 0
 *           minimum: 0
 *           maximum: 20
 *         description: Number of child guests
 *       - in: query
 *         name: childrenAges
 *         schema:
 *           type: string
 *         description: Comma-separated ages for children (e.g., "5,7,10")
 *     responses:
 *       200:
 *         description: List of accommodations matching the search criteria
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
 *                 count:
 *                   type: integer
 *       400:
 *         description: Bad request (missing or invalid parameters)
 *       500:
 *         description: Internal server error
 */
router.get('/search', staysController.searchStays);

/**
 * @swagger
 * /api/stays/search-results/:searchResultId/rates:
 *   get:
 *     summary: Get room rates for a search result
 *     tags: [Stays]
 *     parameters:
 *       - in: path
 *         name: searchResultId
 *         required: true
 *         schema:
 *           type: string
 *         description: Search result ID from stays search
 *     responses:
 *       200:
 *         description: List of room rates for the accommodation
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.get('/search-results/:searchResultId/rates', staysController.getRates);

export default router;

