# 🌾 Govi Isuru - Smart Farming Platform for Sri Lanka

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.2.3-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green.svg)](https://fastapi.tiangolo.com/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-brightgreen.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.2.1-lightgrey.svg)](https://expressjs.com/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.20.0-orange.svg)](https://tensorflow.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/atlas)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue.svg)](https://www.docker.com/)

**Team Members:**
- H.M. Kalana Lakshan (Full Stack Development & Project Lead)
- G.H. Lasana Pahanga (Contributing Member)  
- A.M.R. Nawanjana Aththanayake (Contributing Member)

---

## 🚀 Quick Start

**Govi Isuru** (Sinhala: ගොවි ඉසුරු) is a comprehensive digital farming platform designed to empower Sri Lankan farmers with AI-driven crop disease detection, real-time market intelligence, weather advisory, community disease alerts, and a peer-to-peer marketplace. The name "Govi Isuru" translates to "Farmer's Fortune" in Sinhala, reflecting our mission to bring prosperity to the agricultural community.

### Prerequisites
- **Node.js** v22.x or higher - [Download](https://nodejs.org/)
- **Python** 3.8+ - [Download](https://www.python.org/)
- **MongoDB Atlas** - [Sign up free](https://mongodb.com/cloud/atlas)
- **OpenWeatherMap API Key** - [Get free](https://openweathermap.org/api)
- **NewsAPI Key** - [Get free](https://newsapi.org)
- **Git** - [Download](https://git-scm.com/)

### Setup in 3 Steps

**1. Clone & Navigate:**
```bash
git clone https://github.com/Kalana-Lakshan/Govi-Isuru.git
cd Govi-Isuru
```

**2. Create `.env` files:**

**server/.env:**
```
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
JWT_SECRET=your_secret_key_min_32_chars
PORT=5000
NEWS_API_KEY=your_newsapi_key
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
```

**client/.env:**
```
REACT_APP_WEATHER_KEY=your_openweathermap_api_key
```

**3. Run Three Terminals:**

**Terminal 1 - Backend:**
```bash
cd server && npm install && node index.js
# Runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client && npm install && npm start
# Runs on http://localhost:3000
```

**Terminal 3 - AI Service:**
```bash
cd ai-service
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows PowerShell
# source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# Runs on http://localhost:8000 | Docs: http://localhost:8000/docs
```

### Services Overview
| Service | URL | Technology |
|---------|-----|------------|
| Frontend | http://localhost:3000 | React 19.2.3 |
| Backend API | http://localhost:5000 | Express 5.2.1 + MongoDB |
| AI Service | http://localhost:8000 | FastAPI + TensorFlow 2.20.0 |
| API Docs | http://localhost:8000/docs | Swagger UI |

---

🌟 **Key Statistics:**
- 🤖 **3 ML Models** - Rice (8 classes), Tea (5 classes), Chili (4 classes)
- 📊 **10 Years** of yield prediction data (2015-2024)
- 🗺️ **25 Districts** covered across Sri Lanka
- 🌐 **Full Bilingual** support (English & Sinhala)
- 👥 **3 User Roles** - Farmers, Buyers, Government Officers
- 🎯 **40+ Components** - Comprehensive feature set

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [AI Model Information](#-ai-model-information)
- [Environment Variables](#-environment-variables)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Key Innovations](#-key-innovations)
- [Contributing](#-contributing)
- [Troubleshooting](#-troubleshooting)
- [FAQ](#-faq)
- [Roadmap](#-future-roadmap)
- [License](#-license)
- [Authors](#-authors)
- [Contact](#-contact)

---

## ✨ Features

### 🤖 AI Crop Doctor with Grad-CAM Explainability
- **Multi-Crop Deep Learning Disease Detection**: Upload photos of crop leaves to detect diseases across multiple crops:
  
  **🌾 Rice Diseases (8 classes):**
  - Bacterial Leaf Blight
  - Brown Spot
  - Healthy Rice Leaf
  - Leaf Blast
  - Leaf Scald
  - Narrow Brown Leaf Spot
  - Rice Hispa
  - Sheath Blight

  **🍵 Tea Diseases (5 classes):**
  - Blister Blight
  - Brown Blight
  - Gray Blight
  - Healthy Tea Leaf
  - Red Rust

  **🌶️ Chili Diseases (4 classes):**
  - Healthy Chili Leaf
  - Leaf Spot
  - Thrips Damage
  - Yellow Virus

- **Grad-CAM Visualization**: See exactly where the AI model focuses to make its diagnosis - builds trust and transparency
- **Confidence Scoring**: Get prediction confidence levels with visual progress bars
- **Treatment Recommendations**: Receive bilingual (English/Sinhala) treatment guidance with numbered steps
- **Medical Report Style Results**: Professional diagnosis report with severity badges and context
- **Transfer Learning**: Utilizes MobileNetV2 pre-trained on ImageNet for superior accuracy

### 📰 Agricultural News Feed with AI Features
- **Multi-Category News**: Agriculture, Market, Weather, Government, Technology news
- **AI-Powered Summaries**: Automatic article summarization with key point extraction
- **Sinhala Translation**: AI-powered translation of news summaries to Sinhala using MyMemory/Google Translate APIs
- **Text-to-Speech (TTS)**: Read aloud articles in both English and Sinhala
  - Native voice support for English
  - Google Translate TTS proxy for Sinhala pronunciation
- **Push Notifications**: Real-time alerts for urgent agricultural news
- **Smart Caching**: 30-minute cache for efficient news loading

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

### � Yield Prediction & Analytics
- **AI-Powered Yield Forecasting**: Predict paddy yield for any district, season, and year
  - Machine Learning model trained on 10 years of Sri Lankan paddy data (2015-2024)
  - Statistical prediction with trend adjustment for future years
  - Covers all 25 districts across Wet Zone, Dry Zone, and Intermediate climate zones
- **Profit Calculator**: Estimate farming profitability with:
  - Revenue projection based on predicted yield
  - Customizable cost per hectare and paddy price inputs
  - ROI (Return on Investment) calculation
  - Break-even yield analysis
- **Early Warning System**: Risk assessment with:
  - Yield deviation warnings (critical/high/medium/low)
  - Profitability alerts
  - Bilingual recommendations (English/Sinhala)
  - Risk score visualization
- **District Rankings**: Compare all 25 districts by:
  - Average yield (kg/ha)
  - Stability index (consistency)
  - Year-over-year trend
  - Overall performance score with medal indicators (🥇🥈🥉)
- **Historical Trends**: 10-year data visualization showing:
  - Maha and Yala season comparisons
  - Production trends by year
  - Area harvested statistics

### �💬 AI Crop Chatbot with Advanced Features
- **Natural Language Q&A**: Ask farming questions in plain language
- **Multi-Crop Knowledge Base**: Built-in agricultural knowledge for Sri Lankan crops including Rice, Tea, and Chili
- **Bilingual Support**: Responds in English or Sinhala
- **Conversation Memory**: Maintains context across chat sessions - remembers crops, seasons, and topics discussed
- **In-Chat Image Diagnosis**: Upload plant images directly in chat for AI disease detection with Grad-CAM visualization
- **Smart Follow-up Suggestions**: Context-aware suggestion buttons based on conversation intent (fertilizer, disease, pest, planting, etc.)
- **Voice Input**: Speech recognition with bilingual support (English & Sinhala) using Web Speech API
- **Visual Indicators**: Context badges showing current crop and season focus

### 👤 User Authentication & Profiles
- **Secure Registration**: JWT-based authentication with bcrypt password hashing
- **Administrative Location Tracking**: District → DS Division → GN Division
- **Progress Indicator**: Visual registration completion progress
- **Persistent Sessions**: Token-based login with localStorage

### 🌐 Bilingual Support
- **Full English/Sinhala Translation**: Toggle between languages instantly
- **Sinhala Unicode Support**: Complete Sinhala text rendering
- **Localized Terminology**: Culturally appropriate agricultural terms

### 🌱 Crop Suitability Advisor
- **ML-Powered Recommendations**: Find best-fit crops for your land based on:
  - Soil type, pH level, and drainage
  - Climate zone and rainfall patterns
  - Temperature ranges and irrigation availability
  - District and seasonal considerations
- **Comprehensive Analysis**: Evaluates soil properties, topography, and environmental factors
- **Confidence Scoring**: Each recommendation includes suitability percentage
- **Multi-Crop Support**: Recommendations for rice, tea, chili, and other major crops
- **Interactive Form**: Easy-to-use interface with dropdown selections

### 🌾 Traditional Rice Varieties Guide
- **Comprehensive Database**: 20+ traditional and modern Sri Lankan rice varieties including:
  - Samba, Keeri Samba, Suwandel, Madathawalu, Kalu Heenati, Rathdhal
  - Bg varieties (Bg 300, Bg 352, Bg 357, Bg 366, At 362, At 405)
- **Detailed Information**:
  - Growth duration and suitable climate zones
  - Disease susceptibility and prevention methods
  - Nutrition requirements and fertilizer schedules
  - Harvesting guidelines and post-harvest care
  - Special features and traditional uses
- **Search & Filter**: Find varieties by name, type (traditional/modern), or category
- **Expandable Details**: Click to view comprehensive farming guides
- **Bilingual Content**: Full English and Sinhala support

### 🛍️ Buyer Dashboard
- **Buyer-Specific Interface**: Dedicated dashboard for agricultural product buyers
- **Quick Actions**: Browse marketplace, view agricultural news
- **Saved Listings**: Bookmark interesting products for later (coming soon)
- **Price Alerts**: Get notified about price drops (beta feature)
- **Seller Discovery**: Find trusted sellers with high ratings
- **Market Insights**: Access to market trends and price analytics

---

## **Government Officer Features**

- **Purpose:** Tools for government/agriculture officers to verify disease reports, schedule and manage field visits, audit actions, and monitor officer performance and escalations.
- **Key UI components:** `OfficerDashboard.js`, `ReportVerificationPanel.js`, `FieldVisitScheduling.js`, `InternalOfficerNotes.js`, `OfficerActionLogs.js`, `OfficerPerformanceDashboard.js`, `ReportVerificationPanel.js`, `AdminModerationPanel.js`.
- **Backend routes & endpoints (examples):**
  - Report verification: `GET /api/officer/reports`, `PUT /api/officer/reports/:id/status`, `PUT /api/officer/reports/:id/priority`, `POST /api/officer/reports/:id/note`, `GET /api/officer/report/:id/history`
  - Action logs / audit trail: `GET /api/officer/action-logs`
  - Officer stats & escalations: `GET /api/officer/stats`, `GET /api/officer/escalations`, `GET /api/officer/priority-config`
  - Officer workflow (field visits & notes): `POST /api/officer-workflow/field-visits`, `GET /api/officer-workflow/field-visits`, `GET /api/officer-workflow/field-visits/:id`, `PUT /api/officer-workflow/field-visits/:id/status`, `POST /api/officer-workflow/field-visits/:id/notes`, `POST /api/officer-workflow/field-visits/:id/photos`, `PUT /api/officer-workflow/field-visits/:id/findings`, `GET /api/officer-workflow/field-visit-stats`
  - Internal notes & flags: `POST /api/officer-workflow/internal-notes`, `GET /api/officer-workflow/internal-notes/target/:type/:id`, `GET /api/officer-workflow/internal-notes/farmer/:username`, `POST /api/officer-workflow/internal-notes/flag`, `DELETE /api/officer-workflow/internal-notes/:id/flag/:flag`, `PUT /api/officer-workflow/internal-notes/:id/resolve`, `GET /api/officer-workflow/internal-notes/stats`
  - Performance & leaderboard: `GET /api/officer-workflow/performance`, `GET /api/officer-workflow/performance/monthly`, `GET /api/officer-workflow/leaderboard`
- **Services & server-side components:** `officerService.js`, `officerPerformanceService.js`, `fieldVisitService.js`, `internalNoteService.js`, `alertService.js` — used to fetch reports, create field visits, record notes/flags, compute stats, and power escalations/leaderboards.
- **Models involved:** `DiseaseReport.js`, `OfficerActionLog.js`, `FieldVisit.js`, `InternalNote.js`, `User.js` — supporting audit trails, scheduling, and verification workflows.
- **Security & workflow:** Officer endpoints use an `officerAuthMiddleware` that requires `role: officer` or `role: admin` in the JWT; actions are recorded in `OfficerActionLog` for auditability.
- **Typical officer workflows:**
  - Review incoming AI or community disease reports → verify/reject/flag → optionally request `needs_field_visit` → schedule/complete field visit → record findings and internal notes → update report and trigger community alerts or escalations.
  - Monitor district-level dashboards for priority alerts, reporting coverage, and officer performance; use leaderboards and monthly comparisons to manage operations.


## 🛠️ Tech Stack

### Frontend (React)
| Technology | Version | Purpose | Key Features |
|------------|---------|---------|--------------|
| React | 19.2.3 | UI Framework | Hooks, Context API, Virtual DOM |
| React Router DOM | 7.13.0 | Client Routing | Dynamic routing, URL parameters |
| Tailwind CSS | 3.4.1 | Utility Styling | Responsive, mobile-first design |
| Lucide React | 0.561.0 | Icon Library | 1000+ icons, tree-shakeable |
| Recharts | 3.6.0 | Charts & Analytics | Line, bar, area charts |
| Axios | 1.13.2 | HTTP Client | API requests, interceptors |
| PostCSS | 8.4.31 | CSS Processing | Autoprefixer, transformations |

### Backend (Node.js Server)
| Technology | Version | Purpose | Key Features |
|------------|---------|---------|--------------|
| Node.js | 22.x | Runtime | Event-driven, non-blocking I/O |
| Express | 5.2.1 | Web Framework | REST API, middleware support |
| MongoDB Atlas | Cloud | Database | NoSQL, flexible schema, cloud |
| Mongoose | 9.0.2 | MongoDB ODM | Schema validation, middleware |
| JWT | 9.0.3 | Authentication | Stateless auth, token-based |
| Bcrypt.js | 3.0.3 | Password Hashing | Secure password storage |
| Nodemailer | 7.0.13 | Email Service | Verification, password reset |
| Web Push | 3.6.7 | Push Notifications | Real-time alerts |
| CORS | 2.8.5 | Cross-Origin | Enable cross-origin requests |
| Dotenv | 17.2.3 | Environment Config | Secure configuration |

### AI Service (Python/FastAPI)
| Technology | Version | Purpose | Key Features |
|------------|---------|---------|--------------|
| FastAPI | 0.127.1 | API Framework | High performance, auto docs |
| TensorFlow | 2.20.0 | Deep Learning | Model training & inference |
| Keras | 3.13.0 | Neural Networks | High-level API for TensorFlow |
| MobileNetV2 | Pre-trained | Base Model | Transfer learning, efficient |
| NumPy | 2.2.6 | Numerical Computing | Array operations, linear algebra |
| Pandas | 2.3.3 | Data Analysis | Yield data processing |
| Scikit-learn | 1.8.0 | Machine Learning | Yield forecasting models |
| OpenCV | 4.12.0 | Image Processing | Grad-CAM heatmap generation |
| Pillow | 12.0.0 | Image Handling | Image loading, preprocessing |
| Pydantic | 2.12.5 | Data Validation | Request/response validation |
| Uvicorn | Latest | ASGI Server | Production-ready server |

### External APIs & Services
| Service | Purpose | Features |
|---------|---------|----------|
| OpenWeatherMap | Weather Data | 5-day forecast, current conditions |
| NewsAPI.org | Agricultural News | Multi-category news aggregation |
| MyMemory Translation | Sinhala Translation | AI-powered English to Sinhala |
| Google Translate TTS | Text-to-Speech | Sinhala voice synthesis |
| MongoDB Atlas | Cloud Database | Auto-scaling, backups, security |

### DevOps & Deployment
| Technology | Version | Purpose | Features |
|------------|---------|---------|----------|
| Docker | Latest | Containerization | Isolated environments |
| Docker Compose | 3.8 | Orchestration | Multi-container management |
| Nginx | Latest | Reverse Proxy | Load balancing, static files |
| Git | 2.x | Version Control | Source code management |

---

## 🚀 Docker Deploy

- Quick start builds and runs all services (frontend + backend + AI + MongoDB) locally or on an EC2 host.

### Prerequisites
- Docker and Docker Compose installed
- For EC2: open security group ports 80 (HTTP). 5000/8000 are optional for direct access.

### Environment
- Optional (overrides defaults): create a `.env` at repo root with:

```
JWT_SECRET=your_secret
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/govi_isuru?retryWrites=true&w=majority
AI_SERVICE_URL=http://ai-service:8000
NEWS_API_KEY=
```

If `MONGO_URI` is not provided, a local MongoDB container is used at `mongodb://mongo:27017/govi_isuru`.

### Run

```bash
docker compose build
docker compose up -d
```

- Frontend: http://localhost/ (EC2: http://<ec2-public-ip>/)
- API (direct): http://localhost:5000/api
- AI Service (direct): http://localhost:8000/docs

Frontend is served by Nginx and proxies `/api/*` to the backend, so the app works behind a single public port 80.

### Stop

```bash
docker compose down
```

### Notes
- To use MongoDB Atlas on EC2, ensure the EC2 public IP is whitelisted in Atlas or use VPC peering.
- For production, keep only port 80 open in the security group; 5000/8000 can remain closed.
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
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  │   Yield     │ │   Market    │ │   Agri      │ │     AI      │   │
│  │ Prediction  │ │   Trends    │ │   News      │ │   Chatbot   │   │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘   │
└────────────┬──────────────────────────┬─────────────────────────────┘
             │                          │
             │ REST API                 │ REST API
             │ (Port 5000)              │ (Port 8000)
             ▼                          ▼
┌────────────────────────────┐   ┌─────────────────────────────────┐
│   BACKEND (Express.js)     │   │   AI SERVICE (FastAPI + TF)     │
│  ├─ User Auth (JWT)        │   │  ├─ MobileNetV2 Disease Models  │
│  ├─ Marketplace CRUD       │   │  │  ├─ Rice: 8-Class Detection  │
│  ├─ Reputation System      │   │  │  ├─ Tea: 5-Class Detection   │
│  ├─ Disease Alerts         │   │  │  └─ Chili: 4-Class Detection │
│  ├─ Market Price API       │   │  ├─ Grad-CAM Visualization      │
│  ├─ News API + AI Summary  │   │  ├─ Yield Prediction ML Model   │
│  ├─ TTS Audio Proxy        │   │  │  ├─ 25 District Stats        │
│  └─ MongoDB Integration    │   │  │  ├─ Profit Calculator        │
└───────────┬────────────────┘   │  │  └─ Early Warning System     │
            │ Mongoose ODM       │  └─ Treatment Recommendations   │
            ▼                    └─────────────────────────────────┘
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
├─ NewsAPI (Agricultural news)
├─ MyMemory Translation API (English to Sinhala)
├─ Google Translate TTS (Sinhala text-to-speech)
└─ MongoDB Atlas (Database hosting)
```

---

##  Project Structure

```
govi-isuru/
├── 📂 client/                       # React Frontend
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── AIDoctor.js          # Multi-crop disease detection + Grad-CAM
│   │   │   ├── CropChatbot.js       # AI chatbot with voice & image diagnosis
│   │   │   ├── AgriNews.js          # News feed with AI summaries & TTS
│   │   │   ├── CommunityAlerts.js   # Disease alert system
│   │   │   ├── Marketplace.js       # P2P marketplace
│   │   │   ├── MarketTrends.js      # Analytics dashboard
│   │   │   ├── YieldPrediction.js   # 📊 Yield forecasting & analytics
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
│   │   ├── User.js                  # User schema
│   │   ├── Listing.js               # Marketplace listings
│   │   ├── CommunityAlert.js        # Disease alerts
│   │   ├── DiseaseReport.js         # Disease reports
│   │   ├── Feedback.js              # User feedback
│   │   ├── FieldVisit.js            # Field visit records
│   │   ├── InternalNote.js          # Officer internal notes
│   │   ├── Notification.js          # Push notifications
│   │   └── OfficerActionLog.js      # Officer action audit log
│   ├── routes/
│   │   ├── alerts.js                # Disease alert endpoints
│   │   ├── analytics.js             # Analytics endpoints
│   │   ├── chatbot.js               # Chatbot API endpoints
│   │   ├── news.js                  # News API + AI summaries + TTS
│   │   ├── officer.js               # Officer user endpoints
│   │   ├── officerWorkflow.js       # Officer workflow & verification
│   │   ├── reputation.js            # Farmer ratings
│   │   └── suitability.js           # Crop suitability endpoints
│   ├── services/
│   │   ├── alertService.js          # Alert management
│   │   ├── analyticsService.js      # Market & usage analytics
│   │   ├── fieldVisitService.js     # Field visit scheduling & records
│   │   ├── internalNoteService.js   # Internal note handling
│   │   ├── officerPerformanceService.js # Officer performance metrics
│   │   ├── officerService.js        # Officer-related operations
│   │   └── reputationService.js     # Reputation system
│   ├── utils/
│   │   └── intentDetector.js        # Chatbot intent detection
│   ├── knowledge/
│   │   └── agriculture.json         # Agricultural knowledge base
│   ├── index.js                     # Express server
│   └── package.json
│
├── 📂 ai-service/                   # Python AI Service
│   ├── venv/                        # Virtual environment (created with python -m venv venv)
│   ├── dataset/                     # Rice training images
│   │   ├── train/                   # Training set (8 classes)
│   │   ├── valid/                   # Validation set
│   │   └── test/                    # Test set
│   ├── tea_dataset/                 # Tea training images
│   │   ├── train/                   # Training set (5 classes)
│   │   ├── valid/                   # Validation set
│   │   └── test/                    # Test set
│   ├── chili_dataset/               # Chili training images
│   │   ├── train/                   # Training set (4 classes)
│   │   ├── valid/                   # Validation set
│   │   └── test/                    # Test set
│   ├── paddy_data/                  # 📊 Yield prediction data
│   │   └── paddy_statistics.json    # 10-year historical data (2015-2024)
│   ├── models/
│   │   ├── best_model.keras         # Rice disease model
│   │   ├── class_indices.json       # Rice class mappings
│   │   ├── disease_info.json        # Rice disease details (EN/SI)
│   │   ├── yield_predictor.pkl      # 📊 Yield prediction ML model
│   │   ├── tea/
│   │   │   ├── tea_best_model.keras # Tea disease model
│   │   │   ├── tea_class_indices.json
│   │   │   └── tea_disease_info.json
│   │   └── chili/
│   │       ├── chili_best_model.keras # Chili disease model
│   │       ├── chili_class_indices.json
│   │       └── chili_disease_info.json
│   ├── main.py                      # FastAPI server + Grad-CAM + Yield APIs
│   ├── yield_predictor.py           # 📊 Yield prediction ML module
│   ├── train_model.py               # Rice training script
│   ├── train_tea_model.py           # Tea training script
│   ├── train_chili_model.py         # Chili training script
│   ├── prepare_tea_dataset.py       # Tea dataset preparation
│   ├── prepare_chili_dataset.py     # Chili dataset preparation
│   ├── requirements.txt             # Python dependencies
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

#### News & TTS

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/news/:category` | GET | Get news by category |
| `/api/news/summarize` | POST | AI-generate article summary |
| `/api/news/prepare-tts` | POST | Prepare text for TTS |
| `/api/news/tts-audio` | GET | Get TTS audio (proxy) |
| `/api/news/subscribe` | POST | Subscribe to push notifications |

**POST** `/api/news/summarize`
```json
{
  "article": { "id": "string", "title": "string", "description": "string" },
  "lang": "en" // or "si" for Sinhala
}
```
**Response**:
```json
{
  "success": true,
  "summary": {
    "en": "English summary...",
    "si": "සිංහල සාරාංශය...",
    "keyPoints": [{ "type": "stat", "value": "25%" }]
  }
}
```

**GET** `/api/news/tts-audio?text=Hello&lang=si`
- Returns audio/mpeg stream for text-to-speech
- Supports `en` (English) and `si` (Sinhala)

### AI Service (FastAPI - Port 8000)

#### Disease Prediction Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/predict` | POST | Predict rice disease |
| `/predict/rice` | POST | Predict rice disease |
| `/predict/tea` | POST | Predict tea disease |
| `/predict/chili` | POST | Predict chili disease |

**POST** `/predict/chili`
- **Content-Type**: `multipart/form-data`
- **Body**: `file` (image file)

**Response**:
```json
{
  "disease": "Leaf Spot",
  "disease_si": "පත්‍ර පුල්ලි රෝගය",
  "confidence": 0.94,
  "treatment": "Remove and destroy infected leaves...",
  "treatment_si": "ආසාදිත පත්‍ර ඉවත් කර විනාශ කරන්න...",
  "gradcam": "data:image/png;base64,..."
}
```

**Note**: The `gradcam` field contains a base64-encoded heatmap overlay showing where the AI model focused to make its prediction.

#### Yield Prediction Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/yield/predict` | GET | Predict yield for district/season/year |
| `/yield/profit` | GET | Calculate profit forecast |
| `/yield/warning` | GET | Get early warning and risk assessment |
| `/yield/rankings` | GET | Get district rankings |
| `/yield/trends` | GET | Get historical yield trends |
| `/yield/climate-zones` | GET | Get districts by climate zone |

**GET** `/yield/predict?district=Anuradhapura&season=Maha&year=2025&area_ha=1`
```json
{
  "success": true,
  "district": "Anuradhapura",
  "season": "Maha",
  "year": 2025,
  "yield_kg_ha": 4983.82,
  "total_production_kg": 4983.82,
  "confidence": 0.9,
  "confidence_level": "high",
  "stability_index": 0.921,
  "yield_range": { "min": 3620, "max": 4920 },
  "method": "ml_model"
}
```

**GET** `/yield/profit?district=Anuradhapura&season=Maha&year=2025&area_ha=1`
```json
{
  "success": true,
  "estimated_profit": 255624.7,
  "revenue": 423624.7,
  "total_cost": 168000.0,
  "roi": 152.2,
  "profit_per_ha": 255624.7,
  "break_even_yield": 1976.47,
  "profitability_status": "highly_profitable"
}
```

**GET** `/yield/warning?district=Anuradhapura&season=Maha&year=2025`
```json
{
  "success": true,
  "risk_level": "low",
  "risk_score": 0.2,
  "warnings": [],
  "positive_indicators": [{ "type": "favorable_yield", "message": "..." }],
  "recommendations": [{ "en": "...", "si": "..." }]
}
```

**GET** `/yield/rankings`
```json
{
  "success": true,
  "rankings": [
    { "district": "Polonnaruwa", "avg_yield": 4850, "stability": 0.92, "trend": 0.02, "overall_score": 89.5 },
    { "district": "Ampara", "avg_yield": 4627, "stability": 0.91, "trend": 0.01, "overall_score": 87.2 }
  ]
}
```

**GET** `/yield/trends?district=&season=`
```json
{
  "success": true,
  "trends": [
    { "year": 2015, "season": "Maha", "avg_yield_kg_ha": 3721.2, "total_production_mt": 3157873.5 },
    { "year": 2015, "season": "Yala", "avg_yield_kg_ha": 3433.2, "total_production_mt": 2196964.4 }
  ]
}
```

---

## 🧠 AI Model Information

### Model Architecture
- **Base Model**: MobileNetV2 (pre-trained on ImageNet)
- **Transfer Learning**: Frozen base layers, trainable top
- **Input Shape**: 224×224×3 RGB images
- **Final Activation**: Softmax

### Supported Crops & Disease Classes

#### 🌾 Rice Model (8 Classes)
| Class | Sinhala Name | Description |
|-------|--------------|-------------|
| Bacterial Leaf Blight | බැක්ටීරියා පත්‍ර අංගමාරය | Bacterial infection causing yellow lesions |
| Brown Spot | දුඹුරු පුල්ලි රෝගය | Fungal disease with brown circular spots |
| Healthy Rice Leaf | නිරෝගී වී පත්‍රය | No disease detected |
| Leaf Blast | පත්‍ර පිපිරුම් රෝගය | Fungal disease with diamond-shaped lesions |
| Leaf Scald | පත්‍ර පිළිස්සුම් රෝගය | Bacterial disease with water-soaked lesions |
| Narrow Brown Leaf Spot | සිහින් දුඹුරු පත්‍ර පුල්ලි | Linear brown lesions on leaves |
| Rice Hispa | වී හිස්පා කෘමියා | Insect pest damage with tunneling patterns |
| Sheath Blight | කොපු අංගමාරය | Fungal infection at leaf sheath |

#### 🍵 Tea Model (5 Classes)
| Class | Sinhala Name | Description |
|-------|--------------|-------------|
| Blister Blight | බුබුළු අංගමාරය | Fungal disease causing blister-like spots |
| Brown Blight | දුඹුරු අංගමාරය | Fungal disease with brown patches |
| Gray Blight | අළු අංගමාරය | Fungal disease with grayish lesions |
| Healthy Tea Leaf | නිරෝගී තේ පත්‍රය | No disease detected |
| Red Rust | රතු මලකඩ | Algal disease with red-orange patches |

#### 🌶️ Chili Model (4 Classes)
| Class | Sinhala Name | Description |
|-------|--------------|-------------|
| Healthy Chili Leaf | නිරෝගී මිරිස් පත්‍රය | No disease detected |
| Leaf Spot | පත්‍ර පුල්ලි රෝගය | Fungal/bacterial spots on leaves |
| Thrips Damage | තිරිප්ස් කෘමි හානිය | Insect damage causing silvery streaks |
| Yellow Virus | කහ පැහැ වෛරස් රෝගය | Viral infection causing yellowing |

### Model Architecture Details
```
MobileNetV2 (frozen) → GlobalAveragePooling2D → Dense(256, ReLU) 
    → Dropout(0.3) → Dense(128, ReLU) → Dense(N, Softmax)
```
Where N = number of classes (8 for rice, 5 for tea, 4 for chili)

### Grad-CAM Explainability
The model includes **Gradient-weighted Class Activation Mapping** (Grad-CAM) to visualize which regions of the leaf image the model focused on to make its prediction. This provides:
- **Transparency**: Farmers can see the evidence behind diagnoses
- **Trust**: Visual proof that the AI is looking at the right areas
- **Education**: Helps farmers learn to identify symptoms themselves

### Yield Prediction Model

#### Data Source
- **Historical Data**: 10 years of Sri Lankan paddy statistics (2015-2024)
- **Coverage**: All 25 districts across 3 climate zones
- **Seasons**: Maha (October-March) and Yala (April-September)
- **Records**: 475+ data points with yield, production, and area metrics

#### Climate Zones
| Zone | Districts | Characteristics |
|------|-----------|-----------------|
| Wet Zone | Colombo, Gampaha, Kalutara, Galle, Matara, Ratnapura, Kegalle, Kandy, NuwaraEliya | High rainfall (>2500mm), no irrigation needed |
| Dry Zone | Anuradhapura, Polonnaruwa, Ampara, Batticaloa, Trincomalee, Jaffna, Kilinochchi, Mullaitivu, Mannar, Vavuniya, Hambantota | Low rainfall, irrigation dependent |
| Intermediate | Kurunegala, Puttalam, Matale, Badulla, Monaragala | Moderate conditions |

#### Prediction Methods
1. **ML Model**: Pre-trained model loaded from `yield_predictor.pkl`
   - Uses historical patterns and district-specific features
   - Applies trend adjustment and year-based variation
2. **Statistical Fallback**: When ML model unavailable
   - Base yield from district historical average
   - Trend slope adjustment per year
   - Season adjustment (Yala typically 8% lower)

#### Key Metrics
| Metric | Description |
|--------|-------------|
| `yield_kg_ha` | Predicted yield in kg per hectare |
| `stability_index` | Consistency score (0-1, higher = more stable) |
| `trend_slope` | Year-over-year change rate |
| `confidence` | Prediction reliability (high/medium/low) |

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

## 🧪 Testing

### Manual Testing
```bash
# Test Backend API Endpoints
# Use Postman or curl to test:
curl -X GET http://localhost:5000/api/listings
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d '{"username":"test","password":"Test@1234",...}'

# Test AI Service
curl -X POST http://localhost:8000/predict/rice -F "file=@leaf_image.jpg"
```

### Frontend Testing
```bash
cd client
npm test
```

### AI Model Testing
```bash
cd ai-service
python test_model.py
```

### Test User Accounts
Create test accounts with different roles to test functionality:
- **Farmer Account**: Regular user with full feature access
- **Officer Account**: Government officer with verification powers
- **Buyer Account**: Buyer with marketplace focus

---

## 🚀 Deployment

### Production Checklist
- [ ] Update all API keys and secrets
- [ ] Set strong JWT_SECRET (32+ characters)
- [ ] Whitelist production IPs in MongoDB Atlas
- [ ] Enable MongoDB backup and monitoring
- [ ] Set up SSL/TLS certificates
- [ ] Configure environment variables
- [ ] Test all API endpoints
- [ ] Enable CORS only for production domain
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting
- [ ] Enable database indexing for performance

### Docker Production Deployment
```bash
# Build for production
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose logs -f

# Scale services
docker-compose up -d --scale backend=3
```

### Cloud Deployment Options

#### AWS EC2
1. Launch EC2 instance (t2.medium or higher recommended)
2. Install Docker and Docker Compose
3. Configure security groups (open ports 80, 443)
4. Clone repository and set environment variables
5. Run `docker-compose up -d`
6. Configure Elastic IP for static address
7. Set up CloudWatch for monitoring

#### DigitalOcean
1. Create Droplet (4GB RAM recommended)
2. Install Docker
3. Configure firewall rules
4. Deploy using Docker Compose
5. Set up managed MongoDB if not using Atlas
6. Configure domain and SSL

#### Heroku
- Use Heroku Container Registry for Docker deployment
- Set up MongoDB Atlas (Heroku doesn't provide MongoDB)
- Configure environment variables in Heroku dashboard
- Use Heroku CLI for deployment

### Environment-Specific Configurations

#### Development
```env
NODE_ENV=development
DEBUG=true
LOG_LEVEL=debug
```

#### Production
```env
NODE_ENV=production
DEBUG=false
LOG_LEVEL=error
RATE_LIMIT_ENABLED=true
```

---

## ❓ FAQ

### General Questions

**Q: Is Govi Isuru free to use?**
A: Yes, completely free for all Sri Lankan farmers.

**Q: Which crops are supported?**
A: Currently supports Rice, Tea, and Chili for disease detection. Market data available for 20+ crops.

**Q: Do I need internet connection?**
A: Yes, currently requires internet. Offline mode is planned for future releases.

**Q: Which browsers are supported?**
A: Chrome, Firefox, Safari, Edge (latest versions). Mobile browsers fully supported.

### Technical Questions

**Q: Why is AI prediction slow?**
A: First-time predictions load the model. Subsequent predictions are faster. Consider upgrading server resources.

**Q: How accurate is the disease detection?**
A: Rice: ~54%, Tea: varies by model. Grad-CAM visualization shows confidence areas.

**Q: Can I use my own MongoDB instance?**
A: Yes, update MONGO_URI in environment variables to point to your instance.

**Q: How do I reset my password?**
A: Use "Forgot Password" link on login page. Email verification required.

### Troubleshooting Common Issues

**Q: "Cannot connect to database" error**
A: Check if MongoDB Atlas IP whitelist includes your IP. Verify MONGO_URI format.

**Q: Images not uploading in AI Doctor**
A: Check file size (max 10MB). Ensure AI service is running on port 8000.

**Q: Weather data not loading**
A: Verify REACT_APP_WEATHER_KEY is set correctly. Check OpenWeatherMap API quota.

**Q: Sinhala text not displaying**
A: Ensure browser supports Unicode. Try different browser.

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### Backend Issues

**Port 5000 already in use**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

**MongoDB Connection Failed**
```bash
# Check MongoDB Atlas
- Verify IP whitelist (0.0.0.0/0 for testing)
- Check username/password in connection string
- Ensure database name is correct
- Test connection using MongoDB Compass
```

**JWT Token Invalid**
```bash
# Clear browser localStorage
localStorage.clear()

# Regenerate JWT_SECRET in .env
# Restart server
```

#### Frontend Issues

**npm install fails**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

**API calls failing (CORS errors)**
```bash
# Ensure backend CORS is configured
# Check API_BASE URL in React app
# Verify backend is running on correct port
```

#### AI Service Issues

**TensorFlow not found**
```bash
# Ensure virtual environment is activated
.\venv\Scripts\Activate.ps1  # Windows
source venv/bin/activate     # Linux/Mac

# Reinstall dependencies
pip install -r requirements.txt
```

**Model files missing**
```bash
# Download pre-trained models
# Or train models using train_model.py scripts
python train_model.py
python train_tea_model.py
python train_chili_model.py
```

**Grad-CAM heatmap not generating**
```bash
# Check OpenCV installation
pip install opencv-python==4.12.0.88

# Verify image format (JPEG/PNG)
# Check image size (recommended: 224x224)
```

#### Docker Issues

**Docker containers not starting**
```bash
# Check Docker logs
docker-compose logs

# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

**Volume permission errors**
```bash
# Linux: Fix permissions
sudo chown -R $USER:$USER .

# Windows: Run Docker Desktop as Administrator
```

### Performance Optimization

**Slow API responses**
```bash
# Enable MongoDB indexing
# Add indexes to frequently queried fields:
db.listings.createIndex({ farmer_id: 1, date: -1 })
db.alerts.createIndex({ gnDivision: 1, district: 1, createdAt: -1 })

# Use Redis for caching (future enhancement)
```

**Large bundle size (Frontend)**
```bash
# Analyze bundle
npm run build
# Use code splitting and lazy loading

# Optimize images
# Use WebP format
# Compress assets
```

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
| 🎙️ **Voice Input** | Speech recognition for hands-free chatbot interaction |
| 💭 **Conversation Memory** | Context-aware chatbot remembers discussion topics |

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
