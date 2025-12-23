import React, { useState, useEffect } from 'react';
import { Leaf, ShoppingBag, Languages, LayoutDashboard, CloudSun, TrendingUp, LogOut, AlertTriangle, Newspaper, BarChart3 } from 'lucide-react';
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
    logout: "Logout",
    footer: "Empowering Sri Lankan Farmers" 
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
    logout: "පද්ධතියෙන් ඉවත් වන්න",
    footer: "ශ්‍රී ලාංකීය ගොවීන් සවිබල ගැන්වීම" 
  }
};

export default function App() {
  // 1. ALL HOOKS AT THE VERY TOP (Crucial for React Rules)
  const [view, setView] = useState('doctor'); 
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

  // 2. HELPER FUNCTIONS
  const handleRegisterSuccess = (userData) => {
    setUser(userData);
    setView('doctor');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.reload(); // Refresh to show Register screen
  };

  // 3. CONDITIONAL RENDER FOR REGISTRATION
  if (!user) {
  return (
    <div className="min-h-screen bg-green-900 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center text-white animate-in fade-in zoom-in duration-1000">
         <Leaf className="h-16 w-16 text-green-300 mx-auto mb-2" />
         <h1 className="text-4xl font-black tracking-tighter">GOVI ISURU</h1>
      </div>
      
      {authMode === 'login' ? (
        <Login 
          onLoginSuccess={handleRegisterSuccess} 
          switchToRegister={() => setAuthMode('register')} 
          lang={lang} 
        />
      ) : (
        <Register 
          onRegisterSuccess={handleRegisterSuccess} 
          switchToLogin={() => setAuthMode('login')} // Pass this prop to Register
          lang={lang} 
        />
      )}
    </div>
  );
}

  // Navigation items config
  const navItems = [
    { id: 'doctor', icon: LayoutDashboard, label: t.doctor, emoji: '🩺' },
    { id: 'yield', icon: BarChart3, label: t.yieldForecast, emoji: '🌾' },
    { id: 'trends', icon: TrendingUp, label: t.trends, emoji: '📈' },
    { id: 'market', icon: ShoppingBag, label: t.market, emoji: '🛒' },
    { id: 'weather', icon: CloudSun, label: t.weather, emoji: '🌤️' },
    { id: 'alerts', icon: AlertTriangle, label: t.alerts, emoji: '⚠️' },
    { id: 'news', icon: Newspaper, label: t.news, emoji: '📰' },
  ];

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
            <p className="text-xs text-green-300 font-medium">Logged in as</p>
            <p className="text-sm font-bold text-white truncate">{user.username}</p>
            <p className="text-xs text-green-400 mt-0.5 truncate">📍 {user.gnDivision}</p>
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
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-semibold flex items-center gap-1">
                📍 {user.gnDivision}
              </span>
              <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full font-medium">
                {new Date().toLocaleDateString(lang === 'si' ? 'si-LK' : 'en-LK', { weekday: 'short', day: 'numeric', month: 'short' })}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {/* Show Community Alerts on AI Doctor view */}
            {view === 'doctor' && <CommunityAlerts user={user} language={lang} />}
            {view === 'doctor' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <AIDoctor lang={lang} user={user} />
                </div>
                <div className="lg:col-span-1">
                  <NewsWidget lang={lang} onViewAll={() => setView('news')} maxItems={4} />
                </div>
              </div>
            )}
            {view === 'market' && <Marketplace lang={lang} currentUser={user} />}
            {view === 'weather' && <WeatherAdvisor lang={lang} lat={coords.lat} lon={coords.lon} />}
            {view === 'trends' && <MarketTrends lang={lang} />}
            {view === 'alerts' && <AlertsDashboard user={user} language={lang} />}
            {view === 'news' && <AgriNews lang={lang} user={user} />}
            {view === 'yield' && <YieldPrediction lang={lang} />}
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