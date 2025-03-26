
import { motion } from 'framer-motion';
import { ExternalLink, Clock, Calendar, Tag, Facebook } from 'lucide-react';
import { type CarListing } from '@/types';
import { cn } from '@/lib/utils';

interface CarCardProps {
  car: CarListing;
  onPublishToFB?: () => void;
}

export function CarCard({ car, onPublishToFB }: CarCardProps) {
  const {
    title,
    price,
    year,
    make,
    model,
    mileage,
    images,
    status,
    dateScraped,
    fbMarketplaceUrl
  } = car;
  
  const statusColors = {
    new: 'bg-blue-100 text-blue-800 border-blue-200',
    active: 'bg-green-100 text-green-800 border-green-200',
    sold: 'bg-rose-100 text-rose-800 border-rose-200',
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="bg-card rounded-xl shadow-subtle border border-border overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="aspect-[16/9] overflow-hidden relative bg-muted">
        {images && images.length > 0 ? (
          <img
            src={images[0]}
            alt={title}
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
        
        <div className="absolute top-3 left-3">
          <span className={cn(
            "px-2 py-1 rounded-md text-xs font-medium border",
            statusColors[status]
          )}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
        
        {status !== 'sold' && !fbMarketplaceUrl && (
          <button
            onClick={onPublishToFB}
            className="absolute bottom-3 right-3 bg-primary hover:bg-primary/90 text-white text-xs font-medium px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors"
          >
            <Facebook className="w-3.5 h-3.5" />
            Publish
          </button>
        )}
        
        {fbMarketplaceUrl && (
          <a
            href={fbMarketplaceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 right-3 bg-primary/90 hover:bg-primary text-white text-xs font-medium px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors"
          >
            <Facebook className="w-3.5 h-3.5" />
            View on Facebook
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-base mb-1 line-clamp-1">{title}</h3>
        
        <div className="flex items-center gap-1 mb-3">
          <Tag className="w-4 h-4 text-primary" />
          <span className="text-lg font-semibold">${price.toLocaleString()}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-sm">{year} {make}</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-sm">{mileage.toLocaleString()} miles</span>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground pt-3 border-t border-border">
          Scraped on {new Date(dateScraped).toLocaleDateString()}
        </div>
      </div>
    </motion.div>
  );
}
