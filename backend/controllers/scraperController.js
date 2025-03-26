const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const { v4: uuidv4 } = require('uuid');

// In-memory storage for scraped listings (in production, use a database)
const scrapedListings = [];

exports.scrapeWebsite = async (req, res) => {
  const config = req.body;
  
  // Validate request
  if (!config.dealershipUrl) {
    return res.status(400).json({ error: 'Dealership URL is required' });
  }
  
  try {
    console.log(`Starting scrape for: ${config.dealershipUrl}`);
    
    // Launch browser
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    // Create a new page
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1280, height: 800 });
    
    // Navigate to the dealership URL
    await page.goto(config.dealershipUrl, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });
    
    // Get the page content
    const content = await page.content();
    
    // Load content into cheerio
    const $ = cheerio.load(content);
    
    // Initialize results
    const result = {
      totalFound: 0,
      new: 0,
      updated: 0,
      sold: 0,
      unchanged: 0,
      timestamp: new Date().toISOString()
    };
    
    // Example scraping logic (customize based on the specific website structure)
    const carElements = $('.vehicle-card, .inventory-listing, .car-listing').slice(0, config.maxListings || 100);
    result.totalFound = carElements.length;
    
    // Array to store scraped listings
    const listings = [];
    
    // Process each car element
    carElements.each((index, element) => {
      // Extract data (adjust selectors based on target website structure)
      const title = $(element).find('.vehicle-title, .listing-title, h2').first().text().trim();
      const priceText = $(element).find('.price, .vehicle-price').first().text().trim();
      const price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;
      
      // Extract year, make, model from title
      const titleParts = title.split(' ');
      const year = parseInt(titleParts[0]) || new Date().getFullYear();
      const make = titleParts[1] || '';
      const model = titleParts.slice(2).join(' ') || '';
      
      // Get mileage
      const mileageText = $(element).find('.mileage, .vehicle-mileage, .miles').first().text().trim();
      const mileage = parseInt(mileageText.replace(/[^0-9]/g, '')) || 0;
      
      // Get image URLs
      const images = [];
      if (config.includeImages) {
        $(element).find('img').each((i, img) => {
          const src = $(img).attr('src') || $(img).attr('data-src');
          if (src && !src.includes('placeholder') && !src.includes('logo')) {
            images.push(src);
          }
        });
      }
      
      // Get listing URL
      const relativeUrl = $(element).find('a').attr('href');
      const originalListingUrl = relativeUrl && relativeUrl.startsWith('http') 
        ? relativeUrl 
        : `${new URL(config.dealershipUrl).origin}${relativeUrl}`;
      
      // Create a unique ID for the listing
      const id = uuidv4();
      
      // Create car listing object
      const newListing = {
        id,
        title,
        price,
        year,
        make,
        model,
        trim: '',
        mileage,
        exteriorColor: $(element).find('.exterior-color, .color').first().text().trim() || '',
        interiorColor: $(element).find('.interior-color').first().text().trim() || '',
        fuelType: $(element).find('.fuel-type, .fuel').first().text().trim() || '',
        transmission: $(element).find('.transmission').first().text().trim() || '',
        drivetrain: $(element).find('.drivetrain, .drive-type').first().text().trim() || '',
        engineSize: $(element).find('.engine, .engine-size').first().text().trim() || '',
        description: $(element).find('.description, .vehicle-description').first().text().trim() || '',
        features: [],
        images,
        dealershipUrl: config.dealershipUrl,
        originalListingUrl,
        dateScraped: new Date().toISOString(),
        status: 'new',
        lastUpdated: new Date().toISOString()
      };
      
      // Check if this listing already exists
      const existingListingIndex = scrapedListings.findIndex(
        listing => listing.originalListingUrl === newListing.originalListingUrl
      );
      
      if (existingListingIndex >= 0) {
        // Listing exists, check if it's been updated
        const existingListing = scrapedListings[existingListingIndex];
        
        if (existingListing.price !== newListing.price || existingListing.title !== newListing.title) {
          // Listing has been updated
          newListing.id = existingListing.id; // Keep the same ID
          newListing.status = 'active';
          newListing.dateScraped = existingListing.dateScraped;
          
          // Update in our storage
          scrapedListings[existingListingIndex] = newListing;
          result.updated++;
        } else {
          // Listing is unchanged
          result.unchanged++;
          // Use existing listing
          listings.push(existingListing);
          return; // Skip adding this listing again
        }
      } else {
        // New listing
        result.new++;
        // Add to our storage
        scrapedListings.push(newListing);
      }
      
      // Add to results
      listings.push(newListing);
    });
    
    // Check for sold listings (listings that were previously scraped but not found in this scrape)
    if (scrapedListings.length > 0) {
      const currentUrls = listings.map(listing => listing.originalListingUrl);
      
      scrapedListings.forEach(existingListing => {
        if (!currentUrls.includes(existingListing.originalListingUrl) && existingListing.status !== 'sold') {
          existingListing.status = 'sold';
          existingListing.lastUpdated = new Date().toISOString();
          result.sold++;
        }
      });
    }
    
    // Close browser
    await browser.close();
    
    // Return results
    res.json({
      listings,
      result
    });
  } catch (error) {
    console.error('Scraping Error:', error);
    res.status(500).json({
      error: 'Failed to scrape website',
      message: error.message,
      result: {
        totalFound: 0,
        new: 0,
        updated: 0,
        sold: 0,
        unchanged: 0,
        errors: [error.message],
        timestamp: new Date().toISOString()
      }
    });
  }
};
