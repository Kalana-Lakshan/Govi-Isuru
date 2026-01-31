import React, { useState } from 'react';
import axios from 'axios';
import { Mail, ArrowRight, Loader2, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

const ForgotPassword = ({ switchToLogin, lang }) => {
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const labels = {
    en: {
      title: 'Forgot Password?',
      subtitle: "Enter your email and we'll send you a reset link",
      email: 'Email Address',
      emailPlaceholder: 'your@email.com',
      sendLink: 'Send Reset Link',
      sending: 'Sending...',
      backToLogin: 'Back to Login',
      checkEmail: 'Check Your Email!',
      sentMessage: "We've sent a password reset link to",
      checkSpam: "If you don't see it, check your spam folder.",
      sendAnother: 'Send Another Link'
    },
    si: {
      title: 'මුරපදය අමතකද?',
      subtitle: 'ඔබගේ විද්‍යුත් තැපැල් ලිපිනය ඇතුළත් කරන්න, අපි නැවත සැකසීමේ සබැඳියක් එවන්නෙමු',
      email: 'විද්‍යුත් තැපැල් ලිපිනය',
      emailPlaceholder: 'your@email.com',
      sendLink: 'නැවත සැකසීමේ සබැඳිය යවන්න',
      sending: 'යවමින්...',
      backToLogin: 'පිවිසුම වෙත ආපසු',
      checkEmail: 'ඔබේ විද්‍යුත් තැපෑල පරීක්ෂා කරන්න!',
      sentMessage: 'අපි මුරපද නැවත සැකසීමේ සබැඳියක් යැව්වා',
      checkSpam: 'එය නොපෙනේ නම්, ඔබගේ spam ෆෝල්ඩරය පරීක්ෂා කරන්න.',
      sendAnother: 'තවත් සබැඳියක් යවන්න'
    }
  };

  const t = labels[lang] || labels.en;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await axios.post(`${API_BASE}/api/auth/forgot-password`, { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="w-full max-w-md p-1 animate-in fade-in zoom-in duration-700">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden border-2 border-white/30">
          <div className="bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 p-10 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm shadow-xl">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">{t.checkEmail}</h2>
          </div>

          <div className="p-8 text-center space-y-6">
            <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
              <Mail className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <p className="text-gray-700 font-medium mb-2">{t.sentMessage}</p>
              <p className="text-green-700 font-bold text-lg">{email}</p>
              <p className="text-gray-500 text-sm mt-4">{t.checkSpam}</p>
            </div>

            <button
              onClick={() => setSent(false)}
              className="w-full py-4 px-6 border-2 border-gray-300 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all"
            >
              {t.sendAnother}
            </button>

            <button
              onClick={switchToLogin}
              className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft size={20} />
              {t.backToLogin}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-1 animate-in fade-in zoom-in duration-700">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden border-2 border-white/30">
        <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-700 p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          </div>
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm shadow-xl">
              <Mail className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">{t.title}</h2>
            <p className="text-blue-100 text-sm">{t.subtitle}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in duration-300">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600 ml-1 uppercase tracking-wider flex items-center gap-1">
              <Mail size={12} /> {t.email}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              className="w-full p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 border-2 border-gray-200 focus:border-blue-500 focus:bg-white rounded-2xl transition-all outline-none text-gray-700 font-medium shadow-sm focus:shadow-lg focus:shadow-blue-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 hover:from-blue-700 hover:to-cyan-700 transition-all shadow-xl shadow-blue-300/50 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                <span>{t.sending}</span>
              </>
            ) : (
              <>
                <span>{t.sendLink}</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={switchToLogin}
            className="w-full py-4 px-6 border-2 border-gray-300 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            {t.backToLogin}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
