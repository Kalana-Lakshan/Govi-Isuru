import React, { useState, useEffect } from 'react';
import { administrativeData } from '../data/sriLankaData';
import {
  User,
  Mail,
  MapPin,
  Phone,
  Building2,
  Shield,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const UserProfile = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    district: '',
    dsDivision: '',
    gnDivision: '',
    role: '',
    officerId: '',
    department: '',
    designation: ''
  });
  const [originalEmail, setOriginalEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Derived state for dropdowns
  const districts = Object.keys(administrativeData);
  const dsDivisions = formData.district ? Object.keys(administrativeData[formData.district] || {}) : [];
  const gnDivisions = (formData.district && formData.dsDivision)
    ? (administrativeData[formData.district][formData.dsDivision] || [])
    : [];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/auth/user/profile', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });

      if (!res.ok) throw new Error('Failed to fetch profile');

      const data = await res.json();
      setFormData({
        fullName: data.fullName || '',
        username: data.username || '',
        email: data.email || '',
        phone: data.phone || '',
        district: data.district || '',
        dsDivision: data.dsDivision || '',
        gnDivision: data.gnDivision || '',
        role: data.role || '',
        officerId: data.officerId || '',
        department: data.department || '',
        designation: data.designation || ''
      });
      setOriginalEmail(data.email || '');
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'district') {
      setFormData(prev => ({
        ...prev,
        district: value,
        dsDivision: '',
        gnDivision: ''
      }));
    } else if (name === 'dsDivision') {
      setFormData(prev => ({
        ...prev,
        dsDivision: value,
        gnDivision: ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSaving(true);

    // Validate email confirmation
    if (formData.email !== originalEmail && formData.email !== confirmEmail) {
      setError('Please confirm your new email address correctly.');
      setSaving(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/auth/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.msg || 'Profile updated successfully!');
        setOriginalEmail(formData.email);
        setConfirmEmail('');
        // If email changed, backend might have triggered verification logic
        if (data.emailChanged) {
          // Could redirect or show specific alert
        }
      } else {
        setError(data.error || 'Update failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="animate-spin text-green-600 w-10 h-10" />
      </div>
    );
  }

  const isOfficer = formData.role === 'officer';

  return (
    <div className="max-w-4xl mx-auto mt-8 p-1 animate-in fade-in zoom-in duration-500">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden border border-gray-100">

        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-8 text-white relative overflow-hidden">
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-inner">
              <User size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">User Profile</h2>
              <p className="text-green-50 font-medium opacity-90">Manage your account details and preferences</p>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-black/5 rounded-full blur-3xl"></div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">

          {/* Status Messages */}
          {message && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-in fade-in mb-6">
              <CheckCircle className="text-green-600 flex-shrink-0" />
              <p className="text-green-800 font-medium">{message}</p>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 animate-in fade-in mb-6">
              <AlertCircle className="text-red-600 flex-shrink-0" />
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          )}

          {/* Section: Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider flex items-center gap-1">
                <User size={12} /> Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:bg-white transition-all outline-none font-medium text-gray-700"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider flex items-center gap-1">
                <Shield size={12} /> Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                disabled
                className="w-full p-4 bg-gray-100 border-2 border-transparent rounded-xl text-gray-500 font-medium cursor-not-allowed select-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider flex items-center gap-1">
                <Phone size={12} /> Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:bg-white transition-all outline-none font-medium text-gray-700"
                placeholder="Optional"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider flex items-center gap-1">
                <Shield size={12} /> Role
              </label>
              <input
                type="text"
                value={formData.role}
                disabled
                className="w-full p-4 bg-gray-100 border-2 border-transparent rounded-xl text-gray-500 font-medium capitalize cursor-not-allowed select-none"
              />
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Section: Email */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Mail className="text-green-600" size={20} /> Contact Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:bg-white transition-all outline-none font-medium text-gray-700"
                  required
                />
              </div>

              {formData.email !== originalEmail && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-4">
                  <label className="text-xs font-bold text-green-600 ml-1 uppercase tracking-wider">Confirm New Email</label>
                  <input
                    type="email"
                    value={confirmEmail}
                    onChange={(e) => setConfirmEmail(e.target.value)}
                    placeholder="Re-enter your new email"
                    className={`w-full p-4 bg-white border-2 rounded-xl transition-all outline-none font-medium text-gray-700 ${confirmEmail && confirmEmail === formData.email
                        ? 'border-green-500 focus:ring-4 ring-green-500/10'
                        : 'border-green-300 focus:border-green-500'
                      }`}
                    required
                  />
                  {confirmEmail && confirmEmail !== formData.email && (
                    <p className="text-xs text-red-500 font-semibold ml-1">Emails do not match</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Section: Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <MapPin className="text-green-600" size={20} /> Location Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">District</label>
                <div className="relative">
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:bg-white transition-all outline-none font-medium text-gray-700 appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select District</option>
                    {districts.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">DS Division</label>
                <div className="relative">
                  <select
                    name="dsDivision"
                    value={formData.dsDivision}
                    onChange={handleChange}
                    disabled={!formData.district}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:bg-white transition-all outline-none font-medium text-gray-700 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  >
                    <option value="">Select Division</option>
                    {dsDivisions.map(ds => (
                      <option key={ds} value={ds}>{ds}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">GN Division</label>
                <div className="relative">
                  <select
                    name="gnDivision"
                    value={formData.gnDivision}
                    onChange={handleChange}
                    disabled={!formData.dsDivision}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:bg-white transition-all outline-none font-medium text-gray-700 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  >
                    <option value="">Select GN Division</option>
                    {gnDivisions.map(gn => (
                      <option key={gn} value={gn}>{gn}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Officer Details (Conditionally Rendered) */}
          {isOfficer && (
            <>
              <hr className="border-gray-100" />
              <div className="bg-blue-50/50 p-6 rounded-2xl border-2 border-blue-100 space-y-4">
                <h3 className="text-lg font-bold text-blue-800 flex items-center gap-2">
                  <Building2 className="text-blue-600" size={20} /> Officer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-blue-600/80 ml-1 uppercase tracking-wider">Officer ID</label>
                    <input
                      type="text"
                      name="officerId"
                      value={formData.officerId}
                      disabled
                      className="w-full p-4 bg-white/50 border-2 border-blue-100 rounded-xl text-gray-500 font-medium cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-blue-600/80 ml-1 uppercase tracking-wider">Department</label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full p-4 bg-white border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:bg-white transition-all outline-none font-medium text-gray-700"
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-blue-600/80 ml-1 uppercase tracking-wider">Designation</label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      className="w-full p-4 bg-white border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:bg-white transition-all outline-none font-medium text-gray-700"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200 hover:shadow-green-300 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {saving ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UserProfile;
