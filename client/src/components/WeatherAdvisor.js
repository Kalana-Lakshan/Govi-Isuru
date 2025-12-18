import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CloudRain, Wind, AlertCircle, Thermometer, MapPin, Calendar } from 'lucide-react';

const WeatherAdvisor = ({ lat, lon, lang }) => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const API_KEY = process.env.REACT_APP_WEATHER_KEY;

  useEffect(() => {
    const fetchAllWeather = async () => {
      if (!lat || !lon) return;

      try {
        // 1. Fetch Current Weather
        const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
        const currentRes = await axios.get(currentUrl);
        setWeather(currentRes.data);

        // 2. Fetch 5-Day Forecast
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
        const forecastRes = await axios.get(forecastUrl);
        
        // Filter to get midday (12:00) forecast for the next 5 days
        const dailyData = forecastRes.data.list.filter(item => item.dt_txt.includes("12:00:00"));
        setForecast(dailyData);
      } catch (err) {
        console.error("Weather data fetch failed", err);
      }
    };
    fetchAllWeather();
  }, [lat, lon, API_KEY]);

  if (!weather) return <div className="p-10 text-center animate-pulse">Detecting local climate...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* SECTION 1: Current Weather & Agro-Advice */}
      <div className="bg-white rounded-3xl shadow-xl p-6 border-l-8 border-blue-500 overflow-hidden">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm mb-1">
              <MapPin size={16} /> {weather.name}
            </div>
            <h3 className="text-xl font-bold text-gray-800">{lang === 'si' ? 'වත්මන් තත්ත්වය' : 'Current Status'}</h3>
            <p className="text-5xl font-black text-blue-600 mt-2">{Math.round(weather.main.temp)}°C</p>
            <p className="text-gray-500 capitalize font-medium">{weather.weather[0].description}</p>
          </div>
          <div className="text-right space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-end gap-2 text-sm font-bold text-gray-700">
              <Thermometer size={16} className="text-orange-500"/> {weather.main.humidity}%
            </div>
            <div className="flex items-center justify-end gap-2 text-sm font-bold text-gray-700">
              <Wind size={16} className="text-blue-400"/> {weather.wind.speed} m/s
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
          <AlertCircle className="text-blue-600 mt-1" size={20} />
          <p className="text-blue-900 font-bold text-sm leading-relaxed">
            {weather.main.humidity > 80 
              ? (lang === 'si' ? "අධික ආර්ද්‍රතාවය - දිලීර රෝග ගැන විමසිලිමත් වන්න." : "High humidity - watch for fungal diseases.") 
              : (lang === 'si' ? "අද දින වගා කටයුතු සඳහා කාලගුණය යහපත්ය." : "Weather is stable for cultivation today.")}
          </p>
        </div>
      </div>

      {/* SECTION 2: 5-Day Forecast Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {forecast.map((day, index) => (
          <div key={index} className="bg-white p-5 rounded-3xl shadow-md border border-gray-100 text-center hover:shadow-lg transition-all">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
              {new Date(day.dt * 1000).toLocaleDateString(undefined, { weekday: 'short' })}
            </p>
            <img 
              src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} 
              alt="weather icon" 
              className="w-16 h-16 mx-auto"
            />
            <p className="text-2xl font-black text-gray-800">{Math.round(day.main.temp)}°C</p>
            <p className="text-[10px] font-bold text-blue-500 uppercase mt-1">{day.weather[0].main}</p>
            
            {/* Future Logic: Simple Recommendation per day */}
            {day.weather[0].main === 'Rain' && (
              <p className="text-[9px] text-red-500 font-bold mt-2">🌧️ {lang === 'si' ? 'පොහොර එපා' : 'No Fertilizer'}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherAdvisor;