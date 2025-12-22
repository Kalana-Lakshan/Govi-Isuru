// Intent Detection for Govi Isuru Chatbot
// Rule-based system for reliable, explainable intent matching

// Synonym mappings for better understanding
const synonyms = {
  fertilizer: ['fertilizer', 'fertiliser', 'urea', 'npk', 'potash', 'nitrogen', 'phosphate', 'manure', 'compost', 'පොහොර', 'යුරියා', 'poshora', 'pohora', 't750', 't200', 'dolomite'],
  disease: ['disease', 'sick', 'infection', 'fungus', 'bacteria', 'virus', 'blight', 'blast', 'spot', 'smut', 'rust', 'ලෙඩ', 'රෝග', 'ආසාදනය', 'leda', 'roga', 'blister', 'බිබිලි'],
  pest: ['pest', 'insect', 'bug', 'worm', 'borer', 'hopper', 'mite', 'tortrix', 'mosquito bug', 'කෘමි', 'පළිබෝධ', 'krumi'],
  planting: ['planting', 'sowing', 'seed', 'seedling', 'transplant', 'වගා', 'බීජ', 'පැල', 'waga', 'bija', 'spacing'],
  harvest: ['harvest', 'harvesting', 'yield', 'crop', 'reap', 'pluck', 'plucking', 'අස්වනු', 'අස්වැන්න', 'aswanu', 'නෙලීම'],
  water: ['water', 'irrigation', 'watering', 'drought', 'flood', 'rain', 'drainage', 'ජලය', 'වාරිමාර්ග', 'jalaya'],
  weather: ['weather', 'rain', 'sun', 'humidity', 'temperature', 'climate', 'monsoon', 'කාලගුණ', 'වැස්ස', 'kalaguna'],
  organic: ['organic', 'natural', 'compost', 'ජෛව', 'සාම්ප්‍රදායික', 'jaiwa'],
  government: ['government', 'subsidy', 'scheme', 'insurance', 'support', 'රජය', 'සහනාධාර', 'rajaya'],
  yala: ['yala', 'april', 'may', 'june', 'july', 'august', 'dry season', 'යාල', 'yala'],
  maha: ['maha', 'october', 'november', 'december', 'january', 'february', 'wet season', 'මහ'],
  shade: ['shade', 'shadow', 'gliricidia', 'grevillea', 'සෙවන', 'shadow tree', 'shade management'],
  pruning: ['pruning', 'prune', 'trim', 'cut', 'කප්පාදු', 'cutting', 'bush maintenance']
};

// Crop detection patterns
const cropPatterns = {
  rice: ['rice', 'paddy', ' වී', 'හාල්', 'ගොයම'],
  vegetables: ['vegetable', 'veggies', 'එළවලු', 'බෝග'],
  chili: ['chili', 'chilli', 'pepper', 'මිරිස්'],
  tea: ['tea', 'තේ', 'තේ කොළ', 'tea leaf', 'tea plant', 'tea bush'],
  coconut: ['coconut', 'පොල්']
};

// Disease name patterns - includes both rice and tea diseases
const diseasePatterns = {
  // Rice diseases
  blast: ['blast', 'පිපිරුම', 'leaf blast'],
  bacterial_leaf_blight: ['bacterial', 'blight', 'බැක්ටීරියා', 'bacterial leaf'],
  brown_spot: ['brown spot', 'brown', 'දුඹුරු ලප'],
  leaf_smut: ['smut', 'black powder', 'ස්මට්'],
  // Tea diseases
  blister_blight: ['blister', 'blister blight', 'බිබිලි', 'බිබිලි රෝගය'],
  brown_blight: ['brown blight', 'tea brown', 'දුඹුරු පිළිස්සුම'],
  gray_blight: ['gray blight', 'grey blight', 'අළු පිළිස්සුම'],
  red_rust: ['red rust', 'rust', 'රතු මලකඩ', 'මලකඩ']
};

function detectIntent(message) {
  const msg = message.toLowerCase();
  const intents = [];

  // Check for fertilizer intent
  if (synonyms.fertilizer.some(word => msg.includes(word))) {
    intents.push('FERTILIZER');
  }

  // Check for disease intent
  if (synonyms.disease.some(word => msg.includes(word))) {
    intents.push('DISEASE');
  }

  // Check for pest intent
  if (synonyms.pest.some(word => msg.includes(word))) {
    intents.push('PEST');
  }

  // Check for planting intent
  if (synonyms.planting.some(word => msg.includes(word))) {
    intents.push('PLANTING');
  }

  // Check for harvest intent
  if (synonyms.harvest.some(word => msg.includes(word))) {
    intents.push('HARVEST');
  }

  // Check for water/irrigation intent
  if (synonyms.water.some(word => msg.includes(word))) {
    intents.push('WATER');
  }

  // Check for weather intent
  if (synonyms.weather.some(word => msg.includes(word))) {
    intents.push('WEATHER');
  }

  // Check for organic farming intent
  if (synonyms.organic.some(word => msg.includes(word))) {
    intents.push('ORGANIC');
  }

  // Check for government schemes intent
  if (synonyms.government.some(word => msg.includes(word))) {
    intents.push('GOVERNMENT');
  }

  // Check for shade management intent (tea specific)
  if (synonyms.shade.some(word => msg.includes(word))) {
    intents.push('SHADE');
  }

  // Check for pruning intent (tea specific)
  if (synonyms.pruning.some(word => msg.includes(word))) {
    intents.push('PRUNING');
  }

  // Return primary intent or UNKNOWN
  return intents.length > 0 ? intents[0] : 'UNKNOWN';
}

function detectSeason(message) {
  const msg = message.toLowerCase();
  
  if (synonyms.yala.some(word => msg.includes(word))) {
    return 'yala';
  }
  if (synonyms.maha.some(word => msg.includes(word))) {
    return 'maha';
  }
  
  // Default based on current month
  const month = new Date().getMonth();
  // Yala: April-September (3-8), Maha: October-March (9-2)
  return (month >= 3 && month <= 8) ? 'yala' : 'maha';
}

function detectCrop(message) {
  const msg = message.toLowerCase();
  
  for (const [crop, patterns] of Object.entries(cropPatterns)) {
    if (patterns.some(pattern => msg.includes(pattern))) {
      return crop;
    }
  }
  
  return 'rice'; // Default crop
}

function detectDisease(message) {
  const msg = message.toLowerCase();
  
  for (const [disease, patterns] of Object.entries(diseasePatterns)) {
    if (patterns.some(pattern => msg.includes(pattern))) {
      return disease;
    }
  }
  
  return null; // No specific disease detected
}

function detectLanguage(message) {
  // Simple check for Sinhala Unicode characters
  const sinhalaPattern = /[\u0D80-\u0DFF]/;
  return sinhalaPattern.test(message) ? 'si' : 'en';
}

module.exports = {
  detectIntent,
  detectSeason,
  detectCrop,
  detectDisease,
  detectLanguage
};
