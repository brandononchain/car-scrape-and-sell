
const { google } = require('googleapis');
const { v4: uuidv4 } = require('uuid');

// Configure OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Store auth states temporarily
const authStates = {};

// Initialize Google OAuth flow
exports.initGoogleAuth = (req, res) => {
  try {
    // Generate a state parameter to protect against CSRF
    const state = uuidv4();
    
    // Store state in our temporary storage
    authStates[state] = {
      createdAt: Date.now()
    };
    
    // Define scopes required for Google Sheets
    const scopes = [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive.file'
    ];
    
    // Generate authentication URL
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: state,
      prompt: 'consent' // Always prompt for consent to ensure we get a refresh token
    });
    
    // Return authentication URL to client
    res.json({ authUrl });
  } catch (error) {
    console.error('Google Auth Init Error:', error);
    res.status(500).json({ error: 'Failed to initialize Google authentication' });
  }
};

// Handle Google OAuth callback
exports.googleCallback = async (req, res) => {
  const { code, state } = req.query;
  
  try {
    // Validate state parameter to prevent CSRF attacks
    if (!authStates[state]) {
      return res.status(403).send('Invalid or expired state parameter');
    }
    
    // Clean up the state
    delete authStates[state];
    
    // Exchange authorization code for access token
    const { tokens } = await oauth2Client.getToken(code);
    
    // Store tokens in session
    req.session.googleTokens = tokens;
    
    // Close the popup or redirect to the application
    res.send('<script>window.close();</script>');
  } catch (error) {
    console.error('Google Auth Callback Error:', error);
    res.status(500).send('Authentication failed. Please try again.');
  }
};

// Check Google auth status
exports.googleStatus = (req, res) => {
  try {
    // Check if tokens exist and are valid
    const tokens = req.session.googleTokens;
    
    if (!tokens) {
      return res.status(401).json({ isConnected: false });
    }
    
    // Check if access token is expired
    const expiryDate = tokens.expiry_date || 0;
    const isTokenExpired = expiryDate <= Date.now();
    
    if (isTokenExpired && !tokens.refresh_token) {
      // No refresh token, need to re-authenticate
      return res.status(401).json({ isConnected: false });
    }
    
    // Valid token or can refresh
    res.json({ isConnected: true });
  } catch (error) {
    console.error('Google Status Error:', error);
    res.status(500).json({ isConnected: false, error: 'Failed to check Google authentication status' });
  }
};

// Disconnect Google
exports.disconnectGoogle = (req, res) => {
  try {
    // Remove tokens from session
    delete req.session.googleTokens;
    
    res.json({ success: true });
  } catch (error) {
    console.error('Google Disconnect Error:', error);
    res.status(500).json({ success: false, error: 'Failed to disconnect from Google' });
  }
};
