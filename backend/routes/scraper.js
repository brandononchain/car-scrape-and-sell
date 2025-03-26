
const express = require('express');
const router = express.Router();
const { scrapeWebsite } = require('../controllers/scraperController');

router.post('/', scrapeWebsite);

module.exports = router;
