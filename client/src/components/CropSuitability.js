import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function CropSuitability({ lang = 'en', user, coords }) {
  const [inputs, setInputs] = useState({
    district: user?.district || '',
    season: 'Maha',
    soilPH: 6.0,
    soilType: 'Loam',
    drainage: 'Moderate',
    slope: 'Flat',
    irrigation: true,
    rainfall: 1200,
    temperature: 28,
    landSizeHa: 1.0,
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const labels = {
    en: {
      title: 'Crop Suitability Advisor',
      subtitle: 'Find best-fit crops for your land',
      run: 'Recommend Crops',
      district: 'District', season: 'Season', soilPH: 'Soil pH', soilType: 'Soil Type', drainage: 'Drainage', slope: 'Slope', irrigation: 'Irrigation', rainfall: 'Annual Rainfall (mm)', temperature: 'Avg Temperature (°C)', landSizeHa: 'Land Size (ha)'
    },
    si: {
      title: 'බෝග සුදුසුකම් උපදේශක',
      subtitle: 'ඔබේ ඉඩමට ගැළපෙන බෝග සොයන්න',
      run: 'බෝග නිර්දේශ',
      district: 'දිස්ත්‍රික්කය', season: 'කාලය', soilPH: 'මණලේ pH', soilType: 'මණලේ වර්ගය', drainage: 'ජල නිකාසය', slope: 'ඇවිලීම', irrigation: 'නාය පද්ධතිය', rainfall: 'වාර්ෂික වැසි (මි.මී.)', temperature: 'සාමාන්‍ය උෂ්ණත්වය (°C)', landSizeHa: 'ඉඩම් ප්‍රමාණය (හෙක්ටයාර්)'
    }
  };
  const t = labels[lang];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInputs(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : (name === 'soilPH' || name === 'rainfall' || name === 'temperature' || name === 'landSizeHa') ? parseFloat(value) : value }));
  };

  const handleSubmit = async () => {
    setLoading(true); setError('');
    try {
      const res = await axios.post(`${API_BASE}/api/suitability/recommend`, inputs);
      setResults(res.data.recommendations || []);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{t.title} 🌱</h2>
          <p className="text-slate-500 text-sm">{t.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-slate-600">{t.district}</label>
          <input name="district" value={inputs.district} onChange={handleChange} className="mt-1 w-full border rounded-lg p-2" placeholder="e.g., Anuradhapura" />
        </div>
        <div>
          <label className="text-sm text-slate-600">{t.season}</label>
          <select name="season" value={inputs.season} onChange={handleChange} className="mt-1 w-full border rounded-lg p-2">
            <option value="Maha">Maha</option>
            <option value="Yala">Yala</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-slate-600">{t.soilPH}</label>
          <input name="soilPH" type="number" step="0.1" value={inputs.soilPH} onChange={handleChange} className="mt-1 w-full border rounded-lg p-2" />
        </div>
        <div>
          <label className="text-sm text-slate-600">{t.soilType}</label>
          <select name="soilType" value={inputs.soilType} onChange={handleChange} className="mt-1 w-full border rounded-lg p-2">
            <option>Loam</option>
            <option>Clay</option>
            <option>Sandy</option>
            <option>Silt</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-slate-600">{t.drainage}</label>
          <select name="drainage" value={inputs.drainage} onChange={handleChange} className="mt-1 w-full border rounded-lg p-2">
            <option>Good</option>
            <option>Moderate</option>
            <option>Poor</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-slate-600">{t.slope}</label>
          <select name="slope" value={inputs.slope} onChange={handleChange} className="mt-1 w-full border rounded-lg p-2">
            <option>Flat</option>
            <option>Gentle</option>
            <option>Steep</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input name="irrigation" type="checkbox" checked={inputs.irrigation} onChange={handleChange} />
          <label className="text-sm text-slate-600">{t.irrigation}</label>
        </div>
        <div>
          <label className="text-sm text-slate-600">{t.rainfall}</label>
          <input name="rainfall" type="number" value={inputs.rainfall} onChange={handleChange} className="mt-1 w-full border rounded-lg p-2" />
        </div>
        <div>
          <label className="text-sm text-slate-600">{t.temperature}</label>
          <input name="temperature" type="number" step="0.1" value={inputs.temperature} onChange={handleChange} className="mt-1 w-full border rounded-lg p-2" />
        </div>
        <div>
          <label className="text-sm text-slate-600">{t.landSizeHa}</label>
          <input name="landSizeHa" type="number" step="0.01" value={inputs.landSizeHa} onChange={handleChange} className="mt-1 w-full border rounded-lg p-2" />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          {loading ? 'Calculating…' : t.run}
        </button>
      </div>

      {error && <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-100">⚠️ {error}</div>}

      {results.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {results.map((r) => (
            <div key={r.crop} className="p-4 bg-slate-50 rounded-xl border">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800">{r.crop}</h3>
                <span className="text-sm bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Score {Math.round(r.score)}</span>
              </div>
              <p className="text-slate-600 text-sm mt-2">{r.reason}</p>
              {r.notes && <p className="text-slate-500 text-xs mt-2">{r.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
