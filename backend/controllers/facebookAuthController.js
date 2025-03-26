
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// Store auth states temporarily
const authStates = {};

// Initialize Facebook OAuth flow
exports.initFacebookAuth = (req, res) => {
  try {
    // Generate a state parameter to protect against CSRF
    const state = uuidv4();
    
    // Store state in our temporary storage
    authStates[state] = {
      createdAt: Date.now()
    };
    
    // Define required permissions
    const scopes = 'pages_manage_posts,pages_show_list,pages_read_engagement,catalog_management';
    
    // Generate authentication URL
    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(process.env.FACEBOOK_REDIRECT_URI)}&state=${state}&scope=${scopes}`;
    
    // Return authentication URL to client
    res.json({ authUrl });
  } catch (error) {
    console.error('Facebook Auth Init Error:', error);
    res.status(500).json({ error: 'Failed to initialize Facebook authentication' });
  }
};

// Handle Facebook OAuth callback
exports.facebookCallback = async (req, res) => {
  const { code, state } = req.query;
  
  try {
    // Validate state parameter to prevent CSRF attacks
    if (!authStates[state]) {
      return res.status(403).send('Invalid or expired state parameter');
    }
    
    // Clean up the state
    delete authStates[state];
    
    // Exchange authorization code for access token
    const tokenResponse = await axios.get(`https://graph.facebook.com/v18.0/oauth/access_token`, {
      params: {
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
        code
      }
    });
    
    const { access_token } = tokenResponse.data;
    
    // Get Facebook Page access token
    const pagesResponse = await axios.get(`https://graph.facebook.com/v18.0/me/accounts`, {
      params: { access_token }
    });
    
    // Store the first page's info (in a real app, you might want to let the user choose)
    const page = pagesResponse.data.data[0];
    
    // Store tokens and page info in session
    req.session.facebookAuth = {
      userAccessToken: access_token,
      pageId: page.id,
      pageName: page.name,
      pageAccessToken: page.access_token
    };
    
    // Close the popup
    res.send('<script>window.close();</script>');
  } catch (error) {
    console.error('Facebook Auth Callback Error:', error);
    res.status(500).send('Authentication failed. Please try again.');
  }
};

// Check Facebook auth status
exports.facebookStatus = (req, res) => {
  try {
    // Check if auth exists in session
    const facebookAuth = req.session.facebookAuth;
    
    if (!facebookAuth) {
      return res.json({ isConnected: false });
    }
    
    // Return Facebook connection info
    res.json({
      isConnected: true,
      pageId: facebookAuth.pageId,
      pageName: facebookAuth.pageName
    });
  } catch (error) {
    console.error('Facebook Status Error:', error);
    res.status(500).json({ isConnected: false, error: 'Failed to check Facebook authentication status' });
  }
};

// Disconnect Facebook
exports.disconnectFacebook = (req, res) => {
  try {
    // Remove Facebook auth from session
    delete req.session.facebookAuth;
    
    res.json({ success: true });
  } catch (error) {
    console.error('Facebook Disconnect Error:', error);
    res.status(500).json({ success: false, error: 'Failed to disconnect from Facebook' });
  }
};
