import React, { useState } from 'react';
import axios from 'axios';
import { User, Lock, ArrowRight, Loader2, KeyRound } from 'lucide-react';

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
    <div className="w-full max-w-md p-1 animate-in fade-in zoom-in duration-500">
      <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20">
        <div className="bg-gradient-to-br from-green-700 to-green-900 p-10 text-center">
          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
            {lang === 'si' ? 'නැවත පිවිසෙන්න' : 'Welcome Back'}
          </h2>
          <p className="text-green-100 text-xs font-bold opacity-70 uppercase tracking-widest">Login to your Govi Isuru account</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-green-600" size={18} />
              <input type="text" placeholder="Username" required className="w-full pl-12 p-3.5 bg-green-50/50 border-2 border-transparent focus:border-green-500 rounded-2xl outline-none" 
                onChange={(e) => setFormData({...formData, username: e.target.value})} />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-green-600" size={18} />
              <input type="password" placeholder="Secret Key" required className="w-full pl-12 p-3.5 bg-green-50/50 border-2 border-transparent focus:border-green-500 rounded-2xl outline-none" 
                onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-green-600 text-white p-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-green-700 shadow-lg">
            {loading ? <Loader2 className="animate-spin" /> : (lang === 'si' ? 'පිවිසෙන්න' : 'Sign In')} <ArrowRight size={20} />
          </button>

          <button type="button" onClick={switchToRegister} className="w-full text-green-700 font-bold text-sm hover:underline">
            {lang === 'si' ? 'අලුත් ගිණුමක් සාදන්න (Register)' : "Don't have an account? Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;