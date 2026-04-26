const express = require('express');
const router = express.Router();
const {
  addMarketPrice, getMarketPrices, comparePrices,
  getFilters, getDistricts, getMandis, updateMarketPrice,
} = require('../controllers/marketController');

router.post('/add', addMarketPrice);
router.get('/prices', getMarketPrices);
router.get('/compare', comparePrices);
router.get('/filters', getFilters);
router.get('/districts', getDistricts);
router.get('/mandis', getMandis);
router.put('/:id', updateMarketPrice);

module.exports = router;
