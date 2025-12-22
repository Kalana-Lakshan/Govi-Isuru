const express = require('express');
const router = express.Router();
const axios = require('axios');
const webpush = require('web-push');

// News API Configuration
const NEWS_API_KEY = process.env.NEWS_API_KEY || 'demo'; // Get free key from newsapi.org
const NEWS_API_BASE = 'https://newsapi.org/v2';

// Web Push Configuration (VAPID keys - generate your own for production)
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || 'UUxI4O8-FbRouAf7-1EYO2PJwH4npTjOJrmf9bKqX8M';

// Configure web-push
try {
  webpush.setVapidDetails(
    'mailto:govisuru@example.com',
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
} catch (err) {
  console.log('Web push not configured:', err.message);
}

// Cache configuration
let newsCache = {
  agriculture: { data: null, timestamp: 0 },
  market: { data: null, timestamp: 0 },
  weather: { data: null, timestamp: 0 },
  government: { data: null, timestamp: 0 },
  technology: { data: null, timestamp: 0 }
};

// Push subscription storage (in production, use database)
let pushSubscriptions = [];
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Click tracking storage (in production, use database)
let clickStats = {};

// AI Summary cache (to avoid regenerating summaries)
let summaryCache = {};

// Urgent news keywords for push notifications
const urgentKeywords = [
  'emergency', 'urgent', 'alert', 'warning', 'breaking',
  'flood', 'drought', 'disaster', 'outbreak', 'crisis',
  'recall', 'ban', 'shortage', 'price hike', 'subsidy',
  'ගංවතුර', 'නියඟය', 'හදිසි', 'අනතුරු ඇඟවීම'
];

// Category keywords for filtering
const categoryKeywords = {
  agriculture: [
    'Sri Lanka agriculture', 'Sri Lanka farming', 'Sri Lanka crops',
    'Sri Lanka paddy', 'Sri Lanka rice farming', 'Sri Lanka tea plantation',
    'Sri Lanka fertilizer', 'Sri Lanka harvest', 'Ceylon agriculture'
  ],
  market: [
    'Sri Lanka crop prices', 'Sri Lanka rice price', 'Sri Lanka tea price',
    'Sri Lanka vegetable prices', 'Sri Lanka food prices', 'Sri Lanka export',
    'Colombo food market', 'Sri Lanka agricultural market'
  ],
  weather: [
    'Sri Lanka weather', 'Sri Lanka monsoon', 'Sri Lanka rainfall',
    'Sri Lanka flood', 'Sri Lanka drought', 'Sri Lanka climate',
    'Ceylon weather forecast', 'Sri Lanka irrigation'
  ],
  government: [
    'Sri Lanka agriculture ministry', 'Sri Lanka farming policy',
    'Sri Lanka fertilizer subsidy', 'Sri Lanka farmer support',
    'Sri Lanka agriculture loan', 'Sri Lanka rural development'
  ],
  technology: [
    'Sri Lanka agritech', 'Sri Lanka smart farming',
    'Sri Lanka agriculture technology', 'Sri Lanka farming innovation',
    'Sri Lanka agricultural research'
  ]
};

// Sinhala category names
const categoryNamesSi = {
  agriculture: 'කෘෂිකර්මය සහ ගොවිතැන',
  market: 'බෝග වෙළඳපොළ සහ මිල',
  weather: 'කාලගුණය සහ දේශගුණය',
  government: 'රජය සහ ප්‍රතිපත්ති',
  technology: 'තාක්ෂණය සහ නවෝත්පාදන'
};

// Sinhala tag translations
const tagTranslations = {
  agriculture: 'කෘෂිකර්මය',
  market: 'වෙළඳපොළ',
  weather: 'කාලගුණය',
  government: 'රජය',
  technology: 'තාක්ෂණය',
  farming: 'ගොවිතැන',
  rice: 'වී',
  tea: 'තේ',
  fertilizer: 'පොහොර',
  price: 'මිල',
  export: 'අපනයනය',
  monsoon: 'මෝසම්',
  flood: 'ගංවතුර',
  drought: 'නියඟය'
};

/**
 * Fetch news from NewsAPI with caching
 */
async function fetchNews(category, forceRefresh = false) {
  const now = Date.now();
  const cached = newsCache[category];

  // Return cached data if valid
  if (!forceRefresh && cached.data && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.data;
  }

  const keywords = categoryKeywords[category] || categoryKeywords.agriculture;
  const query = keywords.slice(0, 3).join(' OR '); // Use top 3 keywords

  try {
    const response = await axios.get(`${NEWS_API_BASE}/everything`, {
      params: {
        q: query,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 20,
        apiKey: NEWS_API_KEY
      },
      timeout: 10000
    });

    const articles = response.data.articles || [];
    
    // Filter and process articles
    const processedArticles = articles
      .filter(article => {
        // Must have title and description
        if (!article.title || !article.description) return false;
        // Filter out removed articles
        if (article.title === '[Removed]') return false;
        return true;
      })
      .map(article => ({
        id: generateArticleId(article),
        title: article.title,
        description: article.description,
        content: article.content,
        source: article.source?.name || 'Unknown',
        author: article.author,
        url: article.url,
        imageUrl: article.urlToImage,
        publishedAt: article.publishedAt,
        category: category,
        tags: extractTags(article, category)
      }))
      .slice(0, 15); // Limit to 15 articles

    // Update cache
    newsCache[category] = {
      data: processedArticles,
      timestamp: now
    };

    return processedArticles;
  } catch (error) {
    console.error(`Error fetching ${category} news:`, error.message);
    
    // Return cached data even if expired, or empty array
    return cached.data || [];
  }
}

/**
 * Generate unique article ID
 */
function generateArticleId(article) {
  const str = `${article.title}-${article.publishedAt}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Extract relevant tags from article
 */
function extractTags(article, category) {
  const text = `${article.title} ${article.description}`.toLowerCase();
  const tags = [category];

  const tagKeywords = {
    rice: ['rice', 'paddy', 'වී'],
    tea: ['tea', 'තේ', 'ceylon tea'],
    fertilizer: ['fertilizer', 'පොහොර', 'urea'],
    weather: ['weather', 'rain', 'monsoon', 'flood', 'drought'],
    price: ['price', 'cost', 'market', 'export'],
    government: ['government', 'ministry', 'policy', 'subsidy']
  };

  for (const [tag, keywords] of Object.entries(tagKeywords)) {
    if (keywords.some(kw => text.includes(kw))) {
      tags.push(tag);
    }
  }

  return [...new Set(tags)].slice(0, 4);
}

/**
 * Check if article is urgent news
 */
function isUrgentNews(article) {
  const text = `${article.title} ${article.description}`.toLowerCase();
  return urgentKeywords.some(keyword => text.includes(keyword.toLowerCase()));
}

/**
 * Generate AI summary for article
 * Uses extractive summarization technique
 */
function generateSummary(article, lang = 'en') {
  const cacheKey = `${article.id}_${lang}`;
  
  // Return cached summary if exists
  if (summaryCache[cacheKey]) {
    return summaryCache[cacheKey];
  }

  const text = article.content || article.description || '';
  
  // Clean the text
  const cleanText = text
    .replace(/\[.*?\]/g, '') // Remove [+chars]
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ')    // Normalize whitespace
    .trim();

  // Split into sentences
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 20);
  
  // Score sentences based on importance
  const scoredSentences = sentences.map(sentence => {
    let score = 0;
    const lowerSentence = sentence.toLowerCase();
    
    // Higher score for sentences with important keywords
    const importantKeywords = [
      'announced', 'reported', 'said', 'according', 'percent',
      'million', 'farmers', 'agriculture', 'crop', 'price',
      'government', 'ministry', 'increase', 'decrease', 'new'
    ];
    
    importantKeywords.forEach(keyword => {
      if (lowerSentence.includes(keyword)) score += 2;
    });
    
    // Higher score for first sentences (likely important)
    const index = sentences.indexOf(sentence);
    if (index < 2) score += 3;
    
    // Bonus for sentences with numbers (facts/stats)
    if (/\d+/.test(sentence)) score += 2;
    
    return { sentence: sentence.trim(), score };
  });

  // Sort by score and take top 3 sentences
  scoredSentences.sort((a, b) => b.score - a.score);
  const topSentences = scoredSentences.slice(0, 3);
  
  // Reorder by original position
  topSentences.sort((a, b) => 
    sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence)
  );

  const englishSummary = topSentences.map(s => s.sentence).join('. ') + '.';
  
  // Generate Sinhala summary with key point translations
  let sinhalaSummary = '';
  if (lang === 'si') {
    sinhalaSummary = generateSinhalaSummary(article, englishSummary);
  }

  const summary = {
    en: englishSummary || article.description?.slice(0, 200) + '...',
    si: sinhalaSummary || translateToSinhala(article.title),
    keyPoints: extractKeyPoints(article),
    readTime: Math.ceil(cleanText.split(' ').length / 200) // words per minute
  };

  // Cache the summary
  summaryCache[cacheKey] = summary;
  
  return summary;
}

/**
 * Generate Sinhala summary from English content
 */
function generateSinhalaSummary(article, englishSummary) {
  // Key agricultural terms to translate
  const translations = {
    // Agriculture terms
    'agriculture': 'කෘෂිකර්මය',
    'farming': 'ගොවිතැන',
    'farmers': 'ගොවීන්',
    'crop': 'බෝග',
    'crops': 'බෝග',
    'harvest': 'අස්වැන්න',
    'paddy': 'වී',
    'rice': 'සහල්/වී',
    'tea': 'තේ',
    'vegetables': 'එළවළු',
    'fertilizer': 'පොහොර',
    'pesticide': 'පළිබෝධනාශක',
    'irrigation': 'වාරිමාර්ග',
    'cultivation': 'වගාව',
    
    // Weather terms
    'rain': 'වැස්ස',
    'rainfall': 'වර්ෂාපතනය',
    'monsoon': 'මෝසම්',
    'flood': 'ගංවතුර',
    'drought': 'නියඟය',
    'weather': 'කාලගුණය',
    'climate': 'දේශගුණය',
    
    // Economic terms
    'price': 'මිල',
    'prices': 'මිල ගණන්',
    'market': 'වෙළඳපොළ',
    'export': 'අපනයනය',
    'import': 'ආනයනය',
    'subsidy': 'සහනාධාරය',
    'increase': 'වැඩිවීම',
    'decrease': 'අඩුවීම',
    'percent': 'ප්‍රතිශතය',
    
    // Government terms
    'government': 'රජය',
    'ministry': 'අමාත්‍යාංශය',
    'policy': 'ප්‍රතිපත්තිය',
    'program': 'වැඩසටහන',
    'announcement': 'නිවේදනය',
    
    // General
    'Sri Lanka': 'ශ්‍රී ලංකාව',
    'million': 'මිලියන',
    'billion': 'බිලියන',
    'new': 'නව',
    'year': 'වසර',
    'month': 'මාසය'
  };

  // Create a template-based Sinhala summary
  let siSummary = '';
  
  // Translate key terms in the English summary
  let translatedText = englishSummary.toLowerCase();
  for (const [en, si] of Object.entries(translations)) {
    translatedText = translatedText.replace(new RegExp(en, 'gi'), si);
  }

  // Generate Sinhala summary template based on category
  if (article.category === 'agriculture') {
    siSummary = `🌾 කෘෂිකාර්මික ප්‍රවෘත්ති: ${article.title}`;
  } else if (article.category === 'market') {
    siSummary = `📊 වෙළඳපොළ යාවත්කාලීන: ${article.title}`;
  } else if (article.category === 'weather') {
    siSummary = `🌤️ කාලගුණ තොරතුරු: ${article.title}`;
  } else if (article.category === 'government') {
    siSummary = `🏛️ රජයේ නිවේදනය: ${article.title}`;
  } else {
    siSummary = `📰 ${article.title}`;
  }

  return siSummary;
}

/**
 * Simple translation helper for titles
 */
function translateToSinhala(text) {
  // Return a formatted Sinhala prefix with the original title
  return `📰 ප්‍රවෘත්ති: ${text}`;
}

/**
 * Extract key points from article
 */
function extractKeyPoints(article) {
  const text = `${article.title} ${article.description || ''}`;
  const keyPoints = [];

  // Extract numbers and statistics
  const numberMatches = text.match(/\d+(?:\.\d+)?%|\d+(?:,\d{3})*(?:\.\d+)?/g);
  if (numberMatches) {
    keyPoints.push({ type: 'stat', value: numberMatches[0] });
  }

  // Extract location mentions
  const locationMatches = text.match(/Sri Lanka|Colombo|Kandy|Galle|Jaffna|Anuradhapura/gi);
  if (locationMatches) {
    keyPoints.push({ type: 'location', value: [...new Set(locationMatches)][0] });
  }

  // Extract crop mentions
  const cropMatches = text.match(/rice|paddy|tea|vegetables|coconut|rubber|cinnamon/gi);
  if (cropMatches) {
    keyPoints.push({ type: 'crop', value: [...new Set(cropMatches)][0] });
  }

  return keyPoints;
}

/**
 * Send push notification to all subscribers
 */
async function sendPushNotification(article) {
  if (pushSubscriptions.length === 0) return;

  const payload = JSON.stringify({
    title: isUrgentNews(article) ? '🚨 Urgent: ' + article.title : '📰 ' + article.title,
    body: article.description?.slice(0, 100) + '...',
    icon: '/logo192.png',
    badge: '/logo192.png',
    data: {
      url: article.url,
      articleId: article.id,
      category: article.category,
      isUrgent: isUrgentNews(article)
    },
    actions: [
      { action: 'read', title: 'Read More' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  });

  const sendPromises = pushSubscriptions.map(async (subscription) => {
    try {
      await webpush.sendNotification(subscription, payload);
      return { success: true, endpoint: subscription.endpoint };
    } catch (error) {
      if (error.statusCode === 410) {
        // Subscription expired, remove it
        pushSubscriptions = pushSubscriptions.filter(s => s.endpoint !== subscription.endpoint);
      }
      return { success: false, error: error.message };
    }
  });

  return Promise.all(sendPromises);
}

/**
 * GET /api/news
 * Get agriculture news by category
 */
router.get('/', async (req, res) => {
  try {
    const { category = 'agriculture', refresh = false } = req.query;
    
    // Validate category
    const validCategories = Object.keys(categoryKeywords);
    const selectedCategory = validCategories.includes(category) ? category : 'agriculture';
    
    const articles = await fetchNews(selectedCategory, refresh === 'true');
    
    res.json({
      success: true,
      category: selectedCategory,
      count: articles.length,
      cacheAge: Math.round((Date.now() - newsCache[selectedCategory].timestamp) / 1000),
      articles
    });
  } catch (error) {
    console.error('News API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch news',
      articles: []
    });
  }
});

/**
 * GET /api/news/all
 * Get news from all categories
 */
router.get('/all', async (req, res) => {
  try {
    const categories = Object.keys(categoryKeywords);
    const allNews = {};
    
    for (const category of categories) {
      allNews[category] = await fetchNews(category);
    }
    
    res.json({
      success: true,
      categories: categoryNamesSi,
      news: allNews
    });
  } catch (error) {
    console.error('News API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch news'
    });
  }
});

/**
 * GET /api/news/headlines
 * Get top headlines across categories
 */
router.get('/headlines', async (req, res) => {
  try {
    const headlines = [];
    const categories = Object.keys(categoryKeywords);
    
    for (const category of categories) {
      const articles = await fetchNews(category);
      if (articles.length > 0) {
        headlines.push({
          ...articles[0],
          categoryName: categoryNamesSi[category]
        });
      }
    }
    
    // Sort by date
    headlines.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    
    res.json({
      success: true,
      count: headlines.length,
      headlines: headlines.slice(0, 5)
    });
  } catch (error) {
    console.error('Headlines API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch headlines'
    });
  }
});

/**
 * GET /api/news/search
 * Search news with custom query
 */
router.get('/search', async (req, res) => {
  try {
    const { q, crop } = req.query;
    
    if (!q && !crop) {
      return res.status(400).json({
        success: false,
        error: 'Search query required'
      });
    }

    let searchQuery = `Sri Lanka ${q || ''}`;
    if (crop) {
      searchQuery += ` ${crop}`;
    }

    const response = await axios.get(`${NEWS_API_BASE}/everything`, {
      params: {
        q: searchQuery.trim(),
        language: 'en',
        sortBy: 'relevancy',
        pageSize: 15,
        apiKey: NEWS_API_KEY
      },
      timeout: 10000
    });

    const articles = (response.data.articles || [])
      .filter(a => a.title && a.title !== '[Removed]')
      .map(article => ({
        id: generateArticleId(article),
        title: article.title,
        description: article.description,
        source: article.source?.name || 'Unknown',
        url: article.url,
        imageUrl: article.urlToImage,
        publishedAt: article.publishedAt,
        tags: ['search']
      }));

    res.json({
      success: true,
      query: searchQuery,
      count: articles.length,
      articles
    });
  } catch (error) {
    console.error('Search API error:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed'
    });
  }
});

/**
 * POST /api/news/click
 * Track article clicks for analytics
 */
router.post('/click', (req, res) => {
  const { articleId, category, userId } = req.body;
  
  if (!articleId) {
    return res.status(400).json({ success: false, error: 'Article ID required' });
  }

  // Update click stats
  if (!clickStats[articleId]) {
    clickStats[articleId] = { clicks: 0, category, users: [] };
  }
  clickStats[articleId].clicks++;
  if (userId && !clickStats[articleId].users.includes(userId)) {
    clickStats[articleId].users.push(userId);
  }

  // Update category stats
  if (category) {
    const categoryKey = `category_${category}`;
    if (!clickStats[categoryKey]) {
      clickStats[categoryKey] = { clicks: 0 };
    }
    clickStats[categoryKey].clicks++;
  }

  res.json({ success: true });
});

/**
 * GET /api/news/stats
 * Get click statistics
 */
router.get('/stats', (req, res) => {
  const categoryStats = {};
  const topArticles = [];

  for (const [key, value] of Object.entries(clickStats)) {
    if (key.startsWith('category_')) {
      categoryStats[key.replace('category_', '')] = value.clicks;
    } else {
      topArticles.push({ id: key, ...value });
    }
  }

  topArticles.sort((a, b) => b.clicks - a.clicks);

  res.json({
    success: true,
    categoryStats,
    topArticles: topArticles.slice(0, 10),
    totalClicks: Object.values(clickStats)
      .filter((v, k) => !String(k).startsWith('category_'))
      .reduce((sum, v) => sum + (v.clicks || 0), 0)
  });
});

/**
 * GET /api/news/categories
 * Get available categories
 */
router.get('/categories', (req, res) => {
  const { lang = 'en' } = req.query;
  
  const categories = Object.keys(categoryKeywords).map(key => ({
    id: key,
    name: lang === 'si' ? categoryNamesSi[key] : key.charAt(0).toUpperCase() + key.slice(1),
    icon: getCategoryIcon(key)
  }));

  res.json({
    success: true,
    categories,
    tagTranslations: lang === 'si' ? tagTranslations : {}
  });
});

/**
 * Get icon name for category
 */
function getCategoryIcon(category) {
  const icons = {
    agriculture: 'Leaf',
    market: 'TrendingUp',
    weather: 'Cloud',
    government: 'Building',
    technology: 'Cpu'
  };
  return icons[category] || 'Newspaper';
}

// Fallback mock data for demo/development
const mockNews = {
  agriculture: [
    {
      id: 'mock1',
      title: 'Sri Lanka Agriculture Ministry Launches New Farming Initiative',
      description: 'The Ministry of Agriculture announced a new program to support paddy farmers in the Dry Zone with improved irrigation facilities and subsidized seeds.',
      source: 'Daily News',
      url: 'https://www.dailynews.lk',
      imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
      publishedAt: new Date().toISOString(),
      category: 'agriculture',
      tags: ['agriculture', 'rice', 'government']
    },
    {
      id: 'mock2',
      title: 'Tea Exports Show Strong Recovery in Third Quarter',
      description: 'Ceylon tea exports have increased by 15% compared to last year, with major demand from Middle Eastern and European markets.',
      source: 'Ceylon Today',
      url: 'https://www.ceylontoday.lk',
      imageUrl: 'https://images.unsplash.com/photo-1582793988951-9aed5509eb97?w=400',
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      category: 'agriculture',
      tags: ['agriculture', 'tea', 'export']
    }
  ],
  market: [
    {
      id: 'mock3',
      title: 'Rice Prices Stabilize After Harvest Season',
      description: 'Local rice prices have stabilized following the successful Maha harvest, with Nadu rice now available at Rs. 180 per kg.',
      source: 'Sunday Observer',
      url: 'https://www.sundayobserver.lk',
      imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
      publishedAt: new Date(Date.now() - 172800000).toISOString(),
      category: 'market',
      tags: ['market', 'rice', 'price']
    }
  ],
  weather: [
    {
      id: 'mock4',
      title: 'Met Department Issues Advisory for Southwest Monsoon',
      description: 'Heavy rainfall expected in Western and Southern provinces. Farmers advised to take precautions for crops and livestock.',
      source: 'Ada Derana',
      url: 'https://www.adaderana.lk',
      imageUrl: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=400',
      publishedAt: new Date(Date.now() - 43200000).toISOString(),
      category: 'weather',
      tags: ['weather', 'monsoon']
    }
  ],
  government: [
    {
      id: 'mock5',
      title: 'Fertilizer Subsidy Program Extended for 2024',
      description: 'The government has decided to extend the fertilizer subsidy program for paddy farmers through the upcoming Yala season.',
      source: 'News First',
      url: 'https://www.newsfirst.lk',
      imageUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400',
      publishedAt: new Date(Date.now() - 259200000).toISOString(),
      category: 'government',
      tags: ['government', 'fertilizer', 'rice']
    }
  ],
  technology: [
    {
      id: 'mock6',
      title: 'Smart Farming App Helps 10,000 Sri Lankan Farmers',
      description: 'A locally developed mobile application is helping farmers identify crop diseases and get real-time weather updates.',
      source: 'Tech Lanka',
      url: 'https://www.techlanka.com',
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
      publishedAt: new Date(Date.now() - 345600000).toISOString(),
      category: 'technology',
      tags: ['technology', 'farming']
    }
  ]
};

/**
 * GET /api/news/demo
 * Get demo/mock news for development
 */
router.get('/demo', (req, res) => {
  const { category = 'agriculture' } = req.query;
  
  res.json({
    success: true,
    category,
    isDemo: true,
    articles: mockNews[category] || mockNews.agriculture
  });
});

/**
 * POST /api/news/summarize
 * Generate AI summary for an article
 */
router.post('/summarize', async (req, res) => {
  try {
    const { article, lang = 'en' } = req.body;
    
    if (!article || !article.id) {
      return res.status(400).json({
        success: false,
        error: 'Article data required'
      });
    }

    const summary = generateSummary(article, lang);
    
    res.json({
      success: true,
      articleId: article.id,
      summary
    });
  } catch (error) {
    console.error('Summary generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate summary'
    });
  }
});

/**
 * GET /api/news/tts-config
 * Get TTS configuration for Sinhala voice reading
 */
router.get('/tts-config', (req, res) => {
  // Sinhala TTS configuration
  const ttsConfig = {
    sinhalVoices: [
      { name: 'Google Sinhala', lang: 'si-LK', rate: 0.9, pitch: 1.0 },
      { name: 'Microsoft Sinhala', lang: 'si-LK', rate: 0.85, pitch: 1.0 }
    ],
    englishVoices: [
      { name: 'Google UK English Female', lang: 'en-GB', rate: 1.0, pitch: 1.0 },
      { name: 'Google US English', lang: 'en-US', rate: 1.0, pitch: 1.0 }
    ],
    // Common agricultural terms pronunciation hints for TTS
    pronunciationHints: {
      'Rs.': 'rupees',
      'kg': 'kilograms',
      'ha': 'hectares',
      'MT': 'metric tons',
      '%': 'percent',
      'paddy': 'pædi',
      'Maha': 'Maha',
      'Yala': 'Yala'
    },
    // Sinhala translations for TTS
    sinhalaTranslations: {
      headline: 'ප්‍රධාන පුවත',
      readMore: 'වැඩිදුර කියවන්න',
      source: 'මූලාශ්‍රය',
      agriculture: 'කෘෂිකර්මය',
      market: 'වෙළඳපොළ',
      weather: 'කාලගුණය',
      government: 'රජය',
      technology: 'තාක්ෂණය'
    }
  };

  res.json({
    success: true,
    config: ttsConfig
  });
});

/**
 * POST /api/news/prepare-tts
 * Prepare text for TTS reading
 */
router.post('/prepare-tts', (req, res) => {
  try {
    const { article, lang = 'en' } = req.body;
    
    if (!article) {
      return res.status(400).json({
        success: false,
        error: 'Article data required'
      });
    }

    // Prepare text for speech synthesis
    let textToRead = '';
    
    if (lang === 'si') {
      // Sinhala version
      const categoryNames = {
        agriculture: 'කෘෂිකාර්මික',
        market: 'වෙළඳපොළ',
        weather: 'කාලගුණ',
        government: 'රජයේ',
        technology: 'තාක්ෂණික'
      };
      
      textToRead = `${categoryNames[article.category] || ''} ප්‍රවෘත්ති. `;
      textToRead += `මාතෘකාව: ${article.title}. `;
      textToRead += `මූලාශ්‍රය: ${article.source}. `;
      textToRead += article.description || '';
    } else {
      // English version
      textToRead = `${article.category} News. `;
      textToRead += `Headline: ${article.title}. `;
      textToRead += `Source: ${article.source}. `;
      textToRead += article.description || '';
    }

    // Clean text for better TTS reading
    textToRead = textToRead
      .replace(/\[.*?\]/g, '')
      .replace(/<[^>]*>/g, '')
      .replace(/https?:\/\/[^\s]+/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Estimate reading time (words per minute)
    const wordCount = textToRead.split(' ').length;
    const estimatedSeconds = Math.ceil(wordCount / 2.5); // ~150 words/min for TTS

    res.json({
      success: true,
      text: textToRead,
      lang: lang === 'si' ? 'si-LK' : 'en-GB',
      estimatedDuration: estimatedSeconds,
      wordCount
    });
  } catch (error) {
    console.error('TTS preparation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to prepare text for speech'
    });
  }
});

/**
 * GET /api/news/vapid-public-key
 * Get VAPID public key for push notifications
 */
router.get('/vapid-public-key', (req, res) => {
  res.json({
    success: true,
    publicKey: VAPID_PUBLIC_KEY
  });
});

/**
 * POST /api/news/subscribe
 * Subscribe to push notifications
 */
router.post('/subscribe', (req, res) => {
  try {
    const subscription = req.body;
    
    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({
        success: false,
        error: 'Valid subscription object required'
      });
    }

    // Check if already subscribed
    const exists = pushSubscriptions.some(s => s.endpoint === subscription.endpoint);
    if (!exists) {
      pushSubscriptions.push(subscription);
      console.log('New push subscription added. Total:', pushSubscriptions.length);
    }

    res.json({
      success: true,
      message: 'Successfully subscribed to notifications',
      subscribed: true
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to subscribe'
    });
  }
});

/**
 * POST /api/news/unsubscribe
 * Unsubscribe from push notifications
 */
router.post('/unsubscribe', (req, res) => {
  try {
    const { endpoint } = req.body;
    
    if (!endpoint) {
      return res.status(400).json({
        success: false,
        error: 'Endpoint required'
      });
    }

    pushSubscriptions = pushSubscriptions.filter(s => s.endpoint !== endpoint);
    console.log('Push subscription removed. Total:', pushSubscriptions.length);

    res.json({
      success: true,
      message: 'Successfully unsubscribed'
    });
  } catch (error) {
    console.error('Unsubscription error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to unsubscribe'
    });
  }
});

/**
 * POST /api/news/test-notification
 * Send a test push notification
 */
router.post('/test-notification', async (req, res) => {
  try {
    if (pushSubscriptions.length === 0) {
      return res.json({
        success: false,
        message: 'No active subscriptions'
      });
    }

    const testArticle = {
      id: 'test-notification',
      title: 'Govi Isuru Test Notification',
      description: 'This is a test notification from Govi Isuru Agriculture News. Push notifications are working correctly!',
      category: 'agriculture',
      url: '#'
    };

    const results = await sendPushNotification(testArticle);
    const successful = results.filter(r => r.success).length;

    res.json({
      success: true,
      message: `Test notification sent to ${successful}/${pushSubscriptions.length} subscribers`,
      results
    });
  } catch (error) {
    console.error('Test notification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send test notification'
    });
  }
});

/**
 * POST /api/news/notify-urgent
 * Send notification for urgent news (called internally when urgent news detected)
 */
router.post('/notify-urgent', async (req, res) => {
  try {
    const { article } = req.body;
    
    if (!article) {
      return res.status(400).json({
        success: false,
        error: 'Article data required'
      });
    }

    if (!isUrgentNews(article)) {
      return res.json({
        success: true,
        message: 'Article is not urgent, no notification sent',
        isUrgent: false
      });
    }

    const results = await sendPushNotification(article);
    const successful = results ? results.filter(r => r.success).length : 0;

    res.json({
      success: true,
      isUrgent: true,
      message: `Urgent notification sent to ${successful} subscribers`,
      subscriberCount: pushSubscriptions.length
    });
  } catch (error) {
    console.error('Urgent notification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send urgent notification'
    });
  }
});

/**
 * GET /api/news/subscription-status
 * Check push notification subscription status
 */
router.get('/subscription-status', (req, res) => {
  res.json({
    success: true,
    subscriberCount: pushSubscriptions.length,
    isAvailable: true
  });
});

module.exports = router;
