
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileSpreadsheet, Link2, Unlink, ExternalLink, Check, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type SheetInfo } from '@/types';
import { initiateGoogleAuth, disconnectGoogle } from '@/services/authService';
import { useToast } from '@/components/ui/use-toast';

interface SheetsConnectProps {
  sheetInfo: SheetInfo | null;
  onConnect: (sheetId: string) => void;
  onDisconnect: () => void;
}

export function SheetsConnect({ sheetInfo, onConnect, onDisconnect }: SheetsConnectProps) {
  const { toast } = useToast();
  const [sheetId, setSheetId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  
  const handleConnect = async () => {
    if (!sheetId) {
      toast({
        title: "Missing Information",
        description: "Please enter a Google Sheet ID",
        variant: "destructive",
      });
      return;
    }
    
    setIsConnecting(true);
    
    try {
      // Get auth URL from backend
      const { authUrl } = await initiateGoogleAuth();
      
      // Add sheet ID as state parameter to auth URL
      const authUrlWithState = `${authUrl}&state=${encodeURIComponent(sheetId)}`;
      
      // Open popup for OAuth flow
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const popup = window.open(
        authUrlWithState,
        'google-auth',
        `width=${width},height=${height},left=${left},top=${top}`
      );
      
      // Poll for auth completion
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          onConnect(sheetId); // Pass the sheet ID to parent
          setIsConnecting(false);
          setSheetId('');
        }
      }, 500);
    } catch (error) {
      console.error('Google connect error:', error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to Google Sheets. Please try again.",
        variant: "destructive",
      });
      setIsConnecting(false);
    }
  };
  
  const handleDisconnect = async () => {
    try {
      const success = await disconnectGoogle();
      
      if (success) {
        onDisconnect();
        toast({
          title: "Disconnected",
          description: "Successfully disconnected from Google Sheets.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to disconnect. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Google disconnect error:', error);
      toast({
        title: "Error",
        description: "Failed to disconnect. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-card rounded-xl shadow-subtle border border-border overflow-hidden"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-green-600" />
            Google Sheets Integration
          </h3>
          
          {sheetInfo ? (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full border border-green-200 flex items-center">
              <Check className="w-3 h-3 mr-1" />
              Connected
            </span>
          ) : (
            <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full border border-border flex items-center">
              <X className="w-3 h-3 mr-1" />
              Not Connected
            </span>
          )}
        </div>
        
        {sheetInfo ? (
          <div className="space-y-4">
            <div className="bg-secondary/30 p-4 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{sheetInfo.name}</span>
                <a 
                  href={sheetInfo.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-primary flex items-center hover:underline"
                >
                  View Sheet
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
              <div className="text-xs text-muted-foreground flex justify-between">
                <span>Last updated: {new Date(sheetInfo.lastUpdated).toLocaleString()}</span>
                <span>ID: {sheetInfo.id.slice(0, 8)}...</span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
              onClick={handleDisconnect}
            >
              <Unlink className="w-4 h-4 mr-2" />
              Disconnect Sheet
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Connect to a Google Sheet to store and manage your scraped vehicle data.
            </p>
            
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter Google Sheet ID or URL"
                value={sheetId}
                onChange={(e) => setSheetId(e.target.value)}
                className="bg-muted/50 border-muted focus:border-primary"
              />
              
              <Button
                variant="default"
                onClick={handleConnect}
                disabled={!sheetId || isConnecting}
                className="whitespace-nowrap"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4 mr-2" />
                    Connect
                  </>
                )}
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <p className="mb-1">How to find your Google Sheet ID:</p>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Create a new Google Sheet</li>
                <li>Share the sheet with edit permissions</li>
                <li>Copy the ID from the URL (long string between /d/ and /edit)</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
