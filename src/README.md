
# Auto Scraper & Marketplace Publisher

This application allows you to scrape vehicle listings from dealership websites and automatically publish them to Facebook Marketplace and Google Sheets.

## Setup Backend API

The frontend is now configured to work with a real backend API that handles:

1. Web scraping of dealership websites
2. Google Sheets API integration
3. Facebook Marketplace API integration
4. OAuth authentication flows

### API Configuration

You need to set up a backend service that implements the following endpoints:

- `/api/scrape` - POST endpoint for scraping dealership websites
- `/api/sheets/sync` - POST endpoint for syncing with Google Sheets
- `/api/facebook/publish` - POST endpoint for publishing to Facebook Marketplace
- `/api/auth/facebook/init` - GET endpoint to initiate Facebook OAuth
- `/api/auth/facebook/status` - GET endpoint to check Facebook auth status
- `/api/auth/facebook/disconnect` - POST endpoint to disconnect Facebook
- `/api/auth/google/init` - GET endpoint to initiate Google OAuth
- `/api/auth/google/status` - GET endpoint to check Google auth status
- `/api/auth/google/disconnect` - POST endpoint to disconnect Google

### Environment Variables

Set the following environment variable to point to your backend API:

```
VITE_API_BASE_URL=https://your-backend-api.com
```

If not set, the app will default to `/api` which assumes the API is hosted on the same domain.

## API Implementation Notes

For the backend implementation, you'll need:

1. **Web Scraper**: Use libraries like Puppeteer, Cheerio, or a dedicated scraping service
2. **Google OAuth**: Set up OAuth 2.0 credentials in the Google Cloud Console
3. **Google Sheets API**: Enable the Google Sheets API in your Google Cloud project
4. **Facebook OAuth**: Register a Facebook App in the Facebook Developer Portal
5. **Facebook Marketplace API**: Request access to the Marketplace API

## Technology Stack

- Frontend: React, Typescript, Tailwind CSS
- UI Components: Shadcn/UI
- State Management: React Query
- Animation: Framer Motion

## Important Considerations

- Store API keys and secrets securely on the backend
- Implement proper rate limiting for scraping
- Handle OAuth token refresh
- Follow Facebook's policies for Marketplace listings
