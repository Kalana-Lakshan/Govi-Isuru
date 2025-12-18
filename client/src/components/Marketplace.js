import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, MapPin, Phone, User, PlusCircle, Sprout, MessageCircle } from 'lucide-react';

const Marketplace = ({ lang }) => {
  const [listings, setListings] = useState([]);
  const [form, setForm] = useState({
    farmerName: '', cropType: '', quantity: '', price: '', location: '', phone: ''
  });

  const t = {
    en: { 
        header: "AgroLink Marketplace", 
        sub: "Connect directly with buyers", 
        formTitle: "Sell New Harvest", 
        btn: "Post Listing",
        contactWa: "WhatsApp",
        contactCall: "Call Now"
    },
    si: { 
        header: "අලෙවිසැල", 
        sub: "ගැනුම්කරුවන් සමඟ සෘජුව සම්බන්ධ වන්න", 
        formTitle: "අලුත් අස්වැන්න විකුණන්න", 
        btn: "දැන්වීම පළ කරන්න",
        contactWa: "WhatsApp",
        contactCall: "ඇමතුමක් ගන්න"
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/listings');
      setListings(res.data);
    } catch (err) {
      console.error("Failed to fetch market data", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/listings', form);
      fetchListings();
      setForm({ farmerName: '', cropType: '', quantity: '', price: '', location: '', phone: '' });
      alert(lang === 'en' ? "Success! Your crop is listed." : "සාර්ථකයි! දැන්වීම ඇතුළත් කරන ලදී.");
    } catch (err) {
      alert("Error listing crop.");
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="max-w-4xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="bg-green-100 p-6 rounded-2xl mb-8 flex items-center justify-between shadow-sm border border-green-200">
        <div>
          <h2 className="text-2xl font-bold text-green-900">{t[lang].header}</h2>
          <p className="text-green-700">{t[lang].sub}</p>
        </div>
        <ShoppingBag className="h-10 w-10 text-green-600" />
      </div>

      {/* Sell Form */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-10">
        <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
          <PlusCircle className="h-5 w-5 text-green-600" /> {t[lang].formTitle}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="farmerName" value={form.farmerName} onChange={handleChange} placeholder="Farmer Name" className="p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
          <input name="cropType" value={form.cropType} onChange={handleChange} placeholder="Crop (e.g. Rice)" className="p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
          <input name="quantity" value={form.quantity} onChange={handleChange} placeholder="Qty (e.g. 500kg)" className="p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
          <input name="price" value={form.price} onChange={handleChange} placeholder="Price (LKR)" className="p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
          <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone (e.g. 0771234567)" className="p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
          <button type="submit" className="md:col-span-2 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-md">
            {t[lang].btn}
          </button>
        </form>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {listings.map((item) => (
          <div key={item._id} className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-all border-l-4 border-green-500 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Sprout className="h-5 w-5 text-green-500" /> {item.cropType}
                </h4>
                <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">{item.quantity}</span>
              </div>
              <p className="text-2xl font-bold text-green-700 mb-4">Rs. {item.price}</p>
              
              <div className="space-y-1 text-sm text-gray-600 mb-6">
                <p className="flex items-center gap-2"><User size={14} /> {item.farmerName}</p>
                <p className="flex items-center gap-2"><MapPin size={14} /> {item.location}</p>
                <p className="flex items-center gap-2 font-bold text-gray-800"><Phone size={14} /> {item.phone}</p>
              </div>
            </div>

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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;