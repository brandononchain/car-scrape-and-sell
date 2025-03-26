
# Auto Scraper & Marketplace Publisher

This application allows you to scrape vehicle listings from dealership websites and automatically publish them to Facebook Marketplace and Google Sheets.

## Setup Instructions

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
# Copy the example env file and update with your API keys
cp .env.example .env

# Start the backend server
npm run dev
```

### 2. Frontend Setup

```bash
# In the root directory, install frontend dependencies
npm install

# Start the frontend development server
npm run dev
```

### Environment Configuration

#### Backend (.env file)
Required environment variables:
- `PORT`: Port for the server to listen on (default: 5000)
- `SESSION_SECRET`: Secret for Express session
- `FACEBOOK_APP_ID`: Facebook App ID from Facebook Developer Portal
- `FACEBOOK_APP_SECRET`: Facebook App Secret
- `FACEBOOK_REDIRECT_URI`: Redirect URI for Facebook OAuth
- `GOOGLE_CLIENT_ID`: Google Client ID from Google Cloud Console
- `GOOGLE_CLIENT_SECRET`: Google Client Secret
- `GOOGLE_REDIRECT_URI`: Redirect URI for Google OAuth
- `FRONTEND_URL`: Your frontend URL for CORS (default: http://localhost:8080)

#### Frontend (.env file)
- `VITE_API_BASE_URL`: URL of your backend API (default: http://localhost:5000/api)

### API Services

The backend implements services for:
1. Web scraping of dealership sites
2. Google Sheets integration
3. Facebook Marketplace publishing
4. OAuth authentication for both services

### OAuth Setup

#### Facebook Developer Setup
1. Create a Facebook Developer account at https://developers.facebook.com/
2. Create a new App with the "Business" type
3. Add the "Facebook Login" product
4. Configure the OAuth redirect URL to match your FACEBOOK_REDIRECT_URI
5. For full Marketplace access, apply for Commerce API access

#### Google Cloud Setup
1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable the Google Sheets API and Google Drive API
4. Create OAuth 2.0 credentials
5. Configure the redirect URI to match your GOOGLE_REDIRECT_URI
6. Enable scopes for Google Sheets and Drive

### Operating the Application

1. Start both frontend and backend servers
2. Configure scraper settings in the web interface
3. Authenticate with Google to enable sheet sync
4. Authenticate with Facebook to enable Marketplace publishing
5. Start scraping dealership websites
