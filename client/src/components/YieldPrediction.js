import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  MapPin, 
  Calendar,
  DollarSign,
  BarChart3,
  Leaf,
  CloudRain,
  Sun,
  Activity,
  Award,
  Target,
  Info,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from 'lucide-react';

const API_BASE = process.env.REACT_APP_AI_API_URL || 'http://localhost:8000';

// Sri Lanka Districts
const DISTRICTS = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
  'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
  'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
  'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'NuwaraEliya',
  'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
];

// Climate zones info
const CLIMATE_INFO = {
  wet_zone: { name: 'Wet Zone', icon: CloudRain, color: 'blue', desc: 'High rainfall, suitable for rice' },
  dry_zone: { name: 'Dry Zone', icon: Sun, color: 'orange', desc: 'Irrigation dependent' },
  intermediate: { name: 'Intermediate', icon: Activity, color: 'green', desc: 'Moderate conditions' }
};

// Translations
const translations = {
  en: {
    title: 'Yield Prediction',
    subtitle: '10-year historical data analysis for Sri Lankan paddy cultivation',
    tabs: {
      predict: 'Predict Yield',
      rankings: 'District Rankings',
      trends: 'Trends'
    },
    form: {
      parameters: 'Prediction Parameters',
      district: 'District',
      season: 'Season',
      year: 'Year',
      area: 'Area (hectares)',
      advancedOptions: 'Advanced Options',
      costPerHa: 'Cost per Hectare (LKR) - Optional',
      pricePerKg: 'Expected Price per kg (LKR) - Optional',
      analyzing: 'Analyzing...',
      predictBtn: 'Predict Yield'
    },
    seasons: {
      maha: 'Maha',
      yala: 'Yala'
    },
    results: {
      yieldResults: 'Yield Prediction Results',
      predictedYield: 'Predicted Yield',
      totalProduction: 'Total Production',
      confidence: 'Confidence',
      accuracy: 'accuracy',
      stabilityIndex: 'Stability Index',
      consistent: 'consistent',
      yieldRange: 'Expected Yield Range',
      profitForecast: 'Profit Forecast',
      estimatedProfit: 'Estimated Profit',
      expectedRevenue: 'Expected Revenue',
      totalCost: 'Total Cost',
      roi: 'Return on Investment',
      profitPerHa: 'Profit per Hectare',
      breakEvenYield: 'Break-even Yield'
    },
    warning: {
      title: 'Early Warning',
      riskLevel: 'Risk Level',
      riskScore: 'Risk Score',
      warnings: 'Warnings',
      recommendations: 'Recommendations'
    },
    rankings: {
      title: 'District Rankings',
      rank: 'Rank',
      district: 'District',
      avgYield: 'Avg Yield (kg/ha)',
      stability: 'Stability',
      trend: 'Trend',
      score: 'Score'
    },
    trends: {
      title: 'Yield Trends',
      avgYield: 'Average Yield',
      totalProduction: 'Total Production',
      dataPoints: 'Data Points',
      seasons: 'seasons',
      allYears: 'MT (all years)'
    }
  },
  si: {
    title: 'අස්වැන්න අනාවැකි',
    subtitle: 'ශ්‍රී ලංකාවේ වී වගාව සඳහා වසර 10 ක ඓතිහාසික දත්ත විශ්ලේෂණය',
    tabs: {
      predict: 'අස්වැන්න අනාවැකිය',
      rankings: 'දිස්ත්‍රික් ශ්‍රේණිගත කිරීම',
      trends: 'ප්‍රවණතා'
    },
    form: {
      parameters: 'අනාවැකි පරාමිතීන්',
      district: 'දිස්ත්‍රික්කය',
      season: 'කන්නය',
      year: 'අවුරුද්ද',
      area: 'වගා බිම් ප්‍රමාණය (හෙක්ටයාර්)',
      advancedOptions: 'උසස් විකල්ප',
      costPerHa: 'හෙක්ටයාරයකට පිරිවැය (රු.) - විකල්ප',
      pricePerKg: 'කිලෝවකට අපේක්ෂිත මිල (රු.) - විකල්ප',
      analyzing: 'විශ්ලේෂණය කරමින්...',
      predictBtn: 'අස්වැන්න අනාවැකිය'
    },
    seasons: {
      maha: 'මහ',
      yala: 'යල'
    },
    results: {
      yieldResults: 'අස්වැන්න අනාවැකි ප්‍රතිඵල',
      predictedYield: 'අපේක්ෂිත අස්වැන්න',
      totalProduction: 'මුළු නිෂ්පාදනය',
      confidence: 'විශ්වාසය',
      accuracy: 'නිරවද්‍යතාව',
      stabilityIndex: 'ස්ථාවරත්ව දර්ශකය',
      consistent: 'ස්ථාවර',
      yieldRange: 'අපේක්ෂිත අස්වැන්න පරාසය',
      profitForecast: 'ලාභ අනාවැකිය',
      estimatedProfit: 'ඇස්තමේන්තුගත ලාභය',
      expectedRevenue: 'අපේක්ෂිත ආදායම',
      totalCost: 'මුළු පිරිවැය',
      roi: 'ආයෝජන ප්‍රතිලාභය',
      profitPerHa: 'හෙක්ටයාරයකට ලාභය',
      breakEvenYield: 'බිඳීම් අස්වැන්න'
    },
    warning: {
      title: 'පූර්ව අනතුරු ඇඟවීම',
      riskLevel: 'අවදානම් මට්ටම',
      riskScore: 'අවදානම් ලකුණු',
      warnings: 'අවවාද',
      recommendations: 'නිර්දේශ'
    },
    rankings: {
      title: 'දිස්ත්‍රික් ශ්‍රේණිගත කිරීම',
      rank: 'ශ්‍රේණිය',
      district: 'දිස්ත්‍රික්කය',
      avgYield: 'සාමාන්‍ය අස්වැන්න (kg/ha)',
      stability: 'ස්ථාවරත්වය',
      trend: 'ප්‍රවණතාව',
      score: 'ලකුණු'
    },
    trends: {
      title: 'අස්වැන්න ප්‍රවණතා',
      avgYield: 'සාමාන්‍ය අස්වැන්න',
      totalProduction: 'මුළු නිෂ්පාදනය',
      dataPoints: 'දත්ත ලක්ෂ්‍ය',
      seasons: 'කන්න',
      allYears: 'MT (සියලු වසර)'
    }
  }
};

const YieldPrediction = ({ lang = 'en' }) => {
  // Get translations for current language
  const t = translations[lang] || translations.en;
  // State
  const [district, setDistrict] = useState('Anuradhapura');
  const [season, setSeason] = useState('Maha');
  const [year, setYear] = useState(new Date().getFullYear());
  const [area, setArea] = useState(1);
  const [costPerHa, setCostPerHa] = useState('');
  const [pricePerKg, setPricePerKg] = useState('');
  
  // Results
  const [yieldPrediction, setYieldPrediction] = useState(null);
  const [profitPrediction, setProfitPrediction] = useState(null);
  const [warning, setWarning] = useState(null);
  const [rankings, setRankings] = useState([]);
  const [trends, setTrends] = useState([]);
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('predict');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Fetch yield prediction
  const fetchYieldPrediction = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        district,
        season,
        year: year.toString(),
        ...(area && { area_ha: area.toString() })
      });
      
      const response = await fetch(`${API_BASE}/yield/predict?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setYieldPrediction(data);
      } else {
        throw new Error(data.detail || 'Prediction failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch profit prediction
  const fetchProfitPrediction = async () => {
    if (!area) return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams({
        district,
        season,
        year: year.toString(),
        area_ha: area.toString(),
        ...(costPerHa && { cost_per_ha: costPerHa }),
        ...(pricePerKg && { price_per_kg: pricePerKg })
      });
      
      const response = await fetch(`${API_BASE}/yield/profit?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setProfitPrediction(data);
      }
    } catch (err) {
      console.error('Profit prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch early warning
  const fetchWarning = async () => {
    try {
      const params = new URLSearchParams({ district, season, year: year.toString() });
      const response = await fetch(`${API_BASE}/yield/warning?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setWarning(data);
      }
    } catch (err) {
      console.error('Warning fetch error:', err);
    }
  };

  // Fetch district rankings
  const fetchRankings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/yield/rankings`);
      const data = await response.json();
      
      if (data.success && Array.isArray(data.rankings)) {
        setRankings(data.rankings);
      } else {
        setRankings([]);
        setError(lang === 'si' ? 'ශ්‍රේණිගත කිරීම් දත්ත නොමැත' : 'No rankings data available');
      }
    } catch (err) {
      setError(err.message);
      setRankings([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch trends
  const fetchTrends = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        ...(district && { district }),
        ...(season && { season })
      });
      const response = await fetch(`${API_BASE}/yield/trends?${params}`);
      const data = await response.json();
      
      if (data.success && Array.isArray(data.trends)) {
        setTrends(data.trends);
      } else {
        setTrends([]);
      }
    } catch (err) {
      setError(err.message);
      setTrends([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchRankings();
  }, []);

  // Predict when form changes
  const handlePredict = () => {
    fetchYieldPrediction();
    fetchWarning();
    if (area) {
      fetchProfitPrediction();
    }
  };

  // Risk level styling
  const getRiskStyle = (level) => {
    const styles = {
      low: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-500' },
      medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-500' },
      high: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-500' },
      critical: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-500' }
    };
    return styles[level] || styles.medium;
  };

  // Format number with commas
  const formatNumber = (num, decimals = 0) => {
    if (num === undefined || num === null) return '-';
    return Number(num).toLocaleString('en-US', { 
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-green-800 flex items-center justify-center gap-3">
            <TrendingUp className="w-10 h-10" />
            {t.title}
          </h1>
          <p className="text-green-600 mt-2">
            {t.subtitle}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {[
            { id: 'predict', label: t.tabs.predict, icon: Target },
            { id: 'rankings', label: t.tabs.rankings, icon: Award },
            { id: 'trends', label: t.tabs.trends, icon: BarChart3 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'rankings') fetchRankings();
                if (tab.id === 'trends') fetchTrends();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-green-700 hover:bg-green-50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Prediction Tab */}
        {activeTab === 'predict' && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Input Form */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                  <Leaf className="w-6 h-6" />
                  {t.form.parameters}
                </h2>

                {/* District */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    {t.form.district}
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    {DISTRICTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Season */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    {t.form.season}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Maha', 'Yala'].map(s => (
                      <button
                        key={s}
                        onClick={() => setSeason(s)}
                        className={`p-3 rounded-lg font-medium transition-all ${
                          season === s
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {s === 'Maha' ? `🌧️ ${t.seasons.maha}` : `☀️ ${t.seasons.yala}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Year */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.form.year}
                  </label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    min={2020}
                    max={2030}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Area */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.form.area}
                  </label>
                  <input
                    type="number"
                    value={area}
                    onChange={(e) => setArea(parseFloat(e.target.value))}
                    min={0.1}
                    step={0.1}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Advanced Options */}
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 mb-2"
                >
                  {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {t.form.advancedOptions}
                </button>

                {showAdvanced && (
                  <div className="space-y-3 p-3 bg-gray-50 rounded-lg mb-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        {t.form.costPerHa}
                      </label>
                      <input
                        type="number"
                        value={costPerHa}
                        onChange={(e) => setCostPerHa(e.target.value)}
                        placeholder="e.g., 150000"
                        className="w-full p-2 border rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        {t.form.pricePerKg}
                      </label>
                      <input
                        type="number"
                        value={pricePerKg}
                        onChange={(e) => setPricePerKg(e.target.value)}
                        placeholder="e.g., 85"
                        className="w-full p-2 border rounded text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Predict Button */}
                <button
                  onClick={handlePredict}
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-bold hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Target className="w-5 h-5" />
                  )}
                  {loading ? t.form.analyzing : t.form.predictBtn}
                </button>

                {error && (
                  <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}
              </div>
            </div>

            {/* Results */}
            <div className="md:col-span-2 space-y-6">
              {/* Yield Prediction Results */}
              {yieldPrediction && (
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6" />
                    {t.results.yieldResults}
                  </h2>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white">
                      <p className="text-xs opacity-80">{t.results.predictedYield}</p>
                      <p className="text-2xl font-bold">{formatNumber(yieldPrediction.yield_kg_ha)}</p>
                      <p className="text-sm">kg/ha</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-4 text-white">
                      <p className="text-xs opacity-80">{t.results.totalProduction}</p>
                      <p className="text-2xl font-bold">{formatNumber(yieldPrediction.total_production_kg)}</p>
                      <p className="text-sm">kg</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl p-4 text-white">
                      <p className="text-xs opacity-80">{t.results.confidence}</p>
                      <p className="text-2xl font-bold">{formatNumber(yieldPrediction.confidence * 100)}%</p>
                      <p className="text-sm">{t.results.accuracy}</p>
                    </div>

                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-4 text-white">
                      <p className="text-xs opacity-80">{t.results.stabilityIndex}</p>
                      <p className="text-2xl font-bold">{formatNumber(yieldPrediction.stability_index * 100)}%</p>
                      <p className="text-sm">{t.results.consistent}</p>
                    </div>
                  </div>

                  {/* Yield Range */}
                  {yieldPrediction.yield_range && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">{t.results.yieldRange}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-semibold text-orange-600">
                          {formatNumber(yieldPrediction.yield_range.min)} kg/ha
                        </span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full relative">
                          <div 
                            className="absolute h-full bg-gradient-to-r from-orange-400 via-green-500 to-blue-400 rounded-full"
                            style={{ width: '100%' }}
                          />
                        </div>
                        <span className="text-lg font-semibold text-blue-600">
                          {formatNumber(yieldPrediction.yield_range.max)} kg/ha
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Profit Prediction */}
              {profitPrediction && (
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                    <DollarSign className="w-6 h-6" />
                    {t.results.profitForecast}
                  </h2>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className={`rounded-xl p-4 ${
                      profitPrediction.estimated_profit > 0 
                        ? 'bg-green-100' 
                        : 'bg-red-100'
                    }`}>
                      <p className="text-xs text-gray-600">{t.results.estimatedProfit}</p>
                      <p className={`text-2xl font-bold ${
                        profitPrediction.estimated_profit > 0 
                          ? 'text-green-700' 
                          : 'text-red-700'
                      }`}>
                        Rs. {formatNumber(profitPrediction.estimated_profit)}
                      </p>
                    </div>

                    <div className="bg-blue-100 rounded-xl p-4">
                      <p className="text-xs text-gray-600">{t.results.expectedRevenue}</p>
                      <p className="text-2xl font-bold text-blue-700">
                        Rs. {formatNumber(profitPrediction.revenue)}
                      </p>
                    </div>

                    <div className="bg-orange-100 rounded-xl p-4">
                      <p className="text-xs text-gray-600">{t.results.totalCost}</p>
                      <p className="text-2xl font-bold text-orange-700">
                        Rs. {formatNumber(profitPrediction.total_cost)}
                      </p>
                    </div>
                  </div>

                  {/* Profit Breakdown */}
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t.results.roi}</span>
                      <span className={`font-semibold ${
                        profitPrediction.roi > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatNumber(profitPrediction.roi)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t.results.profitPerHa}</span>
                      <span className="font-semibold">
                        Rs. {formatNumber(profitPrediction.profit_per_ha)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{t.results.breakEvenYield}</span>
                      <span className="font-semibold">
                        {formatNumber(profitPrediction.break_even_yield)} kg/ha
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Early Warning */}
              {warning && (
                <div className={`rounded-2xl shadow-xl p-6 border-l-4 ${
                  getRiskStyle(warning.risk_level).border
                } ${getRiskStyle(warning.risk_level).bg}`}>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <AlertTriangle className={`w-6 h-6 ${getRiskStyle(warning.risk_level).text}`} />
                    {t.warning.title}
                  </h2>

                  <div className="flex items-center gap-4 mb-4">
                    <span className={`px-4 py-2 rounded-full font-bold ${
                      getRiskStyle(warning.risk_level).bg
                    } ${getRiskStyle(warning.risk_level).text}`}>
                      {t.warning.riskLevel}: {warning.risk_level?.toUpperCase()}
                    </span>
                    <span className="text-gray-600">
                      {t.warning.riskScore}: {formatNumber(warning.risk_score * 100)}%
                    </span>
                  </div>

                  {/* Warnings List */}
                  {warning.warnings && warning.warnings.length > 0 && (
                    <div className="space-y-2">
                      <p className="font-semibold text-gray-700">{t.warning.warnings}:</p>
                      {warning.warnings.map((w, i) => (
                        <div key={i} className="p-3 bg-white bg-opacity-50 rounded-lg">
                          <p className="text-gray-800">
                            {lang === 'si' && w.message_si ? w.message_si : w.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Recommendations */}
                  {warning.recommendations && warning.recommendations.length > 0 && (
                    <div className="mt-4">
                      <p className="font-semibold text-gray-700 mb-2">{t.warning.recommendations}:</p>
                      <ul className="space-y-2">
                        {warning.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-700">
                            <Info className="w-4 h-4 mt-1 flex-shrink-0" />
                            <span>
                              {typeof rec === 'object' 
                                ? (lang === 'si' && rec.si ? rec.si : rec.en) 
                                : rec}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rankings Tab */}
        {activeTab === 'rankings' && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-green-800 mb-6 flex items-center gap-2">
              <Award className="w-6 h-6" />
              {t.rankings.title}
            </h2>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-green-600" />
              </div>
            ) : rankings.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>{lang === 'si' ? 'ශ්‍රේණිගත කිරීම් දත්ත නොමැත' : 'No rankings data available'}</p>
              </div>
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-green-50">
                    <th className="p-3 text-left">{t.rankings.rank}</th>
                    <th className="p-3 text-left">{t.rankings.district}</th>
                    <th className="p-3 text-right">{t.rankings.avgYield}</th>
                    <th className="p-3 text-right">{t.rankings.stability}</th>
                    <th className="p-3 text-right">{t.rankings.trend}</th>
                    <th className="p-3 text-right">{t.rankings.score}</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((r, i) => (
                    <tr 
                      key={r.district}
                      className={`border-b hover:bg-gray-50 ${i < 3 ? 'bg-yellow-50' : ''}`}
                    >
                      <td className="p-3">
                        {i < 3 ? (
                          <span className="text-2xl">
                            {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                          </span>
                        ) : (
                          <span className="text-gray-500">{i + 1}</span>
                        )}
                      </td>
                      <td className="p-3 font-medium">{r.district}</td>
                      <td className="p-3 text-right">{formatNumber(r.avg_yield)}</td>
                      <td className="p-3 text-right">
                        <span className={`px-2 py-1 rounded text-sm ${
                          r.stability > 0.8 ? 'bg-green-100 text-green-700' :
                          r.stability > 0.6 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {formatNumber(r.stability * 100)}%
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <span className={`flex items-center justify-end gap-1 ${
                          r.trend > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {r.trend > 0 ? '📈' : '📉'}
                          {r.trend > 0 ? '+' : ''}{formatNumber(r.trend * 100, 1)}%
                        </span>
                      </td>
                      <td className="p-3 text-right font-bold text-green-700">
                        {formatNumber(r.overall_score)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-green-800 mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              {t.trends.title}
            </h2>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-green-600" />
              </div>
            ) : trends.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>{lang === 'si' ? 'ප්‍රවණතා දත්ත නොමැත' : 'No trends data available'}</p>
              </div>
            ) : (
            <>
            {/* Simple bar chart visualization */}
            <div className="space-y-4">
              {trends.map((trend, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-24 text-sm font-medium">
                    {trend.year} {trend.season === 'Maha' ? '🌧️' : '☀️'}
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        trend.season === 'Maha' ? 'bg-blue-500' : 'bg-orange-500'
                      }`}
                      style={{ 
                        width: `${Math.min(100, (trend.avg_yield_kg_ha / 5000) * 100)}%` 
                      }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                      {formatNumber(trend.avg_yield_kg_ha)} kg/ha
                    </span>
                  </div>
                  <div className="w-32 text-right text-sm text-gray-600">
                    {formatNumber(trend.total_production_mt)} MT
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Stats */}
            {trends.length > 0 && (
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-600">{t.trends.avgYield}</p>
                  <p className="text-2xl font-bold text-green-700">
                    {formatNumber(trends.reduce((a, b) => a + b.avg_yield_kg_ha, 0) / trends.length)}
                  </p>
                  <p className="text-sm text-gray-500">kg/ha</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-600">{t.trends.totalProduction}</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {formatNumber(trends.reduce((a, b) => a + b.total_production_mt, 0))}
                  </p>
                  <p className="text-sm text-gray-500">{t.trends.allYears}</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-600">{t.trends.dataPoints}</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {trends.length}
                  </p>
                  <p className="text-sm text-gray-500">{t.trends.seasons}</p>
                </div>
              </div>
            )}
            </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default YieldPrediction;
