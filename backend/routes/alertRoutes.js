const express = require('express');
const router = express.Router();
const { getAlerts, getFarmerAlerts, triggerAlerts } = require('../controllers/alertController');

router.get('/', getAlerts);
router.get('/farmer/:farmerId', getFarmerAlerts);
router.post('/trigger', triggerAlerts);

module.exports = router;
