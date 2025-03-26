
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Car, BarChart2, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled 
          ? 'py-2 md:py-3 bg-white/90 dark:bg-black/50 backdrop-blur-lg shadow-sm' 
          : 'py-3 md:py-5 bg-transparent'
      )}
    >
      <div className="container flex items-center justify-between">
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <span className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-primary rounded-xl shadow-sm">
            <Car className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </span>
          <div className="flex flex-col">
            <h1 className="text-base md:text-lg font-semibold flex items-center">
              AutoScraper
              <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground inline mx-0.5" />
              <span className="text-primary hidden xs:inline">Marketplace</span>
            </h1>
            <p className="text-[10px] md:text-xs text-muted-foreground hidden xs:block">Dealership to Facebook Automation</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-2 md:gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="hidden sm:flex items-center px-3 py-1.5 rounded-lg border border-border bg-background/50 shadow-subtle">
            <BarChart2 className="w-4 h-4 text-primary mr-2" />
            <span className="text-sm font-medium">0 Active Listings</span>
          </div>
          
          <div className="relative">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-secondary flex items-center justify-center">
              <span className="text-xs font-medium">AS</span>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 md:w-3 md:h-3 bg-primary rounded-full border-2 border-background"></span>
          </div>
          
          <button 
            className="ml-1 sm:hidden text-muted-foreground hover:text-foreground transition-colors"
            onClick={toggleMenu}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </motion.div>
      </div>
      
      {/* Mobile menu */}
      {menuOpen && isMobile && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 bg-card border-b border-border shadow-md p-4"
        >
          <div className="flex items-center px-3 py-2 rounded-lg border border-border bg-background/50 shadow-subtle mb-2">
            <BarChart2 className="w-4 h-4 text-primary mr-2" />
            <span className="text-sm font-medium">0 Active Listings</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <button className="text-left py-2 px-3 rounded-md hover:bg-muted transition-colors">
              Scraper Settings
            </button>
            <button className="text-left py-2 px-3 rounded-md hover:bg-muted transition-colors">
              Listing Manager
            </button>
            <button className="text-left py-2 px-3 rounded-md hover:bg-muted transition-colors">
              Facebook Connect
            </button>
            <button className="text-left py-2 px-3 rounded-md hover:bg-muted transition-colors">
              Google Sheets
            </button>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
