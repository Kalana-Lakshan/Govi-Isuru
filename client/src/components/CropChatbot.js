import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, Send, Bot, User, Leaf, HelpCircle, X, Minimize2, Maximize2, RotateCcw, ImagePlus, Loader2, AlertTriangle, Lightbulb, Mic, MicOff } from 'lucide-react';
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const AI_API = process.env.REACT_APP_AI_URL || 'http://localhost:8000';


// Follow-up suggestions based on intent
const followUpSuggestions = {
  en: {
    FERTILIZER: [
      "When should I apply it?",
      "What about organic alternatives?",
      "How much per hectare?",
      "Any side effects to watch for?"
    ],
    DISEASE: [
      "How to prevent this disease?",
      "What are early warning signs?",
      "Is it contagious to other crops?",
      "Organic treatment options?"
    ],
    DISEASE_DIAGNOSIS: [
      "How to prevent this disease?",
      "What causes this disease?",
      "Will it spread to other plants?",
      "Best time to apply treatment?"
    ],
    PEST: [
      "Natural pest control methods?",
      "How to identify early infestation?",
      "What attracts these pests?",
      "Prevention tips?"
    ],
    PLANTING: [
      "Best seed varieties?",
      "Soil preparation tips?",
      "Spacing recommendations?",
      "Water needs after planting?"
    ],
    HARVEST: [
      "Storage tips after harvest?",
      "How to check grain moisture?",
      "Best time of day to harvest?",
      "Post-harvest processing?"
    ],
    WATER: [
      "How to save water?",
      "Signs of overwatering?",
      "Drought management tips?",
      "Best irrigation method?"
    ],
    WEATHER: [
      "Crop protection from rain?",
      "Heat stress management?",
      "Flood prevention tips?",
      "When to delay field work?"
    ],
    SHADE: [
      "Best shade trees for tea?",
      "How much shade is ideal?",
      "When to reduce shade?",
      "Shade tree spacing?"
    ],
    PRUNING: [
      "When to prune tea bushes?",
      "What height for pruning?",
      "Recovery time after pruning?",
      "Tools for pruning?"
    ],
    CHILI: [
      "How to prevent chili diseases?",
      "Best fertilizer for chili?",
      "When to harvest chili?",
      "Pest control for chili?"
    ],
    GREETING: [
      "What fertilizer for rice?",
      "How to treat plant diseases?",
      "Tea plucking tips?",
      "Upload a plant photo 📷"
    ],
    UNKNOWN: [
      "Tell me about rice farming",
      "Tea disease prevention?",
      "Fertilizer recommendations?",
      "Upload photo for diagnosis 📷"
    ]
  },
  si: {
    FERTILIZER: [
      "කවදා යෙදිය යුතුද?",
      "ජෛව විකල්ප මොනවාද?",
      "හෙක්ටයාරයකට කොපමණද?",
      "අතුරු ආබාධ තිබේද?"
    ],
    DISEASE: [
      "මෙම රෝගය වැළැක්වීමට කෙසේද?",
      "මුල් අනතුරු ඇඟවීම් මොනවාද?",
      "වෙනත් බෝගවලට පැතිරේද?",
      "ජෛව ප්‍රතිකාර විකල්ප?"
    ],
    DISEASE_DIAGNOSIS: [
      "මෙම රෝගය වැළැක්වීමට කෙසේද?",
      "මෙම රෝගයට හේතුව කුමක්ද?",
      "වෙනත් ශාකවලට පැතිරේද?",
      "ප්‍රතිකාර යෙදීමට හොඳම කාලය?"
    ],
    PEST: [
      "ස්වාභාවික පළිබෝධ පාලනය?",
      "මුල් ආසාදනය හඳුනා ගන්නේ කෙසේද?",
      "මෙම පළිබෝධයන් ආකර්ෂණය වන්නේ කුමකින්ද?",
      "වැළැක්වීමේ ඉඟි?"
    ],
    PLANTING: [
      "හොඳම බීජ ප්‍රභේද?",
      "පස සකස් කිරීමේ ඉඟි?",
      "පරතරය නිර්දේශ?",
      "වගා කිරීමෙන් පසු ජල අවශ්‍යතා?"
    ],
    HARVEST: [
      "අස්වනු නෙලීමෙන් පසු ගබඩා ඉඟි?",
      "ධාන්‍ය තෙතමනය පරීක්ෂා කරන්නේ කෙසේද?",
      "අස්වනු නෙලීමට හොඳම වේලාව?",
      "අස්වනු නෙලීමෙන් පසු සැකසීම?"
    ],
    WATER: [
      "ජලය ඉතිරි කරන්නේ කෙසේද?",
      "අධික ජලය යෙදීමේ සලකුණු?",
      "නියං කළමනාකරණ ඉඟි?",
      "හොඳම වාරිමාර්ග ක්‍රමය?"
    ],
    WEATHER: [
      "වැසි වලින් බෝග ආරක්ෂාව?",
      "තාප ආතතිය කළමනාකරණය?",
      "ගංවතුර වැළැක්වීමේ ඉඟි?",
      "කෙත් වැඩ ප්‍රමාද කළ යුත්තේ කවදාද?"
    ],
    SHADE: [
      "තේ සඳහා හොඳම සෙවන ගස්?",
      "කොපමණ සෙවනක් සුදුසුද?",
      "සෙවන අඩු කළ යුත්තේ කවදාද?",
      "සෙවන ගස් පරතරය?"
    ],
    PRUNING: [
      "තේ පඳුරු කප්පාදු කරන්නේ කවදාද?",
      "කප්පාදු සඳහා උස කොපමණද?",
      "කප්පාදු කිරීමෙන් පසු යථා කාලය?",
      "කප්පාදු මෙවලම්?"
    ],    CHILI: [
      "මිරිස් රෝග වැළැක්වීමට කෙසේද?",
      "මිරිස් සඳහා හොඳම පොහොර?",
      "මිරිස් අස්වැනු නෙලන්නේ කවදාද?",
      "මිරිස් පළිබෝධ පාලනය?"
    ],    GREETING: [
      "වී සඳහා පොහොර කුමක්ද?",
      "ශාක රෝග ප්‍රතිකාර කරන්නේ කෙසේද?",
      "තේ නෙලීමේ ඉඟි?",
      "ශාක ඡායාරූපයක් උඩුගත කරන්න 📷"
    ],
    UNKNOWN: [
      "වී වගාව ගැන කියන්න",
      "තේ රෝග වැළැක්වීම?",
      "පොහොර නිර්දේශ?",
      "රෝග විනිශ්චය සඳහා ඡායාරූපයක් 📷"
    ]
  }
};

const translations = {
  en: {
    title: "Crop Assistant",
    subtitle: "Ask me about farming!",
    placeholder: "Ask about rice, tea, chili, fertilizer, diseases...",
    send: "Send",
    typing: "Thinking...",
    source: "Source",
    suggestions: [
      "What fertilizer for rice in Yala?",
      "How to treat tea blister blight?",
      "When to harvest rice?",
      "Tea pruning advice"
    ],
    welcome: "👋 Hello! I'm your Govi Isuru farming assistant. Ask me about rice, tea, or chili - fertilizers, diseases, planting, or harvesting! You can also upload plant photos for disease diagnosis.",
    uploadImage: "Upload plant photo",
    analyzing: "Analyzing image...",
    diagnosisResult: "Disease Diagnosis",
    confidence: "Confidence",
    treatment: "Treatment",
    showHeatmap: "Show AI Focus",
    hideHeatmap: "Hide AI Focus",
    voiceListening: "Listening...",
    voiceNotSupported: "Voice input not supported in this browser",
    voiceError: "Could not recognize speech. Please try again.",
    tapToSpeak: "Tap to speak"
  },
  si: {
    title: "බෝග සහායක",
    subtitle: "ගොවිතැන් ගැන මගෙන් අහන්න!",
    placeholder: "වී, තේ, මිරිස්, පොහොර, රෝග ගැන අහන්න...",
    send: "යවන්න",
    typing: "සිතමින්...",
    source: "මූලාශ්‍රය",
    suggestions: [
      "යාල කන්නයේ වී සඳහා පොහොර?",
      "තේ බිබිලි රෝගයට ප්‍රතිකාර?",
      "වී අස්වනු නෙලන්නේ කවදාද?",
      "තේ කප්පාදු උපදෙස්"
    ],
    welcome: "👋 ආයුබෝවන්! මම ඔබේ ගොවි ඉසුරු ගොවිතැන් සහායකයා. වී, තේ හෝ මිරිස් ගැන - පොහොර, රෝග, වගා කිරීම හෝ අස්වැනු නෙලීම ගැන මගෙන් අහන්න! රෝග හඳුනා ගැනීමට ශාක ඡායාරූප ඉඩුගත කරන්න.",
    uploadImage: "ශාක ඡායාරූපය උඩුගත කරන්න",
    analyzing: "රූපය විශ්ලේෂණය කරමින්...",
    diagnosisResult: "රෝග විනිශ්චය",
    confidence: "විශ්වාසය",
    treatment: "ප්‍රතිකාර",
    showHeatmap: "AI අවධානය පෙන්වන්න",
    hideHeatmap: "AI අවධානය සඟවන්න",
    voiceListening: "සවන් දෙමින්...",
    voiceNotSupported: "මෙම බ්‍රවුසරයේ හඬ ආදානය සහාය නොදක්වයි",
    voiceError: "කථනය හඳුනා ගත නොහැකි විය. කරුණාකර නැවත උත්සාහ කරන්න.",
    tapToSpeak: "කතා කිරීමට තට්ටු කරන්න"
  }
};

// Component for displaying diagnosis images with Grad-CAM toggle
function DiagnosisImages({ originalImage, gradcamImage, disease, confidence, lang, t }) {
  const [showGradcam, setShowGradcam] = useState(false);
  
  return (
    <div className="mt-3 space-y-2">
      {/* Image comparison */}
      <div className="relative rounded-lg overflow-hidden bg-slate-100">
        <img 
          src={showGradcam ? gradcamImage : originalImage}
          alt={showGradcam ? "AI Analysis Heatmap" : "Original plant image"}
          className="w-full max-h-48 object-contain"
        />
        
        {/* Confidence badge */}
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold ${
          parseFloat(confidence) >= 70 ? 'bg-green-500 text-white' :
          parseFloat(confidence) >= 50 ? 'bg-yellow-500 text-white' :
          'bg-red-500 text-white'
        }`}>
          {confidence}%
        </div>
        
        {/* Grad-CAM indicator */}
        {showGradcam && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-purple-600 text-white rounded-full text-xs font-bold flex items-center gap-1">
            <span className="w-2 h-2 bg-red-400 rounded-full"></span>
            AI Focus
          </div>
        )}
      </div>
      
      {/* Toggle button */}
      <button
        onClick={() => setShowGradcam(!showGradcam)}
        className={`w-full text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
          showGradcam 
            ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}
      >
        {showGradcam ? (
          <>
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            {t.hideHeatmap}
          </>
        ) : (
          <>
            <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
            {t.showHeatmap}
          </>
        )}
      </button>
    </div>
  );
}

// Component for smart follow-up suggestions based on last bot response
function FollowUpSuggestions({ messages, lang, t, onSuggestionClick, isLoading }) {
  // Get last bot message to determine context
  const lastBotMessage = [...messages].reverse().find(msg => msg.type === 'bot' && msg.intent);
  const lastIntent = lastBotMessage?.intent || 'GREETING';
  
  // Get appropriate suggestions based on intent
  const suggestions = followUpSuggestions[lang]?.[lastIntent] || 
                      followUpSuggestions[lang]?.UNKNOWN ||
                      followUpSuggestions.en.UNKNOWN;
  
  // For initial state, use default suggestions
  const isInitial = messages.length <= 2;
  const displaySuggestions = isInitial ? t.suggestions : suggestions;
  
  if (isLoading) return null;
  
  return (
    <div className="px-4 pb-2 bg-slate-50">
      {/* Header for follow-up suggestions */}
      {!isInitial && (
        <div className="flex items-center gap-1 mb-2 text-xs text-slate-500">
          <Lightbulb size={12} className="text-yellow-500" />
          <span>{lang === 'si' ? 'යෝජිත ප්‍රශ්න:' : 'Suggested questions:'}</span>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2">
        {displaySuggestions.slice(0, 4).map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => onSuggestionClick(suggestion)}
            className="text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-full hover:bg-green-100 transition-colors border border-green-200 hover:border-green-300"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CropChatbot({ lang = 'en' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentContext, setCurrentContext] = useState({ crop: null, season: null });
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [selectedCropType, setSelectedCropType] = useState('rice'); // New: crop type for image analysis
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const t = translations[lang] || translations.en;

  // Initialize speech recognition
  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    
    // Set language based on app language
    recognition.lang = lang === 'si' ? 'si-LK' : 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      
      setInput(transcript);
      
      // If final result, send the message
      if (event.results[0].isFinal) {
        setIsListening(false);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      if (event.error === 'not-allowed') {
        alert(lang === 'si' 
          ? 'කරුණාකර මයික්‍රොෆෝන් ප්‍රවේශයට අවසර දෙන්න' 
          : 'Please allow microphone access');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [lang]);

  // Update recognition language when app language changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = lang === 'si' ? 'si-LK' : 'en-US';
    }
  }, [lang]);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 1,
        type: 'bot',
        text: t.welcome,
        timestamp: new Date()
      }]);
    }
  }, [lang]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text = input) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: text.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation history for context
      const history = messages
        .filter(msg => msg.type === 'user' || msg.type === 'bot')
        .map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.text,
          intent: msg.intent || null
        }));
      
      // Add current message to history
      history.push({ role: 'user', content: text.trim() });

      const response = await axios.post(`${API_BASE}/api/chatbot/chat`, {
        message: text.trim(),
        language: lang,
        history: history.slice(-10) // Send last 10 messages for context
      });

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: response.data.answer,
        source: response.data.source,
        intent: response.data.intent,
        context: response.data.context, // Store context for reference
        timestamp: new Date()
      };

      // Update current context if detected
      if (response.data.context) {
        setCurrentContext(prev => ({
          crop: response.data.context.crop || prev.crop,
          season: response.data.context.season || prev.season
        }));
      }

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: lang === 'si' 
          ? 'සමාවෙන්න, දෝෂයක් ඇති විය. කරුණාකර නැවත උත්සාහ කරන්න.'
          : 'Sorry, something went wrong. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  // Toggle voice input
  const toggleVoiceInput = () => {
    if (!speechSupported) {
      alert(t.voiceNotSupported);
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
      } catch (error) {
        console.error('Speech recognition start error:', error);
        // Recognition might already be running
        recognitionRef.current?.stop();
        setTimeout(() => {
          recognitionRef.current?.start();
        }, 100);
      }
    }
  };

  // Clear chat and reset context
  const clearChat = () => {
    setMessages([{
      id: Date.now(),
      type: 'bot',
      text: t.welcome,
      timestamp: new Date()
    }]);
    setCurrentContext({ crop: null, season: null });
  };

  // Handle image upload for disease diagnosis
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert(lang === 'si' ? 'කරුණාකර රූපයක් තෝරන්න' : 'Please select an image file');
      return;
    }

    // Create preview URL
    const imageUrl = URL.createObjectURL(file);

    // Add user message with image
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: lang === 'si' 
        ? `🔍 මෙම ${selectedCropType === 'tea' ? 'තේ' : selectedCropType === 'chili' ? 'මිරිස්' : 'වී'} ශාකයේ රෝගය හඳුනා ගන්න` 
        : `🔍 Diagnose this ${selectedCropType} plant`,
      image: imageUrl,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsAnalyzingImage(true);

    try {
      // Send image to AI service with crop type
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${AI_API}/predict/${selectedCropType}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const { prediction, confidence, treatment, gradcam } = response.data;
      
      // Get treatment text - can be array or string
      const treatmentText = Array.isArray(treatment) 
        ? treatment.join('\n• ') 
        : (treatment || 'No treatment information available');
      
      // Format confidence percentage
      const confidencePercent = (confidence * 100).toFixed(1);
      
      // Build diagnosis message
      const diagnosisText = lang === 'si' 
        ? `🔬 **${t.diagnosisResult}**\n\n🦠 **රෝගය:** ${prediction}\n📊 **${t.confidence}:** ${confidencePercent}%\n\n💊 **${t.treatment}:**\n• ${treatmentText}`
        : `🔬 **${t.diagnosisResult}**\n\n🦠 **Disease:** ${prediction}\n📊 **${t.confidence}:** ${confidencePercent}%\n\n💊 **${t.treatment}:**\n• ${treatmentText}`;

      // Get gradcam overlay image (with data URL prefix)
      const gradcamOverlay = gradcam?.overlay 
        ? `data:image/png;base64,${gradcam.overlay}` 
        : null;

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: diagnosisText,
        source: 'AI Crop Doctor (MobileNetV2 + Grad-CAM)',
        intent: 'DISEASE_DIAGNOSIS',
        gradcam: gradcamOverlay, // Store Grad-CAM overlay image
        originalImage: imageUrl,
        disease: prediction,
        confidence: confidencePercent,
        timestamp: new Date()
      };

      // Update context with detected disease
      setCurrentContext(prev => ({
        ...prev,
        crop: selectedCropType,
        disease: prediction
      }));

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Image analysis error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: lang === 'si' 
          ? '❌ රූපය විශ්ලේෂණය කිරීමට නොහැකි විය. AI සේවාව ක්‍රියාත්මක දැයි පරීක්ෂා කරන්න.'
          : '❌ Could not analyze the image. Please make sure the AI service is running on port 8000.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAnalyzingImage(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Floating chat button
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 z-50 flex items-center gap-2"
        title={t.title}
      >
        <MessageCircle size={24} />
        <span className="hidden md:inline font-bold">{t.title}</span>
      </button>
    );
  }

  // Minimized state
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 bg-green-600 text-white rounded-2xl shadow-2xl z-50 flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-green-700"
           onClick={() => setIsMinimized(false)}>
        <Bot size={20} />
        <span className="font-bold">{t.title}</span>
        <Maximize2 size={16} />
      </div>
    );
  }

  // Full chat window
  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-slate-200"
         style={{ height: '500px', maxHeight: 'calc(100vh - 6rem)' }}>
      
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Leaf size={20} />
          </div>
          <div>
            <h3 className="font-bold text-lg">{t.title}</h3>
            <div className="flex items-center gap-2">
              <p className="text-xs text-green-100">{t.subtitle}</p>
              {/* Context indicator */}
              {(currentContext.crop || currentContext.season) && (
                <div className="flex gap-1">
                  {currentContext.crop && (
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
                      🌾 {currentContext.crop}
                    </span>
                  )}
                  {currentContext.season && (
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
                      📅 {currentContext.season}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={clearChat} 
            className="hover:bg-white/20 p-2 rounded-lg transition-colors"
            title={lang === 'si' ? 'නව සංවාදය' : 'New chat'}
          >
            <RotateCcw size={18} />
          </button>
          <button onClick={() => setIsMinimized(true)} className="hover:bg-white/20 p-2 rounded-lg transition-colors">
            <Minimize2 size={18} />
          </button>
          <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-2 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                msg.type === 'user' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'
              }`}>
                {msg.type === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              
              {/* Message bubble */}
              <div className={`rounded-2xl px-4 py-3 ${
                msg.type === 'user' 
                  ? 'bg-green-600 text-white rounded-br-md' 
                  : 'bg-white text-slate-700 rounded-bl-md shadow-sm border border-slate-100'
              }`}>
                {/* User uploaded image */}
                {msg.image && msg.type === 'user' && (
                  <img 
                    src={msg.image} 
                    alt="Uploaded plant" 
                    className="rounded-lg mb-2 max-w-full max-h-40 object-cover"
                  />
                )}
                
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                
                {/* Grad-CAM visualization for diagnosis */}
                {msg.gradcam && (
                  <DiagnosisImages 
                    originalImage={msg.originalImage}
                    gradcamImage={msg.gradcam}
                    disease={msg.disease}
                    confidence={msg.confidence}
                    lang={lang}
                    t={t}
                  />
                )}
                
                {msg.source && (
                  <p className={`text-xs mt-2 pt-2 border-t ${
                    msg.type === 'user' ? 'border-green-500 text-green-100' : 'border-slate-100 text-slate-400'
                  }`}>
                    📚 {t.source}: {msg.source}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Image analyzing indicator */}
        {isAnalyzingImage && (
          <div className="flex justify-start">
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 text-slate-600">
                  <Loader2 size={16} className="animate-spin text-green-600" />
                  <span className="text-sm">{t.analyzing}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 text-slate-400">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                  <span className="text-xs">{t.typing}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Smart Follow-up Suggestions */}
      <FollowUpSuggestions 
        messages={messages}
        lang={lang}
        t={t}
        onSuggestionClick={handleSuggestionClick}
        isLoading={isLoading || isAnalyzingImage}
      />

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100">
        {/* Crop type selector for image analysis */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-slate-500">
            {lang === 'si' ? 'රෝග විනිශ්චය සඳහා බෝගය:' : 'Crop for diagnosis:'}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setSelectedCropType('rice')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedCropType === 'rice'
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🌾 {lang === 'si' ? 'වී' : 'Rice'}
            </button>
            <button
              onClick={() => setSelectedCropType('tea')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedCropType === 'tea'
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🍃 {lang === 'si' ? 'තේ' : 'Tea'}
            </button>
            <button
              onClick={() => setSelectedCropType('chili')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedCropType === 'chili'
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🌶️ {lang === 'si' ? 'මිරිස්' : 'Chili'}
            </button>
          </div>
        </div>

        {/* Voice listening indicator */}
        {isListening && (
          <div className="flex items-center justify-center gap-2 mb-3 py-2 bg-red-50 rounded-lg border border-red-200">
            <div className="relative">
              <Mic size={18} className="text-red-500" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            </div>
            <span className="text-sm text-red-600 font-medium">{t.voiceListening}</span>
            <div className="flex gap-1">
              <span className="w-1 h-3 bg-red-400 rounded-full animate-pulse"></span>
              <span className="w-1 h-4 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          {/* Image upload button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="chatbot-image-upload"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || isAnalyzingImage || isListening}
            className="bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 text-slate-600 disabled:text-slate-300 p-3 rounded-xl transition-colors flex items-center justify-center"
            title={t.uploadImage}
          >
            <ImagePlus size={20} />
          </button>
          
          {/* Voice input button */}
          {speechSupported && (
            <button
              onClick={toggleVoiceInput}
              disabled={isLoading || isAnalyzingImage}
              className={`p-3 rounded-xl transition-all flex items-center justify-center ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
              title={isListening ? t.voiceListening : t.tapToSpeak}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
          )}
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isListening ? t.voiceListening : t.placeholder}
            className={`flex-1 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
              isListening 
                ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                : 'border-slate-200 focus:ring-green-500'
            }`}
            disabled={isLoading || isAnalyzingImage}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading || isAnalyzingImage}
            className="bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white px-4 py-3 rounded-xl transition-colors flex items-center gap-2"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
