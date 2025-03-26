
# Auto Scraper & Marketplace Publisher - Backend API

This is the backend API service for the Auto Scraper & Marketplace Publisher application.

## Setup

1. Clone the repository
2. Install dependencies:
```
cd backend
npm install
```
3. Create a `.env` file based on `.env.example`:
```
cp .env.example .env
```
4. Fill in the required environment variables in the `.env` file
5. Start the server:
```
npm run dev
```

## Environment Variables

- `PORT`: Port for the server to listen on (default: 5000)
- `SESSION_SECRET`: Secret for Express session
- `FACEBOOK_APP_ID`: Facebook App ID from Facebook Developer Portal
- `FACEBOOK_APP_SECRET`: Facebook App Secret
- `FACEBOOK_REDIRECT_URI`: Redirect URI for Facebook OAuth
- `GOOGLE_CLIENT_ID`: Google Client ID from Google Cloud Console
- `GOOGLE_CLIENT_SECRET`: Google Client Secret
- `GOOGLE_REDIRECT_URI`: Redirect URI for Google OAuth

## API Endpoints

### Web Scraping
- `POST /api/scrape`: Scrape a dealership website for vehicle listings

### Google Sheets
- `POST /api/sheets/sync`: Sync vehicle listings with Google Sheets

### Facebook Marketplace
- `POST /api/facebook/publish`: Publish a vehicle listing to Facebook Marketplace

### OAuth Authentication
- `GET /api/auth/facebook/init`: Initiate Facebook OAuth flow
- `GET /api/auth/facebook/callback`: Facebook OAuth callback
- `GET /api/auth/facebook/status`: Check Facebook authentication status
- `POST /api/auth/facebook/disconnect`: Disconnect Facebook account

- `GET /api/auth/google/init`: Initiate Google OAuth flow
- `GET /api/auth/google/callback`: Google OAuth callback
- `GET /api/auth/google/status`: Check Google authentication status
- `POST /api/auth/google/disconnect`: Disconnect Google account

## Implementation Notes

- This backend uses Puppeteer and Cheerio for web scraping
- Authentication is managed via Express sessions
- In a production environment, consider using a database for storing listings and session data
- For full Facebook Marketplace integration, you'll need to apply for Commerce API access through Facebook
