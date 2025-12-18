require('dotenv').config(); // 1. Load variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 2. Connect to Database using environment variable
// We remove the hardcoded string and the deprecated options (no longer needed in Mongoose 6+)
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
.then(() => console.log("✅ Govi Isuru Database Connected (Cloud via ENV)"))
.catch(err => {
    console.error("❌ DB Connection Error. Check if your IP is whitelisted in Atlas!");
    console.error(err.message);
});

// 3. Define the Schema
const ListingSchema = new mongoose.Schema({
    farmerName: { type: String, required: true },
    cropType: { type: String, required: true },
    quantity: String,
    price: String,
    location: String,
    phone: String,
    date: { type: Date, default: Date.now }
});

const Listing = mongoose.model('Listing', ListingSchema);

// 4. API Routes
// GET: Fetch all items (latest first)
app.get('/api/listings', async (req, res) => {
    try {
        const items = await Listing.find().sort({ date: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch listings" });
    }
});

// POST: Add new item
app.post('/api/listings', async (req, res) => {
    try {
        const newItem = new Listing(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(400).json({ error: "Validation failed. Check your data." });
    }
});

// New route for Price Trends
app.get('/api/price-trends', (req, res) => {
    // In a real production app, this would fetch from the Department of Agriculture website
    // For the hackathon, we provide a dynamic JSON response
    const trends = [
        { month: 'Jan', Rice: 210, Chili: 850, Tea: 1100 },
        { month: 'Feb', Rice: 225, Chili: 920, Tea: 1150 },
        { month: 'Mar', Rice: 240, Chili: 780, Tea: 1050 },
        { month: 'Apr', Rice: 215, Chili: 810, Tea: 1200 },
        { month: 'May', Rice: 230, Chili: 890, Tea: 1250 },
        { month: 'Jun', Rice: 255, Chili: 950, Tea: 1300 },
    ];
    res.json(trends);
});

app.get('/api/market-prices', (req, res) => {
    // Simulated real-time data from different Sri Lankan Economic Centers
    const marketData = [
        { district: 'Dambulla', Rice: 220, Chili: 800, Carrot: 450 },
        { district: 'Thambutthegama', Rice: 215, Chili: 780, Carrot: 420 },
        { district: 'Keppetipola', Rice: 230, Chili: 850, Carrot: 380 },
        { district: 'Colombo (Manning)', Rice: 250, Chili: 950, Carrot: 550 },
        { district: 'Kandy', Rice: 245, Chili: 920, Carrot: 520 },
    ];
    res.json(marketData);
});


app.post('/api/register', async (req, res) => {
  try {
    const { username, password, district, dsDivision, gnDivision } = req.body;

    // 1. Check if user exists
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ msg: "User already exists" });

    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create User
    user = new User({
      username,
      password: hashedPassword,
      district,
      dsDivision,
      gnDivision
    });

    await user.save();

    // 4. Return Token (Login the user immediately)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'govi_secret', { expiresIn: '1h' });
    res.json({ token, user: { username, district, dsDivision, gnDivision } });

  } catch (err) {
    res.status(500).send("Server Error");
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Find user
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: "User does not exist" });

    // 2. Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // 3. Return Token
    const token = jwt.sign({ id: user._id }, 'govi_secret', { expiresIn: '24h' });
    res.json({ 
      token, 
      user: { 
        username: user.username, 
        district: user.district, 
        dsDivision: user.dsDivision, 
        gnDivision: user.gnDivision 
      } 
    });

  } catch (err) {
    res.status(500).send("Server Error");
  }
});
// 5. Start Server using dynamic port for deployment
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Market Server running on Port ${PORT}`));