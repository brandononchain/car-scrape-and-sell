
import { useState, useEffect } from 'react';
import { 
  type CarListing, 
  type ScraperConfig, 
  type ScraperStatus, 
  type ScrapeResult 
} from '@/types';
import { 
  scrapeWebsite, 
  syncWithGoogleSheets, 
  publishToFacebook, 
  getNextScheduledTime 
} from '@/services/scraperService';
import { useToast } from "@/components/ui/use-toast";

interface UseScraperProps {
  initialConfig?: Partial<ScraperConfig>;
}

export function useScraper({ initialConfig }: UseScraperProps = {}) {
  const { toast } = useToast();
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
  
  // This function handles the main scraping process
  const scrape = async () => {
    if (!config.dealershipUrl) {
      toast({
        title: "Error",
        description: "Dealership URL is required",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setStatus(prev => ({ ...prev, isScrapingActive: true }));
    
    try {
      // Call our scraper service
      const { listings, result } = await scrapeWebsite(config);
      
      // Update car listings
      setCars(prevCars => {
        // Find new or updated cars
        const updatedCars = [...prevCars];
        
        // Process new listings
        for (const listing of listings) {
          const existingIndex = updatedCars.findIndex(car => car.id === listing.id);
          if (existingIndex >= 0) {
            // Update existing listing
            updatedCars[existingIndex] = listing;
          } else {
            // Add new listing
            updatedCars.push(listing);
          }
        }
        
        return updatedCars;
      });
      
      // If Google Sheets integration is enabled, sync the data
      if (config.sheetsId) {
        const syncSuccess = await syncWithGoogleSheets(config.sheetsId, listings);
        if (syncSuccess) {
          toast({
            title: "Google Sheets Synced",
            description: `Successfully synced ${listings.length} listings`,
          });
        } else {
          toast({
            title: "Google Sheets Sync Failed",
            description: "Unable to update Google Sheets. Please check your connection.",
            variant: "destructive",
          });
        }
      }
      
      // If auto-publish to Facebook is enabled, publish new listings
      if (config.autoPublishToFb) {
        const newListings = listings.filter(listing => 
          listing.status === 'new' && !listing.fbMarketplaceId
        );
        
        if (newListings.length > 0) {
          toast({
            title: "Publishing to Facebook",
            description: `Attempting to publish ${newListings.length} new listings`,
          });
          
          for (const listing of newListings) {
            const result = await publishToFacebook(listing);
            if (result.success && result.fbMarketplaceId) {
              // Update the listing with Facebook info
              setCars(prevCars => {
                return prevCars.map(car => {
                  if (car.id === listing.id) {
                    return {
                      ...car,
                      fbMarketplaceId: result.fbMarketplaceId,
                      fbMarketplaceUrl: result.fbMarketplaceUrl,
                    };
                  }
                  return car;
                });
              });
            }
          }
        }
      }
      
      // Update status
      setStatus({
        isScrapingActive: false,
        lastScraped: new Date().toISOString(),
        nextScheduledScrape: getNextScheduledTime(config.scheduleFrequency),
        lastResult: result,
      });
      
      return result;
    } catch (error) {
      console.error('Error during scraping:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during scraping';
      
      toast({
        title: "Scraping Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Update with error information
      setStatus(prev => ({
        ...prev,
        isScrapingActive: false,
        lastResult: {
          totalFound: 0,
          new: 0,
          updated: 0,
          sold: 0,
          unchanged: 0,
          errors: [errorMessage],
          timestamp: new Date().toISOString(),
        },
      }));
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update configuration
  const updateConfig = (newConfig: Partial<ScraperConfig>) => {
    setConfig(prev => {
      const updated = { ...prev, ...newConfig };
      
      // If frequency changed, update next scheduled scrape
      if (newConfig.scheduleFrequency && newConfig.scheduleFrequency !== prev.scheduleFrequency) {
        setStatus(prevStatus => ({
          ...prevStatus,
          nextScheduledScrape: getNextScheduledTime(newConfig.scheduleFrequency!),
        }));
      }
      
      return updated;
    });
  };
  
  // Handle publishing a single listing to Facebook
  const publishListing = async (carId: string) => {
    const car = cars.find(c => c.id === carId);
    if (!car) {
      toast({
        title: "Error",
        description: "Car listing not found",
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Publishing to Facebook",
      description: `Attempting to publish: ${car.title}`,
    });
    
    try {
      const result = await publishToFacebook(car);
      
      if (result.success && result.fbMarketplaceId) {
        // Update the car with Facebook info
        setCars(prevCars => {
          return prevCars.map(c => {
            if (c.id === carId) {
              return {
                ...c,
                fbMarketplaceId: result.fbMarketplaceId,
                fbMarketplaceUrl: result.fbMarketplaceUrl,
              };
            }
            return c;
          });
        });
        
        toast({
          title: "Published Successfully",
          description: "Listing has been published to Facebook Marketplace",
        });
        
        return true;
      } else {
        toast({
          title: "Publishing Failed",
          description: "Unable to publish to Facebook. Please try again.",
          variant: "destructive",
        });
        
        return false;
      }
    } catch (error) {
      console.error('Error publishing to Facebook:', error);
      
      toast({
        title: "Publishing Failed",
        description: "An error occurred while publishing to Facebook",
        variant: "destructive",
      });
      
      return false;
    }
  };
  
  // Setup scheduler for automated scraping
  useEffect(() => {
    // If we have a nextScheduledScrape, set up a timer
    if (status.nextScheduledScrape) {
      const nextTime = new Date(status.nextScheduledScrape).getTime();
      const now = new Date().getTime();
      const delay = nextTime - now;
      
      if (delay > 0) {
        // Schedule next scrape
        const timerId = setTimeout(() => {
          scrape();
        }, delay);
        
        // Clean up timer on unmount or config change
        return () => clearTimeout(timerId);
      }
    }
  }, [status.nextScheduledScrape, config.scheduleFrequency]);
  
  // Initial setup
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
    scrape,
    publishListing,
  };
}
