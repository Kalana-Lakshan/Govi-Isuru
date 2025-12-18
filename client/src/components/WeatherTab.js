import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CloudRain, MapPin, AlertCircle, Loader2 } from 'lucide-react';

const WeatherTab = ({ lang }) => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 1. Get the registered user data
  const user = JSON.parse(localStorage.getItem('user'));
  const API_KEY = process.env.REACT_APP_WEATHER_KEY;

  useEffect(() => {
    // 2. Priority check: Use GN Division from profile
    if (user && user.gnDivision) {
      const locationName = `${user.gnDivision}, ${user.district}, LK`;
      fetchWeatherByName(locationName);
    } else {
      setError(lang === 'si' ? "ලියාපදිංචි ස්ථානය හමු නොවීය." : "Registered location not found.");
      setLoading(false);
    }
  }, [lang]);

  const fetchWeatherByName = async (query) => {
    try {
      setLoading(true);
      // 3. Geocode the GN name to get specific coordinates
      const geoRes = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=1&appid=${API_KEY}`
      );

      if (geoRes.data.length > 0) {
        const { lat, lon } = geoRes.data[0];
        getFinalWeatherData(lat, lon);
      } else {
        // 4. Fallback: If GN name is too specific, use the District
        const fallbackRes = await axios.get(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(user.district + ', LK')}&limit=1&appid=${API_KEY}`
        );
        const { lat, lon } = fallbackRes.data[0];
        getFinalWeatherData(lat, lon);
      }
    } catch (err) {
      setError(lang === 'si' ? "දත්ත ලබාගැනීම අසාර්ථකයි." : "Failed to fetch weather data.");
      setLoading(false);
    }
  };

  const getFinalWeatherData = async (lat, lon) => {
    try {
      const currentRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      setWeather(currentRes.data);

      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      const dailyData = forecastRes.data.list.filter(reading => reading.dt_txt.includes("12:00:00"));
      setForecast(dailyData);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="p-20 text-center flex flex-col items-center gap-4">
      <Loader2 className="animate-spin text-green-600" size={40} />
      <p className="font-bold text-gray-500">Checking weather for {user?.gnDivision}...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Current Status Card - Forced to Registered Location */}
      <div className="bg-white rounded-[2rem] shadow-xl p-8 border-b-8 border-green-500 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-green-700 font-bold mb-4 bg-green-50 w-fit px-4 py-1 rounded-full text-sm">
            <MapPin size={16} /> {user.gnDivision} (Registered Location)
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-gray-500 font-bold uppercase tracking-widest text-xs">Current Status</h4>
              <h2 className="text-6xl font-black text-gray-800">{Math.round(weather.main.temp)}°C</h2>
              <p className="text-xl text-gray-500 capitalize">{weather.weather[0].description}</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
              <h4 className="font-black text-blue-900 mb-2 flex items-center gap-2">
                <AlertCircle size={18} /> Advisory for {user.district}
              </h4>
              <p className="text-blue-800 text-sm leading-relaxed">
                {weather.main.humidity > 80 
                  ? "High humidity in your division. Watch for fungal diseases in crops." 
                  : "Stable conditions. Good for field work in your area."}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Forecast section remains the same... */}
    </div>
  );
};

export default WeatherTab;