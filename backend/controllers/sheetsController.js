
const { google } = require('googleapis');

exports.syncWithGoogleSheets = async (req, res) => {
  const { sheetId, listings } = req.body;
  
  // Validate request
  if (!sheetId) {
    return res.status(400).json({ success: false, error: 'Google Sheet ID is required' });
  }
  
  if (!listings || !Array.isArray(listings)) {
    return res.status(400).json({ success: false, error: 'Listings must be provided as an array' });
  }
  
  try {
    // Get Google tokens from session
    const tokens = req.session.googleTokens;
    
    if (!tokens) {
      return res.status(401).json({ 
        success: false, 
        error: 'Not authenticated with Google',
        authRequired: true 
      });
    }
    
    // Configure OAuth2 client with tokens
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    
    oauth2Client.setCredentials(tokens);
    
    // Create Google Sheets API client
    const sheets = google.sheets({ version: 'v4', auth: oauth2Client });
    
    // Check if the sheet exists, if not create it
    try {
      await sheets.spreadsheets.get({ spreadsheetId: sheetId });
    } catch (error) {
      if (error.code === 404) {
        return res.status(404).json({ 
          success: false, 
          error: 'Google Sheet not found',
          message: 'The specified Google Sheet could not be found. Please check the Sheet ID.' 
        });
      }
      throw error;
    }
    
    // Format listings for Google Sheets
    const headerRow = [
      'ID', 'Title', 'Price', 'Year', 'Make', 'Model', 'Trim', 'Mileage',
      'Exterior Color', 'Interior Color', 'Fuel Type', 'Transmission',
      'Drivetrain', 'Engine Size', 'Status', 'Date Scraped', 'Last Updated',
      'Original Listing URL', 'Facebook Marketplace ID', 'Facebook Marketplace URL'
    ];
    
    const dataRows = listings.map(listing => [
      listing.id,
      listing.title,
      listing.price,
      listing.year,
      listing.make,
      listing.model,
      listing.trim || '',
      listing.mileage,
      listing.exteriorColor || '',
      listing.interiorColor || '',
      listing.fuelType || '',
      listing.transmission || '',
      listing.drivetrain || '',
      listing.engineSize || '',
      listing.status,
      listing.dateScraped,
      listing.lastUpdated,
      listing.originalListingUrl,
      listing.fbMarketplaceId || '',
      listing.fbMarketplaceUrl || ''
    ]);
    
    // Clear existing content and write new data
    await sheets.spreadsheets.values.clear({
      spreadsheetId: sheetId,
      range: 'A:T', // Clear columns A through T
    });
    
    // Write header and data rows
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: 'A1',
      valueInputOption: 'RAW',
      resource: {
        values: [headerRow, ...dataRows]
      }
    });
    
    // Format header row (make it bold)
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: sheetId,
      resource: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: 0,
                endRowIndex: 1
              },
              cell: {
                userEnteredFormat: {
                  textFormat: {
                    bold: true
                  },
                  backgroundColor: {
                    red: 0.9,
                    green: 0.9,
                    blue: 0.9
                  }
                }
              },
              fields: 'userEnteredFormat(textFormat,backgroundColor)'
            }
          },
          {
            updateSheetProperties: {
              properties: {
                sheetId: 0,
                gridProperties: {
                  frozenRowCount: 1
                }
              },
              fields: 'gridProperties.frozenRowCount'
            }
          }
        ]
      }
    });
    
    // Return success
    res.json({ success: true });
  } catch (error) {
    console.error('Google Sheets Sync Error:', error);
    
    if (error.code === 401) {
      // Token expired, need to re-authenticate
      delete req.session.googleTokens;
      
      return res.status(401).json({
        success: false,
        error: 'Google authentication expired',
        authRequired: true
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to sync with Google Sheets',
      message: error.message
    });
  }
};
