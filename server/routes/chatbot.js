const express = require('express');
const router = express.Router();
const { detectIntent, detectSeason, detectCrop, detectDisease, detectLanguage } = require('../utils/intentDetector');
const knowledge = require('../knowledge/agriculture.json');

// Predefined greeting responses
const greetings = {
  en: [
    "Hello! I'm your Govi Isuru farming assistant. Ask me about fertilizers, diseases, planting, or harvesting!",
    "Welcome farmer! How can I help you today? I can provide advice on rice cultivation, pest control, and more.",
    "Ayubowan! Ready to help with your farming questions. What would you like to know?"
  ],
  si: [
    "ආයුබෝවන්! මම ඔබේ ගොවි ඉසුරු ගොවිතැන් සහායකයා. පොහොර, රෝග, වගා කිරීම හෝ අස්වනු නෙලීම ගැන මගෙන් අහන්න!",
    "ගොවි මහත්තයා/මහත්මිය, ආයුබෝවන්! අද ඔබට මට උදව් කරන්නේ කෙසේද? වී වගාව, පළිබෝධ පාලනය සහ තවත් දේ ගැන උපදෙස් දිය හැක.",
    "ආයුබෝවන්! ඔබේ ගොවිතැන් ප්‍රශ්නවලට උදව් කිරීමට සූදානම්. ඔබ දැන ගැනීමට කැමති දේ කුමක්ද?"
  ]
};

// Fallback responses
const fallbacks = {
  en: [
    "I'm not sure about that. Could you ask about fertilizers, diseases, planting, or harvesting for rice?",
    "I don't have information on that topic yet. Try asking about rice cultivation, pest control, or weather advice!",
    "Sorry, I couldn't understand. Please try asking about farming topics like fertilizer, diseases, or water management."
  ],
  si: [
    "ඒ ගැන මට විශ්වාස නැත. වී සඳහා පොහොර, රෝග, වගා කිරීම හෝ අස්වනු නෙලීම ගැන අහන්න පුළුවන්ද?",
    "එම මාතෘකාව ගැන මට තවම තොරතුරු නැත. වී වගාව, පළිබෝධ පාලනය හෝ කාලගුණ උපදෙස් ගැන අහන්න!",
    "සමාවෙන්න, මට තේරුණේ නැත. පොහොර, රෝග හෝ ජල කළමනාකරණය වැනි ගොවිතැන් මාතෘකා ගැන අහන්න."
  ]
};

// Check if message is a greeting
function isGreeting(message) {
  const greetingPatterns = ['hello', 'hi', 'hey', 'ayubowan', 'ආයුබෝවන්', 'හෙලෝ', 'help', 'start'];
  return greetingPatterns.some(pattern => message.toLowerCase().includes(pattern));
}

// Get random item from array
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Extract context from conversation history
function extractContextFromHistory(history) {
  const context = {
    crop: null,
    season: null,
    disease: null,
    lastTopic: null
  };

  if (!history || history.length === 0) return context;

  // Go through history in reverse to find most recent context
  for (let i = history.length - 1; i >= 0; i--) {
    const msg = history[i];
    if (msg.role === 'user') {
      const text = msg.content;
      
      // Extract crop if not found yet
      if (!context.crop) {
        context.crop = detectCrop(text);
      }
      
      // Extract season if not found yet
      if (!context.season) {
        context.season = detectSeason(text);
      }
      
      // Extract disease if not found yet
      if (!context.disease) {
        context.disease = detectDisease(text);
      }
    }
    
    // Track last topic from bot response
    if (msg.role === 'assistant' && msg.intent && !context.lastTopic) {
      context.lastTopic = msg.intent;
    }
  }

  return context;
}

// Handle follow-up questions that reference previous context
function isFollowUpQuestion(message) {
  const followUpPatterns = [
    'what about', 'how about', 'and for', 'same for',
    'also', 'what if', 'in that case', 'then',
    'more info', 'more details', 'tell me more',
    'ඒ ගැන', 'ඒකත්', 'තව', 'ඒ වගේම'
  ];
  const msg = message.toLowerCase();
  return followUpPatterns.some(pattern => msg.includes(pattern));
}

// Main chat endpoint
router.post('/chat', (req, res) => {
  const { message, crop: userCrop, season: userSeason, language: userLanguage, history } = req.body;

  if (!message || message.trim() === '') {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Auto-detect language if not provided
  const language = userLanguage || detectLanguage(message);
  const langKey = language === 'si' ? 'si' : 'en';

  // Check for greeting
  if (isGreeting(message)) {
    return res.json({
      answer: getRandomItem(greetings[langKey]),
      intent: 'GREETING',
      source: 'Govi Isuru Assistant'
    });
  }

  // Extract context from conversation history
  const historyContext = extractContextFromHistory(history || []);
  const isFollowUp = isFollowUpQuestion(message);

  // Detect intent, crop, and season from current message
  const currentIntent = detectIntent(message);
  const currentCrop = detectCrop(message);
  const currentSeason = detectSeason(message);
  const currentDisease = detectDisease(message);

  // Use current detection, fall back to history context, then user override
  const intent = currentIntent !== 'UNKNOWN' ? currentIntent : (isFollowUp ? historyContext.lastTopic : 'UNKNOWN');
  const crop = userCrop || currentCrop || historyContext.crop || 'rice';
  const season = userSeason || currentSeason || historyContext.season;
  const specificDisease = currentDisease || historyContext.disease;

  let response = null;
  let source = 'Department of Agriculture Sri Lanka Guidelines';

  // Add context acknowledgment for follow-up questions
  let contextPrefix = '';
  if (isFollowUp && historyContext.crop && !currentCrop) {
    contextPrefix = langKey === 'si' 
      ? `${historyContext.crop === 'rice' ? 'වී' : historyContext.crop} සඳහා: `
      : `For ${historyContext.crop}: `;
  }

  try {
    // Handle different intents
    switch (intent) {
      case 'FERTILIZER':
        if (knowledge[crop] && knowledge[crop][season] && knowledge[crop][season].fertilizer) {
          response = langKey === 'si' 
            ? knowledge[crop][season].fertilizer.si 
            : knowledge[crop][season].fertilizer.recommendation;
        } else if (knowledge[crop] && knowledge[crop].general && knowledge[crop].general.fertilizer) {
          response = langKey === 'si'
            ? knowledge[crop].general.fertilizer.si
            : knowledge[crop].general.fertilizer.recommendation;
        }
        break;

      case 'DISEASE':
        if (specificDisease && knowledge[crop] && knowledge[crop].diseases && knowledge[crop].diseases[specificDisease]) {
          const diseaseInfo = knowledge[crop].diseases[specificDisease];
          response = langKey === 'si' 
            ? diseaseInfo.si 
            : `${diseaseInfo.symptoms || ''} ${diseaseInfo.treatment}`;
        } else if (knowledge[crop] && knowledge[crop].diseases) {
          // Give general disease info
          const diseases = Object.keys(knowledge[crop].diseases);
          const firstDisease = knowledge[crop].diseases[diseases[0]];
          response = langKey === 'si'
            ? `${diseases.length} රෝග හඳුනාගෙන ඇත. ${firstDisease.si || firstDisease.treatment}`
            : `I can help with ${diseases.length} diseases: ${diseases.join(', ')}. Ask about a specific one for detailed advice.`;
        }
        break;

      case 'PEST':
        if (knowledge[crop] && knowledge[crop].pests) {
          const pests = Object.values(knowledge[crop].pests);
          const firstPest = pests[0];
          response = langKey === 'si'
            ? firstPest.si || firstPest.treatment
            : `${firstPest.symptoms} Treatment: ${firstPest.treatment}`;
        }
        break;

      case 'PLANTING':
        if (knowledge[crop] && knowledge[crop][season] && knowledge[crop][season].planting) {
          response = langKey === 'si'
            ? knowledge[crop][season].planting.si
            : knowledge[crop][season].planting.recommendation;
        }
        break;

      case 'HARVEST':
        if (knowledge[crop] && knowledge[crop][season] && knowledge[crop][season].harvest) {
          response = langKey === 'si'
            ? knowledge[crop][season].harvest.si
            : knowledge[crop][season].harvest.recommendation;
        }
        break;

      case 'WATER':
        if (knowledge[crop] && knowledge[crop].water_management) {
          response = langKey === 'si'
            ? knowledge[crop].water_management.si
            : knowledge[crop].water_management.recommendation;
        }
        break;

      case 'WEATHER':
        if (knowledge.weather_advice) {
          const weatherTypes = Object.values(knowledge.weather_advice);
          const advice = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
          response = langKey === 'si'
            ? advice.si
            : advice.recommendation;
          source = 'Weather Advisory System';
        }
        break;

      case 'ORGANIC':
        if (knowledge.organic_farming) {
          const topics = Object.values(knowledge.organic_farming);
          const tip = topics[Math.floor(Math.random() * topics.length)];
          response = langKey === 'si'
            ? tip.si
            : tip.recommendation;
          source = 'Organic Farming Guidelines';
        }
        break;

      case 'GOVERNMENT':
        if (knowledge.government_schemes) {
          const schemes = Object.values(knowledge.government_schemes);
          response = schemes.map(s => langKey === 'si' ? s.si : s.info).join(' ');
          source = 'Government of Sri Lanka Agricultural Services';
        }
        break;

      default:
        response = null;
    }
  } catch (error) {
    console.error('Chatbot error:', error);
  }

  // If no response found, use fallback
  if (!response) {
    return res.json({
      answer: getRandomItem(fallbacks[langKey]),
      intent: 'UNKNOWN',
      detected: { crop, season, intent },
      source: 'Govi Isuru Assistant',
      context: { crop, season, disease: specificDisease }
    });
  }

  // Add context prefix for follow-up questions
  const finalResponse = contextPrefix + response;

  res.json({
    answer: finalResponse,
    intent,
    detected: { crop, season, language: langKey },
    source,
    context: { crop, season, disease: specificDisease }
  });
});

// Quick help endpoint - returns available topics
router.get('/topics', (req, res) => {
  res.json({
    topics: {
      en: [
        'Fertilizer recommendations',
        'Disease identification & treatment',
        'Pest control',
        'Planting advice',
        'Harvest timing',
        'Water management',
        'Weather-based advice',
        'Organic farming tips',
        'Government schemes & subsidies'
      ],
      si: [
        'පොහොර නිර්දේශ',
        'රෝග හඳුනාගැනීම සහ ප්‍රතිකාර',
        'පළිබෝධ පාලනය',
        'වගා උපදෙස්',
        'අස්වනු නෙලීමේ කාලය',
        'ජල කළමනාකරණය',
        'කාලගුණ පදනම් උපදෙස්',
        'ජෛව ගොවිතැන් ඉඟි',
        'රජයේ යෝජනා ක්‍රම සහ සහනාධාර'
      ]
    },
    crops: ['rice', 'vegetables'],
    seasons: ['yala', 'maha']
  });
});

module.exports = router;
