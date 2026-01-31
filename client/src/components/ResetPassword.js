import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { Lock, ArrowRight, Loader2, CheckCircle, AlertCircle, Eye, EyeOff, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

// Password strength validation helper
const validatePasswordStrength = (password) => {
  const checks = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
  
  const passedChecks = Object.values(checks).filter(Boolean).length;
  const strength = passedChecks <= 2 ? 'weak' : passedChecks <= 4 ? 'medium' : 'strong';
  
  return { checks, strength, isValid: Object.values(checks).every(Boolean) };
};

const ResetPassword = ({ switchToLogin, lang }) => {
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Password validation state
  const passwordValidation = useMemo(() => validatePasswordStrength(password), [password]);
  const passwordsMatch = password === confirmPassword && confirmPassword !== '';

  const labels = {
    en: {
      title: 'Reset Password',
      subtitle: 'Create a new password for your account',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      passwordPlaceholder: 'Enter new password',
      confirmPlaceholder: 'Confirm your password',
      resetPassword: 'Reset Password',
      resetting: 'Resetting...',
      success: 'Password Reset!',
      successMessage: 'Your password has been successfully reset. You can now login with your new password.',
      goToLogin: 'Go to Login',
      invalidToken: 'Invalid or Expired Link',
      invalidTokenMessage: 'This password reset link is invalid or has expired. Please request a new one.',
      requestNew: 'Request New Link',
      passwordMismatch: 'Passwords do not match',
      passwordNotStrong: 'Password must meet all requirements',
      passwordRequirements: {
        title: 'Password must contain:',
        minLength: 'At least 8 characters',
        uppercase: 'One uppercase letter',
        lowercase: 'One lowercase letter',
        number: 'One number',
        special: 'One special character (!@#$%^&*)'
      },
      passwordStrength: {
        weak: 'Weak',
        medium: 'Medium',
        strong: 'Strong'
      },
      passwordsMatch: 'Passwords match',
      passwordsNoMatch: 'Passwords do not match'
    },
    si: {
      title: 'මුරපදය නැවත සකසන්න',
      subtitle: 'ඔබගේ ගිණුම සඳහා නව මුරපදයක් සාදන්න',
      newPassword: 'නව මුරපදය',
      confirmPassword: 'මුරපදය තහවුරු කරන්න',
      passwordPlaceholder: 'නව මුරපදය ඇතුළත් කරන්න',
      confirmPlaceholder: 'ඔබගේ මුරපදය තහවුරු කරන්න',
      resetPassword: 'මුරපදය නැවත සකසන්න',
      resetting: 'නැවත සකසමින්...',
      success: 'මුරපදය නැවත සකසන ලදී!',
      successMessage: 'ඔබගේ මුරපදය සාර්ථකව නැවත සකසන ලදී. දැන් ඔබට නව මුරපදයෙන් පිවිසිය හැකිය.',
      goToLogin: 'පිවිසුමට යන්න',
      invalidToken: 'අවලංගු හෝ කල් ඉකුත් වූ සබැඳිය',
      invalidTokenMessage: 'මෙම මුරපද නැවත සැකසීමේ සබැඳිය අවලංගු හෝ කල් ඉකුත් වී ඇත. කරුණාකර නව එකක් ඉල්ලන්න.',
      requestNew: 'නව සබැඳියක් ඉල්ලන්න',
      passwordMismatch: 'මුරපද නොගැලපේ',
      passwordNotStrong: 'මුරපදය සියලු අවශ්‍යතා සපුරා ලිය යුතුය',
      passwordRequirements: {
        title: 'මුරපදයේ අඩංගු විය යුතුය:',
        minLength: 'අවම අක්ෂර 8ක්',
        uppercase: 'එක් ලොකු අකුරක්',
        lowercase: 'එක් කුඩා අකුරක්',
        number: 'එක් අංකයක්',
        special: 'එක් විශේෂ අක්ෂරයක් (!@#$%^&*)'
      },
      passwordStrength: {
        weak: 'දුර්වල',
        medium: 'මධ්‍යම',
        strong: 'ශක්තිමත්'
      },
      passwordsMatch: 'මුරපද ගැළපේ',
      passwordsNoMatch: 'මුරපද ගැළපෙන්නේ නැත'
    }
  };

  const t = labels[lang] || labels.en;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!passwordValidation.isValid) {
      setError(t.passwordNotStrong);
      return;
    }

    if (password !== confirmPassword) {
      setError(t.passwordMismatch);
      return;
    }

    setLoading(true);
    
    try {
      await axios.post(`${API_BASE}/api/auth/reset-password`, { 
        token, 
        password 
      });
      setSuccess(true);
    } catch (err) {
      const errorsList = err.response?.data?.errors;
      if (errorsList && errorsList.length > 0) {
        setError(errorsList.join('. '));
      } else {
        setError(err.response?.data?.msg || 'Failed to reset password. The link may have expired.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="w-full max-w-md p-1 animate-in fade-in zoom-in duration-700">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden border-2 border-white/30">
          <div className="bg-gradient-to-br from-red-500 to-orange-600 p-10 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm shadow-xl">
              <AlertCircle className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">{t.invalidToken}</h2>
          </div>
          <div className="p-8 text-center space-y-6">
            <p className="text-gray-600">{t.invalidTokenMessage}</p>
            <button
              onClick={switchToLogin}
              className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all"
            >
              {t.requestNew}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
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
              <p className="text-gray-700">{t.successMessage}</p>
            </div>
            <button
              onClick={switchToLogin}
              className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2"
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
        <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          </div>
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm shadow-xl">
              <Lock className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">{t.title}</h2>
            <p className="text-purple-100 text-sm">{t.subtitle}</p>
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
              <Lock size={12} /> {t.newPassword}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.passwordPlaceholder}
                className="w-full p-4 pr-12 bg-gradient-to-br from-gray-50 to-gray-100/50 border-2 border-gray-200 focus:border-purple-500 focus:bg-white rounded-2xl transition-all outline-none text-gray-700 font-medium shadow-sm focus:shadow-lg focus:shadow-purple-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {password && (
              <div className="space-y-2 mt-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                {/* Strength Bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        passwordValidation.strength === 'weak' ? 'w-1/3 bg-red-500' :
                        passwordValidation.strength === 'medium' ? 'w-2/3 bg-yellow-500' : 'w-full bg-green-500'
                      }`}
                    />
                  </div>
                  <span className={`text-xs font-bold ${
                    passwordValidation.strength === 'weak' ? 'text-red-600' :
                    passwordValidation.strength === 'medium' ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {t.passwordStrength[passwordValidation.strength]}
                  </span>
                </div>
                
                {/* Requirements Checklist */}
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-gray-600">{t.passwordRequirements.title}</p>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div className={`flex items-center gap-1 ${passwordValidation.checks.minLength ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordValidation.checks.minLength ? <CheckCircle size={12} /> : <X size={12} />}
                      {t.passwordRequirements.minLength}
                    </div>
                    <div className={`flex items-center gap-1 ${passwordValidation.checks.hasUppercase ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordValidation.checks.hasUppercase ? <CheckCircle size={12} /> : <X size={12} />}
                      {t.passwordRequirements.uppercase}
                    </div>
                    <div className={`flex items-center gap-1 ${passwordValidation.checks.hasLowercase ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordValidation.checks.hasLowercase ? <CheckCircle size={12} /> : <X size={12} />}
                      {t.passwordRequirements.lowercase}
                    </div>
                    <div className={`flex items-center gap-1 ${passwordValidation.checks.hasNumber ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordValidation.checks.hasNumber ? <CheckCircle size={12} /> : <X size={12} />}
                      {t.passwordRequirements.number}
                    </div>
                    <div className={`flex items-center gap-1 ${passwordValidation.checks.hasSpecial ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordValidation.checks.hasSpecial ? <CheckCircle size={12} /> : <X size={12} />}
                      {t.passwordRequirements.special}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600 ml-1 uppercase tracking-wider flex items-center gap-1">
              <Lock size={12} /> {t.confirmPassword}
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t.confirmPlaceholder}
                className={`w-full p-4 pr-12 bg-gradient-to-br from-gray-50 to-gray-100/50 border-2 ${
                  confirmPassword 
                    ? passwordsMatch 
                      ? 'border-green-500 focus:border-green-500' 
                      : 'border-red-400 focus:border-red-500'
                    : 'border-gray-200 focus:border-purple-500'
                } focus:bg-white rounded-2xl transition-all outline-none text-gray-700 font-medium shadow-sm focus:shadow-lg focus:shadow-purple-100`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {confirmPassword && (
              <p className={`text-xs ml-1 flex items-center gap-1 ${passwordsMatch ? 'text-green-600' : 'text-red-500'}`}>
                {passwordsMatch ? <CheckCircle size={12} /> : <X size={12} />}
                {passwordsMatch ? t.passwordsMatch : t.passwordsNoMatch}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !passwordValidation.isValid || !passwordsMatch}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 hover:from-purple-700 hover:to-indigo-700 transition-all shadow-xl shadow-purple-300/50 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                <span>{t.resetting}</span>
              </>
            ) : (
              <>
                <span>{t.resetPassword}</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
