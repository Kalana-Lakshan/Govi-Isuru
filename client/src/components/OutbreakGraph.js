import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  AlertTriangle, 
  Calendar, 
  Filter,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Activity
} from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Disease colors for charts
const diseaseColors = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899'  // pink
];

const OutbreakGraph = ({ user, language = 'en' }) => {
  const [timeSeriesData, setTimeSeriesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    disease: 'all',
    days: 30
  });
  const [chartType, setChartType] = useState('line');

  const t = {
    en: {
      title: 'Disease Outbreak Trends',
      subtitle: 'Track disease patterns over time',
      loading: 'Loading trend data...',
      noData: 'No outbreak data available',
      filters: 'Filters',
      disease: 'Disease',
      timeRange: 'Time Range',
      all: 'All Diseases',
      days: 'days',
      reports: 'reports',
      totalReports: 'Total Reports',
      outbreakAlerts: 'Outbreak Alerts',
      rapidIncrease: 'Rapid Increase',
      newOutbreak: 'New Outbreak',
      increase: 'increase',
      detected: 'detected',
      lineChart: 'Line Chart',
      areaChart: 'Area Chart',
      refresh: 'Refresh'
    },
    si: {
      title: 'රෝග පැතිරීම් ප්‍රවණතා',
      subtitle: 'කාලය තුළ රෝග රටා නිරීක්ෂණය',
      loading: 'ප්‍රවණතා දත්ත පූරණය වෙමින්...',
      noData: 'පැතිරීම් දත්ත නොමැත',
      filters: 'පෙරහන්',
      disease: 'රෝගය',
      timeRange: 'කාල පරාසය',
      all: 'සියලු රෝග',
      days: 'දින',
      reports: 'වාර්තා',
      totalReports: 'මුළු වාර්තා',
      outbreakAlerts: 'පැතිරීම් අනතුරු ඇඟවීම්',
      rapidIncrease: 'වේගවත් වැඩිවීම',
      newOutbreak: 'නව පැතිරීම',
      increase: 'වැඩිවීම',
      detected: 'හඳුනාගන්නා ලදී',
      lineChart: 'රේඛා සටහන',
      areaChart: 'ප්‍රදේශ සටහන',
      refresh: 'නැවුම් කරන්න'
    }
  };

  const text = t[language] || t.en;

  // Fetch time series data
  const fetchTimeSeriesData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        days: filters.days
      });
      if (filters.disease !== 'all') params.append('disease', filters.disease);
      if (user?.district) params.append('district', user.district);

      const response = await axios.get(`${API_BASE}/api/alerts/timeseries?${params}`);
      setTimeSeriesData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching time series data:', err);
      setError('Failed to load trend data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeSeriesData();
  }, [filters, user?.district]);

  // Transform data for Recharts
  const getChartData = () => {
    if (!timeSeriesData || !timeSeriesData.dates || !timeSeriesData.series) return [];

    return timeSeriesData.dates.map(date => {
      const point = { date: formatDate(date) };
      timeSeriesData.series.forEach(series => {
        const dataPoint = series.data.find(d => d.date === date);
        point[series.disease] = dataPoint ? dataPoint.count : 0;
      });
      return point;
    });
  };

  // Format date for display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get unique diseases for filter
  const diseases = timeSeriesData?.series?.map(s => s.disease) || [];

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-bold text-gray-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-bold">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const chartData = getChartData();

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              {text.title}
            </h2>
            <p className="text-purple-100 text-sm mt-1">{text.subtitle}</p>
          </div>
          <button
            onClick={fetchTimeSeriesData}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            title={text.refresh}
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold">{timeSeriesData?.totalReports || 0}</div>
            <div className="text-xs text-purple-100">{text.totalReports}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold">{timeSeriesData?.outbreakAlerts?.length || 0}</div>
            <div className="text-xs text-purple-100">{text.outbreakAlerts}</div>
          </div>
        </div>
      </div>

      {/* Outbreak Alerts */}
      {timeSeriesData?.outbreakAlerts?.length > 0 && (
        <div className="p-4 bg-red-50 border-b border-red-100">
          <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {text.outbreakAlerts}
          </h3>
          <div className="space-y-2">
            {timeSeriesData.outbreakAlerts.map((alert, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg flex items-center justify-between ${
                  alert.type === 'rapid_increase' 
                    ? 'bg-orange-100 border border-orange-200' 
                    : 'bg-red-100 border border-red-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  {alert.type === 'rapid_increase' ? (
                    <ArrowUp className="w-5 h-5 text-orange-600" />
                  ) : (
                    <Activity className="w-5 h-5 text-red-600" />
                  )}
                  <div>
                    <span className="font-bold text-gray-800">{alert.disease}</span>
                    <span className="text-gray-600 text-sm ml-2">
                      {alert.type === 'rapid_increase' 
                        ? `${alert.increase}% ${text.increase}`
                        : text.newOutbreak
                      }
                    </span>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {alert.recentCount} {text.reports}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="p-4 bg-gray-50 border-b flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-600">{text.filters}:</span>
        </div>

        <select
          value={filters.disease}
          onChange={(e) => setFilters(f => ({ ...f, disease: e.target.value }))}
          className="px-3 py-1.5 bg-white border rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">{text.all}</option>
          {diseases.map(disease => (
            <option key={disease} value={disease}>{disease}</option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <select
            value={filters.days}
            onChange={(e) => setFilters(f => ({ ...f, days: parseInt(e.target.value) }))}
            className="px-3 py-1.5 bg-white border rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
          >
            <option value={7}>7 {text.days}</option>
            <option value={14}>14 {text.days}</option>
            <option value={30}>30 {text.days}</option>
            <option value={60}>60 {text.days}</option>
            <option value={90}>90 {text.days}</option>
          </select>
        </div>

        {/* Chart Type Toggle */}
        <div className="flex gap-1 bg-white border rounded-lg p-0.5">
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1 rounded text-sm ${
              chartType === 'line' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {text.lineChart}
          </button>
          <button
            onClick={() => setChartType('area')}
            className={`px-3 py-1 rounded text-sm ${
              chartType === 'area' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {text.areaChart}
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="p-4">
        {loading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="flex items-center gap-2 text-purple-600">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>{text.loading}</span>
            </div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-80 flex items-center justify-center text-gray-500">
            {text.noData}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            {chartType === 'line' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {timeSeriesData?.series?.slice(0, 8).map((series, index) => (
                  <Line
                    key={series.disease}
                    type="monotone"
                    dataKey={series.disease}
                    stroke={diseaseColors[index % diseaseColors.length]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                ))}
              </LineChart>
            ) : (
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {timeSeriesData?.series?.slice(0, 8).map((series, index) => (
                  <Area
                    key={series.disease}
                    type="monotone"
                    dataKey={series.disease}
                    stroke={diseaseColors[index % diseaseColors.length]}
                    fill={diseaseColors[index % diseaseColors.length]}
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                ))}
              </AreaChart>
            )}
          </ResponsiveContainer>
        )}
      </div>

      {/* Disease Summary */}
      {timeSeriesData?.series?.length > 0 && (
        <div className="p-4 border-t bg-gray-50">
          <h3 className="font-bold text-gray-700 mb-3">Disease Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {timeSeriesData.series.slice(0, 8).map((series, index) => (
              <div 
                key={series.disease}
                className="bg-white p-3 rounded-lg border flex items-center gap-2"
              >
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: diseaseColors[index % diseaseColors.length] }}
                />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-800 truncate">
                    {series.disease}
                  </div>
                  <div className="text-xs text-gray-500">
                    {series.total} {text.reports}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OutbreakGraph;
