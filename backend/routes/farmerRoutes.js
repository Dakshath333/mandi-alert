const express = require('express');
const router = express.Router();
const {
  registerFarmer,
  getFarmers,
  getFarmerById,
  updateFarmer,
} = require('../controllers/farmerController');

router.post('/register', registerFarmer);
router.get('/', getFarmers);
router.get('/:id', getFarmerById);
router.put('/:id', updateFarmer);

module.exports = router;
