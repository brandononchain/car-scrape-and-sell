import { useState, useEffect } from 'react';
import { 
  type CarListing, 
  type ScraperConfig, 
  type ScraperStatus, 
  type ScrapeResult 
} from '@/types';

interface UseScraperProps {
  initialConfig?: Partial<ScraperConfig>;
}

export function useScraper({ initialConfig }: UseScraperProps = {}) {
  const [config, setConfig] = useState<ScraperConfig>({
    dealershipUrl: initialConfig?.dealershipUrl || '',
    scheduleFrequency: initialConfig?.scheduleFrequency || 'daily',
    autoPublishToFb: initialConfig?.autoPublishToFb ?? true,
    includeImages: initialConfig?.includeImages ?? true,
    maxListings: initialConfig?.maxListings || 100,
    sheetsId: initialConfig?.sheetsId,
  });
  
  const [status, setStatus] = useState<ScraperStatus>({
    isScrapingActive: false,
    lastScraped: null,
    nextScheduledScrape: null,
    lastResult: null,
  });
  
  const [cars, setCars] = useState<CarListing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const sampleCars: CarListing[] = [
    {
      id: '1',
      title: '2019 Toyota Camry XSE V6',
      price: 25990,
      year: 2019,
      make: 'Toyota',
      model: 'Camry',
      trim: 'XSE V6',
      mileage: 32456,
      exteriorColor: 'Midnight Black',
      interiorColor: 'Red',
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      drivetrain: 'FWD',
      engineSize: '3.5L V6',
      description: 'Low mileage, one owner Toyota Camry XSE with all available options.',
      features: ['Leather Seats', 'Navigation', 'Panoramic Sunroof', 'Heated Seats'],
      images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=2000&auto=format&fit=crop'],
      dealershipUrl: 'https://example-dealership.com',
      originalListingUrl: 'https://example-dealership.com/inventory/1',
      dateScraped: '2023-05-10T14:32:00Z',
      status: 'active',
      lastUpdated: '2023-05-10T14:32:00Z',
    },
    {
      id: '2',
      title: '2020 Honda Accord Sport 2.0T',
      price: 27850,
      year: 2020,
      make: 'Honda',
      model: 'Accord',
      trim: 'Sport 2.0T',
      mileage: 18765,
      exteriorColor: 'Modern Steel',
      interiorColor: 'Black',
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      drivetrain: 'FWD',
      engineSize: '2.0L Turbo',
      description: 'Certified Pre-Owned Honda Accord Sport with remaining factory warranty.',
      features: ['Apple CarPlay', 'Android Auto', 'Blind Spot Monitor', 'Lane Keep Assist'],
      images: ['https://images.unsplash.com/photo-1570733577524-3a047079e80d?q=80&w=2000&auto=format&fit=crop'],
      dealershipUrl: 'https://example-dealership.com',
      originalListingUrl: 'https://example-dealership.com/inventory/2',
      dateScraped: '2023-05-11T09:15:00Z',
      status: 'new',
      lastUpdated: '2023-05-11T09:15:00Z',
    },
    {
      id: '3',
      title: '2018 BMW 540i xDrive',
      price: 36750,
      year: 2018,
      make: 'BMW',
      model: '540i',
      trim: 'xDrive',
      mileage: 45210,
      exteriorColor: 'Alpine White',
      interiorColor: 'Cognac',
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      drivetrain: 'AWD',
      engineSize: '3.0L Turbo',
      description: 'Executive package BMW 540i with M Sport styling and premium features.',
      features: ['Heated Steering Wheel', 'Harman Kardon Audio', 'Heads-Up Display', 'Adaptive Cruise Control'],
      images: ['https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?q=80&w=2000&auto=format&fit=crop'],
      dealershipUrl: 'https://example-dealership.com',
      originalListingUrl: 'https://example-dealership.com/inventory/3',
      dateScraped: '2023-05-08T11:45:00Z',
      status: 'sold',
      fbMarketplaceId: 'fb123456',
      fbMarketplaceUrl: 'https://facebook.com/marketplace/item/123456',
      lastUpdated: '2023-05-12T16:20:00Z',
    },
  ];
  
  const simulateScrape = async () => {
    if (!config.dealershipUrl) {
      console.error('Dealership URL is required');
      return;
    }
    
    setIsLoading(true);
    setStatus(prev => ({ ...prev, isScrapingActive: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newCars = sampleCars.filter(car => !cars.some(c => c.id === car.id));
      setCars(prev => [...prev, ...newCars]);
      
      const result: ScrapeResult = {
        totalFound: sampleCars.length,
        new: newCars.length,
        updated: 1,
        sold: 1,
        unchanged: sampleCars.length - newCars.length - 1 - 1,
        timestamp: new Date().toISOString(),
      };
      
      setStatus({
        isScrapingActive: false,
        lastScraped: new Date().toISOString(),
        nextScheduledScrape: getNextScheduledTime(config.scheduleFrequency),
        lastResult: result,
      });
      
      return result;
    } catch (error) {
      console.error('Error during scraping:', error);
      
      setStatus(prev => ({
        ...prev,
        isScrapingActive: false,
        lastResult: {
          totalFound: 0,
          new: 0,
          updated: 0,
          sold: 0,
          unchanged: 0,
          errors: [(error as Error).message || 'Unknown error during scraping'],
          timestamp: new Date().toISOString(),
        },
      }));
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const getNextScheduledTime = (frequency: ScraperConfig['scheduleFrequency']) => {
    const now = new Date();
    let next = new Date(now);
    
    switch (frequency) {
      case 'hourly':
        next.setHours(now.getHours() + 1);
        break;
      case 'daily':
        next.setDate(now.getDate() + 1);
        next.setHours(8, 0, 0, 0);
        break;
      case 'weekly':
        next.setDate(now.getDate() + 7);
        next.setHours(8, 0, 0, 0);
        break;
      case 'manual':
      default:
        return null;
    }
    
    return next.toISOString();
  };
  
  const updateConfig = (newConfig: Partial<ScraperConfig>) => {
    setConfig(prev => {
      const updated = { ...prev, ...newConfig };
      
      if (newConfig.scheduleFrequency && newConfig.scheduleFrequency !== prev.scheduleFrequency) {
        setStatus(prevStatus => ({
          ...prevStatus,
          nextScheduledScrape: getNextScheduledTime(newConfig.scheduleFrequency!),
        }));
      }
      
      return updated;
    });
  };
  
  useEffect(() => {
    if (initialConfig?.dealershipUrl) {
      setStatus(prev => ({
        ...prev,
        nextScheduledScrape: getNextScheduledTime(config.scheduleFrequency),
      }));
    }
  }, []);
  
  return {
    config,
    updateConfig,
    status,
    cars,
    isLoading,
    scrape: simulateScrape,
  };
}
