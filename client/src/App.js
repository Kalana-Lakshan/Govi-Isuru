import React, { useState, useEffect } from 'react';
import { Leaf, ShoppingBag, Languages, LayoutDashboard, CloudSun, TrendingUp, LogOut, AlertTriangle, Newspaper, BarChart3 } from 'lucide-react';
import CropSuitability from './components/CropSuitability';
import AIDoctor from './components/AIDoctor';
import Marketplace from './components/Marketplace';
import WeatherAdvisor from './components/WeatherAdvisor';
import MarketTrends from './components/MarketTrends';
import Register from './components/Register';
import Login from './components/Login';
import CropChatbot from './components/CropChatbot';
import CommunityAlerts from './components/CommunityAlerts';
import AlertsDashboard from './components/AlertsDashboard';
import AgriNews from './components/AgriNews';
import NewsWidget from './components/NewsWidget';
import YieldPrediction from './components/YieldPrediction';
import HomePage from './components/HomePage';
import OfficerDashboard from './components/OfficerDashboard';

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
    logout: "Logout",
    footer: "Empowering Sri Lankan Farmers",
    // Officer-specific translations
    diseaseAlerts: "Disease Alerts",
    areaReports: "Area Reports",
    outbreak: "Outbreak Management",
    areaAnalytics: "Area Analytics"
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
    logout: "පද්ධතියෙන් ඉවත් වන්න",
    footer: "ශ්‍රී ලාංකීය ගොවීන් සවිබල ගැන්වීම",
    // Officer-specific translations
    diseaseAlerts: "රෝග අනතුරු ඇඟවීම්",
    areaReports: "ප්‍රදේශ වාර්තා",
    outbreak: "පිපිරීම් කළමනාකරණ",
    areaAnalytics: "ප්‍රදේශ විශ්ලේෂණ"
  }
};

export default function App() {
  // 1. ALL HOOKS AT THE VERY TOP (Crucial for React Rules)
  const [view, setView] = useState('home'); 
  const [lang, setLang] = useState('en');
  const [coords, setCoords] = useState({ lat: 8.3114, lon: 80.4037 }); // Default to Anuradhapura
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  const t = translations[lang];

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({ lat: position.coords.latitude, lon: position.coords.longitude });
        },
        (error) => console.error("Location error:", error.message)
      );
    }
  }, []);

  // Set initial view based on user role (for localStorage-loaded users or on user state change)
  useEffect(() => {
    // If user exists and view hasn't been set to a dashboard yet, set it based on role
    if (user && (view === 'home' || view === 'login' || view === 'register')) {
      const initialView = user?.role === 'officer' ? 'officerDashboard' : 'doctor';
      setView(initialView);
    }
  }, [user]);

  // 2. HELPER FUNCTIONS
  const handleRegisterSuccess = (userData) => {
    setUser(userData);
    // Set initial view based on role
    const initialView = userData?.role === 'officer' ? 'officerDashboard' : 'doctor';
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
    
    // Show Login or Register
    return (
      <div className="min-h-screen bg-green-900 flex flex-col items-center justify-center p-4">
        <div className="mb-8 text-center text-white animate-in fade-in zoom-in duration-1000">
          <Leaf className="h-16 w-16 text-green-300 mx-auto mb-2" />
          <h1 className="text-4xl font-black tracking-tighter">GOVI ISURU</h1>
        </div>
        
        {view === 'login' ? (
          <Login 
            onLoginSuccess={handleRegisterSuccess} 
            switchToRegister={() => setView('register')} 
            lang={lang} 
          />
        ) : (
          <Register 
            onRegisterSuccess={handleRegisterSuccess} 
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
      ];
    } else {
      // Government Officer tabs
      return [
        { id: 'officerDashboard', icon: LayoutDashboard, label: 'Area Dashboard', emoji: '📊' },
        { id: 'diseaseAlerts', icon: AlertTriangle, label: t.diseaseAlerts, emoji: '⚠️' },
        { id: 'areaReports', icon: TrendingUp, label: t.areaReports, emoji: '📋' },
        { id: 'areaAnalytics', icon: BarChart3, label: t.areaAnalytics, emoji: '📈' },
        { id: 'news', icon: Newspaper, label: t.news, emoji: '📰' },
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
              </>
            )}

            {/* Officer Views */}
            {user?.role === 'officer' && (
              <>
                {view === 'officerDashboard' && <OfficerDashboard user={user} language={lang} />}
                {view === 'diseaseAlerts' && <AlertsDashboard user={user} language={lang} isOfficer={true} />}
                {view === 'areaReports' && <AreaReportsView user={user} language={lang} />}
                {view === 'areaAnalytics' && <AreaAnalyticsView user={user} language={lang} />}
                {view === 'news' && <AgriNews lang={lang} user={user} />}
              </>
            )}
          </div>
        </div>

        <footer className="text-center text-slate-400 text-xs py-10 mt-8 border-t border-slate-100">
          <p>© 2025 <span className="font-semibold text-green-600">{t.title}</span> — {t.footer}</p>
        </footer>
      </main>

      {/* Floating Chatbot - Available on all pages */}
      <CropChatbot lang={lang} />
    </div>
  );
}

// Placeholder components for officer views
const AreaReportsView = ({ user, language }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
    <h2 className="text-2xl font-bold text-slate-800 mb-4">
      {language === 'si' ? 'ප්‍රදේශ වාර්තා' : 'Area Disease Reports'}
    </h2>
    <p className="text-slate-600 mb-4">
      {language === 'si' 
        ? `${user.district} දිස්ත්‍රික්කයේ සম්‍යුත් රෝග වාර්තා සහ ප්‍රජා දැනුම්දීම්`
        : `Consolidated disease reports and community alerts for ${user.district} district`}
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-4 bg-red-50 rounded-xl border border-red-200">
        <p className="text-xs text-red-600 font-semibold mb-2">{language === 'si' ? 'උচ්च ঝুම්බුවක් ඇති ප්‍රදේශ' : 'High-Risk Areas'}</p>
        <p className="text-lg font-bold text-red-700">5 reports</p>
      </div>
      <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
        <p className="text-xs text-yellow-600 font-semibold mb-2">{language === 'si' ? 'මධ්‍යම ঝුම්බුවක් ඇති ප්‍රදේศ' : 'Medium-Risk Areas'}</p>
        <p className="text-lg font-bold text-yellow-700">12 reports</p>
      </div>
    </div>
  </div>
);

const AreaAnalyticsView = ({ user, language }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
    <h2 className="text-2xl font-bold text-slate-800 mb-4">
      {language === 'si' ? 'ප්‍රදේශ විශ්ලේෂණ' : 'Area Analytics'}
    </h2>
    <p className="text-slate-600 mb-4">
      {language === 'si'
        ? `${user.district} දිස්ත්‍රික්කයේ රෝග ව්‍යාප්තිය සහ සංවර්ධන ප්‍රවණතා`
        : `Disease prevalence and trend analysis for ${user.district} district`}
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
        <p className="text-xs text-blue-600 font-semibold mb-2">{language === 'si' ? 'කෙටි කාලීන' : 'Past 7 Days'}</p>
        <p className="text-2xl font-bold text-blue-700">↑ 23%</p>
      </div>
      <div className="p-4 bg-green-50 rounded-xl border border-green-200">
        <p className="text-xs text-green-600 font-semibold mb-2">{language === 'si' ? 'මාසික' : 'Monthly'}</p>
        <p className="text-2xl font-bold text-green-700">↓ 12%</p>
      </div>
      <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
        <p className="text-xs text-purple-600 font-semibold mb-2">{language === 'si' ? 'නිවේදිත රෝග' : 'Reported Diseases'}</p>
        <p className="text-2xl font-bold text-purple-700">8</p>
      </div>
    </div>
  </div>
);