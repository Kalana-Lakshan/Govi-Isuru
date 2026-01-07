import React from 'react';
import { ShoppingBag, Newspaper, Star, Compass, Bookmark, Bell } from 'lucide-react';

const BuyerDashboard = ({ user, language = 'en', onNavigate }) => {
  const t = {
    en: {
      title: 'Buyer Dashboard',
      subtitle: 'Find fresh produce, track sellers, and stay updated',
      marketplace: 'Browse Marketplace',
      news: 'Agri News',
      saved: 'Saved Listings',
      recommendations: 'Recommended for you',
      quickActions: 'Quick Actions',
      explore: 'Discover nearby produce',
      follow: 'Follow trusted sellers',
      alerts: 'Price drop alerts (beta)',
      emptySaved: 'You have no saved listings yet.',
      viewSaved: 'View saved items',
      go: 'Go',
      comingSoon: 'Coming soon'
    },
    si: {
      title: 'ගැණුම්කරු උපකරණ පුවරුව',
      subtitle: 'නව තැපල්, විශ්වාසනීය අලෙවිකරුන් සහ ප්‍රවෘත්ති',
      marketplace: 'වෙළඳසැල බලන්න',
      news: 'ගොවි ප්‍රවෘත්ති',
      saved: 'සුරක්ෂිත ලැයිස්තු',
      recommendations: 'ඔබ සඳහා නිර්දේශ',
      quickActions: 'ක්ෂණික ක්‍රියා',
      explore: 'ආසන්න බෝග සොයන්න',
      follow: 'විශ්වාසනීය අලෙවිකරුන් අනුවර්තනය',
      alerts: 'මිල අඩු කිරීම් දැනුම්දීම් (beta)',
      emptySaved: 'සුරක්ෂිත ලැයිස්තු නොමැත.',
      viewSaved: 'සුරක්ෂිත ද්‍රව්‍ය',
      go: 'යන්න',
      comingSoon: 'අපි මෙයට වැඩ කරමින් සිටිමු'
    }
  };

  const text = t[language] || t.en;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-white/80">{user?.username}</p>
            <h1 className="text-3xl font-black">{text.title}</h1>
            <p className="text-white/80 mt-1">{text.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate && onNavigate('marketplace')}
              className="bg-white/15 hover:bg-white/25 text-white px-4 py-2 rounded-xl flex items-center gap-2 backdrop-blur transition"
            >
              <ShoppingBag size={18} /> {text.marketplace}
            </button>
            <button
              onClick={() => onNavigate && onNavigate('news')}
              className="bg-white/15 hover:bg-white/25 text-white px-4 py-2 rounded-xl flex items-center gap-2 backdrop-blur transition"
            >
              <Newspaper size={18} /> {text.news}
            </button>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigate && onNavigate('marketplace')}
          className="p-4 rounded-xl border border-amber-200 bg-amber-50 hover:border-amber-300 hover:shadow-md transition text-left"
        >
          <div className="flex items-center gap-2 mb-2">
            <Compass className="text-amber-600" size={18} />
            <span className="font-semibold text-amber-700">{text.explore}</span>
          </div>
          <p className="text-xs text-amber-700">{language === 'si' ? 'තේරුණු නිෂ්පාදන' : 'Curated listings'}</p>
        </button>

        <button
          onClick={() => onNavigate && onNavigate('marketplace')}
          className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 hover:border-emerald-300 hover:shadow-md transition text-left"
        >
          <div className="flex items-center gap-2 mb-2">
            <Star className="text-emerald-700" size={18} />
            <span className="font-semibold text-emerald-700">{text.follow}</span>
          </div>
          <p className="text-xs text-emerald-700">{language === 'si' ? 'ප්‍රතිචාර බලන්න' : 'Check seller ratings'}</p>
        </button>

        <div className="p-4 rounded-xl border border-blue-200 bg-blue-50 text-left">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="text-blue-700" size={18} />
            <span className="font-semibold text-blue-700">{text.alerts}</span>
          </div>
          <p className="text-xs text-blue-700">{text.comingSoon}</p>
        </div>
      </div>

      {/* Saved listings placeholder */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Bookmark className="text-slate-700" size={18} />
            <h3 className="text-lg font-bold text-slate-800">{text.saved}</h3>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('marketplace')}
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            {text.viewSaved}
          </button>
        </div>
        <p className="text-sm text-slate-500">{text.emptySaved}</p>
      </div>

      {/* News strip */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-3">
          <Newspaper className="text-indigo-600" size={18} />
          <h3 className="text-lg font-bold text-slate-800">{text.news}</h3>
        </div>
        <p className="text-sm text-slate-600 mb-4">{language === 'si' ? 'නවතම කෘෂිකර්ම ප්‍රවෘත්ති බලන්න' : 'Stay updated with the latest agri news.'}</p>
        <button
          onClick={() => onNavigate && onNavigate('news')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          {text.go}
        </button>
      </div>
    </div>
  );
};

export default BuyerDashboard;
