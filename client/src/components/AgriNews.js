import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import {
  Newspaper,
  Leaf,
  TrendingUp,
  Cloud,
  Building2,
  Cpu,
  ExternalLink,
  Clock,
  RefreshCw,
  Search,
  ChevronRight,
  AlertCircle,
  Loader2,
  Tag,
  Eye,
  Calendar,
  Globe,
  Filter,
  X,
  Bookmark,
  Share2,
  Volume2,
  VolumeX,
  FileText,
  Bell,
  BellOff,
  Sparkles,
  Play,
  Pause,
  StopCircle,
  Languages
} from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Category configuration with icons and colors
const categoryConfig = {
  agriculture: {
    icon: Leaf,
    color: 'green',
    gradient: 'from-green-500 to-emerald-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    badge: 'bg-green-100 text-green-800'
  },
  market: {
    icon: TrendingUp,
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    badge: 'bg-blue-100 text-blue-800'
  },
  weather: {
    icon: Cloud,
    color: 'cyan',
    gradient: 'from-cyan-500 to-sky-600',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    text: 'text-cyan-700',
    badge: 'bg-cyan-100 text-cyan-800'
  },
  government: {
    icon: Building2,
    color: 'purple',
    gradient: 'from-purple-500 to-violet-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    badge: 'bg-purple-100 text-purple-800'
  },
  technology: {
    icon: Cpu,
    color: 'orange',
    gradient: 'from-orange-500 to-amber-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    badge: 'bg-orange-100 text-orange-800'
  }
};

// Translations
const translations = {
  en: {
    title: 'Agriculture News',
    subtitle: 'Stay updated with the latest farming news in Sri Lanka',
    categories: {
      agriculture: 'Agriculture & Farming',
      market: 'Market & Prices',
      weather: 'Weather & Climate',
      government: 'Government & Policy',
      technology: 'Technology & Innovation'
    },
    readMore: 'Read Full Article',
    source: 'Source',
    publishedAt: 'Published',
    refreshing: 'Refreshing...',
    refresh: 'Refresh',
    noNews: 'No news available at the moment',
    loading: 'Loading news...',
    error: 'Failed to load news',
    retry: 'Retry',
    searchPlaceholder: 'Search agriculture news...',
    filterBy: 'Filter by',
    allCategories: 'All Categories',
    today: 'Today',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    trending: 'Trending',
    latest: 'Latest',
    viewAll: 'View All',
    headlines: 'Top Headlines',
    moreNews: 'More News',
    share: 'Share',
    bookmark: 'Bookmark',
    relatedTags: 'Related Topics',
    cacheInfo: 'Updated',
    // New translations for features
    aiSummary: 'AI Summary',
    readAloud: 'Read Aloud',
    stopReading: 'Stop Reading',
    pauseReading: 'Pause',
    resumeReading: 'Resume',
    enableNotifications: 'Enable Notifications',
    disableNotifications: 'Disable Notifications',
    notificationsOn: 'Alerts On',
    notificationsOff: 'Alerts Off',
    generatingSummary: 'Generating summary...',
    keyPoints: 'Key Points',
    readTime: 'min read',
    fullArticle: 'Full Article',
    urgentNews: 'Urgent News'
  },
  si: {
    title: 'කෘෂිකාර්මික ප්‍රවෘත්ති',
    subtitle: 'ශ්‍රී ලංකාවේ නවතම ගොවිතැන් ප්‍රවෘත්ති සමඟ යාවත්කාලීන වන්න',
    categories: {
      agriculture: 'කෘෂිකර්මය සහ ගොවිතැන',
      market: 'වෙළඳපොළ සහ මිල ගණන්',
      weather: 'කාලගුණය සහ දේශගුණය',
      government: 'රජය සහ ප්‍රතිපත්ති',
      technology: 'තාක්ෂණය සහ නවෝත්පාදන'
    },
    readMore: 'සම්පූර්ණ ලිපිය කියවන්න',
    source: 'මූලාශ්‍රය',
    publishedAt: 'ප්‍රකාශිත',
    refreshing: 'යාවත්කාලීන වෙමින්...',
    refresh: 'යාවත්කාලීන කරන්න',
    noNews: 'දැනට ප්‍රවෘත්ති නොමැත',
    loading: 'ප්‍රවෘත්ති පූරණය වෙමින්...',
    error: 'ප්‍රවෘත්ති පූරණය අසාර්ථක විය',
    retry: 'නැවත උත්සාහ කරන්න',
    searchPlaceholder: 'කෘෂිකාර්මික ප්‍රවෘත්ති සොයන්න...',
    filterBy: 'පෙරන්න',
    allCategories: 'සියලු ප්‍රවර්ග',
    today: 'අද',
    thisWeek: 'මෙම සතිය',
    thisMonth: 'මෙම මාසය',
    trending: 'ජනප්‍රිය',
    latest: 'නවතම',
    viewAll: 'සියල්ල බලන්න',
    headlines: 'ප්‍රධාන ශීර්ෂ පුවත්',
    moreNews: 'තවත් ප්‍රවෘත්ති',
    share: 'බෙදාගන්න',
    bookmark: 'සුරකින්න',
    relatedTags: 'අදාළ මාතෘකා',
    cacheInfo: 'යාවත්කාලීන කළේ',
    // New translations for features
    aiSummary: 'AI සාරාංශය',
    readAloud: 'කියවන්න',
    stopReading: 'නවත්වන්න',
    pauseReading: 'විරාමය',
    resumeReading: 'නැවත ආරම්භ කරන්න',
    enableNotifications: 'දැනුම්දීම් සක්‍රිය කරන්න',
    disableNotifications: 'දැනුම්දීම් අක්‍රිය කරන්න',
    notificationsOn: 'දැනුම්දීම් ක්‍රියාත්මකයි',
    notificationsOff: 'දැනුම්දීම් අක්‍රියයි',
    generatingSummary: 'සාරාංශය ජනනය වෙමින්...',
    keyPoints: 'ප්‍රධාන කරුණු',
    readTime: 'විනාඩි කියවීමට',
    fullArticle: 'සම්පූර්ණ ලිපිය',
    urgentNews: 'හදිසි ප්‍රවෘත්ති'
  }
};

// Tag translations for Sinhala
const tagTranslations = {
  agriculture: 'කෘෂිකර්මය',
  market: 'වෙළඳපොළ',
  weather: 'කාලගුණය',
  government: 'රජය',
  technology: 'තාක්ෂණය',
  rice: 'වී',
  tea: 'තේ',
  fertilizer: 'පොහොර',
  price: 'මිල',
  export: 'අපනයනය',
  monsoon: 'මෝසම්',
  farming: 'ගොවිතැන'
};

// TTS (Text-to-Speech) Hook for Sinhala voice reading
const useTTS = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentArticleId, setCurrentArticleId] = useState(null);
  const utteranceRef = useRef(null);

  const getVoice = (lang) => {
    const voices = window.speechSynthesis.getVoices();
    
    if (lang === 'si') {
      // Try to find Sinhala voice
      const sinhalaVoice = voices.find(v => 
        v.lang.includes('si') || 
        v.name.toLowerCase().includes('sinhala') ||
        v.name.toLowerCase().includes('sinh')
      );
      if (sinhalaVoice) return sinhalaVoice;
      
      // Fallback to any available voice
      return voices.find(v => v.lang.includes('en')) || voices[0];
    }
    
    // English voices
    const englishVoice = voices.find(v => 
      v.lang === 'en-GB' || v.lang === 'en-US' || v.lang.includes('en')
    );
    return englishVoice || voices[0];
  };

  const speak = async (article, lang = 'en') => {
    if (!window.speechSynthesis) {
      console.error('Speech synthesis not supported');
      return;
    }

    // Stop any ongoing speech
    stop();

    try {
      // Get prepared text from server
      const response = await axios.post(`${API_BASE}/api/news/prepare-tts`, {
        article,
        lang
      });

      if (!response.data.success) {
        throw new Error('Failed to prepare text');
      }

      const { text, lang: voiceLang } = response.data;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = voiceLang;
      utterance.rate = lang === 'si' ? 0.85 : 0.95;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Try to get appropriate voice
      const voice = getVoice(lang);
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
        setCurrentArticleId(article.id);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        setCurrentArticleId(null);
      };

      utterance.onerror = (event) => {
        console.error('TTS error:', event);
        setIsSpeaking(false);
        setIsPaused(false);
        setCurrentArticleId(null);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('TTS preparation error:', error);
    }
  };

  const pause = () => {
    if (window.speechSynthesis && isSpeaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (window.speechSynthesis && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stop = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentArticleId(null);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    speak,
    pause,
    resume,
    stop,
    isSpeaking,
    isPaused,
    currentArticleId
  };
};

// Push Notification Hook
const usePushNotifications = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if push notifications are supported
    const supported = 'serviceWorker' in navigator && 'PushManager' in window;
    setIsSupported(supported);

    if (supported) {
      checkSubscription();
    }
  }, []);

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const subscribe = async () => {
    if (!isSupported) return false;
    setLoading(true);

    try {
      // Request notification permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setLoading(false);
        return false;
      }

      // Get VAPID public key
      const keyResponse = await axios.get(`${API_BASE}/api/news/vapid-public-key`);
      const vapidPublicKey = keyResponse.data.publicKey;

      // Convert VAPID key
      const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);

      // Register service worker if not already registered
      let registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        registration = await navigator.serviceWorker.register('/sw.js');
      }

      // Subscribe to push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey
      });

      // Send subscription to server
      await axios.post(`${API_BASE}/api/news/subscribe`, subscription);

      setIsSubscribed(true);
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Subscription error:', error);
      setLoading(false);
      return false;
    }
  };

  const unsubscribe = async () => {
    if (!isSupported) return false;
    setLoading(true);

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        // Unsubscribe from push
        await subscription.unsubscribe();

        // Notify server
        await axios.post(`${API_BASE}/api/news/unsubscribe`, {
          endpoint: subscription.endpoint
        });
      }

      setIsSubscribed(false);
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Unsubscription error:', error);
      setLoading(false);
      return false;
    }
  };

  return {
    isSubscribed,
    isSupported,
    loading,
    subscribe,
    unsubscribe
  };
};

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// News Card Component
const NewsCard = ({ article, lang, onRead, isHeadline = false, tts, onShowSummary }) => {
  const t = translations[lang];
  const config = categoryConfig[article.category] || categoryConfig.agriculture;
  const CategoryIcon = config.icon;
  const isPlaying = tts?.currentArticleId === article.id;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 1) return lang === 'si' ? 'මිනිත්තු කිහිපයකට පෙර' : 'Just now';
    if (diffHours < 24) return lang === 'si' ? `පැය ${diffHours}කට පෙර` : `${diffHours}h ago`;
    if (diffHours < 48) return lang === 'si' ? 'ඊයේ' : 'Yesterday';
    
    return date.toLocaleDateString(lang === 'si' ? 'si-LK' : 'en-LK', {
      day: 'numeric',
      month: 'short'
    });
  };

  const handleClick = () => {
    onRead(article);
    window.open(article.url, '_blank', 'noopener,noreferrer');
  };

  const handleTTSClick = (e) => {
    e.stopPropagation();
    if (isPlaying) {
      if (tts.isPaused) {
        tts.resume();
      } else {
        tts.pause();
      }
    } else {
      tts.speak(article, lang);
    }
  };

  const handleSummaryClick = (e) => {
    e.stopPropagation();
    onShowSummary(article);
  };

  if (isHeadline) {
    return (
      <div 
        className={`relative overflow-hidden rounded-2xl shadow-lg cursor-pointer group transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
        onClick={handleClick}
      >
        {/* Background Image */}
        <div className="relative h-64 md:h-80">
          {article.imageUrl ? (
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800';
              }}
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${config.gradient}`} />
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Category Badge */}
          <div className={`absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm ${config.text} text-sm font-medium`}>
            <CategoryIcon className="w-4 h-4" />
            {t.categories[article.category]}
          </div>

          {/* TTS & Summary Buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={handleSummaryClick}
              className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-purple-600 hover:bg-purple-100 transition-colors"
              title={lang === 'si' ? 'AI සාරාංශය' : 'AI Summary'}
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={handleTTSClick}
              className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                isPlaying 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-white/90 text-green-600 hover:bg-green-100'
              }`}
              title={lang === 'si' ? 'කියවන්න' : 'Read aloud'}
            >
              {isPlaying ? (
                tts.isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <h3 className="text-xl md:text-2xl font-bold mb-2 line-clamp-2 group-hover:text-green-300 transition-colors">
            {article.title}
          </h3>
          <p className="text-white/80 text-sm line-clamp-2 mb-3">
            {article.description}
          </p>
          <div className="flex items-center justify-between text-white/70 text-sm">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                {article.source}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formatDate(article.publishedAt)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-green-300">
              <span>{t.readMore}</span>
              <ExternalLink className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border ${config.border} overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-md hover:-translate-y-0.5`}
      onClick={handleClick}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="sm:w-40 h-32 sm:h-auto flex-shrink-0 relative">
          {article.imageUrl ? (
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400';
              }}
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
              <CategoryIcon className="w-10 h-10 text-white/80" />
            </div>
          )}
          
          {/* TTS Button on Image */}
          <button
            onClick={handleTTSClick}
            className={`absolute bottom-2 right-2 p-1.5 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 ${
              isPlaying 
                ? 'bg-green-500 text-white' 
                : 'bg-white/90 text-green-600 hover:bg-green-100'
            }`}
            title={lang === 'si' ? 'කියවන්න' : 'Read aloud'}
          >
            {isPlaying ? (
              tts.isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 p-4">
          {/* Category & Date */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.badge}`}>
              <CategoryIcon className="w-3 h-3" />
              {t.categories[article.category]}
            </span>
            <span className="text-gray-400 text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(article.publishedAt)}
            </span>
            {/* Summary Button */}
            <button
              onClick={handleSummaryClick}
              className="ml-auto p-1 rounded-full text-purple-500 hover:bg-purple-50 transition-colors opacity-0 group-hover:opacity-100"
              title={lang === 'si' ? 'AI සාරාංශය' : 'AI Summary'}
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
          
          {/* Title */}
          <h4 className="font-semibold text-gray-800 mb-1.5 line-clamp-2 group-hover:text-green-600 transition-colors">
            {article.title}
          </h4>
          
          {/* Description */}
          <p className="text-gray-500 text-sm line-clamp-2 mb-2">
            {article.description}
          </p>
          
          {/* Footer */}
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs flex items-center gap-1">
              <Globe className="w-3 h-3" />
              {article.source}
            </span>
            <span className={`text-xs font-medium ${config.text} flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
              {t.readMore}
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
          
          {/* Tags */}
          {article.tags && article.tags.length > 1 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {article.tags.slice(1, 4).map(tag => (
                <span 
                  key={tag} 
                  className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs"
                >
                  {lang === 'si' && tagTranslations[tag] ? tagTranslations[tag] : tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Category Tab Component
const CategoryTab = ({ category, isActive, onClick, lang }) => {
  const config = categoryConfig[category];
  const CategoryIcon = config.icon;
  const t = translations[lang];

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
        isActive
          ? `bg-gradient-to-r ${config.gradient} text-white shadow-md`
          : `bg-white ${config.text} border ${config.border} hover:bg-gray-50`
      }`}
    >
      <CategoryIcon className="w-4 h-4" />
      <span className="hidden sm:inline">{t.categories[category]}</span>
    </button>
  );
};

// Main AgriNews Component
const AgriNews = ({ lang = 'en', user }) => {
  const [activeCategory, setActiveCategory] = useState('agriculture');
  const [news, setNews] = useState([]);
  const [headlines, setHeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cacheAge, setCacheAge] = useState(0);
  
  // Summary Modal State
  const [summaryModal, setSummaryModal] = useState({
    isOpen: false,
    article: null,
    summary: null,
    loading: false
  });

  const t = translations[lang];
  const categories = Object.keys(categoryConfig);
  
  // TTS Hook
  const tts = useTTS();
  
  // Push Notifications Hook
  const pushNotifications = usePushNotifications();

  // Show AI Summary
  const handleShowSummary = async (article) => {
    setSummaryModal({ isOpen: true, article, summary: null, loading: true });
    
    try {
      const response = await axios.post(`${API_BASE}/api/news/summarize`, {
        article,
        lang
      });
      
      if (response.data.success) {
        setSummaryModal(prev => ({
          ...prev,
          summary: response.data.summary,
          loading: false
        }));
      }
    } catch (error) {
      console.error('Summary error:', error);
      setSummaryModal(prev => ({
        ...prev,
        loading: false,
        summary: {
          en: article.description || 'Unable to generate summary',
          si: article.description || 'සාරාංශය ජනනය කළ නොහැක'
        }
      }));
    }
  };

  // Close Summary Modal
  const closeSummaryModal = () => {
    setSummaryModal({ isOpen: false, article: null, summary: null, loading: false });
  };

  // Fetch news by category
  const fetchNews = useCallback(async (category, forceRefresh = false) => {
    try {
      setError(null);
      
      const response = await axios.get(`${API_BASE}/api/news`, {
        params: { category, refresh: forceRefresh }
      });

      if (response.data.success) {
        setNews(response.data.articles);
        setCacheAge(response.data.cacheAge);
      } else {
        // Try demo endpoint as fallback
        const demoResponse = await axios.get(`${API_BASE}/api/news/demo`, {
          params: { category }
        });
        setNews(demoResponse.data.articles || []);
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      // Try demo endpoint as fallback
      try {
        const demoResponse = await axios.get(`${API_BASE}/api/news/demo`, {
          params: { category }
        });
        setNews(demoResponse.data.articles || []);
      } catch (demoErr) {
        setError(t.error);
        setNews([]);
      }
    }
  }, [t.error]);

  // Fetch headlines
  const fetchHeadlines = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/news/headlines`);
      if (response.data.success) {
        setHeadlines(response.data.headlines);
      }
    } catch (err) {
      console.error('Error fetching headlines:', err);
      // Use first articles from demo as headlines
      try {
        const demoResponse = await axios.get(`${API_BASE}/api/news/demo`);
        setHeadlines(demoResponse.data.articles?.slice(0, 2) || []);
      } catch (demoErr) {
        setHeadlines([]);
      }
    }
  }, []);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchNews(activeCategory),
        fetchHeadlines()
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Category change
  useEffect(() => {
    if (!loading) {
      fetchNews(activeCategory);
    }
  }, [activeCategory]);

  // Refresh handler
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNews(activeCategory, true);
    setRefreshing(false);
  };

  // Track article click
  const handleArticleRead = async (article) => {
    try {
      await axios.post(`${API_BASE}/api/news/click`, {
        articleId: article.id,
        category: article.category,
        userId: user?.id
      });
    } catch (err) {
      // Silent fail for analytics
    }
  };

  // Search handler
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/api/news/search`, {
        params: { q: searchQuery, crop: user?.preferredCrop }
      });
      if (response.data.success) {
        setNews(response.data.articles);
      }
    } catch (err) {
      console.error('Search error:', err);
    }
    setLoading(false);
  };

  // Format cache time
  const formatCacheTime = (seconds) => {
    if (seconds < 60) return lang === 'si' ? 'දැන් පමණයි' : 'Just now';
    const minutes = Math.floor(seconds / 60);
    return lang === 'si' ? `මිනි ${minutes}කට පෙර` : `${minutes}m ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Newspaper className="w-7 h-7 text-green-600" />
            {t.title}
          </h2>
          <p className="text-gray-500 mt-1">{t.subtitle}</p>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Push Notification Toggle */}
          {pushNotifications.isSupported && (
            <button
              onClick={() => pushNotifications.isSubscribed 
                ? pushNotifications.unsubscribe() 
                : pushNotifications.subscribe()
              }
              disabled={pushNotifications.loading}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium transition-all ${
                pushNotifications.isSubscribed
                  ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={pushNotifications.isSubscribed 
                ? (lang === 'si' ? 'දැනුම්දීම් අක්‍රිය කරන්න' : 'Disable notifications')
                : (lang === 'si' ? 'දැනුම්දීම් සක්‍රිය කරන්න' : 'Enable notifications')
              }
            >
              {pushNotifications.loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : pushNotifications.isSubscribed ? (
                <Bell className="w-4 h-4" />
              ) : (
                <BellOff className="w-4 h-4" />
              )}
              <span className="hidden sm:inline text-sm">
                {pushNotifications.isSubscribed 
                  ? (lang === 'si' ? 'දැනුම්දීම්' : 'Alerts On')
                  : (lang === 'si' ? 'දැනුම්දීම්' : 'Alerts Off')
                }
              </span>
            </button>
          )}
          
          {/* TTS Stop Button (when playing) */}
          {tts.isSpeaking && (
            <button
              onClick={tts.stop}
              className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-xl font-medium hover:bg-red-200 transition-all"
            >
              <StopCircle className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">
                {lang === 'si' ? 'නවත්වන්න' : 'Stop'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Refresh */}
      <div className="flex items-center gap-3">
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => { setSearchQuery(''); fetchNews(activeCategory); }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </form>
        
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{refreshing ? t.refreshing : t.refresh}</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(category => (
          <CategoryTab
            key={category}
            category={category}
            isActive={activeCategory === category}
            onClick={() => setActiveCategory(category)}
            lang={lang}
          />
        ))}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-10 h-10 text-green-600 animate-spin mb-4" />
          <p className="text-gray-500">{t.loading}</p>
        </div>
      ) : error ? (
        /* Error State */
        <div className="flex flex-col items-center justify-center py-16 bg-red-50 rounded-2xl">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <button
            onClick={() => fetchNews(activeCategory, true)}
            className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
          >
            {t.retry}
          </button>
        </div>
      ) : (
        /* News Content */
        <div className="space-y-6">
          {/* Headlines Section */}
          {headlines.length > 0 && activeCategory === 'agriculture' && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-green-500 rounded-full"></span>
                {t.headlines}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {headlines.slice(0, 2).map(article => (
                  <NewsCard
                    key={article.id}
                    article={article}
                    lang={lang}
                    onRead={handleArticleRead}
                    isHeadline
                    tts={tts}
                    onShowSummary={handleShowSummary}
                  />
                ))}
              </div>
            </div>
          )}

          {/* News List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className={`w-1.5 h-6 rounded-full bg-${categoryConfig[activeCategory].color}-500`}></span>
                {t.categories[activeCategory]}
              </h3>
              {cacheAge > 0 && (
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {t.cacheInfo}: {formatCacheTime(cacheAge)}
                </span>
              )}
            </div>

            {news.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-2xl">
                <Newspaper className="w-12 h-12 text-gray-300 mb-4" />
                <p className="text-gray-500">{t.noNews}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {news.map(article => (
                  <NewsCard
                    key={article.id}
                    article={article}
                    lang={lang}
                    onRead={handleArticleRead}
                    tts={tts}
                    onShowSummary={handleShowSummary}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Summary Modal */}
      {summaryModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="font-semibold">
                    {lang === 'si' ? 'AI සාරාංශය' : 'AI Summary'}
                  </h3>
                </div>
                <button
                  onClick={closeSummaryModal}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-5 overflow-y-auto max-h-[60vh]">
              {summaryModal.loading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-3" />
                  <p className="text-gray-500">
                    {lang === 'si' ? 'සාරාංශය ජනනය වෙමින්...' : 'Generating summary...'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Article Title */}
                  <h4 className="font-semibold text-gray-800 text-lg">
                    {summaryModal.article?.title}
                  </h4>
                  
                  {/* Summary */}
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                    <div className="flex items-center gap-2 mb-2 text-purple-700">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {lang === 'si' ? 'සාරාංශය' : 'Summary'}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {lang === 'si' 
                        ? summaryModal.summary?.si 
                        : summaryModal.summary?.en}
                    </p>
                  </div>
                  
                  {/* Key Points */}
                  {summaryModal.summary?.keyPoints?.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-700 flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        {lang === 'si' ? 'ප්‍රධාන කරුණු' : 'Key Points'}
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {summaryModal.summary.keyPoints.map((point, i) => (
                          <span 
                            key={i}
                            className={`px-3 py-1 rounded-full text-sm ${
                              point.type === 'stat' 
                                ? 'bg-blue-100 text-blue-700'
                                : point.type === 'location'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {point.value}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Read Time */}
                  {summaryModal.summary?.readTime && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>
                        {lang === 'si' 
                          ? `කියවීමට විනාඩි ${summaryModal.summary.readTime}`
                          : `${summaryModal.summary.readTime} min read`
                        }
                      </span>
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="flex gap-3 pt-3 border-t">
                    <button
                      onClick={() => {
                        tts.speak(summaryModal.article, lang);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                    >
                      <Volume2 className="w-4 h-4" />
                      {lang === 'si' ? 'කියවන්න' : 'Read Aloud'}
                    </button>
                    <button
                      onClick={() => {
                        window.open(summaryModal.article?.url, '_blank');
                        closeSummaryModal();
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {lang === 'si' ? 'සම්පූර්ණ ලිපිය' : 'Full Article'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgriNews;
