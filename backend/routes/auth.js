
const express = require('express');
const router = express.Router();
const { initGoogleAuth, googleCallback, googleStatus, disconnectGoogle } = require('../controllers/googleAuthController');
const { initFacebookAuth, facebookCallback, facebookStatus, disconnectFacebook } = require('../controllers/facebookAuthController');

// Google OAuth routes
router.get('/google/init', initGoogleAuth);
router.get('/google/callback', googleCallback);
router.get('/google/status', googleStatus);
router.post('/google/disconnect', disconnectGoogle);

// Facebook OAuth routes
router.get('/facebook/init', initFacebookAuth);
router.get('/facebook/callback', facebookCallback);
router.get('/facebook/status', facebookStatus);
router.post('/facebook/disconnect', disconnectFacebook);

module.exports = router;
