import React, { useState } from 'react';
import axios from 'axios';
import { User, Lock, ArrowRight, Loader2, KeyRound, Leaf, Sparkles } from 'lucide-react';

const Login = ({ onLoginSuccess, switchToRegister, lang }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/login', formData);
      if (res.data && res.data.token && res.data.user) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        onLoginSuccess(res.data.user);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMsg = err.response?.data?.msg || err.message;
      alert(lang === 'si' ? `පිවිසීම අසාර්ථකයි: ${errorMsg}` : `Login failed: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-1 animate-in fade-in zoom-in duration-500">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        {/* Header */}
        <div className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwdjJoLTYweiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNhKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-50"></div>
          <div className="relative">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white mb-1 tracking-tight">
              {lang === 'si' ? 'නැවත පිවිසෙන්න' : 'Welcome Back'}
            </h2>
            <p className="text-green-200 text-sm">Login to your Govi Isuru account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-4 text-green-600" size={18} />
              <input 
                type="text" 
                placeholder={lang === 'si' ? 'පරිශීලක නාමය' : 'Username'} 
                required 
                className="w-full pl-12 p-4 bg-gray-50 border-2 border-gray-100 focus:border-green-500 focus:bg-white rounded-xl outline-none transition-all" 
                onChange={(e) => setFormData({...formData, username: e.target.value})} 
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-4 text-green-600" size={18} />
              <input 
                type="password" 
                placeholder={lang === 'si' ? 'මුරපදය' : 'Password'} 
                required 
                className="w-full pl-12 p-4 bg-gray-50 border-2 border-gray-100 focus:border-green-500 focus:bg-white rounded-xl outline-none transition-all" 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-200 transition-all hover:-translate-y-0.5 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <>
                <span>{lang === 'si' ? 'පිවිසෙන්න' : 'Sign In'}</span>
                <ArrowRight size={18} />
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
            className="w-full p-3.5 border-2 border-green-200 text-green-700 font-bold rounded-xl hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles size={16} />
            {lang === 'si' ? 'අලුත් ගිණුමක් සාදන්න' : 'Create New Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;