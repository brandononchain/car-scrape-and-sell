
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Globe, Clock, RefreshCw, Facebook, Image, ArrowRight } from 'lucide-react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { type ScraperConfig } from '@/types';

// Ensure this schema matches ScraperConfig
const formSchema = z.object({
  dealershipUrl: z.string().url({ message: "Please enter a valid URL" }),
  scheduleFrequency: z.enum(['hourly', 'daily', 'weekly', 'manual']),
  autoPublishToFb: z.boolean(),
  includeImages: z.boolean(),
  maxListings: z.number().min(1).max(1000).optional(),
  sheetsId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ScrapeFormProps {
  onSubmit: (config: ScraperConfig) => void;
  isLoading?: boolean;
}

export function ScrapeForm({ onSubmit, isLoading = false }: ScrapeFormProps) {
  const [expandedOptions, setExpandedOptions] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dealershipUrl: '',
      scheduleFrequency: 'daily',
      autoPublishToFb: true,
      includeImages: true,
      maxListings: 100,
    },
  });

  function handleSubmit(values: FormValues) {
    // Convert the form values to ScraperConfig
    // This ensures all required fields are present
    const config: ScraperConfig = {
      dealershipUrl: values.dealershipUrl,
      scheduleFrequency: values.scheduleFrequency,
      autoPublishToFb: values.autoPublishToFb,
      includeImages: values.includeImages,
      maxListings: values.maxListings,
      sheetsId: values.sheetsId,
    };
    
    onSubmit(config);
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-xl shadow-subtle border border-border p-6"
    >
      <div className="flex flex-col space-y-2 mb-6">
        <h2 className="text-xl font-semibold">Configure Scraper</h2>
        <p className="text-sm text-muted-foreground">Enter the dealership website URL and configure scraping options</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="dealershipUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  Dealership URL
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://example-dealership.com" 
                    {...field}
                    className="bg-muted/50 border-muted focus:border-primary"
                  />
                </FormControl>
                <FormDescription>
                  Enter the homepage or inventory page URL
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="scheduleFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Update Frequency
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-muted/50 border-muted">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="manual">Manual only</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How often to check for updates
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="maxListings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-primary" />
                    Maximum Listings
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      min={1}
                      max={1000}
                      placeholder="100" 
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="bg-muted/50 border-muted focus:border-primary"
                    />
                  </FormControl>
                  <FormDescription>
                    Limit the number of listings to scrape
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <motion.div
            initial={false}
            animate={{ height: expandedOptions ? 'auto' : 0, opacity: expandedOptions ? 1 : 0 }}
            className={`overflow-hidden ${!expandedOptions ? 'pointer-events-none' : ''}`}
          >
            <div className="grid md:grid-cols-2 gap-6 pt-2">
              <FormField
                control={form.control}
                name="autoPublishToFb"
                render={({ field }) => (
                  <FormItem className="flex flex-col p-4 rounded-lg border border-border bg-background">
                    <div className="space-y-1.5 mb-2">
                      <FormLabel className="text-base font-medium flex items-center gap-2">
                        <Facebook className="w-4 h-4 text-primary" />
                        Auto-Publish to Facebook
                      </FormLabel>
                      <FormDescription className="text-sm text-muted-foreground">
                        Automatically list new vehicles to Facebook Marketplace
                      </FormDescription>
                    </div>
                    <div className="flex justify-end mt-auto pt-2">
                      <FormControl>
                        <Switch 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="includeImages"
                render={({ field }) => (
                  <FormItem className="flex flex-col p-4 rounded-lg border border-border bg-background">
                    <div className="space-y-1.5 mb-2">
                      <FormLabel className="text-base font-medium flex items-center gap-2">
                        <Image className="w-4 h-4 text-primary" />
                        Include Images
                      </FormLabel>
                      <FormDescription className="text-sm text-muted-foreground">
                        Download and include vehicle images when scraping
                      </FormDescription>
                    </div>
                    <div className="flex justify-end mt-auto pt-2">
                      <FormControl>
                        <Switch 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </motion.div>

          <div className="flex flex-col space-y-4">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              className="self-start text-muted-foreground hover:text-foreground"
              onClick={() => setExpandedOptions(!expandedOptions)}
            >
              {expandedOptions ? 'Hide advanced options' : 'Show advanced options'}
            </Button>
            
            <Button 
              type="submit" 
              className="w-full gap-2 group"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Configuring...
                </>
              ) : (
                <>
                  Start Scraping
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}
