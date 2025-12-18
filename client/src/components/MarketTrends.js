import React from 'react';
import PriceAnalytics from './PriceAnalytics';
import PriceComparison from './PriceComparison';
import { BarChart3 } from 'lucide-react';

const MarketTrends = ({ lang }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 p-8 rounded-3xl text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-2xl">
            <BarChart3 size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              {lang === 'si' ? 'වෙළඳපල බුද්ධි තොරතුරු' : 'Market Intelligence'}
            </h2>
            <p className="text-green-100 opacity-90 text-sm">
              {lang === 'si' ? 'දත්ත මත පදනම්ව නිවැරදි තීරණ ගන්න' : 'Make data-driven decisions for your harvest'}
            </p>
          </div>
        </div>
      </div>

      {/* Vertical Stack of Graphs */}
      <div className="space-y-6">
        <PriceAnalytics lang={lang} />
        <PriceComparison lang={lang} />
      </div>

      {/* Pro-tip for Judges */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl">
        <p className="text-amber-800 text-sm italic">
          <strong>Tip:</strong> {lang === 'si' ? 'කොළඹ වෙළඳපලේ මිල ඉහළ මට්ටමක පවතින බැවින් ප්‍රවාහන වියදම් සලකා බැලීම නිර්දේශ කෙරේ.' : 'Prices in Colombo are peaking; consider transport logistics for maximum profit.'}
        </p>
      </div>
    </div>
  );
};

export default MarketTrends;