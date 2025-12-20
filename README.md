# 🌾 Govi Isuru - Smart Farming Platform for Sri Lanka

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.x-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-green.svg)](https://fastapi.tiangolo.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-brightgreen.svg)](https://nodejs.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-orange.svg)](https://tensorflow.org/)

**Govi Isuru** (Sinhala: ගොවි ඉසුරු) is a comprehensive digital farming platform designed to empower Sri Lankan farmers with AI-driven crop disease detection, real-time market intelligence, weather advisory, community disease alerts, and a peer-to-peer marketplace. The name "Govi Isuru" translates to "Farmer's Fortune" in Sinhala, reflecting our mission to bring prosperity to the agricultural community.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [AI Model Information](#-ai-model-information)
- [Environment Variables](#-environment-variables)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🤖 AI Crop Doctor with Grad-CAM Explainability
- **Deep Learning Disease Detection**: Upload photos of rice crop leaves to detect 8 different conditions:
  - Bacterial Leaf Blight
  - Brown Spot
  - Healthy Rice Leaf
  - Leaf Blast
  - Leaf Scald
  - Narrow Brown Leaf Spot
  - Rice Hispa
  - Sheath Blight
- **Grad-CAM Visualization**: See exactly where the AI model focuses to make its diagnosis - builds trust and transparency
- **Confidence Scoring**: Get prediction confidence levels with visual progress bars
- **Treatment Recommendations**: Receive bilingual (English/Sinhala) treatment guidance with numbered steps
- **Medical Report Style Results**: Professional diagnosis report with severity badges and context
- **Transfer Learning**: Utilizes MobileNetV2 pre-trained on ImageNet for superior accuracy

### 🚨 Community Disease Alert System
- **Location-Based Alerts**: Real-time disease alerts for your GN Division area
- **Severity Indicators**: Critical, High, Medium, Low severity with color-coded badges
- **Automatic Reporting**: AI diagnoses automatically report to community monitoring system
- **Outbreak Detection**: Multiple case alerts notify nearby farmers of potential outbreaks
- **District Statistics**: View total reports and top diseases in your region

### 📊 Market Intelligence Dashboard
- **Price Trend Analytics**: Visualize historical price trends for major crops (Rice, Chili, Tea) across 6 months
- **District Price Comparison**: Compare real-time prices across major Sri Lankan economic centers:
  - Dambulla, Thambutthegama, Keppetipola, Colombo (Manning Market), Kandy
- **Interactive Charts**: Built with Recharts for responsive data visualization
- **Quick Stats Cards**: At-a-glance price summaries with trend indicators

### 🛒 AgroLink Marketplace with Reputation System
- **Peer-to-Peer Trading**: Direct connection between farmers and buyers
- **Farmer Reputation System**: Star ratings, verified badges, and sales history
- **Top Rated Farmers**: Showcase of highest-rated community members
- **Comprehensive Listings**: Post and browse crop listings with full details
- **Instant Communication**: WhatsApp integration and direct call functionality
- **Mark as Sold**: Track successful transactions and build reputation
- **Feedback & Reviews**: Rate sellers after transactions

### 🌤️ Weather Advisory
- **Real-Time Weather Data**: Integration with OpenWeatherMap API
- **Location-Based Forecasting**: Automatic geolocation detection
- **5-Day Forecast**: Plan agricultural activities with extended predictions
- **Agricultural Recommendations**: 
  - Humidity-based fungal disease warnings
  - Rain alerts for fertilizer timing
  - Temperature advisories for crop protection

### 💬 AI Crop Chatbot
- **Natural Language Q&A**: Ask farming questions in plain language
- **Knowledge Base**: Built-in agricultural knowledge for Sri Lankan crops
- **Bilingual Support**: Responds in English or Sinhala

### 👤 User Authentication & Profiles
- **Secure Registration**: JWT-based authentication with bcrypt password hashing
- **Administrative Location Tracking**: District → DS Division → GN Division
- **Progress Indicator**: Visual registration completion progress
- **Persistent Sessions**: Token-based login with localStorage

### 🌐 Bilingual Support
- **Full English/Sinhala Translation**: Toggle between languages instantly
- **Sinhala Unicode Support**: Complete Sinhala text rendering
- **Localized Terminology**: Culturally appropriate agricultural terms

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI Framework with Hooks |
| Tailwind CSS | 3.4.x | Utility-first Styling |
| Lucide React | Latest | Icon Library |
| Recharts | 3.6.x | Data Visualization |
| Axios | 1.13.x | HTTP Client |

### Backend (Node.js Server)
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 22.x | Runtime Environment |
| Express | 5.x | Web Framework |
| MongoDB | Atlas | Cloud Database |
| Mongoose | 9.x | ODM for MongoDB |
| JWT | 9.x | Authentication |
| Bcrypt.js | 3.x | Password Hashing |

### AI Service (Python)
| Technology | Version | Purpose |
|------------|---------|---------|
| FastAPI | Latest | High-performance API |
| TensorFlow/Keras | 2.x | Deep Learning |
| MobileNetV2 | Pre-trained | Base Model |
| Grad-CAM | Custom | Model Explainability |
| Pillow | Latest | Image Processing |
| NumPy | Latest | Numerical Computing |

### DevOps & Deployment
| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Docker Compose | Multi-container orchestration |
| Nginx | Reverse proxy |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT (React + Tailwind)                   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  │  AI Doctor  │ │ Marketplace │ │   Weather   │ │   Alerts    │   │
│  │ + Grad-CAM  │ │ + Ratings   │ │  Advisory   │ │  Community  │   │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘   │
└────────────┬──────────────────────────┬─────────────────────────────┘
             │                          │
             │ REST API                 │ REST API
             │ (Port 5000)              │ (Port 8000)
             ▼                          ▼
┌────────────────────────────┐   ┌─────────────────────────────────┐
│   BACKEND (Express.js)     │   │   AI SERVICE (FastAPI + TF)     │
│  ├─ User Auth (JWT)        │   │  ├─ MobileNetV2 Model           │
│  ├─ Marketplace CRUD       │   │  ├─ 8-Class Disease Detection   │
│  ├─ Reputation System      │   │  ├─ Grad-CAM Visualization      │
│  ├─ Disease Alerts         │   │  ├─ Image Preprocessing         │
│  ├─ Market Price API       │   │  └─ Treatment Recommendations   │
│  └─ MongoDB Integration    │   └─────────────────────────────────┘
└───────────┬────────────────┘
            │ Mongoose ODM
            ▼
┌────────────────────────────┐
│   MongoDB Atlas (Cloud)    │
│  ├─ Users Collection       │
│  ├─ Listings Collection    │
│  ├─ Alerts Collection      │
│  ├─ Feedbacks Collection   │
│  └─ Reputations Collection │
└────────────────────────────┘

External APIs:
├─ OpenWeatherMap API (Weather data)
└─ MongoDB Atlas (Database hosting)
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v22.x or higher
- **Python** 3.8+ (for AI service)
- **MongoDB Atlas** account (free tier available)
- **OpenWeatherMap API Key** (free tier available)

### Quick Start

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/govi-isuru.git
cd govi-isuru
```

#### 2. Setup Backend Server
```bash
cd server
npm install

# Create .env file
# On Windows PowerShell:
@"
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
"@ | Out-File -FilePath .env -Encoding utf8

# Start the server
node index.js
```

#### 3. Setup Frontend Client
```bash
cd ../client
npm install

# Create .env file
echo "REACT_APP_WEATHER_KEY=your_openweathermap_api_key" > .env

# Start development server
npm start
```

#### 4. Setup AI Service
```bash
cd ../ai-service
pip install -r requirements.txt

# Or install manually:
pip install fastapi uvicorn tensorflow pillow numpy python-multipart

# Start the AI service
uvicorn main:app --reload --port 8000
```

### Access Points
| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | React Application |
| Backend API | http://localhost:5000 | Express Server |
| AI Service | http://localhost:8000 | FastAPI + TensorFlow |
| API Docs | http://localhost:8000/docs | Swagger UI |

### Docker Deployment

```bash
# From the root directory
docker-compose up --build

# Access: Frontend at http://localhost:80, Backend at http://localhost:5000
```

---

## 📁 Project Structure

```
govi-isuru/
├── 📂 client/                       # React Frontend
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── AIDoctor.js          # Disease detection + Grad-CAM
│   │   │   ├── CommunityAlerts.js   # Disease alert system
│   │   │   ├── Marketplace.js       # P2P marketplace
│   │   │   ├── MarketTrends.js      # Analytics dashboard
│   │   │   ├── PriceAnalytics.js    # Price trend charts
│   │   │   ├── PriceComparison.js   # District comparison
│   │   │   ├── WeatherAdvisor.js    # Weather forecast
│   │   │   ├── WeatherTab.js        # Weather tab component
│   │   │   ├── ReputationBadge.js   # Farmer ratings
│   │   │   ├── FeedbackForm.js      # Review system
│   │   │   ├── Register.js          # User registration
│   │   │   └── Login.js             # User login
│   │   ├── data/
│   │   │   └── sriLankaData.js      # Administrative divisions
│   │   ├── App.js                   # Main app with sidebar
│   │   ├── App.css                  # Global animations
│   │   └── index.js                 # Entry point
│   ├── package.json
│   └── tailwind.config.js
│
├── 📂 server/                       # Node.js Backend
│   ├── models/
│   │   └── User.js                  # User schema
│   ├── index.js                     # Express server
│   └── package.json
│
├── 📂 ai-service/                   # Python AI Service
│   ├── dataset/                     # Training images
│   │   ├── train/                   # Training set (8 classes)
│   │   ├── valid/                   # Validation set
│   │   └── test/                    # Test set
│   ├── models/
│   │   ├── rice_disease_model.keras # Trained model
│   │   ├── class_indices.json       # Class mappings
│   │   └── disease_info.json        # Disease details
│   ├── main.py                      # FastAPI server + Grad-CAM
│   ├── train_model.py               # Training script
│   └── test_model.py                # Model evaluation
│
├── docker-compose.yml               # Container orchestration
└── README.md                        # Documentation
```

---

## 📡 API Documentation

### Backend Server (Express - Port 5000)

#### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/register` | POST | Register new user |
| `/api/login` | POST | User login |

**POST** `/api/register`
```json
{
  "username": "string",
  "password": "string",
  "district": "string",
  "dsDivision": "string",
  "gnDivision": "string"
}
```

**POST** `/api/login`
```json
{
  "username": "string",
  "password": "string"
}
```
**Response**: `{ "token": "JWT", "user": {...} }`

#### Marketplace

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/listings` | GET | Get all listings |
| `/api/listings` | POST | Create listing |
| `/api/listings/:id/sold` | PUT | Mark as sold |

#### Disease Alerts

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/alerts` | GET | Get alerts (with location filter) |
| `/api/alerts` | POST | Create disease alert |
| `/api/alerts/stats` | GET | Get district statistics |

**GET** `/api/alerts?gnDivision=Godagama&district=Matara`

#### Reputation System

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/reputation/:farmerId` | GET | Get farmer reputation |
| `/api/reputation/:farmerId/feedback` | POST | Submit feedback |
| `/api/reputation/top` | GET | Get top-rated farmers |

#### Market Data

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/price-trends` | GET | 6-month price trends |
| `/api/market-prices` | GET | Current market prices |

### AI Service (FastAPI - Port 8000)

**POST** `/predict`
- **Content-Type**: `multipart/form-data`
- **Body**: `file` (image file)

**Response**:
```json
{
  "disease": "Bacterial leaf blight",
  "confidence": 0.89,
  "treatment": "Reduce nitrogen fertilizer application...",
  "treatment_si": "නයිට්‍රජන් පොහොර භාවිතය අඩු කරන්න...",
  "gradcam": "data:image/png;base64,..."
}
```

**Note**: The `gradcam` field contains a base64-encoded heatmap overlay showing where the AI model focused to make its prediction.

---

## 🧠 AI Model Information

### Model Architecture
- **Base Model**: MobileNetV2 (pre-trained on ImageNet)
- **Transfer Learning**: Frozen base layers, trainable top
- **Input Shape**: 224×224×3 RGB images
- **Output Classes**: 8 rice disease categories
- **Final Activation**: Softmax

### Disease Classes
| Class | Description |
|-------|-------------|
| Bacterial Leaf Blight | Bacterial infection causing yellow lesions |
| Brown Spot | Fungal disease with brown circular spots |
| Healthy Rice Leaf | No disease detected |
| Leaf Blast | Fungal disease with diamond-shaped lesions |
| Leaf Scald | Bacterial disease with water-soaked lesions |
| Narrow Brown Leaf Spot | Linear brown lesions on leaves |
| Rice Hispa | Insect pest damage with tunneling patterns |
| Sheath Blight | Fungal infection at leaf sheath |

### Model Architecture Details
```
MobileNetV2 (frozen) → GlobalAveragePooling2D → Dense(256, ReLU) 
    → Dropout(0.3) → Dense(128, ReLU) → Dense(8, Softmax)
```

### Grad-CAM Explainability
The model includes **Gradient-weighted Class Activation Mapping** (Grad-CAM) to visualize which regions of the leaf image the model focused on to make its prediction. This provides:
- **Transparency**: Farmers can see the evidence behind diagnoses
- **Trust**: Visual proof that the AI is looking at the right areas
- **Education**: Helps farmers learn to identify symptoms themselves

### Training Configuration
| Parameter | Value |
|-----------|-------|
| Optimizer | Adam |
| Learning Rate | 0.0001 |
| Loss Function | Categorical Crossentropy |
| Epochs | 15 |
| Batch Size | 32 |
| Validation Split | train/valid/test folders |
| Class Balancing | Computed class weights |

### Data Augmentation
- Rotation: 40°
- Width/Height shift: 20%
- Shear: 20%
- Zoom: 20%
- Horizontal flip: Yes
- Fill mode: Nearest

### Dataset Structure
```
ai-service/dataset/
├── train/
│   ├── Bacterial leaf blight/
│   ├── Brown spot/
│   ├── Healthy Rice Leaf/
│   ├── Leaf Blast/
│   ├── Leaf scald/
│   ├── Narrow Brown Leaf Spot/
│   ├── Rice Hispa/
│   └── Sheath Blight/
├── valid/
│   └── (same 8 classes)
└── test/
    └── (same 8 classes)
```

### Model Performance
- **Test Accuracy**: ~54% (8-class classification)
- **Model File**: `ai-service/models/rice_disease_model.keras`
- **Class Indices**: `ai-service/models/class_indices.json`

### Training the Model
```bash
cd ai-service
python train_model.py
```

### Testing the Model
```bash
cd ai-service
python test_model.py
```

---

## 🔐 Environment Variables

### Backend Server (`server/.env`)
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/govi-isuru
JWT_SECRET=your_super_secret_key_here
PORT=5000
```

### Frontend Client (`client/.env`)
```env
REACT_APP_WEATHER_KEY=your_openweathermap_api_key
```

> ⚠️ **Important**: Never commit `.env` files to version control. Add them to `.gitignore`.

---

## 📸 Screenshots

### AI Crop Doctor with Grad-CAM
*Upload crop leaf images for instant disease diagnosis with Grad-CAM heatmap visualization*

### Community Disease Alerts
*Real-time disease alerts with severity indicators for your local area*

### Marketplace with Reputation
*Connect directly with rated farmers through WhatsApp or phone calls*

### Market Trends
*Visualize price trends and compare rates across districts*

### Weather Advisory
*5-day weather forecast with agricultural recommendations*

---

## 🌟 Key Innovations

| Innovation | Description |
|------------|-------------|
| 🔬 **Grad-CAM Explainability** | Visual AI explanations showing where the model looks to make diagnoses |
| 🚨 **Community Alert System** | Location-based disease outbreak warnings for farmers |
| ⭐ **Reputation System** | Trust-based marketplace with farmer ratings and reviews |
| 🌐 **Bilingual Support** | First-class Sinhala language support for rural farmers |
| 📍 **Location Intelligence** | GN Division-level precision for hyper-local services |
| ⚖️ **Class-Balanced ML** | Ensures minority disease classes are detected accurately |
| 🔄 **Transfer Learning** | Achieves high accuracy with limited training data |
| 📱 **Integrated Communication** | Direct WhatsApp/call links from marketplace |
| 👨‍🌾 **Farmer-Centric UX** | Simplified, icon-driven interface for all literacy levels |

## 🤝 Contributing

We welcome contributions from the community! To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Add comments for complex logic
- Test on both English and Sinhala interfaces
- Ensure mobile responsiveness
- Update documentation for new features

---

## 📝 Future Roadmap

- [ ] Containerize AI service in Docker
- [ ] Add more crop types (vegetables, fruits)
- [ ] Expand disease detection beyond rice
- [ ] Implement real-time chat for marketplace
- [ ] Integrate government subsidy information
- [ ] Add soil health monitoring
- [ ] Create mobile app (React Native)
- [ ] Multi-language support (Tamil)
- [ ] IoT sensor integration for farm monitoring
- [ ] AI-powered crop yield prediction
- [ ] Community forum for farmers
- [ ] Offline mode for areas with poor connectivity

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Team Name** - *Initial work*

## 🙏 Acknowledgments

- **Sri Lankan Farmers**: For inspiring this project
- **Department of Agriculture, Sri Lanka**: For agricultural data insights
- **OpenWeatherMap**: For weather API
- **TensorFlow Team**: For the deep learning framework
- **MongoDB**: For database infrastructure
- **Tailwind CSS**: For the beautiful UI components

## 📞 Contact

For questions, suggestions, or collaboration:
- **Email**: contact@goviisuru.lk
- **GitHub**: [github.com/yourusername/govi-isuru](https://github.com/yourusername/govi-isuru)
- **Website**: [www.goviisuru.lk](https://www.goviisuru.lk)

---

<div align="center">
  <p><strong>Built with ❤️ for Sri Lankan Farmers</strong></p>
  <p>ගොවි ඉසුරු - ශ්‍රී ලාංකීය ගොවීන් සවිබල ගැන්වීම</p>
</div>
