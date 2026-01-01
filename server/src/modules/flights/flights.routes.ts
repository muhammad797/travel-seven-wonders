import { Router } from 'express';
import { flightsController } from './flights.controller';

const router = Router();

/**
 * @swagger
 * /api/flights/search:
 *   get:
 *     summary: Search for flights
 *     tags: [Flights]
 *     parameters:
 *       - in: query
 *         name: origin
 *         required: true
 *         schema:
 *           type: string
 *         description: Origin airport IATA code (e.g., JFK, LHR)
 *       - in: query
 *         name: destination
 *         required: true
 *         schema:
 *           type: string
 *         description: Destination airport IATA code (e.g., JFK, LHR)
 *       - in: query
 *         name: departureDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Departure date in YYYY-MM-DD format
 *       - in: query
 *         name: returnDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Return date in YYYY-MM-DD format (optional, for round trip)
 *       - in: query
 *         name: adults
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *           maximum: 9
 *         description: Number of adult passengers
 *       - in: query
 *         name: children
 *         schema:
 *           type: integer
 *           default: 0
 *           minimum: 0
 *           maximum: 9
 *         description: Number of child passengers
 *       - in: query
 *         name: infants
 *         schema:
 *           type: integer
 *           default: 0
 *           minimum: 0
 *           maximum: 9
 *         description: Number of infant passengers
 *       - in: query
 *         name: cabinClass
 *         schema:
 *           type: string
 *           enum: [economy, premium_economy, business, first]
 *         description: Cabin class preference
 *       - in: query
 *         name: maxConnections
 *         schema:
 *           type: integer
 *           minimum: 0
 *           maximum: 3
 *         description: Maximum number of connections (0 = nonstop)
 *     responses:
 *       200:
 *         description: List of flight offers matching the search criteria
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
 *                       id:
 *                         type: string
 *                         description: Flight offer ID
 *                       price:
 *                         type: integer
 *                         description: Price in cents
 *                       currency:
 *                         type: string
 *                       segments:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             origin:
 *                               type: object
 *                               properties:
 *                                 code:
 *                                   type: string
 *                                 name:
 *                                   type: string
 *                                 city:
 *                                   type: string
 *                             destination:
 *                               type: object
 *                             departureTime:
 *                               type: string
 *                               format: date-time
 *                             arrivalTime:
 *                               type: string
 *                               format: date-time
 *                             duration:
 *                               type: integer
 *                               description: Duration in minutes
 *                             airline:
 *                               type: object
 *                             flightNumber:
 *                               type: string
 *                       totalDuration:
 *                         type: integer
 *                         description: Total duration in minutes
 *                       stops:
 *                         type: integer
 *                         description: Number of stops
 *                       cabinClass:
 *                         type: string
 *                 count:
 *                   type: integer
 *       400:
 *         description: Bad request (missing or invalid parameters)
 *       500:
 *         description: Internal server error
 */
router.get('/search', flightsController.searchFlights);

/**
 * @swagger
 * /api/flights/offer-requests:
 *   get:
 *     summary: List offer requests
 *     tags: [Flights]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 200
 *           default: 50
 *         description: Maximum number of records to return per page
 *       - in: query
 *         name: after
 *         schema:
 *           type: string
 *         description: Cursor pointing to the previous page of records
 *       - in: query
 *         name: before
 *         schema:
 *           type: string
 *         description: Cursor pointing to the next page of records
 *     responses:
 *       200:
 *         description: List of offer requests
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
 *                       id:
 *                         type: string
 *                       slices:
 *                         type: array
 *                       passengers:
 *                         type: array
 *                       cabin_class:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                 meta:
 *                   type: object
 *                 count:
 *                   type: integer
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.get('/offer-requests', flightsController.listOfferRequests);

/**
 * @swagger
 * /api/flights/offer-requests/{id}:
 *   get:
 *     summary: Get a single offer request by ID
 *     tags: [Flights]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Offer request ID
 *     responses:
 *       200:
 *         description: Offer request details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.get('/offer-requests/:id', flightsController.getOfferRequest);

export default router;

