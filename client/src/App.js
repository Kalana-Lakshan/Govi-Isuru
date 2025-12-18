import React, { useState, useEffect } from 'react';
import { Leaf, ShoppingBag, Languages, LayoutDashboard, CloudSun, TrendingUp, LogOut } from 'lucide-react';
import AIDoctor from './components/AIDoctor';
import Marketplace from './components/Marketplace';
import WeatherAdvisor from './components/WeatherAdvisor';
import MarketTrends from './components/MarketTrends';
import Register from './components/Register';
import Login from './components/Login';

const translations = {
  en: { 
    title: "Govi Isuru", 
    doctor: "AI Doctor", 
    market: "Marketplace", 
    trends: "Market Trends",
    weather: "Weather Advisory", 
    logout: "Logout",
    footer: "Empowering Sri Lankan Farmers" 
  },
  si: { 
    title: "ගොවි ඉසුරු", 
    doctor: "AI වෛද්‍යවරයා", 
    market: "අලෙවිසැල", 
    trends: "මිල ප්‍රවණතා", 
    weather: "කාලගුණ උපදෙස්", 
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

  // 4. MAIN APP DASHBOARD
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-64 bg-green-800 text-white shadow-2xl flex-shrink-0 flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-green-700">
          <Leaf className="h-10 w-10 text-green-300" />
          <span className="text-2xl font-black tracking-tight leading-none">{t.title}</span>
        </div>

        <div className="p-4 flex flex-col gap-2 flex-grow">
          <button 
            onClick={() => setView('doctor')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold transition-all ${view === 'doctor' ? 'bg-white text-green-800 shadow-lg' : 'hover:bg-green-700'}`}
          >
            <LayoutDashboard size={20} /> {t.doctor}
          </button>

          <button 
            onClick={() => setView('trends')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold transition-all ${view === 'trends' ? 'bg-white text-green-800 shadow-lg' : 'hover:bg-green-700'}`}
          >
            <TrendingUp size={20} /> {t.trends}
          </button>
          
          <button 
            onClick={() => setView('market')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold transition-all ${view === 'market' ? 'bg-white text-green-800 shadow-lg' : 'hover:bg-green-700'}`}
          >
            <ShoppingBag size={20} /> {t.market}
          </button>

          <button 
            onClick={() => setView('weather')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold transition-all ${view === 'weather' ? 'bg-white text-green-800 shadow-lg' : 'hover:bg-green-700'}`}
          >
            <CloudSun size={20} /> {t.weather}
          </button>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-green-700 space-y-2">
          <button 
            onClick={() => setLang(lang === 'en' ? 'si' : 'en')}
            className="flex items-center gap-2 w-full p-3 rounded-xl font-bold border border-green-500 hover:bg-green-700 text-xs"
          >
            <Languages size={16} /> {lang === 'en' ? 'සිංහල' : 'English'}
          </button>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 w-full p-3 rounded-xl font-bold text-red-300 hover:bg-red-900/30 text-xs"
          >
            <LogOut size={16} /> {t.logout}
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Welcome Tag */}
          <div className="mb-6 p-4 bg-white rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center">
            <p className="text-slate-600 font-medium">
              {lang === 'si' ? 'ආයුබෝවන්' : 'Welcome back'}, <span className="text-green-700 font-bold">{user.username}</span>
            </p>
            <span className="text-xs bg-slate-100 px-3 py-1 rounded-full text-slate-500 font-bold uppercase tracking-wider">
              {user.gnDivision}
            </span>
          </div>

          <div className="space-y-6">
            {view === 'doctor' && <AIDoctor lang={lang} />}
            {view === 'market' && <Marketplace lang={lang} />}
            {view === 'weather' && <WeatherAdvisor lang={lang} lat={coords.lat} lon={coords.lon} />}
            {view === 'trends' && <MarketTrends lang={lang} />}
          </div>
        </div>

        <footer className="text-center text-gray-400 text-xs py-10">
          © 2025 {t.title} — {t.footer}
        </footer>
      </main>
    </div>
  );
}