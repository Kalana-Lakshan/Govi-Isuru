import React, { useState, useEffect } from 'react';
import { Leaf, ShoppingBag, Languages, LayoutDashboard, CloudSun, TrendingUp, LogOut, AlertTriangle, Newspaper, BarChart3, BookOpen } from 'lucide-react';
import { BrowserRouter, Routes, Route, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import CropSuitability from './components/CropSuitability';
import AIDoctor from './components/AIDoctor';
import Marketplace from './components/Marketplace';
import WeatherAdvisor from './components/WeatherAdvisor';
import MarketTrends from './components/MarketTrends';
import Register from './components/Register';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import VerifyEmail from './components/VerifyEmail';
import LlamaChatbot from './components/LlamaChatbot';
import CommunityAlerts from './components/CommunityAlerts';
import AlertsDashboard from './components/AlertsDashboard';
import AgriNews from './components/AgriNews';
import NewsWidget from './components/NewsWidget';
import YieldPrediction from './components/YieldPrediction';
import HomePage from './components/HomePage';
import OfficerDashboard from './components/OfficerDashboard';
import BuyerDashboard from './components/BuyerDashboard';
import UserProfile from './components/UserProfile';
import TraditionalRice from './components/TraditionalRice';
import { districtCoordinates } from './data/sriLankaCoordinates';

const translations = {
  en: { 
    title: "Govi Isuru", 
    doctor: "AI Doctor", 
    market: "Marketplace", 
    trends: "Market Trends",
    weather: "Weather Advisory",
    alerts: "Disease Alerts",
    news: "Agri News",
    yieldForecast: "Yield Forecast",
    suitability: "Crop Suitability",
    riceVarieties: "Rice Varieties",
    logout: "Logout",
    footer: "Empowering Sri Lankan Farmers",
    // Officer-specific translations
    diseaseAlerts: "Disease Alerts",
    areaReports: "Area Reports",
    outbreak: "Outbreak Management",
    areaAnalytics: "Area Reports & Analytics",
    buyerDashboard: "Buyer Dashboard",
    marketplace: "Marketplace",
    agriNews: "Agri News"
  },
  si: { 
    title: "ගොවි ඉසුරු", 
    doctor: "AI වෛද්‍යවරයා", 
    market: "අලෙවිසැල", 
    trends: "මිල ප්‍රවණතා", 
    weather: "කාලගුණ උපදෙස්",
    alerts: "රෝග අනතුරු ඇඟවීම්",
    news: "ගොවි ප්‍රවෘත්ති",
    yieldForecast: "අස්වැන්න අනාවැකි",
    suitability: "බෝග සුදුසුකම",
    riceVarieties: "සහල් වර්ග",
    logout: "පද්ධතියෙන් ඉවත් වන්න",
    footer: "ශ්‍රී ලාංකීය ගොවීන් සවිබල ගැන්වීම",
    // Officer-specific translations
    diseaseAlerts: "රෝග අනතුරු ඇඟවීම්",
    areaReports: "ප්‍රදේශ වාර්තා",
    outbreak: "පිපිරීම් කළමනාකරණ",
    areaAnalytics: "ප්‍රදේශ වාර්තා හා විශ්ලේෂණ",
    buyerDashboard: "ගැණුම්කරු උපකරණ පුවරුව",
    marketplace: "වෙළඳසැල",
    agriNews: "ගොවි ප්‍රවෘත්ති"
  }
};

// Verify Email Page Component
const VerifyEmailPage = () => {
  const [lang] = useState('en');
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-green-900 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center text-white animate-in fade-in zoom-in duration-1000">
        <Leaf className="h-16 w-16 text-green-300 mx-auto mb-2" />
        <h1 className="text-4xl font-black tracking-tighter">GOVI ISURU</h1>
      </div>
      <VerifyEmail 
        switchToLogin={() => navigate('/')}
        lang={lang} 
      />
    </div>
  );
};

// Reset Password Page Component
const ResetPasswordPage = () => {
  const [lang] = useState('en');
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-green-900 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center text-white animate-in fade-in zoom-in duration-1000">
        <Leaf className="h-16 w-16 text-green-300 mx-auto mb-2" />
        <h1 className="text-4xl font-black tracking-tighter">GOVI ISURU</h1>
      </div>
      <ResetPassword 
        switchToLogin={() => navigate('/')}
        lang={lang} 
      />
    </div>
  );
};

// Main App Component
function MainApp() {
  const navigate = useNavigate();
  // 1. ALL HOOKS AT THE VERY TOP (Crucial for React Rules)
  const [view, setView] = useState('home'); 
  const [lang, setLang] = useState('en');
  const [coords, setCoords] = useState({ lat: 8.3114, lon: 80.4037 }); // Default to Anuradhapura
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  const t = translations[lang];

  useEffect(() => {
    // Use browser geolocation only when no user is logged in; otherwise use GN/district coords
    if (user) return;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({ lat: position.coords.latitude, lon: position.coords.longitude });
        },
        (error) => console.error("Location error:", error.message)
      );
    }
  }, [user]);

  // Map logged-in user's GN division or district to coordinates for weather (case-insensitive)
  const resolveUserCoords = (usr) => {
    if (!usr?.district) return null;

    const norm = (v) => (v || '').toString().trim().toLowerCase();
    const userDistrict = norm(usr.district);
    const userGN = norm(usr.gnDivision);

    // Find matching district (case-insensitive)
    const districtKey = Object.keys(districtCoordinates).find(
      (d) => norm(d) === userDistrict
    );
    if (!districtKey) return null;

    const district = districtCoordinates[districtKey];

    // Try GN match first (case-insensitive)
    if (userGN && district.gnDivisions) {
      const gnKey = Object.keys(district.gnDivisions).find(
        (g) => norm(g) === userGN
      );
      if (gnKey) {
        const gn = district.gnDivisions[gnKey];
        return { lat: gn.lat, lon: gn.lng };
      }
    }

    // Fallback to district center
    return district.center ? { lat: district.center.lat, lon: district.center.lng } : null;
  };

  useEffect(() => {
    const resolved = resolveUserCoords(user);
    if (resolved) setCoords(resolved);
  }, [user]);

  // Set initial view based on user role (for localStorage-loaded users or on user state change)
  useEffect(() => {
    // If user exists and view hasn't been set to a dashboard yet, set it based on role
    if (user && (view === 'home' || view === 'login' || view === 'register')) {
      let initialView = 'doctor';
      if (user?.role === 'officer') initialView = 'officerDashboard';
      else if (user?.role === 'buyer') initialView = 'buyerDashboard';
      setView(initialView);
    }
  }, [user]);

  // 2. HELPER FUNCTIONS
  const handleRegisterSuccess = (userData) => {
    setUser(userData);
    // Set initial view based on role
    let initialView = 'doctor';
    if (userData?.role === 'officer') initialView = 'officerDashboard';
    else if (userData?.role === 'buyer') initialView = 'buyerDashboard';
    setView(initialView);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.reload(); // Refresh to show Register screen
  };

  // 3. CONDITIONAL RENDER FOR REGISTRATION OR HOME PAGE
  if (!user) {
    // Show HomePage if no user is logged in and view is 'home'
    if (view === 'home') {
      return (
        <HomePage 
          onLogin={() => setView('login')} 
          onRegister={() => setView('register')}
        />
      );
    }
    
    // Show Login, Register, Forgot Password, etc.
    return (
      <div className="min-h-screen bg-green-900 flex flex-col items-center justify-center p-4">
        <div className="mb-8 text-center text-white animate-in fade-in zoom-in duration-1000">
          <Leaf className="h-16 w-16 text-green-300 mx-auto mb-2" />
          <h1 className="text-4xl font-black tracking-tighter">GOVI ISURU</h1>
        </div>
        
        {view === 'login' && (
          <Login 
            onLoginSuccess={handleRegisterSuccess} 
            switchToRegister={() => setView('register')}
            switchToForgotPassword={() => setView('forgotPassword')}
            lang={lang} 
          />
        )}
        
        {view === 'register' && (
          <Register 
            onRegisterSuccess={handleRegisterSuccess} 
            switchToLogin={() => setView('login')}
            lang={lang} 
          />
        )}
        
        {view === 'forgotPassword' && (
          <ForgotPassword 
            switchToLogin={() => setView('login')}
            lang={lang} 
          />
        )}
        
        {view === 'resetPassword' && (
          <ResetPassword 
            switchToLogin={() => setView('login')}
            lang={lang} 
          />
        )}
        
        {view === 'verifyEmail' && (
          <VerifyEmail 
            switchToLogin={() => setView('login')}
            lang={lang} 
          />
        )}
        
        {/* Back to Home button */}
        <button
          onClick={() => setView('home')}
          className="mt-6 text-white/80 hover:text-white text-sm font-medium transition-colors"
        >
          ← {lang === 'si' ? 'මුල් පිටුවට' : 'Back to Home'}
        </button>
      </div>
    );
  }

  // Navigation items config - role-based
  const getNavItems = () => {
    const isFarmer = !user?.role || user?.role === 'farmer';
    const isBuyer = user?.role === 'buyer';
    // Add profile tab for all users
    const profileTab = { id: 'profile', icon: Leaf, label: lang === 'si' ? 'පැතිකඩ' : 'Profile', emoji: '👤' };
    if (isFarmer) {
      // Farmer tabs
      return [
        { id: 'doctor', icon: LayoutDashboard, label: t.doctor, emoji: '🩺' },
        { id: 'yield', icon: BarChart3, label: t.yieldForecast, emoji: '🌾' },
        { id: 'trends', icon: TrendingUp, label: t.trends, emoji: '📈' },
        { id: 'market', icon: ShoppingBag, label: t.market, emoji: '🛒' },
        { id: 'weather', icon: CloudSun, label: t.weather, emoji: '🌤️' },
        { id: 'alerts', icon: AlertTriangle, label: t.alerts, emoji: '⚠️' },
        { id: 'news', icon: Newspaper, label: t.news, emoji: '📰' },
        { id: 'suitability', icon: Leaf, label: t.suitability, emoji: '🌱' },
        { id: 'riceVarieties', icon: BookOpen, label: t.riceVarieties, emoji: '🌾' },
        profileTab,
      ];
    } else if (isBuyer) {
      // Buyer tabs
      return [
        { id: 'buyerDashboard', icon: LayoutDashboard, label: t.buyerDashboard, emoji: '🛍️' },
        { id: 'marketplace', icon: ShoppingBag, label: t.marketplace, emoji: '🛒' },
        { id: 'news', icon: Newspaper, label: t.agriNews, emoji: '📰' },
        { id: 'riceVarieties', icon: BookOpen, label: t.riceVarieties, emoji: '🌾' },
        profileTab,
      ];
    } else {
      // Government Officer tabs
      return [
        { id: 'officerDashboard', icon: LayoutDashboard, label: 'Area Dashboard', emoji: '📊' },
        { id: 'diseaseAlerts', icon: AlertTriangle, label: t.diseaseAlerts, emoji: '⚠️' },
        { id: 'news', icon: Newspaper, label: t.news, emoji: '📰' },
        { id: 'riceVarieties', icon: BookOpen, label: t.riceVarieties, emoji: '🌾' },
        profileTab,
      ];
    }
  };

  const navItems = getNavItems();

  // 4. MAIN APP DASHBOARD
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50/30 font-sans flex flex-col md:flex-row">
      {/* Sidebar Navigation - Enhanced */}
      <nav className="w-full md:w-72 bg-gradient-to-b from-green-800 to-green-900 text-white shadow-2xl flex-shrink-0 flex flex-col">
        {/* Logo Header */}
        <div className="p-6 flex items-center gap-3 border-b border-green-700/50 bg-green-800/50">
          <div className="p-2 bg-green-600 rounded-xl shadow-lg">
            <Leaf className="h-8 w-8 text-green-200" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight leading-none block">{t.title}</span>
            <span className="text-xs text-green-300">Smart Farming Platform</span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-4 flex flex-col gap-1.5 flex-grow">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = view === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => setView(item.id)}
                className={`group flex items-center gap-3 w-full p-3.5 rounded-xl font-semibold transition-all duration-200 ${
                  isActive 
                    ? 'bg-white text-green-800 shadow-lg shadow-green-900/20 translate-x-1' 
                    : 'hover:bg-white/10 hover:translate-x-1'
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-green-100' : 'bg-green-700/50 group-hover:bg-green-600/50'}`}>
                  <Icon size={18} className={isActive ? 'text-green-700' : 'text-green-200'} />
                </div>
                <span className="flex-grow text-left">{item.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* User Info */}
        {user && (
          <div className="mx-4 mb-2 p-3 bg-green-700/30 rounded-xl border border-green-600/30">
            <p className="text-xs text-green-300 font-medium">
              {user?.role === 'officer' ? '🏛️ Government Officer' : '👨‍🌾 Farmer'}
            </p>
            <p className="text-sm font-bold text-white truncate">{user.username}</p>
            <p className="text-xs text-green-400 mt-0.5 truncate">
              {user?.role === 'officer' 
                ? `📋 ${user.officerId}` 
                : `📍 ${user.gnDivision}`}
            </p>
            {user?.role === 'officer' && user.department && (
              <p className="text-xs text-green-400 truncate">{user.department}</p>
            )}
          </div>
        )}

        {/* Bottom Actions */}
        <div className="p-4 border-t border-green-700/50 space-y-2">
          <button 
            onClick={() => setLang(lang === 'en' ? 'si' : 'en')}
            className="flex items-center gap-2 w-full p-3 rounded-xl font-semibold border border-green-600/50 hover:bg-green-700/50 hover:border-green-500 text-sm transition-all"
          >
            <Languages size={18} /> 
            <span>{lang === 'en' ? 'සිංහල' : 'English'}</span>
            <span className="ml-auto text-xs bg-green-700 px-2 py-0.5 rounded-full">{lang.toUpperCase()}</span>
          </button>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 w-full p-3 rounded-xl font-semibold text-red-300 hover:bg-red-500/20 hover:text-red-200 text-sm transition-all"
          >
            <LogOut size={18} /> {t.logout}
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gradient-to-br from-slate-50 via-white to-green-50/20">
        <div className="max-w-5xl mx-auto">
          {/* Welcome Header - Enhanced */}
          <div className="mb-6 p-5 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <p className="text-slate-500 text-sm">
                {lang === 'si' ? 'ආයුබෝවන්' : 'Welcome back'},
              </p>
              <p className="text-xl font-bold text-slate-800">{user.username}</p>
              {user?.role === 'officer' && (
                <p className="text-xs text-slate-500 mt-1">
                  {lang === 'si' ? '🏛️ ගෙවැ‍ර්නන්ට නිලධාරී' : '🏛️ Government Officer'} 
                  {user.district && ` • ${user.district}`}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {user?.role === 'officer' ? (
                <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-semibold flex items-center gap-1">
                  📍 {user.district}
                </span>
              ) : (
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-semibold flex items-center gap-1">
                  📍 {user.gnDivision}
                </span>
              )}
              <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full font-medium">
                {new Date().toLocaleDateString(lang === 'si' ? 'si-LK' : 'en-LK', { weekday: 'short', day: 'numeric', month: 'short' })}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {/* Farmer Views */}
            {(!user?.role || user?.role === 'farmer') && (
              <>
                {view === 'doctor' && <AIDoctor lang={lang} user={user} />}
                {view === 'market' && <Marketplace lang={lang} currentUser={user} />}
                {view === 'weather' && <WeatherAdvisor lang={lang} lat={coords.lat} lon={coords.lon} />}
                {view === 'trends' && <MarketTrends lang={lang} />}
                {view === 'alerts' && <AlertsDashboard user={user} language={lang} />}
                {view === 'news' && <AgriNews lang={lang} user={user} />}
                {view === 'yield' && <YieldPrediction lang={lang} />}
                {view === 'suitability' && <CropSuitability lang={lang} user={user} coords={coords} />}
                {view === 'riceVarieties' && <TraditionalRice lang={lang} />}
                {view === 'profile' && <UserProfile />}
              </>
            )}

            {/* Buyer Views */}
            {user?.role === 'buyer' && (
              <>
                {view === 'buyerDashboard' && <BuyerDashboard user={user} language={lang} onNavigate={setView} />}
                {view === 'marketplace' && <Marketplace lang={lang} currentUser={user} />}
                {view === 'news' && <AgriNews lang={lang} user={user} />}
                {view === 'riceVarieties' && <TraditionalRice lang={lang} />}
                {view === 'profile' && <UserProfile />}
              </>
            )}

            {/* Officer Views */}
            {user?.role === 'officer' && (
              <>
                {view === 'officerDashboard' && <OfficerDashboard user={user} language={lang} />}
                {view === 'diseaseAlerts' && <AlertsDashboard user={user} language={lang} isOfficer={true} />}
                {view === 'areaAnalytics' && <OfficerDashboard user={user} language={lang} initialTab="analytics" />}
                {view === 'news' && <AgriNews lang={lang} user={user} />}
                {view === 'riceVarieties' && <TraditionalRice lang={lang} />}
                {view === 'profile' && <UserProfile />}
              </>
            )}
          </div>
        </div>

        <footer className="text-center text-slate-400 text-xs py-10 mt-8 border-t border-slate-100">
          <p>© 2025 <span className="font-semibold text-green-600">{t.title}</span> — {t.footer}</p>
        </footer>
      </main>

      {/* Llama 3.1 AI Chatbot - Available on all pages */}
      <LlamaChatbot lang={lang} />
    </div>
  );
}

// Main App Export with Router
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Special auth routes that need URL parameters */}
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        {/* Main app route */}
        <Route path="/*" element={<MainApp />} />
      </Routes>
    </BrowserRouter>
  );
}