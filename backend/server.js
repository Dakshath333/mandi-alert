const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/farmers', require('./routes/farmerRoutes'));
app.use('/api/market', require('./routes/marketRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

// Auto-seed rich AG-Market style data on fresh DB
const autoSeed = async () => {
  const MarketPrice = require('./models/MarketPrice');
  const count = await MarketPrice.countDocuments();
  if (count > 0) return;

  const today = new Date();
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const twoDaysAgo = new Date(today); twoDaysAgo.setDate(today.getDate() - 2);

  const entries = [
    // Karnataka - Bangalore
    { state:'Karnataka', district:'Bangalore', mandi:'Bangalore APMC', crop:'Tomato', variety:'Hybrid', arrivals:450, minPrice:2400, maxPrice:3800, modalPrice:3200, date:today },
    { state:'Karnataka', district:'Bangalore', mandi:'Bangalore APMC', crop:'Onion', variety:'Local', arrivals:280, minPrice:1600, maxPrice:2400, modalPrice:2100, date:today },
    { state:'Karnataka', district:'Bangalore', mandi:'Bangalore APMC', crop:'Potato', variety:'Jyoti', arrivals:190, minPrice:1400, maxPrice:1900, modalPrice:1750, date:today },
    { state:'Karnataka', district:'Bangalore', mandi:'Bangalore APMC', crop:'Brinjal', variety:'Local', arrivals:120, minPrice:800, maxPrice:1400, modalPrice:1100, date:today },
    { state:'Karnataka', district:'Bangalore', mandi:'Bangalore APMC', crop:'Cabbage', variety:'Local', arrivals:95, minPrice:600, maxPrice:1000, modalPrice:800, date:today },
    // Karnataka - Mysore
    { state:'Karnataka', district:'Mysore', mandi:'Mysore APMC', crop:'Tomato', variety:'Hybrid', arrivals:310, minPrice:2200, maxPrice:3400, modalPrice:2800, date:today },
    { state:'Karnataka', district:'Mysore', mandi:'Mysore APMC', crop:'Onion', variety:'Local', arrivals:175, minPrice:1500, maxPrice:2000, modalPrice:1800, date:today },
    { state:'Karnataka', district:'Mysore', mandi:'Mysore APMC', crop:'Ragi', variety:'Local', arrivals:420, minPrice:3100, maxPrice:3500, modalPrice:3300, date:today },
    { state:'Karnataka', district:'Mysore', mandi:'Mysore APMC', crop:'Rice', variety:'Sona Masuri', arrivals:560, minPrice:3400, maxPrice:4000, modalPrice:3650, date:today },
    { state:'Karnataka', district:'Mysore', mandi:'Mysore APMC', crop:'Maize', variety:'Hybrid', arrivals:390, minPrice:1800, maxPrice:2300, modalPrice:2100, date:today },
    // Karnataka - Hubli
    { state:'Karnataka', district:'Dharwad', mandi:'Hubli APMC', crop:'Tomato', variety:'Local', arrivals:220, minPrice:2100, maxPrice:3100, modalPrice:2600, date:today },
    { state:'Karnataka', district:'Dharwad', mandi:'Hubli APMC', crop:'Onion', variety:'Local', arrivals:340, minPrice:1400, maxPrice:1900, modalPrice:1750, date:today },
    { state:'Karnataka', district:'Dharwad', mandi:'Hubli APMC', crop:'Wheat', variety:'Lokwan', arrivals:280, minPrice:2100, maxPrice:2500, modalPrice:2280, date:today },
    { state:'Karnataka', district:'Dharwad', mandi:'Hubli APMC', crop:'Groundnut', variety:'TMV-2', arrivals:160, minPrice:4800, maxPrice:5600, modalPrice:5200, date:today },
    // Karnataka - Shivamogga
    { state:'Karnataka', district:'Shivamogga', mandi:'Shivamogga APMC', crop:'Rice', variety:'IR-64', arrivals:620, minPrice:3200, maxPrice:3900, modalPrice:3800, date:today },
    { state:'Karnataka', district:'Shivamogga', mandi:'Shivamogga APMC', crop:'Maize', variety:'Hybrid', arrivals:480, minPrice:1900, maxPrice:2400, modalPrice:2200, date:today },
    { state:'Karnataka', district:'Shivamogga', mandi:'Shivamogga APMC', crop:'Arecanut', variety:'Local', arrivals:85, minPrice:38000, maxPrice:45000, modalPrice:42000, date:today },
    // Karnataka - Mandya
    { state:'Karnataka', district:'Mandya', mandi:'Mandya APMC', crop:'Sugarcane', variety:'CO-86032', arrivals:1200, minPrice:3200, maxPrice:3800, modalPrice:3500, date:today },
    { state:'Karnataka', district:'Mandya', mandi:'Mandya APMC', crop:'Rice', variety:'Sona Masuri', arrivals:430, minPrice:3300, maxPrice:3900, modalPrice:3600, date:today },
    // Karnataka - Hassan
    { state:'Karnataka', district:'Hassan', mandi:'Hassan APMC', crop:'Potato', variety:'Kufri Jyoti', arrivals:275, minPrice:1300, maxPrice:1700, modalPrice:1500, date:today },
    { state:'Karnataka', district:'Hassan', mandi:'Hassan APMC', crop:'Tomato', variety:'Hybrid', arrivals:180, minPrice:2600, maxPrice:3600, modalPrice:2950, date:today },
    { state:'Karnataka', district:'Hassan', mandi:'Hassan APMC', crop:'Coffee', variety:'Arabica', arrivals:45, minPrice:18000, maxPrice:22000, modalPrice:20000, date:today },
    // Karnataka - Chitradurga
    { state:'Karnataka', district:'Chitradurga', mandi:'Chitradurga APMC', crop:'Groundnut', variety:'TMV-2', arrivals:290, minPrice:5000, maxPrice:5800, modalPrice:5400, date:today },
    { state:'Karnataka', district:'Chitradurga', mandi:'Chitradurga APMC', crop:'Sunflower', variety:'Local', arrivals:140, minPrice:5200, maxPrice:6000, modalPrice:5600, date:today },
    // Karnataka - Tumkur
    { state:'Karnataka', district:'Tumkur', mandi:'Tumkur APMC', crop:'Ragi', variety:'GPU-28', arrivals:510, minPrice:3200, maxPrice:3700, modalPrice:3450, date:today },
    { state:'Karnataka', district:'Tumkur', mandi:'Tumkur APMC', crop:'Groundnut', variety:'Local', arrivals:200, minPrice:4700, maxPrice:5400, modalPrice:5100, date:today },
    { state:'Karnataka', district:'Tumkur', mandi:'Tumkur APMC', crop:'Coconut', variety:'Tall', arrivals:3500, minPrice:1800, maxPrice:2400, modalPrice:2100, date:today },
    // Karnataka - Bellary
    { state:'Karnataka', district:'Bellary', mandi:'Bellary APMC', crop:'Cotton', variety:'MCU-5', arrivals:180, minPrice:6200, maxPrice:7000, modalPrice:6600, date:today },
    { state:'Karnataka', district:'Bellary', mandi:'Bellary APMC', crop:'Maize', variety:'Hybrid', arrivals:420, minPrice:1850, maxPrice:2200, modalPrice:2050, date:today },
    // Karnataka - Davangere
    { state:'Karnataka', district:'Davangere', mandi:'Davangere APMC', crop:'Onion', variety:'Local', arrivals:260, minPrice:1700, maxPrice:2200, modalPrice:1950, date:today },
    { state:'Karnataka', district:'Davangere', mandi:'Davangere APMC', crop:'Maize', variety:'Hybrid', arrivals:380, minPrice:1900, maxPrice:2300, modalPrice:2130, date:today },
    // Maharashtra
    { state:'Maharashtra', district:'Nashik', mandi:'Lasalgaon APMC', crop:'Onion', variety:'Red', arrivals:1850, minPrice:1200, maxPrice:2200, modalPrice:1900, date:today },
    { state:'Maharashtra', district:'Nashik', mandi:'Pimpalgaon APMC', crop:'Onion', variety:'Red', arrivals:920, minPrice:1300, maxPrice:2100, modalPrice:1800, date:today },
    { state:'Maharashtra', district:'Pune', mandi:'Pune APMC', crop:'Tomato', variety:'Hybrid', arrivals:680, minPrice:2000, maxPrice:3500, modalPrice:2800, date:today },
    { state:'Maharashtra', district:'Pune', mandi:'Pune APMC', crop:'Potato', variety:'Jyoti', arrivals:340, minPrice:1200, maxPrice:1700, modalPrice:1500, date:today },
    { state:'Maharashtra', district:'Kolhapur', mandi:'Kolhapur APMC', crop:'Sugarcane', variety:'CO-265', arrivals:2200, minPrice:2800, maxPrice:3400, modalPrice:3100, date:today },
    // Andhra Pradesh
    { state:'Andhra Pradesh', district:'Kurnool', mandi:'Kurnool APMC', crop:'Onion', variety:'Local', arrivals:540, minPrice:1500, maxPrice:2300, modalPrice:2000, date:today },
    { state:'Andhra Pradesh', district:'Guntur', mandi:'Guntur APMC', crop:'Chilli', variety:'Teja', arrivals:320, minPrice:8000, maxPrice:12000, modalPrice:10500, date:today },
    { state:'Andhra Pradesh', district:'Guntur', mandi:'Guntur APMC', crop:'Cotton', variety:'BT', arrivals:210, minPrice:6000, maxPrice:7200, modalPrice:6800, date:today },
    { state:'Andhra Pradesh', district:'West Godavari', mandi:'Eluru APMC', crop:'Rice', variety:'BPT-5204', arrivals:780, minPrice:3600, maxPrice:4200, modalPrice:3900, date:today },
    // Tamil Nadu
    { state:'Tamil Nadu', district:'Dindigul', mandi:'Oddanchatram APMC', crop:'Tomato', variety:'PKM', arrivals:920, minPrice:1800, maxPrice:3200, modalPrice:2500, date:today },
    { state:'Tamil Nadu', district:'Coimbatore', mandi:'Coimbatore APMC', crop:'Banana', variety:'Poovan', arrivals:650, minPrice:1400, maxPrice:2200, modalPrice:1800, date:today },
    { state:'Tamil Nadu', district:'Salem', mandi:'Salem APMC', crop:'Mango', variety:'Alphonso', arrivals:280, minPrice:3500, maxPrice:6000, modalPrice:4800, date:today },
    // Yesterday's data for trend
    { state:'Karnataka', district:'Bangalore', mandi:'Bangalore APMC', crop:'Tomato', variety:'Hybrid', arrivals:420, minPrice:2200, maxPrice:3500, modalPrice:2900, date:yesterday },
    { state:'Karnataka', district:'Mysore', mandi:'Mysore APMC', crop:'Tomato', variety:'Hybrid', arrivals:290, minPrice:2000, maxPrice:3200, modalPrice:2600, date:yesterday },
    { state:'Karnataka', district:'Bangalore', mandi:'Bangalore APMC', crop:'Onion', variety:'Local', arrivals:260, minPrice:1500, maxPrice:2200, modalPrice:1950, date:yesterday },
    // Two days ago
    { state:'Karnataka', district:'Bangalore', mandi:'Bangalore APMC', crop:'Tomato', variety:'Hybrid', arrivals:380, minPrice:2000, maxPrice:3200, modalPrice:2700, date:twoDaysAgo },
    { state:'Karnataka', district:'Mysore', mandi:'Mysore APMC', crop:'Tomato', variety:'Hybrid', arrivals:260, minPrice:1900, maxPrice:3000, modalPrice:2400, date:twoDaysAgo },
  ];

  await MarketPrice.insertMany(entries);
  console.log(`🌱 Auto-seeded ${entries.length} AG-Market style price entries`);
};

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mandi-alert')
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    await autoSeed();
    require('./services/cronService').startPriceAlertCron();
  })
  .catch(err => console.error('❌ MongoDB error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
