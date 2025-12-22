import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  MapPin, 
  Filter, 
  RefreshCw, 
  AlertTriangle,
  Calendar,
  Layers,
  Info,
  Target,
  Activity
} from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Disease colors for the map
const diseaseColors = {
  'Bacterial Leaf Blight': '#ef4444',
  'Brown Spot': '#f97316',
  'Brown spot': '#f97316',
  'Leaf Blast': '#dc2626',
  'Leaf scald': '#eab308',
  'Narrow Brown Leaf Spot': '#84cc16',
  'Rice Hispa': '#06b6d4',
  'Sheath Blight': '#8b5cf6',
  'Healthy Rice Leaf': '#22c55e',
  'default': '#6b7280'
};

// Severity colors
const severityColors = {
  critical: '#dc2626',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
  none: '#9ca3af'
};

// Sri Lanka district coordinates for plotting
const districtCoordinates = {
  "Colombo": { lat: 6.9271, lng: 79.8612 },
  "Gampaha": { lat: 7.0840, lng: 80.0098 },
  "Kalutara": { lat: 6.5854, lng: 79.9607 },
  "Kandy": { lat: 7.2906, lng: 80.6337 },
  "Matale": { lat: 7.4675, lng: 80.6234 },
  "Nuwara Eliya": { lat: 6.9497, lng: 80.7891 },
  "Galle": { lat: 6.0535, lng: 80.2210 },
  "Matara": { lat: 5.9549, lng: 80.5550 },
  "Hambantota": { lat: 6.1429, lng: 81.1212 },
  "Jaffna": { lat: 9.6615, lng: 80.0255 },
  "Kilinochchi": { lat: 9.3803, lng: 80.3770 },
  "Mannar": { lat: 8.9810, lng: 79.9044 },
  "Vavuniya": { lat: 8.7514, lng: 80.4971 },
  "Mullaitivu": { lat: 9.2671, lng: 80.8142 },
  "Batticaloa": { lat: 7.7310, lng: 81.6747 },
  "Ampara": { lat: 7.2975, lng: 81.6820 },
  "Trincomalee": { lat: 8.5874, lng: 81.2152 },
  "Kurunegala": { lat: 7.4818, lng: 80.3609 },
  "Puttalam": { lat: 8.0362, lng: 79.8283 },
  "Anuradhapura": { lat: 8.3114, lng: 80.4037 },
  "Polonnaruwa": { lat: 7.9403, lng: 81.0188 },
  "Badulla": { lat: 6.9934, lng: 81.0550 },
  "Monaragala": { lat: 6.8728, lng: 81.3507 },
  "Ratnapura": { lat: 6.7056, lng: 80.3847 },
  "Kegalle": { lat: 7.2513, lng: 80.3464 }
};

const DiseaseHeatmap = ({ user, language = 'en' }) => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [geoData, setGeoData] = useState(null);
  const [filters, setFilters] = useState({
    disease: 'all',
    severity: 'all',
    days: 30
  });
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [diseases, setDiseases] = useState([]);

  const t = {
    en: {
      title: 'Disease Spread Map',
      subtitle: 'Real-time visualization of disease outbreaks across Sri Lanka',
      loading: 'Loading map data...',
      noData: 'No disease reports in selected area',
      filters: 'Filters',
      disease: 'Disease',
      severity: 'Severity',
      timeRange: 'Time Range',
      all: 'All',
      days: 'days',
      reports: 'reports',
      trustScore: 'Trust Score',
      affectedAreas: 'Affected Areas',
      refresh: 'Refresh',
      legend: 'Legend',
      high: 'High Risk',
      medium: 'Medium Risk',
      low: 'Low Risk',
      hotspots: 'Hotspots',
      clickToView: 'Click on markers to view details'
    },
    si: {
      title: 'රෝග පැතිරීම් සිතියම',
      subtitle: 'ශ්‍රී ලංකාව පුරා රෝග පැතිරීම් තත්‍ය කාලීන දර්ශනය',
      loading: 'සිතියම් දත්ත පූරණය වෙමින්...',
      noData: 'තෝරාගත් ප්‍රදේශයේ රෝග වාර්තා නොමැත',
      filters: 'පෙරහන්',
      disease: 'රෝගය',
      severity: 'බරපතලකම',
      timeRange: 'කාල පරාසය',
      all: 'සියල්ල',
      days: 'දින',
      reports: 'වාර්තා',
      trustScore: 'විශ්වාස ලකුණු',
      affectedAreas: 'බලපෑමට ලක්වූ ප්‍රදේශ',
      refresh: 'නැවුම් කරන්න',
      legend: 'සංකේත',
      high: 'ඉහළ අවදානම',
      medium: 'මධ්‍යම අවදානම',
      low: 'අඩු අවදානම',
      hotspots: 'උණුසුම් ස්ථාන',
      clickToView: 'විස්තර බැලීමට ලකුණු මත ක්ලික් කරන්න'
    }
  };

  const text = t[language] || t.en;

  // Load GeoJSON data for map
  useEffect(() => {
    fetch('/lk.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load GeoJSON');
        return res.json();
      })
      .then(data => {
        console.log('GeoJSON loaded:', data.features?.length, 'features');
        setGeoData(data);
      })
      .catch(err => console.error('Error loading GeoJSON:', err));
  }, []);

  // Convert GeoJSON coordinates to SVG path
  const geoToSvgPath = (coordinates, bounds, svgWidth, svgHeight) => {
    // Use actual GeoJSON bounds for accurate positioning
    const [minLng, minLat, maxLng, maxLat] = bounds;
    const padding = 30;
    
    const projectPoint = (lng, lat) => {
      const x = padding + ((lng - minLng) / (maxLng - minLng)) * (svgWidth - 2 * padding);
      const y = padding + ((maxLat - lat) / (maxLat - minLat)) * (svgHeight - 2 * padding);
      return [x, y];
    };
    
    const processRing = (ring) => {
      if (!Array.isArray(ring) || ring.length === 0) return '';
      return ring.map((coord, i) => {
        if (!Array.isArray(coord) || coord.length < 2) return '';
        const [x, y] = projectPoint(coord[0], coord[1]);
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      }).filter(Boolean).join(' ') + ' Z';
    };
    
    try {
      if (Array.isArray(coordinates[0][0][0])) {
        // MultiPolygon
        return coordinates.map(polygon => 
          polygon.map(ring => processRing(ring)).join(' ')
        ).join(' ');
      } else {
        // Polygon
        return coordinates.map(ring => processRing(ring)).join(' ');
      }
    } catch (e) {
      console.error('Error processing coordinates:', e);
      return '';
    }
  };

  // Calculate bounds from GeoJSON
  const getGeoBounds = useMemo(() => {
    if (!geoData) return [79.5, 5.9, 82.0, 9.9];
    
    let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
    
    geoData.features.forEach(feature => {
      const coords = feature.geometry.coordinates;
      const processCoords = (coordArray) => {
        if (typeof coordArray[0] === 'number') {
          minLng = Math.min(minLng, coordArray[0]);
          maxLng = Math.max(maxLng, coordArray[0]);
          minLat = Math.min(minLat, coordArray[1]);
          maxLat = Math.max(maxLat, coordArray[1]);
        } else {
          coordArray.forEach(processCoords);
        }
      };
      processCoords(coords);
    });
    
    return [minLng, minLat, maxLng, maxLat];
  }, [geoData]);

  // Fetch heatmap data - try without district filter first to get all data
  const fetchHeatmapData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        days: filters.days
      });
      if (filters.disease !== 'all') params.append('disease', filters.disease);
      if (filters.severity !== 'all') params.append('severity', filters.severity);
      // Don't filter by district to show island-wide data

      const response = await axios.get(`${API_BASE}/api/alerts/heatmap?${params}`);
      let data = response.data.data || [];
      
      // If data has no coordinates, assign district coordinates
      data = data.map(point => {
        if (!point.lat || !point.lng) {
          const districtCoord = districtCoordinates[point.district];
          if (districtCoord) {
            return {
              ...point,
              lat: districtCoord.lat + (Math.random() - 0.5) * 0.1,
              lng: districtCoord.lng + (Math.random() - 0.5) * 0.1
            };
          }
        }
        return point;
      });
      
      setHeatmapData(data);
      
      // Extract unique diseases
      const uniqueDiseases = [...new Set(data.flatMap(d => d.diseases || []))].filter(Boolean);
      setDiseases(uniqueDiseases);
      
    } catch (err) {
      console.error('Error fetching heatmap data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeatmapData();
  }, [filters]);

  // Calculate point size based on count
  const getPointSize = (count) => {
    const minSize = 14;
    const maxSize = 44;
    const scale = Math.min(count / 10, 1);
    return minSize + (maxSize - minSize) * scale;
  };

  // Get color based on severity
  const getPointColor = (severity, diseases) => {
    if (severity) return severityColors[severity] || severityColors.medium;
    if (diseases && diseases.length > 0) {
      return diseaseColors[diseases[0]] || diseaseColors.default;
    }
    return diseaseColors.default;
  };

  // Summary stats
  const stats = useMemo(() => {
    const totalReports = heatmapData.reduce((sum, p) => sum + (p.count || 0), 0);
    const avgTrustScore = heatmapData.length > 0 
      ? Math.round(heatmapData.reduce((sum, p) => sum + (p.trustScore || 0), 0) / heatmapData.length)
      : 0;
    const hotspots = heatmapData.filter(p => (p.count || 0) >= 3).length;
    return { totalReports, avgTrustScore, hotspots, locations: heatmapData.length };
  }, [heatmapData]);

  // Convert lat/lng to map position (matches SVG viewBox 400x500)
  const latLngToPosition = (lat, lng) => {
    // Use the same bounds as GeoJSON rendering for consistent positioning
    const [minLng, minLat, maxLng, maxLat] = getGeoBounds;
    const padding = 30; // Same padding as SVG path rendering
    const svgWidth = 400;
    const svgHeight = 500;
    
    // Calculate position as percentage of container
    const x = (padding + ((lng - minLng) / (maxLng - minLng)) * (svgWidth - 2 * padding)) / svgWidth * 100;
    const y = (padding + ((maxLat - lat) / (maxLat - minLat)) * (svgHeight - 2 * padding)) / svgHeight * 100;
    
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              {text.title}
            </h2>
            <p className="text-blue-100 text-sm mt-1">{text.subtitle}</p>
          </div>
          <button
            onClick={fetchHeatmapData}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            title={text.refresh}
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        {/* Stats Summary */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{stats.totalReports}</div>
            <div className="text-xs text-blue-100">{text.reports}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{stats.locations}</div>
            <div className="text-xs text-blue-100">{text.affectedAreas}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{stats.hotspots}</div>
            <div className="text-xs text-blue-100">{text.hotspots}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{stats.avgTrustScore}%</div>
            <div className="text-xs text-blue-100">{text.trustScore}</div>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="p-4 bg-gray-50 border-b flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-600">{text.filters}:</span>
        </div>
        
        <select
          value={filters.disease}
          onChange={(e) => setFilters(f => ({ ...f, disease: e.target.value }))}
          className="px-3 py-1.5 bg-white border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">{text.all} {text.disease}</option>
          {diseases.map(disease => (
            <option key={disease} value={disease}>{disease}</option>
          ))}
        </select>
        
        <select
          value={filters.severity}
          onChange={(e) => setFilters(f => ({ ...f, severity: e.target.value }))}
          className="px-3 py-1.5 bg-white border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">{text.all} {text.severity}</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <select
            value={filters.days}
            onChange={(e) => setFilters(f => ({ ...f, days: Number.parseInt(e.target.value) }))}
            className="px-3 py-1.5 bg-white border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value={7}>7 {text.days}</option>
            <option value={14}>14 {text.days}</option>
            <option value={30}>30 {text.days}</option>
            <option value={60}>60 {text.days}</option>
            <option value={90}>90 {text.days}</option>
          </select>
        </div>
      </div>
      
      {/* Map Container */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
            <div className="flex items-center gap-2 text-blue-600">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>{text.loading}</span>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          {/* Map with GeoJSON rendered as SVG */}
          <div className="lg:col-span-2 p-4 min-h-[500px] relative">
            <div className="relative w-full h-full min-h-[480px] rounded-xl overflow-hidden shadow-lg border-2 border-gray-200 bg-gradient-to-b from-sky-100 to-blue-200">
              {/* SVG Map of Sri Lanka from GeoJSON */}
              <svg 
                viewBox="0 0 400 500" 
                className="absolute inset-0 w-full h-full"
                style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
              >
                {/* Ocean background */}
                <rect width="400" height="500" fill="url(#oceanGradient)" />
                
                {/* Gradients and filters */}
                <defs>
                  <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#e0f2fe" />
                    <stop offset="100%" stopColor="#bae6fd" />
                  </linearGradient>
                  <linearGradient id="landGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#86efac" />
                    <stop offset="50%" stopColor="#4ade80" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                  <filter id="landShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.15"/>
                  </filter>
                </defs>
                
                {/* Render districts from GeoJSON or fallback */}
                {geoData && geoData.features ? (
                  geoData.features.map((feature, index) => (
                    <path
                      key={feature.properties?.id || index}
                      d={geoToSvgPath(feature.geometry.coordinates, getGeoBounds, 400, 500)}
                      fill="url(#landGradient)"
                      stroke="#15803d"
                      strokeWidth="0.5"
                      filter="url(#landShadow)"
                      className="hover:fill-emerald-300 transition-colors cursor-pointer"
                    >
                      <title>{feature.properties?.name || `District ${index + 1}`}</title>
                    </path>
                  ))
                ) : (
                  /* Fallback: Simple Sri Lanka outline */
                  <path
                    d="M200 30 C220 35 240 50 255 75 C275 105 290 145 300 190 C310 240 315 290 310 340 C305 385 295 425 280 460 C265 490 245 510 220 525 C195 540 170 545 145 535 C120 525 100 505 85 475 C70 445 60 405 55 360 C50 315 52 270 60 225 C70 180 85 140 105 105 C125 70 150 45 175 35 C185 30 193 28 200 30 Z M185 25 C175 20 160 25 150 35 C165 30 180 28 190 30 C195 25 190 22 185 25 Z"
                    fill="url(#landGradient)"
                    stroke="#15803d"
                    strokeWidth="1.5"
                    filter="url(#landShadow)"
                  />
                )}
              </svg>
              
              {/* Disease Markers */}
              {heatmapData.map((point, index) => {
                const pos = latLngToPosition(point.lat, point.lng);
                const size = getPointSize(point.count || 1);
                const color = getPointColor(point.severity, point.diseases);
                const isSelected = selectedPoint === point;
                
                return (
                  <div
                    key={`marker-${index}`}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${isSelected ? 'z-30 scale-125' : 'z-10 hover:scale-110 hover:z-20'}`}
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                    }}
                    onClick={() => setSelectedPoint(isSelected ? null : point)}
                  >
                    {/* Pulse animation for hotspots */}
                    {(point.count || 0) >= 3 && (
                      <div 
                        className="absolute rounded-full animate-ping"
                        style={{
                          width: size + 20,
                          height: size + 20,
                          backgroundColor: color,
                          opacity: 0.3,
                          left: -10,
                          top: -10
                        }}
                      />
                    )}
                    
                    {/* Marker circle */}
                    <div
                      className="rounded-full border-2 border-white shadow-lg flex items-center justify-center font-bold text-white"
                      style={{
                        width: size,
                        height: size,
                        backgroundColor: color,
                        boxShadow: `0 0 ${size/2}px ${color}50`
                      }}
                    >
                      {(point.count || 0) >= 2 && (
                        <span className="text-xs">{point.count}</span>
                      )}
                    </div>
                    
                    {/* District label on hover/select */}
                    {isSelected && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 whitespace-nowrap">
                        <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg">
                          {point.district || 'Unknown'}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              
              {/* No data message */}
              {heatmapData.length === 0 && !loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="bg-white rounded-xl p-6 shadow-xl text-center">
                    <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">{text.noData}</p>
                    <p className="text-gray-400 text-sm mt-1">Try adjusting filters or time range</p>
                  </div>
                </div>
              )}
              
              {/* Map Instructions */}
              {heatmapData.length > 0 && (
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-gray-600 shadow">
                  <Activity className="w-3 h-3 inline mr-1" />
                  {text.clickToView}
                </div>
              )}
            </div>
          </div>
          
          {/* Legend & Selected Point Info */}
          <div className="p-4 bg-gray-50 border-l">
            {/* Severity Legend */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                {text.legend}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-600 shadow"></div>
                  <span className="text-sm text-gray-600">Critical / {text.high}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-orange-500 shadow"></div>
                  <span className="text-sm text-gray-600">High Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-yellow-500 shadow"></div>
                  <span className="text-sm text-gray-600">{text.medium}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 shadow"></div>
                  <span className="text-sm text-gray-600">{text.low}</span>
                </div>
              </div>
            </div>
            
            {/* Selected Point Details */}
            {selectedPoint ? (
              <div className="bg-white rounded-xl p-4 shadow-md border animate-fadeIn">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  {selectedPoint.district || 'Unknown District'}
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">{text.reports}:</span>
                    <span className="font-bold text-lg">{selectedPoint.count || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">{text.severity}:</span>
                    <span className={`font-bold capitalize px-2 py-0.5 rounded-full text-xs ${
                      selectedPoint.severity === 'critical' ? 'bg-red-100 text-red-700' :
                      selectedPoint.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                      selectedPoint.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {selectedPoint.severity || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">{text.trustScore}:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            (selectedPoint.trustScore || 0) >= 70 ? 'bg-green-500' :
                            (selectedPoint.trustScore || 0) >= 40 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${selectedPoint.trustScore || 0}%` }}
                        />
                      </div>
                      <span className="font-bold">{selectedPoint.trustScore || 0}%</span>
                    </div>
                  </div>
                  
                  {selectedPoint.diseases && selectedPoint.diseases.length > 0 && (
                    <div>
                      <span className="text-gray-500 block mb-1">{text.disease}:</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedPoint.diseases.map((d, i) => (
                          <span 
                            key={`disease-${i}`} 
                            className="px-2 py-1 rounded-full text-xs font-medium"
                            style={{ 
                              backgroundColor: `${diseaseColors[d] || diseaseColors.default}20`,
                              color: diseaseColors[d] || diseaseColors.default
                            }}
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedPoint.gnDivisions && selectedPoint.gnDivisions.length > 0 && (
                    <div>
                      <span className="text-gray-500 block mb-1">{text.affectedAreas}:</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedPoint.gnDivisions.slice(0, 4).map((gn, i) => (
                          <span key={`gn-${i}`} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                            {gn}
                          </span>
                        ))}
                        {selectedPoint.gnDivisions.length > 4 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                            +{selectedPoint.gnDivisions.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 rounded-xl p-4 text-center text-gray-500">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{text.clickToView}</p>
              </div>
            )}
            
            {/* Disease Color Legend */}
            <div className="mt-6">
              <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Disease Colors
              </h3>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {Object.entries(diseaseColors)
                  .filter(([k]) => k !== 'default' && k !== 'Brown spot')
                  .map(([disease, color]) => (
                  <div key={disease} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }}></div>
                    <span className="text-xs text-gray-600 truncate">{disease}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseHeatmap;
