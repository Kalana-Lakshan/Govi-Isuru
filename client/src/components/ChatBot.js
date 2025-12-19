import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Ayubowan! I am your Govi assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { text: input, sender: 'user' };
    setMessages([...messages, userMsg]);
    setInput("");

    try {
      // Point to your local Python backend
      const res = await axios.post('http://localhost:8000/chat', { message: input });
      setMessages(prev => [...prev, { text: res.data.reply, sender: 'bot' }]);
    } catch {
      setMessages(prev => [...prev, { text: "Connection error. Is the backend running?", sender: 'bot' }]);
    }
  };

  return (
    // "fixed bottom-6 right-6" ensures it stays at the bottom right corner
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-80 md:w-96 bg-white shadow-2xl rounded-2xl overflow-hidden border border-green-100"
          >
            {/* Header */}
            <div className="bg-green-700 p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-2 font-bold">
                <Bot size={20}/> Govi Assistant
              </div>
              <button onClick={() => setIsOpen(false)}><X size={20}/></button>
            </div>

            {/* Chat Messages Area */}
            <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    m.sender === 'user' ? 'bg-green-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border shadow-sm'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t flex gap-2">
              <input 
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button onClick={handleSend} className="bg-green-700 text-white p-2 rounded-full"><Send size={18} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-green-700 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform"
      >
        {isOpen ? <X size={28}/> : <MessageCircle size={28}/>}
      </button>
    </div>
  );
};

export default ChatBot;