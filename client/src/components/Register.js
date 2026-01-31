import React, { useState, useMemo } from 'react';
import axios from 'axios';
import {
  User,
  MapPin,
  Lock,
  ArrowRight,
  Loader2,
  Sprout,
  Globe,
  KeyRound,
  Leaf,
  ShoppingBag,
  CheckCircle,
  Shield,
  Building2,
  Sun,
  Cloud,
  Droplets,
  Mail,
  AlertCircle,
  Eye,
  EyeOff,
  X
} from 'lucide-react';
import { administrativeData } from '../data/sriLankaData';

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

const Register = ({ onRegisterSuccess, switchToLogin, lang }) => {
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const [loading, setLoading] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    district: '',
    dsDivision: '',
    gnDivision: '',
    role: 'farmer',
    officerId: '',
    department: '',
    designation: ''
  });

  // Password validation state
  const passwordValidation = useMemo(() => validatePasswordStrength(formData.password), [formData.password]);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== '';

  const districts = Object.keys(administrativeData);
  const dsDivisions = formData.district ? Object.keys(administrativeData[formData.district]) : [];
  const gnDivisions = formData.district && formData.dsDivision ? administrativeData[formData.district][formData.dsDivision] : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'district') {
      setFormData({ ...formData, district: value, dsDivision: '', gnDivision: '' });
    } else if (name === 'dsDivision') {
      setFormData({ ...formData, dsDivision: value, gnDivision: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Client-side validation
    if (!passwordValidation.isValid) {
      setError(lang === 'si' ? 'මුරපදය සියලු අවශ්‍යතා සපුරා ලිය යුතුය' : 'Password must meet all requirements');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(lang === 'si' ? 'මුරපද ගැළපෙන්නේ නැත' : 'Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/api/auth/register`, formData);
      // Registration successful - show verification message
      setRegisteredEmail(formData.email);
      setRegistrationComplete(true);
    } catch (err) {
      const errorMsg = err.response?.data?.msg || err.message || 'Registration failed';
      const errorsList = err.response?.data?.errors;
      if (errorsList && errorsList.length > 0) {
        setError(errorsList.join('. '));
      } else {
        setError(errorMsg);
      }
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const labels = {
    en: {
      selectRole: 'I am a',
      farmer: 'Farmer',
      officer: 'Government Officer',
      buyer: 'Buyer',
      fullName: 'Full Name',
      fullNamePlaceholder: 'Ex: Namal Perera',
      username: 'Username',
      usernamePlaceholder: 'Ex: namal_perera',
      email: 'Email Address',
      emailPlaceholder: 'your@email.com',
      password: 'Password',
      confirmPassword: 'Confirm Password',
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
      passwordsNoMatch: 'Passwords do not match',
      district: 'District',
      dsDivision: 'DS Division',
      gnDivision: 'GN Division',
      officerId: 'Officer ID Number',
      officerIdPlaceholder: 'Ex: AGR/2024/001',
      department: 'Department',
      departmentPlaceholder: 'Ex: Department of Agriculture',
      designation: 'Designation',
      designationPlaceholder: 'Ex: Agricultural Instructor',
      register: 'Create Account',
      haveAccount: 'Already have an account?',
      login: 'Login here',
      verifyEmailTitle: 'Verify Your Email',
      verifyEmailMessage: 'We have sent a verification link to',
      checkInbox: 'Please check your inbox and click the link to verify your account.',
      checkSpam: "If you don't see it, check your spam folder.",
      goToLogin: 'Go to Login',
      resendEmail: 'Resend Verification Email'
    },
    si: {
      selectRole: 'මම',
      farmer: 'ගොවියෙක්',
      officer: 'රජයේ නිලධාරියෙක්',
      buyer: 'ගැණුම්කරු',
      fullName: 'සම්පූර්ණ නම',
      fullNamePlaceholder: 'උදා: නාමල් පෙරේරා',
      username: 'පරිශීලක නාමය',
      usernamePlaceholder: 'උදා: namal_perera',
      email: 'විද්‍යුත් තැපැල් ලිපිනය',
      emailPlaceholder: 'your@email.com',
      password: 'මුරපදය',
      confirmPassword: 'මුරපදය තහවුරු කරන්න',
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
      passwordsNoMatch: 'මුරපද ගැළපෙන්නේ නැත',
      district: 'දිස්ත්‍රික්කය',
      dsDivision: 'ප්‍රාදේශීය ලේකම් කොට්ඨාසය',
      gnDivision: 'ග්‍රාම නිලධාරී කොට්ඨාසය',
      officerId: 'නිලධාරී හැඳුනුම්පත් අංකය',
      officerIdPlaceholder: 'උදා: AGR/2024/001',
      department: 'දෙපාර්තමේන්තුව',
      departmentPlaceholder: 'උදා: කෘෂිකර්ම දෙපාර්තමේන්තුව',
      designation: 'තනතුර',
      designationPlaceholder: 'උදා: කෘෂිකර්ම උපදේශක',
      register: 'ගිණුම සාදන්න',
      haveAccount: 'දැනටමත් ගිණුමක් තිබේද?',
      login: 'මෙතනින් ප්‍රවිෂ්ට වන්න',
      verifyEmailTitle: 'ඔබගේ විද්‍යුත් තැපෑල තහවුරු කරන්න',
      verifyEmailMessage: 'අපි තහවුරු කිරීමේ සබැඳියක් යැව්වා',
      checkInbox: 'කරුණාකර ඔබගේ inbox පරීක්ෂා කර ඔබගේ ගිණුම තහවුරු කිරීමට සබැඳිය ක්ලික් කරන්න.',
      checkSpam: 'එය නොපෙනේ නම්, ඔබගේ spam ෆෝල්ඩරය පරීක්ෂා කරන්න.',
      goToLogin: 'පිවිසුමට යන්න',
      resendEmail: 'තහවුරු කිරීමේ විද්‍යුත් තැපෑල නැවත යවන්න'
    }
  };

  const t = labels[lang] || labels.en;

  // Show verification email sent screen
  if (registrationComplete) {
    return (
      <div className="w-full max-w-md p-1 animate-in fade-in zoom-in duration-700">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden border-2 border-white/30">
          <div className="bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            </div>
            <div className="relative">
              <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm shadow-xl">
                <Mail className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">{t.verifyEmailTitle}</h2>
            </div>
          </div>
          <div className="p-8 text-center space-y-6">
            <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <p className="text-gray-700 font-medium mb-2">{t.verifyEmailMessage}</p>
              <p className="text-green-700 font-bold text-lg">{registeredEmail}</p>
              <p className="text-gray-600 text-sm mt-4">{t.checkInbox}</p>
              <p className="text-gray-500 text-xs mt-2">{t.checkSpam}</p>
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
    <div className="w-full max-w-xl p-1 animate-in fade-in zoom-in duration-700 relative">
      {/* Floating decorative elements */}
      <div className="absolute -left-6 top-10 opacity-20 animate-bounce" style={{ animationDuration: '3s' }}>
        <Sun className="text-yellow-300" size={32} />
      </div>
      <div className="absolute right-0 top-40 opacity-20 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
        <Cloud className="text-blue-300" size={28} />
      </div>
      <div className="absolute left-10 bottom-24 opacity-20 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
        <Droplets className="text-cyan-300" size={24} />
      </div>

      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden border-2 border-white/30 transform hover:scale-[1.005] transition-transform duration-300">
        {/* Header with animated gradient */}
        <div className="bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-200/20 via-transparent to-blue-200/20 animate-pulse"></div>
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-200/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
          </div>
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm shadow-xl transform hover:rotate-6 transition-transform duration-300">
              <Sprout className="h-10 w-10 text-white drop-shadow-lg" />
            </div>
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight drop-shadow-lg">
              {lang === 'si' ? ' ගණමක සදනන' : ' Create Your Profile'}
            </h2>
            <p className="text-green-100 text-sm font-medium">
              {lang === 'si' ? 'ශර ලකය කෂකරමක පරජවට එකත වනන' : "Join Sri Lanka's Digital Farming Revolution"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in duration-300">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Role Selection */}
          <div className="mb-4">
            <label className="text-xs font-bold text-gray-600 ml-1 uppercase tracking-wider mb-3 block flex items-center gap-2">
              <span className="text-lg">👤</span>
              {t.selectRole}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'farmer', officerId: '', department: '', designation: '' })}
                className={`p-5 rounded-2xl border-2 transition-all transform hover:scale-105 ${
                  formData.role === 'farmer'
                    ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg shadow-green-200/50'
                    : 'border-gray-200 hover:border-green-300 bg-white hover:bg-green-50/30'
                }`}
              >
                <Sprout className={`h-7 w-7 mx-auto mb-2 transition-all ${formData.role === 'farmer' ? 'text-green-600 drop-shadow' : 'text-gray-400'}`} />
                <div className={`font-bold text-sm ${formData.role === 'farmer' ? 'text-green-700' : 'text-gray-600'}`}>{t.farmer}</div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'officer' })}
                className={`p-5 rounded-2xl border-2 transition-all transform hover:scale-105 ${
                  formData.role === 'officer'
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg shadow-blue-200/50'
                    : 'border-gray-200 hover:border-blue-300 bg-white hover:bg-blue-50/30'
                }`}
              >
                <Shield className={`h-7 w-7 mx-auto mb-2 transition-all ${formData.role === 'officer' ? 'text-blue-600 drop-shadow' : 'text-gray-400'}`} />
                <div className={`font-bold text-sm ${formData.role === 'officer' ? 'text-blue-700' : 'text-gray-600'}`}>{t.officer}</div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'buyer', officerId: '', department: '', designation: '' })}
                className={`p-5 rounded-2xl border-2 transition-all transform hover:scale-105 ${
                  formData.role === 'buyer'
                    ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-lg shadow-amber-200/50'
                    : 'border-gray-200 hover:border-amber-300 bg-white hover:bg-amber-50/30'
                }`}
              >
                <ShoppingBag className={`h-7 w-7 mx-auto mb-2 transition-all ${formData.role === 'buyer' ? 'text-amber-600 drop-shadow' : 'text-gray-400'}`} />
                <div className={`font-bold text-sm ${formData.role === 'buyer' ? 'text-amber-700' : 'text-gray-600'}`}>{t.buyer}</div>
              </button>
            </div>
          </div>

          {/* Account Info */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600 ml-1 uppercase tracking-wider flex items-center gap-1">
                  <User size={12} /> {t.fullName}
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder={t.fullNamePlaceholder}
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 border-2 border-gray-200 focus:border-green-500 focus:bg-white rounded-2xl transition-all outline-none text-gray-700 font-medium shadow-sm focus:shadow-lg focus:shadow-green-100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600 ml-1 uppercase tracking-wider flex items-center gap-1">
                  <User size={12} /> {t.username}
                </label>
                <input
                  type="text"
                  name="username"
                  required
                  placeholder={t.usernamePlaceholder}
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 border-2 border-gray-200 focus:border-green-500 focus:bg-white rounded-2xl transition-all outline-none text-gray-700 font-medium shadow-sm focus:shadow-lg focus:shadow-green-100"
                />
                <p className="text-xs text-gray-400 ml-1">{lang === 'si' ? 'පිවිසීම සඳහා භාවිතා කරයි' : 'Used for login'}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600 ml-1 uppercase tracking-wider flex items-center gap-1">
                <Mail size={12} /> {t.email}
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder={t.emailPlaceholder}
                value={formData.email}
                onChange={handleChange}
                className="w-full p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 border-2 border-gray-200 focus:border-green-500 focus:bg-white rounded-2xl transition-all outline-none text-gray-700 font-medium shadow-sm focus:shadow-lg focus:shadow-green-100"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600 ml-1 uppercase tracking-wider flex items-center gap-1">
              <Lock size={12} /> {t.password}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-4 pr-12 bg-gradient-to-br from-gray-50 to-gray-100/50 border-2 border-gray-200 focus:border-green-500 focus:bg-white rounded-2xl transition-all outline-none text-gray-700 font-medium shadow-sm focus:shadow-lg focus:shadow-green-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {formData.password && (
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

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600 ml-1 uppercase tracking-wider flex items-center gap-1">
              <Lock size={12} /> {t.confirmPassword}
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                required
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full p-4 pr-12 bg-gradient-to-br from-gray-50 to-gray-100/50 border-2 ${
                  formData.confirmPassword 
                    ? passwordsMatch 
                      ? 'border-green-500 focus:border-green-500' 
                      : 'border-red-400 focus:border-red-500'
                    : 'border-gray-200 focus:border-green-500'
                } focus:bg-white rounded-2xl transition-all outline-none text-gray-700 font-medium shadow-sm focus:shadow-lg focus:shadow-green-100`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {formData.confirmPassword && (
              <p className={`text-xs ml-1 flex items-center gap-1 ${passwordsMatch ? 'text-green-600' : 'text-red-500'}`}>
                {passwordsMatch ? <CheckCircle size={12} /> : <X size={12} />}
                {passwordsMatch ? t.passwordsMatch : t.passwordsNoMatch}
              </p>
            )}
          </div>

          {/* Officer-specific fields */}
          {formData.role === 'officer' && (
            <div className="space-y-4 p-5 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 rounded-2xl border-2 border-blue-200 shadow-lg shadow-blue-100/50 animate-in fade-in slide-in-from-top duration-300">
              <div className="flex items-center gap-2 text-blue-700 font-bold mb-2">
                <Building2 size={18} className="drop-shadow" />
                <span className="text-sm"> {lang === 'si' ? 'රජය නලධර තරතර' : 'Government Officer Information'}</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600 ml-1 uppercase tracking-wider flex items-center gap-1">
                  <KeyRound size={12} /> {t.officerId} *
                </label>
                <input
                  type="text"
                  name="officerId"
                  required={formData.role === 'officer'}
                  placeholder={t.officerIdPlaceholder}
                  value={formData.officerId}
                  onChange={handleChange}
                  className="w-full p-4 bg-white border-2 border-blue-200 focus:border-blue-500 focus:bg-blue-50/20 rounded-2xl transition-all outline-none text-gray-700 font-medium shadow-sm focus:shadow-lg focus:shadow-blue-100"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 ml-1 uppercase tracking-wider">{t.department}</label>
                  <input
                    type="text"
                    name="department"
                    placeholder={t.departmentPlaceholder}
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full p-4 bg-white border-2 border-blue-200 focus:border-blue-500 focus:bg-blue-50/20 rounded-2xl transition-all outline-none text-gray-700 font-medium shadow-sm focus:shadow-lg focus:shadow-blue-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 ml-1 uppercase tracking-wider">{t.designation}</label>
                  <input
                    type="text"
                    name="designation"
                    placeholder={t.designationPlaceholder}
                    value={formData.designation}
                    onChange={handleChange}
                    className="w-full p-4 bg-white border-2 border-blue-200 focus:border-blue-500 focus:bg-blue-50/20 rounded-2xl transition-all outline-none text-gray-700 font-medium shadow-sm focus:shadow-lg focus:shadow-blue-100"
                  />
                </div>
              </div>
            </div>
          )}

          <hr className="border-gray-200 my-4" />

          {/* Location Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl shadow-sm">
                <MapPin className="text-green-600" size={16} />
              </div>
              <span className="text-sm font-bold text-gray-700">{lang === 'si' ? '📍 ඔබේ ස්ථානය' : '📍 Your Location'}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-gray-500 ml-1 font-semibold">District</label>
                <select
                  name="district"
                  required
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full p-3.5 bg-gradient-to-br from-gray-50 to-gray-100/50 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:bg-white outline-none font-medium text-gray-700 text-sm cursor-pointer transition-all shadow-sm focus:shadow-lg focus:shadow-green-100"
                >
                  <option value="">Select District</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-gray-500 ml-1 font-semibold">DS Division</label>
                <select
                  name="dsDivision"
                  required
                  value={formData.dsDivision}
                  onChange={handleChange}
                  disabled={!formData.district}
                  className="w-full p-3.5 bg-gradient-to-br from-gray-50 to-gray-100/50 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:bg-white outline-none font-medium text-gray-700 text-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all shadow-sm focus:shadow-lg focus:shadow-green-100"
                >
                  <option value="">Select DS Division</option>
                  {dsDivisions.map((ds) => (
                    <option key={ds} value={ds}>
                      {ds}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-gray-500 ml-1 font-semibold">GN Division</label>
                <select
                  name="gnDivision"
                  required
                  value={formData.gnDivision}
                  onChange={handleChange}
                  disabled={!formData.dsDivision}
                  className="w-full p-3.5 bg-gradient-to-br from-gray-50 to-gray-100/50 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:bg-white outline-none font-medium text-gray-700 text-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all shadow-sm focus:shadow-lg focus:shadow-green-100"
                >
                  <option value="">Select GN Division</option>
                  {gnDivisions.map((gn) => (
                    <option key={gn} value={gn}>
                      {gn}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-5 border-2 border-green-200 shadow-lg shadow-green-100/50">
            <p className="text-xs font-bold text-green-800 mb-3 flex items-center gap-2">
              <span className="text-lg">✨</span>
              {lang === 'si' ? 'ඔබට ලැබෙන සේවා:' : "What you'll get:"}
            </p>
            <div className="grid grid-cols-2 gap-2.5 text-xs text-green-700 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-green-600" /> {lang === 'si' ? 'AI රග හඳනගනම' : 'AI Disease Detection'}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-green-600" /> {lang === 'si' ? 'වළඳපල මල ඇඟවම' : 'Market Price Alerts'}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-green-600" /> {lang === 'si' ? 'කලගණ උපදස' : 'Weather Advisories'}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-green-600" /> {lang === 'si' ? 'පරජ ජලය' : 'Community Network'}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 transition-all shadow-xl shadow-green-300/50 hover:-translate-y-1 hover:shadow-2xl hover:shadow-green-400/60 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                <span>{lang === 'si' ? 'සදමන...' : 'Creating...'}</span>
              </>
            ) : (
              <>
                <span>{lang === 'si' ? 'ලයපදචය අවසන කරනන' : 'Create My Account'}</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-gray-400 uppercase tracking-wider">or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={switchToLogin}
            className="w-full py-4 px-6 border-2 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 font-bold rounded-2xl hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100 hover:border-green-400 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <KeyRound size={18} />
            {lang === 'si' ? 'දනටමත ගණමක තබද? ඇතළ වනන' : 'Already have an account? Login'}
          </button>
        </form>
      </div>

      <p className="text-center mt-6 text-white/80 text-xs font-medium flex items-center justify-center gap-2">
        <span className="text-lg">🔒</span>
        {lang === 'si' ? 'ආරක්ෂිත ඩිජිටල් ගොවිතැන පද්ධතිය' : 'Safe & Secure Digital Farming Ecosystem'}
      </p>
    </div>
  );
};

export default Register;
