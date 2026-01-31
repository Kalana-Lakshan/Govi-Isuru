import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, AlertCircle, Loader2, Mail, ArrowRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const VerifyEmail = ({ switchToLogin, lang }) => {
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');

  const labels = {
    en: {
      verifying: 'Verifying your email...',
      success: 'Email Verified!',
      successMessage: 'Your email has been successfully verified. You can now login to your account.',
      goToLogin: 'Go to Login',
      failed: 'Verification Failed',
      failedMessage: 'The verification link is invalid or has expired.',
      tryAgain: 'Try Again'
    },
    si: {
      verifying: 'ඔබගේ විද්‍යුත් තැපෑල තහවුරු කරමින්...',
      success: 'විද්‍යුත් තැපෑල තහවුරු කරන ලදී!',
      successMessage: 'ඔබගේ විද්‍යුත් තැපෑල සාර්ථකව තහවුරු කරන ලදී. දැන් ඔබට ඔබගේ ගිණුමට පිවිසිය හැකිය.',
      goToLogin: 'පිවිසුමට යන්න',
      failed: 'තහවුරු කිරීම අසාර්ථකයි',
      failedMessage: 'තහවුරු කිරීමේ සබැඳිය අවලංගු හෝ කල් ඉකුත් වී ඇත.',
      tryAgain: 'නැවත උත්සාහ කරන්න'
    }
  };

  const t = labels[lang] || labels.en;

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError('No verification token provided');
        setLoading(false);
        return;
      }

      try {
        await axios.get(`${API_BASE}/api/auth/verify-email/${token}`);
        setVerified(true);
      } catch (err) {
        setError(err.response?.data?.msg || 'Verification failed');
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, API_BASE]);

  if (loading) {
    return (
      <div className="w-full max-w-md p-1 animate-in fade-in zoom-in duration-700">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden border-2 border-white/30">
          <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-700 p-10 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm shadow-xl">
              <Loader2 className="h-10 w-10 text-white animate-spin" />
            </div>
            <h2 className="text-2xl font-black text-white">{t.verifying}</h2>
          </div>
          <div className="p-8 text-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (verified) {
    return (
      <div className="w-full max-w-md p-1 animate-in fade-in zoom-in duration-700">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden border-2 border-white/30">
          <div className="bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 p-10 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm shadow-xl">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">{t.success}</h2>
          </div>
          <div className="p-8 text-center space-y-6">
            <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
              <Mail className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <p className="text-gray-700">{t.successMessage}</p>
            </div>
            <button
              onClick={switchToLogin}
              className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-green-300/50"
            >
              {t.goToLogin}
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-1 animate-in fade-in zoom-in duration-700">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden border-2 border-white/30">
        <div className="bg-gradient-to-br from-red-500 to-orange-600 p-10 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm shadow-xl">
            <AlertCircle className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">{t.failed}</h2>
        </div>
        <div className="p-8 text-center space-y-6">
          <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-200">
            <p className="text-gray-700">{error || t.failedMessage}</p>
          </div>
          <button
            onClick={switchToLogin}
            className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all"
          >
            {t.tryAgain}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
