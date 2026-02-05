import React, { useState, useEffect } from 'react';
import { Leaf, ShoppingBag, Languages, LayoutDashboard, CloudSun, TrendingUp, LogOut, AlertTriangle, Newspaper, BarChart3, BookOpen, X } from 'lucide-react';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{
        backgroundImage: 'url(/backgrounds/farming-training.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        {/* Dark overlay */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 0
        }} />
        <div className="mb-8 text-center text-white animate-in fade-in zoom-in duration-1000" style={{ position: 'relative', zIndex: 1 }}>
          <Leaf className="h-16 w-16 text-green-300 mx-auto mb-2" />
          <h1 className="text-4xl font-black tracking-tighter">GOVI ISURU</h1>
        </div>
        
        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '480px' }}>
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
        </div>
        
        {/* Back to Home button */}
        <button
          onClick={() => setView('home')}
          className="mt-6 text-white/80 hover:text-white text-sm font-medium transition-colors"
          style={{ position: 'relative', zIndex: 1 }}
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

  // Get background image based on user role
  const getBackgroundImage = () => {
    if (user?.role === 'officer') {
      return '/backgrounds/rice-fields-sunrise.jpg';
    } else if (user?.role === 'buyer') {
      return '/backgrounds/village-community.jpg';
    } else {
      // Farmer or no specific role
      return '/backgrounds/harvest-sunset.jpg';
    }
  };

  // 4. MAIN APP DASHBOARD
  return (
    <div className="min-h-screen font-sans flex flex-col md:flex-row" style={{
      backgroundImage: `url(${getBackgroundImage()})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      {/* Dark overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(255, 255, 255, 0.15)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <button
          aria-label="Close menu"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        />
      )}

      {/* Sidebar Navigation - Mobile Optimized */}
      <nav
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 md:w-80 max-w-[90%] md:max-w-none bg-gradient-to-b from-green-800 to-green-900 text-white shadow-2xl flex-shrink-0 flex flex-col transform transition-transform duration-300 ease-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{ position: 'relative' }}
      >
        {/* Logo Header */}
        <div className="sticky top-0 z-10 p-4 md:p-6 flex items-center gap-2 md:gap-3 border-b border-green-700/50 bg-green-800/95 backdrop-blur-sm">
          <div className="p-1.5 md:p-2 bg-green-600 rounded-lg md:rounded-xl shadow-lg">
            <Leaf className="h-5 w-5 md:h-8 md:w-8 text-green-200" />
          </div>
          <div className="flex-1">
            <span className="text-lg md:text-2xl font-black tracking-tight leading-tight block">{t.title}</span>
            <span className="text-[10px] md:text-xs text-green-300">Smart Farming</span>
          </div>
          <button
            className="md:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items - Scrollable */}
        <div className="flex-1 overflow-y-auto p-2 md:p-4 flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = view === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => {
                  setView(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`group flex items-center gap-2 md:gap-3 w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl font-semibold text-sm md:text-base transition-all duration-200 active:scale-95 ${
                  isActive 
                    ? 'bg-white text-green-800 shadow-lg' 
                    : 'text-green-100 hover:bg-white/10'
                }`}
              >
                <div className={`p-1 md:p-1.5 rounded-lg transition-colors flex-shrink-0 ${isActive ? 'bg-green-100' : 'bg-green-700/50'}`}>
                  <Icon size={18} className={isActive ? 'text-green-700' : 'text-green-200'} />
                </div>
                <span className="flex-grow text-left truncate">{item.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse flex-shrink-0"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* User Info Card */}
        {user && (
          <div className="mx-2 md:mx-4 mb-2 p-3 bg-green-700/40 backdrop-blur-sm rounded-lg md:rounded-xl border border-green-600/30">
            <p className="text-[10px] md:text-xs text-green-300 font-medium">
              {user?.role === 'officer' ? '🏛️ Officer' : '👨‍🌾 Farmer'}
            </p>
            <p className="text-xs md:text-sm font-bold text-white truncate mt-0.5">{user.username}</p>
            <p className="text-[10px] md:text-xs text-green-400 mt-1 truncate">
              {user?.role === 'officer' 
                ? `📋 ${user.officerId || user.district}` 
                : `📍 ${user.gnDivision}`}
            </p>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="p-2 md:p-4 border-t border-green-700/50 space-y-1.5 md:space-y-2">
          <button 
            onClick={() => setLang(lang === 'en' ? 'si' : 'en')}
            className="flex items-center gap-2 md:gap-3 w-full px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl font-semibold border border-green-600/50 hover:bg-green-700/50 hover:border-green-500 text-xs md:text-sm text-green-100 transition-all active:scale-95"
          >
            <Languages size={16} className="md:w-[18px] md:h-[18px]" />
            <span>{lang === 'en' ? 'සිංහල' : 'English'}</span>
            <span className="ml-auto text-[9px] md:text-xs bg-green-700 px-1.5 md:px-2 py-0.5 rounded-full font-bold">{lang === 'en' ? 'EN' : 'SI'}</span>
          </button>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 md:gap-3 w-full px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl font-semibold text-red-300 hover:bg-red-500/20 hover:text-red-200 text-xs md:text-sm transition-all active:scale-95"
          >
            <LogOut size={16} className="md:w-[18px] md:h-[18px]" /> {t.logout}
          </button>
        </div>
      </nav>

      {/* Main Content Area - Mobile Optimized */}
      <main className="flex-1 overflow-y-auto" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', position: 'relative', zIndex: 1 }}>
        <div className="w-full h-full flex flex-col">
          {/* Mobile Top Bar - Sticky */}
          <div className="md:hidden sticky top-0 z-20 bg-white/95 backdrop-blur-sm shadow-sm">
            <div className="flex items-center justify-between p-3 md:p-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-green-600 rounded-lg shadow-sm">
                  <Leaf className="h-4 w-4 md:h-5 md:w-5 text-green-200" />
                </div>
                <span className="text-base md:text-lg font-bold text-green-900">{t.title}</span>
              </div>
              <button
                className="p-2 rounded-lg bg-green-50 hover:bg-green-100 transition-colors border border-slate-200 active:scale-95"
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Open menu"
              >
                <LayoutDashboard size={18} className="text-green-700" />
              </button>
            </div>
          </div>

          {/* Content Wrapper */}
          <div className="flex-1 overflow-y-auto px-3 md:px-8 py-4 md:py-8">
            <div className="max-w-5xl mx-auto">
              {/* Welcome Header - Mobile Responsive */}
              <div className="mb-4 md:mb-6 p-3 md:p-5 bg-white rounded-lg md:rounded-2xl shadow-sm border border-slate-100 space-y-3 md:space-y-0">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                  <div className="flex-1">
                    <p className="text-xs md:text-sm text-slate-500">
                      {lang === 'si' ? 'ආයුබෝවන්' : 'Welcome back'},
                    </p>
                    <p className="text-lg md:text-xl font-bold text-slate-800 truncate">{user.username}</p>
                    {user?.role === 'officer' && (
                      <p className="text-[10px] md:text-xs text-slate-500 mt-0.5 md:mt-1">
                        🏛️ {lang === 'si' ? 'ගෙවැ‍ර්නන්ට නිලධාරී' : 'Government Officer'}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {user?.role === 'officer' ? (
                      <span className="text-[10px] md:text-xs bg-blue-100 text-blue-700 px-2 md:px-3 py-1 md:py-1.5 rounded-full font-semibold whitespace-nowrap">
                        📍 {user.district}
                      </span>
                    ) : (
                      <span className="text-[10px] md:text-xs bg-green-100 text-green-700 px-2 md:px-3 py-1 md:py-1.5 rounded-full font-semibold whitespace-nowrap truncate">
                        📍 {user.gnDivision}
                      </span>
                    )}
                    <span className="text-[10px] md:text-xs bg-slate-100 text-slate-500 px-2 md:px-3 py-1 md:py-1.5 rounded-full font-medium whitespace-nowrap">
                      {new Date().toLocaleDateString(lang === 'si' ? 'si-LK' : 'en-LK', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="space-y-4 md:space-y-6">
                {/* Farmer Views */}
                {(!user?.role || user?.role === 'farmer') && (
                  <>
                    {view === 'doctor' && <AIDoctor lang={lang} user={user} />}
                    {view === 'market' && <Marketplace lang={lang} currentUser={user} />}
                    {view === 'weather' && <WeatherAdvisor lang={lang} lat={coords.lat} lon={coords.lon} user={user} />}
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

              {/* Footer */}
              <footer className="text-center text-slate-400 text-[10px] md:text-xs py-6 md:py-10 mt-6 md:mt-8 border-t border-slate-100">
                <p>© 2025 <span className="font-semibold text-green-600">{t.title}</span> — {t.footer}</p>
              </footer>
            </div>
          </div>
        </div>
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