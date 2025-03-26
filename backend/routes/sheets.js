
const express = require('express');
const router = express.Router();
const { syncWithGoogleSheets } = require('../controllers/sheetsController');

router.post('/sync', syncWithGoogleSheets);

module.exports = router;
