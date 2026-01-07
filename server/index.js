const dotenv = require('dotenv');
dotenv.config();
// 1. Load variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const User = require('./models/User');
const Listing = require('./models/Listing');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const chatbotRoutes = require('./routes/chatbot');
const alertRoutes = require('./routes/alerts');
const reputationRoutes = require('./routes/reputation');
const newsRoutes = require('./routes/news');
const suitabilityRoutes = require('./routes/suitability');
const officerRoutes = require('./routes/officer');
const analyticsRoutes = require('./routes/analytics');
const officerWorkflowRoutes = require('./routes/officerWorkflow');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Chatbot API Routes
app.use('/api/chatbot', chatbotRoutes);

// Community Disease Alerts API Routes
app.use('/api/alerts', alertRoutes);

// Farmer Reputation API Routes
app.use('/api/reputation', reputationRoutes);

// Agriculture News API Routes
app.use('/api/news', newsRoutes);

// Crop Suitability API Routes
app.use('/api/suitability', suitabilityRoutes);

// Government Officer API Routes
app.use('/api/officer', officerRoutes);

// Analytics API Routes
app.use('/api/analytics', analyticsRoutes);

// Officer Workflow API Routes (Performance, Field Visits, Internal Notes)
app.use('/api/officer-workflow', officerWorkflowRoutes);

// 2. Connect to Database using environment variable
// We remove the hardcoded string and the deprecated options (no longer needed in Mongoose 6+)
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
.then(() => console.log("✅ Govi Isuru Database Connected (Cloud via ENV)"))
.catch(err => {
    console.error("❌ DB Connection Error. Check if your IP is whitelisted in Atlas!");
    console.error(err.message);
});

// 3. API Routes
// GET: Fetch all items (latest first) with farmer reputation
app.get('/api/listings', async (req, res) => {
    try {
        const items = await Listing.find({ status: { $in: ['active', undefined] } })
            .populate('farmer_id', 'username reputation_score is_verified_farmer total_sales')
            .sort({ date: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch listings" });
    }
});

// POST: Add new item with farmer association
app.post('/api/listings', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'govi_secret');
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (user.role === 'buyer') {
      return res.status(403).json({ error: "Buyers cannot create listings" });
    }
        
    const newItem = new Listing({
      ...req.body,
      farmer_id: user._id,
      farmerName: user.username,
      status: 'active'
    });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.error("Failed to create listing", err);
    res.status(400).json({ error: "Validation failed. Check your data." });
  }
});

// DELETE: Remove a listing (only by the owner)
app.delete('/api/listings/:id', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: "Authentication required" });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'govi_secret');
        const user = await User.findById(decoded.id);
        
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }
        
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ error: "Listing not found" });
        }
        
        // Check if user owns this listing
        if (listing.farmerName !== user.username) {
            return res.status(403).json({ error: "You can only delete your own listings" });
        }
        
        await Listing.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Listing deleted successfully" });
    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ error: "Failed to delete listing" });
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
    const { username, password, district, dsDivision, gnDivision, role, officerId, department, designation } = req.body;

    // 1. Check if user exists
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ msg: "User already exists" });

    // 2. Validate officer ID if role is officer
    if (role === 'officer') {
      if (!officerId) {
        return res.status(400).json({ msg: "Officer ID is required for government officers" });
      }
      // Check if officer ID already exists
      const existingOfficer = await User.findOne({ officerId });
      if (existingOfficer) {
        return res.status(400).json({ msg: "Officer ID already registered" });
      }
    }

    // 3. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create User
    const userData = {
      username,
      password: hashedPassword,
      district,
      dsDivision,
      gnDivision,
      role: role || 'farmer'
    };

    // Add officer-specific fields if applicable
    if (role === 'officer') {
      userData.officerId = officerId;
      userData.department = department || null;
      userData.designation = designation || null;
    }

    user = new User(userData);
    await user.save();

    // 5. Return Token (Login the user immediately)
    const token = jwt.sign(
      { 
        id: user._id, 
        username: user.username, 
        role: user.role,
        district: user.district,
        dsDivision: user.dsDivision,
        gnDivision: user.gnDivision
      }, 
      process.env.JWT_SECRET || 'govi_secret', 
      { expiresIn: '24h' }
    );
    
    const userResponse = {
      username,
      district,
      dsDivision,
      gnDivision,
      role: user.role
    };

    // Include officer fields in response if applicable
    if (user.role === 'officer') {
      userResponse.officerId = user.officerId;
      userResponse.department = user.department;
      userResponse.designation = user.designation;
    }

    res.json({ token, user: userResponse });

  } catch (err) {
    console.error('Registration error:', err);
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

    // 3. Return Token with role information
    const token = jwt.sign(
      { 
        id: user._id, 
        username: user.username, 
        role: user.role,
        district: user.district,
        dsDivision: user.dsDivision,
        gnDivision: user.gnDivision
      }, 
      process.env.JWT_SECRET || 'govi_secret', 
      { expiresIn: '24h' }
    );
    
    const userResponse = { 
      username: user.username, 
      district: user.district, 
      dsDivision: user.dsDivision, 
      gnDivision: user.gnDivision,
      role: user.role || 'farmer'
    };

    // Include officer fields if user is an officer
    if (user.role === 'officer') {
      userResponse.officerId = user.officerId;
      userResponse.department = user.department;
      userResponse.designation = user.designation;
    }
    
    res.json({ token, user: userResponse });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send("Server Error");
  }
});
// 5. Start Server using dynamic port for deployment
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Market Server running on Port ${PORT}`));