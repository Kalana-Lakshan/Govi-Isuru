import React, { useState } from 'react';
import { Search, Leaf, AlertTriangle, Shield, Droplets, Calendar, TrendingUp, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

const TraditionalRice = ({ lang = 'en' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedVariety, setExpandedVariety] = useState(null);

  const translations = {
    en: {
      title: 'Traditional Rice Varieties of Sri Lanka',
      subtitle: 'Comprehensive Guide for Farmers',
      search: 'Search varieties...',
      duration: 'Duration',
      zone: 'Zone',
      diseases: 'Common Diseases',
      prevention: 'Prevention',
      harvesting: 'Harvesting',
      all: 'All Varieties',
      traditional: 'Traditional',
      modern: 'Modern',
      days: 'days',
      viewDetails: 'View Details',
      hideDetails: 'Hide Details',
      special: 'Special Features',
      nutrition: 'Nutrition & Fertilization',
      postHarvest: 'Post-Harvest Care'
    },
    si: {
      title: 'ශ්‍රී ලංකාවේ සම්ප්‍රදායික සහල් වර්ග',
      subtitle: 'ගොවීන් සඳහා සවිස්තරාත්මක මාර්ගෝපදේශයක්',
      search: 'වර්ග සොයන්න...',
      duration: 'කාලය',
      zone: 'කලාපය',
      diseases: 'පොදු රෝග',
      prevention: 'වැළැක්වීම',
      harvesting: 'අස්වැන්න නෙළීම',
      all: 'සියලුම වර්ග',
      traditional: 'සම්ප්‍රදායික',
      modern: 'නවීන',
      days: 'දින',
      viewDetails: 'විස්තර බලන්න',
      hideDetails: 'සඟවන්න',
      special: 'විශේෂ ලක්ෂණ',
      nutrition: 'පෝෂණය සහ පොහොර',
      postHarvest: 'අස්වැන්න නෙළීමෙන් පසු සත්කාර'
    }
  };

  const t = translations[lang];

  const zoneTranslations = {
    'All zones': 'සියලු කලාප',
    'Dry zone': 'වියලි කලාපය',
    'Dry & Intermediate': 'වියලි හා අතරමැදි',
    'Dry & Intermediate zones': 'වියලි හා අතරමැදි කලාප',
    'Wet zone': 'තෙත් කලාපය',
    'Wet & Intermediate': 'තෙත් හා අතරමැදි',
    'All zones (except highlands)': 'උසබිම් හැර සියලු කලාප'
  };

  const getLocalizedZone = (zone) => {
    if (lang !== 'si') return zone;
    return zoneTranslations[zone] || zone;
  };

  const getPrimaryName = (variety) => (lang === 'si' ? variety.nameLocal : variety.name);
  const getSecondaryName = (variety) => (lang === 'si' ? variety.name : variety.nameLocal);

  // Traditional varieties data
  const traditionalVarieties = [
    {
      name: 'Samba Rice',
      nameLocal: 'සම්බා',
      type: 'traditional',
      duration: '120-150',
      zone: 'All zones',
      grain: 'Short, ovular grain',
      description: 'Popular for daily meals and special dishes. Available in white and red-seeded forms. Aromatic with good cooking quality.',
      diseases: ['Rice blast', 'Bacterial leaf blight', 'Sheath blight', 'Brown spot', 'Brown planthopper'],
      prevention: [
        'Use certified, disease-resistant cultivars',
        'Practice crop rotation and field sanitation',
        'Maintain proper plant spacing',
        'Avoid excessive nitrogen',
        'Balanced irrigation management'
      ],
      nutrition: 'Apply balanced N-P-K with organic matter. Split nitrogen: 1/3 basal, 1/3 at tillering (20-30 days), 1/3 at panicle initiation',
      harvesting: 'Harvest at 85-90% grain maturity when grains are firm. Dry to 12-14% moisture for safe storage',
      special: ['Aromatic', 'Good cooking quality', 'Slightly sticky when cooked']
    },
    {
      name: 'Keeri Samba / Supiri Samba',
      nameLocal: 'කීරි සම්බා',
      type: 'traditional',
      duration: '120-140',
      zone: 'All zones',
      grain: 'Small, aromatic grain',
      description: 'Premium small-grain aromatic rice valued for its flavor and distinct texture. Used in special dishes.',
      diseases: ['Blast', 'Sheath blight', 'Bacterial blight', 'Stem borers', 'Leaf folders'],
      prevention: [
        'Grow in well-drained, fertile soils',
        'Avoid excessive nitrogen to preserve aroma',
        'Use IPM strategies',
        'Pheromone traps for borers',
        'Spot treatments rather than broad sprays'
      ],
      nutrition: 'Lower to moderate nitrogen (60-80 kg N/ha) for best aroma. Ensure phosphorus for roots and potassium for grain quality',
      harvesting: 'Harvest at physiological maturity to maximize aroma. Dry carefully at low temperatures to preserve aroma compounds',
      special: ['Highly aromatic', 'Premium quality', 'Special occasions']
    },
    {
      name: 'Suwandel / Suwandal',
      nameLocal: 'සුවඳැල්',
      type: 'traditional',
      duration: '110-130',
      zone: 'All zones',
      grain: 'Fragrant, medium grain',
      description: 'Fragrant traditional rice used in festive and ceremonial dishes. Prized for aroma and taste.',
      diseases: ['Blast', 'Sheath blight', 'Brown spot', 'Bacterial blight', 'Planthoppers'],
      prevention: [
        'Use certified or locally adapted seed',
        'Stagger plantings to avoid peak pest pressure',
        'Maintain field hygiene',
        'Rotational legumes reduce disease carryover'
      ],
      nutrition: 'Balanced nutrition with good soil organic matter. Split N application. Apply K for grain filling. Consider foliar micronutrients',
      harvesting: 'Harvest at physiological maturity. Dry to safe moisture quickly to retain aroma. Careful threshing preserves market value',
      special: ['Highly fragrant', 'Ceremonial use', 'Premium price']
    },
    {
      name: 'Nadu Rice',
      nameLocal: 'නාඩු',
      type: 'traditional',
      duration: '110-130',
      zone: 'All zones',
      grain: 'Medium grain',
      description: 'Widely grown medium-grain rice for daily meals. Available in white and red variants.',
      diseases: ['Rice blast', 'Sheath blight', 'Bacterial leaf blight', 'Tungro virus', 'Stem borers'],
      prevention: [
        'Use recommended varieties and certified seed',
        'Control vector populations (leafhoppers)',
        'Maintain healthy, vigorous plants',
        'Balanced fertilization and water management'
      ],
      nutrition: 'Standard split N program: basal, tillering, panicle initiation. 60-120 kg N/ha based on soil fertility. Phosphorus at planting, potassium for grain filling',
      harvesting: 'Harvest at 85-90% grain maturity. Thresh and dry to 12-14% moisture. Timely harvesting prevents shattering and losses',
      special: ['Versatile', 'Daily consumption', 'Good yield']
    },
    {
      name: 'Kekulu Rice',
      nameLocal: 'කැකුළු',
      type: 'traditional',
      duration: '110-125',
      zone: 'All zones',
      grain: 'Small to medium grain',
      description: 'Traditional variety similar to Nadu. Tender texture when cooked. Non-parboiled consumption.',
      diseases: ['Blast', 'Bacterial leaf blight', 'Sheath blight', 'Brown spot', 'Stem borer'],
      prevention: [
        'Use clean seed',
        'Practice crop/habitat hygiene',
        'Avoid dense planting',
        'Integrated pest management',
        'Pheromone traps for borers'
      ],
      nutrition: 'Responds well to organic amendments. Typical N split: 1/3 basal, 1/3 tillering, 1/3 panicle initiation. Phosphorus for roots, potassium for grain filling',
      harvesting: 'Harvest before significant shattering. Careful drying to 12-14% moisture. Proper storage prevents rancidity of bran',
      special: ['Tender texture', 'Traditional favorite', 'Organic-friendly']
    }
  ];

  // Modern improved varieties
  const modernVarieties = [
    {
      name: 'BG 750',
      nameLocal: 'BG 750',
      type: 'modern',
      duration: '75-80',
      zone: 'Dry & Intermediate',
      grain: 'White, medium grain',
      description: 'Very short duration variety suitable for late Yala planting. Fast maturity with moderate yield.',
      diseases: ['Leaf blast', 'Brown spot', 'Sheath blight (low-moderate)'],
      prevention: [
        'Use certified seeds',
        'Avoid excessive nitrogen (very important)',
        'Maintain proper spacing',
        'Apply potassium fertilizer to reduce brown spot'
      ],
      harvesting: 'Harvest at 70-75 days when 80% panicles turn golden. Harvest early to avoid shattering. Dry immediately',
      special: ['Very fast maturity', 'Late season suitable', 'Short grain']
    },
    {
      name: 'BG 300',
      nameLocal: 'BG 300',
      type: 'modern',
      duration: '90',
      zone: 'Dry & Intermediate',
      grain: 'White, long grain',
      description: 'Drought tolerant variety with good yield stability.',
      diseases: ['Blast', 'Brown spot'],
      prevention: [
        'Balanced fertilizer',
        'Timely irrigation',
        'Proper spacing'
      ],
      harvesting: 'Harvest when grains harden. Avoid delayed harvesting. Dry to 12-14% moisture',
      special: ['Drought tolerant', 'Long grain', 'Market preferred']
    },
    {
      name: 'BG 352',
      nameLocal: 'BG 352',
      type: 'modern',
      duration: '105-110',
      zone: 'Dry zone',
      grain: 'White, medium grain',
      description: 'High yielding variety with good disease resistance.',
      diseases: ['Blast (moderate)', 'BLB (low)', 'Sheath blight'],
      prevention: [
        'Use clean seed',
        'Balanced fertilization',
        'Proper water management',
        'Field sanitation'
      ],
      harvesting: 'Harvest at 80-85% maturity. Mechanical harvesting suitable. Proper drying essential',
      special: ['High yield', 'Disease resistant', 'Good milling quality']
    },
    {
      name: 'BG 360',
      nameLocal: 'BG 360',
      type: 'modern',
      duration: '105-110',
      zone: 'All zones',
      grain: 'White, medium grain',
      description: 'Versatile variety suitable for multiple zones with stable yield.',
      diseases: ['Blast', 'Sheath blight', 'Brown spot'],
      prevention: [
        'Proper spacing',
        'Balanced nutrition',
        'Avoid excess nitrogen',
        'Good water management'
      ],
      harvesting: 'Harvest at full maturity. Quick drying recommended. Store at safe moisture',
      special: ['Versatile', 'Multi-zone', 'Stable yield']
    },
    {
      name: 'H 7',
      nameLocal: 'H 7',
      type: 'modern',
      duration: '110',
      zone: 'Wet & Intermediate',
      grain: 'White, medium grain',
      description: 'Stable yield variety with good grain quality for wet zone cultivation.',
      diseases: ['Blast', 'Sheath blight'],
      prevention: [
        'Proper plant spacing',
        'Avoid excess nitrogen',
        'Field sanitation',
        'Good drainage'
      ],
      harvesting: 'Harvest at 80-85% grain maturity. Dry immediately after harvest to prevent grain discoloration',
      special: ['Wet zone suitable', 'Good quality', 'Stable yield']
    },
    {
      name: 'BG 94-1',
      nameLocal: 'BG 94-1',
      type: 'modern',
      duration: '105',
      zone: 'Dry zone',
      grain: 'White, medium grain',
      description: 'Popular variety with high yield potential and good cooking quality.',
      diseases: ['Blast', 'BLB', 'Sheath blight'],
      prevention: [
        'Use disease-free seed',
        'Proper water management',
        'Balanced fertilizer application',
        'Remove infected residues'
      ],
      harvesting: 'Harvest when 85% grains mature. Thresh carefully to reduce broken grains. Proper storage essential',
      special: ['High yield', 'Popular variety', 'Good cooking quality']
    },
    {
      name: 'AT 362',
      nameLocal: 'AT 362',
      type: 'modern',
      duration: '105-110',
      zone: 'Dry zone',
      grain: 'White, medium grain',
      description: 'Suitable for rain-fed cultivation with good stress tolerance.',
      diseases: ['Blast', 'Brown spot', 'Leaf scald'],
      prevention: [
        'Seed treatment before sowing',
        'Balanced fertilizer especially potassium',
        'Timely weeding',
        'Proper irrigation during critical stages'
      ],
      harvesting: 'Harvest when panicles fully yellow. Avoid over-drying in field. Store in ventilated conditions',
      special: ['Rain-fed suitable', 'Stress tolerant', 'Low input']
    },
    {
      name: 'BG 366',
      nameLocal: 'BG 366',
      type: 'modern',
      duration: '110',
      zone: 'All zones',
      grain: 'White, long grain',
      description: 'Versatile high-yielding variety with excellent grain quality.',
      diseases: ['Blast', 'Sheath blight', 'BLB'],
      prevention: [
        'Use certified seeds',
        'Proper spacing and water management',
        'Split nitrogen application',
        'Regular field monitoring'
      ],
      harvesting: 'Harvest at correct maturity. Mechanical harvesting suitable. Quick drying prevents quality loss',
      special: ['High yield', 'Long grain', 'Excellent quality']
    }
  ];

  const allVarieties = [...traditionalVarieties, ...modernVarieties];

  const filteredVarieties = allVarieties.filter(variety => {
    const normalizedSearch = searchTerm.toLowerCase();
    const localizedZone = getLocalizedZone(variety.zone).toLowerCase();
    const matchesSearch = variety.name.toLowerCase().includes(normalizedSearch) ||
                         variety.nameLocal.includes(searchTerm) ||
                         localizedZone.includes(normalizedSearch);
    const matchesCategory = selectedCategory === 'all' || variety.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDurationColor = (duration) => {
    const days = parseInt(duration.split('-')[0]);
    if (days < 90) return 'bg-green-100 text-green-800';
    if (days < 110) return 'bg-yellow-100 text-yellow-800';
    return 'bg-orange-100 text-orange-800';
  };

  const toggleExpanded = (name) => {
    setExpandedVariety(expandedVariety === name ? null : name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-2xl p-8 mb-8">
          <div className="flex items-center justify-center mb-4">
            <Leaf className="h-12 w-12 text-white mr-4" />
            <h1 className="text-4xl font-bold text-white">{t.title}</h1>
          </div>
          <p className="text-center text-green-50 text-lg">{t.subtitle}</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={t.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {['all', 'traditional', 'modern'].map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 md:px-6 py-2 md:py-3 rounded-lg text-sm md:text-base font-semibold transition-all flex-shrink-0 ${
                    selectedCategory === category
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t[category]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Varieties Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredVarieties.map((variety) => (
            <div
              key={variety.name}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Card Header */}
              <div className={`p-6 ${variety.type === 'traditional' ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-blue-500 to-cyan-500'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-1">{getPrimaryName(variety)}</h3>
                    <p className="text-white/90 text-lg">{getSecondaryName(variety)}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getDurationColor(variety.duration)}`}>
                    {variety.duration} {t.days}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                {/* Description */}
                <p className="text-gray-700 mb-4 leading-relaxed">{variety.description}</p>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500">{t.duration}</p>
                      <p className="font-semibold text-gray-800">{variety.duration} {t.days}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Droplets className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500">{t.zone}</p>
                      <p className="font-semibold text-gray-800">{getLocalizedZone(variety.zone)}</p>
                    </div>
                  </div>
                </div>

                {/* Special Features */}
                {variety.special && (
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                      <h4 className="font-semibold text-gray-800">{t.special}</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {variety.special.map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expandable Details */}
                <button
                  onClick={() => toggleExpanded(variety.name)}
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors font-semibold text-green-700"
                >
                  <BookOpen className="h-5 w-5" />
                  <span>{expandedVariety === variety.name ? t.hideDetails : t.viewDetails}</span>
                  {expandedVariety === variety.name ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>

                {/* Expanded Content */}
                {expandedVariety === variety.name && (
                  <div className="mt-4 space-y-4 animate-in slide-in-from-top duration-300">
                    {/* Diseases */}
                    <div className="border-t pt-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <h4 className="font-semibold text-gray-800">{t.diseases}</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {variety.diseases.map((disease, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-red-50 text-red-700 rounded-lg text-sm"
                          >
                            {disease}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Prevention */}
                    <div className="border-t pt-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <h4 className="font-semibold text-gray-800">{t.prevention}</h4>
                      </div>
                      <ul className="space-y-2">
                        {variety.prevention.map((tip, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-green-600 font-bold">•</span>
                            <span className="text-gray-700 text-sm">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Nutrition */}
                    {variety.nutrition && (
                      <div className="border-t pt-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <Leaf className="h-5 w-5 text-green-600" />
                          <h4 className="font-semibold text-gray-800">{t.nutrition}</h4>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed bg-green-50 p-3 rounded-lg">
                          {variety.nutrition}
                        </p>
                      </div>
                    )}

                    {/* Harvesting */}
                    <div className="border-t pt-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Calendar className="h-5 w-5 text-orange-600" />
                        <h4 className="font-semibold text-gray-800">{t.harvesting}</h4>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed bg-orange-50 p-3 rounded-lg">
                        {variety.harvesting}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredVarieties.length === 0 && (
          <div className="text-center py-12">
            <Leaf className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {lang === 'si' ? 'ප්‍රතිඵල හමු නොවීය' : 'No varieties found'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TraditionalRice;
