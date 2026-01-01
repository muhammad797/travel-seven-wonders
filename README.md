# Seven Wonders Travel Booking Platform

A comprehensive travel booking web application that allows users to plan and book trips to the Seven Wonders of the World.

## 🏛️ Destinations

The platform features all seven wonders:

- **Great Wall of China** (Beijing)
- **Petra** (Jordan)
- **Christ the Redeemer** (Rio de Janeiro, Brazil)
- **Machu Picchu** (Peru)
- **Chichen Itza** (Mexico)
- **Colosseum** (Rome, Italy)
- **Taj Mahal** (Agra, India)

## 🏗️ Architecture

This project consists of two main parts:

- **Web** - Next.js frontend application (`/web`)
- **Server** - Express.js API server (`/server`)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd travelwonders
```

2. Install dependencies for both web and server:

```bash
# Install web dependencies
cd web
npm install

# Install server dependencies
cd ../server
npm install
```

### Running the Application

#### Development Mode

**Start the API Server:**
```bash
cd server
npm run dev
```
Server runs on `http://localhost:3001`

**Start the Web Application:**
```bash
cd web
npm run dev
```
Web app runs on `http://localhost:3000`

### Production Build

**Build Server:**
```bash
cd server
npm run build
npm start
```

**Build Web:**
```bash
cd web
npm run build
npm start
```

## 📁 Project Structure

```
travelwonders/
├── web/                 # Next.js frontend application
│   ├── app/            # Next.js app router pages
│   ├── components/     # React components
│   └── lib/            # Utilities and mock data
│
└── server/             # Express.js API server
    ├── src/
    │   ├── config/     # Configuration files (Swagger)
    │   ├── middleware/ # Express middleware
    │   ├── routes/     # API routes
    │   └── utils/      # Utility functions
    └── logs/           # Application logs
```

## 🌐 Web Application

The web application is built with:
- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components

## ✈️ Complete Booking Journey

### 1. Wonder Selection
Users start by browsing an elegant grid showcasing all seven wonders with stunning imagery and can select their dream destination.

### 2. Journey Planning
After selecting a wonder, users plan their trip by choosing:
- **Departure airport** from 50+ major airports worldwide
- **Travel dates** (departure and return)
- **Number of travelers**
- **Travel class preference** (Economy, Premium Economy, Business, First Class)

### 3. Flight Search & Selection
The app displays available flights with comprehensive filtering options:
- Price range filtering
- Number of stops (non-stop, 1 stop, 2+ stops)
- Flight duration slider
- Departure time preferences
- Sort by price, duration, or departure time

Users can select their preferred flight with real-time revalidation of price and availability.

### 4. Hotel Itinerary Builder
A unique timeline-based interface where users can build their accommodation plan with flexibility:
- **Skip hotels entirely** - Option to proceed without hotel bookings
- **Single hotel stay** - Book one hotel for the entire trip
- **Multi-hotel itinerary** - Create a complete plan with different check-in/check-out dates
- **Room selection** - Choose room types and guest configurations for each stay
- **Timeline view** - Visual representation of the complete journey including flights and all hotel stays

### 5. Checkout & Payment
Comprehensive checkout flow collecting:
- **Traveler information** - Personal details for all passengers
- **Contact details** - Email and phone number
- **Payment information** - Secure payment processing
- **Price breakdown** - Complete transparency showing base prices, taxes, and fees

The system revalidates all selections before finalizing the booking.

### 6. Confirmation & Trip Management
After booking, users receive:
- **Confirmation number** - Unique booking identifier
- **Complete itinerary** - Detailed breakdown of flights and accommodations

The **"My Trips"** section allows users to:
- View all bookings with detailed itineraries
- Request cancellations or changes
- Contact support with built-in support options
- Track booking status

### Pages

- `/` - Home page with wonder selection grid
- `/book/[wonderId]` - Journey planning form for selected wonder
- `/flights` - Flight search, filtering, and selection
- `/hotels` - Hotel itinerary builder with timeline view
- `/checkout` - Payment and traveler information collection
- `/confirmation` - Booking confirmation with itinerary details
- `/my-trips` - View and manage all bookings
- `/blogs` - Blog listing page with travel guides and tips
- `/blogs/[slug]` - Individual blog post page

## 🔧 API Server

The API server is built with:
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Winston** - Logging
- **Swagger** - API documentation

### API Documentation

Swagger documentation available at:
- `http://localhost:3001/api-docs`

### Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check

#### Blogs API

- `GET /api/blogs` - Get all blog posts (supports query params: category, tag, page, limit)
- `GET /api/blogs/:slug` - Get a single blog post by slug
- `GET /api/blogs/categories` - Get all unique categories
- `GET /api/blogs/tags` - Get all unique tags

### Logging

Logs are stored in `server/logs/`:
- `combined.log` - All application logs
- `error.log` - Error logs only
- `requests.log` - Request/response logs

## 🔐 Environment Variables

### Server

Create a `.env` file in the `server/` directory:

```env
MONGODB_URI=mongodb://localhost:27017/travel-wonders
PORT=3001
NODE_ENV=development
LOG_LEVEL=info
```

- `MONGODB_URI` - MongoDB connection string (required)
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment mode (development/production/test)
- `LOG_LEVEL` - Logging level (error/warn/info/verbose/debug/silly)

### Web

Create a `.env.local` file in the `web/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

- `NEXT_PUBLIC_API_URL` - Backend API base URL (default: http://localhost:3001)

## 📝 License

ISC

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

