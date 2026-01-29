const axios = require('axios');

/**
 * Llama 3.3 70B Chatbot Service using Hugging Face Router API (OpenAI-compatible)
 * No local GPU required - uses cloud inference
 * Automatic fallback to Llama 3.1 8B on cold starts (503 errors)
 */

const HUGGINGFACE_API_URL = 'https://router.huggingface.co/v1/chat/completions';
const PRIMARY_MODEL = 'meta-llama/Llama-3.3-70B-Instruct';
const FALLBACK_MODEL = 'meta-llama/Llama-3.1-8B-Instruct';
const HF_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN || '';

/**
 * Call AI model via Hugging Face Router API (OpenAI-compatible format)
 * @param {Array} messages - Chat messages in format [{role: 'user', content: 'text'}]
 * @param {Object} options - Additional options (temperature, max_tokens, etc.)
 * @param {string} modelName - Model to use (PRIMARY_MODEL or FALLBACK_MODEL)
 * @returns {Promise<string>} - AI response
 */
async function callModelAPI(messages, options = {}, modelName = PRIMARY_MODEL) {
  if (!HF_API_TOKEN) {
    throw new Error('HUGGINGFACE_API_TOKEN not set in environment variables');
  }

  try {
    const language = options.language || 'en';
    const languageInstruction = language === 'si' 
      ? '\n\n**IMPORTANT**: Please respond in Sinhala (සිංහල) language.'
      : '\n\n**IMPORTANT**: Please respond in English.';

    // Add system message for agricultural context with platform knowledge
    const systemMessage = {
      role: 'system',
      content: `You are an expert agricultural assistant for the Govi Isuru (ගොවි ඉසුරු) - Smart Farming Platform for Sri Lanka. You have two primary roles:

1. AGRICULTURAL EXPERT: Provide helpful, accurate advice about:
   - Rice, Tea, and Chili cultivation
   - Crop diseases and pest management
   - Fertilizer recommendations and application timing
   - Planting and harvesting techniques
   - Weather-based farming advice
   - Market trends and pricing
   - Yield prediction and profit calculations

2. PLATFORM GUIDE: Help users navigate and use the Govi Isuru platform features:

**Main Features & Navigation:**
- **AI Crop Doctor**: Upload crop leaf photos to detect diseases across Rice (8 diseases), Tea (5 diseases), and Chili (4 diseases). Get Grad-CAM visualization showing where AI focuses, confidence scores, and bilingual treatment recommendations.
- **AgroLink Marketplace**: Peer-to-peer trading platform with farmer reputation system, ratings, and direct buyer-seller communication via WhatsApp/phone.
- **Market Intelligence**: View price trends for Rice, Chili, Tea across 6 months. Compare prices across districts (Dambulla, Colombo, Kandy, etc.) with interactive charts.
- **Weather Advisory**: Real-time weather with 5-day forecast, humidity warnings for fungal diseases, rain alerts for fertilizer timing, and temperature advisories.
- **Yield Prediction**: AI-powered paddy yield forecasting for all 25 Sri Lankan districts, profit calculator, ROI analysis, and risk assessment with early warnings.
- **Community Disease Alerts**: Location-based alerts for your GN Division, severity indicators, outbreak detection when multiple cases reported nearby.
- **Agricultural News**: Multi-category news (Agriculture, Market, Weather, Government, Tech) with AI summaries, Sinhala translation, and text-to-speech in both languages.
- **AI Chatbot**: That's me! Ask farming questions, upload images for disease diagnosis, use voice input (English/Sinhala), and get context-aware suggestions.

**How to Navigate:**
- **Top Navigation Bar**: Shows "Govi Isuru" logo, language toggle (English/Sinhala), and user info with logout button
- **Left Sidebar**: Access all features via icon menu:
  - 🌾 Home Dashboard
  - 🤖 AI Crop Doctor  
  - 🛒 Marketplace
  - 📊 Market Trends
  - 🌤️ Weather Advisory
  - 🚨 Disease Alerts
  - 📰 Agricultural News
  - 📈 Yield Prediction
- **Logout**: Click your username/profile button in the top-right corner, then select "Logout" from dropdown menu

**Government Officer Features:**
- Officer Dashboard for verifying disease reports
- Field visit scheduling and management
- Performance monitoring and leaderboards
- Internal notes and priority flagging

**User Actions:**
- To logout: Click your profile icon in top-right → Select "Logout"
- To switch language: Click "English/සිංහල" toggle button in top navigation
- To report disease: Use AI Doctor or go to Disease Alerts section
- To post listing: Go to Marketplace → Click "Post Listing" button
- To check weather: Click Weather Advisory in sidebar
- To predict yield: Go to Yield Prediction → Enter district, season, year

Provide clear, step-by-step instructions when users ask "how do I..." questions. Keep agricultural advice concise and practical. Support both English and Sinhala when appropriate.${languageInstruction}`
    };

    const allMessages = [systemMessage, ...messages];

    // OpenAI-compatible request format - no token limit restriction
    const payload = {
      model: modelName,
      messages: allMessages,
      max_tokens: options.max_tokens || 4096,  // Allow full responses
      temperature: options.temperature || 0.6, // 0.6 for factual farming advice
      top_p: options.top_p || 0.9,
    };

    const response = await axios.post(
      HUGGINGFACE_API_URL,
      payload,
      {
        headers: {
          Authorization: `Bearer ${HF_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000, // 60 second timeout
      }
    );

    // Log the full response for debugging
    console.log('API Response Status:', response.status);
    console.log('API Response Data:', JSON.stringify(response.data, null, 2));

    // Extract response in OpenAI format: choices[0].message.content
    if (response.data?.choices && response.data.choices[0]?.message?.content) {
      const content = response.data.choices[0].message.content.trim();
      console.log('Extracted content:', content);
      return content;
    }

    // Check alternative response formats
    if (response.data?.generated_text) {
      console.log('Using generated_text format');
      return response.data.generated_text.trim();
    }

    if (Array.isArray(response.data) && response.data[0]?.generated_text) {
      console.log('Using array format');
      return response.data[0].generated_text.trim();
    }

    console.error('Unexpected response format:', JSON.stringify(response.data, null, 2));
    throw new Error('Unexpected response format from Hugging Face Router API');
  } catch (error) {
    if (error.response) {
      // API error response
      console.error('Hugging Face Router API Error:', error.response.data);
      
      // Handle model loading error (common when model is cold)
      if (error.response.status === 503) {
        throw new Error('Model is loading, please try again in 20 seconds');
      }
      
      // Handle 404 - model not found or endpoint issue
      if (error.response.status === 404) {
        throw new Error('Model endpoint not found. Please check the model name and API access.');
      }
      
      const errorMsg = error.response.data?.error || error.response.data?.message || error.message;
      throw new Error(`Hugging Face API Error: ${errorMsg}`);
    } else if (error.request) {
      // Network error
      console.error('Network Error:', error.message);
      throw new Error('Failed to connect to Hugging Face Router API');
    } else {
      console.error('Error:', error.message);
      throw error;
    }
  }
}

/**
 * Generate chatbot response using Llama 3.3 70B with automatic Llama 3.1 8B fallback
 * @param {string} userMessage - User's message
 * @param {Array} history - Conversation history
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} - Response object
 */
async function generateResponse(userMessage, history = [], options = {}) {
  try {
    // Build messages array
    const messages = [];
    
    // Add history (limit to last 10 messages to stay within context)
    const recentHistory = history.slice(-10);
    for (const msg of recentHistory) {
      messages.push({
        role: msg.role,
        content: msg.content,
      });
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: userMessage,
    });

    let response;
    let modelUsed = PRIMARY_MODEL;

    // Try primary model (Llama 3.3 70B) first
    try {
      response = await callModelAPI(messages, options, PRIMARY_MODEL);
    } catch (error) {
      // Automatic fallback to Llama 3.1 8B on cold start or 503 errors
      if (error.message.includes('loading') || 
          error.message.includes('503') || 
          error.message.includes('Model is loading')) {
        console.log('Primary model cold, falling back to Llama 3.1 8B...');
        response = await callModelAPI(messages, options, FALLBACK_MODEL);
        modelUsed = FALLBACK_MODEL;
      } else {
        throw error; // Re-throw if not a cold start error
      }
    }

    return {
      success: true,
      answer: response,
      model: modelUsed.split('/')[1], // Extract model name
      source: 'Hugging Face Router API',
    };
  } catch (error) {
    console.error('Chatbot error:', error.message);
    return {
      success: false,
      error: error.message,
      fallback: "I'm having trouble connecting to the AI service right now. Please try again in a moment.",
    };
  }
}

module.exports = {
  generateResponse,
  callModelAPI,
};