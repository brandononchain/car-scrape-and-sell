
const axios = require('axios');

exports.publishToFacebook = async (req, res) => {
  const { listing } = req.body;
  
  // Validate request
  if (!listing) {
    return res.status(400).json({ 
      success: false, 
      error: 'Listing data is required' 
    });
  }
  
  try {
    // Check if user is authenticated with Facebook
    const facebookAuth = req.session.facebookAuth;
    
    if (!facebookAuth) {
      return res.status(401).json({ 
        success: false, 
        error: 'Not authenticated with Facebook',
        authRequired: true 
      });
    }
    
    // Format description
    let description = `${listing.year} ${listing.make} ${listing.model}`;
    
    if (listing.trim) description += ` ${listing.trim}`;
    description += `\n\nMileage: ${listing.mileage.toLocaleString()} miles`;
    
    if (listing.exteriorColor) description += `\nExterior Color: ${listing.exteriorColor}`;
    if (listing.interiorColor) description += `\nInterior Color: ${listing.interiorColor}`;
    if (listing.transmission) description += `\nTransmission: ${listing.transmission}`;
    if (listing.drivetrain) description += `\nDrivetrain: ${listing.drivetrain}`;
    if (listing.engineSize) description += `\nEngine: ${listing.engineSize}`;
    if (listing.fuelType) description += `\nFuel Type: ${listing.fuelType}`;
    
    if (listing.description) {
      description += `\n\n${listing.description}`;
    }
    
    description += `\n\nView original listing: ${listing.originalListingUrl}`;
    
    // Prepare listing data for Facebook
    const listingData = {
      availability: 'IN_STOCK',
      brand: listing.make,
      category: 'VEHICLES',
      condition: 'USED',
      description,
      image_urls: listing.images,
      name: listing.title,
      price: listing.price,
      currency: 'USD',
      url: listing.originalListingUrl,
      vehicle_year: listing.year,
      vehicle_make: listing.make,
      vehicle_model: listing.model,
      vehicle_trim: listing.trim || undefined,
      vehicle_mileage: { value: listing.mileage, unit: 'MI' }
    };
    
    // Upload listing to Facebook Marketplace
    // Note: In a real implementation, you would need to use Facebook's Commerce API
    // This is a simplified example
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${facebookAuth.pageId}/vehicle_listings`,
      listingData,
      {
        params: { access_token: facebookAuth.pageAccessToken }
      }
    );
    
    // Return success with Facebook listing ID
    res.json({
      success: true,
      fbMarketplaceId: response.data.id,
      fbMarketplaceUrl: `https://www.facebook.com/marketplace/item/${response.data.id}`
    });
  } catch (error) {
    console.error('Facebook Publishing Error:', error.response?.data || error);
    
    if (error.response?.status === 401) {
      // Token expired, need to re-authenticate
      delete req.session.facebookAuth;
      
      return res.status(401).json({
        success: false,
        error: 'Facebook authentication expired',
        authRequired: true
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to publish to Facebook',
      message: error.response?.data?.error?.message || error.message
    });
  }
};
