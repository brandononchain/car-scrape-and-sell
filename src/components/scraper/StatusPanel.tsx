
import { motion } from 'framer-motion';
import { 
  Clock, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  PlusCircle, 
  MinusCircle, 
  ArrowUpCircle
} from 'lucide-react';
import { type ScraperStatus, type ScrapeResult } from '@/types';
import { cn } from '@/lib/utils';

interface StatusPanelProps {
  status: ScraperStatus;
  onManualScrape: () => void;
  isLoading?: boolean;
}

export function StatusPanel({ status, onManualScrape, isLoading = false }: StatusPanelProps) {
  const { isScrapingActive, lastScraped, nextScheduledScrape, lastResult } = status;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-card rounded-xl shadow-subtle border border-border overflow-hidden"
    >
      <div className="p-6 border-b border-border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Scraper Status</h3>
          <div className="flex items-center gap-2">
            <span className={cn(
              "w-2 h-2 rounded-full animate-pulse",
              isScrapingActive ? "bg-green-500" : "bg-amber-500"
            )}></span>
            <span className="text-sm text-muted-foreground">
              {isScrapingActive ? "Active" : "Idle"}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Last Scraped</span>
              <span className="text-sm font-medium">
                {lastScraped || 'Never'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Next Update</span>
              <span className="text-sm font-medium">
                {nextScheduledScrape || 'Not scheduled'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {lastResult && (
        <div className="p-6 bg-secondary/30">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium">Last Result</h4>
            <span className="text-xs text-muted-foreground">{lastResult.timestamp}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <StatusItem 
              icon={<CheckCircle className="w-4 h-4 text-green-500" />}
              label="Total Found"
              value={lastResult.totalFound}
            />
            
            <StatusItem 
              icon={<PlusCircle className="w-4 h-4 text-blue-500" />}
              label="New Listings"
              value={lastResult.new}
            />
            
            <StatusItem 
              icon={<ArrowUpCircle className="w-4 h-4 text-amber-500" />}
              label="Updated"
              value={lastResult.updated}
            />
            
            <StatusItem 
              icon={<MinusCircle className="w-4 h-4 text-rose-500" />}
              label="Sold"
              value={lastResult.sold}
            />
          </div>
          
          {lastResult.errors && lastResult.errors.length > 0 && (
            <div className="mt-4 p-3 bg-destructive/10 rounded-lg border border-destructive/20 flex gap-2 items-start">
              <AlertTriangle className="w-4 h-4 text-destructive mt-0.5" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-destructive">Errors Detected</span>
                <span className="text-xs text-muted-foreground">
                  {lastResult.errors[0]}
                  {lastResult.errors.length > 1 && ` (+${lastResult.errors.length - 1} more)`}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="p-4 bg-muted/30 border-t border-border">
        <button
          onClick={onManualScrape}
          disabled={isLoading}
          className={cn(
            "w-full py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-colors",
            isLoading
              ? "bg-primary/70 text-primary-foreground cursor-not-allowed"
              : "bg-primary hover:bg-primary/90 text-primary-foreground"
          )}
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Scraping...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Run Manual Scrape
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

interface StatusItemProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}

function StatusItem({ icon, label, value }: StatusItemProps) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-medium">{value}</span>
      </div>
    </div>
  );
}
