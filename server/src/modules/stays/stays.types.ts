/**
 * Stays Types
 * 
 * Domain types for stays/accommodations
 */

export interface SearchStaysInput {
  latitude: number;
  longitude: number;
  radius?: number; // in kilometers, default 5
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  rooms: number;
  guests: {
    adults: number;
    children?: number;
    childrenAges?: number[]; // Required if children > 0
  };
}

export interface Accommodation {
  id: string;
  searchResultId: string;
  name: string;
  address: {
    lineOne: string;
    lineTwo?: string;
    city: string;
    region?: string;
    postalCode?: string;
    country: string;
    countryCode: string;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  images?: Array<{
    url: string;
    category?: string;
  }>;
  amenities?: Array<{
    name: string;
    category?: string;
  }>;
  starRating?: number;
}

export interface RoomRate {
  id: string;
  searchResultId: string;
  room: {
    name: string;
    bedConfigurations?: Array<{
      type: string;
      count: number;
    }>;
    amenities?: Array<{
      name: string;
      category?: string;
    }>;
  };
  totalAmount: number; // Price in cents
  totalCurrency: string;
  cancellationPolicy?: {
    type: string;
    description?: string;
  };
}

export interface StaysQuote {
  id: string;
  rateId: string;
  totalAmount: number; // Price in cents
  totalCurrency: string;
  expiresAt: string;
}

