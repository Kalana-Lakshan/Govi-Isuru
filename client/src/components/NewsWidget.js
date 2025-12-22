import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Newspaper,
  ExternalLink,
  Clock,
  RefreshCw,
  ChevronRight,
  Loader2,
  AlertCircle,
  Leaf,
  TrendingUp,
  Cloud,
  Building2
} from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Compact translations
const translations = {
  en: {
    title: 'Agri News',
    viewAll: 'View All',
    readMore: 'Read More',
    noNews: 'No news available',
    loading: 'Loading...',
    refreshing: 'Updating...',
    categories: {
      agriculture: 'Farming',
      market: 'Market',
      weather: 'Weather',
      government: 'Policy'
    }
  },
  si: {
    title: 'ගොවි ප්‍රවෘත්ති',
    viewAll: 'සියල්ල',
    readMore: 'කියවන්න',
    noNews: 'ප්‍රවෘත්ති නැත',
    loading: 'පූරණය වෙමින්...',
    refreshing: 'යාවත්කාලීන වෙමින්...',
    categories: {
      agriculture: 'ගොවිතැන',
      market: 'වෙළඳපොළ',
      weather: 'කාලගුණය',
      government: 'ප්‍රතිපත්ති'
    }
  }
};

// Category icons
const categoryIcons = {
  agriculture: Leaf,
  market: TrendingUp,
  weather: Cloud,
  government: Building2
};

// Category colors
const categoryColors = {
  agriculture: 'text-green-600 bg-green-100',
  market: 'text-blue-600 bg-blue-100',
  weather: 'text-cyan-600 bg-cyan-100',
  government: 'text-purple-600 bg-purple-100'
};

const NewsWidget = ({ lang = 'en', onViewAll, maxItems = 4 }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const t = translations[lang];

  // Fetch latest news
  const fetchNews = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      setError(null);

      const response = await axios.get(`${API_BASE}/api/news/headlines`);
      
      if (response.data.success) {
        setNews(response.data.headlines || []);
      } else {
        // Fallback to demo
        const demoResponse = await axios.get(`${API_BASE}/api/news/demo`);
        setNews(demoResponse.data.articles?.slice(0, maxItems) || []);
      }
    } catch (err) {
      console.error('News widget error:', err);
      // Try demo endpoint
      try {
        const demoResponse = await axios.get(`${API_BASE}/api/news/demo`);
        setNews(demoResponse.data.articles?.slice(0, maxItems) || []);
      } catch (demoErr) {
        setError(true);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
    // Refresh every 10 minutes
    const interval = setInterval(() => fetchNews(true), 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Format relative time
  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 1) return lang === 'si' ? 'දැන්' : 'Now';
    if (diffHours < 24) return lang === 'si' ? `පැය ${diffHours}` : `${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return lang === 'si' ? `දින ${diffDays}` : `${diffDays}d`;
  };

  // Handle article click
  const handleClick = (article) => {
    // Track click
    axios.post(`${API_BASE}/api/news/click`, {
      articleId: article.id,
      category: article.category
    }).catch(() => {});
    
    window.open(article.url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-green-600 animate-spin" />
          <span className="ml-2 text-gray-500 text-sm">{t.loading}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-green-600" />
          {t.title}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchNews(true)}
            disabled={refreshing}
            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title={refreshing ? t.refreshing : 'Refresh'}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
            >
              {t.viewAll}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* News List */}
      <div className="divide-y divide-gray-50">
        {error ? (
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <AlertCircle className="w-8 h-8 text-gray-300 mb-2" />
            <p className="text-gray-400 text-sm">{t.noNews}</p>
          </div>
        ) : news.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <Newspaper className="w-8 h-8 text-gray-300 mb-2" />
            <p className="text-gray-400 text-sm">{t.noNews}</p>
          </div>
        ) : (
          news.slice(0, maxItems).map((article) => {
            const CategoryIcon = categoryIcons[article.category] || Newspaper;
            const colorClass = categoryColors[article.category] || 'text-gray-600 bg-gray-100';
            
            return (
              <div
                key={article.id}
                onClick={() => handleClick(article)}
                className="p-3 hover:bg-gray-50 cursor-pointer transition-colors group"
              >
                <div className="flex gap-3">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                    {article.imageUrl ? (
                      <img
                        src={article.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center ${colorClass.split(' ')[1]}`}>
                        <CategoryIcon className={`w-6 h-6 ${colorClass.split(' ')[0]}`} />
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${colorClass}`}>
                        {t.categories[article.category] || article.category}
                      </span>
                      <span className="text-gray-400 text-xs flex items-center gap-0.5">
                        <Clock className="w-3 h-3" />
                        {formatTime(article.publishedAt)}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-green-600 transition-colors">
                      {article.title}
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                      {article.source}
                    </p>
                  </div>
                  
                  {/* Arrow */}
                  <div className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-4 h-4 text-green-500" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer - View All */}
      {news.length > 0 && onViewAll && (
        <div className="p-3 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onViewAll}
            className="w-full py-2 text-sm text-green-600 hover:text-green-700 font-medium flex items-center justify-center gap-1 hover:bg-green-50 rounded-lg transition-colors"
          >
            {t.viewAll}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default NewsWidget;
