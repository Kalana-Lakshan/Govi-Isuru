import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Flag,
  User,
  Calendar,
  MapPin,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Search,
  Filter
} from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Trust score color coding
const getTrustColor = (score) => {
  if (score >= 70) return 'text-green-600 bg-green-100';
  if (score >= 50) return 'text-yellow-600 bg-yellow-100';
  if (score >= 30) return 'text-orange-600 bg-orange-100';
  return 'text-red-600 bg-red-100';
};

// Verification status badges
const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-800', icon: Eye, label: 'Pending' },
  verified: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Verified' },
  flagged: { color: 'bg-orange-100 text-orange-800', icon: Flag, label: 'Flagged' },
  rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Rejected' }
};

const AdminModerationPanel = ({ user, language = 'en' }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedReport, setExpandedReport] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewingId, setReviewingId] = useState(null);

  const t = {
    en: {
      title: 'Report Moderation',
      subtitle: 'Review and verify disease reports',
      loading: 'Loading reports...',
      noReports: 'No reports to review',
      filters: 'Filter by status',
      all: 'All Reports',
      pending: 'Pending',
      flagged: 'Flagged',
      verified: 'Verified',
      rejected: 'Rejected',
      search: 'Search by disease or location...',
      trustScore: 'Trust Score',
      confidence: 'AI Confidence',
      farmerRep: 'Farmer Rep',
      confirmations: 'Confirmations',
      actions: 'Actions',
      approve: 'Approve',
      reject: 'Reject',
      flag: 'Flag',
      reportedBy: 'Reported by',
      location: 'Location',
      reviewedBy: 'Reviewed by',
      flagReason: 'Flag Reason',
      enterReason: 'Enter reason for flagging...',
      refresh: 'Refresh'
    },
    si: {
      title: 'වාර්තා මධ්‍යස්ථකරණය',
      subtitle: 'රෝග වාර්තා සමාලෝචනය සහ සත්‍යාපනය',
      loading: 'වාර්තා පූරණය වෙමින්...',
      noReports: 'සමාලෝචනය කිරීමට වාර්තා නැත',
      filters: 'තත්ත්වය අනුව පෙරන්න',
      all: 'සියලු වාර්තා',
      pending: 'පොරොත්තුවේ',
      flagged: 'සලකුණු කළ',
      verified: 'සත්‍යාපිත',
      rejected: 'ප්‍රතික්ෂේප කළ',
      search: 'රෝගය හෝ ස්ථානය අනුව සොයන්න...',
      trustScore: 'විශ්වාස ලකුණු',
      confidence: 'AI විශ්වාසය',
      farmerRep: 'ගොවි කීර්තිය',
      confirmations: 'තහවුරු කිරීම්',
      actions: 'ක්‍රියාමාර්ග',
      approve: 'අනුමත කරන්න',
      reject: 'ප්‍රතික්ෂේප කරන්න',
      flag: 'සලකුණු කරන්න',
      reportedBy: 'වාර්තා කළේ',
      location: 'ස්ථානය',
      reviewedBy: 'සමාලෝචනය කළේ',
      flagReason: 'සලකුණු කිරීමේ හේතුව',
      enterReason: 'සලකුණු කිරීමේ හේතුව ඇතුළත් කරන්න...',
      refresh: 'නැවුම් කරන්න'
    }
  };

  const text = t[language] || t.en;

  // Get auth token
  const getToken = () => localStorage.getItem('token');

  // Fetch flagged reports
  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/api/alerts/flagged`, {
        headers: { Authorization: `Bearer ${getToken()}` },
        params: { district: user?.district }
      });
      setReports(response.data.reports || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [user?.district]);

  // Review a report
  const reviewReport = async (reportId, status, flaggedReason = null) => {
    try {
      setReviewingId(reportId);
      await axios.put(
        `${API_BASE}/api/alerts/reports/${reportId}/review`,
        { status, flaggedReason },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      
      // Update local state
      setReports(reports.map(r => 
        r._id === reportId 
          ? { ...r, verificationStatus: status, adminReviewed: true }
          : r
      ));
      
      setExpandedReport(null);
    } catch (err) {
      console.error('Error reviewing report:', err);
    } finally {
      setReviewingId(null);
    }
  };

  // Filter and search reports
  const filteredReports = reports.filter(report => {
    const matchesFilter = filter === 'all' || report.verificationStatus === filter;
    const matchesSearch = !searchTerm || 
      report.disease?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.gnDivision?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.district?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Format date
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="w-6 h-6" />
              {text.title}
            </h2>
            <p className="text-slate-300 text-sm mt-1">{text.subtitle}</p>
          </div>
          <button
            onClick={fetchReports}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            title={text.refresh}
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          {['pending', 'flagged', 'verified', 'rejected'].map(status => {
            const count = reports.filter(r => r.verificationStatus === status).length;
            const config = statusConfig[status];
            return (
              <button
                key={status}
                onClick={() => setFilter(filter === status ? 'all' : status)}
                className={`p-3 rounded-lg text-center transition-all ${
                  filter === status 
                    ? 'bg-white text-slate-800' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-xs opacity-80 capitalize">{config.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 bg-gray-50 border-b flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={text.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-slate-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 bg-white border rounded-lg text-sm focus:ring-2 focus:ring-slate-500"
          >
            <option value="all">{text.all}</option>
            <option value="pending">{text.pending}</option>
            <option value="flagged">{text.flagged}</option>
            <option value="verified">{text.verified}</option>
            <option value="rejected">{text.rejected}</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      <div className="divide-y max-h-[600px] overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
            {text.loading}
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <CheckCircle className="w-10 h-10 mx-auto mb-2 text-green-500" />
            {text.noReports}
          </div>
        ) : (
          filteredReports.map(report => {
            const isExpanded = expandedReport === report._id;
            const config = statusConfig[report.verificationStatus] || statusConfig.pending;
            const StatusIcon = config.icon;

            return (
              <div key={report._id} className="hover:bg-gray-50 transition-colors">
                {/* Report Summary Row */}
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedReport(isExpanded ? null : report._id)}
                >
                  <div className="flex items-center gap-4">
                    {/* Status Badge */}
                    <div className={`p-2 rounded-lg ${config.color}`}>
                      <StatusIcon className="w-5 h-5" />
                    </div>

                    {/* Disease & Location */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-800">{report.disease}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                          {config.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {report.gnDivision}, {report.district}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(report.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Trust Score */}
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${getTrustColor(report.trustScore)}`}>
                      {report.trustScore}%
                    </div>

                    {/* AI Confidence */}
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-700">
                        {Math.round((report.confidence || 0) * 100)}%
                      </div>
                      <div className="text-xs text-gray-500">{text.confidence}</div>
                    </div>

                    {/* Expand Toggle */}
                    <div className="text-gray-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 bg-gray-50 border-t">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
                      {/* Reporter Info */}
                      <div className="bg-white p-3 rounded-lg border">
                        <div className="text-xs text-gray-500 mb-1">{text.reportedBy}</div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{report.farmerUsername || 'Anonymous'}</span>
                        </div>
                        {report.farmerId?.reputation_score && (
                          <div className="text-xs text-gray-500 mt-1">
                            {text.farmerRep}: {report.farmerId.reputation_score}/5
                          </div>
                        )}
                      </div>

                      {/* Community Confirmations */}
                      <div className="bg-white p-3 rounded-lg border">
                        <div className="text-xs text-gray-500 mb-1">{text.confirmations}</div>
                        <div className="flex items-center gap-2">
                          <ThumbsUp className="w-4 h-4 text-green-500" />
                          <span className="font-bold text-lg">{report.communityConfirmations || 0}</span>
                        </div>
                      </div>

                      {/* Severity */}
                      <div className="bg-white p-3 rounded-lg border">
                        <div className="text-xs text-gray-500 mb-1">Severity</div>
                        <div className={`font-bold capitalize ${
                          report.severity === 'high' || report.severity === 'critical' 
                            ? 'text-red-600' 
                            : report.severity === 'medium' 
                              ? 'text-yellow-600' 
                              : 'text-green-600'
                        }`}>
                          {report.severity || 'Unknown'}
                        </div>
                      </div>

                      {/* AI Valid */}
                      <div className="bg-white p-3 rounded-lg border">
                        <div className="text-xs text-gray-500 mb-1">AI Valid</div>
                        <div className={`flex items-center gap-1 ${
                          report.aiConfidenceValid ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {report.aiConfidenceValid ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                          {report.aiConfidenceValid ? 'Yes' : 'No'}
                        </div>
                      </div>
                    </div>

                    {/* Flag Reason if exists */}
                    {report.flaggedReason && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                        <div className="text-xs text-orange-600 font-medium mb-1">{text.flagReason}</div>
                        <p className="text-sm text-orange-800">{report.flaggedReason}</p>
                      </div>
                    )}

                    {/* Review info if reviewed */}
                    {report.adminReviewed && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <div className="text-xs text-blue-600 font-medium mb-1">{text.reviewedBy}</div>
                        <p className="text-sm text-blue-800">
                          {report.reviewedBy} • {formatDate(report.reviewedAt)}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {!report.adminReviewed && (
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => reviewReport(report._id, 'verified')}
                          disabled={reviewingId === report._id}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          {text.approve}
                        </button>
                        <button
                          onClick={() => reviewReport(report._id, 'rejected')}
                          disabled={reviewingId === report._id}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          <ThumbsDown className="w-4 h-4" />
                          {text.reject}
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt(text.enterReason);
                            if (reason) reviewReport(report._id, 'flagged', reason);
                          }}
                          disabled={reviewingId === report._id}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                        >
                          <Flag className="w-4 h-4" />
                          {text.flag}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminModerationPanel;
