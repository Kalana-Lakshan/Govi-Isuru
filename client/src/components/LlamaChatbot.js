import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles, Languages, Mic, MicOff, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function LlamaChatbot({ lang = 'en' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatLang, setChatLang] = useState('en'); // Internal language state for chatbot
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const retryCountRef = useRef(0);
  const manualStopRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Initialize speech recognition (only once on mount)
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;
      recognitionRef.current.lang = 'en-US'; // Default language
      
      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started successfully');
        retryCountRef.current = 0;
        setIsListening(true);
        setError(null);
      };
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Speech recognized:', transcript);
        retryCountRef.current = 0;
        setInput(transcript);
        manualStopRef.current = true;
        recognitionRef.current.stop();
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error, event);
        
        // Don't reset if it's just an aborted error
        if (event.error === 'aborted') {
          console.log('Recognition aborted (user stopped or restart)');
          return;
        }
        
        // Reset listening state
        setIsListening(false);
        
        // Handle specific errors with user-friendly messages
        let errorMessage = '';
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        
        switch(event.error) {
          case 'no-speech':
            errorMessage = chatLang === 'si'
              ? '🎤 කථාවක් අනාවරණය නොවිය. නැවත උත්සාහ කරන්න.'
              : '🎤 No speech detected. Please try again.';
            setTimeout(() => setError(null), 3000);
            break;
          case 'network':
            // Network errors mean the speech API couldn't connect to Google's servers
            console.log('Network error - Speech API requires connection to Google servers');
            errorMessage = chatLang === 'si' 
              ? '⚠️ හඬ සේවාවට සම්බන්ධ විය නොහැක. VPN/Firewall අක්‍රිය කර නැවත උත්සාහ කරන්න.'
              : '⚠️ Cannot connect to voice service. Try disabling VPN/Firewall, or just type your message.';
            setTimeout(() => setError(null), 5000);
            break;
          case 'not-allowed':
          case 'permission-denied':
            errorMessage = chatLang === 'si'
              ? '🎤 මයික්‍රොෆෝන් අවසර අවශ්‍යයි. URL ලිපිනයේ 🔒 ක්ලික් කර අවසර දෙන්න.'
              : '🎤 Microphone permission denied. Click 🔒 in URL bar to allow.';
            setTimeout(() => setError(null), 5000);
            break;
          case 'audio-capture':
            errorMessage = chatLang === 'si'
              ? '🎤 මයික්‍රොෆෝනය සොයාගත නොහැක.'
              : '🎤 No microphone found.';
            setTimeout(() => setError(null), 4000);
            break;
          case 'service-not-allowed':
            errorMessage = chatLang === 'si'
              ? '🔒 හඬ ආදානය HTTPS හෝ localhost හි පමණක් ක්‍රියා කරයි.'
              : '🔒 Voice input requires HTTPS or localhost.';
            setTimeout(() => setError(null), 5000);
            break;
          default:
            console.log('Unknown speech error:', event.error);
            errorMessage = chatLang === 'si'
              ? `⚠️ හඬ ආදානය දෝෂයකි. නැවත උත්සාහ කරන්න.`
              : `⚠️ Voice error (${event.error}). Please try again.`;
            setTimeout(() => setError(null), 4000);
        }
        
        if (errorMessage) {
          setError(errorMessage);
        }
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended, manualStop:', manualStopRef.current);
        manualStopRef.current = false;
        setIsListening(false);
      };
    }
    
    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // Ignore errors on cleanup
        }
      }
    };
  }, []); // Only run once on mount

  // Update speech recognition language when chatLang changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = chatLang === 'si' ? 'si-LK' : 'en-US';
    }
  }, [chatLang]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      setError(chatLang === 'si' 
        ? '❌ ඔබේ බ්‍රවුසරය හඬ ආදානය සඳහා සහාය නොදක්වයි. Chrome හෝ Edge භාවිතා කරන්න.'
        : '❌ Voice input not supported. Please use Chrome or Edge browser.');
      setTimeout(() => setError(null), 5000);
      return;
    }

    if (isListening) {
      manualStopRef.current = true;
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log('Error stopping recognition:', e);
      }
      setIsListening(false);
    } else {
      manualStopRef.current = false;
      setError(null);
      retryCountRef.current = 0;
      
      // Update language
      recognitionRef.current.lang = chatLang === 'si' ? 'si-LK' : 'en-US';
      
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        
        // Handle "already started" error - stop and retry
        if (error.name === 'InvalidStateError' || 
            (error.message && error.message.includes('already started'))) {
          console.log('Recognition already running, stopping and retrying...');
          try {
            recognitionRef.current.stop();
          } catch (e) {
            // Ignore
          }
          setTimeout(() => {
            try {
              recognitionRef.current.start();
            } catch (e) {
              console.error('Retry start failed:', e);
              setError(chatLang === 'si'
                ? '⚠️ හඬ ආදානය ආරම්භ කිරීමට නොහැකි විය.'
                : '⚠️ Could not start voice input. Please try again.');
              setTimeout(() => setError(null), 3000);
            }
          }, 200);
          return;
        }
        
        setError(chatLang === 'si'
          ? '⚠️ හඬ ආදානය ආරම්භ කිරීමට නොහැකි විය. මයික්‍රොෆෝන් අවසර දෙන්න හෝ නැවත උත්සාහ කරන්න.'
          : '⚠️ Could not start voice input. Please allow microphone access and try again.');
        setTimeout(() => setError(null), 5000);
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add welcome message when chatbot opens for the first time
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content:
            chatLang === 'si'
              ? 'ආයුබෝවන්! මම Llama 3.3 70B AI සහායකයා. වී, තේ සහ මිරිස් ගොවිතැන ගැන ඔබට උදව් කළ හැක. ප්ලැට්ෆෝම් භාවිතය ගැනත් මම උදව් කරන්නම්. ඔබේ ප්‍රශ්නය අහන්න!'
              : 'Hello! I\'m your Llama 3.3 70B AI assistant. I can help with rice, tea, and chili cultivation, and guide you on using the platform. What would you like to know?',
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length, chatLang]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Prepare conversation history for API
      const history = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await axios.post(`${API_BASE}/api/llama-chatbot/chat`, {
        message: userMessage.content,
        history: history,
        options: {
          temperature: 0.6,
          max_tokens: 512,
          language: chatLang, // Pass language preference
        },
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.answer,
        timestamp: new Date(),
        model: response.data.model,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Llama chatbot error:', err);
      
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      
      if (err.response?.status === 503) {
        errorMessage = err.response.data.fallback || 'The AI model is loading. Please wait 20 seconds and try again.';
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (!navigator.onLine) {
        errorMessage = 'No internet connection. Please check your network.';
      }

      setError(errorMessage);
      
      // Add error message to chat
      const errorMsg = {
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
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

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 text-white p-4 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 z-50 group border border-emerald-400/20"
          aria-label="Open AI Chat"
        >
          <div className="relative">
            <MessageCircle size={28} className="drop-shadow-sm" />
            <Sparkles
              size={14}
              className="absolute -top-1 -right-1 text-yellow-300 animate-pulse drop-shadow-sm"
            />
          </div>
          <span className="absolute bottom-full right-0 mb-3 px-4 py-2 bg-slate-800 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
            🤖 AI Assistant
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 text-white p-5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                <Sparkles size={20} className="drop-shadow-sm" />
              </div>
              <div>
                <h3 className="font-bold text-lg drop-shadow-sm">AI Farming Assistant</h3>
                <p className="text-xs text-emerald-50 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                  Powered by Llama 3.3
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Language Toggle Button */}
              <button
                onClick={() => setChatLang(chatLang === 'en' ? 'si' : 'en')}
                className="hover:bg-white/20 backdrop-blur-sm p-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 border border-white/10"
                aria-label="Toggle language"
                title={chatLang === 'en' ? 'Switch to Sinhala' : 'Switch to English'}
              >
                <Languages size={18} />
                <span className="text-xs font-semibold">{chatLang === 'en' ? 'EN' : 'සිං'}</span>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 backdrop-blur-sm p-2 rounded-xl transition-all duration-200 border border-white/10"
                aria-label="Close chat"
              >
                <X size={22} />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-slate-50 to-white">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-br-md'
                      : message.isError
                      ? 'bg-red-50 text-red-800 rounded-bl-md border border-red-200'
                      : 'bg-white text-slate-800 rounded-bl-md border border-slate-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                    {message.content}
                  </p>
                  <p
                    className={`text-xs mt-2 flex items-center gap-1 ${
                      message.role === 'user'
                        ? 'text-emerald-100'
                        : message.isError
                        ? 'text-red-600'
                        : 'text-slate-400'
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-slate-800 p-4 rounded-2xl rounded-bl-md shadow-sm border border-slate-200">
                  <div className="flex items-center gap-2">
                    <Loader2 size={18} className="animate-spin text-emerald-500" />
                    <span className="text-sm text-slate-600 font-medium">
                      AI is thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-5 border-t border-slate-200 bg-white">
            {error && (
              <div className="mb-3 text-xs text-red-700 bg-red-50 p-3 rounded-xl border border-red-200 flex items-start gap-2">
                <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  isListening
                    ? (chatLang === 'si' ? '🎤 සවන් දෙනවා...' : '🎤 Listening...')
                    : (chatLang === 'si'
                        ? 'ඔබගේ ප්‍රශ්නය ටයිප් කරන්න...'
                        : 'Type your question...')
                }
                className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-slate-50 text-slate-800 placeholder-slate-400"
                disabled={isLoading || isListening}
              />
              {/* Voice input - show on HTTPS or localhost/127.0.0.1 */}
              {(window.location.protocol === 'https:' || 
                window.location.hostname === 'localhost' || 
                window.location.hostname === '127.0.0.1') && (
                <button
                  onClick={toggleVoiceInput}
                  disabled={isLoading}
                  className={`${
                    isListening
                      ? 'bg-gradient-to-br from-red-500 to-red-600 animate-pulse shadow-lg'
                      : 'bg-gradient-to-br from-blue-500 to-blue-600 hover:shadow-lg'
                  } text-white p-3 rounded-xl disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-200 border border-transparent`}
                  aria-label={isListening ? 'Stop recording' : 'Start voice input'}
                  title={isListening ? 'Stop recording' : 'Voice input'}
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
              )}
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-br from-emerald-500 to-green-600 text-white p-3 rounded-xl hover:shadow-lg disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-200 border border-transparent"
                aria-label="Send message"
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-3 text-center flex items-center justify-center gap-1">
              <Sparkles size={12} className="text-emerald-500" />
              Powered by Meta Llama 3.3 via Hugging Face
            </p>
          </div>
        </div>
      )}
    </>
  );
}
