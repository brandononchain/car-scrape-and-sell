
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SortAsc, SortDesc, RefreshCw } from 'lucide-react';
import { type CarListing } from '@/types';
import { CarCard } from './CarCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CarListProps {
  cars: CarListing[];
  isLoading?: boolean;
}

export function CarList({ cars, isLoading = false }: CarListProps) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('dateScraped');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Filter cars based on search and status filter
  const filteredCars = cars.filter(car => {
    const matchesSearch = 
      car.title.toLowerCase().includes(search.toLowerCase()) ||
      car.make.toLowerCase().includes(search.toLowerCase()) ||
      car.model.toLowerCase().includes(search.toLowerCase());
      
    const matchesStatus = filterStatus === 'all' || car.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  // Sort cars based on sortBy and sortOrder
  const sortedCars = [...filteredCars].sort((a, b) => {
    // Handle special case for price (numeric)
    if (sortBy === 'price') {
      return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
    }
    
    // Handle special case for date (convert to timestamp)
    if (sortBy === 'dateScraped') {
      const dateA = new Date(a.dateScraped).getTime();
      const dateB = new Date(b.dateScraped).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    }
    
    // Default case - string comparison
    const valueA = String(a[sortBy as keyof CarListing]).toLowerCase();
    const valueB = String(b[sortBy as keyof CarListing]).toLowerCase();
    
    return sortOrder === 'asc' 
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA);
  });
  
  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-card rounded-xl shadow-subtle border border-border overflow-hidden"
    >
      <div className="p-6 border-b border-border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Car Listings</h2>
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground mr-2">
              {filteredCars.length} vehicles
            </span>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search make, model, or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-muted/50 border-muted focus:border-primary"
            />
          </div>
          
          <div className="flex gap-2">
            <div className="w-40">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-muted/50 border-muted">
                  <div className="flex items-center">
                    <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-40">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-muted/50 border-muted">
                  <div className="flex items-center">
                    {sortOrder === 'asc' ? (
                      <SortAsc className="w-4 h-4 mr-2 text-muted-foreground" />
                    ) : (
                      <SortDesc className="w-4 h-4 mr-2 text-muted-foreground" />
                    )}
                    <SelectValue placeholder="Sort by" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dateScraped">Date Scraped</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                  <SelectItem value="make">Make</SelectItem>
                  <SelectItem value="mileage">Mileage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={toggleSortOrder}
              className="bg-muted/50 border-muted"
            >
              {sortOrder === 'asc' ? (
                <SortAsc className="w-4 h-4" />
              ) : (
                <SortDesc className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <RefreshCw className="w-6 h-6 text-muted-foreground animate-spin" />
            <span className="ml-3 text-muted-foreground">Loading listings...</span>
          </div>
        ) : sortedCars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCars.map((car) => (
              <CarCard 
                key={car.id} 
                car={car} 
                onPublishToFB={() => console.log('Publish to FB:', car.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No vehicles found</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              {search || filterStatus !== 'all'
                ? "Try adjusting your search or filters to see more results."
                : "Get started by configuring the scraper to find vehicle listings."}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
