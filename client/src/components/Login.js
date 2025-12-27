import React, { useState } from 'react';
import axios from 'axios';
import { User, Lock, ArrowRight, Loader2, KeyRound, Leaf, Sparkles, Sun, Cloud, Droplets } from 'lucide-react';

const Login = ({ onLoginSuccess, switchToRegister, lang }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLoginSuccess(res.data.user);
    } catch (err) {
      alert(lang === 'si' ? "පිවිසීම අසාර්ථකයි. නම හෝ මුරපදය පරීක්ෂා කරන්න." : "Login failed. Check username/password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-1 animate-in fade-in zoom-in duration-700 relative">
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 opacity-20 animate-bounce" style={{animationDuration: '3s'}}>
        <Sun className="text-yellow-300" size={32} />
      </div>
      <div className="absolute top-40 right-16 opacity-20 animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}}>
        <Cloud className="text-blue-300" size={28} />
      </div>
      <div className="absolute bottom-32 left-20 opacity-20 animate-bounce" style={{animationDuration: '3.5s', animationDelay: '0.5s'}}>
        <Droplets className="text-cyan-300" size={24} />
      </div>
      
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden border-2 border-white/30 transform hover:scale-[1.01] transition-transform duration-300">
        {/* Header with animated gradient */}
        <div className="bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 p-10 text-center relative overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-200/20 via-transparent to-blue-200/20 animate-pulse"></div>
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '4s'}}></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-200/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '5s', animationDelay: '1s'}}></div>
          </div>
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm shadow-xl transform hover:rotate-6 transition-transform duration-300">
              <Leaf className="h-10 w-10 text-white drop-shadow-lg" />
            </div>
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight drop-shadow-lg">
              {lang === 'si' ? '🌾 නැවත පිවිසෙන්න' : '🌾 Welcome Back'}
            </h2>
            <p className="text-green-100 text-sm font-medium">
              {lang === 'si' ? 'ඔබේ ගොවි ඉසුරු ගිණුමට පිවිසෙන්න' : 'Access your Govi Isuru dashboard'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute left-4 top-4 text-green-600 group-focus-within:text-emerald-600 transition-colors">
                <User size={20} />
              </div>
              <input 
                type="text" 
                placeholder={lang === 'si' ? 'පරිශීලක නාමය' : 'Username'} 
                required 
                className="w-full pl-12 pr-4 py-4 bg-gradient-to-br from-gray-50 to-gray-100/50 border-2 border-gray-200 focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all text-gray-700 font-medium placeholder:text-gray-400 shadow-sm focus:shadow-lg focus:shadow-green-100" 
                onChange={(e) => setFormData({...formData, username: e.target.value})} 
              />
            </div>
            <div className="relative group">
              <div className="absolute left-4 top-4 text-green-600 group-focus-within:text-emerald-600 transition-colors">
                <Lock size={20} />
              </div>
              <input 
                type="password" 
                placeholder={lang === 'si' ? 'මුරපදය' : 'Password'} 
                required 
                className="w-full pl-12 pr-4 py-4 bg-gradient-to-br from-gray-50 to-gray-100/50 border-2 border-gray-200 focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all text-gray-700 font-medium placeholder:text-gray-400 shadow-sm focus:shadow-lg focus:shadow-green-100" 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 shadow-xl shadow-green-300/50 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-green-400/60 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                <span>{lang === 'si' ? 'පිවිසෙමින්...' : 'Signing in...'}</span>
              </>
            ) : (
              <>
                <span>{lang === 'si' ? 'පිවිසෙන්න' : 'Sign In'}</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <div className="relative py-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-gray-400 uppercase tracking-wider">or</span>
            </div>
          </div>

          <button 
            type="button" 
            onClick={switchToRegister} 
              className="w-full py-4 px-6 border-2 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 font-bold rounded-2xl hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100 hover:border-green-400 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
              <Sparkles size={18} className="text-yellow-500" />
            {lang === 'si' ? 'අලුත් ගිණුමක් සාදන්න' : 'Create New Account'}
          </button>
        </form>
      </div>
      
        <p className="text-center mt-6 text-white/80 text-xs font-medium flex items-center justify-center gap-2">
          <span className="text-lg">🔒</span>
          {lang === 'si' ? 'ආරක්ෂිත ඩිජිටල් ගොවිතැන පද්ධතිය' : 'Safe & Secure Digital Farming'}
        </p>
    </div>
  );
};

export default Login;