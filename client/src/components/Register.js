import React, { useState } from 'react';
import axios from 'axios';
import { User, MapPin, Lock, ArrowRight, Loader2, Sprout, Globe, KeyRound } from 'lucide-react';
import { administrativeData } from '../data/sriLankaData'; 

const Register = ({ onRegisterSuccess, switchToLogin, lang }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '', password: '', district: '', dsDivision: '', gnDivision: ''
  });

  const districts = Object.keys(administrativeData);
  const dsDivisions = formData.district ? Object.keys(administrativeData[formData.district]) : [];
  const gnDivisions = (formData.district && formData.dsDivision) 
    ? administrativeData[formData.district][formData.dsDivision] : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'district') setFormData({ ...formData, district: value, dsDivision: '', gnDivision: '' });
    else if (name === 'dsDivision') setFormData({ ...formData, dsDivision: value, gnDivision: '' });
    else setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/register', formData);
      
      // AUTO-LOGGING LOGIC: Save the token and user object immediately
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      // Notify the parent component (App.js) that registration/login was successful
      onRegisterSuccess(res.data.user); 
    } catch (err) {
      alert(lang === 'si' ? "ලියාපදිංචි වීම අසාර්ථකයි. කරුණාකර නැවත උත්සාහ කරන්න." : "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl p-1 animate-in fade-in zoom-in duration-500">
      <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20">
        
        <div className="bg-gradient-to-br from-green-600 to-green-900 p-10 text-center relative overflow-hidden">
          <div className="absolute top-[-20px] right-[-20px] opacity-10">
            <Sprout size={120} />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
              {lang === 'si' ? 'ගොවි ගිණුම' : 'Farmer Profile'}
            </h2>
            <p className="text-green-100 text-sm font-medium opacity-80 uppercase tracking-widest">
              {lang === 'si' ? 'ශ්‍රී ලාංකීය ගොවි ප්‍රජාවට එකතු වන්න' : 'Join the Sri Lankan Farming Revolution'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-green-700 ml-2 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 text-green-600" size={18} />
                <input type="text" name="username" required placeholder="Ex: Namal Perera" onChange={handleChange} 
                  className="w-full pl-12 p-3.5 bg-green-50/50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl transition-all outline-none text-gray-700 font-medium" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-green-700 ml-2 uppercase tracking-wider">Secret Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-green-600" size={18} />
                <input type="password" name="password" required placeholder="••••••••" onChange={handleChange} 
                  className="w-full pl-12 p-3.5 bg-green-50/50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl transition-all outline-none text-gray-700" />
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="text-green-600" size={18} />
              <span className="text-sm font-black text-gray-400 uppercase tracking-tighter">Your Location</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select name="district" required value={formData.district} onChange={handleChange} 
                className="w-full p-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-green-500 outline-none font-bold text-gray-600 text-sm cursor-pointer">
                <option value="">District</option>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>

              <select name="dsDivision" required value={formData.dsDivision} onChange={handleChange} disabled={!formData.district}
                className="w-full p-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-green-500 outline-none font-bold text-gray-600 text-sm disabled:opacity-40 cursor-pointer">
                <option value="">DS Division</option>
                {dsDivisions.map(ds => <option key={ds} value={ds}>{ds}</option>)}
              </select>

              <select name="gnDivision" required value={formData.gnDivision} onChange={handleChange} disabled={!formData.dsDivision}
                className="w-full p-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-green-500 outline-none font-bold text-gray-600 text-sm disabled:opacity-40 cursor-pointer">
                <option value="">GN Division</option>
                {gnDivisions.map(gn => <option key={gn} value={gn}>{gn}</option>)}
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-green-600 to-green-700 text-white p-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-green-200 disabled:grayscale"
          >
            {loading ? <Loader2 className="animate-spin" /> : (lang === 'si' ? 'ලියාපදිංචිය අවසන් කරන්න' : 'Start My Journey')} 
            {!loading && <ArrowRight size={22} />}
          </button>

          {/* ADDED LOGIN LINK HERE */}
          <div className="text-center pt-2">
            <button 
              type="button" 
              onClick={switchToLogin}
              className="text-green-700 font-bold text-sm hover:underline flex items-center justify-center gap-2 mx-auto"
            >
              <KeyRound size={16} />
              {lang === 'si' ? 'දැනටමත් ගිණුමක් තිබේද? ඇතුළු වන්න' : 'Already have an account? Login here'}
            </button>
          </div>
        </form>
      </div>
      
      <p className="text-center mt-8 text-green-100/60 text-xs font-bold tracking-widest uppercase">
        Safe & Secure Digital Farming Ecosystem
      </p>
    </div>
  );
};

export default Register;