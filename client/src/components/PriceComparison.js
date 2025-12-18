import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MapPin, ArrowRightLeft } from 'lucide-react';

const PriceComparison = ({ lang }) => {
    const [data, setData] = useState([]);
    const [selectedCrop, setSelectedCrop] = useState('Rice');

    useEffect(() => {
        axios.get('http://localhost:5000/api/market-prices')
            .then(res => setData(res.data))
            .catch(err => console.log(err));
    }, []);

    const t = {
        en: { title: "District Price Comparison", sub: "Compare prices across main markets", select: "Select Crop" },
        si: { title: "දිස්ත්‍රික් මිල සංසන්දනය", sub: "ප්‍රධාන වෙළඳපලවල් අතර මිල සංසන්දනය", select: "බෝගය තෝරන්න" }
    };

    return (
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <ArrowRightLeft className="text-blue-600" size={20} /> {t[lang].title}
                    </h3>
                    <p className="text-sm text-gray-500">{t[lang].sub}</p>
                </div>
                
                <select 
                    className="p-2 bg-slate-50 border rounded-xl font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setSelectedCrop(e.target.value)}
                >
                    <option value="Rice">Rice (සහල්)</option>
                    <option value="Chili">Chili (මිරිස්)</option>
                    <option value="Carrot">Carrot (කැරට්)</option>
                </select>
            </div>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis dataKey="district" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                        <YAxis hide />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '10px'}} />
                        <Bar dataKey={selectedCrop} radius={[10, 10, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={index} fill={entry.district === 'Colombo (Manning)' ? '#2563eb' : '#94a3b8'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            
            

            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-gray-400 uppercase">
                <MapPin size={14} /> Highest Price today: 
                <span className="text-blue-600">Colombo (Manning Market)</span>
            </div>
        </div>
    );
};

export default PriceComparison;