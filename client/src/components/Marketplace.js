import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShoppingBag, MapPin, Phone, User, PlusCircle, Sprout, MessageCircle,
  Star, CheckCircle, Award, ThumbsUp, X, MessageSquare, Trash2
} from 'lucide-react';
import ReputationBadge, { MiniReputationBadge } from './ReputationBadge';
import FeedbackForm from './FeedbackForm';
import FeedbackList from './FeedbackList';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Marketplace = ({ lang, currentUser }) => {
  const [listings, setListings] = useState([]);
  const [form, setForm] = useState({
    cropType: '', quantity: '', price: '', location: '', phone: ''
  });
  const [feedbackListing, setFeedbackListing] = useState(null);
  const [viewFeedbackListing, setViewFeedbackListing] = useState(null);
  const [topFarmers, setTopFarmers] = useState([]);

  const t = {
    en: { 
        header: "AgroLink Marketplace", 
        sub: "Connect directly with buyers", 
        formTitle: "Sell New Harvest", 
        btn: "Post Listing",
        contactWa: "WhatsApp",
        contactCall: "Call Now",
        rateSeller: "Rate Seller",
        viewReviews: "View Reviews",
        verified: "Verified",
        topFarmers: "Top Rated Farmers",
        soldOut: "Mark as Sold",
        active: "Active",
        delete: "Delete",
        deleteConfirm: "Are you sure you want to delete this listing?",
        postingAs: "Posting as",
        buyerViewOnly: "Buyers can browse listings. Posting is for farmers only.",
        loginToPost: "Please log in as a farmer to post listings."
    },
    si: { 
        header: "අලෙවිසැල", 
        sub: "ගැනුම්කරුවන් සමඟ සෘජුව සම්බන්ධ වන්න", 
        formTitle: "අලුත් අස්වැන්න විකුණන්න", 
        btn: "දැන්වීම පළ කරන්න",
        contactWa: "WhatsApp",
        contactCall: "ඇමතුමක් ගන්න",
        rateSeller: "ශ්‍රේණිගත කරන්න",
        viewReviews: "සමාලෝචන බලන්න",
        verified: "සත්‍යාපිත",
        topFarmers: "ඉහළ ශ්‍රේණිගත ගොවීන්",
        soldOut: "විකුණන ලද ලෙස සලකුණු කරන්න",
        active: "ක්‍රියාකාරී",
        delete: "මකන්න",
          deleteConfirm: "මෙම දැන්වීම මැකීමට ඔබට විශ්වාසද?",
          postingAs: "ලෙස පළ කිරීම",
          buyerViewOnly: "ගැණුම්කරුවන්ට දැන්වීම් බැලීමට පමණක් හැකිය. දැන්වීම් පළ කරන්නේ ගොවියන් විසින් පමණි.",
          loginToPost: "දැන්වීම් පළ කිරීමට ගොවියෙකු ලෙස පුරනය වන්න."
    }
  };

        const isBuyer = currentUser?.role === 'buyer';

  useEffect(() => {
    fetchListings();
    fetchTopFarmers();
  }, []);

  const fetchListings = async () => {
    try {
      const res = await axios.get(`${API_BASE}/listings`);
      setListings(res.data);
    } catch (err) {
      console.error("Failed to fetch market data", err);
    }
  };

  const fetchTopFarmers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/reputation/top-farmers?limit=5`);
      setTopFarmers(res.data.farmers || []);
    } catch (err) {
      console.error("Failed to fetch top farmers", err);
    }
  };

  const handleMarkSold = async (listingId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert(lang === 'en' ? 'Please log in first' : 'කරුණාකර පළමුව පුරනය වන්න');
        return;
      }
      if (!listingId) {
        alert(lang === 'en' ? 'Invalid listing' : 'වලංගු නොවන දැන්වීම');
        return;
      }
      await axios.put(
        `${API_BASE}/reputation/listing/${listingId}/sold`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchListings();
      alert(lang === 'en' ? 'Listing marked as sold! Your reputation has been updated.' : 'විකුණන ලද ලෙස සලකුණු කරන ලදී! ඔබේ කීර්තිනාමය යාවත්කාලීන කර ඇත.');
    } catch (err) {
      console.error("Failed to mark as sold", err);
      const errorMsg = err.response?.data?.error || (lang === 'en' ? 'Failed to mark as sold' : 'විකුණන ලද ලෙස සලකුණු කිරීමට අසමත් විය');
      alert(errorMsg);
    }
  };

  const handleDelete = async (listingId) => {
    if (!window.confirm(t[lang].deleteConfirm)) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${API_BASE}/listings/${listingId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchListings();
      alert(lang === 'en' ? 'Listing deleted!' : 'දැන්වීම මකන ලදී!');
    } catch (err) {
      console.error("Failed to delete listing", err);
      alert(lang === 'en' ? 'Failed to delete listing' : 'දැන්වීම මැකීමට අසමත් විය');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isBuyer) {
      alert(t[lang].buyerViewOnly);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert(t[lang].loginToPost);
      return;
    }

    try {
      await axios.post(
        `${API_BASE}/listings`,
        {
          ...form,
          farmerName: currentUser?.username || 'Anonymous'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchListings();
      setForm({ cropType: '', quantity: '', price: '', location: '', phone: '' });
      alert(lang === 'en' ? "Success! Your crop is listed." : "සාර්ථකයි! දැන්වීම ඇතුළත් කරන ලදී.");
    } catch (err) {
      alert("Error listing crop.");
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-green-800 flex items-center gap-2">
          <ShoppingBag className="h-7 w-7" />
          🛒 {t[lang].header}
        </h2>
        <p className="text-gray-500 mt-1">{t[lang].sub}</p>
      </div>

      {/* Top Rated Farmers Section */}
      {topFarmers.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 p-5 rounded-2xl mb-6 border border-amber-200 shadow-sm">
          <h3 className="text-sm font-bold text-amber-800 mb-3 flex items-center gap-2">
            <div className="p-1.5 bg-amber-500 rounded-lg">
              <Award size={14} className="text-white" />
            </div>
            {t[lang].topFarmers}
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {topFarmers.map((farmer) => (
              <div 
                key={farmer._id}
                className="flex-shrink-0 bg-white px-4 py-3 rounded-xl shadow-sm border border-amber-100 flex items-center gap-3 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full flex items-center justify-center">
                  <User size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{farmer.username}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MiniReputationBadge score={farmer.reputation_score} />
                    {farmer.is_verified_farmer && (
                      <CheckCircle size={12} className="text-blue-500" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sell Form */}
      {!isBuyer ? (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <PlusCircle className="h-5 w-5 text-green-600" />
            </div>
            {t[lang].formTitle}
          </h3>
          <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 flex items-center gap-2">
            <div className="p-1.5 bg-green-500 rounded-full">
              <User size={14} className="text-white" />
            </div>
            <span className="text-sm text-gray-600">{t[lang].postingAs}:</span>
            <span className="font-bold text-green-700">{currentUser?.username}</span>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="cropType" value={form.cropType} onChange={handleChange} placeholder="Crop (e.g. Rice)" className="p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" required />
            <input name="quantity" value={form.quantity} onChange={handleChange} placeholder="Qty (e.g. 500kg)" className="p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" required />
            <input name="price" value={form.price} onChange={handleChange} placeholder="Price (LKR)" className="p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" required />
            <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" required />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone (e.g. 0771234567)" className="p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" required />
            <button type="submit" className="md:col-span-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3.5 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              {t[lang].btn}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8">
          <div className="flex items-center gap-3 text-amber-700 font-semibold">
            <PlusCircle className="h-5 w-5 text-amber-600" />
            <span>{t[lang].buyerViewOnly}</span>
          </div>
        </div>
      )}

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {listings.map((item) => {
          const isOwnListing =
            currentUser &&
            (item.farmerName === currentUser.username || item.farmer_id?.username === currentUser.username);

          return (
          <div key={item._id} className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-all border-l-4 border-green-500 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Sprout className="h-5 w-5 text-green-500" /> {item.cropType}
                </h4>
                <div className="flex items-center gap-2">
                  {item.verified && (
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle size={12} /> {t[lang].verified}
                    </span>
                  )}
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">{item.quantity}</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-green-700 mb-3">Rs. {item.price}</p>
              
              <div className="space-y-1 text-sm text-gray-600 mb-4">
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-2"><User size={14} /> {item.farmerName}</p>
                  {/* Reputation Badge */}
                  {item.farmer_id && (
                    <ReputationBadge 
                      score={item.farmer_id.reputation_score || 3.0}
                      isVerified={item.farmer_id.is_verified_farmer}
                      size="sm"
                      lang={lang}
                    />
                  )}
                </div>
                <p className="flex items-center gap-2"><MapPin size={14} /> {item.location}</p>
                <p className="flex items-center gap-2 font-bold text-gray-800"><Phone size={14} /> {item.phone}</p>
              </div>

              {/* Farmer Stats */}
              {item.farmer_id && item.farmer_id.total_sales > 0 && (
                <div className="bg-gray-50 rounded-lg p-2 mb-4 flex items-center justify-around text-xs">
                  <div className="text-center">
                    <p className="font-bold text-gray-800">{item.farmer_id.total_sales}</p>
                    <p className="text-gray-500">{lang === 'si' ? 'විකුණුම්' : 'Sales'}</p>
                  </div>
                  <div className="w-px h-8 bg-gray-200"></div>
                  <div className="text-center">
                    <p className="font-bold text-gray-800">{item.farmer_id.reputation_score?.toFixed(1) || '3.0'}</p>
                    <p className="text-gray-500">{lang === 'si' ? 'ශ්‍රේණිගත' : 'Rating'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              {/* Contact Actions */}
              <div className="grid grid-cols-2 gap-2">
                  {/* WhatsApp Button */}
                  <a 
                  href={`https://wa.me/${
                  item.phone.replace(/\s/g, '').startsWith('0') 
                      ? '94' + item.phone.replace(/\s/g, '').substring(1) 
                      : item.phone.replace(/\s/g, '')
                  }?text=${encodeURIComponent(
                  lang === 'si' 
                  ? `ආයුබෝවන් ${item.farmerName}, මම ඔබේ ${item.cropType} අස්වැන්න ගැන විමසීමට කැමතියි (Govi Isuru හරහා).` 
                  : `Hello ${item.farmerName}, I am interested in your ${item.cropType} harvest posted on Govi Isuru.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-2 rounded-xl font-bold text-xs hover:bg-[#128C7E] transition shadow-sm"
                  >
                  <MessageCircle size={16} /> {t[lang].contactWa}
                  </a>

                  {/* Direct Call Button */}
                  <a 
                  href={`tel:${item.phone}`}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-xl font-bold text-xs hover:bg-blue-700 transition shadow-sm"
                  >
                  <Phone size={16} /> {t[lang].contactCall}
                  </a>
              </div>

              {/* Rate Seller & Mark Sold Buttons */}
              <div className="grid grid-cols-2 gap-2">
                {!isOwnListing && (
                  <button
                    onClick={() => setFeedbackListing(item)}
                    className="flex items-center justify-center gap-1 bg-amber-100 text-amber-700 py-2 rounded-xl font-bold text-xs hover:bg-amber-200 transition"
                  >
                    <Star size={14} /> {t[lang].rateSeller}
                  </button>
                )}
                
                <button
                  onClick={() => setViewFeedbackListing(item)}
                  className={`flex items-center justify-center gap-1 py-2 rounded-xl font-bold text-xs transition ${isOwnListing ? 'col-span-2 bg-purple-100 text-purple-700 hover:bg-purple-200' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
                >
                  <MessageSquare size={14} /> {t[lang].viewReviews}
                </button>
              </div>

              {/* Mark as Sold (only for own listings) */}
              {currentUser && item.farmerName === currentUser.username && item.status !== 'sold' && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleMarkSold(item._id)}
                    className="flex items-center justify-center gap-1 bg-green-100 text-green-700 py-2 rounded-xl font-bold text-xs hover:bg-green-200 transition"
                  >
                    <ThumbsUp size={14} /> {t[lang].soldOut}
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex items-center justify-center gap-1 bg-red-100 text-red-700 py-2 rounded-xl font-bold text-xs hover:bg-red-200 transition"
                  >
                    <Trash2 size={14} /> {t[lang].delete}
                  </button>
                </div>
              )}
            </div>
          </div>
        );
        })}
      </div>

      {/* Feedback Form Modal */}
      {feedbackListing && (
        <FeedbackForm
          listing={feedbackListing}
          onClose={() => setFeedbackListing(null)}
          onSubmit={() => {
            setFeedbackListing(null);
            fetchListings();
          }}
          lang={lang}
        />
      )}

      {/* View Feedbacks Modal */}
      {viewFeedbackListing && (
        <FeedbackList
          listing={viewFeedbackListing}
          onClose={() => setViewFeedbackListing(null)}
          lang={lang}
        />
      )}
    </div>
  );
};

export default Marketplace;