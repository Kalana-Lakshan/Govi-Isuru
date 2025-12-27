import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AlertTriangle,
  MapPin,
  TrendingUp,
  Users,
  BarChart3,
  RefreshCw,
  Activity,
  Leaf,
  Shield,
  Clock,
  CheckCircle
} from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const OfficerDashboard = ({ user, language = 'en' }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const t = {
    en: {
      title: 'Government Officer Dashboard',
      subtitle: 'Monitor disease outbreaks and area statistics',
      activeAlerts: 'Active Disease Alerts',
      areaReports: 'Area Reports',
      affectedFarmers: 'Affected Farmers',
      topDiseases: 'Top Diseases',
      reportingCoverage: 'Reporting Coverage',
      last7Days: 'Last 7 Days',
      last30Days: 'Last 30 Days',
      critical: 'Critical',
      medium: 'Medium',
      low: 'Low',
      coverage: 'Coverage',
      trends: 'Trends',
      noData: 'No data available',
      loading: 'Loading dashboard...',
      refresh: 'Refresh Data'
    },
    si: {
      title: 'ගෙවැ‍ර්නන්ට නිලධාරී උපකරණ පුවරුව',
      subtitle: 'රෝග පිපිරීම් සහ ප්‍රදේශ සංඛ්‍යාලේඛන නිරීක්ෂණය',
      activeAlerts: 'සක්‍රීය රෝග අනතුරු ඇඟවීම්',
      areaReports: 'ප්‍රදේශ වාර්තා',
      affectedFarmers: 'බලපෑමට ලක්වූ ගොවීන්',
      topDiseases: 'ප්‍රධාන රෝග',
      reportingCoverage: 'වාර්තා කිරීම් ස්කන්ධ',
      last7Days: 'පසුගිය දින 7',
      last30Days: 'පසුගිය දින 30',
      critical: 'ඉතා විවේචනාත්මක',
      medium: 'මධ්‍යම',
      low: 'අඩු',
      coverage: 'ස්කන්ධ',
      trends: 'ප්‍රවණතා',
      noData: 'දත්ත නොමැත',
      loading: 'උපකරණ පුවරුව පූරණය වෙමින්...',
      refresh: 'දත්ත නැවුම් කරන්න'
    }
  };

  const text = t[language] || t.en;

  useEffect(() => {
    fetchDashboardStats();
  }, [user?.district]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/api/alerts/outbreak-summary`, {
        params: { 
          district: user?.district,
          days: 30
        }
      });
      
      // Process the data for officer view
      const data = response.data.summary || {};
      setStats({
        activeAlerts: data.diseaseBreakdown?.length || 0,
        criticalAlerts: data.diseaseBreakdown?.filter(d => d.severity === 'high')?.length || 0,
        affectedLocations: data.topLocations?.length || 0,
        totalReports: data.diseaseBreakdown?.reduce((sum, d) => sum + (d.count || 0), 0) || 0,
        diseases: data.diseaseBreakdown || [],
        locations: data.topLocations || []
      });
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardStats();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
        <p className="text-slate-600">{text.loading}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{text.title}</h1>
            <p className="text-blue-100 flex items-center gap-2">
              <MapPin size={18} />
              {language === 'si' ? `${user.district} දිස්ත්‍රික්කය` : `${user.district} District`}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all disabled:opacity-50"
          >
            <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
            {text.refresh}
          </button>
        </div>
      </div>

      {/* Key Stats - Risk Assessment */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Critical Alerts */}
        <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl border border-red-200 p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="text-red-600" size={24} />
            <span className="text-xs font-bold text-red-600 bg-red-200 px-2 py-1 rounded-full">CRITICAL</span>
          </div>
          <p className="text-xs text-red-600 font-semibold mb-1">{text.critical} {text.activeAlerts}</p>
          <p className="text-3xl font-bold text-red-700">{stats?.criticalAlerts || 0}</p>
          <p className="text-xs text-red-500 mt-2">{language === 'si' ? 'ක්ষණිකව ක්‍රියා කරන්න' : 'Immediate action required'}</p>
        </div>

        {/* Active Alerts */}
        <div className="bg-gradient-to-br from-orange-50 to-yellow-100/50 rounded-2xl border border-yellow-200 p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <Activity className="text-yellow-600" size={24} />
            <span className="text-xs font-bold text-yellow-600 bg-yellow-200 px-2 py-1 rounded-full">ACTIVE</span>
          </div>
          <p className="text-xs text-yellow-600 font-semibold mb-1">{text.activeAlerts}</p>
          <p className="text-3xl font-bold text-yellow-700">{stats?.activeAlerts || 0}</p>
          <p className="text-xs text-yellow-600 mt-2">{text.last7Days}</p>
        </div>

        {/* Total Reports */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-100/50 rounded-2xl border border-cyan-200 p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="text-cyan-600" size={24} />
            <span className="text-xs font-bold text-cyan-600 bg-cyan-200 px-2 py-1 rounded-full">REPORTS</span>
          </div>
          <p className="text-xs text-cyan-600 font-semibold mb-1">{text.areaReports}</p>
          <p className="text-3xl font-bold text-cyan-700">{stats?.totalReports || 0}</p>
          <p className="text-xs text-cyan-600 mt-2">{text.last30Days}</p>
        </div>

        {/* Affected Areas */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-100/50 rounded-2xl border border-purple-200 p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <MapPin className="text-purple-600" size={24} />
            <span className="text-xs font-bold text-purple-600 bg-purple-200 px-2 py-1 rounded-full">AREAS</span>
          </div>
          <p className="text-xs text-purple-600 font-semibold mb-1">{language === 'si' ? 'බලපෑමට ලක්වූ ස්ථාන' : 'Affected Areas'}</p>
          <p className="text-3xl font-bold text-purple-700">{stats?.affectedLocations || 0}</p>
          <p className="text-xs text-purple-600 mt-2">{language === 'si' ? 'GN බිම්සැල' : 'GN Divisions'}</p>
        </div>
      </div>

      {/* Top Diseases in District */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Diseases */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="text-green-600" size={20} />
            <h3 className="text-lg font-bold text-slate-800">{text.topDiseases}</h3>
          </div>
          
          {stats?.diseases && stats.diseases.length > 0 ? (
            <div className="space-y-3">
              {stats.diseases.slice(0, 5).map((disease, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-slate-800">{disease.name || `Disease ${idx + 1}`}</p>
                    <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      {disease.count || 0} {language === 'si' ? 'වාර්තා' : 'reports'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all"
                      style={{ width: `${((disease.count || 0) / (stats.diseases[0]?.count || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">{text.noData}</p>
          )}
        </div>

        {/* Risk Assessment */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="text-blue-600" size={20} />
            <h3 className="text-lg font-bold text-slate-800">{language === 'si' ? 'ঝুম්බු মূල්‍යාංකනය' : 'Risk Assessment'}</h3>
          </div>

          <div className="space-y-4">
            {/* Critical Risk */}
            <div className="p-4 bg-red-50 rounded-xl border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-red-700">{text.critical}</p>
                <p className="text-2xl font-bold text-red-700">{stats?.criticalAlerts || 0}</p>
              </div>
              <p className="text-xs text-red-600">{language === 'si' ? 'ක්ෂණිකව සාර්ථකක කිරීමට අවශ්‍ය' : 'Immediate intervention needed'}</p>
            </div>

            {/* Medium Risk */}
            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-yellow-700">{text.medium}</p>
                <p className="text-2xl font-bold text-yellow-700">
                  {Math.max(0, (stats?.activeAlerts || 0) - (stats?.criticalAlerts || 0))}
                </p>
              </div>
              <p className="text-xs text-yellow-600">{language === 'si' ? 'ඉතා සෙමින් නිරීක්ෂණය කරන්න' : 'Monitor closely'}</p>
            </div>

            {/* Coverage */}
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-blue-700">{text.reportingCoverage}</p>
                <p className="text-2xl font-bold text-blue-700">72%</p>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '72%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">{language === 'si' ? 'ක්ෂණික ක්‍රියා' : 'Quick Actions'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-white border border-slate-200 hover:border-blue-300 rounded-xl transition-all hover:shadow-md text-left">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={18} className="text-red-600" />
              <span className="font-semibold text-slate-700">{language === 'si' ? 'අনතුරු ඇඟවීම බිම්සැල' : 'Alert Areas'}</span>
            </div>
            <p className="text-xs text-slate-500">{language === 'si' ? 'ජීවිතාධාර ගරු සිදු නිලධාරීවරුන්ට' : 'Notify affected farmers'}</p>
          </button>

          <button className="p-4 bg-white border border-slate-200 hover:border-green-300 rounded-xl transition-all hover:shadow-md text-left">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={18} className="text-green-600" />
              <span className="font-semibold text-slate-700">{language === 'si' ? 'වාර්තා සමීක්ෂණ' : 'Verify Reports'}</span>
            </div>
            <p className="text-xs text-slate-500">{language === 'si' ? 'ඉතිරි වාර්තා සත්‍යතා' : 'Validate pending reports'}</p>
          </button>

          <button className="p-4 bg-white border border-slate-200 hover:border-purple-300 rounded-xl transition-all hover:shadow-md text-left">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={18} className="text-purple-600" />
              <span className="font-semibold text-slate-700">{language === 'si' ? 'විස්තෘත විශ්ලේෂණ' : 'View Analysis'}</span>
            </div>
            <p className="text-xs text-slate-500">{language === 'si' ? 'සම්පූර්ණ ප්‍රවණතා දර්ශනය' : 'Full trend analysis'}</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfficerDashboard;
