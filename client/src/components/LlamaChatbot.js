import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles, Languages } from 'lucide-react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function LlamaChatbot({ lang = 'en' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatLang, setChatLang] = useState('en'); // Internal language state for chatbot
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
          className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 z-50 group"
          aria-label="Open AI Chat"
        >
          <div className="relative">
            <MessageCircle size={28} />
            <Sparkles
              size={16}
              className="absolute -top-1 -right-1 text-yellow-300 animate-pulse"
            />
          </div>
          <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            AI Assistant
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles size={20} />
              <div>
                <h3 className="font-bold text-lg">AI Farming Assistant</h3>
                <p className="text-xs text-green-100">Powered by Llama 3.3</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Language Toggle Button */}
              <button
                onClick={() => setChatLang(chatLang === 'en' ? 'si' : 'en')}
                className="hover:bg-white/20 p-2 rounded-full transition-colors flex items-center gap-1"
                aria-label="Toggle language"
                title={chatLang === 'en' ? 'Switch to Sinhala' : 'Switch to English'}
              >
                <Languages size={20} />
                <span className="text-xs font-medium">{chatLang === 'en' ? 'EN' : 'සිං'}</span>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-1 rounded-full transition-colors"
                aria-label="Close chat"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-green-500 text-white rounded-br-none'
                      : message.isError
                      ? 'bg-red-100 text-red-800 rounded-bl-none border border-red-200'
                      : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      message.role === 'user'
                        ? 'text-green-100'
                        : message.isError
                        ? 'text-red-600'
                        : 'text-gray-400'
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
                <div className="bg-white text-gray-800 p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-200">
                  <div className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-green-500" />
                    <span className="text-sm text-gray-500">
                      AI is thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            {error && (
              <div className="mb-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  lang === 'si'
                    ? 'ඔබේ ප්‍රශ්නය ටයිප් කරන්න...'
                    : 'Type your farming question...'
                }
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Powered by Meta Llama 3.1 via Hugging Face
            </p>
          </div>
        </div>
      )}
    </>
  );
}
