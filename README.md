# 🌾 Govi Isuru – Intelligent Agriculture Assistant

Govi Isuru is an AI-powered smart agriculture platform designed to support Sri Lankan farmers by combining **Deep Learning–based crop disease detection** with **Generative AI–driven agricultural guidance**. The system helps farmers identify rice diseases early, receive expert treatment recommendations, access market trends, weather information, and price comparisons—all in a single intuitive platform with support for both English and Sinhala.

---

<p align="center">
  <img src="./client/public/register.png" alt="Doctor Dashboard" />
</p>

<p align="center">
  <img src="./client/public/aidoctor.png" alt="Doctor Dashboard" />
</p>

<p align="center">
  <img src="./client/public/markettrends.png" alt="Doctor Dashboard" />
</p>
## 🚀 Key Features

### 🏥 AI Disease Diagnosis

- **Rice Leaf Disease Detection** using a custom-trained CNN model:
  - Bacterial Leaf Blight
  - Brown Spot
  - Leaf Smut
- Upload leaf images for instant AI-powered diagnosis
- Real-time confidence scoring and treatment suggestions

### 💬 AI Agricultural Chatbot

- **Google Gemini–powered assistant** providing real-time farming advice
- Available on every page via persistent floating UI
- Supports both English and Sinhala for wider accessibility
- Context-aware responses for crop management, pest control, and soil health

### 🛒 Marketplace & Trading

- **Farmer-to-Farmer Marketplace**: Buy and sell agricultural products locally
- Real-time product listings with farmer contact information
- Post crops directly from the dashboard

### 📊 Market Insights & Analytics

- **Market Trends Dashboard**: Track price movements and seasonal patterns
- **Price Analytics**: Analyze historical price data with interactive charts
- **Price Comparison Tool**: Compare prices across different markets
- **Weather Advisor**: Real-time weather updates and agricultural recommendations
- Location-based data for Sri Lankan regions

### 🔐 Secure User Authentication

- JWT-based authentication system
- User registration and login with encrypted passwords (bcryptjs)
- Role-based access control

### 🎨 Modern User Experience

- Responsive design with Tailwind CSS
- Smooth animations and transitions (Framer Motion)
- Beautiful icon system (Lucide React)
- Mobile-first approach

---

## 🛠️ Tech Stack

### Frontend

- **React.js** (v19.2.3) - UI library
- **Tailwind CSS** (v3.4.1) - Utility-first CSS framework
- **Framer Motion** (v12.23.26) - Animation library
- **Lucide React** (v0.561.0) - Icon system
- **Axios** - HTTP client for API calls
- **Recharts** (v3.6.0) - Data visualization library
- **Node.js** (v22) - Runtime environment

### Backend Services

- **Node.js with Express.js** (v5.2.1) - REST API server
- **Python with FastAPI** - AI service for disease detection
- **Uvicorn** - ASGI server for FastAPI

### Database & Authentication

- **MongoDB** - NoSQL database for user data and marketplace listings
- **Mongoose** (v9.0.2) - MongoDB ODM
- **JWT** (jsonwebtoken v9.0.3) - Secure authentication tokens
- **bcryptjs** (v3.0.3) - Password hashing

### AI / ML

- **TensorFlow / Keras** (v2.18.0+) - Deep learning framework
- **Google Generative AI SDK** - Gemini API integration for chatbot
- **NumPy** - Numerical computing
- **OpenCV** - Image processing for disease detection
- **Pillow** - Image handling

### DevOps & Containerization

- **Docker** - Container platform
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Web server (frontend container)

---

## 📁 Project Structure

```
Govi_Isuru/
├── ai-service/              # Python FastAPI service
│   ├── main.py             # Disease detection API endpoints
│   ├── train_model.py      # Model training script
│   ├── rice_model_v2.h5    # Trained CNN model (v2)
│   ├── rice_model.h5       # Trained CNN model (fallback)
│   ├── requirements.txt     # Python dependencies
│   ├── dataset/            # Training datasets
│   │   ├── Bacterial leaf blight/
│   │   ├── Brown spot/
│   │   └── Leaf smut/
│   └── Dockerfile          # AI service container config
│
├── server/                 # Node.js/Express backend
│   ├── index.js           # Main server file
│   ├── models/
│   │   └── User.js        # MongoDB user schema
│   ├── package.json       # Node dependencies
│   ├── Dockerfile         # Backend container config
│   └── .env               # Environment variables
│
├── client/                # React frontend
│   ├── src/
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── components/
│   │   │   ├── AIDoctor.js        # Disease diagnosis interface
│   │   │   ├── ChatBot.js         # AI chatbot component
│   │   │   ├── Marketplace.js     # Product marketplace
│   │   │   ├── MarketTrends.js    # Price trend analytics
│   │   │   ├── PriceAnalytics.js  # Detailed price analytics
│   │   │   ├── PriceComparison.js # Price comparison tool
│   │   │   ├── WeatherAdvisor.js  # Weather recommendations
│   │   │   ├── Login.js           # User authentication
│   │   │   └── Register.js        # User registration
│   │   └── data/
│   │       └── sriLankaData.js    # Location data
│   ├── package.json
│   ├── Dockerfile
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── docker-compose.yml      # Multi-container orchestration
└── README.md              # This file
```

---

## 🚀 Quick Start Guide

### Prerequisites

- **Docker & Docker Compose** (recommended for easy setup)
- OR **Node.js 22+**, **Python 3.10+**, **MongoDB**
- **Google Gemini API Key** (for chatbot functionality)

### Option 1: Using Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/your-username/Govi_Isuru.git
cd Govi_Isuru

# Create environment files
echo "GEMINI_API_KEY=your_gemini_api_key_here" > ai-service/.env
echo "MONGO_URI=your_mongodb_connection_string" > server/.env
echo "REACT_APP_AI_SERVICE_URL=http://localhost:8000" > client/.env

# Build and start all services
docker-compose up --build

# Services will be available at:
# Frontend:  http://localhost
# Backend:   http://localhost:5000
# AI Service: http://localhost:8000
```

### Option 2: Manual Setup (Development)

#### AI Service Setup

```bash
cd ai-service
pip install -r requirements.txt

# Set environment variables
export GEMINI_API_KEY=your_gemini_api_key_here

# Run the service
python main.py
# AI service runs on http://localhost:8000
```

#### Backend Setup

```bash
cd server
npm install

# Set environment variables
export MONGO_URI=your_mongodb_connection_string

# Run the server
npm start
# Backend runs on http://localhost:5000
```

#### Frontend Setup

```bash
cd client
npm install
REACT_APP_AI_SERVICE_URL=http://localhost:8000 npm start
# Frontend runs on http://localhost:3000
```

---

## 🔑 Environment Variables

### AI Service (ai-service/.env)

```
GEMINI_API_KEY=your_google_gemini_api_key
```

### Backend Server (server/.env)

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_secret_key
NODE_ENV=production
```

### Frontend (client/.env)

```
REACT_APP_AI_SERVICE_URL=http://localhost:8000
```

---

## 📡 API Endpoints

### AI Service (FastAPI)

- `POST /predict` - Upload image for disease detection
- `POST /chat` - Chat with AI assistant

### Backend (Express)

- `GET /api/listings` - Get all marketplace listings
- `POST /api/listings` - Create new listing
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /api/user` - Get user profile (authenticated)

---

## 🎯 Core Components

| Component           | Purpose                                                   |
| ------------------- | --------------------------------------------------------- |
| **AIDoctor**        | Upload and analyze rice leaf images for disease detection |
| **ChatBot**         | Floating AI assistant for agricultural guidance           |
| **Marketplace**     | Browse and post agricultural products                     |
| **MarketTrends**    | Visualize price trends and seasonal patterns              |
| **PriceAnalytics**  | Detailed market analysis with interactive charts          |
| **PriceComparison** | Compare prices across different markets                   |
| **WeatherAdvisor**  | Get weather-based farming recommendations                 |
| **Login/Register**  | User authentication system                                |

---

## 🐳 Docker Architecture

The application uses a microservices architecture with three main containers:

1. **govi-isuru-ai** (Port 8000)

   - Python/FastAPI service
   - Handles disease detection and AI inference
   - Loads pre-trained models at startup

2. **govi-isuru-backend** (Port 5000)

   - Node.js/Express server
   - Manages user authentication and marketplace data
   - Connected to MongoDB

3. **govi-isuru-frontend** (Port 80)
   - React app served by Nginx
   - Communicates with backend API
   - Accessible as main entry point

All services communicate through a custom Docker network (`govi_network`).

---

## 🔄 Data Flow

```
User (Browser)
    ↓
Frontend (React/Nginx)
    ↓
Backend (Express/Node.js) ←→ MongoDB
    ↓
AI Service (FastAPI)
    ↓
TensorFlow Model + Gemini API
```

---

## 📝 Development Guidelines

### Adding New Features

1. Frontend: Add components to `client/src/components/`
2. Backend: Add routes to `server/index.js` and models to `server/models/`
3. AI Service: Add endpoints to `ai-service/main.py`

### Building Docker Images

```bash
# Build specific service
docker build -t govi-isuru-ai ./ai-service
docker build -t govi-isuru-backend ./server
docker build -t govi-isuru-frontend ./client

# Or use Docker Compose
docker-compose build
```

---

## 🚀 Deployment

### Cloud Deployment Options

- **Heroku**, **Railway**, or **Render**: For Node.js backend
- **Google Cloud Run**, **Azure Container Instances**: For containerized services
- **MongoDB Atlas**: For cloud database

### Environment-Specific Setup

```bash
# Production deployment
docker-compose -f docker-compose.yml up -d

# Check logs
docker-compose logs -f
```

---

## 🐛 Troubleshooting

### AI Model Not Loading

- Ensure `rice_model_v2.h5` exists in `ai-service/`
- Check TensorFlow version compatibility: `tensorflow>=2.18.0`

### MongoDB Connection Error

- Verify MONGO_URI in server/.env
- Ensure IP whitelist includes your connection IP (for MongoDB Atlas)

### Frontend Can't Reach API

- Check `REACT_APP_AI_SERVICE_URL` environment variable
- Verify backend and AI service are running
- Check CORS settings in FastAPI

### Docker Compose Issues

- Clear unused containers: `docker-compose down`
- Rebuild: `docker-compose up --build`
- Check logs: `docker-compose logs -f [service-name]`

---

## 📦 Dependencies Summary

### Frontend Dependencies

- React 19.2.3, React-DOM 19.2.3
- Tailwind CSS 3.4.1
- Framer Motion 12.23.26
- Lucide React 0.561.0
- Recharts 3.6.0
- Axios 1.13.2

### Backend Dependencies

- Express 5.2.1
- Mongoose 9.0.2
- bcryptjs 3.0.3
- jsonwebtoken 9.0.3
- Nodemon 3.1.11

### AI Service Dependencies

- FastAPI
- Uvicorn
- TensorFlow >= 2.18.0
- NumPy < 2.0.0
- OpenCV (OpenCV-python-headless)
- Pillow
- tf_keras
- Google Generative AI SDK

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - See LICENSE file for details

---

## 📞 Support & Contact

For issues, questions, or suggestions:

- Create an issue in the GitHub repository
- Contact the development team
- Check existing documentation and troubleshooting guides

---

**Last Updated**: December 2025  
**Version**: 1.0.0
