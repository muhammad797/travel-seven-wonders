# Seven Wonders Travel Booking Platform

A comprehensive travel booking web application that allows users to plan and book trips to the Seven Wonders of the World. Built with Next.js and Express.js, featuring authentication, flight booking, hotel reservations, and travel blog content.

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
- MongoDB (local or cloud instance)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd travel-seven-wonders--personal
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

3. Set up environment variables (see [Environment Variables](#-environment-variables) section)

4. Seed the database (optional):
```bash
cd server
npm run seed:blogs
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
travel-seven-wonders--personal/
├── web/                          # Next.js frontend application
│   ├── app/                     # Next.js app router pages
│   │   ├── about/               # About page
│   │   ├── account/             # User account management
│   │   ├── blogs/               # Blog listing and detail pages
│   │   ├── book/                # Booking flow
│   │   ├── checkout/            # Checkout process
│   │   ├── confirmation/        # Booking confirmation
│   │   ├── faqs/                # FAQ page
│   │   ├── flights/             # Flight search and booking
│   │   ├── hotels/              # Hotel search and booking
│   │   ├── login/               # Login page
│   │   ├── signup/              # Signup page
│   │   ├── my-trips/            # User trip management
│   │   └── ...                  # Other pages
│   ├── components/              # React components
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── header.tsx           # Navigation header
│   │   ├── footer.tsx           # Footer component
│   │   ├── booking-form.tsx     # Booking form component
│   │   └── ...                  # Other components
│   ├── lib/                     # Utilities and API clients
│   │   ├── api/                 # API client functions
│   │   ├── contexts/            # React contexts
│   │   ├── hooks/               # Custom React hooks
│   │   └── utils.ts             # Utility functions
│   └── public/                  # Static assets
│
└── server/                      # Express.js API server
    ├── src/
    │   ├── config/              # Configuration files
    │   │   ├── database.ts      # MongoDB connection
    │   │   ├── env.ts           # Environment variables
    │   │   └── swagger.ts       # API documentation
    │   ├── modules/             # Feature modules
    │   │   ├── auth/            # Authentication module
    │   │   ├── blogs/           # Blog management
    │   │   ├── flights/         # Flight operations
    │   │   ├── places/          # Places/destinations
    │   │   └── stays/           # Hotel/stay management
    │   ├── middleware/          # Express middleware
    │   ├── integrations/        # Third-party integrations
    │   │   └── duffel/          # Duffel API integration
    │   ├── utils/               # Utility functions
    │   │   ├── logger.ts        # Winston logger
    │   │   └── email.ts         # Email utilities
    │   ├── scripts/             # Database seeding scripts
    │   └── server.ts            # Express app entry point
    ├── dist/                    # Compiled JavaScript
    └── logs/                    # Application logs
```

## 🌐 Web Application

The web application is built with:
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - UI component library
- **Radix UI** - Accessible component primitives
- **next-themes** - Dark mode support
- **Lucide React** - Icon library

### Key Features

- **Responsive Design** - Mobile-first approach
- **Dark Mode** - Theme switching support
- **Authentication** - User registration, login, and email verification
- **Booking Flow** - Complete journey from wonder selection to confirmation
- **Trip Management** - View and manage bookings
- **Blog System** - Travel guides and tips
- **Account Management** - User profile and settings

### Pages

- `/` - Home page with wonder selection grid
- `/about` - About page
- `/blogs` - Blog listing page with travel guides and tips
- `/blogs/[slug]` - Individual blog post page
- `/book/[wonderId]` - Journey planning form for selected wonder
- `/flights` - Flight search, filtering, and selection
- `/hotels` - Hotel itinerary builder with timeline view
- `/checkout` - Payment and traveler information collection
- `/confirmation` - Booking confirmation with itinerary details
- `/my-trips` - View and manage all bookings
- `/account` - User account management
- `/login` - User login
- `/signup` - User registration
- `/forgot-password` - Password reset request
- `/reset-password` - Password reset form
- `/verify-email` - Email verification
- `/reviews` - Reviews page
- `/rewards` - Rewards program
- `/faqs` - Frequently asked questions
- `/privacy` - Privacy policy
- `/terms` - Terms of service

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

## 🔧 API Server

The API server is built with:
- **Express.js 5** - Web framework
- **TypeScript** - Type safety
- **MongoDB/Mongoose** - Database and ODM
- **Passport.js** - Authentication (Local & JWT strategies)
- **Winston** - Logging
- **Swagger** - API documentation
- **Zod** - Schema validation
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT token generation

### API Documentation

Swagger documentation available at:
- `http://localhost:3001/api-docs`

### API Endpoints

#### General
- `GET /` - Welcome message
- `GET /health` - Health check endpoint

#### Authentication (`/api/auth`)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/verify-email` - Verify email address
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

#### Blogs (`/api/blogs`)
- `GET /api/blogs` - Get all blog posts (supports query params: category, tag, page, limit)
- `GET /api/blogs/:slug` - Get a single blog post by slug
- `GET /api/blogs/categories` - Get all unique categories
- `GET /api/blogs/tags` - Get all unique tags

#### Places (`/api/places`)
- `GET /api/places` - Get all places/destinations
- `GET /api/places/:id` - Get a specific place

#### Flights (`/api/flights`)
- `GET /api/flights` - Search flights
- `GET /api/flights/:id` - Get flight details
- `POST /api/flights/book` - Book a flight (protected)

#### Stays (`/api/stays`)
- `GET /api/stays` - Search hotels/stays
- `GET /api/stays/:id` - Get stay details
- `POST /api/stays/book` - Book a stay (protected)

### Testing

Run tests with:
```bash
cd server
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
npm run test:verbose  # Verbose output
```

### Logging

Logs are stored in `server/logs/`:
- `combined.log` - All application logs
- `error.log` - Error logs only
- `requests.log` - Request/response logs

## 🔐 Environment Variables

### Server

Create a `.env` file in the `server/` directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/travel-wonders

# Server
PORT=3001
NODE_ENV=development

# Logging
LOG_LEVEL=info

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# Email (if using email features)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
```

**Required Variables:**
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token signing

**Optional Variables:**
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment mode (development/production/test)
- `LOG_LEVEL` - Logging level (error/warn/info/verbose/debug/silly)
- `JWT_EXPIRES_IN` - JWT token expiration (default: 7d)

### Web

Create a `.env.local` file in the `web/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

- `NEXT_PUBLIC_API_URL` - Backend API base URL (default: http://localhost:3001)

## 🧪 Development

### Database Seeding

Seed the database with blog posts:
```bash
cd server
npm run seed:blogs
```

### Code Structure

- **Modular Architecture** - Features organized into modules (auth, blogs, flights, etc.)
- **Type Safety** - Full TypeScript support across both frontend and backend
- **API Client** - Centralized API client in `web/lib/api/`
- **Context Providers** - React contexts for global state management
- **Middleware** - Request logging and authentication middleware

## 📝 License

ISC

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🔗 Related Documentation

- [Server README](./server/README.md) - Server-specific documentation
- [API Documentation](http://localhost:3001/api-docs) - Swagger API docs (when server is running)

