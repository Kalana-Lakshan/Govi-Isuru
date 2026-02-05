import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Leaf, 
  ArrowRight, 
  Sparkles, 
  Shield, 
  TrendingUp, 
  CloudSun, 
  AlertTriangle, 
  ShoppingBag, 
  MessageSquare, 
  BarChart3,
  Zap,
  Users,
  Globe,
  CheckCircle,
  Star,
  Newspaper,
  ExternalLink,
  Clock,
  ChevronRight,
  Play
} from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const HomePage = ({ onLogin, onRegister }) => {
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [lang, setLang] = useState('en');

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchLatestNews();
  }, []);

  const fetchLatestNews = async () => {
    try {
      const response = await axios.get(`${API_BASE}/news/agriculture`);
      setNews(response.data.articles.slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoadingNews(false);
    }
  };

  const translations = {
    en: {
      hero: {
        badge: "AI-Powered Smart Farming",
        title: "Empowering Sri Lankan Farmers",
        subtitle: "Transform your farming with AI disease detection, real-time market insights, and community support",
        cta1: "Get Started Free",
        cta2: "Learn More",
        stats: [
          { value: "8+", label: "Crop Diseases Detected" },
          { value: "25", label: "Districts Covered" }
        ]
      },
      nav: {
        login: "Login",
        register: "Register"
      },
      features: {
        title: "Powerful Features for Modern Farmers",
        subtitle: "Everything you need to maximize your agricultural success",
        items: [
          {
            icon: Sparkles,
            title: "AI Crop Doctor",
            description: "Upload crop photos for instant disease detection with 80% accuracy using advanced deep learning",
            color: "emerald"
          },
          {
            icon: BarChart3,
            title: "Yield Prediction",
            description: "Forecast paddy yields and calculate profitability for any district and season",
            color: "blue"
          },
          {
            icon: TrendingUp,
            title: "Market Intelligence",
            description: "Real-time crop prices across major markets with 6-month trend analysis",
            color: "purple"
          },
          {
            icon: ShoppingBag,
            title: "AgroLink Marketplace",
            description: "Connect directly with buyers through our peer-to-peer trading platform with reputation system",
            color: "orange"
          },
          {
            icon: CloudSun,
            title: "Weather Advisory",
            description: "5-day forecasts with agricultural recommendations for optimal farming decisions",
            color: "cyan"
          },
          {
            icon: AlertTriangle,
            title: "Disease Alerts",
            description: "Location-based community alerts for disease outbreaks in your GN Division",
            color: "red"
          },
          {
            icon: MessageSquare,
            title: "AI Crop Chatbot",
            description: "24/7 farming assistant with voice input and in-chat image diagnosis",
            color: "indigo"
          },
          {
            icon: Leaf,
            title: "Crop Suitability",
            description: "ML-powered recommendations for best crops based on soil, climate, and location",
            color: "green"
          }
        ]
      },
      news: {
        title: "Latest Agricultural News",
        subtitle: "Stay informed with real-time updates",
        readMore: "Read Full Article",
        viewAll: "View All News"
      },
      benefits: {
        title: "Why Farmers Choose Govi Isuru",
        items: [
          { icon: Zap, text: "Instant AI-powered disease diagnosis in seconds" },
          { icon: Shield, text: "100% Free for all Sri Lankan farmers" },
          { icon: Users, text: "Thriving community with reputation system" },
          { icon: Globe, text: "Full Sinhala & English bilingual support" }
        ]
      },
      cta: {
        title: "Ready to Transform Your Farming?",
        subtitle: "Join thousands of Sri Lankan farmers using AI technology",
        button: "Create Free Account"
      },
      footer: {
        tagline: "Empowering Sri Lankan Farmers with Technology",
        copyright: "© 2025 Govi Isuru. Built with ❤️ for Sri Lankan Agriculture"
      }
    },
    si: {
      hero: {
        badge: "AI බලයෙන් යුත් ස්මාර්ට් ගොවිතැන",
        title: "ශ්‍රී ලාංකීය ගොවීන් සවිබල ගැන්වීම",
        subtitle: "AI රෝග හඳුනාගැනීම, තත්‍ය කාලීන වෙළඳපල තොරතුරු සහ ප්‍රජා සහයෝගය සමඟ ඔබේ ගොවිතැන වෙනස් කරන්න",
        cta1: "නොමිලේ ආරම්භ කරන්න",
        cta2: "තව දැනගන්න",
        stats: [
          { value: "8+", label: "බෝග රෝග හඳුනාගනී" },
          { value: "25", label: "දිස්ත්‍රික්ක ආවරණය" }
        ]
      },
      nav: {
        login: "පිවිසෙන්න",
        register: "ලියාපදිංචි වන්න"
      },
      features: {
        title: "නවීන ගොවීන් සඳහා බලගතු විශේෂාංග",
        subtitle: "ඔබේ කෘෂිකාර්මික සාර්ථකත්වය උපරිම කිරීමට අවශ්‍ය සියල්ල",
        items: [
          {
            icon: Sparkles,
            title: "AI බෝග වෛද්‍යවරයා",
            description: "උසස් ගැඹුරු ඉගෙනීම භාවිතයෙන් 94% නිරවද්‍යතාවයකින් ක්ෂණික රෝග හඳුනාගැනීම",
            color: "emerald"
          },
          {
            icon: BarChart3,
            title: "අස්වැන්න අනාවැකි",
            description: "ඕනෑම දිස්ත්‍රික්කයක් සහ කන්නයක් සඳහා වී අස්වැන්න සහ ලාභදායිතාව අනාවැකි කියන්න",
            color: "blue"
          },
          {
            icon: TrendingUp,
            title: "වෙළඳපල බුද්ධිය",
            description: "මාස 6 ක ප්‍රවණතා විශ්ලේෂණය සමඟ ප්‍රධාන වෙලඳපොලවල තත්‍ය කාලීන බෝග මිල",
            color: "purple"
          },
          {
            icon: ShoppingBag,
            title: "AgroLink වෙළඳපොල",
            description: "කීර්ති නාම පද්ධතිය සහිත peer-to-peer වෙළඳ වේදිකාව හරහා ගැනුම්කරුවන් සමඟ සෘජුවම සම්බන්ධ වන්න",
            color: "orange"
          },
          {
            icon: CloudSun,
            title: "කාලගුණ උපදේශනය",
            description: "ප්‍රශස්ත ගොවිතැන් තීරණ සඳහා කෘෂිකාර්මික නිර්දේශ සහිත දින 5 ක අනාවැකි",
            color: "cyan"
          },
          {
            icon: AlertTriangle,
            title: "රෝග අනතුරු ඇඟවීම්",
            description: "ඔබේ ග්‍රාම නිලධාරී කොට්ඨාසයේ රෝග පැතිරීම් සඳහා ස්ථාන පදනම් වූ ප්‍රජා අනතුරු ඇඟවීම්",
            color: "red"
          },
          {
            icon: MessageSquare,
            title: "AI බෝග චැට්බොට්",
            description: "හඬ ආදානය සහ චැට් තුළ රූප විනිශ්චය සහිත 24/7 ගොවිතැන් සහායක",
            color: "indigo"
          },
          {
            icon: Leaf,
            title: "බෝග සුදුසුකම",
            description: "පස, දේශගුණය සහ ස්ථානය මත පදනම්ව හොඳම බෝග සඳහා ML බලයෙන් යුත් නිර්දේශ",
            color: "green"
          }
        ]
      },
      news: {
        title: "නවතම කෘෂිකාර්මික පුවත්",
        subtitle: "තත්‍ය කාලීන යාවත්කාලීන සමඟ දැනුවත්ව සිටින්න",
        readMore: "සම්පූර්ණ ලිපිය කියවන්න",
        viewAll: "සියලුම පුවත් බලන්න"
      },
      benefits: {
        title: "ගොවීන් ගොවි ඉසුරු තෝරා ගන්නේ ඇයි",
        items: [
          { icon: Zap, text: "තත්පර කිහිපයකින් ක්ෂණික AI බලයෙන් යුත් රෝග විනිශ්චය" },
          { icon: Shield, text: "සියලුම ශ්‍රී ලාංකික ගොවීන් සඳහා 100% නොමිලේ" },
          { icon: Users, text: "කීර්ති නාම පද්ධතිය සහිත සමෘද්ධිමත් ප්‍රජාව" },
          { icon: Globe, text: "සම්පූර්ණ සිංහල සහ ඉංග්‍රීසි ද්විභාෂා සහාය" }
        ]
      },
      cta: {
        title: "ඔබේ ගොවිතැන වෙනස් කිරීමට සූදානම්ද?",
        subtitle: "AI තාක්ෂණය භාවිතා කරන දහස් ගණන් ශ්‍රී ලාංකික ගොවීන් සමඟ එක් වන්න",
        button: "නොමිලේ ගිණුමක් සාදන්න"
      },
      footer: {
        tagline: "තාක්ෂණය සමඟ ශ්‍රී ලාංකීය ගොවීන් සවිබල ගැන්වීම",
        copyright: "© 2025 ගොවි ඉසුරු. ශ්‍රී ලාංකික කෘෂිකර්මාන්තය වෙනුවෙන් ❤️ සමඟ නිර්මාණය කරන ලදී"
      }
    }
  };

  const t = translations[lang];

  const colorMap = {
    emerald: { bg: 'bg-emerald-500', light: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200' },
    blue: { bg: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
    purple: { bg: 'bg-purple-500', light: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
    orange: { bg: 'bg-orange-500', light: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
    cyan: { bg: 'bg-cyan-500', light: 'bg-cyan-100', text: 'text-cyan-600', border: 'border-cyan-200' },
    red: { bg: 'bg-red-500', light: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
    indigo: { bg: 'bg-indigo-500', light: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-200' },
    green: { bg: 'bg-green-500', light: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' }
  };

  return (
    <div style={{
      backgroundImage: 'url(/backgrounds/farming-training.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }} className="min-h-screen">
      {/* Dark overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(255, 255, 255, 0.4)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      
      {/* Content wrapper */}
      <div style={{ position: 'relative', zIndex: 1 }}>
      {/* Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer">
              <div className="p-1.5 sm:p-2.5 bg-gradient-to-br from-green-600 to-emerald-700 rounded-lg sm:rounded-xl shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                <Leaf className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
              </div>
              <div>
                <span className="text-lg sm:text-2xl font-black text-slate-800 tracking-tight">
                  {lang === 'si' ? 'ගොවි ඉසුරු' : 'Govi Isuru'}
                </span>
                <div className="text-[10px] sm:text-xs text-slate-500 font-medium hidden xs:block">Smart Farming Platform</div>
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Language Toggle */}
              <button
                onClick={() => setLang(lang === 'en' ? 'si' : 'en')}
                className="p-2 sm:p-2.5 text-slate-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all flex items-center gap-1 sm:gap-2 font-semibold"
                title={lang === 'en' ? 'Switch to Sinhala' : 'Switch to English'}
              >
                <Globe size={18} className="sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm hidden sm:inline">{lang === 'en' ? 'සිංහල' : 'English'}</span>
              </button>
              
              <button
                onClick={onLogin}
                className="px-3 py-2 sm:px-6 sm:py-2.5 text-slate-700 text-sm sm:text-base font-semibold hover:text-green-600 transition-colors"
              >
                {t.nav.login}
              </button>
              <button
                onClick={onRegister}
                className="px-3 py-2 sm:px-6 sm:py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-1 sm:gap-2"
              >
                {t.nav.register}
                <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 sm:pt-28 pb-12 sm:pb-20 px-3 sm:px-6 lg:px-8 relative overflow-hidden min-h-[85vh] sm:min-h-0 flex items-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-40 sm:w-72 h-40 sm:h-72 bg-green-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-56 sm:w-96 h-56 sm:h-96 bg-emerald-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative w-full">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-3 sm:space-y-8 animate-in fade-in slide-in-from-left duration-700">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-100/90 backdrop-blur-sm border border-green-200 rounded-full">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                <span className="text-xs sm:text-sm font-semibold text-green-700">{t.hero.badge}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-slate-900 leading-tight">
                {t.hero.title}
              </h1>

              <p className="text-sm sm:text-lg lg:text-xl text-slate-600 leading-relaxed">
                {t.hero.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 sm:gap-4 pt-6 sm:pt-0">
                <button
                  onClick={onRegister}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-lg"
                >
                  {t.hero.cta1}
                  <ArrowRight size={16} className="sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/90 backdrop-blur-sm text-slate-700 font-bold rounded-xl border-2 border-slate-200 hover:border-green-500 hover:text-green-600 transition-all flex items-center justify-center gap-2 text-sm sm:text-lg"
                >
                  {t.hero.cta2}
                  <ChevronRight size={16} className="sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 sm:gap-6 pt-8 sm:pt-8">
                {t.hero.stats.map((stat, idx) => (
                  <div key={idx} className="text-center bg-white/90 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-slate-100 shadow-sm">
                    <div className="text-2xl sm:text-3xl font-black text-green-600">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-slate-600 font-medium mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative animate-in fade-in slide-in-from-right duration-700 delay-200 hidden lg:block">
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-3xl shadow-2xl overflow-hidden">
                  {/* Placeholder for hero image - you can replace with actual image */}
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTIwIDYwaDEyMHY0aC0xMjB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IGZpbGw9InVybCgjYSkiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiLz48L3N2Zz4=')] opacity-50"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white p-8">
                      <div className="w-32 h-32 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                        <Leaf className="h-16 w-16" />
                      </div>
                      <div className="text-2xl font-bold mb-2">AI-Powered</div>
                      <div className="text-lg opacity-90">Crop Disease Detection</div>
                    </div>
                  </div>
                </div>

                {/* Floating Cards */}
                <div className="absolute -top-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-700">80% Accuracy</div>
                      <div className="text-xs text-slate-500">Disease Detection</div>
                    </div>
                  </div>
                </div>

                {/* Removed 1000+ Farmers card */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 lg:py-20 px-3 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16 animate-in fade-in zoom-in duration-700">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-slate-900 mb-3 sm:mb-4">
              {t.features.title}
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto px-4">
              {t.features.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {t.features.items.map((feature, idx) => {
              const Icon = feature.icon;
              const colors = colorMap[feature.color];
              return (
                <div
                  key={idx}
                  className="group p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl border-2 border-slate-100 hover:border-green-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer animate-in fade-in slide-in-from-bottom duration-700"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 ${colors.light} rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-6 w-6 sm:h-7 sm:w-7 ${colors.text}`} />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-3 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-emerald-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-green-200 rounded-full mb-3 sm:mb-4">
              <Newspaper className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
              <span className="text-xs sm:text-sm font-semibold text-green-700">{t.news.subtitle}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 mb-3 sm:mb-4 px-4">
              {t.news.title}
            </h2>
          </div>

          {loadingNews ? (
            <div className="flex justify-center items-center py-12 sm:py-20">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {news.map((article, idx) => (
                <div
                  key={idx}
                  className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 hover:border-green-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {article.urlToImage && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 sm:mb-3">
                      <Clock size={14} />
                      <span>{new Date(article.publishedAt).toLocaleDateString(lang === 'si' ? 'si-LK' : 'en-LK')}</span>
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-800 mb-2 sm:mb-3 line-clamp-2 group-hover:text-green-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4 line-clamp-3">
                      {article.description}
                    </p>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-green-600 hover:text-green-700"
                    >
                      {t.news.readMore}
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center">
            <button
              onClick={onRegister}
              className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-green-600 text-white text-sm sm:text-base font-semibold rounded-xl hover:bg-green-700 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mx-auto"
            >
              {t.news.viewAll}
              <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-3 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 text-center mb-8 sm:mb-12 px-4">
            {t.benefits.title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {t.benefits.items.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={idx}
                  className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl border border-green-100"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <p className="text-sm sm:text-base text-slate-700 font-medium pt-1 sm:pt-2">{benefit.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-16 lg:py-20 px-3 sm:px-6 lg:px-8 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTIwIDYwaDEyMHY0aC0xMjB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IGZpbGw9InVybCgjYSkiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiLz48L3N2Zz4=')] opacity-30"></div>
        <div className="max-w-4xl mx-auto text-center relative px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 sm:mb-4">
            {t.cta.title}
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-green-100 mb-6 sm:mb-8">
            {t.cta.subtitle}
          </p>
          <button
            onClick={onRegister}
            className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 bg-white text-green-600 font-bold rounded-xl hover:bg-green-50 shadow-2xl hover:shadow-3xl transition-all hover:scale-105 flex items-center justify-center gap-2 sm:gap-3 mx-auto text-base sm:text-lg"
          >
            <Sparkles size={18} className="sm:w-5 sm:h-5" />
            {t.cta.button}
            <ArrowRight size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-3 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-green-600 rounded-lg sm:rounded-xl">
                <Leaf className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-black">{lang === 'si' ? 'ගොවි ඉසුරු' : 'Govi Isuru'}</div>
                <div className="text-xs sm:text-sm text-slate-400">{t.footer.tagline}</div>
              </div>
            </div>
            <div className="text-xs sm:text-sm text-slate-400 text-center">
              {t.footer.copyright}
            </div>
          </div>
        </div>
      </footer>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-in {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
      `}</style>
      </div>
    </div>
  );
};

export default HomePage;
