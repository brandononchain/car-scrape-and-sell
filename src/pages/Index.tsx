
import { useState } from 'react';
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

const Index = () => {
  const { toast } = useToast();
  
  const {
    config,
    updateConfig,
    status,
    cars,
    isLoading,
    scrape,
  } = useScraper();
  
  const [sheetInfo, setSheetInfo] = useState<SheetInfo | null>(null);
  const [fbAuth, setFbAuth] = useState<FacebookAuth | null>(null);
  
  // Connect to Google Sheets
  const handleConnectSheet = (sheetId: string) => {
    // This would typically be an API call to validate and connect to the sheet
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
    setSheetInfo(null);
    
    toast({
      title: 'Disconnected from Google Sheets',
      description: 'Your spreadsheet will no longer be updated',
    });
  };
  
  // Connect to Facebook
  const handleConnectFacebook = () => {
    // This would typically involve OAuth flow with Facebook
    setFbAuth({
      isConnected: true,
      pageId: 'fb_page_123',
      pageName: 'Your Auto Business',
    });
    
    toast({
      title: 'Connected to Facebook',
      description: 'You can now publish listings to Facebook Marketplace',
    });
  };
  
  // Disconnect from Facebook
  const handleDisconnectFacebook = () => {
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
            
            <CarList cars={cars} isLoading={isLoading} />
          </div>
        </Container>
      </motion.main>
    </div>
  );
};

export default Index;
