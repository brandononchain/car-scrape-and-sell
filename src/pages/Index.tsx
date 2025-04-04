
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Container } from '@/components/layout/Container';
import { ScrapeForm } from '@/components/scraper/ScrapeForm';
import { StatusPanel } from '@/components/scraper/StatusPanel';
import { CarList } from '@/components/listings/CarList';
import { SheetsConnect } from '@/components/sheets/SheetsConnect';
import { FacebookConnect } from '@/components/facebook/FacebookConnect';
import { useScraper } from '@/hooks/useScraper';
import { type SheetInfo, type FacebookAuth, type ScraperConfig } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { getFacebookAuthStatus, getGoogleAuthStatus } from '@/services/authService';

const Index = () => {
  const { toast } = useToast();
  
  const {
    config,
    updateConfig,
    status,
    cars,
    isLoading,
    scrape,
    publishListing,
  } = useScraper();
  
  const [sheetInfo, setSheetInfo] = useState<SheetInfo | null>(null);
  const [fbAuth, setFbAuth] = useState<FacebookAuth | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  
  // Check authentication status on load
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoadingAuth(true);
      
      try {
        // Check Facebook auth status
        const fbStatus = await getFacebookAuthStatus();
        setFbAuth(fbStatus);
        
        // Check Google auth status
        const isGoogleConnected = await getGoogleAuthStatus();
        
        if (isGoogleConnected && config.sheetsId) {
          setSheetInfo({
            id: config.sheetsId,
            name: 'Auto Scraper Data',
            url: `https://docs.google.com/spreadsheets/d/${config.sheetsId}`,
            lastUpdated: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoadingAuth(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Connect to Google Sheets
  const handleConnectSheet = (sheetId: string) => {
    // Update the scraper config with the sheet ID
    updateConfig({ sheetsId: sheetId });
    
    // Store sheet info for display
    setSheetInfo({
      id: sheetId,
      name: 'Auto Scraper Data',
      url: `https://docs.google.com/spreadsheets/d/${sheetId}`,
      lastUpdated: new Date().toISOString(),
    });
    
    toast({
      title: 'Connected to Google Sheets',
      description: 'Vehicle data will now be synced with your spreadsheet',
    });
  };
  
  // Disconnect from Google Sheets
  const handleDisconnectSheet = () => {
    // Remove sheet ID from config
    updateConfig({ sheetsId: undefined });
    setSheetInfo(null);
    
    toast({
      title: 'Disconnected from Google Sheets',
      description: 'Your spreadsheet will no longer be updated',
    });
  };
  
  // Connect to Facebook
  const handleConnectFacebook = async () => {
    // Refresh auth status after connection
    const updatedFbStatus = await getFacebookAuthStatus();
    setFbAuth(updatedFbStatus);
    
    if (updatedFbStatus.isConnected) {
      toast({
        title: 'Connected to Facebook',
        description: 'You can now publish listings to Facebook Marketplace',
      });
    }
  };
  
  // Disconnect from Facebook
  const handleDisconnectFacebook = () => {
    // Update config to disable auto-publishing
    updateConfig({ autoPublishToFb: false });
    setFbAuth(null);
    
    toast({
      title: 'Disconnected from Facebook',
      description: 'Auto-publishing to Facebook has been disabled',
    });
  };
  
  // Configure and start scraper
  const handleConfigureScraper = async (config: ScraperConfig) => {
    updateConfig(config);
    
    toast({
      title: 'Scraper Configured',
      description: 'Starting initial scan...',
    });
    
    const result = await scrape();
    
    if (result) {
      toast({
        title: 'Initial Scan Complete',
        description: `Found ${result.totalFound} vehicles (${result.new} new)`,
      });
    }
  };
  
  // Run manual scrape
  const handleManualScrape = async () => {
    const result = await scrape();
    
    if (result) {
      toast({
        title: 'Manual Scan Complete',
        description: `Found ${result.totalFound} vehicles (${result.new} new, ${result.updated} updated)`,
      });
    }
  };
  
  // Publish a listing to Facebook
  const handlePublishToFB = async (carId: string) => {
    if (!fbAuth?.isConnected) {
      toast({
        title: 'Not Connected to Facebook',
        description: 'Please connect to Facebook Marketplace first',
        variant: 'destructive',
      });
      return false;
    }
    
    try {
      const success = await publishListing(carId);
      return success;
    } catch (error) {
      console.error('Error publishing to Facebook:', error);
      toast({
        title: 'Publishing Failed',
        description: 'An error occurred while publishing to Facebook',
        variant: 'destructive',
      });
      return false;
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="pt-24 pb-16"
      >
        <Container maxWidth="full" className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold mb-2">Auto Scraper & Marketplace Publisher</h1>
              <p className="text-muted-foreground">
                Automatically scrape vehicle listings from dealership websites and publish them to Facebook Marketplace
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
              <ScrapeForm 
                onSubmit={handleConfigureScraper}
                isLoading={isLoading}
              />
              
              <div className="space-y-6">
                <StatusPanel 
                  status={status}
                  onManualScrape={handleManualScrape}
                  isLoading={isLoading}
                />
                
                <SheetsConnect
                  sheetInfo={sheetInfo}
                  onConnect={handleConnectSheet}
                  onDisconnect={handleDisconnectSheet}
                />
              </div>
              
              <FacebookConnect
                auth={fbAuth}
                onConnect={handleConnectFacebook}
                onDisconnect={handleDisconnectFacebook}
              />
            </div>
            
            <CarList 
              cars={cars} 
              isLoading={isLoading || isLoadingAuth} 
              onPublishToFB={fbAuth?.isConnected ? handlePublishToFB : undefined}
            />
          </div>
        </Container>
      </motion.main>
    </div>
  );
};

export default Index;
