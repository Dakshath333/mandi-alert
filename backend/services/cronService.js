const cron = require('node-cron');
const Farmer = require('../models/Farmer');
const MarketPrice = require('../models/MarketPrice');
const Alert = require('../models/Alert');
const { sendSMS } = require('./smsService');

/**
 * Core logic: find best mandi price for each farmer's crop
 * and send SMS alert if a good opportunity exists
 */
const checkAndSendPriceAlerts = async () => {
  console.log('⏰ [CRON] Running price alert check...');

  try {
    const farmers = await Farmer.find();

    for (const farmer of farmers) {
      // Get all latest prices for this farmer's crop
      const prices = await MarketPrice.aggregate([
        { $match: { crop: new RegExp(farmer.crop, 'i') } },
        { $sort: { date: -1 } },
        {
          $group: {
            _id: '$mandi',
            mandi: { $first: '$mandi' },
            location: { $first: '$location' },
            price: { $first: '$price' },
            crop: { $first: '$crop' },
          },
        },
        { $sort: { price: -1 } },
      ]);

      if (prices.length < 2) continue; // Need at least 2 mandis to compare

      const best = prices[0];
      const localMandi = prices.find(p =>
        p.location.toLowerCase() === farmer.location.toLowerCase()
      );

      // Only alert if best mandi is significantly better than local (>5% difference)
      if (localMandi && best.mandi !== localMandi.mandi) {
        const priceDiff = best.price - localMandi.price;
        const diffPercent = (priceDiff / localMandi.price) * 100;

        if (diffPercent > 5) {
          // Check if we already sent this alert in last 24 hours
          const recentAlert = await Alert.findOne({
            farmerId: farmer._id,
            crop: best.crop,
            mandi: best.mandi,
            sentAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
          });

          if (!recentAlert) {
            const message = `🌾 Mandi Alert! Best price for ${best.crop} is ₹${best.price}/quintal at ${best.mandi} Mandi. That's ₹${priceDiff} more than local rates. Sell there for higher profit!`;

            const smsResult = await sendSMS(farmer.phone, message);

            // Save alert record
            await Alert.create({
              farmerId: farmer._id,
              message,
              crop: best.crop,
              mandi: best.mandi,
              price: best.price,
              status: smsResult.success ? 'sent' : 'simulated',
            });

            console.log(`📩 Alert sent to farmer: ${farmer.name} for ${best.crop}`);
          }
        }
      }
    }

    console.log('✅ [CRON] Price alert check completed');
  } catch (error) {
    console.error('❌ [CRON] Error during price alert check:', error.message);
  }
};

/**
 * Start the scheduled cron jobs
 */
const startPriceAlertCron = () => {
  // Run every 6 hours: 0 */6 * * *
  cron.schedule('0 */6 * * *', checkAndSendPriceAlerts);
  console.log('⏰ Price alert cron job started (every 6 hours)');
};

module.exports = { startPriceAlertCron, checkAndSendPriceAlerts };
