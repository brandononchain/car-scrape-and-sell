
import { CarListing, ScraperConfig, ScrapeResult } from '@/types';

// Base URL for our backend API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// This function calls our backend scraping service
export async function scrapeWebsite(config: ScraperConfig): Promise<{
  listings: CarListing[];
  result: ScrapeResult;
}> {
  console.log(`Requesting scrape for: ${config.dealershipUrl}`);
  
  try {
    const response = await fetch(`${API_BASE_URL}/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to scrape website');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Scraping error:', error);
    throw error;
  }
}

// Google Sheets integration service
export async function syncWithGoogleSheets(
  sheetId: string, 
  listings: CarListing[]
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/sheets/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sheetId, listings }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to sync with Google Sheets');
    }
    
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Google Sheets sync error:', error);
    throw error;
  }
}

// Facebook Marketplace integration service
export async function publishToFacebook(
  listing: CarListing
): Promise<{ success: boolean; fbMarketplaceId?: string; fbMarketplaceUrl?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/facebook/publish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ listing }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to publish to Facebook');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Facebook publishing error:', error);
    return { success: false };
  }
}

// Scheduler service
export function getNextScheduledTime(frequency: ScraperConfig['scheduleFrequency']): string | null {
  const now = new Date();
  let next = new Date(now);
  
  switch (frequency) {
    case 'hourly':
      next.setHours(now.getHours() + 1);
      break;
    case 'daily':
      next.setDate(now.getDate() + 1);
      next.setHours(8, 0, 0, 0); // 8:00 AM
      break;
    case 'weekly':
      next.setDate(now.getDate() + 7);
      next.setHours(8, 0, 0, 0); // 8:00 AM
      break;
    case 'manual':
    default:
      return null;
  }
  
  return next.toISOString();
}
