
export interface CarListing {
  id: string;
  title: string;
  price: number;
  year: number;
  make: string;
  model: string;
  trim?: string;
  mileage: number;
  exteriorColor?: string;
  interiorColor?: string;
  fuelType?: string;
  transmission?: string;
  drivetrain?: string;
  engineSize?: string;
  description?: string;
  features?: string[];
  images: string[];
  dealershipUrl: string;
  originalListingUrl: string;
  dateScraped: string;
  status: 'new' | 'active' | 'sold' | 'pending';
  fbMarketplaceId?: string;
  fbMarketplaceUrl?: string;
  lastUpdated: string;
}

export interface ScraperConfig {
  dealershipUrl: string;
  scheduleFrequency: 'hourly' | 'daily' | 'weekly' | 'manual';
  autoPublishToFb: boolean;
  includeImages: boolean;
  maxListings?: number;
  sheetsId?: string;
}

export interface ScrapeResult {
  totalFound: number;
  new: number;
  updated: number;
  sold: number;
  unchanged: number;
  errors?: string[];
  timestamp: string;
}

export interface ScraperStatus {
  isScrapingActive: boolean;
  lastScraped: string | null;
  nextScheduledScrape: string | null;
  lastResult: ScrapeResult | null;
}

export interface SheetInfo {
  id: string;
  name: string;
  url: string;
  lastUpdated: string;
}

export interface FacebookAuth {
  isConnected: boolean;
  pageId?: string;
  pageName?: string;
}
