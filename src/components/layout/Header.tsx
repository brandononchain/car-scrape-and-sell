
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Car, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled 
          ? 'py-3 bg-white/80 dark:bg-black/50 backdrop-blur-lg shadow-sm' 
          : 'py-5 bg-transparent'
      )}
    >
      <div className="container flex items-center justify-between">
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <span className="flex items-center justify-center w-10 h-10 bg-primary rounded-xl shadow-sm">
            <Car className="w-5 h-5 text-white" />
          </span>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold flex items-center">
              AutoScraper
              <ChevronRight className="w-4 h-4 text-muted-foreground inline mx-0.5" />
              <span className="text-primary">Marketplace</span>
            </h1>
            <p className="text-xs text-muted-foreground">Dealership to Facebook Automation</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-center px-3 py-1.5 rounded-lg border border-border bg-background/50 shadow-subtle">
            <BarChart2 className="w-4 h-4 text-primary mr-2" />
            <span className="text-sm font-medium">0 Active Listings</span>
          </div>
          
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <span className="text-xs font-medium">AS</span>
            </div>
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background"></span>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}
