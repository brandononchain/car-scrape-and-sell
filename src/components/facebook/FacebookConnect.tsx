
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Facebook, Link2, Unlink, Check, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type FacebookAuth } from '@/types';

interface FacebookConnectProps {
  auth: FacebookAuth | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function FacebookConnect({ auth, onConnect, onDisconnect }: FacebookConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  
  const handleConnect = () => {
    setIsConnecting(true);
    
    // Simulate API connection
    setTimeout(() => {
      onConnect();
      setIsConnecting(false);
    }, 1500);
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
            <Facebook className="w-4 h-4 text-blue-600" />
            Facebook Marketplace
          </h3>
          
          {auth?.isConnected ? (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full border border-blue-200 flex items-center">
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
        
        {auth?.isConnected ? (
          <div className="space-y-4">
            <div className="bg-secondary/30 p-4 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Connected to Page:</span>
              </div>
              <div className="text-sm flex items-center">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                  <Facebook className="w-3 h-3 text-blue-600" />
                </div>
                <span>{auth.pageName || 'Your Business Page'}</span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
              onClick={onDisconnect}
            >
              <Unlink className="w-4 h-4 mr-2" />
              Disconnect Facebook
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Connect to Facebook Marketplace to automatically list vehicles for sale.
            </p>
            
            <Button
              variant="default"
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Facebook className="w-4 h-4 mr-2" />
                  Connect to Facebook
                </>
              )}
            </Button>
            
            <div className="text-xs text-muted-foreground">
              <p>By connecting, you'll be able to:</p>
              <ul className="list-disc pl-4 space-y-1 mt-1">
                <li>Automatically list vehicles on Marketplace</li>
                <li>Manage listings from this dashboard</li>
                <li>Track listing performance</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
