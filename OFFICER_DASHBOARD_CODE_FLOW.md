# Government Officer Dashboard - Code Flow Analysis

## App Initialization Flow

```
┌─────────────────────────────────────────────────────────────┐
│ App Loads                                                    │
│ ├─ view = 'home'                                             │
│ ├─ user = localStorage.getItem('user') || null              │
│ └─ lang = 'en'                                               │
└──────────────────┬──────────────────────────────────────────┘
                   │
         ┌─────────▼──────────┐
         │ User exists?       │
         └┬────────────┬──────┘
          │ No         │ Yes
          │            │
    ┌─────▼───┐   ┌───▼──────────────────────┐
    │ Show    │   │ useEffect([user]) fires  │
    │ Home/   │   │                          │
    │ Login   │   │ if (user && (view ===    │
    │ Screen  │   │   'home' || 'login' ||   │
    └─────────┘   │   'register'))           │
                  └────┬────────────────────┘
                       │
          ┌────────────▼─────────────┐
          │ Check user.role          │
          └┬──────────────────────┬──┘
           │ 'farmer'             │ 'officer'
           │                      │
      ┌────▼─────────┐     ┌─────▼──────────────┐
      │ setView(     │     │ setView(           │
      │  'doctor'    │     │  'officerDashboard'│
      │ )            │     │ )                  │
      └────┬─────────┘     └─────┬──────────────┘
           │                     │
      ┌────▼─────────┐     ┌─────▼──────────────┐
      │ Farmer       │     │ Officer            │
      │ Dashboard    │     │ Dashboard          │
      │ with 8 tabs: │     │ with 5 tabs:       │
      │             │     │                    │
      │ • AI Doctor │     │ • Area Dashboard   │
      │ • Yield     │     │ • Disease Alerts   │
      │ • Trends    │     │ • Area Reports     │
      │ • Marketplace│     │ • Area Analytics   │
      │ • Weather   │     │ • Agri News        │
      │ • Alerts    │     │                    │
      │ • News      │     └────────────────────┘
      │ • Suitability│
      └────────────┘
```

## Critical Fix Applied

### Problem
useEffect was checking `!user.isInitialViewSet` which is never set, causing condition to always be false.

### Solution
```javascript
// BEFORE (BROKEN)
useEffect(() => {
  if (user && !user.isInitialViewSet) {  // ❌ Never true!
    const initialView = user?.role === 'officer' ? 'officerDashboard' : 'doctor';
    setView(initialView);
  }
}, [user]);

// AFTER (FIXED)
useEffect(() => {
  if (user && (view === 'home' || view === 'login' || view === 'register')) {
    const initialView = user?.role === 'officer' ? 'officerDashboard' : 'doctor';
    setView(initialView);
  }
}, [user]);
```

## Navigation Logic

```javascript
const getNavItems = () => {
  const isFarmer = !user?.role || user?.role === 'farmer';
  
  if (isFarmer) {
    // 8 farmer tabs
    return [
      { id: 'doctor', ... },
      { id: 'yield', ... },
      { id: 'trends', ... },
      { id: 'market', ... },
      { id: 'weather', ... },
      { id: 'alerts', ... },
      { id: 'news', ... },
      { id: 'suitability', ... },
    ];
  } else {
    // 5 officer tabs
    return [
      { id: 'officerDashboard', ... },  // ← Default view
      { id: 'diseaseAlerts', ... },
      { id: 'areaReports', ... },
      { id: 'areaAnalytics', ... },
      { id: 'news', ... },
    ];
  }
};
```

## View Rendering

```javascript
// Show officer-specific views
{user?.role === 'officer' && (
  <>
    {view === 'officerDashboard' && <OfficerDashboard />}
    {view === 'diseaseAlerts' && <AlertsDashboard isOfficer={true} />}
    {view === 'areaReports' && <AreaReportsView />}
    {view === 'areaAnalytics' && <AreaAnalyticsView />}
    {view === 'news' && <AgriNews />}
  </>
)}

// Show farmer-specific views
{(!user?.role || user?.role === 'farmer') && (
  <>
    {view === 'doctor' && <AIDoctor />}
    {view === 'yield' && <YieldPrediction />}
    {view === 'trends' && <MarketTrends />}
    {view === 'market' && <Marketplace />}
    {view === 'weather' && <WeatherAdvisor />}
    {view === 'alerts' && <AlertsDashboard />}
    {view === 'news' && <AgriNews />}
    {view === 'suitability' && <CropSuitability />}
  </>
)}
```

## Component Hierarchy

```
App.js (Main)
├── OfficerDashboard          (Officer view #1)
│   ├── Key Statistics
│   ├── Top Diseases
│   └── Risk Assessment
│
├── AlertsDashboard           (Officer view #2)
│   ├── DiseaseHeatmap
│   ├── OutbreakGraph
│   └── AdminModerationPanel
│
├── AreaReportsView           (Officer view #3)
│   ├── High-Risk Areas
│   └── Medium-Risk Areas
│
├── AreaAnalyticsView         (Officer view #4)
│   ├── 7-Day Stats
│   ├── 30-Day Trends
│   └── Disease Distribution
│
└── AgriNews                  (Officer view #5)
    └── Latest News Articles
```

## Data Flow for Officers

```
┌──────────────────┐
│ Officer Login    │
└────────┬─────────┘
         │
    ┌────▼─────────────────────┐
    │ Backend /api/login        │
    │ Returns:                  │
    │ {                         │
    │   user: {                 │
    │     role: 'officer',      │
    │     district: 'Colombo',  │
    │     officerId: '...',     │
    │     department: '...',    │
    │     designation: '...'    │
    │   },                      │
    │   token: 'jwt...'         │
    │ }                         │
    └────┬──────────────────────┘
         │
    ┌────▼──────────────────────┐
    │ localStorage.setItem(      │
    │   'user',                  │
    │   JSON.stringify(user)     │
    │ )                          │
    └────┬──────────────────────┘
         │
    ┌────▼────────────────────┐
    │ handleRegisterSuccess()  │
    │ setUser(userData)        │
    │ setView('officerDashboard')
    └────┬─────────────────────┘
         │
    ┌────▼─────────────────────┐
    │ Render officerDashboard  │
    │ with role-based navItems │
    └──────────────────────────┘
```

## State Management

```
App State for Officer:
{
  user: {
    username: 'perera123',
    role: 'officer',           ← KEY FOR ROUTING
    district: 'Colombo',       ← KEY FOR DATA FILTERING
    dsDivision: 'Colombo North',
    gnDivision: null,
    officerId: 'AGR/2024/001',
    department: 'Department of Agriculture',
    designation: 'Agricultural Instructor'
  },
  view: 'officerDashboard',     ← KEY FOR RENDERING
  lang: 'en',
  navItems: [5 officer-specific items]
}
```

## Database Storage

```
User Collection (MongoDB)
{
  _id: ObjectId,
  username: String,
  password: String (hashed),
  district: String,
  dsDivision: String,
  gnDivision: String,
  
  // Role System
  role: 'officer',              ← Determines interface
  officerId: String,            ← Unique identifier
  department: String,
  designation: String,
  
  // Reputation (for farmers)
  reputation_score: Number,
  total_sales: Number,
  verified_listings: Number,
  
  createdAt: Date
}
```

## API Calls from Officer Dashboard

```
GET /api/alerts/outbreak-summary
├─ ?district=Colombo
└─ ?days=30

GET /api/news/agriculture

GET /api/community-alerts
└─ ?district=Colombo

GET /api/disease-reports
├─ ?district=Colombo
└─ ?status=pending
```

All officer API calls automatically filter by `user.district` parameter.
