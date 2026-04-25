const express = require('express');
const router = express.Router();
const { registerFarmer, loginFarmer, getFarmers, getFarmerById, updateFarmer } = require('../controllers/farmerController');

router.post('/register', registerFarmer);
router.post('/login', loginFarmer);
router.get('/', getFarmers);
router.get('/:id', getFarmerById);
router.put('/:id', updateFarmer);

module.exports = router;
