import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Loader } from 'lucide-react';

const PriceAnalytics = ({ lang }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        // Fetching from your actual backend API
        const res = await axios.get('http://localhost:5000/api/price-trends');
        setData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching trends", err);
        setLoading(false);
      }
    };
    fetchTrends();
  }, []);

  if (loading) return (
    <div className="h-64 flex items-center justify-center bg-white rounded-3xl shadow-xl">
      <Loader className="animate-spin text-green-600" />
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
        <TrendingUp className="text-green-600" /> 
        {lang === 'si' ? 'වෙළඳපල මිල විශ්ලේෂණය' : 'Market Price Analytics'}
      </h3>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Rice" stroke="#16a34a" strokeWidth={3} />
            <Line type="monotone" dataKey="Chili" stroke="#dc2626" strokeWidth={3} />
            <Line type="monotone" dataKey="Tea" stroke="#ca8a04" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceAnalytics;