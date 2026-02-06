import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AlertTriangle,
  Map,
  TrendingUp,
  Shield,
  Bell,
  Activity,
  ChevronRight,
  RefreshCw,
  BarChart3,
  MapPin,
  Calendar
} from 'lucide-react';
import DiseaseHeatmap from './DiseaseHeatmap';
import OutbreakGraph from './OutbreakGraph';
import AdminModerationPanel from './AdminModerationPanel';
import CommunityAlerts from './CommunityAlerts';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AlertsDashboard = ({ user, language = 'en', isOfficer = false }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const t = {
    en: {
      title: 'Disease Alert System',
      subtitle: 'Monitor and track disease outbreaks in your area',
      overview: 'Overview',
      heatmap: 'Heatmap',
      trends: 'Trends',
      alerts: 'My Alerts',
      moderation: 'Moderation',
      totalReports: 'Total Reports',
      activeAlerts: 'Active Alerts',
      last7Days: 'Last 7 Days',
      topDiseases: 'Top Diseases',
      affectedDistricts: 'Most Affected Districts',
      quickStats: 'Quick Statistics',
      viewAll: 'View All',
      loading: 'Loading dashboard...',
      noData: 'No data available',
      reports: 'reports',
      refresh: 'Refresh'
    },
    si: {
      title: 'රෝග අනතුරු ඇඟවීම් පද්ධතිය',
      subtitle: 'ඔබේ ප්‍රදේශයේ රෝග පැතිරීම් නිරීක්ෂණය',
      overview: 'දළ විශ්ලේෂණය',
      heatmap: 'තාප සිතියම',
      trends: 'ප්‍රවණතා',
      alerts: 'මගේ අනතුරු ඇඟවීම්',
      moderation: 'මධ්‍යස්ථකරණය',
      totalReports: 'මුළු වාර්තා',
      activeAlerts: 'සක්‍රීය අනතුරු ඇඟවීම්',
      last7Days: 'පසුගිය දින 7',
      topDiseases: 'ප්‍රධාන රෝග',
      affectedDistricts: 'වැඩිපුරම බලපෑමට ලක්වූ දිස්ත්‍රික්ක',
      quickStats: 'ඉක්මන් සංඛ්‍යාලේඛන',
      viewAll: 'සියල්ල බලන්න',
      loading: 'උපකරණ පුවරුව පූරණය වෙමින්...',
      noData: 'දත්ත නොමැත',
      reports: 'වාර්තා',
      refresh: 'නැවුම් කරන්න'
    }
  };

  const text = t[language] || t.en;

  // Fetch outbreak summary
  const fetchSummary = async () => {
    try {
      setLoading(true);
      // First try with user's district, then fallback to all data
      let response = await axios.get(`${API_BASE}/alerts/outbreak-summary`, {
        params: { 
          district: user?.district,
          days: 30 // Extend to 30 days for more data
        }
      });
      
      // If no data for user's district, fetch all data
      if (!response.data.summary?.diseaseBreakdown?.length && 
          !response.data.summary?.topLocations?.length) {
        response = await axios.get(`${API_BASE}/alerts/outbreak-summary`, {
          params: { days: 30 }
        });
      }
      
      setSummary(response.data.summary);
    } catch (err) {
      console.error('Error fetching summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [user?.district]);

  // Role-based tabs
  const tabs = isOfficer ? [
    { id: 'overview', label: language === 'si' ? 'දළ විශ්ලේෂණය' : 'Overview', icon: Activity },
    { id: 'heatmap', label: language === 'si' ? 'තාප සිතියම' : 'Heatmap', icon: Map },
    { id: 'trends', label: language === 'si' ? 'ප්‍රවණතා' : 'Trends', icon: TrendingUp },
    { id: 'moderation', label: language === 'si' ? 'වාර්තා සත්‍යතා' : 'Verify Reports', icon: Shield }
  ] : [
    { id: 'overview', label: text.overview, icon: Activity },
    { id: 'heatmap', label: text.heatmap, icon: Map },
    { id: 'trends', label: text.trends, icon: TrendingUp },
    { id: 'alerts', label: text.alerts, icon: Bell }
  ];

  // Severity colors for disease badges
  const getSeverityColor = (count) => {
    if (count > 10) return 'bg-red-100 text-red-700';
    if (count > 5) return 'bg-orange-100 text-orange-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`bg-gradient-to-r ${isOfficer ? 'from-blue-600 via-cyan-500 to-teal-500' : 'from-red-600 via-orange-500 to-yellow-500'} rounded-3xl p-6 text-white shadow-xl`}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <AlertTriangle className="w-8 h-8" />
              {isOfficer 
                ? (language === 'si' ? 'ප්‍රදේශ රෝග අනතුරු ඇඟවීම්' : 'Area Disease Alerts')
                : text.title
              }
            </h1>
            <p className="text-white/80 mt-1">
              {isOfficer 
                ? (language === 'si' 
                  ? `${user?.district} දිස්ත්‍රික්කයේ සිටින සියලුම GN බිම්සැල සඳහා රෝග පැතිරීම් නිරීක්ෂණය කරන්න`
                  : `Monitor disease outbreaks across all areas in ${user?.district} district`)
                : text.subtitle
              }
            </p>
            {user?.district && (
              <div className={`flex items-center gap-2 mt-3 text-sm ${isOfficer ? 'bg-blue-400/20' : 'bg-white/20'} w-fit px-3 py-1 rounded-full`}>
                <MapPin className="w-4 h-4" />
                {isOfficer ? user.district : `${user.gnDivision}, ${user.district}`}
              </div>
            )}
          </div>
          <button
            onClick={fetchSummary}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            title={text.refresh}
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Quick Stats */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">{summary.totalReports}</div>
              <div className="text-sm text-white/80">{text.totalReports}</div>
              <div className="text-xs text-white/60 mt-1">{text.last7Days}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">{summary.activeAlerts}</div>
              <div className="text-sm text-white/80">{text.activeAlerts}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">{summary.diseaseBreakdown?.length || 0}</div>
              <div className="text-sm text-white/80">Diseases Detected</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">{summary.topLocations?.length || 0}</div>
              <div className="text-sm text-white/80">Districts Affected</div>
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-lg p-2 flex flex-wrap gap-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Diseases */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-red-500" />
                  {text.topDiseases}
                </h2>
                <button 
                  onClick={() => setActiveTab('trends')}
                  className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  {text.viewAll} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                  {text.loading}
                </div>
              ) : summary?.diseaseBreakdown?.length > 0 ? (
                <div className="space-y-3">
                  {summary.diseaseBreakdown.slice(0, 5).map((item, index) => (
                    <div 
                      key={item.disease}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-red-100 text-red-700 rounded-full flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </span>
                        <span className="font-medium text-gray-800">{item.disease}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${getSeverityColor(item.count)}`}>
                        {item.count} {text.reports}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">{text.noData}</div>
              )}
            </div>

            {/* Affected Districts */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  {text.affectedDistricts}
                </h2>
                <button 
                  onClick={() => setActiveTab('heatmap')}
                  className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                  {text.viewAll} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                  {text.loading}
                </div>
              ) : summary?.topLocations?.length > 0 ? (
                <div className="space-y-3">
                  {summary.topLocations.slice(0, 5).map((item, index) => (
                    <div 
                      key={item.district}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </span>
                        <span className="font-medium text-gray-800">{item.district}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${getSeverityColor(item.count)}`}>
                        {item.count} {text.reports}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">{text.noData}</div>
              )}
            </div>

            {/* Severity Breakdown */}
            {summary?.severityBreakdown?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6 lg:col-span-2">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  Severity Distribution
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {['critical', 'high', 'medium', 'low', 'none'].map(severity => {
                    const data = summary.severityBreakdown.find(s => s.severity === severity);
                    const colors = {
                      critical: 'bg-red-500',
                      high: 'bg-orange-500',
                      medium: 'bg-yellow-500',
                      low: 'bg-green-500',
                      none: 'bg-gray-400'
                    };
                    return (
                      <div key={severity} className="text-center p-4 bg-gray-50 rounded-xl">
                        <div className={`w-12 h-12 ${colors[severity]} rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-lg`}>
                          {data?.count || 0}
                        </div>
                        <div className="text-sm font-medium text-gray-600 capitalize">{severity}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'heatmap' && (
          <DiseaseHeatmap user={user} language={language} />
        )}

        {activeTab === 'trends' && (
          <OutbreakGraph user={user} language={language} />
        )}

        {activeTab === 'alerts' && (
          <CommunityAlerts user={user} language={language} />
        )}

        {isOfficer && activeTab === 'moderation' && (
          <AdminModerationPanel user={user} language={language} />
        )}
      </div>
    </div>
  );
};

export default AlertsDashboard;
