const express = require('express');
const router = express.Router();
const { getStats, seedSampleData } = require('../controllers/adminController');

router.get('/stats', getStats);
router.post('/seed', seedSampleData);

module.exports = router;
