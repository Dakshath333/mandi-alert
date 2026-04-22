const express = require('express');
const router = express.Router();
const {
  addMarketPrice,
  getMarketPrices,
  comparePrices,
  getAvailableCrops,
  updateMarketPrice,
} = require('../controllers/marketController');

router.post('/add', addMarketPrice);
router.get('/prices', getMarketPrices);
router.get('/compare', comparePrices);
router.get('/crops', getAvailableCrops);
router.put('/:id', updateMarketPrice);

module.exports = router;
