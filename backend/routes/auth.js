
const express = require('express');
const router = express.Router();
const { 
  initiateFacebookAuth, 
  facebookCallback, 
  getFacebookAuthStatus, 
  disconnectFacebook 
} = require('../controllers/facebookAuthController');

const { 
  initiateGoogleAuth, 
  googleCallback, 
  getGoogleAuthStatus, 
  disconnectGoogle 
} = require('../controllers/googleAuthController');

// Facebook auth routes
router.get('/facebook/init', initiateFacebookAuth);
router.get('/facebook/callback', facebookCallback);
router.get('/facebook/status', getFacebookAuthStatus);
router.post('/facebook/disconnect', disconnectFacebook);

// Google auth routes
router.get('/google/init', initiateGoogleAuth);
router.get('/google/callback', googleCallback);
router.get('/google/status', getGoogleAuthStatus);
router.post('/google/disconnect', disconnectGoogle);

module.exports = router;
