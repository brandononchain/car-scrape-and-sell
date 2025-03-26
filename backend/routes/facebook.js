
const express = require('express');
const router = express.Router();
const { publishToFacebook } = require('../controllers/facebookController');

router.post('/publish', publishToFacebook);

module.exports = router;
